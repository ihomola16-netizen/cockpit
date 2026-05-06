const ui = {
  symbolInput: document.getElementById("symbolInput"),
  styleSelect: document.getElementById("styleSelect"),
  refreshButton: document.getElementById("refreshButton"),
  refreshMtfButton: document.getElementById("refreshMtfButton"),
  marketTitle: document.getElementById("marketTitle"),
  marketSummary: document.getElementById("marketSummary"),
  regimeStamp: document.getElementById("regimeStamp"),
  btcRegime: document.getElementById("btcRegime"),
  ethRegime: document.getElementById("ethRegime"),
  topRegime: document.getElementById("topRegime"),
  coinAnalysisMeta: document.getElementById("coinAnalysisMeta"),
  coinAnalysisGrid: document.getElementById("coinAnalysisGrid"),
  coinAnalysisSummary: document.getElementById("coinAnalysisSummary"),
  chartMeta: document.getElementById("chartMeta"),
  priceChart: document.getElementById("priceChart"),
  chartTooltip: document.getElementById("chartTooltip"),
  mtf15: document.getElementById("mtf15"),
  mtf15Text: document.getElementById("mtf15Text"),
  mtf1h: document.getElementById("mtf1h"),
  mtf1hText: document.getElementById("mtf1hText"),
  mtf4h: document.getElementById("mtf4h"),
  mtf4hText: document.getElementById("mtf4hText"),
  mtfSummary: document.getElementById("mtfSummary"),
  scanThreshold: document.getElementById("scanThreshold"),
  scanButton: document.getElementById("scanButton"),
  scanStatus: document.getElementById("scanStatus"),
  signalList: document.getElementById("signalList"),
  signalDetail: document.getElementById("signalDetail"),
  signalDetailStatus: document.getElementById("signalDetailStatus"),
  scannerAnalysisMeta: document.getElementById("scannerAnalysisMeta"),
  scannerAnalysisGrid: document.getElementById("scannerAnalysisGrid"),
  scannerAnalysisSummary: document.getElementById("scannerAnalysisSummary"),
  paperTriggers: document.getElementById("paperTriggers"),
  paperTrades: document.getElementById("paperTrades"),
  paperStats: document.getElementById("paperStats"),
  addRealTradeButton: document.getElementById("addRealTradeButton"),
  realSymbol: document.getElementById("realSymbol"),
  realSide: document.getElementById("realSide"),
  realEntry: document.getElementById("realEntry"),
  realMargin: document.getElementById("realMargin"),
  realLeverage: document.getElementById("realLeverage"),
  realStop: document.getElementById("realStop"),
  realTarget: document.getElementById("realTarget"),
  realTrades: document.getElementById("realTrades"),
  clearPaperButton: document.getElementById("clearPaperButton"),
  journalStats: document.getElementById("journalStats"),
  journalList: document.getElementById("journalList"),
};

const STORAGE = {
  paperTriggers: "cockpit-v2-paper-triggers",
  paperTrades: "cockpit-v2-paper-trades",
  realTrades: "cockpit-v2-real-trades",
};

const FALLBACK_SCAN_SYMBOLS = [
  "BTCUSDT","ETHUSDT","SOLUSDT","BNBUSDT","XRPUSDT","DOGEUSDT","ADAUSDT","AVAXUSDT","LINKUSDT","SUIUSDT",
  "NEARUSDT","INJUSDT","APTUSDT","ENAUSDT","ARBUSDT","OPUSDT","TIAUSDT","SEIUSDT","WIFUSDT","PEPEUSDT"
];
let scanSymbolsCache = [];

const STYLE_TF = {
  scalp: { context: "15m", setup: "5m", trigger: "1m", minGap: 18 },
  intraday: { context: "1h", setup: "15m", trigger: "5m", minGap: 25 },
  swing: { context: "4h", setup: "1h", trigger: "15m", minGap: 30 },
};

let selectedSignal = null;

function symbol() {
  return ui.symbolInput.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function selectCoin(pair, view = null) {
  if (!pair) return;
  const clean = pair.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!clean) return;
  ui.symbolInput.value = clean;
  forceAllChartsToSelectedCoin();
  refreshDashboard();
  refreshTradeCharts();
  renderReal();
  if (view) setTab(view);
}

function styleConfig() {
  return STYLE_TF[ui.styleSelect.value] || STYLE_TF.intraday;
}

function fmt(value, digits = 4) {
  if (!Number.isFinite(value)) return "-";
  return value.toLocaleString("en-US", { maximumFractionDigits: digits });
}

function pct(value, digits = 2) {
  if (!Number.isFinite(value)) return "-";
  return `${value.toFixed(digits)}%`;
}

function movePct(from, to, side = "long") {
  if (!Number.isFinite(from) || !Number.isFinite(to) || from === 0) return NaN;
  return ((to - from) / from) * 100 * (side === "long" ? 1 : -1);
}

function signedPct(value, digits = 2) {
  if (!Number.isFinite(value)) return "-";
  return `${value >= 0 ? "+" : ""}${value.toFixed(digits)}%`;
}

