const API = "https://fapi.binance.com";
const STORAGE_KEY = "fade-lab-trades-v1";
const JOURNAL_KEY = "fade-lab-journal-v1";
const TRIGGER_REJECTION_PCT = 0.35;
const TRIGGER_INVALIDATION_PCT = 1.25;
const TRIGGER_EXPIRES_MS = 60 * 60 * 1000;
const AUTO_CLOSE_AFTER_MS = 24 * 60 * 60 * 1000;

const els = {
  scanButton: document.querySelector("#scanButton"),
  clearTradesButton: document.querySelector("#clearTradesButton"),
  clearJournalButton: document.querySelector("#clearJournalButton"),
  exportJournalButton: document.querySelector("#exportJournalButton"),
  scanStatus: document.querySelector("#scanStatus"),
  candidates: document.querySelector("#candidates"),
  waitingTrades: document.querySelector("#waitingTrades"),
  openTrades: document.querySelector("#openTrades"),
  journal: document.querySelector("#journal"),
  journalAnalysis: document.querySelector("#journalAnalysis"),
  journalPeriods: document.querySelector("#journalPeriods"),
  journalExcursion: document.querySelector("#journalExcursion"),
  journalConclusion: document.querySelector("#journalConclusion"),
  limitInput: document.querySelector("#limitInput"),
  minPumpInput: document.querySelector("#minPumpInput"),
  minFadeInput: document.querySelector("#minFadeInput"),
  tabs: document.querySelectorAll(".tab"),
  scannerView: document.querySelector("#scannerView"),
  journalView: document.querySelector("#journalView"),
  chartTitle: document.querySelector("#chartTitle"),
  chartStatus: document.querySelector("#chartStatus"),
  chart: document.querySelector("#priceChart"),
  intervalButtons: document.querySelectorAll("[data-interval]"),
  appSubtitle: document.querySelector("#appSubtitle"),
  strategyEyebrow: document.querySelector("#strategyEyebrow"),
  strategyTitle: document.querySelector("#strategyTitle"),
  strategyDescription: document.querySelector("#strategyDescription"),
  strategyBadge: document.querySelector("#strategyBadge"),
  candidateTitle: document.querySelector("#candidateTitle"),
  waitingTitle: document.querySelector("#waitingTitle"),
  openTitle: document.querySelector("#openTitle"),
  primaryFilterLabel: document.querySelector("#primaryFilterLabel"),
  secondaryFilterLabel: document.querySelector("#secondaryFilterLabel"),
};

let trades = loadTrades();
let journal = loadJournal();
let priceCache = new Map();
let priceSocket = null;
let socketSymbolsKey = "";
let selectedSymbol = "";
let selectedInterval = "15m";
let chartCandles = [];
let chartLevels = null;
let chartRequestId = 0;
let chart = null;
let candleSeries = null;
let levelLines = [];
let chartPrecision = 5;
let reconcileInFlight = false;
let lastReconcileAt = 0;
let journalExcursionBackfillInFlight = false;
let autoCloseInFlight = false;
let scannerSide = "SHORT";
let lastCandidates = { SHORT: [], LONG: [] };

function fmt(value, digits = 5) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "-";
  return number.toLocaleString("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: number < 1 ? Math.min(digits, 5) : 2,
  });
}

function pct(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "-";
  const sign = number > 0 ? "+" : "";
  return `${sign}${number.toFixed(2)}%`;
}

function maeDisplay(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "-";
  return pct(-Math.abs(number));
}

function triggerConfirmationPrice(triggerPrice) {
  return Number(triggerPrice) * (1 - TRIGGER_REJECTION_PCT / 100);
}

function triggerInvalidationPrice(trade) {
  if (trade.side === "LONG") return Number(trade.stop);
  return Math.min(
    Number(trade.stop) || Infinity,
    Number(trade.triggerPrice) * (1 + TRIGGER_INVALIDATION_PCT / 100),
  );
}

function shortTargetBelow(entry, candidates) {
  const valid = candidates
    .map(Number)
    .filter((price) => Number.isFinite(price) && price > 0 && price < entry)
    .sort((a, b) => b - a);
  return valid[0] || entry * 0.96;
}

function longTargetAbove(entry, candidates) {
  const valid = candidates
    .map(Number)
    .filter((price) => Number.isFinite(price) && price > entry)
    .sort((a, b) => a - b);
  return valid[0] || entry * 1.04;
}

function tradePnlPct(trade, price) {
  const entry = Number(trade.entry);
  const current = Number(price);
  if (!(entry > 0) || !(current > 0)) return 0;
  return trade.side === "LONG"
    ? ((current - entry) / entry) * 100
    : ((entry - current) / entry) * 100;
}

function favorableExcursionPct(trade, price) {
  return Math.max(0, trade.side === "LONG"
    ? ((Number(price) - Number(trade.entry)) / Number(trade.entry)) * 100
    : ((Number(trade.entry) - Number(price)) / Number(trade.entry)) * 100);
}

function adverseExcursionPct(trade, price) {
  return Math.max(0, trade.side === "LONG"
    ? ((Number(trade.entry) - Number(price)) / Number(trade.entry)) * 100
    : ((Number(price) - Number(trade.entry)) / Number(trade.entry)) * 100);
}

function tradeBasePrice(trade) {
  return Number(trade.entry || trade.triggerPrice || trade.setupRetest || 0);
}

function normalizeTrade(trade) {
  const base = tradeBasePrice(trade);
  if (!Number.isFinite(base) || base <= 0) return trade;
  trade.side ||= "SHORT";
  if (trade.side === "LONG") {
    if (!Number.isFinite(Number(trade.tp2)) || Number(trade.tp2) <= base) {
      trade.tp2 = longTargetAbove(base, [base * 1.04]);
    }
    if (!Number.isFinite(Number(trade.tp1)) || Number(trade.tp1) <= base) {
      trade.tp1 = longTargetAbove(base, [base * 1.015, trade.tp2 * 0.98, base * 1.02]);
    }
    if (!Number.isFinite(Number(trade.stop)) || Number(trade.stop) >= base) {
      trade.stop = base * 0.965;
    }
    return trade;
  }
  if (!Number.isFinite(Number(trade.tp2)) || Number(trade.tp2) >= base) {
    trade.tp2 = shortTargetBelow(base, [base * 0.96]);
  }
  if (!Number.isFinite(Number(trade.tp1)) || Number(trade.tp1) >= base) {
    trade.tp1 = shortTargetBelow(base, [base * 0.985, trade.tp2 * 1.02, base * 0.98]);
  }
  if (!Number.isFinite(Number(trade.stop)) || Number(trade.stop) <= base) {
    trade.stop = base * 1.035;
  }
  return trade;
}

function inferTradeSide(trade) {
  const looksLikeLong = trade.triggerPhase === "WAIT_BREAKOUT" ||
    typeof trade.setupHigherLow === "boolean" ||
    Number(trade.setupSweepLow) > 0 ||
    String(trade.backfillNote || "").toLowerCase().includes("long");
  if (looksLikeLong) trade.side = "LONG";
  else trade.side ||= "SHORT";
  return trade;
}

function normalizeAllTrades() {
  trades = trades.map(inferTradeSide).map(normalizeTrade);
  journal = journal.map(inferTradeSide).map(normalizeTrade);
  saveTrades();
  saveJournal();
}

function pricePrecisionFor(value) {
  const number = Math.abs(Number(value));
  if (!Number.isFinite(number) || number === 0) return 5;
  if (number < 0.00001) return 10;
  if (number < 0.0001) return 9;
  if (number < 0.001) return 8;
  if (number < 0.01) return 7;
  if (number < 0.1) return 6;
  if (number < 1) return 5;
  if (number < 10) return 4;
  return 2;
}

function minMoveForPrecision(precision) {
  return Number(`1e-${precision}`);
}

