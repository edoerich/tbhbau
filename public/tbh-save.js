// tbh-save.js — leitura READ-ONLY do baú do TBH, 100% no navegador.
// Porte de tbh-save.mjs (Node) para Web Crypto. O save NUNCA sai do PC do usuário.
const TBH_APPID = 3678970;

const GRADE_MAP = {
  COSMIC: 'Cosmic', DIVINE: 'Divine', CELESTIAL: 'Celestial', ARCANA: 'Arcana',
  IMMORTAL: 'Immortal', LEGENDARY: 'Legendary', BEYOND: 'Beyond', EPIC: 'Epic',
  RARE: 'Rare', UNCOMMON: 'Uncommon', COMMON: 'Common',
};

// ── Decifragem Easy Save 3 (AES-128-CBC + PBKDF2-SHA1, gunzip opcional) ──────
// Byte-idêntico ao caminho Node (crypto.pbkdf2Sync + aes-128-cbc + zlib.gunzip): verificado.
export async function decryptES3(bytes, password) {
  const iv = bytes.slice(0, 16);
  const data = bytes.slice(16);
  const pwKey = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const keyBits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: iv, iterations: 100, hash: 'SHA-1' }, pwKey, 128);
  const aesKey = await crypto.subtle.importKey('raw', keyBits, { name: 'AES-CBC' }, false, ['decrypt']);
  let out = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-CBC', iv }, aesKey, data));
  if (out[0] === 0x1f && out[1] === 0x8b) { // gzip magic
    const ds = new DecompressionStream('gzip');
    out = new Uint8Array(await new Response(new Blob([out]).stream().pipeThrough(ds)).arrayBuffer());
  }
  return out;
}

const asArr = v => (typeof v === 'string' ? JSON.parse(v) : v);
const titleToken = s => { const t = String(s || '').trim(); return t ? t[0].toUpperCase() + t.slice(1).toLowerCase() : ''; };
const boolTrue = v => String(v || '').toLowerCase() === 'true';

function nameFromNameKey(row, names) {
  if (!row) return null;
  if (names[row.ItemKey]) return names[row.ItemKey];
  const m = String(row.NameKey || '').match(/\d+/);
  return m ? (names[m[0]] || null) : null;
}
const gearTypeText = row => `${titleToken(row.GEARTYPE)} - Lv. ${row.Level}`;

function gearMarketHash(row, names) {
  if (!row?.GEARTYPE || !row?.GRADE || !row?.Level) return null;
  if (!boolTrue(row.IsCanExchangeMarketable)) return null;
  const baseName = nameFromNameKey(row, names);
  if (!baseName) return null;
  const grade = GRADE_MAP[String(row.GRADE).toUpperCase()] || titleToken(row.GRADE);
  return `${baseName} (${grade}) A`; // sufixo A = linha marketable atual do TBH
}

function syntheticGearMarketItem(row, names) {
  const hash = gearMarketHash(row, names);
  if (!hash) return null;
  return {
    name: hash, hash, usdCents: 0, brlCents: 0, listings: 0,
    buyCents: null, buyCount: 0, liquidez: 'nenhuma', minSellCents: null,
    type: gearTypeText(row), color: '', icon: '',
    url: `https://steamcommunity.com/market/listings/${TBH_APPID}/${encodeURIComponent(hash)}`,
    hasMarketListing: false,
  };
}

// Índice do mercado por (GEARTYPE|GRADE|Level) — equipamentos.
function buildMarketIndex(marketItems) {
  const idx = {};
  for (const m of marketItems) {
    const tm = m.type && m.type.match(/^(\w+)\s*-\s*Lv\.?\s*(\d+)/);
    const gm = (m.name.match(/\((\w+)\)/) || [])[1];
    if (tm && gm) idx[`${tm[1]}|${gm}|${tm[2]}`.toUpperCase()] = m;
  }
  return idx;
}
// Índice do mercado por nome lowercase — materiais.
function buildMarketByName(marketItems) {
  const idx = {};
  for (const m of marketItems) idx[m.name.toLowerCase()] = m;
  return idx;
}