function paperTpLevelHtml(level, hit = false) {
  return `<span class="${hit ? "hit" : ""}" title="Entry ${fmt(level.entry)} | SL ${fmt(level.stop)} | TP ${fmt(level.price)}"><em>${hit ? "✓ " : ""}${level.label}</em><strong>${fmt(level.price)}</strong><b>${signedPct(level.pct)}</b></span>`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getStore(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function setStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

async function getJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function getJsonOr(url, fallback) {
  try { return await getJson(url); } catch { return fallback; }
}

async function getScanSymbols() {
  if (scanSymbolsCache.length) return scanSymbolsCache;
  try {
    const [exchangeInfo, tickers] = await Promise.all([
      getJson("https://fapi.binance.com/fapi/v1/exchangeInfo"),
      getJson("https://fapi.binance.com/fapi/v1/ticker/24hr"),
    ]);
    const tradable = new Set(
      exchangeInfo.symbols
        .filter((item) => item.contractType === "PERPETUAL" && item.quoteAsset === "USDT" && item.status === "TRADING")
        .map((item) => item.symbol),
    );
    scanSymbolsCache = tickers
      .filter((item) => tradable.has(item.symbol))
      .sort((a, b) => Number(b.quoteVolume) - Number(a.quoteVolume))
      .slice(0, 50)
      .map((item) => item.symbol);
    return scanSymbolsCache;
  } catch {
    scanSymbolsCache = FALLBACK_SCAN_SYMBOLS;
    return scanSymbolsCache;
  }
}

async function price(pair) {
  const data = await getJson(`https://fapi.binance.com/fapi/v1/ticker/price?symbol=${pair}`);
  return Number(data.price);
}

function ema(values, period) {
  if (values.length < period) return NaN;
  const k = 2 / (period + 1);
  let current = values.slice(0, period).reduce((sum, value) => sum + value, 0) / period;
  for (let index = period; index < values.length; index += 1) {
    current = values[index] * k + current * (1 - k);
  }
  return current;
}

function emaSeries(values, period) {
  const series = Array(values.length).fill(null);
  if (values.length < period) return series;
  const k = 2 / (period + 1);
  let current = values.slice(0, period).reduce((sum, value) => sum + value, 0) / period;
  series[period - 1] = current;
  for (let index = period; index < values.length; index += 1) {
    current = values[index] * k + current * (1 - k);
    series[index] = current;
  }
  return series;
}

function rollingVwap(candlesInput, lookback = 48) {
  return candlesInput.map((_, index) => vwap(candlesInput.slice(0, index + 1), Math.min(lookback, index + 1)));
}

function rsi(values, period = 14) {
  let gains = 0;
  let losses = 0;
  for (let index = values.length - period; index < values.length; index += 1) {
    const change = values[index] - values[index - 1];
    if (change >= 0) gains += change;
    else losses -= change;
  }
  if (losses === 0) return 100;
  const rs = gains / period / (losses / period);
  return 100 - 100 / (1 + rs);
}

function atr(candles, period = 14) {
  const trs = [];
  for (let index = candles.length - period; index < candles.length; index += 1) {
    const candle = candles[index];
    const prevClose = candles[index - 1].close;
    trs.push(Math.max(candle.high - candle.low, Math.abs(candle.high - prevClose), Math.abs(candle.low - prevClose)));
  }
  return trs.reduce((sum, value) => sum + value, 0) / trs.length;
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

function macdHist(values) {
  const line = ema(values, 12) - ema(values, 26);
  const series = [];
  for (let index = 35; index <= values.length; index += 1) {
    const slice = values.slice(0, index);
    series.push(ema(slice, 12) - ema(slice, 26));
  }
  return line - ema(series, 9);
}

function adx(candles, period = 14) {
  if (candles.length < period + 2) return NaN;
  let plusDm = 0, minusDm = 0, trSum = 0;
  for (let i = candles.length - period; i < candles.length; i += 1) {
    const cur = candles[i], prev = candles[i - 1];
    const up = cur.high - prev.high;
    const down = prev.low - cur.low;
    plusDm += up > down && up > 0 ? up : 0;
    minusDm += down > up && down > 0 ? down : 0;
    trSum += Math.max(cur.high - cur.low, Math.abs(cur.high - prev.close), Math.abs(cur.low - prev.close));
  }
  const plusDi = trSum ? (plusDm / trSum) * 100 : 0;
  const minusDi = trSum ? (minusDm / trSum) * 100 : 0;
  return plusDi + minusDi ? (Math.abs(plusDi - minusDi) / (plusDi + minusDi)) * 100 : 0;
}

async function candles(pair, interval, limit = 240) {
  const rows = await getJson(`https://fapi.binance.com/fapi/v1/klines?symbol=${pair}&interval=${interval}&limit=${limit}`);
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

function drawChart(candlesData, pair, interval) {
  const canvas = ui.priceChart;
  if (!canvas || !candlesData.length) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const pad = { left: 14, right: 76, top: 18, bottom: 30 };
  const visible = candlesData.slice(-130);
  const closes = visible.map((c) => c.close);
  const ema20 = emaSeries(closes, 20);
  const ema50 = emaSeries(closes, 50);
  const vwapLine = rollingVwap(visible, 48);
  const prices = visible.flatMap((c, i) => [c.high, c.low, ema20[i], ema50[i], vwapLine[i]]).filter(Number.isFinite);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const xStep = plotW / visible.length;
  const y = (value) => pad.top + ((max - value) / range) * plotH;
  const x = (index) => pad.left + index * xStep + xStep / 2;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#0b0e10";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "#252c32";
  ctx.fillStyle = "#aab3bc";
  ctx.font = "12px Arial";

  for (let i = 0; i <= 4; i += 1) {
    const yy = pad.top + (plotH / 4) * i;
    const level = max - (range / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, yy);
    ctx.lineTo(width - pad.right, yy);
    ctx.stroke();
    ctx.fillText(fmt(level), width - pad.right + 10, yy + 4);
  }

  visible.forEach((c, i) => {
    const up = c.close >= c.open;
    const xx = x(i);
    ctx.strokeStyle = up ? "rgba(32,201,151,.85)" : "rgba(255,107,107,.85)";
    ctx.fillStyle = up ? "rgba(32,201,151,.75)" : "rgba(255,107,107,.75)";
    ctx.beginPath();
    ctx.moveTo(xx, y(c.high));
    ctx.lineTo(xx, y(c.low));
    ctx.stroke();
    const bodyTop = y(Math.max(c.open, c.close));
    const bodyBottom = y(Math.min(c.open, c.close));
    const bodyW = Math.max(3, xStep * 0.58);
    ctx.fillRect(xx - bodyW / 2, bodyTop, bodyW, Math.max(2, bodyBottom - bodyTop));
  });

  function line(series, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    let started = false;
    series.forEach((value, i) => {
      if (!Number.isFinite(value)) return;
      if (!started) {
        ctx.moveTo(x(i), y(value));
        started = true;
      } else ctx.lineTo(x(i), y(value));
    });
    ctx.stroke();
  }
  line(ema20, "#5aa9ff");
  line(ema50, "#ffd166");
  line(vwapLine, "#20c997");
  ui.chartMeta.textContent = `${pair} | ${interval} | EMA20/50/VWAP`;

  canvas.onmousemove = (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = ((event.clientX - rect.left) / rect.width) * width;
    const index = clamp(Math.floor((mouseX - pad.left) / xStep), 0, visible.length - 1);
    const c = visible[index];
    ui.chartTooltip.classList.remove("hidden");
    ui.chartTooltip.style.left = `${event.clientX - rect.left + 12}px`;
    ui.chartTooltip.style.top = `${event.clientY - rect.top + 12}px`;
    ui.chartTooltip.innerHTML = `O ${fmt(c.open)}<br>H ${fmt(c.high)}<br>L ${fmt(c.low)}<br>C ${fmt(c.close)}`;
  };
  canvas.onmouseleave = () => ui.chartTooltip.classList.add("hidden");
}

async function oiContext(pair, interval) {
  const period = { "1m": "5m", "5m": "5m", "15m": "15m", "1h": "1h", "4h": "4h", "1d": "1d" }[interval] || "1h";
  try {
    const hist = await getJson(`https://fapi.binance.com/futures/data/openInterestHist?symbol=${pair}&period=${period}&limit=2`);
    const first = Number(hist[0]?.sumOpenInterest);
    const last = Number(hist.at(-1)?.sumOpenInterest);
    const change = ((last - first) / first) * 100;
    return { period, change, label: change > 1 ? "OI rising" : change < -1 ? "OI falling" : "OI neutral" };
  } catch {
    return { period, change: NaN, label: "OI unavailable" };
  }
}

async function marketDepth(pair) {
  try {
    const book = await getJson(`https://fapi.binance.com/fapi/v1/depth?symbol=${pair}&limit=100`);
    const mid = (Number(book.bids[0][0]) + Number(book.asks[0][0])) / 2;
    const bidDepth = book.bids.reduce((sum, [p, q]) => Math.abs(Number(p) - mid) / mid <= 0.005 ? sum + Number(p) * Number(q) : sum, 0);
    const askDepth = book.asks.reduce((sum, [p, q]) => Math.abs(Number(p) - mid) / mid <= 0.005 ? sum + Number(p) * Number(q) : sum, 0);
    return { bidDepth, askDepth, totalDepth: bidDepth + askDepth };
  } catch {
    return { bidDepth: NaN, askDepth: NaN, totalDepth: NaN };
  }
}

async function analyze(pair, interval) {
  const [cs, premium, ticker, bookTicker, oi, depth] = await Promise.all([
    candles(pair, interval),
    getJsonOr(`https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${pair}`, { lastFundingRate: "0" }),
    getJsonOr(`https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=${pair}`, { quoteVolume: "0" }),
    getJsonOr(`https://fapi.binance.com/fapi/v1/ticker/bookTicker?symbol=${pair}`, { bidPrice: "0", askPrice: "0" }),
    oiContext(pair, interval),
    marketDepth(pair),
  ]);

  const closes = cs.map((c) => c.close);
  const last = cs.at(-1);
  const prev = cs.at(-2);
  const ema20 = ema(closes, 20), ema50 = ema(closes, 50), ema200 = ema(closes, 200);
  const vwapNow = vwap(cs);
  const atrNow = atr(cs);
  const atrPct = (atrNow / last.close) * 100;
  const rsi14 = rsi(closes);
  const hist = macdHist(closes);
  const trendStrength = adx(cs);
  const avgVolume = cs.slice(-21, -1).reduce((sum, c) => sum + c.volume, 0) / 20;
  const volumeRatio = last.volume / avgVolume;
  const takerImbalance = last.volume ? ((last.takerBuyVolume / last.volume) - 0.5) * 200 : 0;
  const recent = cs.slice(-120);
  const support = Math.min(...recent.map((c) => c.low));
  const resistance = Math.max(...recent.map((c) => c.high));
  const midRange = (support + resistance) / 2;
  const rangePct = ((last.close - support) / (resistance - support || 1)) * 100;
  const spread = Number(bookTicker.askPrice) && Number(bookTicker.bidPrice)
    ? ((Number(bookTicker.askPrice) - Number(bookTicker.bidPrice)) / ((Number(bookTicker.askPrice) + Number(bookTicker.bidPrice)) / 2)) * 100
    : NaN;
  const funding = Number(premium.lastFundingRate) * 100;
  const move = ((last.close - prev.close) / prev.close) * 100;

  const bull = last.close > ema20 && ema20 > ema50 && ema50 > ema200;
  const bear = last.close < ema20 && ema20 < ema50 && ema50 < ema200;
  const bias = bull ? "bullish" : bear ? "bearish" : "mixed";
  const roomLong = (resistance - last.close) / atrNow;
  const roomShort = (last.close - support) / atrNow;
  const extension = Math.abs(last.close - vwapNow) / atrNow;

  const longRaw = [
    bull ? 20 : 0,
    last.close > vwapNow ? 14 : 0,
    rsi14 > 35 && rsi14 < 68 ? 10 : 0,
    hist >= 0 ? 8 : 0,
    volumeRatio >= 1 ? 8 : 0,
    roomLong >= 1.5 ? 10 : 0,
    funding < 0.05 ? 6 : 0,
    takerImbalance > -10 ? 5 : 0,
    trendStrength >= 18 ? 5 : 0,
  ].reduce((a, b) => a + b, 0);
  const shortRaw = [
    bear ? 20 : 0,
    last.close < vwapNow ? 14 : 0,
    rsi14 < 65 && rsi14 > 32 ? 10 : 0,
    hist <= 0 ? 8 : 0,
    volumeRatio >= 1 ? 8 : 0,
    roomShort >= 1.5 ? 10 : 0,
    funding > -0.05 ? 6 : 0,
    takerImbalance < 10 ? 5 : 0,
    trendStrength >= 18 ? 5 : 0,
  ].reduce((a, b) => a + b, 0);

  const longScore = clamp(Math.round((longRaw / 86) * 100), 0, 100);
  const shortScore = clamp(Math.round((shortRaw / 86) * 100), 0, 100);

  return {
    pair, interval, price: last.close, bias, ema20, ema50, ema200, vwapNow, atrNow, atrPct, rsi14,
    macdHist: hist, adx: trendStrength, volumeRatio, takerImbalance, support, resistance, midRange,
    rangePct, spread, funding, oi, depth, move, dayChange: Number(ticker.priceChangePercent), roomLong, roomShort, extension, longScore, shortScore,
  };
}

function metricStateClass(state) {
  return {
    "silné": "strong",
    "dobré": "good",
    "ok": "neutral",
    "pozor": "warn",
    "slabé": "bad",
  }[state] || "neutral";
}

function metric(label, value, info, state = "ok") {
  return `<article class="metric-card ${metricStateClass(state)}"><span>${label}</span><em class="metric-state">${state}</em><strong>${value}</strong><details><summary>i</summary><p>${info}</p></details></article>`;
}

function coinSummary(data) {
  const edge = Math.abs(data.longScore - data.shortScore);
  const side = data.longScore > data.shortScore ? "long" : data.shortScore > data.longScore ? "short" : "neutral";
  if (edge < 20) return "Long a short skóre sú blízko. Coin je konfliktný, vhodnejší na watch než na okamžitý obchod.";
  if (data.extension > 2.2) return `Smer ${side} má výhodu, ale cena je ${data.extension.toFixed(2)} ATR od VWAP. Riziko chase, čakať na pullback/retest.`;
  if ((side === "long" && data.roomLong < 1) || (side === "short" && data.roomShort < 1)) return `Smer ${side} má kontext, ale priestor k levelu je malý. R:R môže byť slabé.`;
  return `Preferovaný smer je ${side}. Sleduj vstupnú zónu a trigger; samotný bias ešte nie je obchod.`;
}

function scoreClass(value, good = 75, warn = 55) {
  if (value >= good) return "good";
  if (value >= warn) return "warn";
  return "bad";
}

function analysisMetricsHtml(data) {
  const edge = Math.abs(data.longScore - data.shortScore);
  const biasState = edge >= 35 ? "silné" : edge >= 20 ? "dobré" : "ok";
  const vwapState = data.extension <= 1 ? "silné" : data.extension <= 1.8 ? "dobré" : data.extension <= 2.4 ? "pozor" : "slabé";
  const emaState = data.bias === "bullish" || data.bias === "bearish" ? "dobré" : "ok";
  const rsiState = data.rsi14 > 35 && data.rsi14 < 65 ? "dobré" : data.rsi14 > 30 && data.rsi14 < 70 ? "ok" : "pozor";
  const macdState = Math.abs(data.macdHist) > data.atrNow * 0.02 ? "dobré" : "ok";
  const adxState = data.adx >= 25 ? "silné" : data.adx >= 18 ? "dobré" : data.adx >= 12 ? "ok" : "pozor";
  const atrState = data.atrPct >= 0.2 && data.atrPct <= 6 ? "dobré" : data.atrPct > 8 ? "pozor" : "ok";
  const volumeState = data.volumeRatio >= 1.5 ? "silné" : data.volumeRatio >= 1 ? "dobré" : data.volumeRatio >= 0.7 ? "ok" : "slabé";
  const takerState = Math.abs(data.takerImbalance) >= 20 ? "silné" : Math.abs(data.takerImbalance) >= 8 ? "dobré" : "ok";
  const oiState = data.oi.label.includes("rising") ? "dobré" : data.oi.label.includes("falling") ? "ok" : "ok";
  const fundingState = Math.abs(data.funding) < 0.03 ? "dobré" : Math.abs(data.funding) < 0.06 ? "ok" : "pozor";
  const roomState = Math.max(data.roomLong, data.roomShort) >= 2 ? "silné" : Math.max(data.roomLong, data.roomShort) >= 1.3 ? "dobré" : "pozor";
  const spreadState = data.spread <= 0.03 ? "silné" : data.spread <= 0.08 ? "dobré" : data.spread <= 0.15 ? "pozor" : "slabé";
  const depthState = data.depth.totalDepth >= 1000000 ? "silné" : data.depth.totalDepth >= 200000 ? "dobré" : data.depth.totalDepth >= 50000 ? "ok" : "pozor";
  const dayChange = Number(data.dayChange);
  const dayState = Math.abs(dayChange) >= 5 ? "silné" : Math.abs(dayChange) >= 2 ? "dobré" : "ok";
  return [
    metric("Live / 1D", `${fmt(data.price)} | ${pct(dayChange)}`, "Aktuálna futures cena a 24h percentuálna zmena. Ukazuje denný momentum kontext.", dayState),
    metric("Bias", data.bias, "Smerový kontext podľa EMA stacku a ceny voči trendu.", biasState),
    metric("Long / Short", `${data.longScore} / ${data.shortScore}`, "Skóre nie je vstup. Ukazuje len, ktorý smer má lepší kontext.", biasState),
    metric("VWAP", `${fmt(data.vwapNow)} | ext ${fmt(data.extension, 2)} ATR`, "Férová cena vážená objemom. Veľká vzdialenosť znamená chase riziko.", vwapState),
    metric("EMA 20/50/200", `${fmt(data.ema20)} / ${fmt(data.ema50)} / ${fmt(data.ema200)}`, "Trendový stack. Zarovnanie zvyšuje kvalitu kontextu.", emaState),
    metric("RSI", fmt(data.rsi14, 1), "Prehriatie trhu. Extrémy znižujú kvalitu neskorého vstupu.", rsiState),
    metric("MACD", fmt(data.macdHist, 4), "Momentum filter. Pozitívny podporuje long, negatívny short.", macdState),
    metric("ADX", fmt(data.adx, 1), "Sila trendu. Nízky ADX často znamená chop.", adxState),
    metric("ATR", `${fmt(data.atrNow)} | ${pct(data.atrPct)}`, "Volatilita a základ pre rozumný stop/target.", atrState),
    metric("Volume", `${fmt(data.volumeRatio, 2)}x`, "Aktuálny objem voči priemeru. Bez objemu má signál menšiu váhu.", volumeState),
    metric("Taker imbalance", `${fmt(data.takerImbalance, 1)}%`, "Proxy agresívneho nákupu/predaja v poslednej sviečke.", takerState),
    metric("OI", `${data.oi.label} | ${pct(data.oi.change)}`, "Open interest kontext. Rast/klesanie OI pomáha čítať páku v trhu.", oiState),
    metric("Funding", pct(data.funding, 3), "Crowded futures smer. Extrémy zvyšujú squeeze riziko.", fundingState),
    metric("Support / Resistance", `${fmt(data.support)} / ${fmt(data.resistance)}`, "Range levely pre invalidáciu, target a vstup.", "ok"),
    metric("Room L/S", `${fmt(data.roomLong, 2)} / ${fmt(data.roomShort, 2)} ATR`, "Priestor k najbližšiemu levelu pre long/short.", roomState),
    metric("Spread", pct(data.spread, 3), "Likviditná proxy. Širší spread zhoršuje exekúciu.", spreadState),
    metric("Depth 0.5%", `${fmt(data.depth.totalDepth / 1000000, 2)}M`, "Order book depth do 0.5 percenta od ceny.", depthState),
  ].join("");
}

function renderScannerAnalysis(data) {
  ui.scannerAnalysisGrid.innerHTML = analysisMetricsHtml(data);
  ui.scannerAnalysisSummary.textContent = coinSummary(data);
  ui.scannerAnalysisMeta.textContent = `${data.pair} | ${data.interval}`;
}

async function refreshDashboard() {
  const pair = symbol();
  const tf = styleConfig().context;
  ui.marketTitle.textContent = pair;
  ui.coinAnalysisMeta.textContent = "loading";
  try {
    const data = await analyze(pair, tf);
    ui.coinAnalysisGrid.innerHTML = analysisMetricsHtml(data);
    ui.coinAnalysisSummary.textContent = coinSummary(data);
    ui.marketSummary.textContent = coinSummary(data);
    ui.coinAnalysisMeta.textContent = `${pair} | ${tf}`;
    refreshMtf();
  } catch (error) {
    ui.coinAnalysisMeta.textContent = "error";
    ui.coinAnalysisSummary.textContent = `Dáta sa nepodarilo načítať: ${error.message}`;
  }
  refreshRegime();
}

async function refreshRegime() {
  try {
    const [btc, eth] = await Promise.all([analyze("BTCUSDT", "1h"), analyze("ETHUSDT", "1h")]);
    ui.btcRegime.textContent = `${btc.bias} ${btc.longScore}/${btc.shortScore}`;
    ui.ethRegime.textContent = `${eth.bias} ${eth.longScore}/${eth.shortScore}`;
    ui.topRegime.textContent = "scan-based";
    ui.regimeStamp.textContent = new Date().toLocaleTimeString("sk-SK");
  } catch {
    ui.btcRegime.textContent = "-";
    ui.ethRegime.textContent = "-";
  }
}

async function refreshMtf() {
  const pair = symbol();
  try {
    const [m15, h1, h4] = await Promise.all([analyze(pair, "15m"), analyze(pair, "1h"), analyze(pair, "4h")]);
    ui.mtf15.textContent = m15.bias;
    ui.mtf15Text.textContent = `${m15.price >= m15.vwapNow ? "nad" : "pod"} VWAP | RSI ${fmt(m15.rsi14, 1)} | L ${m15.longScore}/S ${m15.shortScore}`;
    ui.mtf1h.textContent = h1.bias;
    ui.mtf1hText.textContent = `${h1.price >= h1.vwapNow ? "nad" : "pod"} VWAP | RSI ${fmt(h1.rsi14, 1)} | L ${h1.longScore}/S ${h1.shortScore}`;
    ui.mtf4h.textContent = h4.bias;
    ui.mtf4hText.textContent = `${h4.price >= h4.vwapNow ? "nad" : "pod"} VWAP | RSI ${fmt(h4.rsi14, 1)} | L ${h4.longScore}/S ${h4.shortScore}`;
    const style = ui.styleSelect.value;
    let text = "Bias je zmiesany. Cakat na hranu range alebo jasny flip.";
    if (style === "intraday") {
      if (h1.bias === "bullish" && m15.bias === "bullish") text = "Intraday: long je preferovany, 1h aj 15m su zladene.";
      else if (h1.bias === "bearish" && m15.bias === "bearish") text = "Intraday: short je preferovany, 1h aj 15m su zladene.";
      else if (h1.bias === "bearish" && m15.bias === "bullish") text = "Intraday: 15m long moze byt len bounce proti 1h. Nenahanat.";
      else if (h1.bias === "bullish" && m15.bias === "bearish") text = "Intraday: 15m short je pullback v 1h long kontexte.";
    } else if (style === "swing") {
      if (h4.bias === "bullish") text = "Swing: 4h podporuje long, hladat 1h pullback/retest.";
      else if (h4.bias === "bearish") text = "Swing: 4h podporuje short, hladat 1h pullback/retest.";
    } else {
      if (m15.bias === "bullish") text = "Scalp: 15m podporuje long, entry riesit nizsie.";
      else if (m15.bias === "bearish") text = "Scalp: 15m podporuje short, entry riesit nizsie.";
    }
    ui.mtfSummary.textContent = text;
  } catch {
    ui.mtfSummary.textContent = "MTF sa nepodarilo nacitat.";
  }
}

function setupType(data, side) {
  const room = side === "long" ? data.roomLong : data.roomShort;
  if (data.extension > 2.2) return "wait for pullback";
  if (data.rangePct < 25 && side === "long") return "range low bounce";
  if (data.rangePct > 75 && side === "short") return "range high rejection";
  if (room >= 2 && data.volumeRatio >= 1.2) return "trend continuation";
  return "watch for retest";
}

function riskAtrForStyle(style) {
  return style === "swing" ? 1.4 : style === "scalp" ? 0.55 : 0.9;
}

function entryPlanForStyle(data, side, style = ui.styleSelect.value) {
  const riskAtr = riskAtrForStyle(style);
  const entry = side === "long"
    ? Math.max(data.support, Math.min(data.vwapNow, data.price - data.atrNow * 0.35))
    : Math.min(data.resistance, Math.max(data.vwapNow, data.price + data.atrNow * 0.35));
  const stop = side === "long" ? Math.max(0, entry - data.atrNow * riskAtr) : entry + data.atrNow * riskAtr;
  const risk = Math.abs(entry - stop);
  const target1 = side === "long" ? entry + risk * 1.5 : Math.max(0, entry - risk * 1.5);
  const target2 = side === "long" ? entry + risk * 2.3 : Math.max(0, entry - risk * 2.3);
  return { entry, stop, target1, target2, style };
}

function entryPlan(data, side) {
  return entryPlanForStyle(data, side, ui.styleSelect.value);
}

function tpProfilesForSignal(data, side) {
  if (!data || !Number.isFinite(data.price) || !Number.isFinite(data.atrNow)) return [];
  const currentStyle = data.interval === "15m" ? "scalp" : data.interval === "4h" ? "swing" : "intraday";
  const basePlan = entryPlanForStyle(data, side, currentStyle);
  const localRisk = Math.abs(basePlan.entry - basePlan.stop);
  const structureRoom = side === "long" ? Math.max(0, data.resistance - basePlan.entry) : Math.max(0, basePlan.entry - data.support);
  const swingRisk = Math.max(localRisk * 2.2, data.atrNow * 2.4, basePlan.entry * 0.025);
  const swingTp1Move = Math.max(swingRisk * 1.2, data.atrNow * 3.2, basePlan.entry * 0.045);
  const swingTp2Move = Math.max(swingRisk * 1.9, data.atrNow * 5.0, basePlan.entry * 0.075);
  const capMove = structureRoom > 0 ? Math.max(structureRoom * 0.92, swingTp1Move) : Infinity;
  const profiles = [
    { style: "scalp", label: "Scalp", plan: entryPlanForStyle(data, side, "scalp") },
    { style: "intraday", label: "Intraday", plan: entryPlanForStyle(data, side, "intraday") },
    {
      style: "swing",
      label: "Swing",
      plan: {
        ...basePlan,
        stop: side === "long" ? Math.max(0, basePlan.entry - swingRisk) : basePlan.entry + swingRisk,
        target1: side === "long"
          ? basePlan.entry + Math.min(swingTp1Move, capMove)
          : Math.max(0, basePlan.entry - Math.min(swingTp1Move, capMove)),
        target2: side === "long"
          ? basePlan.entry + Math.min(swingTp2Move, capMove * 1.35)
          : Math.max(0, basePlan.entry - Math.min(swingTp2Move, capMove * 1.35)),
      },
    },
  ];
  return profiles.map((profile) => {
    const plan = profile.plan;
    return {
      style: profile.style,
      label: profile.label,
      plan,
      tp1Pct: movePct(plan.entry, plan.target1, side),
      tp2Pct: movePct(plan.entry, plan.target2, side),
    };
  });
}

function tpProfilesHtml(data, side) {
  const profiles = tpProfilesForSignal(data, side);
  if (!profiles.length) return `<p class="muted">TP profily sa nepodarilo vypocitat.</p>`;
  return `<div class="tp-profile-grid">
    ${profiles.map((profile) => `
      <article class="tp-profile">
        <strong>${profile.label}</strong>
        <span>TP1 ${fmt(profile.plan.target1)} <b>${signedPct(profile.tp1Pct)}</b></span>
        <span>TP2 ${fmt(profile.plan.target2)} <b>${signedPct(profile.tp2Pct)}</b></span>
      </article>
    `).join("")}
  </div>`;
}

function paperTpLevels(signal) {
  const side = signal.side;
  const profiles = tpProfilesForSignal(signal.data, side);
  if (!profiles.length) {
    return [
      { id: "plan-tp1", label: "Plan TP1", price: signal.plan.target1, pct: movePct(signal.plan.entry, signal.plan.target1, side) },
      { id: "plan-tp2", label: "Plan TP2", price: signal.plan.target2, pct: movePct(signal.plan.entry, signal.plan.target2, side) },
    ].filter((level) => Number.isFinite(level.price) && Number.isFinite(level.pct) && level.pct > 0);
  }
  return profiles.flatMap((profile) => [
    { id: `${profile.style}-tp1`, label: `${profile.label} TP1`, price: profile.plan.target1, pct: profile.tp1Pct, entry: profile.plan.entry, stop: profile.plan.stop },
    { id: `${profile.style}-tp2`, label: `${profile.label} TP2`, price: profile.plan.target2, pct: profile.tp2Pct, entry: profile.plan.entry, stop: profile.plan.stop },
  ])
    .filter((level) => Number.isFinite(level.price) && Number.isFinite(level.pct) && level.pct > 0)
    .sort((a, b) => a.pct - b.pct);
}

function entryPlans(data) {
  return {
    long: entryPlan(data, "long"),
    short: entryPlan(data, "short"),
  };
}

function setupLabel(score) {
  if (score >= 80) return "Silný setup";
  if (score >= 60) return "Možný setup";
  if (score >= 40) return "Slabý setup";
  return "Čakať";
}

function entryPlanCard(side, score, plan, data) {
  const isLong = side === "long";
  const room = isLong ? data.roomLong : data.roomShort;
  const reason = isLong
    ? "Long dáva zmysel iba ak cena podrží VWAP/support a nevstupuješ po prepalenej sviečke."
    : "Short dáva zmysel iba ak cena odmietne rezistenciu/VWAP a momentum nepotvrdzuje long.";
  return `
    <article class="entry-plan ${side}">
      <span>${isLong ? "Long" : "Short"} plan</span>
      <strong>${setupLabel(score)} (${score}/100)</strong>
      <dl>
        <div><dt>Entry</dt><dd>${fmt(plan.entry)}</dd></div>
        <div><dt>Stop</dt><dd>${fmt(plan.stop)} <small class="loss">${signedPct(movePct(plan.entry, plan.stop, side))}</small></dd></div>
        <div><dt>TP 1</dt><dd>${fmt(plan.target1)} <small class="win">${signedPct(movePct(plan.entry, plan.target1, side))}</small></dd></div>
        <div><dt>TP 2</dt><dd>${fmt(plan.target2)} <small class="win">${signedPct(movePct(plan.entry, plan.target2, side))}</small></dd></div>
        <div><dt>Room</dt><dd>${fmt(room, 2)} ATR</dd></div>
      </dl>
      <p>${reason}</p>
    </article>
  `;
}

async function scan() {
  const threshold = Number(ui.scanThreshold.value);
  const cfg = styleConfig();
  const symbols = await getScanSymbols();
  ui.scanStatus.textContent = `Scanning top ${symbols.length} symbols on ${cfg.context}...`;
  const rows = [];
  for (const pair of symbols) {
    try {
      const data = await analyze(pair, cfg.context);
      const side = data.longScore >= data.shortScore ? "long" : "short";
      const edge = Math.abs(data.longScore - data.shortScore);
      const setup = setupType(data, side);
      const plan = entryPlan(data, side);
      const coinQuality = side === "long" ? data.longScore : data.shortScore;
      const entryDistance = Math.abs(data.price - plan.entry) / data.atrNow;
      const entryQuality = clamp(Math.round(100 - entryDistance * 24 - (data.extension > 2.2 ? 20 : 0)), 0, 100);
      const riskQuality = clamp(Math.round(100 - Math.abs(data.funding) * 500 - (data.spread > 0.1 ? 20 : 0)), 0, 100);
      const score = clamp(Math.round(coinQuality * 0.42 + entryQuality * 0.34 + riskQuality * 0.14 + Math.min(edge * 2, 100) * 0.10), 0, 100);
      const status = entryQuality >= 75 && edge >= cfg.minGap ? "ready" : entryQuality >= 45 ? "forming" : data.extension > 2.2 ? "chase risk" : "watch";
      rows.push({ id: crypto.randomUUID(), pair, side, score, status, setup, data, plan, coinQuality, entryQuality, riskQuality, edge, createdAt: new Date().toISOString(), style: ui.styleSelect.value, timeframe: cfg.context });
    } catch {
      // ignore unavailable symbols
    }
  }
  const signals = rows.filter((row) => row.score >= threshold && row.edge >= cfg.minGap).sort((a, b) => b.score - a.score).slice(0, 12);
  ui.scanStatus.textContent = signals.length ? `Found ${signals.length} setup signals.` : "No clean setup. Showing best watch candidates.";
  renderSignals(signals.length ? signals : rows.sort((a, b) => b.score - a.score).slice(0, 8));
}

function scoreHint(signal) {
  return [
    `Coin ${signal.coinQuality}: kvalita trhu pre tento smer - trend, VWAP, volume, OI a momentum.`,
    `Entry ${signal.entryQuality}: ako blizko je cena k rozumnemu vstupu a ci nejde o chase.`,
    `Safety ${signal.riskQuality}: vyssie cislo znamena cistejsie rizikove podmienky - funding, spread a exekucia.`,
    `Edge ${signal.edge}: rozdiel medzi long a short skore; vyssi rozdiel znamena presvedcivejsi smer.`,
  ].join(" ");
}

function renderSignals(signals) {
  ui.signalList.innerHTML = signals.map((s) => `
    <article class="signal-card ${s.side}" data-id="${s.id}">
      <div class="signal-head">
        <div><strong><button class="coin-link" type="button" data-pair="${s.pair}">${s.pair}</button> ${s.side.toUpperCase()}</strong><br><span>${s.setup} | ${s.status}</span></div>
        <div class="score">${s.score}</div>
      </div>
      <div class="pill-row">
        <span class="pill ${scoreClass(s.coinQuality)}">Coin ${s.coinQuality}</span>
        <span class="pill ${scoreClass(s.entryQuality)}">Entry ${s.entryQuality}</span>
        <span class="pill ${scoreClass(s.riskQuality)}">Safety ${s.riskQuality}</span>
        <span class="pill ${scoreClass(s.edge, 35, 20)}">Edge ${s.edge}</span>
      </div>
      <span>Entry ${fmt(s.plan.entry)} | SL ${fmt(s.plan.stop)} | TP ${fmt(s.plan.target1)} / ${fmt(s.plan.target2)}</span>
      <span>${scoreHint(s)}</span>
    </article>
  `).join("");
  ui.signalList.querySelectorAll(".signal-card").forEach((card) => {
    const signal = signals.find((s) => s.id === card.dataset.id);
    card.addEventListener("click", () => showSignal(signal));
  });
  ui.signalList.querySelectorAll(".coin-link").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      selectCoin(button.dataset.pair, "dashboard");
    });
  });
}