async function getJson(path) {
  const response = await fetch(`${API}${path}`);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

function loadTrades() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function loadJournal() {
  try {
    return JSON.parse(localStorage.getItem(JOURNAL_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTrades() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
}

function saveJournal() {
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(journal));
}

function klineToCandle(kline) {
  return {
    time: kline[0],
    open: Number(kline[1]),
    high: Number(kline[2]),
    low: Number(kline[3]),
    close: Number(kline[4]),
    volume: Number(kline[5]),
    quoteVolume: Number(kline[7]),
  };
}

function candleToChartPoint(candle) {
  return {
    time: Math.floor(candle.time / 1000),
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
  };
}

function selectSymbol(symbol, levels = null) {
  if (!symbol) return;
  selectedSymbol = symbol;
  chartLevels = levels;
  markSelectedCards();
  loadChart(symbol);
}

function markSelectedCards() {
  document.querySelectorAll("[data-symbol-card]").forEach((card) => {
    card.classList.toggle("selected", card.dataset.symbolCard === selectedSymbol);
  });
}

async function loadChart(symbol) {
  const requestId = ++chartRequestId;
  els.chartTitle.textContent = `${symbol} graf`;
  els.chartStatus.textContent = `Nacitavam ${selectedInterval} sviecky...`;
  renderChart([]);

  try {
    const raw = await getJson(`/fapi/v1/klines?symbol=${symbol}&interval=${selectedInterval}&limit=120`);
    if (requestId !== chartRequestId) return;
    chartCandles = raw.map(klineToCandle);
    els.chartStatus.textContent = `${selectedInterval} / ${chartCandles.length} sviecok`;
    renderChart(chartCandles);
  } catch (error) {
    if (requestId !== chartRequestId) return;
    chartCandles = [];
    els.chartStatus.textContent = `Graf sa nepodarilo nacitat: ${error.message}`;
    renderChart([]);
  }
}

function ensureChart() {
  if (!window.LightweightCharts) {
    els.chartStatus.textContent = "Chart kniznica sa nenacitala. Skontroluj internet/CDN.";
    return false;
  }

  if (chart && candleSeries) return true;

  chart = LightweightCharts.createChart(els.chart, {
    autoSize: true,
    layout: {
      background: { color: "#11151c" },
      textColor: "#98a2b3",
    },
    grid: {
      vertLines: { color: "#252b36" },
      horzLines: { color: "#252b36" },
    },
    rightPriceScale: {
      borderColor: "#303642",
      scaleMargins: { top: 0.12, bottom: 0.12 },
    },
    timeScale: {
      borderColor: "#303642",
      timeVisible: true,
      secondsVisible: false,
    },
    crosshair: {
      mode: LightweightCharts.CrosshairMode.Normal,
    },
  });

  const candleOptions = {
    upColor: "#37d399",
    downColor: "#ff647c",
    borderUpColor: "#37d399",
    borderDownColor: "#ff647c",
    wickUpColor: "#37d399",
    wickDownColor: "#ff647c",
    priceLineColor: "#71a7ff",
  };

  candleSeries = chart.addCandlestickSeries
    ? chart.addCandlestickSeries(candleOptions)
    : chart.addSeries(LightweightCharts.CandlestickSeries, candleOptions);

  return true;
}

function renderChart(candles) {
  if (!ensureChart()) return;

  levelLines.forEach((line) => candleSeries.removePriceLine(line));
  levelLines = [];

  const referencePrices = [
    ...candles.slice(-20).flatMap((candle) => [candle.open, candle.high, candle.low, candle.close]),
    ...(chartLevels ? Object.values(chartLevels) : []),
  ].filter(Number.isFinite);
  const referencePrice = referencePrices.length ? Math.min(...referencePrices.map((value) => Math.abs(value)).filter((value) => value > 0)) : 1;
  chartPrecision = pricePrecisionFor(referencePrice);
  candleSeries.applyOptions({
    priceFormat: {
      type: "price",
      precision: chartPrecision,
      minMove: minMoveForPrecision(chartPrecision),
    },
  });

  candleSeries.setData(candles.map(candleToChartPoint));

  const addLine = (price, title, color) => {
    if (!Number.isFinite(price)) return;
    levelLines.push(candleSeries.createPriceLine({
      price,
      color,
      lineWidth: 1,
      lineStyle: LightweightCharts.LineStyle.Dashed,
      axisLabelVisible: true,
      title: `${title} ${Number(price).toFixed(chartPrecision)}`,
    }));
  };

  if (chartLevels) {
    addLine(chartLevels.retest, chartLevels.side === "LONG" ? "long breakout" : "short trigger", "#f5c451");
    addLine(chartLevels.stop, "stop", "#ff647c");
    addLine(chartLevels.tp2, "TP fade", "#37d399");
  }

  if (candles.length) {
    chart.timeScale().fitContent();
  }
}

function findPumpOrigin(candles, peakIndex) {
  const lookback = candles.slice(0, Math.max(1, peakIndex));
  let originIndex = Math.max(0, peakIndex - 1);

  for (let index = peakIndex - 1; index >= 1; index -= 1) {
    const candle = candles[index];
    const previous = candles[index - 1];
    const impulse = ((candle.high - previous.close) / previous.close) * 100;
    const volumeSpike = candle.quoteVolume > previous.quoteVolume * 2.2;
    if (impulse > 4 || volumeSpike) originIndex = index - 1;
  }

  const localLow = lookback
    .slice(Math.max(0, originIndex - 4), peakIndex + 1)
    .reduce((min, candle) => Math.min(min, candle.low), candles[originIndex].low);

  return {
    price: localLow,
    index: originIndex,
  };
}

function lowerHighs(candles) {
  const recent = candles.slice(-18);
  const pivots = [];
  for (let index = 1; index < recent.length - 1; index += 1) {
    if (recent[index].high > recent[index - 1].high && recent[index].high > recent[index + 1].high) {
      pivots.push(recent[index].high);
    }
  }
  if (pivots.length < 2) return false;
  return pivots[pivots.length - 1] < pivots[pivots.length - 2];
}

function averageTrueRange(candles, period = 14) {
  const sample = candles.slice(-(period + 1));
  if (sample.length < 2) return 0;
  const ranges = sample.slice(1).map((candle, index) => {
    const previousClose = sample[index].close;
    return Math.max(
      candle.high - candle.low,
      Math.abs(candle.high - previousClose),
      Math.abs(candle.low - previousClose),
    );
  });
  return ranges.reduce((sum, value) => sum + value, 0) / ranges.length;
}

function bestResistanceAbove(candles, last, atr) {
  const recent = candles.slice(-64);
  const tolerance = Math.max(atr * 0.4, last * 0.0025);
  const pivots = [];

  for (let index = 1; index < recent.length - 1; index += 1) {
    const candle = recent[index];
    if (candle.high <= last) continue;
    if (candle.high >= recent[index - 1].high && candle.high >= recent[index + 1].high) {
      pivots.push({ price: candle.high, recency: index / recent.length });
    }
  }

  const zones = [];
  for (const pivot of pivots) {
    let zone = zones.find((item) => Math.abs(item.price - pivot.price) <= tolerance);
    if (!zone) {
      zone = { price: pivot.price, touches: 0, recency: 0 };
      zones.push(zone);
    }
    zone.price = ((zone.price * zone.touches) + pivot.price) / (zone.touches + 1);
    zone.touches += 1;
    zone.recency = Math.max(zone.recency, pivot.recency);
  }

  const ranked = zones
    .map((zone) => {
      const distanceAtr = atr > 0 ? (zone.price - last) / atr : (zone.price - last) / last * 100;
      const idealDistancePenalty = Math.abs(distanceAtr - 1.5);
      return {
        ...zone,
        distanceAtr,
        score: zone.touches * 5 + zone.recency * 3 - idealDistancePenalty,
      };
    })
    .filter((zone) => zone.distanceAtr >= 0.2 && zone.distanceAtr <= 4)
    .sort((a, b) => b.score - a.score);

  if (ranked.length) return ranked[0];

  const fallbackDistance = Math.max(atr || 0, last * 0.01);
  const recentHighs = recent.map((candle) => candle.high).filter((price) => price > last + fallbackDistance * 0.25);
  const nearestHigh = recentHighs.sort((a, b) => a - b)[0];
  const price = nearestHigh || last + fallbackDistance;
  return {
    price,
    touches: nearestHigh ? 1 : 0,
    recency: 0,
    distanceAtr: atr > 0 ? (price - last) / atr : 1,
    score: 0,
  };
}

function analyzeSymbol(ticker, candles) {
  const last = Number(ticker.lastPrice);
  const high24 = Number(ticker.highPrice);
  const low24 = Number(ticker.lowPrice);
  const change24 = Number(ticker.priceChangePercent);
  const peakIndex = candles.reduce((best, candle, index) => candle.high > candles[best].high ? index : best, 0);
  const peak = candles[peakIndex].high;
  const origin = findPumpOrigin(candles, peakIndex);
  const pumpPct = ((peak - origin.price) / origin.price) * 100;
  const fadeFromPeak = ((peak - last) / peak) * 100;
  const last12 = candles.slice(-12);
  const recentSupport = Math.min(...last12.slice(0, -2).map((candle) => candle.low));
  const brokeSupport = last < recentSupport;
  const weakBounce = lowerHighs(candles);
  const range = high24 - low24;
  const rangePosition = range > 0 ? ((last - low24) / range) * 100 : 50;
  const atr = averageTrueRange(candles);
  const resistance = recentSupport > last ? null : bestResistanceAbove(candles, last, atr);
  const retest = recentSupport > last ? recentSupport : resistance.price;
  const retestSource = recentSupport > last ? "broken support retest" : "best resistance";
  const stop = Math.max(retest * 1.035, last * 1.025);
  const priorCandles = candles.slice(0, -4);
  const priorLow = priorCandles.length ? Math.min(...priorCandles.map((candle) => candle.low)) : low24;
  const tp2 = shortTargetBelow(retest, [origin.price, low24, priorLow, last * 0.96, retest * 0.96]);
  const tp1 = shortTargetBelow(retest, [last * 0.985, retest * 0.98, tp2 * 1.02]);
  const originValidForShort = origin.price < retest;
  const atrPct = atr > 0 ? (atr / last) * 100 : 0;
  const distanceBelowRetestAtr = brokeSupport && atr > 0 ? Math.max(0, (retest - last) / atr) : 0;
  const fadeConsumed = pumpPct > 0 ? fadeFromPeak / pumpPct : 1;
  const recentVolume = avgFor(candles.slice(-4), (candle) => candle.quoteVolume || 0) || 0;
  const baseVolume = avgFor(candles.slice(-16, -4), (candle) => candle.quoteVolume || 0) || 0;
  const volumeRatio = baseVolume > 0 ? recentVolume / baseVolume : 1;
  const expectedEntry = triggerConfirmationPrice(retest);
  const reward = Math.max(0, expectedEntry - tp2);
  const risk = Math.max(0, stop - expectedEntry);
  const rewardRisk = risk > 0 ? reward / risk : 0;
  const quoteVolume24 = Number(ticker.quoteVolume) || 0;

  let score = 0;
  score += Math.min(15, Math.max(0, pumpPct * 0.15));
  if (fadeConsumed >= 0.15 && fadeConsumed <= 0.65) score += 15;
  else if (fadeConsumed <= 0.8) score += 7;
  else score -= 10;
  score += weakBounce ? 15 : -3;
  if (brokeSupport && distanceBelowRetestAtr <= 0.75) score += 10;
  else if (brokeSupport && distanceBelowRetestAtr <= 1.25) score += 3;
  else if (brokeSupport) score -= 15;
  else score += 4;
  score += volumeRatio >= 1.3 ? 10 : volumeRatio >= 1 ? 6 : 0;
  if (rangePosition >= 18 && rangePosition <= 55) score += 10;
  else if (rangePosition >= 10) score += 2;
  else score -= 12;
  score += rewardRisk >= 2.5 ? 15 : rewardRisk >= 2 ? 12 : rewardRisk >= 1.5 ? 6 : -12;
  score += quoteVolume24 >= 50_000_000 ? 10 : quoteVolume24 >= 10_000_000 ? 6 : 0;
  score += change24 <= -40 ? -18 : change24 <= -25 ? -10 : change24 <= -15 ? -4 : 0;
  score = Math.max(0, Math.min(100, Math.round(score)));
  const overextended = distanceBelowRetestAtr > 1.25 || rangePosition < 10 || fadeConsumed > 0.85;
  const marketAllowed = !overextended && weakBounce && rewardRisk >= 1.5;
  const marketBlockReason = overextended ? "extended" : !weakBounce ? "bez lower high" : rewardRisk < 1.5 ? "slabé R:R" : "";
  const scoreGrade = score >= 75 ? "A" : score >= 60 ? "B" : "C";

  return {
    side: "SHORT",
    symbol: ticker.symbol,
    last,
    change24,
    high24,
    low24,
    peak,
    pumpPct,
    fadeFromPeak,
    recentSupport,
    brokeSupport,
    weakBounce,
    rangePosition,
    score,
    scoreGrade,
    overextended,
    marketAllowed,
    marketBlockReason,
    atrPct,
    distanceBelowRetestAtr,
    fadeConsumed,
    volumeRatio,
    rewardRisk,
    quoteVolume24,
    retest,
    retestSource,
    resistanceTouches: resistance?.touches || 0,
    resistanceDistanceAtr: resistance?.distanceAtr || 0,
    stop,
    tp1,
    tp2,
    originPrice: origin.price,
    originValidForShort,
  };
}

function higherLows(candles) {
  const recent = candles.slice(-24);
  const pivots = [];
  for (let index = 1; index < recent.length - 1; index += 1) {
    if (recent[index].low < recent[index - 1].low && recent[index].low < recent[index + 1].low) {
      pivots.push(recent[index].low);
    }
  }
  return pivots.length >= 2 && pivots[pivots.length - 1] > pivots[pivots.length - 2];
}

function analyzeLongSymbol(ticker, candles) {
  const last = Number(ticker.lastPrice);
  const high24 = Number(ticker.highPrice);
  const low24 = Number(ticker.lowPrice);
  const change24 = Number(ticker.priceChangePercent);
  const atr = averageTrueRange(candles);
  const recent = candles.slice(-48);
  const sweep = recent.reduce((lowest, candle) => candle.low < lowest.low ? candle : lowest, recent[0]);
  const sweepLow = sweep.low;
  const dumpFromHigh = high24 > 0 ? ((high24 - last) / high24) * 100 : 0;
  const bounceFromLow = sweepLow > 0 ? ((last - sweepLow) / sweepLow) * 100 : 0;
  const range = high24 - low24;
  const rangePosition = range > 0 ? ((last - low24) / range) * 100 : 0;
  const hasHigherLow = higherLows(candles);
  const baseVolume = avgFor(recent.slice(-28, -8), (candle) => candle.quoteVolume || 0) || 0;
  const climaxVolume = Math.max(...recent.slice(-8).map((candle) => candle.quoteVolume || 0));
  const capitulationVolumeRatio = baseVolume > 0 ? climaxVolume / baseVolume : 1;
  const resistance = bestResistanceAbove(candles, last, atr);
  const triggerPrice = resistance.price;
  const stop = Math.min(sweepLow * 0.995, last - Math.max(atr * 0.75, last * 0.012));
  const expectedRisk = Math.max(triggerPrice - stop, atr || triggerPrice * 0.02);
  const tp1 = triggerPrice + Math.max(expectedRisk, atr * 0.9);
  const tp2 = triggerPrice + Math.max(expectedRisk * 2, atr * 1.8);
  const triggerDistanceAtr = atr > 0 ? (triggerPrice - last) / atr : 1;
  const quoteVolume24 = Number(ticker.quoteVolume) || 0;
  const marketRisk = Math.max(last - stop, 0);
  const marketRewardRisk = marketRisk > 0 ? (tp2 - last) / marketRisk : 0;

  let score = 0;
  score += capitulationVolumeRatio >= 2.5 ? 20 : capitulationVolumeRatio >= 1.6 ? 14 : capitulationVolumeRatio >= 1.2 ? 7 : 0;
  score += hasHigherLow ? 20 : -8;
  if (bounceFromLow >= 1 && bounceFromLow <= 7) score += 15;
  else if (bounceFromLow <= 10) score += 7;
  else score -= 12;
  if (rangePosition >= 5 && rangePosition <= 35) score += 12;
  else if (rangePosition < 3) score -= 12;
  else if (rangePosition > 50) score -= 8;
  score += triggerDistanceAtr >= 0.2 && triggerDistanceAtr <= 2.2 ? 12 : -6;
  score += resistance.touches >= 2 ? 10 : resistance.touches === 1 ? 5 : 0;
  score += quoteVolume24 >= 50_000_000 ? 10 : quoteVolume24 >= 10_000_000 ? 6 : 0;
  score += marketRewardRisk >= 2 ? 8 : marketRewardRisk >= 1.5 ? 4 : -6;
  score += change24 <= -55 ? -15 : change24 <= -35 ? -7 : 0;
  score = Math.max(0, Math.min(100, Math.round(score)));

  const overextended = bounceFromLow > 10 || rangePosition > 50 || triggerDistanceAtr > 3;
  const marketAllowed = !overextended && hasHigherLow && capitulationVolumeRatio >= 1.3 && marketRewardRisk >= 1.5;
  const marketBlockReason = overextended ? "bounce extended" : !hasHigherLow ? "bez higher low" : capitulationVolumeRatio < 1.3 ? "bez volume climax" : "slabé R:R";

  return {
    side: "LONG",
    symbol: ticker.symbol,
    last,
    change24,
    high24,
    low24,
    score,
    scoreGrade: score >= 75 ? "A" : score >= 60 ? "B" : "C",
    dumpFromHigh,
    bounceFromLow,
    rangePosition,
    hasHigherLow,
    capitulationVolumeRatio,
    quoteVolume24,
    retest: triggerPrice,
    triggerPrice,
    retestSource: "bottom reclaim breakout",
    resistanceTouches: resistance.touches,
    resistanceDistanceAtr: resistance.distanceAtr,
    stop,
    tp1,
    tp2,
    sweepLow,
    atrPct: atr > 0 ? atr / last * 100 : 0,
    rewardRisk: marketRewardRisk,
    marketAllowed,
    marketBlockReason,
    overextended,
    weakBounce: hasHigherLow,
    brokeSupport: false,
    pumpPct: Math.abs(change24),
    fadeFromPeak: dumpFromHigh,
    distanceBelowRetestAtr: triggerDistanceAtr,
    fadeConsumed: bounceFromLow,
    volumeRatio: capitulationVolumeRatio,
  };
}

async function scan() {
  const scanSide = scannerSide;
  els.scanButton.disabled = true;
  els.scanStatus.textContent = "Tahám tickery...";
  els.candidates.className = "list empty";
  els.candidates.textContent = "Skenujem Binance Futures.";

  try {
    const limit = Number(els.limitInput.value) || 10;
    const minPump = Number(els.minPumpInput.value) || 25;
    const minFade = Number(els.minFadeInput.value) || 8;
    const tickers = await getJson("/fapi/v1/ticker/24hr");
    const universe = tickers
      .filter((ticker) => ticker.symbol.endsWith("USDT") && !ticker.symbol.includes("_"))
      .sort((a, b) => Number(a.priceChangePercent) - Number(b.priceChangePercent))
      .slice(0, 150);

    els.scanStatus.textContent = `Analyzujem ${universe.length} top losers...`;

    const analyzed = [];
    const batchSize = 12;
    for (let index = 0; index < universe.length; index += batchSize) {
      const batch = universe.slice(index, index + batchSize);
      els.scanStatus.textContent = `Analyzujem ${Math.min(index + batch.length, universe.length)}/${universe.length}...`;
      const results = await Promise.allSettled(batch.map(async (ticker) => {
        const raw = await getJson(`/fapi/v1/klines?symbol=${ticker.symbol}&interval=15m&limit=96`);
        const candles = raw.map(klineToCandle);
        return scanSide === "LONG" ? analyzeLongSymbol(ticker, candles) : analyzeSymbol(ticker, candles);
      }));

      for (const result of results) {
        if (result.status !== "fulfilled") continue;
        const candidate = result.value;
        if (scanSide === "LONG") {
          const deepLoser = candidate.change24 <= -Math.abs(minPump);
          const reclaimedFromLow = candidate.bounceFromLow >= minFade;
          if (deepLoser && reclaimedFromLow) analyzed.push(candidate);
        } else {
          const looseTopLoser = candidate.change24 < 0 && candidate.fadeFromPeak >= minFade;
          const pumpThenFade = candidate.pumpPct >= minPump && candidate.fadeFromPeak >= minFade;
          if (looseTopLoser || pumpThenFade) analyzed.push(candidate);
        }
      }
    }

    const activeSymbols = activeTradeSymbols();
    const ranked = analyzed
      .filter((candidate) => !activeSymbols.has(candidate.symbol))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    lastCandidates[scanSide] = ranked;
    if (scannerSide === scanSide) {
      els.scanStatus.textContent = `${ranked.length} kandidátov`;
      renderCandidates(ranked);
    }
  } catch (error) {
    els.scanStatus.textContent = "Scan zlyhal";
    els.candidates.className = "list empty";
    els.candidates.textContent = error.message;
  } finally {
    els.scanButton.disabled = false;
  }
}

function activeTradeSymbols() {
  return new Set(
    trades
      .filter((trade) => trade.status === "WAITING" || trade.status === "OPEN")
      .map((trade) => trade.symbol),
  );
}

function coloredPct(value) {
  const number = Number(value);
  return `<span class="${number > 0 ? "good" : number < 0 ? "bad" : ""}">${pct(number)}</span>`;
}

function candidateCardHtml(item) {
  const isLong = item.side === "LONG";
  const structure = isLong
    ? `${item.hasHigherLow ? "higher low" : "bez higher low"} / volume climax ${item.capitulationVolumeRatio.toFixed(2)}× / ${item.overextended ? "BOUNCE NATIAHNUTÝ" : "skorý reclaim"}`
    : `${item.brokeSupport ? "breakdown" : "pullback"} / ${item.weakBounce ? "lower highs" : "bez lower-high potvrdenia"} / ${item.retestSource}${item.resistanceTouches ? ` (${item.resistanceTouches} dotyky)` : ""}`;
  const metrics = isLong ? `
    ${metric("Last", fmt(item.last))}${metric("24h", coloredPct(item.change24))}
    ${metric("Bounce od low", coloredPct(item.bounceFromLow))}${metric("Dump od high", coloredPct(-item.dumpFromHigh))}
    ${metric("R:R", `${item.rewardRisk.toFixed(2)}×`)}${metric("Breakout dist", `${item.distanceBelowRetestAtr.toFixed(2)} ATR`)}
    ${metric("Volume climax", `${item.capitulationVolumeRatio.toFixed(2)}×`)}${metric("Range pozícia", `${item.rangePosition.toFixed(0)}%`)}
  ` : `
    ${metric("Last", fmt(item.last))}${metric("24h", coloredPct(item.change24))}
    ${metric("Pump", coloredPct(item.pumpPct))}${metric("Od peak", coloredPct(-item.fadeFromPeak))}
    ${metric("R:R", `${item.rewardRisk.toFixed(2)}×`)}${metric("Od retestu", `${item.distanceBelowRetestAtr.toFixed(2)} ATR`)}
    ${metric("Volume", `${item.volumeRatio.toFixed(2)}×`)}${metric("Range pozícia", `${item.rangePosition.toFixed(0)}%`)}
  `;
  const triggerLabel = isLong ? "Breakout long" : item.retestSource === "best resistance" ? "Resistance entry" : "Retest entry";
  const marketLabel = item.marketAllowed ? `Market ${isLong ? "long" : "short"}` : `Market watch: ${item.marketBlockReason}`;
  return `
    <article class="card side-${isLong ? "long" : "short"}" data-symbol-card="${item.symbol}">
      <div class="row-top"><div><div class="symbol">${item.symbol}</div><div class="muted">${structure}</div></div><div class="score">${item.scoreGrade} · ${item.score}/100</div></div>
      <div class="metrics">${metrics}</div>
      <div class="levels">${metric(triggerLabel, fmt(item.retest))}${metric("Stop", fmt(item.stop))}${metric(isLong ? "TP bounce" : "TP fade", fmt(item.tp2))}</div>
      <div class="actions">
        <button data-action="market" data-symbol="${item.symbol}" ${item.marketAllowed ? "" : "disabled"}>${marketLabel}</button>
        <button data-action="trigger" data-symbol="${item.symbol}" data-trigger="${item.retest}">${isLong ? `Breakout long @ ${fmt(item.retest)}` : "Retest → rejection short"}</button>
      </div>
      <div class="note">${isLong ? "Long čaká na breakout nad micro resistance; stop ostáva pod sweep low." : "Short čaká na retest a návrat pod rejection confirm."}</div>
    </article>`;
}

function renderCandidates(items) {
  const activeSymbols = activeTradeSymbols();
  items = items.filter((item) => !activeSymbols.has(item.symbol));
  if (!items.length) {
    els.candidates.className = "list empty";
    els.candidates.textContent = "Nic nesplnilo filtre. Zníž min. pump alebo min. dump.";
    return;
  }

  els.candidates.className = "list";
  els.candidates.innerHTML = items.map(candidateCardHtml).join("");

  els.candidates.querySelectorAll("[data-symbol-card]").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;
      const item = items.find((candidate) => candidate.symbol === card.dataset.symbolCard);
      selectSymbol(card.dataset.symbolCard, item ? { side: item.side, retest: item.retest, stop: item.stop, tp2: item.tp2 } : null);
    });
  });

  els.candidates.querySelectorAll("button[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = items.find((candidate) => candidate.symbol === button.dataset.symbol);
      selectSymbol(item.symbol, { side: item.side, retest: item.retest, stop: item.stop, tp2: item.tp2 });
      addTrade(item, button.dataset.action, Number(button.dataset.trigger || item.last));
      renderCandidates(items);
    });
  });

  if (!selectedSymbol && items[0]) {
    selectSymbol(items[0].symbol, { retest: items[0].retest, stop: items[0].stop, tp2: items[0].tp2 });
  } else {
    markSelectedCards();
  }
}

