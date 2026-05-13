const API = "https://fapi.binance.com";
const STORE = {
  paper: "gainers-lab-v1-paper",
  journal: "gainers-lab-v1-journal",
  selected: "gainers-lab-v1-selected",
  paperChartPair: "gainers-lab-v1-paper-chart-pair",
};

const ui = {
  navButtons: document.querySelectorAll(".nav button"),
  panels: document.querySelectorAll(".view"),
  scanButton: document.getElementById("scanButton"),
  scanStatus: document.getElementById("scanStatus"),
  refreshStatus: document.getElementById("refreshStatus"),
  universeStatus: document.getElementById("universeStatus"),
  selectedSymbol: document.getElementById("selectedSymbol"),
  selectedPrice: document.getElementById("selectedPrice"),
  selectedChange: document.getElementById("selectedChange"),
  gainerList: document.getElementById("gainerList"),
  gainersMeta: document.getElementById("gainersMeta"),
  detailState: document.getElementById("detailState"),
  detailTitle: document.getElementById("detailTitle"),
  scenarioText: document.getElementById("scenarioText"),
  detailMetrics: document.getElementById("detailMetrics"),
  setupGrid: document.getElementById("setupGrid"),
  startPaperButton: document.getElementById("startPaperButton"),
  refreshCoinButton: document.getElementById("refreshCoinButton"),
  chartFrame: document.getElementById("chartFrame"),
  chartMeta: document.getElementById("chartMeta"),
  paperChartFrame: document.getElementById("paperChartFrame"),
  paperChartMeta: document.getElementById("paperChartMeta"),
  waitingMeta: document.getElementById("waitingMeta"),
  activeMeta: document.getElementById("activeMeta"),
  waitingTrades: document.getElementById("waitingTrades"),
  activeTrades: document.getElementById("activeTrades"),
  journalSummary: document.getElementById("journalSummary"),
  journalMeta: document.getElementById("journalMeta"),
  journalTable: document.getElementById("journalTable"),
  clearJournalButton: document.getElementById("clearJournalButton"),
};

let gainers = [];
let selected = null;