function showSignal(signal) {
  selectedSignal = structuredClone(signal);
  ui.symbolInput.value = signal.pair;
  refreshDashboard();
  renderScannerAnalysis(signal.data);
  ui.signalDetailStatus.textContent = `${signal.pair} | ${signal.createdAt.split("T")[1].slice(0,5)}`;
  ui.signalDetail.innerHTML = `
    <div class="detail-block">
      <article><strong>${signal.pair} ${signal.side.toUpperCase()} | ${signal.setup}</strong><p>Status: ${signal.status}. Snapshot je zmrazený zo scanneru.</p></article>
      <article><strong>Plan</strong><p>Trigger entry ${fmt(signal.plan.entry)}, SL ${fmt(signal.plan.stop)}, TP ${fmt(signal.plan.target1)} / ${fmt(signal.plan.target2)}.</p></article>
      <article><strong>Why</strong><p>Coin ${signal.coinQuality}, entry ${signal.entryQuality}, risk ${signal.riskQuality}, edge ${signal.edge}. Bias ${signal.data.bias}, volume ${fmt(signal.data.volumeRatio,2)}x, OI ${signal.data.oi.label}. Style ${signal.style}, timeframe ${signal.timeframe}.</p></article>
      <article class="tp-profile-panel"><strong>TP podľa štýlu pre ${signal.side.toUpperCase()}</strong>${tpProfilesHtml(signal.data, signal.side)}</article>
      <section class="entry-plan-grid">
        ${entryPlanCard("long", signal.data.longScore, entryPlans(signal.data).long, signal.data)}
        ${entryPlanCard("short", signal.data.shortScore, entryPlans(signal.data).short, signal.data)}
      </section>
      <div class="trade-actions">
        <button id="startPaperSignal" type="button">Spustiť test trade</button>
        <button id="prefillRealSignal" class="secondary" type="button">Predvyplniť real trade</button>
      </div>
    </div>
  `;
  document.getElementById("startPaperSignal").addEventListener("click", () => createPaperTrigger(signal));
  document.getElementById("prefillRealSignal").addEventListener("click", () => prefillReal(signal));
}