function metric(label, value) {
  return `<div class="metric"><span>${label}</span><strong>${value}</strong></div>`;
}

function addTrade(candidate, mode, triggerPrice) {
  const trade = {
    id: crypto.randomUUID(),
    symbol: candidate.symbol,
    side: candidate.side || scannerSide,
    mode,
    status: mode === "market" ? "OPEN" : "WAITING",
    triggerPrice,
    entry: mode === "market" ? candidate.last : null,
    createdAt: Date.now(),
    openedAt: mode === "market" ? Date.now() : null,
    stop: candidate.stop,
    tp1: candidate.tp1,
    tp2: candidate.tp2,
    setupScore: candidate.score,
    setupChange24: candidate.change24,
    setupPumpPct: candidate.pumpPct,
    setupFadeFromPeak: candidate.fadeFromPeak,
    setupBrokeSupport: candidate.brokeSupport,
    setupWeakBounce: candidate.weakBounce,
    setupRetest: candidate.retest,
    setupRetestSource: candidate.retestSource,
    setupResistanceTouches: candidate.resistanceTouches,
    setupResistanceDistanceAtr: candidate.resistanceDistanceAtr,
    setupScoreGrade: candidate.scoreGrade,
    setupOverextended: candidate.overextended,
    setupMarketAllowed: candidate.marketAllowed,
    setupMarketBlockReason: candidate.marketBlockReason,
    setupAtrPct: candidate.atrPct,
    setupDistanceBelowRetestAtr: candidate.distanceBelowRetestAtr,
    setupFadeConsumed: candidate.fadeConsumed,
    setupVolumeRatio: candidate.volumeRatio,
    setupRewardRisk: candidate.rewardRisk,
    setupDumpFromHigh: candidate.dumpFromHigh,
    setupBounceFromLow: candidate.bounceFromLow,
    setupHigherLow: candidate.hasHigherLow,
    setupCapitulationVolumeRatio: candidate.capitulationVolumeRatio,
    setupSweepLow: candidate.sweepLow,
    mfe: 0,
    mae: 0,
    bestPrice: mode === "market" ? candidate.last : null,
    worstPrice: mode === "market" ? candidate.last : null,
    triggerPhase: mode === "trigger" ? (candidate.side === "LONG" ? "WAIT_BREAKOUT" : "WAIT_RETEST") : null,
    triggerTouchedAt: null,
    triggerExpiresAt: mode === "trigger" ? Date.now() + TRIGGER_EXPIRES_MS : null,
    triggerConfirmPrice: mode === "trigger" ? (candidate.side === "LONG" ? triggerPrice : triggerConfirmationPrice(triggerPrice)) : null,
    triggerInvalidationPrice: mode === "trigger" ? (candidate.side === "LONG" ? candidate.stop : Math.min(candidate.stop, triggerPrice * (1 + TRIGGER_INVALIDATION_PCT / 100))) : null,
    bounceHigh: null,
    firstMove: null,
    mfeHitAt: null,
    maeHitAt: null,
    mfeBeforeMae1Pct: 0,
    mfeBeforeMae2Pct: 0,
    mfeBeforeMae3Pct: 0,
    mae1HitAt: null,
    mae2HitAt: null,
    mae3HitAt: null,
    preMae1Ambiguous: false,
    preMae2Ambiguous: false,
    preMae3Ambiguous: false,
  };
  trades.unshift(trade);
  saveTrades();
  renderTrades();
  connectPriceSocket();
}

