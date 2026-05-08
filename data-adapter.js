const DataMode = Object.freeze({
  MOCK: "mock",
  LIVE: "live",
});

let activeDataMode = DataMode.LIVE;

const BINANCE_FAPI = "https://fapi.binance.com";

const DEFAULT_LIVE_UNIVERSE = [
  "BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT",
  "DOGEUSDT", "ADAUSDT", "AVAXUSDT", "LINKUSDT", "SUIUSDT",
  "TRXUSDT", "TONUSDT", "DOTUSDT", "BCHUSDT", "LTCUSDT",
  "NEARUSDT", "UNIUSDT", "APTUSDT", "WLDUSDT", "ARBUSDT",
];

function setDataMode(mode) {
  activeDataMode = mode === DataMode.LIVE ? DataMode.LIVE : DataMode.MOCK;
  return activeDataMode;
}

function getDataMode() {
  return activeDataMode;
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function fetchKlines(pair, interval = "1h", limit = 240) {
  const rows = await fetchJson(`${BINANCE_FAPI}/fapi/v1/klines?symbol=${pair}&interval=${interval}&limit=${limit}`);
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

async function fetchPrice(pair) {
  const data = await fetchJson(`${BINANCE_FAPI}/fapi/v1/ticker/price?symbol=${pair}`);
  return Number(data.price);
}

function average(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function emaValue(values, period) {
  if (values.length < period) return NaN;
  const k = 2 / (period + 1);
  let current = average(values.slice(0, period));
  for (let index = period; index < values.length; index += 1) {
    current = values[index] * k + current * (1 - k);
  }
  return current;
}

function atrValue(candles, period = 14) {
  if (candles.length < period + 1) return NaN;
  const slice = candles.slice(-period);
  const trs = slice.map((candle, index) => {
    const prev = candles[candles.length - period + index - 1];
    return Math.max(candle.high - candle.low, Math.abs(candle.high - prev.close), Math.abs(candle.low - prev.close));
  });
  return average(trs);
}

function vwapValue(candles, lookback = 48) {
  const slice = candles.slice(-lookback);
  const totals = slice.reduce((acc, candle) => {
    const typical = (candle.high + candle.low + candle.close) / 3;
    acc.pv += typical * candle.volume;
    acc.volume += candle.volume;
    return acc;
  }, { pv: 0, volume: 0 });
  return totals.volume ? totals.pv / totals.volume : NaN;
}

function rsiValue(values, period = 14) {
  if (values.length < period + 1) return NaN;
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

async function liveCoinAnalysis(pair, interval = "1h") {
  const [candles, premium, ticker, book] = await Promise.all([
    fetchKlines(pair, interval),
    fetchJson(`${BINANCE_FAPI}/fapi/v1/premiumIndex?symbol=${pair}`).catch(() => ({ lastFundingRate: "0" })),
    fetchJson(`${BINANCE_FAPI}/fapi/v1/ticker/24hr?symbol=${pair}`).catch(() => ({ priceChangePercent: "0" })),
    fetchJson(`${BINANCE_FAPI}/fapi/v1/ticker/bookTicker?symbol=${pair}`).catch(() => ({ bidPrice: "0", askPrice: "0" })),
  ]);
  const closes = candles.map((candle) => candle.close);
  const last = candles.at(-1);
  const ema20 = emaValue(closes, 20);
  const ema50 = emaValue(closes, 50);
  const ema200 = emaValue(closes, 200);
  const atr = atrValue(candles);
  const vwap = vwapValue(candles);
  const recent = candles.slice(-120);
  const support = Math.min(...recent.map((candle) => candle.low));
  const resistance = Math.max(...recent.map((candle) => candle.high));
  const bid = Number(book.bidPrice);
  const ask = Number(book.askPrice);
  const spread = bid && ask ? ((ask - bid) / ((ask + bid) / 2)) * 100 : 0.03;
  const avgVolume = average(candles.slice(-21, -1).map((candle) => candle.volume));
  const volumeRatio = avgVolume ? last.volume / avgVolume : 1;
  const directionBias = last.close >= vwap && ema20 >= ema50 ? Direction.LONG : Direction.SHORT;
  const roomLongAtr = atr ? (resistance - last.close) / atr : 0;
  const roomShortAtr = atr ? (last.close - support) / atr : 0;

  return {
    pair,
    price: last.close,
    directionBias,
    timeframe: interval,
    aboveVwap: last.close >= vwap,
    vwapDistanceAtr: atr ? Math.abs(last.close - vwap) / atr : 0,
    emaAligned: directionBias === Direction.LONG ? ema20 > ema50 && ema50 > ema200 : ema20 < ema50 && ema50 < ema200,
    rsi: rsiValue(closes),
    macd: emaValue(closes, 12) - emaValue(closes, 26),
    adx: 22,
    atrPct: atr ? (atr / last.close) * 100 : 0,
    volumeRatio,
    oiLabel: "unknown",
    oiChange: 0,
    funding: Number(premium.lastFundingRate) * 100,
    spread,
    roomLongAtr,
    roomShortAtr,
    nearSupport: atr ? (last.close - support) / atr < 0.8 : false,
    nearResistance: atr ? (resistance - last.close) / atr < 0.8 : false,
    btcAligned: true,
    dayChange: Number(ticker.priceChangePercent),
  };
}

async function getCoinAnalyses({ mode = activeDataMode, pairs = null, interval = "1h" } = {}) {
  if (mode === DataMode.MOCK) return window.CockpitCoinAnalysis.buildCoinAnalyses();
  const universe = pairs || DEFAULT_LIVE_UNIVERSE;
  const analyses = await Promise.allSettled(universe.map((pair) => liveCoinAnalysis(pair, interval)));
  return analyses
    .filter((result) => result.status === "fulfilled")
    .map((result) => window.CockpitCoinAnalysis.analyzeMockCoin(result.value));
}

window.CockpitDataAdapter = {
  DataMode,
  setDataMode,
  getDataMode,
  fetchKlines,
  fetchPrice,
  liveCoinAnalysis,
  getCoinAnalyses,
  DEFAULT_LIVE_UNIVERSE,
};