function createPaperTrigger(signal) {
  const triggers = getStore(STORAGE.paperTriggers);
  const tpLevels = paperTpLevels(signal);
  triggers.unshift({
    id: crypto.randomUUID(),
    signal,
    status: "waiting",
    margin: 10,
    leverage: 10,
    tpLevels,
    tpHits: [],
    createdAt: new Date().toISOString(),
  });
  setStore(STORAGE.paperTriggers, triggers);
  renderPaper();
  setTab("paper");
}

function prefillReal(signal) {
  ui.realSymbol.value = signal.pair;
  ui.realSide.value = signal.side;
  ui.realEntry.value = fmt(signal.data.price);
  ui.realStop.value = fmt(signal.plan.stop);
  ui.realTarget.value = fmt(signal.plan.target1);
  setTab("real");
}

function cancelPaperTrigger(id) {
  setStore(STORAGE.paperTriggers, getStore(STORAGE.paperTriggers).filter((trigger) => trigger.id !== id));
  renderPaper();
}

function tradingViewUrl(pair = symbol(), interval = styleConfig().context) {
  const tvInterval = interval === "15m" ? "15" : interval === "4h" ? "240" : "60";
  const tvSymbol = `BINANCE:${pair}.P`;
  return `https://www.tradingview.com/widgetembed/?symbol=${encodeURIComponent(tvSymbol)}&interval=${tvInterval}&hidesidetoolbar=1&symboledit=0&saveimage=0&toolbarbg=0f1113&studies=[]&theme=dark&style=1&timezone=Europe%2FBratislava&withdateranges=1&hideideas=1`;
}

function ensureTradeChart(anchor, id, title) {
  const existingByTitle = Array.from(document.querySelectorAll("section.panel")).find((panel) => panel.querySelector("h2")?.textContent?.trim() === title);
  if (existingByTitle) {
    existingByTitle.id = id;
    existingByTitle.classList.add("trade-chart-panel");
    return;
  }
  if (!anchor || document.getElementById(id)) return;
  const panel = document.createElement("section");
  panel.className = "panel trade-chart-panel";
  panel.id = id;
  panel.innerHTML = `
    <div class="panel-heading">
      <h2>${title}</h2>
      <span>${symbol()} | ${styleConfig().context}</span>
    </div>
    <div class="chart-wrap compact-chart">
      <iframe title="${title}" loading="lazy" src="${tradingViewUrl()}"></iframe>
    </div>
  `;
  anchor.insertAdjacentElement("afterend", panel);
}

function refreshTradeCharts() {
  const seenTitles = new Set();
  document.querySelectorAll("section.panel").forEach((panel) => {
    const title = panel.querySelector("h2")?.textContent?.trim().toLowerCase();
    if (title !== "paper graf" && title !== "real trades graf") return;
    if (seenTitles.has(title)) {
      panel.remove();
      return;
    }
    seenTitles.add(title);
    panel.classList.add("trade-chart-panel");
  });
  document.querySelectorAll(".trade-chart-panel").forEach((panel) => {
    const meta = panel.querySelector(".panel-heading span");
    const frame = panel.querySelector("iframe");
    const url = tradingViewUrl();
    if (meta) meta.textContent = `${symbol()} | ${styleConfig().context}`;
    if (frame && frame.dataset.chartUrl !== url) {
      frame.dataset.chartUrl = url;
      frame.src = url;
    }
  });
}

function forceAllChartsToSelectedCoin() {
  const url = tradingViewUrl();
  document.querySelectorAll("#priceChartFrame, .trade-chart-panel iframe").forEach((frame) => {
    frame.dataset.chartUrl = url;
    frame.src = url;
  });
  document.querySelectorAll("#chartMeta, .trade-chart-panel .panel-heading span").forEach((meta) => {
    meta.textContent = `${symbol()} | ${styleConfig().context}`;
  });
}

function formatPaperTpMaps() {
  const cards = [...ui.paperTriggers.querySelectorAll(".trade-card"), ...ui.paperTrades.querySelectorAll(".trade-card")];
  cards.forEach((card) => {
    const title = card.querySelector(".trade-head strong")?.textContent || "";
    const pair = title.split(" ")[0];
    const side = /SHORT/i.test(title) ? "short" : "long";
    const allSignals = [
      ...getStore(STORAGE.paperTriggers).map((t) => t.signal),
      ...getStore(STORAGE.paperTrades).map((t) => t.signal),
    ];
    const signal = allSignals.find((s) => s.pair === pair && s.side === side);
    const map = card.querySelector(".paper-mini-map");
    if (!signal || !map) return;
    const hitLabels = new Set([...map.querySelectorAll(".hit")].map((node) => node.textContent.replace("✓", "").trim().replace(/\s+[+-]?\d.*/, "")));
    map.innerHTML = paperTpLevels(signal).map((level) => paperTpLevelHtml(level, hitLabels.has(level.label))).join("");
  });
}

async function checkPaperTriggers() {
  const triggers = getStore(STORAGE.paperTriggers);
  const trades = getStore(STORAGE.paperTrades);
  const remaining = [];
  let changed = false;
  for (const trigger of triggers) {
    try {
      const p = await price(trigger.signal.pair);
      const entry = trigger.signal.plan.entry;
      const hit = trigger.signal.side === "long" ? p <= entry : p >= entry;
      const invalid = trigger.signal.side === "long" ? p <= trigger.signal.plan.stop : p >= trigger.signal.plan.stop;
      if (hit) {
        const qty = (trigger.margin * trigger.leverage) / p;
        trades.unshift({
          id: crypto.randomUUID(),
          ...trigger,
          status: "active",
          entry: p,
          qty,
          lastPrice: p,
          pnl: 0,
          resultR: 0,
          tpLevels: trigger.tpLevels?.length ? trigger.tpLevels : paperTpLevels(trigger.signal),
          tpHits: [],
          openedAt: new Date().toISOString(),
        });
        changed = true;
      } else if (invalid) {
        trades.unshift({ id: crypto.randomUUID(), ...trigger, status: "invalidated", closedAt: new Date().toISOString(), resultR: 0, pnl: 0 });
        changed = true;
      } else {
        remaining.push(trigger);
      }
    } catch {
      remaining.push(trigger);
    }
  }
  if (changed) {
    setStore(STORAGE.paperTriggers, remaining);
    setStore(STORAGE.paperTrades, trades);
    renderPaper();
  }
}

async function updatePaperTrades() {
  const trades = getStore(STORAGE.paperTrades);
  let changed = false;
  for (const trade of trades) {
    if (trade.status !== "active") continue;
    try {
      const p = await price(trade.signal.pair);
      const side = trade.signal.side;
      const pnl = (p - trade.entry) * trade.qty * (side === "long" ? 1 : -1);
      const risk = Math.abs(trade.entry - trade.signal.plan.stop) * trade.qty;
      const resultR = risk ? pnl / risk : 0;
      const hitStop = side === "long" ? p <= trade.signal.plan.stop : p >= trade.signal.plan.stop;
      trade.tpLevels = paperTpLevels(trade.signal);
      trade.tpHits = trade.tpHits || [];
      const hitIds = new Set(trade.tpHits.map((hit) => hit.id));
      for (const level of trade.tpLevels) {
        const hitLevel = side === "long" ? p >= level.price : p <= level.price;
        if (hitLevel && !hitIds.has(level.id)) {
          trade.tpHits.push({ ...level, hitAt: new Date().toISOString(), hitPrice: p });
          hitIds.add(level.id);
        }
      }
      const lastTarget = trade.tpLevels.at(-1);
      const hitFinalTarget = lastTarget ? (side === "long" ? p >= lastTarget.price : p <= lastTarget.price) : false;
      trade.lastPrice = p;
      trade.pnl = pnl;
      trade.resultR = resultR;
      if (hitStop || hitFinalTarget) {
        trade.status = hitStop ? "stopped" : "target";
        trade.closedAt = new Date().toISOString();
        trade.exitPrice = p;
        trade.exitMovePct = movePct(trade.entry, p, side);
        trade.exitLeveragedPct = trade.exitMovePct * (trade.leverage || 10);
      }
      changed = true;
    } catch {
      // keep stale
    }
  }
  if (changed) {
    setStore(STORAGE.paperTrades, trades);
    renderPaper();
  }
}