async function refreshTrades() {
  if (!trades.length) return;
  const now = Date.now();
  if (now - lastReconcileAt > 60_000) {
    await reconcileTrades();
  }
  const symbols = [...new Set(trades.map((trade) => trade.symbol))];
  await Promise.all(symbols.map(async (symbol) => {
    try {
      const ticker = await getJson(`/fapi/v1/ticker/price?symbol=${symbol}`);
      priceCache.set(symbol, Number(ticker.price));
    } catch {
      // Keep the previous display if a single symbol fails.
    }
  }));

  for (const trade of trades) {
    const price = priceCache.get(trade.symbol);
    if (!price) continue;

    updateTradeWithPrice(trade, price, now);
  }
  saveTrades();
  renderTrades();
  await autoCloseExpiredTrades(now);
}

async function getCandlesSince(symbol, startTime, endTime = Date.now()) {
  const candles = [];
  let cursor = Math.max(0, Number(startTime) || Date.now() - 60 * 60 * 1000);
  const maxLoops = 8;

  for (let loop = 0; loop < maxLoops && cursor < endTime; loop += 1) {
    const raw = await getJson(`/fapi/v1/klines?symbol=${symbol}&interval=1m&startTime=${Math.floor(cursor)}&endTime=${Math.floor(endTime)}&limit=1500`);
    if (!raw.length) break;
    const batch = raw.map(klineToCandle);
    candles.push(...batch);
    const next = batch[batch.length - 1].time + 60_000;
    if (next <= cursor) break;
    cursor = next;
    if (raw.length < 1500) break;
  }

  return candles;
}