// table: array de rows da tabela mestra · names: {ItemKey: nome} · marketItems: snapshot do mercado.
// Retorna o baú agregado por hash de mercado com preços e totais (em centavos USD).
export function readStash(saveBytesUtf8, tableArr, names, marketItems) {
  const root = JSON.parse(saveBytesUtf8);
  const psd = JSON.parse(root.PlayerSaveData.value);

  const table = {};
  for (const r of tableArr || []) if (r?.ItemKey) table[r.ItemKey] = r;

  const items = asArr(psd.itemSaveDatas);
  const byId = {}; for (const it of items) byId[it.UniqueId] = it;
  const slotRefs = [
    ...asArr(psd.stashSaveDatas).map(s => ({ ...s, where: 'stash' })),
    ...asArr(psd.inventorySaveDatas).map(s => ({ ...s, where: 'inventory' })),
  ].filter(s => s.ItemUniqueId && String(s.ItemUniqueId) !== '0');

  const seen = new Set();
  let duplicateSlotRefsIgnored = 0;
  const slots = [];
  for (const slot of slotRefs) {
    const id = String(slot.ItemUniqueId);
    if (seen.has(id)) { duplicateSlotRefsIgnored++; continue; }
    seen.add(id); slots.push(slot);
  }

  const mkidx = buildMarketIndex(marketItems);
  const mkByName = buildMarketByName(marketItems);

  const agg = {};
  // totais por moeda: { usd, brl } em centavos
  const total = { usd: 0, brl: 0 }, gear = { usd: 0, brl: 0 }, mat = { usd: 0, brl: 0 };
  let unpriced = 0, unlisted = 0;
  const pricedTypes = { usd: 0, brl: 0 }; // tipos com preço em cada moeda (BRL pode estar pendente)
  let ownedGear = 0, ownedMat = 0, ownedOther = 0;
  const unknown = {}, unlistedSummary = {};

  for (const slot of slots) {
    const it = byId[slot.ItemUniqueId];
    if (!it) continue;
    const r = table[it.ItemKey];
    const localizedName = names[it.ItemKey];
    let m = null, kind = null;

    if (r && r.GEARTYPE && r.Level) ownedGear++;
    else if (localizedName) ownedMat++;
    else ownedOther++;

    // 1) equipamento: casa por (geartype|grade|level), senão pelo gearHash, senão sintético
    if (r && r.GEARTYPE && r.Level) {
      const gearHash = gearMarketHash(r, names);
      m = mkidx[`${r.GEARTYPE}|${r.GRADE}|${r.Level}`.toUpperCase()]
        || (gearHash ? mkByName[gearHash.toLowerCase()] : null)
        || syntheticGearMarketItem(r, names);
      kind = 'gear';
    }
    // 2) material: casa por nome localizado
    if (!m && localizedName) { m = mkByName[localizedName.toLowerCase()]; if (m) kind = 'material'; }

    if (m) {
      const k = m.hash;
      const usd = m.usdCents ?? 0, brl = m.brlCents ?? null;
      if (!agg[k]) agg[k] = {
        name: m.name, hash: m.hash, usdCents: usd, brlCents: brl,
        buyCents: m.buyCents ?? null, buyCount: m.buyCount ?? 0, liquidez: m.liquidez ?? null, minSellCents: m.minSellCents ?? null,
        type: m.type, icon: m.icon, color: m.color,
        url: m.url || `https://steamcommunity.com/market/listings/${TBH_APPID}/${encodeURIComponent(m.hash)}`,
        qty: 0, kind, hasMarketListing: m.hasMarketListing !== false,
      };
      agg[k].qty++;
    } else {
      unpriced++;
      const label = localizedName || (r ? `${r.GEARTYPE || r.ITEMTYPE} ${r.GRADE} Lv${r.Level}`.trim() : `ItemKey ${it.ItemKey}`);
      unknown[label] = (unknown[label] || 0) + 1;
    }
  }

  // soma totais por moeda a partir do agregado (qty × preço de cada item)
  let instantTotalBrl = 0; // valor de VENDA IMEDIATA total (ordens de compra, R$)
  for (const a of Object.values(agg)) {
    if (a.buyCents != null && a.buyCount) instantTotalBrl += a.buyCents * a.qty;
    if (a.hasMarketListing === false) { unlisted += a.qty; unlistedSummary[a.name] = (unlistedSummary[a.name] || 0) + a.qty; continue; }
    if (a.usdCents != null) { total.usd += a.usdCents * a.qty; pricedTypes.usd++; (a.kind === 'material' ? mat : gear).usd += a.usdCents * a.qty; }
    if (a.brlCents != null) { total.brl += a.brlCents * a.qty; pricedTypes.brl++; (a.kind === 'material' ? mat : gear).brl += a.brlCents * a.qty; }
  }

  const list = Object.values(agg).sort((a, b) => (b.usdCents || 0) * b.qty - (a.usdCents || 0) * a.qty);
  return {
    total, gear, mat, // { usd, brl } em centavos
    instantTotalBrl, // venda imediata total (R$, ordens de compra)
    totalItems: slots.length, slotRefs: slotRefs.length, duplicateSlotRefsIgnored,
    ownedGearItems: ownedGear, ownedMaterialItems: ownedMat, ownedOtherItems: ownedOther,
    pricedTypes, unlistedItems: unlisted, unpricedItems: unpriced, types: list.length,
    items: list,
    unlistedSummary: Object.entries(unlistedSummary).sort((a, b) => b[1] - a[1]).slice(0, 30).map(([k, n]) => ({ label: k, qty: n })),
    unknownSummary: Object.entries(unknown).sort((a, b) => b[1] - a[1]).slice(0, 30).map(([k, n]) => ({ label: k, qty: n })),
  };
}