function uid(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function fmt(value, digits = 4) {
  if (!Number.isFinite(value)) return "-";
  return value.toLocaleString("en-US", { maximumFractionDigits: digits });
}

function pct(value, digits = 2) {
  if (!Number.isFinite(value)) return "-";
  return `${value >= 0 ? "+" : ""}${value.toFixed(digits)}%`;
}

function movePct(entry, price, side) {
  if (!Number.isFinite(entry) || !Number.isFinite(price) || entry <= 0) return NaN;
  return ((price - entry) / entry) * 100 * (side === "short" ? -1 : 1);
}

function average(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function storeGet(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function storeSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

async function json(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function klines(pair, interval = "15m", limit = 160) {
  const rows = await json(`${API}/fapi/v1/klines?symbol=${pair}&interval=${interval}&limit=${limit}`);
  return rows.map((row) => ({
    time: row[0],
    open: Number(row[1]),
    high: Number(row[2]),
    low: Number(row[3]),
    close: Number(row[4]),
    volume: Number(row[5]),
    takerBuyVolume: Number(row[9]),
  }));
}

async function price(pair) {
  const data = await json(`${API}/fapi/v1/ticker/price?symbol=${pair}`);
  return Number(data.price);
}

function sma(values, period) {
  if (values.length < period) return NaN;
  return average(values.slice(-period));
}

function ema(values, period) {
  if (values.length < period) return NaN;
  const k = 2 / (period + 1);
  let current = average(values.slice(0, period));
  for (let index = period; index < values.length; index += 1) {
    current = values[index] * k + current * (1 - k);
  }
  return current;
}

function atr(candles, period = 14) {
  if (candles.length < period + 1) return NaN;
  const slice = candles.slice(-period);
  const trs = slice.map((candle, index) => {
    const prev = candles[candles.length - period + index - 1];
    return Math.max(candle.high - candle.low, Math.abs(candle.high - prev.close), Math.abs(candle.low - prev.close));
  });
  return average(trs);
}

function vwap(candles, lookback = 48) {
  const slice = candles.slice(-lookback);
  const total = slice.reduce((acc, candle) => {
    const typical = (candle.high + candle.low + candle.close) / 3;
    acc.pv += typical * candle.volume;
    acc.volume += candle.volume;
    return acc;
  }, { pv: 0, volume: 0 });
  return total.volume ? total.pv / total.volume : NaN;
}

function swingLevels(candles, lookback = 96, pivot = 2) {
  const slice = candles.slice(-lookback);
  const highs = [];
  const lows = [];
  for (let index = pivot; index < slice.length - pivot; index += 1) {
    const candle = slice[index];
    const left = slice.slice(index - pivot, index);
    const right = slice.slice(index + 1, index + pivot + 1);
    if (left.every((item) => candle.high >= item.high) && right.every((item) => candle.high >= item.high)) highs.push(candle.high);
    if (left.every((item) => candle.low <= item.low) && right.every((item) => candle.low <= item.low)) lows.push(candle.low);
  }
  return { highs, lows };
}

function nearestBelow(levels, price, fallback) {
  const values = levels.filter((level) => Number.isFinite(level) && level < price).sort((a, b) => b - a);
  return values[0] ?? fallback;
}

function nearestAbove(levels, price, fallback) {
  const values = levels.filter((level) => Number.isFinite(level) && level > price).sort((a, b) => a - b);
  return values[0] ?? fallback;
}

function zoneAround(anchor, atrValue, width = 0.28) {
  return {
    from: Math.max(0, anchor - atrValue * width),
    to: Math.max(0, anchor + atrValue * width),
  };
}

function zoneText(zone) {
  if (!zone) return "-";
  return `${fmt(zone.from)}-${fmt(zone.to)}`;
}

function chartUrl(pair, interval = "15") {
  return `https://www.tradingview.com/widgetembed/?symbol=${encodeURIComponent(`BINANCE:${pair}.P`)}&interval=${interval}&hidesidetoolbar=1&symboledit=0&saveimage=0&toolbarbg=0f1113&studies=[]&theme=dark&style=1&timezone=Europe%2FBratislava&withdateranges=1&hideideas=1`;
}

function syncChart(pair) {
  if (!pair) return;
  const url = chartUrl(pair);
  if (ui.chartFrame && ui.chartFrame.dataset.url !== url) {
    ui.chartFrame.dataset.url = url;
    ui.chartFrame.src = url;
  }
  if (ui.chartMeta) ui.chartMeta.textContent = `${pair} | 15m`;
  if (ui.paperChartFrame && ui.paperChartFrame.dataset.url !== url) {
    ui.paperChartFrame.dataset.url = url;
    ui.paperChartFrame.src = url;
  }
  if (ui.paperChartMeta) ui.paperChartMeta.textContent = `${pair} | 15m`;
}

function classifyScenario(data) {
  const { last, rangeHigh, rangeLow, atrNow, vwapNow, volumeRatio, extensionAtr, ma7, ma25 } = data;
  const nearHighAtr = atrNow ? (rangeHigh - last.close) / atrNow : 0;
  const aboveTrend = last.close >= vwapNow && ma7 >= ma25;

  if (extensionAtr >= 2.6 && nearHighAtr <= 0.7) return "Too hot / top watch";
  if (extensionAtr >= 1.7 && volumeRatio < 0.9) return "Top rejection short";
  if (aboveTrend && extensionAtr <= 1.25 && last.close >= ma25) return "Pullback long";
  if (last.close >= rangeHigh - atrNow * 0.35 && volumeRatio >= 1.15) return "Breakout retest";
  if ((last.close - rangeLow) / (rangeHigh - rangeLow || 1) < 0.35) return "Range low bounce";
  return "Range after pump";
}

function scenarioPlan(data, scenario) {
  const { last, atrNow, vwapNow, ma7, ma25, rangeHigh, rangeLow, levels } = data;
  const priceNow = last.close;
  const side = scenario.includes("Short") || scenario.includes("top") ? "short" : "long";
  const supports = [...levels.lows, rangeLow, vwapNow, ma25, ma7].filter(Number.isFinite);
  const resistances = [...levels.highs, rangeHigh].filter(Number.isFinite);

  if (scenario === "Top rejection short" || scenario === "Too hot / top watch") {
    const entryAnchor = Math.max(nearestAbove(resistances, priceNow, rangeHigh), priceNow);
    const entryZone = zoneAround(entryAnchor, atrNow, 0.35);
    const stop = entryZone.to + atrNow * 0.65;
    const tp1 = nearestBelow([vwapNow, ma25, ...supports], entryZone.from, priceNow - atrNow * 1.2);
    const tp2 = nearestBelow([ma25, rangeLow, ...supports], tp1, priceNow - atrNow * 2.0);
    const tp3 = Math.max(0, nearestBelow([rangeLow, ...supports], tp2, priceNow - atrNow * 3.0));
    return { side: "short", entry: (entryZone.from + entryZone.to) / 2, entryZone, stop, targets: [tp1, tp2, tp3], invalidation: "15m close nad high/reject zónou.", note: "Short iba po jasnom odmietnutí vrchu. Bez rejectu je to iba watch." };
  }

  const entryAnchor = nearestBelow([vwapNow, ma25, ma7, ...supports], priceNow, priceNow - atrNow * 0.8);
  const entryZone = zoneAround(entryAnchor, atrNow, scenario === "Breakout retest" ? 0.22 : 0.35);
  const structuralLow = nearestBelow([rangeLow, ...supports], entryZone.from, entryZone.from - atrNow);
  const stop = Math.max(0, structuralLow - atrNow * 0.45);
  const tp1 = nearestAbove([rangeHigh, ...resistances], entryZone.to, priceNow + atrNow * 1.2);
  const tp2 = Math.max(tp1 + atrNow * 0.7, entryZone.to + Math.abs(entryZone.to - stop) * 1.8);
  const tp3 = Math.max(tp2 + atrNow * 0.8, entryZone.to + Math.abs(entryZone.to - stop) * 2.6);
  return { side, entry: (entryZone.from + entryZone.to) / 2, entryZone, stop, targets: [tp1, tp2, tp3], invalidation: "Strata štrukturálneho low alebo návrat pod VWAP bez reakcie.", note: "Long až pri reakcii na pullback/retest. Pumpovaný coin nebrať uprostred range." };
}

function analyzeGainer(ticker, candles) {
  const closes = candles.map((candle) => candle.close);
  const last = candles.at(-1);
  const atrNow = atr(candles);
  const vwapNow = vwap(candles);
  const ma7 = sma(closes, 7);
  const ma25 = sma(closes, 25);
  const ma99 = sma(closes, 99);
  const recent = candles.slice(-96);
  const rangeHigh = Math.max(...recent.map((candle) => candle.high));
  const rangeLow = Math.min(...recent.map((candle) => candle.low));
  const avgVolume = average(candles.slice(-21, -1).map((candle) => candle.volume));
  const volumeRatio = avgVolume ? last.volume / avgVolume : 1;
  const extensionAtr = atrNow ? Math.abs(last.close - vwapNow) / atrNow : 0;
  const levels = swingLevels(candles);
  const scenario = classifyScenario({ last, rangeHigh, rangeLow, atrNow, vwapNow, volumeRatio, extensionAtr, ma7, ma25 });
  const plan = scenarioPlan({ last, atrNow, vwapNow, ma7, ma25, ma99, rangeHigh, rangeLow, levels }, scenario);
  const state = scenario.includes("Too hot") ? "watch only" : extensionAtr <= 1.25 ? "near zone" : "forming";

  return {
    id: ticker.symbol,
    pair: ticker.symbol,
    price: last.close,
    dayChange: Number(ticker.priceChangePercent),
    quoteVolume: Number(ticker.quoteVolume),
    candles,
    atr: atrNow,
    atrPct: atrNow ? (atrNow / last.close) * 100 : NaN,
    vwap: vwapNow,
    ma7,
    ma25,
    ma99,
    rangeHigh,
    rangeLow,
    volumeRatio,
    extensionAtr,
    scenario,
    state,
    plan,
  };
}

function scenarioTone(scenario) {
  if (scenario.includes("Too hot")) return "bad";
  if (scenario.includes("Short")) return "warn";
  if (scenario.includes("long") || scenario.includes("bounce") || scenario.includes("Breakout")) return "good";
  return "neutral";
}

function scenarioSide(scenario, plan = null) {
  if (plan?.side) return plan.side;
  if (scenario.includes("Short") || scenario.includes("top")) return "short";
  if (scenario.includes("long") || scenario.includes("bounce") || scenario.includes("Breakout")) return "long";
  return "watch";
}

function scenarioText(item) {
  if (!item) return "-";
  const p = item.plan;
  if (item.scenario === "Pullback long") return "Trend stále žije, ale vstup dáva zmysel až pri pullbacku do VWAP/MA/support zóny.";
  if (item.scenario === "Breakout retest") return "Cena tlačí high. Nehnať breakout, čakať retest predošlého high alebo VWAP zóny.";
  if (item.scenario === "Top rejection short") return "Coin je po pumpe vysoko. Short len po odmietnutí high, stop až za štruktúrou.";
  if (item.scenario === "Too hot / top watch") return "Príliš natiahnuté. Bez reakcie na vrchu je to watch, nie obchod.";
  if (item.scenario === "Range low bounce") return "Po pumpe sa tvorí range. Obchodovať iba spodnú/hraničnú reakciu, nie stred.";
  return p.note;
}

function selectGainer(pair) {
  selected = gainers.find((item) => item.pair === pair) || gainers[0] || null;
  if (!selected) return;
  localStorage.setItem(STORE.selected, selected.pair);
  ui.selectedSymbol.textContent = `${selected.pair} live`;
  ui.selectedPrice.textContent = fmt(selected.price);
  ui.selectedChange.textContent = `${pct(selected.dayChange)} 24h`;
  ui.selectedChange.className = selected.dayChange >= 0 ? "positive" : "negative";
  ui.detailState.textContent = selected.state;
  ui.detailTitle.textContent = `${selected.pair} | ${selected.scenario}`;
  ui.scenarioText.textContent = scenarioText(selected);
  ui.detailMetrics.innerHTML = `
    <span>Live <b>${fmt(selected.price)}</b></span>
    <span>24h <b class="positive">${pct(selected.dayChange)}</b></span>
    <span>VWAP ext <b>${fmt(selected.extensionAtr, 2)} ATR</b></span>
    <span>ATR <b>${pct(selected.atrPct)}</b></span>
    <span>Volume <b>${fmt(selected.volumeRatio, 2)}x</b></span>
    <span>Range <b>${fmt(selected.rangeLow)} / ${fmt(selected.rangeHigh)}</b></span>
  `;
  const p = selected.plan;
  const targetHtml = p.targets.map((target, index) => `
    <span>TP${index + 1}<b>${fmt(target)} <em class="positive">${pct(movePct(p.entry, target, p.side))}</em></b></span>
  `).join("");
  ui.setupGrid.innerHTML = `
    <article class="setup-card">
      <div class="panel-head">
        <strong>${p.side.toUpperCase()} scenár</strong>
        <span>${selected.state}</span>
      </div>
      <p>${p.note}</p>
      <div class="setup-levels">
        <span>Entry zóna <b>${zoneText(p.entryZone)}</b></span>
        <span>Mid entry <b>${fmt(p.entry)}</b></span>
        <span>Štrukturálny SL <b class="negative">${fmt(p.stop)} ${pct(movePct(p.entry, p.stop, p.side))}</b></span>
        ${targetHtml}
      </div>
      <p class="muted">Invalidácia: ${p.invalidation}</p>
    </article>
  `;
  syncChart(selected.pair);
  renderGainers();
}

function renderGainers() {
  ui.gainersMeta.textContent = `${gainers.length} live gainers`;
  if (!gainers.length) {
    ui.gainerList.innerHTML = `<p class="muted">Žiadne dáta. Spusti Scan Live.</p>`;
    return;
  }
  ui.gainerList.innerHTML = gainers.map((item) => `
    <article class="gainer-card ${scenarioSide(item.scenario, item.plan)} ${selected?.pair === item.pair ? "active" : ""}" data-pair="${item.pair}">
      <div class="gainer-head">
        <strong>${item.pair}</strong>
        <div class="badge-row">
          <span class="side-chip ${scenarioSide(item.scenario, item.plan)}">${scenarioSide(item.scenario, item.plan).toUpperCase()}</span>
          <span class="badge ${scenarioTone(item.scenario)}">${item.scenario}</span>
        </div>
      </div>
      <p>${scenarioText(item)}</p>
      <div class="metric-list">
        <span>Live <b>${fmt(item.price)}</b></span>
        <span>24h <b class="positive">${pct(item.dayChange)}</b></span>
        <span>ATR <b>${pct(item.atrPct)}</b></span>
        <span>Vol <b>${fmt(item.volumeRatio, 2)}x</b></span>
        <span>VWAP <b>${fmt(item.extensionAtr, 2)} ATR</b></span>
      </div>
    </article>
  `).join("");
  ui.gainerList.querySelectorAll(".gainer-card").forEach((card) => {
    card.addEventListener("click", () => selectGainer(card.dataset.pair));
  });
}

async function scanLive() {
  ui.scanButton.disabled = true;
  ui.scanStatus.textContent = "Načítavam top futures gainers a 15m sviečky...";
  ui.refreshStatus.textContent = "running";
  try {
    const all = await json(`${API}/fapi/v1/ticker/24hr`);
    const top = all
      .filter((item) => item.symbol.endsWith("USDT") && Number(item.priceChangePercent) > 0)
      .sort((a, b) => Number(b.priceChangePercent) - Number(a.priceChangePercent))
      .slice(0, 10);
    const analyses = await Promise.allSettled(top.map(async (ticker) => analyzeGainer(ticker, await klines(ticker.symbol, "15m"))));
    gainers = analyses.filter((result) => result.status === "fulfilled").map((result) => result.value);
    const preferred = localStorage.getItem(STORE.selected);
    selected = gainers.find((item) => item.pair === preferred) || gainers[0] || null;
    renderGainers();
    if (selected) selectGainer(selected.pair);
    ui.scanStatus.textContent = `Live scan hotový: ${gainers.length} top gainers.`;
    ui.refreshStatus.textContent = new Date().toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit" });
  } catch (error) {
    ui.scanStatus.textContent = `Live scan zlyhal: ${error.message}`;
    ui.refreshStatus.textContent = "error";
  } finally {
    ui.scanButton.disabled = false;
  }
}

function paperState() {
  return storeGet(STORE.paper, { waiting: [], active: [] });
}

function savePaper(state) {
  storeSet(STORE.paper, state);
}

function journal() {
  return storeGet(STORE.journal, []);
}

function saveJournal(entries) {
  storeSet(STORE.journal, entries);
}

function startPaper() {
  if (!selected) return;
  const p = selected.plan;
  const state = paperState();
  state.waiting.unshift({
    id: uid("paper"),
    pair: selected.pair,
    side: p.side,
    scenario: selected.scenario,
    entry: p.entry,
    entryZone: p.entryZone,
    stop: p.stop,
    targets: p.targets.map((price, index) => ({ label: `TP${index + 1}`, price, hit: false })),
    createdAt: new Date().toISOString(),
    status: "waiting",
  });
  savePaper(state);
  renderPaper();
  setView("paper");
}

function hitEntry(trade, current) {
  const from = Math.min(trade.entryZone.from, trade.entryZone.to);
  const to = Math.max(trade.entryZone.from, trade.entryZone.to);
  return current >= from && current <= to;
}

function updateTradeTargets(trade, current) {
  let changed = false;
  trade.targets.forEach((target) => {
    if (target.hit) return;
    if (trade.side === "long" ? current >= target.price : current <= target.price) {
      target.hit = true;
      target.hitAt = new Date().toISOString();
      changed = true;
    }
  });
  return changed;
}

function journalEntryFromTrade(trade, exit, reason, status = "closed") {
  const hitTargets = trade.targets.filter((target) => target.hit);
  const lastTarget = hitTargets.at(-1);
  const resultPct = lastTarget ? movePct(trade.entry, lastTarget.price, trade.side) : movePct(trade.entry, exit, trade.side);
  return {
    id: trade.journalId || uid("journal"),
    tradeId: trade.id,
    pair: trade.pair,
    side: trade.side,
    scenario: trade.scenario,
    entry: trade.entry,
    exit,
    reason,
    status,
    tpHit: hitTargets.map((target) => target.label).join(", ") || "nie",
    resultPct,
    outcome: status === "running" ? "Running" : hitTargets.length ? "Win" : reason === "Final TP" ? "Win" : "Loss",
    closedAt: status === "closed" ? new Date().toISOString() : null,
    updatedAt: new Date().toISOString(),
  };
}

function upsertJournalEntry(entry) {
  const rows = journal();
  const index = rows.findIndex((row) => row.tradeId === entry.tradeId);
  if (index >= 0) rows[index] = { ...rows[index], ...entry, id: rows[index].id };
  else rows.unshift(entry);
  saveJournal(rows);
}

async function updatePaper() {
  const state = paperState();
  if (!state.waiting.length && !state.active.length) return;
  const pairs = [...new Set([...state.waiting, ...state.active].map((trade) => trade.pair))];
  const priceMap = {};
  await Promise.allSettled(pairs.map(async (pair) => { priceMap[pair] = await price(pair); }));
  const nextWaiting = [];
  const nextActive = [];

  state.waiting.forEach((trade) => {
    const current = priceMap[trade.pair];
    if (!Number.isFinite(current)) {
      nextWaiting.push(trade);
      return;
    }
    trade.live = current;
    if (hitEntry(trade, current)) {
      nextActive.push({
        ...trade,
        status: "active",
        entry: current,
        originalStop: trade.originalStop ?? trade.stop,
        openedAt: new Date().toISOString(),
      });
    } else {
      nextWaiting.push(trade);
    }
  });

  state.active.forEach((trade) => {
    const current = priceMap[trade.pair];
    if (!Number.isFinite(current)) {
      nextActive.push(trade);
      return;
    }
    trade.live = current;
    const targetChanged = updateTradeTargets(trade, current);
    const hitTargets = trade.targets.filter((target) => target.hit);
    if (targetChanged && hitTargets.length) {
      trade.stop = trade.entry;
      trade.breakEven = true;
      upsertJournalEntry(journalEntryFromTrade(trade, hitTargets.at(-1).price, "TP running / SL na entry", "running"));
    }
    const hitStop = trade.side === "long" ? current <= trade.stop : current >= trade.stop;
    const finalTarget = trade.targets.at(-1);
    const hitFinal = finalTarget?.hit;
    if (hitStop || hitFinal) {
      upsertJournalEntry(journalEntryFromTrade(trade, current, hitFinal ? "Final TP" : "SL"));
    } else {
      nextActive.push(trade);
    }
  });

  savePaper({ waiting: nextWaiting, active: nextActive });
  renderPaper();
  renderJournal();
}

function cancelWaiting(id) {
  const state = paperState();
  savePaper({ ...state, waiting: state.waiting.filter((trade) => trade.id !== id) });
  renderPaper();
}

function tradeCard(trade, active = false) {
  const live = Number(trade.live);
  const currentPct = Number.isFinite(live) ? movePct(trade.entry, live, trade.side) : NaN;
  const targets = trade.targets.map((target) => {
    const hitClass = target.hit ? "tp-hit" : "";
    const cls = target.hit ? "positive" : "";
    return `<span class="${hitClass}">${target.label} <b class="${cls}">${fmt(target.price)} ${pct(movePct(trade.entry, target.price, trade.side))}</b></span>`;
  }).join("");
  return `
    <article class="trade-card ${active ? "active" : "waiting"} ${trade.side}" data-pair="${trade.pair}">
      <div class="trade-head">
        <strong>${trade.pair} ${trade.side.toUpperCase()}</strong>
        <span class="badge ${active ? "good" : "neutral"}">${active ? "active" : "waiting"}</span>
      </div>
      <p>${trade.scenario}</p>
      <div class="metric-list">
        <span>Entry <b>${active ? fmt(trade.entry) : zoneText(trade.entryZone)}</b></span>
        <span>Live <b>${fmt(live)}</b></span>
        <span>Now <b class="${currentPct >= 0 ? "positive" : "negative"}">${pct(currentPct)}</b></span>
        <span class="${trade.breakEven ? "tp-hit" : ""}">SL <b class="${trade.breakEven ? "positive" : "negative"}">${fmt(trade.stop)} ${pct(movePct(trade.entry, trade.stop, trade.side))}${trade.breakEven ? " BE" : ""}</b></span>
        ${targets}
      </div>
      ${active ? "" : `<div class="trade-actions"><button class="secondary cancel-waiting" data-id="${trade.id}" type="button">Zrušiť nenaplnený</button></div>`}
    </article>
  `;
}

function renderPaper() {
  const state = paperState();
  const availablePairs = new Set([...state.active, ...state.waiting].map((trade) => trade.pair));
  const pinnedPair = localStorage.getItem(STORE.paperChartPair);
  const chartTrade = state.active[0] || state.waiting[0];
  const chartPair = pinnedPair && availablePairs.has(pinnedPair) ? pinnedPair : chartTrade?.pair;
  if (chartPair) syncChart(chartPair);
  ui.waitingMeta.textContent = `${state.waiting.length} waiting`;
  ui.activeMeta.textContent = `${state.active.length} active`;
  ui.waitingTrades.innerHTML = state.waiting.length ? state.waiting.map((trade) => tradeCard(trade, false)).join("") : `<p class="muted">Žiadne čakajúce scenáre.</p>`;
  ui.activeTrades.innerHTML = state.active.length ? state.active.map((trade) => tradeCard(trade, true)).join("") : `<p class="muted">Žiadne aktívne paper trades.</p>`;
  document.querySelectorAll(".trade-card[data-pair]").forEach((card) => {
    card.addEventListener("click", () => {
      localStorage.setItem(STORE.paperChartPair, card.dataset.pair);
      syncChart(card.dataset.pair);
      const found = gainers.find((item) => item.pair === card.dataset.pair);
      if (found) selectGainer(found.pair);
    });
  });
  ui.waitingTrades.querySelectorAll(".cancel-waiting").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      cancelWaiting(button.dataset.id);
    });
  });
}

