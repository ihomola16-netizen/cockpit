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

function entryPlan(data, side) {
  const riskAtr = ui.styleSelect.value === "swing" ? 1.4 : ui.styleSelect.value === "scalp" ? 0.55 : 0.9;
  const entry = side === "long"
    ? Math.max(data.support, Math.min(data.vwapNow, data.price - data.atrNow * 0.35))
    : Math.min(data.resistance, Math.max(data.vwapNow, data.price + data.atrNow * 0.35));
  const stop = side === "long" ? Math.max(0, entry - data.atrNow * riskAtr) : entry + data.atrNow * riskAtr;
  const risk = Math.abs(entry - stop);
  const target1 = side === "long" ? entry + risk * 1.5 : Math.max(0, entry - risk * 1.5);
  const target2 = side === "long" ? entry + risk * 2.3 : Math.max(0, entry - risk * 2.3);
  return { entry, stop, target1, target2 };
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
        <div><dt>Stop</dt><dd>${fmt(plan.stop)}</dd></div>
        <div><dt>TP 1</dt><dd>${fmt(plan.target1)}</dd></div>
        <div><dt>TP 2</dt><dd>${fmt(plan.target2)}</dd></div>
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
        <div><strong>${s.pair} ${s.side.toUpperCase()}</strong><br><span>${s.setup} | ${s.status}</span></div>
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
  triggers.unshift({
    id: crypto.randomUUID(),
    signal,
    status: "waiting",
    margin: 10,
    leverage: 10,
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
        trades.unshift({ id: crypto.randomUUID(), ...trigger, status: "active", entry: p, qty, openedAt: new Date().toISOString() });
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
      const hitTarget = side === "long" ? p >= trade.signal.plan.target1 : p <= trade.signal.plan.target1;
      trade.lastPrice = p;
      trade.pnl = pnl;
      trade.resultR = resultR;
      if (hitStop || hitTarget) {
        trade.status = hitStop ? "stopped" : "target";
        trade.closedAt = new Date().toISOString();
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
  ui.paperTriggers.innerHTML = triggers.length ? triggers.map((t) => `
    <article class="trade-card ${t.signal.side}">
      <div class="trade-head"><strong>${t.signal.pair} ${t.signal.side.toUpperCase()}</strong><span>${t.status}</span></div>
      <span>Waiting entry ${fmt(t.signal.plan.entry)} | SL ${fmt(t.signal.plan.stop)} | TP ${fmt(t.signal.plan.target1)}</span>
      <span>${planMoveText(t.signal.plan, t.signal.side)}</span>
    </article>
  `).join("") : `<p class="muted">Žiadne čakajúce paper triggre.</p>`;
  ui.paperTrades.innerHTML = trades.length ? trades.map((t) => `
    <article class="trade-card ${t.signal.side}">
      <div class="trade-head"><strong>${t.signal.pair} ${t.signal.side.toUpperCase()}</strong><span>${t.status}</span></div>
      <span>Entry ${fmt(t.entry)} | Last ${fmt(t.lastPrice)} | PnL ${fmt(t.pnl,2)} | ${fmt(t.resultR,2)}R</span>
      <span>SL ${fmt(t.signal.plan.stop)} | TP ${fmt(t.signal.plan.target1)} / ${fmt(t.signal.plan.target2)} | ${planMoveText(t.signal.plan, t.signal.side).replace("Pohyb: ", "")}</span>
      <span>Setup ${t.signal.setup} | Score ${t.signal.score}</span>
    </article>
  `).join("") : `<p class="muted">Žiadne paper obchody.</p>`;
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
      <div class="trade-head"><strong>${t.signal.pair} ${t.signal.setup}</strong><span>${t.status}</span></div>
      <span>${fmt(t.resultR,2)}R | Score ${t.signal.score} | ${t.signal.style} ${t.signal.timeframe}</span>
    </article>
  `).join("");
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
      <div class="trade-head"><strong>${t.pair} ${t.side.toUpperCase()}</strong><span>${fmt(r,2)}R</span></div>
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
  root.querySelectorAll(".entry-plan, article, .card").forEach((card) => {
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
  const style = document.createElement("style");
  style.textContent = `
    .chart-wrap { position: relative; min-height: 420px; background: #0b0e10; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
    #priceChartFrame { width: 100%; height: 460px; display: block; border: 0; }
    .chart-tooltip { position: absolute; pointer-events: none; z-index: 2; padding: 6px 8px; color: var(--text); background: rgba(15, 17, 19, .94); border: 1px solid var(--line); border-radius: 6px; font-size: 12px; line-height: 1.45; }
    .move-percent-line { color: var(--muted); }
    .entry-plan small, .move-chip { display: inline-flex; align-items: center; margin-left: 8px; padding: 2px 7px; border-radius: 999px; font-size: .72em; font-weight: 800; line-height: 1.4; border: 1px solid rgba(255,255,255,.12); }
    .move-chip.loss, .entry-plan small.loss { color: #ff8b97; background: rgba(255,107,122,.12); border-color: rgba(255,107,122,.35); }
    .move-chip.win, .entry-plan small.win { color: #21d19f; background: rgba(33,209,159,.12); border-color: rgba(33,209,159,.35); }
  `;
  document.head.appendChild(style);

  cockpitV2EnsureChartPanel();
  cockpitV2AttachChartHover();
  cockpitV2RefreshChart();
  cockpitV2DecoratePercentLines();
  cockpitV2DecorateEntryPlans();
  setInterval(() => {
    cockpitV2RefreshChart();
    cockpitV2DecoratePercentLines();
    cockpitV2DecorateEntryPlans();
  }, 15000);

  document.getElementById("refreshBtn")?.addEventListener("click", () => setTimeout(cockpitV2RefreshChart, 350));
  document.getElementById("scanBtn")?.addEventListener("click", () => setTimeout(cockpitV2DecorateEntryPlans, 350));
  document.getElementById("styleSelect")?.addEventListener("change", () => setTimeout(cockpitV2RefreshChart, 350));
  document.getElementById("coinInput")?.addEventListener("change", () => setTimeout(cockpitV2RefreshChart, 350));
  document.addEventListener("click", () => setTimeout(cockpitV2DecorateEntryPlans, 120));
  window.addEventListener("resize", () => setTimeout(cockpitV2RefreshChart, 150));
});