function renderPaper() {
  const triggers = getStore(STORAGE.paperTriggers);
  const trades = getStore(STORAGE.paperTrades);
  const activeTrades = trades.filter((t) => t.status === "active");
  ui.paperTriggers.innerHTML = triggers.length ? triggers.map((t) => `
    <article class="trade-card ${t.signal.side}">
      <div class="trade-head"><strong><button class="coin-link" type="button" data-pair="${t.signal.pair}">${t.signal.pair}</button> ${t.signal.side.toUpperCase()}</strong><span>${t.status}</span></div>
      <div class="paper-price-row">
        <span>Entry <strong>${fmt(t.signal.plan.entry)}</strong></span>
        <span>Live <strong>-</strong></span>
        <span class="sl-chip">SL ${fmt(t.signal.plan.stop)} ${signedPct(movePct(t.signal.plan.entry, t.signal.plan.stop, t.signal.side))}</span>
      </div>
      <div class="paper-mini-map">
        ${paperTpLevels(t.signal).map((level) => `<span title="${level.label.includes("Swing") ? "Swing scenar: vacsi 4h/ATR ciel, nie lokalny rychly vystup. " : ""}Entry ${fmt(level.entry)} | SL ${fmt(level.stop)} | TP ${fmt(level.price)}">${level.label} <b>${signedPct(level.pct)}</b></span>`).join("")}
      </div>
      <button type="button" class="secondary paper-cancel" data-id="${t.id}">Zavriet nenaplneny</button>
    </article>
  `).join("") : `<p class="muted">Žiadne čakajúce paper triggre.</p>`;
  ui.paperTrades.innerHTML = activeTrades.length ? activeTrades.map((t) => `
    <article class="trade-card ${t.signal.side}">
      <div class="trade-head"><strong><button class="coin-link" type="button" data-pair="${t.signal.pair}">${t.signal.pair}</button> ${t.signal.side.toUpperCase()}</strong><span>${t.status}</span></div>
      <div class="paper-price-row">
        <span>Entry <strong>${fmt(t.entry)}</strong></span>
        <span>Live <strong>${fmt(t.lastPrice)}</strong></span>
        <span class="${movePct(t.entry, t.lastPrice, t.signal.side) >= 0 ? "paper-positive" : "paper-negative"}">10x ${signedPct(movePct(t.entry, t.lastPrice, t.signal.side) * (t.leverage || 10))}</span>
        <span class="sl-chip">SL ${fmt(t.signal.plan.stop)} ${signedPct(movePct(t.entry, t.signal.plan.stop, t.signal.side))}</span>
      </div>
      <div class="paper-mini-map">
        ${paperTpLevels(t.signal).map((level) => {
          const hit = (t.tpHits || []).some((item) => item.id === level.id);
          return `<span class="${hit ? "hit" : ""}" title="${level.label.includes("Swing") ? "Swing scenar: vacsi 4h/ATR ciel, nie lokalny rychly vystup. " : ""}Entry ${fmt(level.entry)} | SL ${fmt(level.stop)} | TP ${fmt(level.price)}">${hit ? "✓ " : ""}${level.label} <b>${signedPct(level.pct)}</b></span>`;
        }).join("")}
      </div>
      <span>PNL ${fmt(t.pnl,2)} USDT | ${fmt(t.resultR,2)}R | Setup ${t.signal.setup} | Score ${t.signal.score}</span>
    </article>
  `).join("") : `<p class="muted">Žiadne aktívne paper obchody. Uzavreté nájdeš v Journal.</p>`;
  ui.paperTriggers.querySelectorAll(".paper-cancel").forEach((button) => {
    button.addEventListener("click", () => cancelPaperTrigger(button.dataset.id));
  });
  ui.paperTriggers.querySelectorAll(".coin-link").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      selectCoin(button.dataset.pair, "dashboard");
    });
  });
  ui.paperTrades.querySelectorAll(".coin-link").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      selectCoin(button.dataset.pair, "dashboard");
    });
  });
  formatPaperTpMaps();
  ensureTradeChart(ui.paperTrades.closest(".panel") || ui.paperTrades, "paperChartPanel", "Paper graf");
  refreshTradeCharts();
  renderJournal();
}

function renderJournal() {
  const trades = getStore(STORAGE.paperTrades);
  const closed = trades.filter((t) => ["stopped", "target", "invalidated"].includes(t.status));
  const wins = closed.filter((t) => Number(t.resultR) > 0).length;
  const totalR = closed.reduce((sum, t) => sum + (Number(t.resultR) || 0), 0);
  ui.paperStats.textContent = closed.length ? `${closed.length} closed | ${fmt(totalR,2)}R` : "-";
  ui.journalStats.innerHTML = [
    ["Closed", closed.length],
    ["Winrate", closed.length ? `${Math.round((wins / closed.length) * 100)}%` : "-"],
    ["Total R", `${fmt(totalR,2)}R`],
  ].map(([label, value]) => `<article class="stat-card"><span>${label}</span><strong>${value}</strong></article>`).join("");
  ui.journalList.innerHTML = closed.map((t) => `
    <article class="trade-card ${t.signal.side}">
      <div class="trade-head"><strong><button class="coin-link" type="button" data-pair="${t.signal.pair}">${t.signal.pair}</button> ${t.signal.setup}</strong><span>${t.status}</span></div>
      <span>Entry ${fmt(t.entry)} | Exit ${fmt(t.exitPrice || t.lastPrice)} | ${signedPct(t.exitMovePct ?? movePct(t.entry, t.exitPrice || t.lastPrice, t.signal.side))} | 10x ${signedPct(t.exitLeveragedPct ?? movePct(t.entry, t.exitPrice || t.lastPrice, t.signal.side) * (t.leverage || 10))}</span>
      <span>${fmt(t.resultR,2)}R | Score ${t.signal.score} | ${t.signal.style || "style"} | ${t.signal.timeframe}</span>
    </article>
  `).join("");
  ui.journalList.querySelectorAll(".coin-link").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      selectCoin(button.dataset.pair, "dashboard");
    });
  });
}

function addRealTrade() {
  const entry = Number(ui.realEntry.value);
  const margin = Number(ui.realMargin.value);
  const leverage = Number(ui.realLeverage.value);
  const trades = getStore(STORAGE.realTrades);
  trades.unshift({
    id: crypto.randomUUID(),
    pair: ui.realSymbol.value.trim().toUpperCase(),
    side: ui.realSide.value,
    entry,
    margin,
    leverage,
    qty: entry ? (margin * leverage) / entry : 0,
    stop: Number(ui.realStop.value),
    target: Number(ui.realTarget.value),
    createdAt: new Date().toISOString(),
  });
  setStore(STORAGE.realTrades, trades);
  renderReal();
}

async function renderReal() {
  const trades = getStore(STORAGE.realTrades);
  const cards = await Promise.all(trades.map(async (t) => {
    let p = NaN;
    let data = null;
    try { p = await price(t.pair); } catch {}
    try { data = await analyze(t.pair, styleConfig().context); } catch {}
    const pnl = Number.isFinite(p) ? (p - t.entry) * t.qty * (t.side === "long" ? 1 : -1) : NaN;
    const risk = Math.abs(t.entry - t.stop) * t.qty;
    const r = risk ? pnl / risk : NaN;
    const roi = t.margin ? (pnl / t.margin) * 100 : NaN;
    const stopDistance = Number.isFinite(p) ? Math.abs(p - t.stop) / p * 100 : NaN;
    const targetDistance = Number.isFinite(p) ? Math.abs(t.target - p) / p * 100 : NaN;
    const sideScore = data ? (t.side === "long" ? data.longScore : data.shortScore) : NaN;
    const oppositeScore = data ? (t.side === "long" ? data.shortScore : data.longScore) : NaN;
    const action = tradeManagement(t, data, r, sideScore, oppositeScore);
    const scenarios = tradeScenarios(t, data, r);
    return `<article class="trade-card real ${t.side}">
      <div class="trade-head"><strong><button class="coin-link" type="button" data-pair="${t.pair}">${t.pair}</button> ${t.side.toUpperCase()}</strong><span>${fmt(r,2)}R</span></div>
      <div class="trade-metrics">
        <div><span>Live</span><strong>${fmt(p)}</strong></div>
        <div><span>PnL</span><strong>${fmt(pnl,2)} USDT</strong></div>
        <div><span>ROI</span><strong>${pct(roi)}</strong></div>
        <div><span>R</span><strong>${fmt(r,2)}R</strong></div>
        <div><span>SL/TP dist</span><strong>${pct(stopDistance)} / ${pct(targetDistance)}</strong></div>
        <div><span>Filter</span><strong>${fmt(sideScore,0)} / ${fmt(oppositeScore,0)}</strong></div>
        <div><span>Margin/Lev</span><strong>${fmt(t.margin,2)} / ${t.leverage}x</strong></div>
        <div><span>Notional</span><strong>${fmt(t.margin * t.leverage,2)} USDT</strong></div>
      </div>
      ${data ? `
        <div class="live-analysis">
          <div><span>Bias</span><strong>${data.bias}</strong></div>
          <div><span>VWAP</span><strong>${p >= data.vwapNow ? "nad" : "pod"} | ext ${fmt(data.extension,2)} ATR</strong></div>
          <div><span>Volume</span><strong>${fmt(data.volumeRatio,2)}x</strong></div>
          <div><span>OI</span><strong>${data.oi.label} ${pct(data.oi.change)}</strong></div>
          <div><span>Funding</span><strong>${pct(data.funding,3)}</strong></div>
          <div><span>ADX</span><strong>${fmt(data.adx,1)}</strong></div>
          <div><span>RSI</span><strong>${fmt(data.rsi14,1)}</strong></div>
          <div><span>Room L/S</span><strong>${fmt(data.roomLong,2)} / ${fmt(data.roomShort,2)} ATR</strong></div>
          <div><span>Spread</span><strong>${pct(data.spread,3)}</strong></div>
          <div><span>Taker</span><strong>${fmt(data.takerImbalance,1)}%</strong></div>
        </div>
      ` : ""}
      <div class="management-banner ${action.level}"><strong>${action.label}</strong>${action.text}</div>
      <div class="trade-scenarios">
        ${scenarios.map(([title, text]) => `<article><strong>${title}</strong><p>${text}</p></article>`).join("")}
      </div>
    </article>`;
  }));
  ui.realTrades.innerHTML = cards.join("") || `<p class="muted">Žiadne real trades.</p>`;
  ui.realTrades.querySelectorAll(".coin-link").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      selectCoin(button.dataset.pair, "dashboard");
    });
  });
  ensureTradeChart(ui.realTrades.closest(".panel") || ui.realTrades, "realChartPanel", "Real trades graf");
  refreshTradeCharts();
}

function tradeManagement(trade, data, r, sideScore, oppositeScore) {
  if (!data) return { level: "warn", label: "WAIT", text: "Market dáta sa nepodarilo načítať." };
  if (Number.isFinite(r) && r <= -0.7 && oppositeScore > sideScore + 15) {
    return { level: "bad", label: "CUT / EXIT WARNING", text: "Obchod je v strate a opačný smer získava prevahu. Nepridávať, rešpektovať invalidáciu." };
  }
  if (Number.isFinite(r) && r >= 2) {
    return { level: "good", label: "TRAIL / LOCK", text: "Obchod je nad +2R. Chrániť zisk, trailovať alebo zamknúť časť profitu." };
  }
  if (Number.isFinite(r) && r >= 1.2 && sideScore < 60) {
    return { level: "warn", label: "TAKE PARTIAL", text: "Profit je slušný, ale filter slabne. Zvážiť partial a zvyšok nechať s ochranou." };
  }
  if (Number.isFinite(r) && r >= 0.8) {
    return { level: "good", label: "MOVE SL TO BE", text: "Obchod je v zisku. Zvážiť posun SL na break-even alebo za lokálnu štruktúru." };
  }
  if (sideScore >= 65) return { level: "good", label: "HOLD PLAN", text: "Pôvodný smer stále drží podporu filtra. Držať plán a sledovať úrovne." };
  return { level: "warn", label: "WATCH CLOSELY", text: "Setup nemá silnú podporu filtra. Držať iba ak stále platí pôvodná invalidácia." };
}

function tradeScenarios(trade, data, r) {
  if (!data) return [["No data", "Scenáre nie sú dostupné."]];
  const sideScore = trade.side === "long" ? data.longScore : data.shortScore;
  const oppositeScore = trade.side === "long" ? data.shortScore : data.longScore;
  const continuation = sideScore >= 70 && data.volumeRatio >= 1 && data.extension <= 1.8;
  const pullback = data.extension > 1.5;
  const invalidation = oppositeScore > sideScore + 20 || (trade.side === "long" ? data.price < data.vwapNow : data.price > data.vwapNow);
  return [
    [continuation ? "Continuation" : pullback ? "Pullback / Retest" : "Base Case", continuation ? "Smer má podporu filtra a volume. Pokračovanie dáva zmysel, kým drží štruktúra." : pullback ? "Cena je ďalej od VWAP. Čakať reakciu/pullback, nechaseovať." : "Trh je neutrálny, držať sa SL/TP."],
    [invalidation ? "Invalidation Risk" : "Plan Valid", invalidation ? "Opačný smer alebo strata VWAP varuje, že pôvodný scenár slabne." : "Pôvodný plán zatiaľ nie je jasne zneplatnený."],
    [data.oi.label, `OI ${pct(data.oi.change)} | Funding ${pct(data.funding,3)} | Volume ${fmt(data.volumeRatio,2)}x.`],
  ];
}

function setTab(view) {
  document.querySelectorAll(".tabs button").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  document.querySelectorAll(".view").forEach((panel) => panel.classList.toggle("hidden", panel.dataset.viewPanel !== view));
}