async function reconcileTrades(force = false) {
  if (reconcileInFlight || !trades.length) return;
  reconcileInFlight = true;

  try {
    const now = Date.now();
    lastReconcileAt = now;
    for (const trade of trades) {
      normalizeTrade(trade);
      const start = Math.min(trade.createdAt || now, trade.openedAt || trade.createdAt || now) - 60_000;
      const lastSync = trade.reconciledAt || 0;
      const needsBackfill = force || !lastSync || now - lastSync > 60_000;
      if (!needsBackfill) continue;

      try {
        const candles = await getCandlesSince(trade.symbol, start, now);
        reconcileTradeFromCandles(trade, candles, now);
      } catch (error) {
        trade.reconcileError = error.message;
      }
    }
    saveTrades();
  } finally {
    reconcileInFlight = false;
  }
}

async function backfillJournalExcursions() {
  if (journalExcursionBackfillInFlight) return;
  const pending = journal.filter((item) =>
    !hasPreMae(item, 1) && item.openedAt && item.closedAt && Number(item.entry || item.triggerPrice) > 0
  );
  if (!pending.length) return;
  journalExcursionBackfillInFlight = true;

  try {
    const batchSize = 4;
    for (let index = 0; index < pending.length; index += batchSize) {
      const batch = pending.slice(index, index + batchSize);
      await Promise.allSettled(batch.map(async (item) => {
        const candles = await getCandlesSince(item.symbol, item.openedAt - 60_000, item.closedAt);
        reconcileTradeFromCandles(item, candles, item.closedAt);
      }));
      saveJournal();
      renderJournal();
    }
  } finally {
    journalExcursionBackfillInFlight = false;
  }
}

function reconcileTradeFromCandles(trade, candles, now = Date.now()) {
  if (!candles.length) return;
  normalizeTrade(trade);

  let openedAt = trade.openedAt || null;
  if (trade.mode === "trigger" && !openedAt) {
    if (trade.side === "LONG") {
      if (["INVALID", "EXPIRED"].includes(trade.status)) return;
      const expiresAt = Number(trade.triggerExpiresAt) || (Number(trade.createdAt) + TRIGGER_EXPIRES_MS);
      const triggerPrice = Number(trade.triggerPrice);
      const invalidationPrice = Number(trade.triggerInvalidationPrice) || Number(trade.stop);
      for (const candle of candles) {
        if (candle.time > expiresAt) {
          trade.status = "EXPIRED";
          trade.backfillNote = "Long breakout expiroval po 60 minútach.";
          break;
        }
        if (candle.low <= invalidationPrice) {
          trade.status = "INVALID";
          trade.backfillNote = "Sweep low zlyhalo ešte pred breakoutom; bez vstupu.";
          break;
        }
        if (candle.high >= triggerPrice) {
          trade.status = "OPEN";
          trade.triggerPhase = "CONFIRMED";
          trade.entry = triggerPrice;
          trade.openedAt = candle.time;
          trade.bestPrice = triggerPrice;
          trade.worstPrice = triggerPrice;
          openedAt = candle.time;
          trade.backfillNote = "Long otvorený po breakoute micro resistance.";
          break;
        }
      }
      trade.triggerExpiresAt = expiresAt;
      trade.triggerConfirmPrice = triggerPrice;
      trade.triggerInvalidationPrice = invalidationPrice;
      if (!openedAt) {
        if (!["INVALID", "EXPIRED"].includes(trade.status)) {
          trade.status = "WAITING";
          trade.triggerPhase = "WAIT_BREAKOUT";
          trade.backfillNote = "Čaká sa na potvrdený breakout nad micro resistance.";
        }
        trade.reconciledAt = now;
        trade.backfillCandles = candles.length;
        return;
      }
    } else {
    if (["INVALID", "EXPIRED"].includes(trade.status)) return;
    const expiresAt = Number(trade.triggerExpiresAt) || (Number(trade.createdAt) + TRIGGER_EXPIRES_MS);
    const confirmPrice = Number(trade.triggerConfirmPrice) || triggerConfirmationPrice(trade.triggerPrice);
    const invalidationPrice = Number(trade.triggerInvalidationPrice) || triggerInvalidationPrice(trade);
    let phase = trade.triggerPhase || "WAIT_RETEST";
    let touchedAt = trade.triggerTouchedAt || null;

    for (const candle of candles) {
      if (candle.time > expiresAt) {
        trade.status = "EXPIRED";
        trade.backfillNote = "Rejection trigger expiroval po 60 minútach.";
        break;
      }
      if (phase === "WAIT_RETEST" && candle.high >= trade.triggerPrice) {
        phase = "WAIT_REJECTION";
        touchedAt = candle.time;
        trade.triggerTouchedAt = touchedAt;
        trade.bounceHigh = candle.high;
      }
      if (phase !== "WAIT_REJECTION") continue;
      trade.bounceHigh = Math.max(Number(trade.bounceHigh) || 0, candle.high);
      if (candle.high >= invalidationPrice) {
        trade.status = "INVALID";
        trade.backfillNote = "Retest bol reclaimnutý nad invalidáciu; bez vstupu.";
        break;
      }
      if (candle.time > touchedAt && candle.low <= confirmPrice) {
        trade.status = "OPEN";
        phase = "CONFIRMED";
        trade.entry = confirmPrice;
        trade.openedAt = candle.time;
        trade.bestPrice = confirmPrice;
        trade.worstPrice = confirmPrice;
        openedAt = candle.time;
        trade.backfillNote = "Short otvorený až po reteste a potvrdenom rejection.";
        break;
      }
    }

    trade.triggerPhase = phase;
    trade.triggerConfirmPrice = confirmPrice;
    trade.triggerInvalidationPrice = invalidationPrice;
    trade.triggerExpiresAt = expiresAt;
    if (!openedAt) {
      if (!["INVALID", "EXPIRED"].includes(trade.status)) {
        trade.status = "WAITING";
        trade.backfillNote = phase === "WAIT_REJECTION"
          ? "Retest zasiahnutý; čaká sa na rejection confirmation."
          : "Čaká sa na retest short úrovne.";
      }
      trade.reconciledAt = now;
      trade.backfillCandles = candles.length;
      return;
    }
    }
  }

  if (trade.mode === "market" && !openedAt) {
    trade.openedAt = trade.createdAt || candles[0].time;
    openedAt = trade.openedAt;
  }

  if (trade.status !== "OPEN" || !trade.entry || !openedAt) {
    trade.reconciledAt = now;
    return;
  }

  const activeCandles = candles.filter((candle) => candle.time + 60_000 >= openedAt);
  if (!activeCandles.length) return;

  let bestPrice = Number(trade.bestPrice || trade.entry);
  let worstPrice = Number(trade.worstPrice || trade.entry);
  let mfeHitAt = trade.mfeHitAt || null;
  let maeHitAt = trade.maeHitAt || null;
  let ambiguousFirstMove = false;
  let preMaeBestPrice = Number(trade.entry);
  const preMae = {
    1: { value: 0, hitAt: null, ambiguous: false },
    2: { value: 0, hitAt: null, ambiguous: false },
    3: { value: 0, hitAt: null, ambiguous: false },
  };

  for (const candle of activeCandles) {
    const bestBeforeCandle = preMaeBestPrice;
    const mfeBeforeCandle = favorableExcursionPct(trade, bestBeforeCandle);

    for (const threshold of [1, 2, 3]) {
      const state = preMae[threshold];
      if (state.hitAt) continue;
      const candleMae = adverseExcursionPct(trade, trade.side === "LONG" ? candle.low : candle.high);
      const candleMfe = favorableExcursionPct(trade, trade.side === "LONG" ? candle.high : candle.low);
      if (candleMae >= threshold) {
        state.value = mfeBeforeCandle;
        state.hitAt = candle.time;
        state.ambiguous = candleMfe > mfeBeforeCandle;
      } else {
        state.value = Math.max(state.value, mfeBeforeCandle, candleMfe);
      }
    }
    preMaeBestPrice = trade.side === "LONG"
      ? Math.max(preMaeBestPrice, candle.high)
      : Math.min(preMaeBestPrice, candle.low);

    bestPrice = trade.side === "LONG" ? Math.max(bestPrice, candle.high) : Math.min(bestPrice, candle.low);
    worstPrice = trade.side === "LONG" ? Math.min(worstPrice, candle.low) : Math.max(worstPrice, candle.high);

    const hitMfe = trade.side === "LONG" ? candle.high >= trade.tp1 : candle.low <= trade.tp1;
    const hitMae = trade.side === "LONG" ? candle.low <= trade.stop : candle.high >= trade.stop;
    if (!mfeHitAt && hitMfe) mfeHitAt = candle.time;
    if (!maeHitAt && hitMae) maeHitAt = candle.time;
    if (hitMfe && hitMae && candle.time === mfeHitAt && candle.time === maeHitAt) {
      ambiguousFirstMove = true;
    }
  }

  trade.bestPrice = bestPrice;
  trade.worstPrice = worstPrice;
  trade.mfe = favorableExcursionPct(trade, bestPrice);
  trade.mae = adverseExcursionPct(trade, worstPrice);
  trade.mfeHitAt = mfeHitAt;
  trade.maeHitAt = maeHitAt;
  for (const threshold of [1, 2, 3]) {
    trade[`mfeBeforeMae${threshold}Pct`] = preMae[threshold].value;
    trade[`mae${threshold}HitAt`] = preMae[threshold].hitAt;
    trade[`preMae${threshold}Ambiguous`] = preMae[threshold].ambiguous;
  }

  if (ambiguousFirstMove) {
    trade.firstMove = "same 1m candle";
  } else if (mfeHitAt || maeHitAt) {
    trade.firstMove = mfeHitAt && (!maeHitAt || mfeHitAt <= maeHitAt) ? "MFE first" : "MAE first";
  }

  trade.reconciledAt = now;
  trade.backfillCandles = candles.length;
  trade.backfillNote = trade.backfillNote || "MFE/MAE dopočítané z 1m histórie.";
}