function renderJournal() {
  const rows = journal();
  const closedRows = rows.filter((row) => row.status !== "running");
  const wins = closedRows.filter((row) => row.outcome === "Win").length;
  const avg = closedRows.length ? average(closedRows.map((row) => Number(row.resultPct) || 0)) : 0;
  const tpBeforeSl = closedRows.filter((row) => row.tpHit !== "nie" && row.reason === "SL").length;
  const byScenario = closedRows.reduce((acc, row) => {
    acc[row.scenario] = acc[row.scenario] || { total: 0, wins: 0 };
    acc[row.scenario].total += 1;
    if (row.outcome === "Win") acc[row.scenario].wins += 1;
    return acc;
  }, {});
  const best = Object.entries(byScenario).sort((a, b) => (b[1].wins / b[1].total) - (a[1].wins / a[1].total))[0];
  ui.journalMeta.textContent = `${closedRows.length} closed | ${rows.length - closedRows.length} running`;
  ui.journalSummary.innerHTML = `
    <article><span>Winrate</span><strong>${closedRows.length ? Math.round((wins / closedRows.length) * 100) : 0}%</strong></article>
    <article><span>Wins / Losses</span><strong>${wins} / ${closedRows.length - wins}</strong></article>
    <article><span>Avg real %</span><strong class="${avg >= 0 ? "positive" : "negative"}">${pct(avg)}</strong></article>
    <article><span>TP pred SL</span><strong>${tpBeforeSl}</strong></article>
    <article><span>Najlepší scenár</span><strong>${best ? best[0] : "-"}</strong></article>
  `;
  const grouped = rows.reduce((acc, row) => {
    const stamp = row.closedAt || row.updatedAt || new Date().toISOString();
    const key = new Date(stamp).toLocaleDateString("sk-SK", { year: "numeric", month: "2-digit", day: "2-digit" });
    acc[key] = acc[key] || [];
    acc[key].push(row);
    return acc;
  }, {});
  ui.journalTable.innerHTML = Object.entries(grouped).map(([day, dayRows]) => {
    const dayClosed = dayRows.filter((row) => row.status !== "running");
    const dayWins = dayClosed.filter((row) => row.outcome === "Win").length;
    const dayAvg = dayClosed.length ? average(dayClosed.map((row) => Number(row.resultPct) || 0)) : 0;
    return `
      <div class="journal-day">
        <div>
          <strong>${day}</strong>
          <span>${dayClosed.length} closed | ${dayRows.length - dayClosed.length} running | WR ${dayClosed.length ? Math.round((dayWins / dayClosed.length) * 100) : 0}% | avg ${pct(dayAvg)}</span>
        </div>
      </div>
      <div class="journal-row journal-head"><span>Coin</span><span>Side</span><span>Scenario</span><span>Entry</span><span>Exit</span><span>TP hit</span><span>Result</span><span>Status</span></div>
      ${dayRows.map((row) => `
      <div class="journal-row ${row.status === "running" ? "running" : ""}">
        <span>${row.pair}</span>
        <span>${row.side}</span>
        <span>${row.scenario}</span>
        <span>${fmt(row.entry)}</span>
        <span>${fmt(row.exit)}</span>
        <span>${row.tpHit}</span>
        <span class="${row.resultPct >= 0 ? "positive" : "negative"}">${pct(row.resultPct)}</span>
        <span class="${row.outcome === "Win" || row.outcome === "Running" ? "positive" : "negative"}">${row.outcome} | ${row.reason}</span>
      </div>
    `).join("")}
    `;
  }).join("") || `<p class="muted">Journal je zatiaľ prázdny.</p>`;
}

function setView(view) {
  ui.navButtons.forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  ui.panels.forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === view));
}

ui.navButtons.forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
ui.scanButton.addEventListener("click", scanLive);
ui.startPaperButton.addEventListener("click", startPaper);
ui.refreshCoinButton.addEventListener("click", async () => {
  if (!selected) return;
  const ticker = await json(`${API}/fapi/v1/ticker/24hr?symbol=${selected.pair}`);
  const updated = analyzeGainer(ticker, await klines(selected.pair, "15m"));
  gainers = gainers.map((item) => item.pair === updated.pair ? updated : item);
  selectGainer(updated.pair);
});
ui.clearJournalButton.addEventListener("click", () => {
  saveJournal([]);
  renderJournal();
});

setInterval(updatePaper, 8000);
renderPaper();
renderJournal();
scanLive();