document.querySelectorAll(".tabs button").forEach((button) => button.addEventListener("click", () => setTab(button.dataset.view)));
ui.refreshButton.addEventListener("click", refreshDashboard);
ui.refreshMtfButton.addEventListener("click", refreshMtf);
ui.scanButton.addEventListener("click", scan);
ui.addRealTradeButton.addEventListener("click", addRealTrade);
ui.clearPaperButton.addEventListener("click", () => {
  setStore(STORAGE.paperTriggers, []);
  setStore(STORAGE.paperTrades, []);
  renderPaper();
});

refreshDashboard();
renderPaper();
renderReal();
setInterval(checkPaperTriggers, 5000);
setInterval(updatePaperTrades, 7000);
setInterval(renderReal, 10000);
// v2 chart/percent helpers injected by Codex.
var cockpitV2ChartSnapshot = null;

function sideMovePct(entry, price, side) {
  if (!Number.isFinite(entry) || !Number.isFinite(price) || entry <= 0) return NaN;
  return side === "short" ? ((entry - price) / entry) * 100 : ((price - entry) / entry) * 100;
}

function pctText(value) {
  if (!Number.isFinite(value)) return "-";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function planMoveText(plan, side) {
  if (!plan) return "";
  const stop = pctText(sideMovePct(plan.entry, plan.stop, side));
  const tp1 = pctText(sideMovePct(plan.entry, plan.target1, side));
  const tp2 = pctText(sideMovePct(plan.entry, plan.target2, side));
  return `Pohyb: SL ${stop} | TP ${tp1} / ${tp2}`;
}

function moveChip(plan, side, key) {
  const price = key === "stop" ? plan.stop : key === "target1" ? plan.target1 : plan.target2;
  const value = sideMovePct(plan.entry, price, side);
  const tone = value < 0 ? "loss" : "win";
  return `<small class="${tone}">${pctText(value)}</small>`;
}

function cockpitV2DecorateEntryPlans(root = document) {
  root.querySelectorAll(".entry-plan").forEach((card) => {
    card.querySelectorAll(".move-chip.auto").forEach((chip) => chip.remove());
    const side = /short/i.test(card.textContent || "") ? "short" : "long";
    const rows = Array.from(card.querySelectorAll("dt"));
    const byLabel = (label) => {
      const dt = rows.find((item) => (item.textContent || "").trim().toLowerCase().replace(/\s+/g, "") === label);
      return dt?.nextElementSibling || null;
    };
    const entryEl = byLabel("entry");
    const stopEl = byLabel("stop");
    const tp1El = byLabel("tp1");
    const tp2El = byLabel("tp2");
    const plan = {
      entry: cockpitV2NumberFromText(entryEl?.textContent),
      stop: cockpitV2NumberFromText(stopEl?.textContent),
      target1: cockpitV2NumberFromText(tp1El?.textContent),
      target2: cockpitV2NumberFromText(tp2El?.textContent)
    };
    [
      [stopEl, "stop"],
      [tp1El, "target1"],
      [tp2El, "target2"]
    ].forEach(([element, key]) => {
      if (!element || !Number.isFinite(plan.entry)) return;
      const price = key === "stop" ? plan.stop : key === "target1" ? plan.target1 : plan.target2;
      const value = sideMovePct(plan.entry, price, side);
      const chip = document.createElement("small");
      chip.className = `move-chip auto ${value < 0 ? "loss" : "win"}`;
      chip.textContent = pctText(value);
      element.append(chip);
    });
  });
}

function cockpitV2NumberFromText(value) {
  return Number(String(value || "").replace(/,/g, ""));
}

function cockpitV2DecoratePercentLines(root = document) {
  return root;
}

function cockpitV2EnsureChartPanel() {
  if (document.getElementById("priceChartFrame")) return;
  const oldCanvas = document.getElementById("priceChart");
  if (oldCanvas) {
    const wrap = oldCanvas.closest(".chart-wrap");
    if (wrap) {
      wrap.innerHTML = `<iframe id="priceChartFrame" title="TradingView graf" loading="lazy"></iframe>`;
      return;
    }
  }
  const analysisPanel = document.getElementById("coinAnalysisGrid")?.closest("section");
  if (!analysisPanel) return;
  const panel = document.createElement("section");
  panel.className = "panel";
  panel.innerHTML = `
    <div class="panel-heading">
      <h2>Graf</h2>
      <span id="chartMeta">-</span>
    </div>
    <div class="chart-wrap">
      <iframe id="priceChartFrame" title="TradingView graf" loading="lazy"></iframe>
    </div>
  `;
  analysisPanel.after(panel);
}

function cockpitV2StyleForChart() {
  try {
    if (typeof styleConfig === "function") return styleConfig().context;
  } catch (error) {
    // fallback below
  }
  return document.getElementById("styleSelect")?.value === "swing" ? "4h" : document.getElementById("styleSelect")?.value === "scalp" ? "15m" : "1h";
}

function cockpitV2SymbolForChart() {
  try {
    if (typeof symbol === "function") return symbol();
  } catch (error) {
    // fallback below
  }
  return `${document.getElementById("coinInput")?.value || "BTC"}USDT`.replace("USDTUSDT", "USDT").toUpperCase();
}

async function cockpitV2LoadChartCandles(pair, interval) {
  const url = `${API}/fapi/v1/klines?symbol=${pair}&interval=${interval}&limit=160`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Chart candles failed");
  const rows = await response.json();
  return rows.map((row) => ({
    time: row[0],
    open: Number(row[1]),
    high: Number(row[2]),
    low: Number(row[3]),
    close: Number(row[4]),
    volume: Number(row[5])
  }));
}

function cockpitV2EmaSeries(values, period) {
  const out = [];
  const k = 2 / (period + 1);
  let prev = values[0];
  values.forEach((value, index) => {
    prev = index === 0 ? value : value * k + prev * (1 - k);
    out.push(prev);
  });
  return out;
}

function cockpitV2VwapSeries(candles) {
  let pv = 0;
  let volume = 0;
  return candles.map((candle) => {
    const typical = (candle.high + candle.low + candle.close) / 3;
    pv += typical * candle.volume;
    volume += candle.volume;
    return volume ? pv / volume : typical;
  });
}

function cockpitV2DrawChart(candles, pair, interval) {
  const canvas = document.getElementById("priceChart");
  const meta = document.getElementById("chartMeta");
  if (!canvas || !candles?.length) return;
  if (meta) meta.textContent = `${pair} | ${interval} | ${candles.length} sviečok`;

  const rect = canvas.getBoundingClientRect();
  const width = Math.max(rect.width || 900, 320);
  const height = 420;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const visible = candles.slice(-120);
  const closes = visible.map((c) => c.close);
  const ema20 = cockpitV2EmaSeries(closes, 20);
  const ema50 = cockpitV2EmaSeries(closes, 50);
  const vwap = cockpitV2VwapSeries(visible);
  const highs = visible.map((c) => c.high);
  const lows = visible.map((c) => c.low);
  const allValues = highs.concat(lows, ema20, ema50, vwap).filter(Number.isFinite);
  let min = Math.min(...allValues);
  let max = Math.max(...allValues);
  const padValue = (max - min) * 0.08 || max * 0.01 || 1;
  min -= padValue;
  max += padValue;

  const pad = { left: 14, right: 70, top: 18, bottom: 34 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const step = plotW / Math.max(visible.length - 1, 1);
  const x = (index) => pad.left + index * step;
  const y = (value) => pad.top + ((max - value) / (max - min)) * plotH;

  ctx.fillStyle = "#0b0e10";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(209, 219, 230, 0.10)";
  ctx.lineWidth = 1;
  ctx.font = "12px system-ui";
  ctx.fillStyle = "rgba(209, 219, 230, 0.70)";
  for (let i = 0; i <= 4; i += 1) {
    const yy = pad.top + (plotH / 4) * i;
    const price = max - ((max - min) / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, yy);
    ctx.lineTo(width - pad.right + 8, yy);
    ctx.stroke();
    ctx.fillText(fmt(price), width - pad.right + 14, yy + 4);
  }

  visible.forEach((candle, index) => {
    const xx = x(index);
    const up = candle.close >= candle.open;
    const bodyTop = y(Math.max(candle.open, candle.close));
    const bodyBottom = y(Math.min(candle.open, candle.close));
    ctx.strokeStyle = up ? "#21d19f" : "#ff6b7a";
    ctx.fillStyle = up ? "#21d19f" : "#ff6b7a";
    ctx.beginPath();
    ctx.moveTo(xx, y(candle.high));
    ctx.lineTo(xx, y(candle.low));
    ctx.stroke();
    ctx.fillRect(xx - Math.max(2, step * 0.32), bodyTop, Math.max(3, step * 0.64), Math.max(2, bodyBottom - bodyTop));
  });

  const drawLine = (values, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    values.forEach((value, index) => {
      if (!Number.isFinite(value)) return;
      if (index === 0) ctx.moveTo(x(index), y(value));
      else ctx.lineTo(x(index), y(value));
    });
    ctx.stroke();
  };
  drawLine(ema20, "#5aa8ff");
  drawLine(ema50, "#f7c948");
  drawLine(vwap, "#b48cff");

  ctx.fillStyle = "rgba(209, 219, 230, 0.82)";
  ctx.fillText("EMA20", pad.left + 4, 18);
  ctx.fillStyle = "#f7c948";
  ctx.fillText("EMA50", pad.left + 62, 18);
  ctx.fillStyle = "#b48cff";
  ctx.fillText("VWAP", pad.left + 122, 18);

  cockpitV2ChartSnapshot = { candles: visible, pad, plotW, step, pair, interval };
}

async function cockpitV2RefreshChart() {
  cockpitV2EnsureChartPanel();
  const frame = document.getElementById("priceChartFrame");
  const meta = document.getElementById("chartMeta");
  if (!frame) return;
  const pair = cockpitV2SymbolForChart();
  const interval = cockpitV2StyleForChart();
  const tvInterval = interval === "15m" ? "15" : interval === "4h" ? "240" : "60";
  const tvSymbol = `BINANCE:${pair}.P`;
  if (meta) meta.textContent = `${pair} | ${interval}`;
  frame.src = `https://www.tradingview.com/widgetembed/?frameElementId=priceChartFrame&symbol=${encodeURIComponent(tvSymbol)}&interval=${tvInterval}&hidesidetoolbar=1&symboledit=0&saveimage=0&toolbarbg=0f1113&studies=[]&theme=dark&style=1&timezone=Europe%2FBratislava&withdateranges=1&hideideas=1`;
}

function cockpitV2AttachChartHover() {
  const canvas = document.getElementById("priceChart");
  const tooltip = document.getElementById("chartTooltip");
  if (!canvas || !tooltip || canvas.dataset.hoverReady) return;
  canvas.dataset.hoverReady = "1";
  canvas.addEventListener("mousemove", (event) => {
    if (!cockpitV2ChartSnapshot) return;
    const rect = canvas.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const { candles, pad, step } = cockpitV2ChartSnapshot;
    const index = Math.max(0, Math.min(candles.length - 1, Math.round((localX - pad.left) / step)));
    const candle = candles[index];
    if (!candle) return;
    tooltip.innerHTML = `
      <strong>${new Date(candle.time).toLocaleString("sk-SK", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}</strong><br>
      O ${fmt(candle.open)} H ${fmt(candle.high)}<br>
      L ${fmt(candle.low)} C ${fmt(candle.close)}
    `;
    tooltip.style.left = `${Math.min(rect.width - 150, Math.max(8, localX + 12))}px`;
    tooltip.style.top = `${Math.max(8, event.clientY - rect.top - 20)}px`;
    tooltip.classList.remove("hidden");
  });
  canvas.addEventListener("mouseleave", () => tooltip.classList.add("hidden"));
}

window.addEventListener("DOMContentLoaded", () => {
  const cleanupStyle = document.createElement("style");
  cleanupStyle.textContent = `
    .paper-cancel-btn,
    .tp-map-hint,
    .paper-roi-chip { display: none !important; }
    .tp-profile-grid .tp-profile { min-width: 0; }
    .tp-profile-panel { overflow: hidden; }
    .entry-plan > .tp-profile-grid { display: none !important; }
    .paper-cancel { padding: 8px 12px !important; font-size: .88rem !important; border-radius: 7px !important; }
    .trade-card .paper-mini-map { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .trade-card .paper-mini-map span { font-size: .82rem; }
  `;
  document.head.appendChild(cleanupStyle);
  const paperStyle = document.createElement("style");
  paperStyle.textContent = `
    .tp-profile-grid, .paper-mini-map { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin-top: 12px; }
    .tp-profile, .paper-mini-map span { display: grid; gap: 3px; padding: 8px 9px; border: 1px solid var(--line); border-radius: 8px; background: rgba(255,255,255,.025); color: var(--muted); }
    .tp-profile strong { color: var(--text); }
    .tp-profile b, .paper-mini-map b { color: #21d19f; }
    .paper-mini-map span.hit { border-color: rgba(33,209,159,.55); background: rgba(33,209,159,.10); color: var(--text); }
    .paper-cancel { margin-top: 12px; width: fit-content; }
    .paper-positive { color: #21d19f; font-weight: 800; }
    .paper-negative { color: #ff8b97; font-weight: 800; }
    .paper-price-row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin: 8px 0; }
    .paper-price-row > span { display: inline-flex; gap: 5px; align-items: center; padding: 5px 8px; border: 1px solid var(--line); border-radius: 7px; background: rgba(255,255,255,.025); color: var(--muted); }
    .paper-price-row strong { color: var(--text); }
    .paper-price-row .paper-positive { color: #21d19f; border-color: rgba(33,209,159,.35); background: rgba(33,209,159,.10); }
    .paper-price-row .paper-negative, .sl-chip { color: #ff8b97 !important; border-color: rgba(255,107,122,.38) !important; background: rgba(255,107,122,.10) !important; font-weight: 800; }
    .paper-mini-map { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
    .paper-mini-map span { display: flex; justify-content: space-between; align-items: center; padding: 6px 8px; font-size: .82rem; }
    .paper-mini-map em { font-style: normal; color: var(--muted); }
    .paper-mini-map strong { color: var(--text); font-weight: 800; }
    .coin-link { appearance: none; border: 0; padding: 0; margin: 0; background: transparent; color: var(--text); font: inherit; font-weight: 900; cursor: pointer; text-align: left; }
    .coin-link:hover { color: #5aa8ff; text-decoration: underline; text-underline-offset: 3px; }
    @media (max-width: 860px) { .tp-profile-grid, .paper-mini-map { grid-template-columns: 1fr; } }
  `;
  document.head.appendChild(paperStyle);
  const style = document.createElement("style");
  style.textContent = `
    .chart-wrap { position: relative; min-height: 420px; background: #0b0e10; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
    #priceChartFrame { width: 100%; height: 460px; display: block; border: 0; }
    .chart-tooltip { position: absolute; pointer-events: none; z-index: 2; padding: 6px 8px; color: var(--text); background: rgba(15, 17, 19, .94); border: 1px solid var(--line); border-radius: 6px; font-size: 12px; line-height: 1.45; }
    .move-percent-line { color: var(--muted); }
    .entry-plan small, .move-chip { display: inline-flex; align-items: center; margin-left: 8px; padding: 2px 7px; border-radius: 999px; font-size: .72em; font-weight: 800; line-height: 1.4; border: 1px solid rgba(255,255,255,.12); }
    .move-chip.loss, .entry-plan small.loss { color: #ff8b97; background: rgba(255,107,122,.12); border-color: rgba(255,107,122,.35); }
    .move-chip.win, .entry-plan small.win { color: #21d19f; background: rgba(33,209,159,.12); border-color: rgba(33,209,159,.35); }
    .tp-profile-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin-top: 12px; }
    .tp-profile { display: grid; gap: 4px; padding: 9px; border: 1px solid var(--line); border-radius: 8px; background: rgba(255,255,255,.025); }
    .tp-profile strong { color: var(--text); font-size: .86rem; }
    .tp-profile span { color: var(--muted); font-size: .78rem; }
    .tp-profile b { color: #21d19f; font-weight: 800; }
    .paper-cancel-btn { margin-top: 10px; width: fit-content; }
    .panel > .paper-cancel-btn, section > .paper-cancel-btn { display: none !important; }
    .paper-roi-chip { margin-top: 10px; width: fit-content; padding: 5px 9px; border-radius: 999px; font-weight: 800; border: 1px solid rgba(255,255,255,.12); }
    .paper-roi-chip.win { color: #21d19f; background: rgba(33,209,159,.12); border-color: rgba(33,209,159,.35); }
    .paper-roi-chip.loss { color: #ff8b97; background: rgba(255,107,122,.12); border-color: rgba(255,107,122,.35); }
    .tp-map-hint { margin-top: 8px; color: var(--muted); font-size: .82rem; line-height: 1.45; }
    .compact-chart { min-height: 330px; }
    .compact-chart iframe { width: 100%; height: 360px; border: 0; display: block; }
    @media (max-width: 820px) { .tp-profile-grid { grid-template-columns: 1fr; } }
  `;
  document.head.appendChild(style);

  cockpitV2EnsureChartPanel();
  cockpitV2AttachChartHover();
  cockpitV2RefreshChart();
  cockpitV2DecoratePercentLines();
  setInterval(() => {
    cockpitV2DecoratePercentLines();
  }, 15000);

  document.getElementById("refreshBtn")?.addEventListener("click", () => setTimeout(cockpitV2RefreshChart, 350));
  document.getElementById("styleSelect")?.addEventListener("change", () => setTimeout(cockpitV2RefreshChart, 350));
  document.getElementById("coinInput")?.addEventListener("change", () => setTimeout(cockpitV2RefreshChart, 350));
  window.addEventListener("resize", () => setTimeout(cockpitV2RefreshChart, 150));
});

// Hard stop for older experimental DOM patchers that were causing duplicated
// Paper buttons and malformed TP cards. The proper Paper UI is rendered above.
function cockpitV2FinalPaperFix() {}
function cockpitV2StablePaperEnhance() {}
function cockpitV2StableSignalEnhance() {}
function cockpitV2EnhancePaperCards() {}
function cockpitV2EnhanceSignalPlans() {}
function cockpitV2PaperTradeEnhancements() {}
function cockpitV2DecorateEntryPlans() {}

// Disable old experimental DOM patchers. Paper is now rendered directly in renderPaper().
function cockpitV2FinalPaperFix() {}
function cockpitV2StablePaperEnhance() {}
function cockpitV2StableSignalEnhance() {}
function cockpitV2EnhancePaperCards() {}
function cockpitV2EnhanceSignalPlans() {}
function cockpitV2PaperTradeEnhancements() {}
function cockpitV2DecorateEntryPlans() {}

// Paper/real trade usability layer.
const COCKPIT_V2_DEFAULT_PAPER_LEVERAGE = 10;

function cockpitV2FindStorageArray(predicate) {
  const matches = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    try {
      const value = JSON.parse(localStorage.getItem(key));
      if (Array.isArray(value) && value.some(predicate)) matches.push({ key, value });
    } catch (error) {
      // ignore non-json storage entries
    }
  }
  return matches;
}

function cockpitV2CancelPaperTrigger(pair, entry) {
  let changed = false;
  cockpitV2FindStorageArray((item) => item?.signal?.plan || item?.plan).forEach(({ key, value }) => {
    const next = value.filter((item) => {
      const signal = item.signal || item;
      const plan = signal.plan || item.plan || {};
      const itemPair = signal.pair || item.pair || "";
      const itemEntry = Number(plan.entry || item.entry);
      const looksWaiting = !item.openedAt && !item.entryTime && !item.closedAt && !item.exit;
      const samePair = !pair || itemPair === pair;
      const sameEntry = !Number.isFinite(entry) || Math.abs(itemEntry - entry) <= Math.max(0.00000001, itemEntry * 0.00001);
      return !(looksWaiting && samePair && sameEntry);
    });
    if (next.length !== value.length) {
      localStorage.setItem(key, JSON.stringify(next));
      changed = true;
    }
  });
  if (changed && typeof renderPaper === "function") renderPaper();
}

function cockpitV2ParsePlanFromCard(card) {
  const text = card.textContent || "";
  const pair = (text.match(/\b([A-Z0-9]{2,})USDT\b/) || [])[0] || "";
  const side = /short/i.test(text) ? "short" : "long";
  const labelValue = (label) => {
    const match = text.match(new RegExp(`${label}\\s+([\\d,.]+)`, "i"));
    return cockpitV2NumberFromText(match?.[1]);
  };
  let entry = labelValue("Entry");
  let stop = labelValue("SL") || labelValue("Stop");
  let tp1 = labelValue("TP\\s*1") || labelValue("TP");
  let tp2 = labelValue("TP\\s*2");
  const compact = text.match(/Entry\s+([\d,.]+)\s+\|\s+SL\s+([\d,.]+)\s+\|\s+TP\s+([\d,.]+)(?:\s*\/\s*([\d,.]+))?/i);
  if (compact) {
    entry = cockpitV2NumberFromText(compact[1]);
    stop = cockpitV2NumberFromText(compact[2]);
    tp1 = cockpitV2NumberFromText(compact[3]);
    tp2 = cockpitV2NumberFromText(compact[4] || compact[3]);
  }
  return { pair, side, entry, stop, target1: tp1, target2: tp2 };
}

function cockpitV2PriceFromMove(entry, movePct, side) {
  if (!Number.isFinite(entry)) return NaN;
  return side === "short" ? entry * (1 - movePct / 100) : entry * (1 + movePct / 100);
}

function cockpitV2TpProfiles(plan) {
  const base1 = Math.abs(sideMovePct(plan.entry, plan.target1, plan.side));
  const base2 = Math.abs(sideMovePct(plan.entry, plan.target2, plan.side));
  const profiles = [
    ["Scalp", Math.max(0.25, base1 * 0.65), Math.max(0.45, base2 * 0.75)],
    ["Intraday", Math.max(0.45, base1), Math.max(0.75, base2)],
    ["Swing", Math.max(0.9, base1 * 1.8), Math.max(1.4, base2 * 2.4)]
  ];
  return profiles.map(([name, first, second]) => ({
    name,
    first,
    second,
    target1: cockpitV2PriceFromMove(plan.entry, first, plan.side),
    target2: cockpitV2PriceFromMove(plan.entry, second, plan.side)
  }));
}

function cockpitV2EnhanceSignalPlans(root = document) {
  root.querySelectorAll(".entry-plan, article, .card").forEach((card) => {
    const text = card.textContent || "";
    if (!/Entry/i.test(text) || !/TP/i.test(text) || card.querySelector(".tp-profile-grid")) return;
    const plan = cockpitV2ParsePlanFromCard(card);
    if (!Number.isFinite(plan.entry) || !Number.isFinite(plan.target1)) return;
    const box = document.createElement("div");
    box.className = "tp-profile-grid";
    box.innerHTML = cockpitV2TpProfiles(plan).map((profile) => `
      <div class="tp-profile">
        <strong>${profile.name}</strong>
        <span>TP1 ${fmt(profile.target1)} <b>+${profile.first.toFixed(2)}%</b></span>
        <span>TP2 ${fmt(profile.target2)} <b>+${profile.second.toFixed(2)}%</b></span>
      </div>
    `).join("");
    card.append(box);
  });
}

function cockpitV2EnhancePaperCards(root = document) {
  root.querySelectorAll(".paper-card, article").forEach((card) => {
    const text = card.textContent || "";
    if (!/Waiting entry/i.test(text) && !/Entry/i.test(text)) return;
    const plan = cockpitV2ParsePlanFromCard(card);

    if (/Waiting entry/i.test(text) && !card.querySelector(".paper-cancel-btn")) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ghost paper-cancel-btn";
      button.textContent = "Zavriet nenaplneny";
      button.addEventListener("click", () => cockpitV2CancelPaperTrigger(plan.pair, plan.entry));
      card.append(button);
    }

    if (/Last/i.test(text) && !card.querySelector(".paper-roi-chip")) {
      const entry = cockpitV2NumberFromText((text.match(/Entry\s+([\d,.]+)/i) || [])[1]);
      const last = cockpitV2NumberFromText((text.match(/Last\s+([\d,.]+)/i) || [])[1]);
      const side = /short/i.test(text) ? "short" : "long";
      const raw = sideMovePct(entry, last, side);
      if (Number.isFinite(raw)) {
        const chip = document.createElement("div");
        chip.className = `paper-roi-chip ${raw >= 0 ? "win" : "loss"}`;
        chip.textContent = `Pohyb ${pctText(raw)} | pri 10x ${pctText(raw * COCKPIT_V2_DEFAULT_PAPER_LEVERAGE)}`;
        card.append(chip);
      }
    }

    if (/Entry/i.test(text) && /SL/i.test(text) && !card.querySelector(".tp-map-hint")) {
      const hint = document.createElement("div");
      hint.className = "tp-map-hint";
      hint.textContent = "Paper rezim sleduje TP mapu: TP1, TP2 a dalsie ciele su evidovane ako zasahy; obchod sa ma ukoncit az pri SL alebo poslednom TP.";
      card.append(hint);
    }
  });
}