function updatePreMaeTracking(trade, currentMfe, currentMae, now) {
  for (const threshold of [1, 2, 3]) {
    const hitKey = `mae${threshold}HitAt`;
    const valueKey = `mfeBeforeMae${threshold}Pct`;
    if (trade[hitKey]) continue;
    if (currentMae >= threshold) {
      trade[hitKey] = now;
      trade[valueKey] = Math.max(0, Number(trade[valueKey]) || 0);
    } else {
      trade[valueKey] = Math.max(0, Number(trade[valueKey]) || 0, currentMfe);
    }
  }
}

function updateTradeWithPrice(trade, price, now = Date.now()) {
  if (trade.status === "WAITING" && trade.mode === "trigger") {
    if (trade.side === "LONG") {
      const expiresAt = Number(trade.triggerExpiresAt) || (Number(trade.createdAt) + TRIGGER_EXPIRES_MS);
      trade.triggerExpiresAt = expiresAt;
      trade.triggerPhase ||= "WAIT_BREAKOUT";
      if (now >= expiresAt) {
        trade.status = "EXPIRED";
        trade.backfillNote = "Long breakout expiroval po 60 minútach.";
        return;
      }
      if (price <= Number(trade.stop)) {
        trade.status = "INVALID";
        trade.backfillNote = "Sweep low zlyhalo ešte pred breakoutom; bez vstupu.";
        return;
      }
      if (price >= Number(trade.triggerPrice)) {
        trade.status = "OPEN";
        trade.triggerPhase = "CONFIRMED";
        trade.entry = price;
        trade.openedAt = now;
        trade.bestPrice = price;
        trade.worstPrice = price;
        trade.backfillNote = "Long otvorený po breakoute micro resistance.";
      }
    } else {
    const expiresAt = Number(trade.triggerExpiresAt) || (Number(trade.createdAt) + TRIGGER_EXPIRES_MS);
    const confirmPrice = Number(trade.triggerConfirmPrice) || triggerConfirmationPrice(trade.triggerPrice);
    const invalidationPrice = Number(trade.triggerInvalidationPrice) || triggerInvalidationPrice(trade);
    trade.triggerExpiresAt = expiresAt;
    trade.triggerConfirmPrice = confirmPrice;
    trade.triggerInvalidationPrice = invalidationPrice;
    trade.triggerPhase ||= "WAIT_RETEST";

    if (now >= expiresAt) {
      trade.status = "EXPIRED";
      trade.backfillNote = "Rejection trigger expiroval po 60 minútach.";
      return;
    }
    if (trade.triggerPhase === "WAIT_RETEST" && price >= trade.triggerPrice) {
      trade.triggerPhase = "WAIT_REJECTION";
      trade.triggerTouchedAt = now;
      trade.bounceHigh = price;
      trade.backfillNote = "Retest zasiahnutý; čaká sa na rejection confirmation.";
      return;
    }
    if (trade.triggerPhase === "WAIT_REJECTION") {
      trade.bounceHigh = Math.max(Number(trade.bounceHigh) || price, price);
      if (price >= invalidationPrice) {
        trade.status = "INVALID";
        trade.backfillNote = "Retest bol reclaimnutý nad invalidáciu; bez vstupu.";
        return;
      }
      if (price <= confirmPrice) {
        trade.status = "OPEN";
        trade.triggerPhase = "CONFIRMED";
        trade.entry = price;
        trade.openedAt = now;
        trade.bestPrice = price;
        trade.worstPrice = price;
        trade.backfillNote = "Short otvorený až po reteste a potvrdenom rejection.";
      }
    }
    }
  }

  if (trade.status !== "OPEN") return;

  trade.bestPrice = trade.side === "LONG"
    ? Math.max(trade.bestPrice ?? price, price)
    : Math.min(trade.bestPrice ?? price, price);
  trade.worstPrice = trade.side === "LONG"
    ? Math.min(trade.worstPrice ?? price, price)
    : Math.max(trade.worstPrice ?? price, price);
  trade.mfe = favorableExcursionPct(trade, trade.bestPrice);
  trade.mae = adverseExcursionPct(trade, trade.worstPrice);
  updatePreMaeTracking(trade, trade.mfe, trade.mae, now);

  const favorableThreshold = Math.max(1, Math.abs(((trade.entry - trade.tp1) / trade.entry) * 100));
  const adverseThreshold = Math.max(1, Math.abs(((trade.stop - trade.entry) / trade.entry) * 100));
  if (!trade.mfeHitAt && trade.mfe >= favorableThreshold) trade.mfeHitAt = now;
  if (!trade.maeHitAt && trade.mae >= adverseThreshold) trade.maeHitAt = now;
  if (!trade.firstMove && (trade.mfeHitAt || trade.maeHitAt)) {
    trade.firstMove = trade.mfeHitAt && (!trade.maeHitAt || trade.mfeHitAt <= trade.maeHitAt) ? "MFE first" : "MAE first";
  }
}

function connectPriceSocket() {
  const symbols = [...new Set(trades.map((trade) => trade.symbol.toLowerCase()))].sort();
  const key = symbols.join(",");
  if (key === socketSymbolsKey) return;
  socketSymbolsKey = key;

  if (priceSocket) {
    priceSocket.close();
    priceSocket = null;
  }

  if (!symbols.length) return;

  const streams = symbols.map((symbol) => `${symbol}@markPrice@1s`).join("/");
  priceSocket = new WebSocket(`wss://fstream.binance.com/stream?streams=${streams}`);
  priceSocket.onmessage = (event) => {
    const payload = JSON.parse(event.data);
    const data = payload.data || payload;
    const symbol = data.s;
    const price = Number(data.p);
    if (!symbol || !Number.isFinite(price)) return;

    priceCache.set(symbol, price);
    const now = Date.now();
    for (const trade of trades) {
      if (trade.symbol === symbol) updateTradeWithPrice(trade, price, now);
    }
    saveTrades();
    renderTrades();
  };
  priceSocket.onclose = () => {
    if (trades.length) setTimeout(connectPriceSocket, 1500);
  };
}

function tradeCardHtml(trade) {
  const price = priceCache.get(trade.symbol);
  const isOpen = trade.status === "OPEN" && Number.isFinite(Number(trade.entry));
  const currentPnl = isOpen && price ? tradePnlPct(trade, price) : null;
  const isLong = trade.side === "LONG";
  const statusText = trade.status === "WAITING"
    ? isLong ? "ČAKÁ NA BREAKOUT" : trade.triggerPhase === "WAIT_REJECTION" ? "RETEST HIT / ČAKÁ NA REJECTION" : "ČAKÁ NA RETEST"
    : trade.status;
  const pnlClass = isOpen ? currentPnl >= 0 ? "positive-bg" : "negative-bg" : "";
  const confirmValue = trade.mode === "trigger"
    ? isLong ? trade.triggerPrice : trade.triggerConfirmPrice || triggerConfirmationPrice(trade.triggerPrice)
    : null;
  return `
    <article class="card side-${isLong ? "long" : "short"} ${pnlClass}" data-symbol-card="${trade.symbol}" data-trade-id="${trade.id}">
      <div class="row-top"><div><div class="symbol">${trade.symbol}</div><div class="muted">${trade.side} / ${trade.mode.toUpperCase()} / ${statusText}</div></div><span class="badge">${trade.firstMove || "čaká sa"}</span></div>
      <div class="metrics">
        ${metric("Price", fmt(price))}${metric("Entry", isOpen ? fmt(trade.entry) : "čaká sa")}
        ${metric("PnL teraz", isOpen ? coloredPct(currentPnl) : "-")}${metric("MFE", isOpen ? `<span class="good">${pct(trade.mfe)}</span>` : "-")}
        ${metric("MAE", isOpen ? `<span class="bad">${maeDisplay(trade.mae)}</span>` : "-")}${metric("Auto close", isOpen ? formatDuration(Math.max(1000, AUTO_CLOSE_AFTER_MS - (Date.now() - Number(trade.openedAt)))) : "-")}
      </div>
      <div class="levels">
        ${metric(isLong ? "Breakout" : "Retest", fmt(trade.triggerPrice))}
        ${metric(isLong ? "Confirm" : "Rejection confirm", trade.mode === "trigger" ? fmt(confirmValue) : "market")}
        ${metric("Invalidácia", fmt(trade.triggerInvalidationPrice || trade.stop))}
      </div>
      <div class="levels">${metric("Stop", fmt(trade.stop))}${metric(isLong ? "TP bounce" : "TP fade", fmt(trade.tp2))}${metric("Setup score", `${trade.setupScore ?? "-"} / 100`)}</div>
      <div class="note">${trade.backfillNote || (isLong ? "Long čaká na potvrdenie dna a breakout." : "Short čaká na retest a rejection.")}</div>
      <div class="trade-actions"><button data-close="${trade.id}" ${isOpen ? "" : "disabled"}>Uzavrieť</button><button class="danger" data-remove="${trade.id}">Odstrániť</button></div>
    </article>`;
}

function renderTrades() {
  const sideTrades = trades.filter((trade) => (trade.side || "SHORT") === scannerSide);
  const waiting = sideTrades.filter((trade) => trade.status !== "OPEN");
  const open = sideTrades.filter((trade) => trade.status === "OPEN");
  const renderGroup = (root, items, emptyText) => {
    root.className = items.length ? "list" : "list empty";
    root.innerHTML = items.length ? items.map(tradeCardHtml).join("") : emptyText;
  };
  renderGroup(els.waitingTrades, waiting, "Žiadne čakajúce setupy.");
  renderGroup(els.openTrades, open, "Žiadne otvorené obchody.");

  [els.waitingTrades, els.openTrades].forEach((root) => {
    root.querySelectorAll("button[data-remove]").forEach((button) => {
      button.addEventListener("click", () => {
        trades = trades.filter((trade) => trade.id !== button.dataset.remove);
        saveTrades(); renderTrades(); connectPriceSocket();
      });
    });
    root.querySelectorAll("button[data-close]").forEach((button) => {
      button.addEventListener("click", async () => closeTrade(button.dataset.close));
    });
    root.querySelectorAll("[data-trade-id]").forEach((card) => {
      card.addEventListener("click", (event) => {
        if (event.target.closest("button")) return;
        const trade = trades.find((item) => item.id === card.dataset.tradeId);
        if (trade) selectSymbol(trade.symbol, { side: trade.side, retest: trade.entry || trade.triggerPrice, stop: trade.stop, tp2: trade.tp2 });
      });
    });
  });
  markSelectedCards();
}

async function closeTrade(id, closeReason = "MANUAL") {
  await reconcileTrades(true);
  const trade = trades.find((item) => item.id === id);
  if (!trade) return false;
  let price = priceCache.get(trade.symbol);
  try {
    const ticker = await getJson(`/fapi/v1/ticker/price?symbol=${trade.symbol}`);
    price = Number(ticker.price);
    priceCache.set(trade.symbol, price);
  } catch {
    // Fall back to the latest cached websocket/poll price.
  }
  if (closeReason === "AUTO_24H" && !Number.isFinite(Number(price))) return false;
  const closedAt = Date.now();
  const durationMs = (trade.openedAt || trade.createdAt) ? closedAt - (trade.openedAt || trade.createdAt) : 0;
  const pnl = trade.entry && price ? tradePnlPct(trade, price) : 0;

  journal.unshift({
    ...trade,
    closedAt,
    closePrice: price || null,
    pnl,
    durationMs,
    closeReason,
    resultTag: pnl > 0 ? "WIN" : pnl < 0 ? "LOSS" : "FLAT",
  });
  trades = trades.filter((item) => item.id !== id);
  saveTrades();
  saveJournal();
  renderTrades();
  renderJournal();
  connectPriceSocket();
  return true;
}

async function autoCloseExpiredTrades(now = Date.now()) {
  if (autoCloseInFlight) return;
  const expired = trades.filter((trade) =>
    trade.status === "OPEN" &&
    Number(trade.openedAt) > 0 &&
    now - Number(trade.openedAt) >= AUTO_CLOSE_AFTER_MS
  );
  if (!expired.length) return;
  autoCloseInFlight = true;
  try {
    for (const trade of expired) {
      await closeTrade(trade.id, "AUTO_24H");
    }
  } finally {
    autoCloseInFlight = false;
  }
}

function uniqueJournalItems() {
  return [...new Map(journal.map((item) => [item.id, item])).values()];
}

function avgFor(items, getter) {
  return items.length ? items.reduce((sum, item) => sum + getter(item), 0) / items.length : null;
}