function cockpitV2EnsureTradeCharts() {
  const source = document.getElementById("priceChartFrame");
  if (!source) return;
  if (document.querySelector(".trade-chart-paper") && document.querySelector(".trade-chart-real")) return;
  [
    ["paper", "Paper graf"],
    ["real", "Real trades graf"]
  ].forEach(([needle, title]) => {
    const tab = Array.from(document.querySelectorAll("section, main > div, .tab-panel")).find((node) => {
      const id = (node.id || "").toLowerCase();
      const text = (node.querySelector("h2, h1")?.textContent || "").toLowerCase();
      return id.includes(needle) || text.includes(needle === "paper" ? "paper" : "real");
    });
    if (!tab || tab.querySelector(`.trade-chart-${needle}`)) return;
    const panel = document.createElement("section");
    panel.className = `panel trade-chart-${needle}`;
    panel.innerHTML = `
      <div class="panel-heading">
        <h2>${title}</h2>
        <span>sledovany coin</span>
      </div>
      <div class="chart-wrap compact-chart">
        <iframe title="${title}" loading="lazy"></iframe>
      </div>
    `;
    tab.append(panel);
  });
}

function cockpitV2SyncTradeCharts() {
  const source = document.getElementById("priceChartFrame");
  if (!source?.src) return;
  document.querySelectorAll(".trade-chart-paper iframe, .trade-chart-real iframe").forEach((frame) => {
    if (frame.src !== source.src) frame.src = source.src;
  });
}