function medianFor(values) {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function hasPreMae(item, threshold = 1) {
  return Number.isFinite(Number(item[`mfeBeforeMae${threshold}Pct`]));
}

function preMaeLabel(item, threshold = 1) {
  if (!hasPreMae(item, threshold)) return '<span class="muted">legacy</span>';
  const ambiguous = item[`preMae${threshold}Ambiguous`];
  const hit = item[`mae${threshold}HitAt`];
  const suffix = ambiguous ? " ~" : hit ? "" : " +";
  return `<span class="good">${pct(item[`mfeBeforeMae${threshold}Pct`])}${suffix}</span>`;
}

function journalDateKey(item) {
  return new Date(item.closedAt).toLocaleDateString("sv-SE");
}

function isoWeekKey(timestamp) {
  const date = new Date(timestamp);
  const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((utc - yearStart) / 86400000) + 1) / 7);
  return `${utc.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function renderJournal() {
  const items = uniqueJournalItems();
  renderJournalAnalysis(items);
  renderJournalPeriods(items);
  renderExcursionQuality(items);
  renderJournalConclusion(items);

  if (!items.length) {
    els.journal.className = "journal-days empty";
    els.journal.textContent = "Ziadne uzavrete sledovania.";
    return;
  }

  const days = new Map();
  for (const item of items) {
    const key = journalDateKey(item);
    if (!days.has(key)) days.set(key, []);
    days.get(key).push(item);
  }

  els.journal.className = "journal-days";
  els.journal.innerHTML = [...days.entries()].map(([date, dayItems]) => {
    const tracked = dayItems.filter((item) => hasPreMae(item));
    const avgPreMae = avgFor(tracked, (item) => Number(item.mfeBeforeMae1Pct));
    return `
      <section class="journal-day">
        <div class="journal-day-head">
          <strong>${date}</strong>
          <span>${dayItems.length} closed · MFE→MAE ${avgPreMae === null ? "legacy" : pct(avgPreMae)}</span>
        </div>
        ${dayItems.map((item) => {
          const ratio = Number(item.mae) > 0 ? Number(item.mfe) / Number(item.mae) : null;
          return `
            <article class="journal-row">
              <div class="journal-symbol">
                <strong>${item.symbol}</strong>
                <span>${item.side.toLowerCase()} · ${item.mode} · ${item.closeReason || "MANUAL"} · score ${item.setupScoreGrade || "-"} ${item.setupScore ?? "-"}${item.setupOverextended ? " · extended" : ""}</span>
              </div>
              <div><span>Entry</span><strong>${fmt(item.entry || item.triggerPrice)}</strong></div>
              <div><span>Výsledok</span><strong class="${Number(item.pnl) >= 0 ? "good" : "bad"}">${pct(item.pnl)}</strong></div>
              <div class="journal-focus"><span>MFE pred MAE 1%</span><strong>${preMaeLabel(item, 1)}</strong></div>
              <div><span>MFE / MAE</span><strong><span class="good">${pct(item.mfe)}</span> / <span class="bad">${maeDisplay(item.mae)}</span></strong></div>
              <div><span>Pomer</span><strong>${ratio === null ? "-" : `${ratio.toFixed(2)}×`}</strong></div>
              <div><span>Poradie</span><strong>${item.firstMove || "bez hitu"}</strong></div>
              <div><span>Trvanie</span><strong>${formatDuration(item.durationMs)}</strong></div>
            </article>
          `;
        }).join("")}
      </section>
    `;
  }).join("");
}

function renderJournalAnalysis(items) {
  if (!els.journalAnalysis) return;
  if (!items.length) {
    els.journalAnalysis.innerHTML = '<div class="analysis-card"><span>Obchody</span><strong>0</strong><div class="note">Journal je prázdny.</div></div>';
    return;
  }

  const wins = items.filter((item) => Number(item.pnl) > 0).length;
  const losses = items.filter((item) => Number(item.pnl) < 0).length;
  const tracked = items.filter((item) => hasPreMae(item));
  const clean = tracked.filter((item) => !item.preMae1Ambiguous);
  const mfeFirst = items.filter((item) => item.firstMove === "MFE first").length;
  const avgPnl = avgFor(items, (item) => Number(item.pnl) || 0);
  const avgMfe = avgFor(items, (item) => Math.max(0, Number(item.mfe) || 0));
  const avgMae = avgFor(items, (item) => Math.max(0, Number(item.mae) || 0));
  const avgPreMae = avgFor(tracked, (item) => Number(item.mfeBeforeMae1Pct));
  const medianPreMae = medianFor(tracked.map((item) => Number(item.mfeBeforeMae1Pct)));
  const longs = items.filter((item) => item.side === "LONG");
  const shorts = items.filter((item) => (item.side || "SHORT") === "SHORT");
  const sideSummary = (group) => group.length
    ? `${pct(avgFor(group, (item) => Number(item.pnl) || 0))} · WR ${Math.round(group.filter((item) => Number(item.pnl) > 0).length / group.length * 100)}%`
    : "-";

  els.journalAnalysis.innerHTML = `
    <div class="analysis-card"><span>Closed</span><strong>${items.length}</strong><div class="note">${wins} win / ${losses} loss</div></div>
    <div class="analysis-card"><span>WR</span><strong>${pct((wins / items.length) * 100).replace("+", "")}</strong><div class="note">unikátne obchody</div></div>
    <div class="analysis-card"><span>Avg PnL</span><strong class="${avgPnl >= 0 ? "good" : "bad"}">${pct(avgPnl)}</strong><div class="note">bez position sizingu</div></div>
    <div class="analysis-card focus-card"><span>Avg MFE pred MAE 1%</span><strong>${avgPreMae === null ? "-" : pct(avgPreMae)}</strong><div class="note">${tracked.length} meraných</div></div>
    <div class="analysis-card"><span>Medián pred MAE 1%</span><strong>${medianPreMae === null ? "-" : pct(medianPreMae)}</strong><div class="note">odolné voči extrémom</div></div>
    <div class="analysis-card"><span>MFE first</span><strong>${pct((mfeFirst / items.length) * 100).replace("+", "")}</strong><div class="note">${mfeFirst} z ${items.length}</div></div>
    <div class="analysis-card"><span>Avg MFE / MAE</span><strong>${pct(avgMfe)} / ${maeDisplay(avgMae)}</strong><div class="note">celá cesta obchodu</div></div>
    <div class="analysis-card"><span>Presné merania</span><strong>${clean.length}/${tracked.length}</strong><div class="note">bez 1m nejasnosti</div></div>
    <div class="analysis-card"><span>SHORT</span><strong>${sideSummary(shorts)}</strong><div class="note">${shorts.length} obchodov</div></div>
    <div class="analysis-card"><span>LONG</span><strong>${sideSummary(longs)}</strong><div class="note">${longs.length} obchodov</div></div>
  `;
}

function renderJournalPeriods(items) {
  if (!els.journalPeriods) return;
  const renderGroup = (title, keyFn, limit) => {
    const groups = new Map();
    for (const item of items) {
      const key = keyFn(item);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    }
    return `
      <section class="period-panel">
        <div class="section-title"><h3>${title}</h3><span>${groups.size}</span></div>
        <div class="period-list">${[...groups.entries()].slice(0, limit).map(([key, group]) => {
          const tracked = group.filter((item) => hasPreMae(item));
          const preMae = avgFor(tracked, (item) => Number(item.mfeBeforeMae1Pct));
          const mfeFirst = group.filter((item) => item.firstMove === "MFE first").length;
          return `<div class="period-row"><strong>${key}</strong><span>${group.length} closed · MFE first ${Math.round((mfeFirst / group.length) * 100)}% · pred MAE ${preMae === null ? "legacy" : pct(preMae)}</span></div>`;
        }).join("")}</div>
      </section>
    `;
  };
  els.journalPeriods.innerHTML =
    renderGroup("Mesiace", (item) => journalDateKey(item).slice(0, 7), 6) +
    renderGroup("Týždne", (item) => isoWeekKey(item.closedAt), 8);
}

function renderExcursionQuality(items) {
  if (!els.journalExcursion) return;
  const cards = [1, 2, 3].map((threshold) => {
    const tracked = items.filter((item) => hasPreMae(item, threshold));
    const avgValue = avgFor(tracked, (item) => Number(item[`mfeBeforeMae${threshold}Pct`]));
    const median = medianFor(tracked.map((item) => Number(item[`mfeBeforeMae${threshold}Pct`])));
    const hit = tracked.filter((item) => item[`mae${threshold}HitAt`]).length;
    const ambiguous = tracked.filter((item) => item[`preMae${threshold}Ambiguous`]).length;
    return `
      <div class="excursion-card">
        <span>Pred MAE ${threshold}%</span>
        <strong>${avgValue === null ? "-" : pct(avgValue)}</strong>
        <div>medián ${median === null ? "-" : pct(median)}</div>
        <small>${hit} hit · ${ambiguous} nejasných · ${tracked.length} meraných</small>
      </div>
    `;
  }).join("");
  els.journalExcursion.innerHTML = `
    <div class="section-title"><div><h3>Excursion quality</h3><p>Koľko priaznivého pohybu vzniklo skôr, než obchod absorboval významné MAE</p></div><span>+ bez MAE hitu · ~ nejasné poradie v 1m sviečke</span></div>
    <div class="excursion-grid">${cards}</div>
  `;
}

function renderJournalConclusion(items) {
  if (!els.journalConclusion) return;
  if (!items.length) {
    els.journalConclusion.innerHTML = "";
    return;
  }
  const market = items.filter((item) => item.mode === "market");
  const trigger = items.filter((item) => item.mode === "trigger");
  const longs = items.filter((item) => item.side === "LONG");
  const shorts = items.filter((item) => (item.side || "SHORT") === "SHORT");
  const describe = (group) => {
    const tracked = group.filter((item) => hasPreMae(item));
    const value = avgFor(tracked, (item) => Number(item.mfeBeforeMae1Pct));
    const first = group.filter((item) => item.firstMove === "MFE first").length;
    return value === null ? `${group.length ? Math.round(first / group.length * 100) : 0}% MFE-first` : `${pct(value)} pred MAE 1%`;
  };
  els.journalConclusion.innerHTML = `
    <div class="section-title"><h3>Záver</h3><span>čo zatiaľ hovoria dáta</span></div>
    <div class="conclusion-box"><strong>Čitateľný záver</strong><p>Short: ${describe(shorts)}. Long: ${describe(longs)}. Market: ${describe(market)}. Trigger: ${describe(trigger)}. Hlavná metrika zostáva MFE vytvorené pred MAE 1%.</p></div>
  `;
}

function formatDuration(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return "-";
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  if (minutes < 60) return `${minutes}m ${seconds}s`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

function exportJournalCsv() {
  const header = [
    "symbol", "side", "mode", "score", "scoreGrade", "overextended", "rewardRisk", "distanceBelowRetestAtr", "volumeRatio",
    "result", "closeReason", "firstMove", "entry", "closePrice", "pnlPct",
    "mfePct", "maePct", "mfeBeforeMae1Pct", "mfeBeforeMae2Pct", "mfeBeforeMae3Pct",
    "mae1HitAt", "mae2HitAt", "mae3HitAt", "preMae1Ambiguous", "preMae2Ambiguous", "preMae3Ambiguous",
    "bestPrice", "worstPrice", "mfeHitAt", "maeHitAt",
    "pumpPct", "fadeFromPeakPct", "change24Pct", "durationMs", "backfillNote", "closedAt",
  ];
  const rows = journal.map((item) => [
    item.symbol,
    item.side || "SHORT",
    item.mode,
    item.setupScore ?? "",
    item.setupScoreGrade ?? "",
    item.setupOverextended ?? "",
    item.setupRewardRisk ?? "",
    item.setupDistanceBelowRetestAtr ?? "",
    item.setupVolumeRatio ?? "",
    item.resultTag,
    item.closeReason || "MANUAL",
    item.firstMove || "",
    item.entry || item.triggerPrice || "",
    item.closePrice || "",
    item.pnl ?? "",
    item.mfe ?? "",
    Number.isFinite(Number(item.mae)) ? -Math.abs(Number(item.mae)) : "",
    item.mfeBeforeMae1Pct ?? "",
    item.mfeBeforeMae2Pct ?? "",
    item.mfeBeforeMae3Pct ?? "",
    item.mae1HitAt ? new Date(item.mae1HitAt).toISOString() : "",
    item.mae2HitAt ? new Date(item.mae2HitAt).toISOString() : "",
    item.mae3HitAt ? new Date(item.mae3HitAt).toISOString() : "",
    item.preMae1Ambiguous ?? "",
    item.preMae2Ambiguous ?? "",
    item.preMae3Ambiguous ?? "",
    item.bestPrice ?? "",
    item.worstPrice ?? "",
    item.mfeHitAt ? new Date(item.mfeHitAt).toISOString() : "",
    item.maeHitAt ? new Date(item.maeHitAt).toISOString() : "",
    item.setupPumpPct ?? "",
    item.setupFadeFromPeak ?? "",
    item.setupChange24 ?? "",
    item.durationMs ?? "",
    item.backfillNote || "",
    new Date(item.closedAt).toISOString(),
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `fade-lab-journal-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function setScannerSide(side) {
  scannerSide = side;
  const isLong = side === "LONG";
  els.appSubtitle.textContent = isLong
    ? "Bottom-bounce scanner pre top losers a paper sledovanie MFE vs MAE."
    : "Short continuation scanner a paper sledovanie MFE vs MAE.";
  els.strategyEyebrow.textContent = isLong ? "BOTTOM BOUNCE" : "SHORT CONTINUATION";
  els.strategyEyebrow.className = `strategy-eyebrow ${isLong ? "long-text" : "short-text"}`;
  els.strategyTitle.textContent = isLong ? "Kapitulácia, reclaim dna a breakout" : "Fade po pumpe a potvrdenom rejection";
  els.strategyDescription.textContent = isLong
    ? "Top losers sú discovery vrstva. Long čaká na volume climax, higher low a breakout micro resistance."
    : "Top losers sú discovery vrstva. Short čaká na retest a odmietnutie rezistencie.";
  els.strategyBadge.textContent = isLong ? "LONG" : "SHORT";
  els.strategyBadge.className = `strategy-badge ${isLong ? "long-badge" : "short-badge"}`;
  els.scanButton.textContent = isLong ? "Scan long bounce" : "Scan short setupy";
  els.scanButton.className = `primary ${isLong ? "long-primary" : "short-primary"}`;
  els.candidateTitle.textContent = isLong ? "Long kandidáti" : "Short kandidáti";
  els.waitingTitle.textContent = isLong ? "Čakajúce longy" : "Čakajúce shorty";
  els.openTitle.textContent = isLong ? "Otvorené longy" : "Otvorené shorty";
  els.primaryFilterLabel.textContent = isLong ? "Min. 24h strata" : "Min. pump";
  els.secondaryFilterLabel.textContent = isLong ? "Min. bounce od low" : "Min. dump od high";
  const cached = lastCandidates[side];
  if (cached.length) renderCandidates(cached);
  else {
    els.candidates.className = "list empty";
    els.candidates.textContent = "Spusti scan.";
    els.scanStatus.textContent = "Neskenované";
  }
  renderTrades();
}

els.scanButton.addEventListener("click", scan);
els.tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    els.tabs.forEach((item) => item.classList.toggle("active", item === tab));
    const showJournal = tab.dataset.tab === "journal";
    els.scannerView.classList.toggle("active", !showJournal);
    els.journalView.classList.toggle("active", showJournal);
    if (!showJournal) setScannerSide(tab.dataset.tab === "long" ? "LONG" : "SHORT");
    if (showJournal) backfillJournalExcursions();
    if (!showJournal && selectedSymbol) requestAnimationFrame(() => renderChart(chartCandles));
  });
});
els.intervalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedInterval = button.dataset.interval;
    els.intervalButtons.forEach((item) => item.classList.toggle("active", item === button));
    if (selectedSymbol) loadChart(selectedSymbol);
  });
});
els.clearTradesButton.addEventListener("click", () => {
  trades = trades.filter((trade) => (trade.side || "SHORT") !== scannerSide);
  saveTrades();
  renderTrades();
  connectPriceSocket();
});
els.clearJournalButton.addEventListener("click", () => {
  journal = [];
  saveJournal();
  renderJournal();
});
els.exportJournalButton.addEventListener("click", exportJournalCsv);

normalizeAllTrades();
setScannerSide("SHORT");
renderJournal();
backfillJournalExcursions();
reconcileTrades(true).then(() => {
  renderTrades();
  renderJournal();
  refreshTrades();
});
connectPriceSocket();
setInterval(refreshTrades, 5000);
setInterval(() => {
  if (selectedSymbol && document.visibilityState === "visible") loadChart(selectedSymbol);
}, 30000);
window.addEventListener("resize", () => {
  if (chart) chart.resize(els.chart.clientWidth, els.chart.clientHeight);
});
window.addEventListener("focus", () => {
  reconcileTrades(true).then(() => {
    renderTrades();
    renderJournal();
  });
});
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    reconcileTrades(true).then(() => {
      renderTrades();
      renderJournal();
    });
  }
});