function cockpitV2PaperTradeEnhancements() {
  cockpitV2EnhanceSignalPlans();
  cockpitV2EnhancePaperCards();
  cockpitV2EnsureTradeCharts();
  cockpitV2SyncTradeCharts();
}

// Final stable Paper renderer helpers. These target only individual trade cards,
// never the whole Paper column/panel.
function cockpitV2PanelByHeading(label) {
  return Array.from(document.querySelectorAll("section, .panel")).find((panel) => {
    const heading = panel.querySelector("h1, h2, h3")?.textContent || "";
    return heading.trim().toLowerCase() === label.toLowerCase();
  });
}

function cockpitV2DirectTradeCards(panel) {
  if (!panel) return [];
  return Array.from(panel.querySelectorAll("article, .signal, .trade-card")).filter((card) => {
    const text = card.textContent || "";
    return /\b[A-Z0-9]{2,}USDT\b/.test(text) && !/Scalp\s+TP1|Intraday\s+TP1|Swing\s+TP1/i.test(text);
  });
}

function cockpitV2StablePaperEnhance() {
  document.querySelectorAll(".tp-profile-grid, .paper-cancel-btn, .paper-roi-chip, .tp-map-hint").forEach((node) => node.remove());

  const triggerPanel = cockpitV2PanelByHeading("Paper Triggers");
  cockpitV2DirectTradeCards(triggerPanel).forEach((card) => {
    const text = card.textContent || "";
    if (!/Waiting entry/i.test(text)) return;
    const plan = cockpitV2ParsePlanFromCard(card);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ghost paper-cancel-btn";
    button.textContent = "Zavriet nenaplneny";
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      cockpitV2CancelPaperTrigger(plan.pair, plan.entry);
      card.remove();
    });
    card.append(button);
  });

  const tradePanel = cockpitV2PanelByHeading("Paper Trades");
  cockpitV2DirectTradeCards(tradePanel).forEach((card) => {
    const text = card.textContent || "";
    if (!/Entry/i.test(text) || !/Last/i.test(text)) return;
    const entry = cockpitV2NumberFromText((text.match(/Entry\s+([\d,.]+)/i) || [])[1]);
    const last = cockpitV2NumberFromText((text.match(/Last\s+([\d,.]+)/i) || [])[1]);
    const side = /short/i.test(text) ? "short" : "long";
    const raw = sideMovePct(entry, last, side);
    if (!Number.isFinite(raw)) return;
    const chip = document.createElement("div");
    chip.className = `paper-roi-chip ${raw >= 0 ? "win" : "loss"}`;
    chip.textContent = `Pohyb ${pctText(raw)} | pri 10x ${pctText(raw * COCKPIT_V2_DEFAULT_PAPER_LEVERAGE)}`;
    card.append(chip);
  });
}

function cockpitV2StableSignalEnhance() {
  document.querySelectorAll(".entry-plan, article, .card").forEach((card) => {
    const text = card.textContent || "";
    if (!/Long plan|Short plan/i.test(text) || !/Entry/i.test(text) || !/TP/i.test(text)) return;
    if (/Paper Triggers|Paper Trades/i.test(card.closest("section, .panel")?.querySelector("h1, h2, h3")?.textContent || "")) return;
    if (card.querySelector(".tp-profile-grid")) return;
    const plan = cockpitV2ParsePlanFromCard(card);
    if (!Number.isFinite(plan.entry) || !Number.isFinite(plan.target1)) return;
    const box = document.createElement("div");
    box.className = "tp-profile-grid";
    box.innerHTML = cockpitV2TpProfiles(plan).map((profile) => `
      <div class="tp-profile">
        <strong>${profile.name}</strong>
        <span>TP1 ${fmt(profile.target1)} <b>+${profile.first.toFixed(2)}%</b></span>
        <span>TP2 ${fmt(profile.target2)} <b>+${profile.second.toFixed(2)}%</b></span>
      </div>
    `).join("");
    card.append(box);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    cockpitV2StablePaperEnhance();
    cockpitV2StableSignalEnhance();
  }, 250);
  document.addEventListener("click", () => setTimeout(() => {
    cockpitV2StablePaperEnhance();
    cockpitV2StableSignalEnhance();
  }, 220));
  document.addEventListener("change", () => setTimeout(() => {
    cockpitV2StablePaperEnhance();
    cockpitV2StableSignalEnhance();
  }, 220));
});

function cockpitV2WrapPaperCloseLogic() {
  try {
    if (typeof closePaperTrade !== "function" || closePaperTrade.__cockpitV2Wrapped) return;
    const originalClosePaperTrade = closePaperTrade;
    closePaperTrade = function cockpitV2ClosePaperTradeWrapper(trade, reason, price) {
      const signal = trade?.signal || {};
      const plan = signal.plan || {};
      const side = signal.side || trade?.side || "long";
      const closeReason = String(reason || "").toLowerCase();
      const currentPrice = Number(price || trade?.lastPrice);
      const tp2Hit = side === "short" ? currentPrice <= Number(plan.target2) : currentPrice >= Number(plan.target2);
      const stopHit = side === "short" ? currentPrice >= Number(plan.stop) : currentPrice <= Number(plan.stop);
      if ((closeReason.includes("tp1") || closeReason === "tp") && !tp2Hit && !stopHit) {
        trade.tpHits = { ...(trade.tpHits || {}), tp1: true };
        trade.statusNote = "TP1 zasiahnuty, paper trade bezi dalej na TP2 alebo SL.";
        return trade;
      }
      return originalClosePaperTrade.apply(this, arguments);
    };
    closePaperTrade.__cockpitV2Wrapped = true;
  } catch (error) {
    // Some builds keep close logic private; the visual TP map still remains active.
  }
}

window.addEventListener("DOMContentLoaded", () => {
  cockpitV2WrapPaperCloseLogic();
  cockpitV2PaperTradeEnhancements();
  document.addEventListener("click", () => setTimeout(cockpitV2PaperTradeEnhancements, 180));
  document.addEventListener("change", () => setTimeout(cockpitV2PaperTradeEnhancements, 180));
});

// Stabilized paper layer: keep enhancements out of the Paper section containers.
function cockpitV2ClearLoosePaperEnhancements(root = document) {
  root.querySelectorAll(".tp-profile-grid, .paper-cancel-btn, .paper-roi-chip, .tp-map-hint").forEach((node) => node.remove());
}

function cockpitV2LooksLikePlanCard(card) {
  const text = card.textContent || "";
  if (card.querySelector("h1, h2, h3")) return false;
  if (/Paper Triggers|Paper Trades|Paper graf|Real Trades/i.test(text)) return false;
  return /Long plan|Short plan/i.test(text) && /Entry/i.test(text) && /TP/i.test(text);
}

function cockpitV2EnhanceSignalPlans(root = document) {
  root.querySelectorAll(".entry-plan, article, .card").forEach((card) => {
    if (!cockpitV2LooksLikePlanCard(card) || card.querySelector(".tp-profile-grid")) return;
    const plan = cockpitV2ParsePlanFromCard(card);
    if (!Number.isFinite(plan.entry) || !Number.isFinite(plan.target1)) return;
    const box = document.createElement("div");
    box.className = "tp-profile-grid";
    box.innerHTML = cockpitV2TpProfiles(plan).map((profile) => `
      <div class="tp-profile">
        <strong>${profile.name}</strong>
        <span>TP1 ${fmt(profile.target1)} <b>+${profile.first.toFixed(2)}%</b></span>
        <span>TP2 ${fmt(profile.target2)} <b>+${profile.second.toFixed(2)}%</b></span>
      </div>
    `).join("");
    card.append(box);
  });
}

function cockpitV2EnhancePaperCards() {
  cockpitV2ClearLoosePaperEnhancements();
}

function cockpitV2PaperTradeEnhancements() {
  cockpitV2EnhanceSignalPlans();
  cockpitV2EnhancePaperCards();
  cockpitV2EnsureTradeCharts();
  cockpitV2SyncTradeCharts();
}
/* Paper stabilization override. Kept at the top by patch tooling, but executed after DOM is ready. */
function cockpitV2FinalPaperFix() {
  const panels = Array.from(document.querySelectorAll("section, .panel, [id]"));
  const paperTriggers = panels.find((panel) => /paper triggers/i.test(panel.querySelector("h1,h2,h3")?.textContent || ""));
  const paperTrades = panels.find((panel) => /paper trades/i.test(panel.querySelector("h1,h2,h3")?.textContent || ""));

  const cardsIn = (panel) => {
    if (!panel) return [];
    return Array.from(panel.querySelectorAll("article, .card, .signal-card, .trade-card, div")).filter((card) => {
      const text = card.textContent || "";
      const isPanel = card === panel || /Paper Triggers|Paper Trades/i.test(card.querySelector("h1,h2,h3")?.textContent || "");
      return !isPanel && /\b[A-Z0-9]{2,}USDT\b/.test(text) && (card.children.length || card.className);
    });
  };

  [paperTriggers, paperTrades].forEach((panel) => {
    if (!panel) return;
    Array.from(panel.children).forEach((child) => {
      if (child.matches?.(".paper-cancel-btn, .tp-profile-grid, .paper-roi-chip, .tp-map-hint")) child.remove();
    });
    panel.querySelectorAll(".tp-profile-grid, .tp-map-hint").forEach((node) => node.remove());
  });

  cardsIn(paperTriggers).forEach((card) => {
    const text = card.textContent || "";
    if (!/waiting/i.test(text)) return;
    if (card.querySelector(".paper-cancel-btn")) return;
    const pair = (text.match(/\b([A-Z0-9]{2,}USDT)\b/) || [])[1] || "";
    const entry = cockpitV2NumberFromText((text.match(/Waiting entry\s+([\d,.]+)/i) || [])[1]);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ghost paper-cancel-btn";
    button.textContent = "Zavriet nenaplneny";
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      cockpitV2CancelPaperTrigger(pair, entry);
      card.remove();
    });
    card.append(button);
  });

  cardsIn(paperTrades).forEach((card) => {
    const text = card.textContent || "";
    if (!/Entry/i.test(text) || !/Last/i.test(text)) return;
    const entry = cockpitV2NumberFromText((text.match(/Entry\s+([\d,.]+)/i) || [])[1]);
    const last = cockpitV2NumberFromText((text.match(/Last\s+([\d,.]+)/i) || [])[1]);
    const side = /short/i.test(text) ? "short" : "long";
    const raw = sideMovePct(entry, last, side);
    if (!Number.isFinite(raw)) return;
    const chip = card.querySelector(".paper-roi-chip") || document.createElement("div");
    chip.className = `paper-roi-chip ${raw >= 0 ? "win" : "loss"}`;
    chip.textContent = `Pohyb ${pctText(raw)} | pri 10x ${pctText(raw * 10)}`;
    if (!chip.parentElement) card.append(chip);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.textContent = `
    .panel > .paper-cancel-btn, section > .paper-cancel-btn,
    .panel > .tp-profile-grid, section > .tp-profile-grid,
    .panel > .tp-map-hint, section > .tp-map-hint { display: none !important; }
    .paper-cancel-btn { margin-top: 10px; width: fit-content; }
    .paper-roi-chip { margin-top: 10px; width: fit-content; padding: 5px 9px; border-radius: 999px; font-weight: 800; border: 1px solid rgba(255,255,255,.12); }
    .paper-roi-chip.win { color: #21d19f; background: rgba(33,209,159,.12); border-color: rgba(33,209,159,.35); }
    .paper-roi-chip.loss { color: #ff8b97; background: rgba(255,107,122,.12); border-color: rgba(255,107,122,.35); }
  `;
  document.head.appendChild(style);

  let queued = false;
  const run = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      cockpitV2FinalPaperFix();
    });
  };
  setTimeout(run, 300);
  document.addEventListener("click", () => setTimeout(run, 120));
  document.addEventListener("change", () => setTimeout(run, 120));
  new MutationObserver(run).observe(document.body, { childList: true, subtree: true });
});
