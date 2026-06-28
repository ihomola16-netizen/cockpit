const API = "https://fapi.binance.com";
const STORAGE_KEY = "fade-lab-trades-v1";
const JOURNAL_KEY = "fade-lab-journal-v1";
const PUMP_RADAR_KEY = "fade-lab-pump-radar-v1";
const PUMP_CONTROL_KEY = "fade-lab-pump-control-v1";
const LOGIC_VERSION = "fade-v3-2026-06-28";
const COIN_MEMORY_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const COIN_COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000;
const JOURNAL_SEEDS = [
  { file: "fade-lab-journal-2026-06-23.csv", key: "fade-lab-journal-seed-2026-06-23" },
  { file: "fade-lab-journal-2026-06-24-today.csv", key: "fade-lab-journal-seed-2026-06-24-today" },
];
const TRIGGER_REJECTION_PCT = 0.35;
const TRIGGER_INVALIDATION_PCT = 1.25;
const TRIGGER_EXPIRES_MS = 2 * 60 * 60 * 1000;
const AUTO_CLOSE_AFTER_MS = 24 * 60 * 60 * 1000;
const PUMP_RECOVERY_THRESHOLDS = [10, 15, 20, 30];
const PUMP_RECOVERY_VERSION = "mae-rebound-v1";

const els = {
  scanButton: document.querySelector("#scanButton"),
  clearTradesButton: document.querySelector("#clearTradesButton"),
  clearJournalButton: document.querySelector("#clearJournalButton"),
  exportJournalButton: document.querySelector("#exportJournalButton"),
  importJournalButton: document.querySelector("#importJournalButton"),
  importJournalInput: document.querySelector("#importJournalInput"),
  pumpRadarView: document.querySelector("#pumpRadarView"),
  pumpScanButton: document.querySelector("#pumpScanButton"),
  pumpScanStatus: document.querySelector("#pumpScanStatus"),
  pumpCandidates: document.querySelector("#pumpCandidates"),
  pumpTracked: document.querySelector("#pumpTracked"),
  pumpStats: document.querySelector("#pumpStats"),
  exportPumpRadarButton: document.querySelector("#exportPumpRadarButton"),
  exportPumpJournalButton: document.querySelector("#exportPumpJournalButton"),
  pumpJournal: document.querySelector("#pumpJournal"),
  pumpJournalStats: document.querySelector("#pumpJournalStats"),
  pumpRecoveryStats: document.querySelector("#pumpRecoveryStats"),
  pumpControlStats: document.querySelector("#pumpControlStats"),
  journalKindTabs: document.querySelectorAll("[data-journal-kind]"),
  bounceJournalPane: document.querySelector("#bounceJournalPane"),
  pumpJournalPane: document.querySelector("#pumpJournalPane"),
  journalScopeButtons: document.querySelectorAll("[data-journal-scope]"),
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
let pumpRadar = loadPumpRadar();
let pumpControl = loadPumpControl();
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
let lastPumpCandidates = [];
let journalScope = "current";

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
  trade.setupFamily ||= inferSetupFamily(trade);
  trade.logicVersion ||= trade.setupFamily === "HTF_TOUCH" ? "htf-touch-pre-version" : "legacy";
  if (trade.status === "WAITING" && Number(trade.createdAt) > 0) {
    const twoHourExpiry = Number(trade.createdAt) + TRIGGER_EXPIRES_MS;
    if (!Number(trade.triggerExpiresAt) || Number(trade.triggerExpiresAt) < twoHourExpiry) {
      trade.triggerExpiresAt = twoHourExpiry;
    }
  }
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

function inferSetupFamily(trade) {
  const note = String(trade.backfillNote || "").toLowerCase();
  if (trade.triggerKind === "HTF" || note.includes("priamo na dotyku 1h")) return "HTF_TOUCH";
  if (trade.side === "LONG" && (trade.triggerPhase === "WAIT_BREAKOUT" || note.includes("breakoute micro resistance"))) return "LONG_BREAKOUT_LEGACY";
  if (trade.side === "SHORT" && note.includes("potvrdenom rejection")) return "SHORT_REJECTION_LEGACY";
  if (trade.mode === "market") return "MARKET_LEGACY";
  return "LEGACY";
}

function isCurrentSetup(trade) {
  return (trade.setupFamily || inferSetupFamily(trade)) === "HTF_TOUCH";
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

function loadPumpRadar() {
  try {
    return (JSON.parse(localStorage.getItem(PUMP_RADAR_KEY)) || []).map((item) => {
      if (item.status === "MATURE" && !item.closedAt) {
        item.closedAt = Number(item.createdAt) + 72 * 3_600_000;
      }
      return item;
    });
  } catch {
    return [];
  }
}

function loadPumpControl() {
  try {
    return (JSON.parse(localStorage.getItem(PUMP_CONTROL_KEY)) || []).map((item) => {
      item.cohort ||= "CONTROL";
      if (item.status === "MATURE" && !item.closedAt) item.closedAt = Number(item.createdAt) + 72 * 3_600_000;
      return item;
    });
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

function savePumpRadar() {
  localStorage.setItem(PUMP_RADAR_KEY, JSON.stringify(pumpRadar));
}

function savePumpControl() {
  localStorage.setItem(PUMP_CONTROL_KEY, JSON.stringify(pumpControl));
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"') {
      if (quoted && next === '"') {
        cell += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(cell);
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  row.push(cell);
  if (row.some((value) => value !== "")) rows.push(row);
  if (rows.length < 2) return [];
  const headers = rows[0].map((value) => value.trim());
  return rows.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

function csvNumber(value, fallback = null) {
  if (value === "" || value === null || value === undefined) return fallback;
  const number = Number(String(value).replace(",", "."));
  return Number.isFinite(number) ? number : fallback;
}

function csvBool(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (["true", "1", "yes", "ano"].includes(normalized)) return true;
  if (["false", "0", "no", "nie"].includes(normalized)) return false;
  return false;
}

function csvDate(value) {
  if (!value) return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? new Date(time).toISOString() : null;
}

function journalTradeKey(item) {
  const symbol = String(item.symbol || "").toUpperCase();
  const side = String(item.side || "SHORT").toUpperCase();
  const entry = csvNumber(item.entry ?? item.triggerPrice, 0);
  const closedAt = Date.parse(item.closedAt || "");
  if (symbol && Number.isFinite(closedAt) && entry > 0) {
    return `${symbol}|${side}|${entry.toPrecision(12)}|${closedAt}`;
  }
  return item.id || `${symbol}|${side}|${item.closedAt || ""}|${item.closePrice || ""}`;
}

function journalItemFromCsv(row) {
  const side = String(row.side || "SHORT").toUpperCase() === "LONG" ? "LONG" : "SHORT";
  const entry = csvNumber(row.entry, 0);
  const closedAt = csvDate(row.closedAt) || new Date().toISOString();
  const durationMs = csvNumber(row.durationMs, 0);
  const item = {
    id: `import-${journalTradeKey({ symbol: row.symbol, side, entry, closedAt })}`,
    symbol: String(row.symbol || "").trim().toUpperCase(),
    side,
    mode: row.mode || "import",
    logicVersion: row.logicVersion || "legacy-import",
    setupFamily: row.setupFamily || "",
    scoringModel: row.scoringModel || "",
    coinMemoryAdjustment: csvNumber(row.coinMemoryAdjustment, 0),
    coinMemoryLabel: row.coinMemoryLabel || "",
    setupScore: csvNumber(row.score),
    setupScoreGrade: row.scoreGrade || "",
    setupOverextended: csvBool(row.overextended),
    setupRewardRisk: csvNumber(row.rewardRisk),
    setupDistanceBelowRetestAtr: csvNumber(row.distanceBelowRetestAtr),
    setupVolumeRatio: csvNumber(row.volumeRatio),
    setupBtcCorr: csvNumber(row.btcCorr),
    setupBtcBeta: csvNumber(row.btcBeta),
    setupBtcMode: row.btcMode || "",
    setupBtcRegime: row.btcRegime || "",
    setupBtcRegimeLabel: row.btcRegime ? `BTC ${row.btcRegime}` : "",
    setupBtcTrend7d: csvNumber(row.btcTrend7d),
    setupBtcVolatility: csvNumber(row.btcVolatility),
    setupBtcPrice: csvNumber(row.btcPrice),
    resultTag: row.result || "",
    closeReason: row.closeReason || "IMPORT",
    firstMove: row.firstMove || "",
    entry,
    triggerPrice: entry,
    closePrice: csvNumber(row.closePrice),
    pnl: csvNumber(row.pnlPct, 0),
    mfe: csvNumber(row.mfePct, 0),
    mae: Math.abs(csvNumber(row.maePct, 0)),
    mfeBeforeMae1Pct: csvNumber(row.mfeBeforeMae1Pct),
    mfeBeforeMae2Pct: csvNumber(row.mfeBeforeMae2Pct),
    mfeBeforeMae3Pct: csvNumber(row.mfeBeforeMae3Pct),
    mae1HitAt: csvDate(row.mae1HitAt),
    mae2HitAt: csvDate(row.mae2HitAt),
    mae3HitAt: csvDate(row.mae3HitAt),
    preMae1Ambiguous: csvBool(row.preMae1Ambiguous),
    preMae2Ambiguous: csvBool(row.preMae2Ambiguous),
    preMae3Ambiguous: csvBool(row.preMae3Ambiguous),
    bestPrice: csvNumber(row.bestPrice),
    worstPrice: csvNumber(row.worstPrice),
    mfeHitAt: csvDate(row.mfeHitAt),
    maeHitAt: csvDate(row.maeHitAt),
    mfe1HitAt: csvDate(row.mfe1HitAt),
    mfe2HitAt: csvDate(row.mfe2HitAt),
    mfe3HitAt: csvDate(row.mfe3HitAt),
    mfe5HitAt: csvDate(row.mfe5HitAt),
    mfe10HitAt: csvDate(row.mfe10HitAt),
    setupPumpPct: csvNumber(row.pumpPct),
    setupFadeFromPeak: csvNumber(row.fadeFromPeakPct),
    setupChange24: csvNumber(row.change24Pct),
    durationMs,
    backfillNote: row.backfillNote || "Import z CSV journalu.",
    createdAt: csvDate(row.createdAt) || undefined,
    openedAt: csvDate(row.openedAt) || (durationMs > 0 ? Date.parse(closedAt) - durationMs : undefined),
    closedAt,
    status: "CLOSED",
  };
  return normalizeTrade(inferTradeSide(item));
}

function mergeJournalItems(imported) {
  const existing = new Set(journal.map(journalTradeKey));
  const fresh = [];
  for (const item of imported) {
    if (!item.symbol) continue;
    const key = journalTradeKey(item);
    if (existing.has(key)) continue;
    existing.add(key);
    fresh.push(item);
  }
  if (fresh.length) {
    journal = [...fresh, ...journal];
    saveJournal();
    renderJournal();
  }
  return fresh.length;
}

function importJournalCsvText(text) {
  const rows = parseCsv(text);
  const imported = rows.map(journalItemFromCsv);
  return { added: mergeJournalItems(imported), total: imported.length };
}

async function importBundledJournalSeed() {
  for (const seed of JOURNAL_SEEDS) {
    if (localStorage.getItem(seed.key)) continue;
    try {
      const response = await fetch(seed.file, { cache: "no-store" });
      if (!response.ok) continue;
      const text = await response.text();
      importJournalCsvText(text);
      localStorage.setItem(seed.key, new Date().toISOString());
    } catch {
      // Seed je iba pohodlný bootstrap; ručný import ostáva hlavná cesta.
    }
  }
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
    addLine(chartLevels.htfLevel, chartLevels.side === "LONG" ? "1h support" : "1h resistance", "#8ab4f8");
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

function bestSupportBelow(candles, last, atr) {
  const recent = candles.slice(-64);
  const tolerance = Math.max((atr || 0) * 0.4, last * 0.0025);
  const pivots = [];

  for (let index = 1; index < recent.length - 1; index += 1) {
    const candle = recent[index];
    if (candle.low >= last) continue;
    if (candle.low <= recent[index - 1].low && candle.low <= recent[index + 1].low) {
      pivots.push({ price: candle.low, recency: index / recent.length });
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
      const distanceAtr = atr > 0 ? (last - zone.price) / atr : ((last - zone.price) / last) * 100;
      const nearestPenalty = distanceAtr;
      return {
        ...zone,
        distanceAtr,
        score: zone.touches * 5 + zone.recency * 3 - nearestPenalty,
      };
    })
    .filter((zone) => zone.distanceAtr >= 0.15 && zone.distanceAtr <= 6)
    .sort((a, b) => b.score - a.score);

  if (ranked.length) return ranked[0];

  const fallbackDistance = Math.max(atr || 0, last * 0.01);
  const recentLows = recent.map((candle) => candle.low).filter((price) => price < last - fallbackDistance * 0.25);
  const nearestLow = recentLows.sort((a, b) => b - a)[0];
  const price = nearestLow || last - fallbackDistance;
  return {
    price,
    touches: nearestLow ? 1 : 0,
    recency: 0,
    distanceAtr: atr > 0 ? (last - price) / atr : 1,
    score: 0,
  };
}

function applyHourlyLevel(candidate, candles1h) {
  if (!candles1h?.length) return candidate;
  const atr1h = averageTrueRange(candles1h);
  if (candidate.side === "LONG") {
    const support = bestSupportBelow(candles1h, candidate.last, atr1h);
    candidate.htfLevelType = "support";
    candidate.htfLevel = support.price;
    candidate.htfTouches = support.touches;
    candidate.htfDistanceAtr = support.distanceAtr;
    return candidate;
  }

  const resistance = bestResistanceAbove(candles1h, candidate.last, atr1h);
  candidate.htfLevelType = "resistance";
  candidate.htfLevel = resistance.price;
  candidate.htfTouches = resistance.touches;
  candidate.htfDistanceAtr = resistance.distanceAtr;
  if (resistance.price > candidate.last) {
    candidate.retest = resistance.price;
    candidate.retestSource = "1h resistance";
    candidate.resistanceTouches = resistance.touches;
    candidate.resistanceDistanceAtr = resistance.distanceAtr;
    candidate.stop = Math.max(resistance.price * 1.035, candidate.last * 1.025);
    candidate.tp2 = shortTargetBelow(resistance.price, [candidate.originPrice, candidate.low24, candidate.last * 0.96, resistance.price * 0.96]);
    candidate.tp1 = shortTargetBelow(resistance.price, [candidate.last * 0.985, resistance.price * 0.98, candidate.tp2 * 1.02]);
    const expectedEntry = triggerConfirmationPrice(resistance.price);
    const reward = Math.max(0, expectedEntry - candidate.tp2);
    const risk = Math.max(0, candidate.stop - expectedEntry);
    candidate.rewardRisk = risk > 0 ? reward / risk : 0;
  }
  return candidate;
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

function applySideMechanicScore(candidate) {
  const isLong = candidate.side === "LONG";
  let score = 15;
  if (isLong) {
    const volume = Number(candidate.capitulationVolumeRatio) || 0;
    score += volume >= 2.5 ? 24 : volume >= 1.6 ? 18 : volume >= 1.2 ? 10 : 2;
    score += candidate.htfTouches >= 3 ? 20 : candidate.htfTouches === 2 ? 14 : candidate.htfTouches === 1 ? 7 : 0;
    score += candidate.htfDistanceAtr <= 0.75 ? 15 : candidate.htfDistanceAtr <= 1.5 ? 9 : candidate.htfDistanceAtr <= 2.5 ? 3 : -8;
    score += candidate.bounceFromLow >= 1 && candidate.bounceFromLow <= 8 ? 12 : candidate.bounceFromLow <= 12 ? 4 : -10;
    score += candidate.rangePosition <= 35 ? 8 : candidate.rangePosition <= 50 ? 2 : -8;
    score += candidate.quoteVolume24 >= 50_000_000 ? 8 : candidate.quoteVolume24 >= 10_000_000 ? 5 : 0;
    score += candidate.btcRegime === "risk-off" ? -8 : 0;
    candidate.scoringModel = "LONG_HTF_TOUCH_V2";
  } else {
    score += candidate.htfTouches >= 3 ? 20 : candidate.htfTouches === 2 ? 14 : candidate.htfTouches === 1 ? 7 : 0;
    score += candidate.htfDistanceAtr <= 0.75 ? 15 : candidate.htfDistanceAtr <= 1.5 ? 8 : candidate.htfDistanceAtr <= 2.5 ? 2 : -8;
    score += candidate.weakBounce ? 14 : 0;
    score += candidate.fadeFromPeak >= 7 && candidate.fadeFromPeak <= 15 ? 12 : candidate.fadeFromPeak < 25 ? 6 : -5;
    score += candidate.pumpPct >= 5 && candidate.pumpPct <= 20 ? 10 : candidate.pumpPct <= 35 ? 5 : -4;
    score += candidate.volumeRatio >= 0.7 && candidate.volumeRatio <= 1.4 ? 7 : 3;
    score += candidate.quoteVolume24 >= 50_000_000 ? 7 : candidate.quoteVolume24 >= 10_000_000 ? 4 : 0;
    score += candidate.overextended ? -12 : 0;
    candidate.scoringModel = "SHORT_HTF_TOUCH_V2";
  }
  candidate.scoreBase = Math.max(0, Math.min(100, Math.round(score)));
  candidate.score = candidate.scoreBase;
  candidate.scoreGrade = candidate.score >= 75 ? "A" : candidate.score >= 60 ? "B" : "C";
  return candidate;
}

function coinMemoryFor(symbol, side, now = Date.now()) {
  const recent = uniqueJournalItems()
    .filter((item) => item.symbol === symbol && (item.side || "SHORT") === side)
    .filter((item) => Number.isFinite(Date.parse(item.closedAt)) && now - Date.parse(item.closedAt) <= COIN_MEMORY_WINDOW_MS)
    .sort((a, b) => Date.parse(b.closedAt) - Date.parse(a.closedAt));
  const wins = recent.filter((item) => Number(item.pnl) > 0).length;
  const losses = recent.filter((item) => Number(item.pnl) < 0).length;
  const twoLatestLosses = recent.length >= 2 && recent.slice(0, 2).every((item) => Number(item.pnl) < 0);
  const cooldownUntil = twoLatestLosses ? Date.parse(recent[0].closedAt) + COIN_COOLDOWN_MS : 0;
  const blocked = cooldownUntil > now;
  const adjustment = Math.max(-15, Math.min(6, wins * 2 - losses * 5));
  return {
    wins,
    losses,
    adjustment,
    blocked,
    cooldownUntil: blocked ? cooldownUntil : null,
    label: recent.length ? `${wins}W/${losses}L za 7d${blocked ? " · cooldown" : ""}` : "bez histórie 7d",
  };
}

function applyCoinMemory(candidate) {
  const memory = coinMemoryFor(candidate.symbol, candidate.side);
  candidate.coinMemoryAdjustment = memory.adjustment;
  candidate.coinMemoryBlocked = memory.blocked;
  candidate.coinCooldownUntil = memory.cooldownUntil;
  candidate.coinMemoryLabel = memory.label;
  candidate.score = Math.max(0, Math.min(100, candidate.scoreBase + memory.adjustment));
  candidate.scoreGrade = candidate.score >= 75 ? "A" : candidate.score >= 60 ? "B" : "C";
  return candidate;
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
    const [tickers, btcRaw15m, btcRaw4h] = await Promise.all([
      getJson("/fapi/v1/ticker/24hr"),
      getJson("/fapi/v1/klines?symbol=BTCUSDT&interval=15m&limit=96"),
      getJson("/fapi/v1/klines?symbol=BTCUSDT&interval=4h&limit=120"),
    ]);
    const btcCandles15m = btcRaw15m.map(klineToCandle);
    const btcRegime = btcMarketRegime(btcRaw4h.map(klineToCandle));
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
        const [raw15m, raw1h] = await Promise.all([
          getJson(`/fapi/v1/klines?symbol=${ticker.symbol}&interval=15m&limit=96`),
          getJson(`/fapi/v1/klines?symbol=${ticker.symbol}&interval=1h&limit=120`),
        ]);
        const candles = raw15m.map(klineToCandle);
        const candles1h = raw1h.map(klineToCandle);
        const candidate = scanSide === "LONG" ? analyzeLongSymbol(ticker, candles) : analyzeSymbol(ticker, candles);
        const contextual = applyBtcContext(applyHourlyLevel(candidate, candles1h), candles, btcCandles15m, btcRegime, 48);
        return applyCoinMemory(applySideMechanicScore(contextual));
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
    const cooldownCount = analyzed.filter((candidate) => candidate.coinMemoryBlocked).length;
    const ranked = analyzed
      .filter((candidate) => !activeSymbols.has(candidate.symbol) && !candidate.coinMemoryBlocked)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    lastCandidates[scanSide] = ranked;
    if (scannerSide === scanSide) {
      els.scanStatus.textContent = `${ranked.length} kandidátov${cooldownCount ? ` · ${cooldownCount} cooldown` : ""}`;
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

function pumpMovePct(candle) {
  return candle.open > 0 ? ((candle.high - candle.open) / candle.open) * 100 : 0;
}

function candleReturns(candles) {
  return candles.slice(1).map((candle, index) => {
    const previous = candles[index];
    return previous.close > 0 ? ((candle.close - previous.close) / previous.close) * 100 : 0;
  });
}

function correlation(valuesA, valuesB) {
  const length = Math.min(valuesA.length, valuesB.length);
  if (length < 8) return null;
  const a = valuesA.slice(-length);
  const b = valuesB.slice(-length);
  const avgA = avgFor(a, (value) => value) || 0;
  const avgB = avgFor(b, (value) => value) || 0;
  let covariance = 0;
  let varianceA = 0;
  let varianceB = 0;
  for (let index = 0; index < length; index += 1) {
    const da = a[index] - avgA;
    const db = b[index] - avgB;
    covariance += da * db;
    varianceA += da * da;
    varianceB += db * db;
  }
  if (varianceA <= 0 || varianceB <= 0) return null;
  return covariance / Math.sqrt(varianceA * varianceB);
}

function betaAgainst(valuesA, valuesB) {
  const length = Math.min(valuesA.length, valuesB.length);
  if (length < 8) return null;
  const a = valuesA.slice(-length);
  const b = valuesB.slice(-length);
  const avgA = avgFor(a, (value) => value) || 0;
  const avgB = avgFor(b, (value) => value) || 0;
  let covariance = 0;
  let varianceB = 0;
  for (let index = 0; index < length; index += 1) {
    const da = a[index] - avgA;
    const db = b[index] - avgB;
    covariance += da * db;
    varianceB += db * db;
  }
  return varianceB > 0 ? covariance / varianceB : null;
}

function btcRelation(symbolCandles, btcCandles, lookback = 48) {
  const symbolReturns = candleReturns(symbolCandles).slice(-lookback);
  const btcReturns = candleReturns(btcCandles).slice(-lookback);
  const corr = correlation(symbolReturns, btcReturns);
  const beta = betaAgainst(symbolReturns, btcReturns);
  return {
    btcCorr: corr,
    btcBeta: beta,
    btcCorrLabel: corr === null ? "-" : corr.toFixed(2),
    btcBetaLabel: beta === null ? "-" : `${beta.toFixed(2)}×`,
    btcMode: corr === null ? "unknown" : corr >= 0.65 ? "BTC passenger" : corr <= 0.25 ? "idiosyncratic" : "mixed",
  };
}

function applyBtcRelation(candidate, candles, btcCandles, lookback = 48) {
  return Object.assign(candidate, btcRelation(candles, btcCandles, lookback));
}

function ema(values, period) {
  if (!values.length) return null;
  const k = 2 / (period + 1);
  let value = values[0];
  for (let index = 1; index < values.length; index += 1) {
    value = values[index] * k + value * (1 - k);
  }
  return value;
}

function btcMarketRegime(candles4h) {
  if (!candles4h?.length) return { btcRegime: "unknown", btcRegimeLabel: "BTC unknown", btcTrend7d: null, btcVolatility: null };
  const closes = candles4h.map((candle) => candle.close);
  const last = closes.at(-1);
  const ema20 = ema(closes.slice(-80), 20);
  const ema50 = ema(closes.slice(-120), 50);
  const weekAgo = closes[Math.max(0, closes.length - 43)];
  const trend7d = weekAgo > 0 ? ((last - weekAgo) / weekAgo) * 100 : 0;
  const returns = candleReturns(candles4h).slice(-42);
  const avgReturn = avgFor(returns, (value) => value) || 0;
  const variance = avgFor(returns, (value) => (value - avgReturn) ** 2) || 0;
  const volatility = Math.sqrt(variance);
  const above20 = last > ema20;
  const above50 = last > ema50;
  const emaStackBull = ema20 > ema50;
  const emaStackBear = ema20 < ema50;
  let regime = "chop";
  if (above20 && above50 && emaStackBull && trend7d > 4) regime = "bull";
  else if (above20 && trend7d > 1.5) regime = "recovery";
  else if (!above20 && !above50 && emaStackBear && trend7d < -4) regime = "bear";
  else if (!above20 && trend7d < -1.5) regime = "risk-off";
  const labelMap = {
    bull: "BTC bull",
    recovery: "BTC recovery",
    chop: "BTC chop",
    "risk-off": "BTC risk-off",
    bear: "BTC bear",
  };
  return {
    btcRegime: regime,
    btcRegimeLabel: labelMap[regime] || "BTC unknown",
    btcTrend7d: trend7d,
    btcVolatility: volatility,
    btcPrice: last,
    btcEma20: ema20,
    btcEma50: ema50,
  };
}

function applyBtcContext(candidate, candles, btcCandles, btcRegime, lookback = 48) {
  return Object.assign(candidate, btcRegime, btcRelation(candles, btcCandles, lookback));
}

function analyzePumpRadarSymbol(ticker, candles4h, candles1h) {
  const last = Number(ticker.lastPrice);
  const change24 = Number(ticker.priceChangePercent);
  const quoteVolume24 = Number(ticker.quoteVolume) || 0;
  const now = Date.now();
  const events = [];
  for (let index = 8; index < candles4h.length; index += 1) {
    const candle = candles4h[index];
    const move = pumpMovePct(candle);
    const baseVol = avgFor(candles4h.slice(Math.max(0, index - 8), index), (item) => item.quoteVolume || 0) || 0;
    const volumeExpansion = baseVol > 0 ? (candle.quoteVolume || 0) / baseVol : 1;
    if (move >= 15 && volumeExpansion >= 1.8) {
      events.push({
        time: candle.time,
        move,
        volumeExpansion,
        closeAfterPump: candle.close,
      });
    }
  }

  const lastEvent = events.at(-1);
  const daysSincePump = lastEvent ? (now - lastEvent.time) / 86_400_000 : 999;
  const strongestPump = events.length ? Math.max(...events.map((event) => event.move)) : 0;
  const avgPumpQuality = events.length ? avgFor(events, (event) => event.move * Math.min(3, event.volumeExpansion)) : 0;
  const recent1h = candles1h.slice(-24);
  const older1h = candles1h.slice(-96, -24);
  const recentRangePct = avgFor(recent1h, (candle) => candle.open > 0 ? ((candle.high - candle.low) / candle.open) * 100 : 0) || 0;
  const olderRangePct = avgFor(older1h, (candle) => candle.open > 0 ? ((candle.high - candle.low) / candle.open) * 100 : 0) || recentRangePct || 1;
  const compression = olderRangePct > 0 ? Math.max(0, 1 - recentRangePct / olderRangePct) : 0;
  const recentVol = avgFor(candles1h.slice(-6), (candle) => candle.quoteVolume || 0) || 0;
  const baseVol = avgFor(candles1h.slice(-48, -6), (candle) => candle.quoteVolume || 0) || 0;
  const volumeCreep = baseVol > 0 ? recentVol / baseVol : 1;
  const lastHigh24 = Math.max(...recent1h.map((candle) => candle.high));
  const breakoutDistancePct = last > 0 ? ((lastHigh24 - last) / last) * 100 : 0;
  const tooHotNow = change24 > 18;
  const quietAfterPump = Math.abs(change24) <= 12 && daysSincePump >= 1 && daysSincePump <= 10;

  let potentialScore = 8;
  potentialScore += Math.min(24, events.length * 6);
  potentialScore += strongestPump >= 25 && strongestPump <= 40 ? 14 : strongestPump >= 18 ? 8 : 0;
  potentialScore += avgPumpQuality >= 80 ? 10 : avgPumpQuality >= 50 ? 7 : avgPumpQuality >= 30 ? 4 : 0;
  potentialScore += daysSincePump >= 1.2 && daysSincePump <= 3 ? 20 : daysSincePump < 1.2 ? -10 : daysSincePump <= 7 ? 10 : daysSincePump <= 10 ? 4 : -5;
  potentialScore += compression >= 0.18 ? 4 : 0;
  potentialScore += volumeCreep >= 0.3 && volumeCreep <= 1 ? 12 : volumeCreep <= 1.5 ? 6 : volumeCreep > 2 ? -8 : 1;
  potentialScore += quoteVolume24 >= 80_000_000 ? 8 : quoteVolume24 >= 20_000_000 ? 5 : quoteVolume24 >= 5_000_000 ? 2 : -5;
  potentialScore += change24 <= -7.5 ? 12 : change24 <= 3 ? 5 : change24 > 18 ? -15 : 0;
  potentialScore = Math.max(0, Math.min(100, Math.round(potentialScore)));

  let riskScore = 0;
  riskScore += daysSincePump < 1.2 ? 22 : daysSincePump > 8 ? 8 : 0;
  riskScore += volumeCreep > 2 ? 18 : volumeCreep > 1.5 ? 8 : 0;
  riskScore += change24 > 18 ? 22 : change24 > 7.5 ? 12 : 0;
  riskScore += strongestPump > 40 ? 10 : 0;
  riskScore += events.length >= 5 ? 8 : 0;
  riskScore += quoteVolume24 < 5_000_000 ? 15 : 0;
  riskScore = Math.max(0, Math.min(100, Math.round(riskScore)));
  const candidate = {
    symbol: ticker.symbol,
    last,
    change24,
    quoteVolume24,
    potentialScore,
    riskScore,
    score: Math.round(potentialScore * 0.8 + (100 - riskScore) * 0.2),
    pumpCount14d: events.length,
    strongestPump,
    avgPumpQuality,
    daysSincePump,
    compressionPct: compression * 100,
    volumeCreep,
    breakoutDistancePct,
    lastPumpAt: lastEvent?.time || null,
    lastPumpMove: lastEvent?.move || 0,
    lastPumpVolumeExpansion: lastEvent?.volumeExpansion || 1,
    tooHotNow,
    quietAfterPump,
  };
  candidate.score = Math.max(0, Math.min(100, candidate.score));
  candidate.grade = candidate.score >= 78 ? "A" : candidate.score >= 62 ? "B" : "C";
  candidate.scoringModel = "PUMP_POTENTIAL_RISK_V2";
  return applyPumpRadarMemory(candidate);
}

function applyPumpRadarMemory(candidate) {
  const history = pumpRadar
    .filter((item) => item.symbol === candidate.symbol && item.status === "MATURE")
    .sort((a, b) => Number(b.closedAt || b.createdAt) - Number(a.closedAt || a.createdAt));
  const latest = history[0];
  let adjustment = 0;
  if (latest) {
    const previousMfe = Math.max(Number(latest.mfe24) || 0, Number(latest.mfe48) || 0, Number(latest.mfe72) || 0);
    adjustment += previousMfe >= 30 ? 18 : previousMfe >= 15 ? 12 : previousMfe < 5 ? -6 : 0;
    const recentHits = history.slice(0, 3).filter((item) => Math.max(Number(item.mfe24) || 0, Number(item.mfe48) || 0, Number(item.mfe72) || 0) >= 15).length;
    adjustment += Math.max(0, recentHits - 1) * 4;
    candidate.previousRadarMfe = previousMfe;
    candidate.previousRadarHit = previousMfe >= 15;
    candidate.radarMemoryLabel = `predtým MFE ${pct(previousMfe)} · ${recentHits}/${Math.min(3, history.length)} hit`;
  } else {
    candidate.previousRadarMfe = null;
    candidate.previousRadarHit = false;
    candidate.radarMemoryLabel = "prvé radarové sledovanie";
  }
  candidate.radarMemoryAdjustment = adjustment;
  candidate.potentialScore = Math.max(0, Math.min(100, candidate.potentialScore + adjustment));
  candidate.score = Math.max(0, Math.min(100, Math.round(candidate.potentialScore * 0.8 + (100 - candidate.riskScore) * 0.2)));
  candidate.grade = candidate.score >= 78 ? "A" : candidate.score >= 62 ? "B" : "C";
  return candidate;
}

function migrateActivePumpScores() {
  let changed = false;
  for (const item of pumpRadar.filter((watch) => watch.status === "ACTIVE" && !Number.isFinite(Number(watch.potentialScore)))) {
    const days = Number(item.daysSincePump) || 999;
    const volume = Number(item.volumeCreep) || 1;
    const change = Number(item.change24AtWatch) || 0;
    let potential = 8 + Math.min(24, (Number(item.pumpCount14d) || 0) * 6);
    potential += Number(item.strongestPump) >= 25 && Number(item.strongestPump) <= 40 ? 14 : Number(item.strongestPump) >= 18 ? 8 : 0;
    potential += days >= 1.2 && days <= 3 ? 20 : days < 1.2 ? -10 : days <= 7 ? 10 : days <= 10 ? 4 : -5;
    potential += Number(item.compressionPct) >= 18 ? 4 : 0;
    potential += volume >= 0.3 && volume <= 1 ? 12 : volume <= 1.5 ? 6 : volume > 2 ? -8 : 1;
    potential += Number(item.quoteVolume24) >= 80_000_000 ? 8 : Number(item.quoteVolume24) >= 20_000_000 ? 5 : Number(item.quoteVolume24) >= 5_000_000 ? 2 : -5;
    potential += change <= -7.5 ? 12 : change <= 3 ? 5 : change > 18 ? -15 : 0;
    let risk = (days < 1.2 ? 22 : days > 8 ? 8 : 0) + (volume > 2 ? 18 : volume > 1.5 ? 8 : 0);
    risk += change > 18 ? 22 : change > 7.5 ? 12 : 0;
    risk += Number(item.strongestPump) > 40 ? 10 : 0;
    risk += Number(item.pumpCount14d) >= 5 ? 8 : 0;
    risk += Number(item.quoteVolume24) < 5_000_000 ? 15 : 0;
    const rescored = applyPumpRadarMemory({
      ...item,
      potentialScore: Math.max(0, Math.min(100, Math.round(potential))),
      riskScore: Math.max(0, Math.min(100, Math.round(risk))),
      scoringModel: "PUMP_POTENTIAL_RISK_V2_MIGRATED",
    });
    Object.assign(item, rescored);
    changed = true;
  }
  if (changed) savePumpRadar();
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
    ${metric("R:R", `${item.rewardRisk.toFixed(2)}×`)}${metric("Support dist", `${Number(item.htfDistanceAtr ?? item.distanceBelowRetestAtr).toFixed(2)} ATR`)}
    ${metric("Volume climax", `${item.capitulationVolumeRatio.toFixed(2)}×`)}${metric("Range pozícia", `${item.rangePosition.toFixed(0)}%`)}
    ${metric("BTC corr", item.btcCorrLabel || "-")}${metric("Beta vs BTC", item.btcBetaLabel || "-")}
    ${metric("BTC režim", item.btcRegimeLabel || "-")}${metric("BTC 7d", Number.isFinite(Number(item.btcTrend7d)) ? coloredPct(item.btcTrend7d) : "-")}
  ` : `
    ${metric("Last", fmt(item.last))}${metric("24h", coloredPct(item.change24))}
    ${metric("Pump", coloredPct(item.pumpPct))}${metric("Od peak", coloredPct(-item.fadeFromPeak))}
    ${metric("R:R", `${item.rewardRisk.toFixed(2)}×`)}${metric("Od retestu", `${item.distanceBelowRetestAtr.toFixed(2)} ATR`)}
    ${metric("Volume", `${item.volumeRatio.toFixed(2)}×`)}${metric("Range pozícia", `${item.rangePosition.toFixed(0)}%`)}
    ${metric("BTC corr", item.btcCorrLabel || "-")}${metric("Beta vs BTC", item.btcBetaLabel || "-")}
    ${metric("BTC režim", item.btcRegimeLabel || "-")}${metric("BTC 7d", Number.isFinite(Number(item.btcTrend7d)) ? coloredPct(item.btcTrend7d) : "-")}
  `;
  const triggerLabel = isLong ? "Legacy breakout" : item.retestSource === "best resistance" ? "Resistance entry" : "Retest entry";
  const htfLabel = isLong ? "1h support trigger" : "1h resistance trigger";
  const htfValue = Number.isFinite(Number(item.htfLevel))
    ? `${fmt(item.htfLevel)}${item.htfTouches ? ` · ${item.htfTouches}x` : ""}`
    : "-";
  const htfTriggerPrice = Number(item.htfLevel);
  const hasHtfTrigger = Number.isFinite(htfTriggerPrice) && htfTriggerPrice > 0;
  const htfButtonLabel = hasHtfTrigger
    ? `${isLong ? "1h support long" : "1h resistance short"} @ ${fmt(htfTriggerPrice)}`
    : "1h trigger nie je";
  return `
    <article class="card side-${isLong ? "long" : "short"}" data-symbol-card="${item.symbol}">
      <div class="row-top"><div><div class="symbol">${item.symbol}</div><div class="muted">${structure}</div></div><div class="score">${item.scoreGrade} · ${item.score}/100</div></div>
      <div class="metrics">${metrics}</div>
      <div class="levels">${metric(htfLabel, htfValue)}${metric(triggerLabel, fmt(item.retest))}${metric("Stop", fmt(item.stop))}${metric(isLong ? "TP bounce" : "TP fade", fmt(item.tp2))}</div>
      <div class="actions">
        <button data-action="htf-trigger" data-symbol="${item.symbol}" data-trigger="${htfTriggerPrice}" ${hasHtfTrigger ? "" : "disabled"}>${htfButtonLabel}</button>
      </div>
      <div class="note">${isLong ? "Experiment: long sa otvorí iba priamo na dotyku 1h supportu." : "Short HTF vstup sa otvorí priamo na dotyku 1h rezistencie."} Score ${item.scoringModel || "-"}${item.coinMemoryAdjustment ? ` · coin memory ${item.coinMemoryAdjustment > 0 ? "+" : ""}${item.coinMemoryAdjustment}` : ""} · ${item.coinMemoryLabel || "bez histórie"}.</div>
    </article>`;
}

function pumpCandidateCardHtml(item) {
  const tracked = pumpRadar.some((watch) => watch.symbol === item.symbol && watch.status === "ACTIVE");
  return `
    <article class="card pump-card" data-pump-symbol="${item.symbol}">
      <div class="row-top">
        <div><div class="symbol">${item.symbol}</div><div class="muted">${item.pumpCount14d} kvalitné pumpy / posledná pred ${item.daysSincePump > 100 ? "-" : item.daysSincePump.toFixed(1)} dňami</div></div>
        <div class="score">${item.grade} · ${item.score}/100</div>
      </div>
      <div class="metrics">
        ${metric("Last", fmt(item.last))}${metric("24h", coloredPct(item.change24))}
        ${metric("Pump potential", `${item.potentialScore ?? item.score}/100`)}${metric("MAE risk", `${item.riskScore ?? "-"}/100`)}
        ${metric("Max pump 14d", coloredPct(item.strongestPump))}${metric("Volume creep", `${item.volumeCreep.toFixed(2)}×`)}
        ${metric("Kompresia", `${item.compressionPct.toFixed(0)}%`)}${metric("Vol 24h", `${(item.quoteVolume24 / 1_000_000).toFixed(1)}M`)}
        ${metric("BTC corr", item.btcCorrLabel || "-")}${metric("Beta vs BTC", item.btcBetaLabel || "-")}
        ${metric("BTC režim", item.btcRegimeLabel || "-")}${metric("BTC 7d", Number.isFinite(Number(item.btcTrend7d)) ? coloredPct(item.btcTrend7d) : "-")}
      </div>
      <div class="note">${item.tooHotNow ? "Už je horúci — skôr sledovať po resete." : item.quietAfterPump ? "Zaujímavý reset po pumpe: vychladol, ale nie je mŕtvy." : "Radar kandidát na cyklické sledovanie."} · ${item.radarMemoryLabel || "prvé radarové sledovanie"}${item.radarMemoryAdjustment ? ` · memory ${item.radarMemoryAdjustment > 0 ? "+" : ""}${item.radarMemoryAdjustment}` : ""}</div>
      <div class="actions">
        <button data-pump-watch="${item.symbol}" ${tracked ? "disabled" : ""}>${tracked ? "Už sledujem" : "Sledovať 72h"}</button>
      </div>
    </article>`;
}

function renderPumpCandidates(items = lastPumpCandidates) {
  if (!els.pumpCandidates) return;
  const trackedSymbols = new Set(
    pumpRadar.filter((item) => item.status === "ACTIVE").map((item) => item.symbol),
  );
  items = items.filter((item) => !trackedSymbols.has(item.symbol));
  if (!items.length) {
    els.pumpCandidates.className = "list empty";
    els.pumpCandidates.textContent = lastPumpCandidates.length
      ? "Všetkých nájdených kandidátov už sleduješ."
      : "Spusti scan.";
    return;
  }
  els.pumpCandidates.className = "list";
  els.pumpCandidates.innerHTML = items.map(pumpCandidateCardHtml).join("");
  els.pumpCandidates.querySelectorAll("[data-pump-symbol]").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;
      selectSymbol(card.dataset.pumpSymbol);
    });
  });
  els.pumpCandidates.querySelectorAll("[data-pump-watch]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = items.find((candidate) => candidate.symbol === button.dataset.pumpWatch);
      if (item) addPumpWatch(item);
    });
  });
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
      selectSymbol(card.dataset.symbolCard, item ? { side: item.side, retest: item.retest, htfLevel: item.htfLevel, stop: item.stop, tp2: item.tp2 } : null);
    });
  });

  els.candidates.querySelectorAll("button[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = items.find((candidate) => candidate.symbol === button.dataset.symbol);
      selectSymbol(item.symbol, { side: item.side, retest: item.retest, htfLevel: item.htfLevel, stop: item.stop, tp2: item.tp2 });
      const action = button.dataset.action;
      const triggerPrice = Number(button.dataset.trigger || item.last);
      addTrade(item, action === "htf-trigger" ? "trigger" : action, triggerPrice, action === "htf-trigger" ? "HTF" : "STANDARD");
      renderCandidates(items);
    });
  });

  if (!selectedSymbol && items[0]) {
    selectSymbol(items[0].symbol, { side: items[0].side, retest: items[0].retest, htfLevel: items[0].htfLevel, stop: items[0].stop, tp2: items[0].tp2 });
  } else {
    markSelectedCards();
  }
}

async function evaluatePumpWatch(item) {
  const ageMs = Date.now() - Number(item.createdAt);
  const raw = await getJson(`/fapi/v1/klines?symbol=${item.symbol}&interval=5m&startTime=${Number(item.createdAt)}&limit=900`);
  const candles = raw.map(klineToCandle).filter((candle) => candle.time >= Number(item.createdAt));
  if (!candles.length || !(Number(item.baselinePrice) > 0)) return item;

  const baseline = Number(item.baselinePrice);
  const calcWindow = (hours) => {
    const until = Number(item.createdAt) + hours * 3_600_000;
    const sample = candles.filter((candle) => candle.time <= until);
    if (!sample.length) return { mfe: 0, mae: 0, hit15: false };
    const bestHigh = Math.max(...sample.map((candle) => candle.high));
    const worstLow = Math.min(...sample.map((candle) => candle.low));
    const mfe = ((bestHigh - baseline) / baseline) * 100;
    const mae = ((baseline - worstLow) / baseline) * 100;
    return { mfe: Math.max(0, mfe), mae: Math.max(0, mae), hit15: mfe >= 15 };
  };

  const result24 = calcWindow(24);
  const result48 = calcWindow(48);
  const result72 = calcWindow(72);
  item.mfe24 = ageMs >= 24 * 3_600_000 ? result24.mfe : null;
  item.mfe48 = ageMs >= 48 * 3_600_000 ? Math.max(result24.mfe, result48.mfe) : null;
  item.mfe72 = ageMs >= 72 * 3_600_000 ? Math.max(result24.mfe, result48.mfe, result72.mfe) : null;
  item.mae72 = ageMs >= 72 * 3_600_000 ? result72.mae : null;
  item.hit15_24 = ageMs >= 24 * 3_600_000 ? result24.hit15 : false;
  item.hit15_48 = ageMs >= 48 * 3_600_000 ? result48.hit15 : false;
  item.hit15_72 = ageMs >= 72 * 3_600_000 ? Number(item.mfe72) >= 15 : false;
  const recoveryCandles = candles.filter((candle) => candle.time <= Number(item.createdAt) + 72 * 3_600_000);
  for (const threshold of PUMP_RECOVERY_THRESHOLDS) {
    const triggerPrice = baseline * (1 - threshold / 100);
    const hitIndex = recoveryCandles.findIndex((candle) => candle.low <= triggerPrice);
    if (hitIndex < 0) {
      item[`mae${threshold}HitAt`] = null;
      item[`mae${threshold}TriggerPrice`] = triggerPrice;
      item[`postMae${threshold}High`] = null;
      item[`reboundAfterMae${threshold}Pct`] = null;
      item[`recoveredBaselineAfterMae${threshold}`] = false;
      continue;
    }
    const postHitCandles = recoveryCandles.slice(hitIndex + 1);
    const postHigh = Math.max(triggerPrice, ...postHitCandles.map((candle) => candle.high));
    item[`mae${threshold}HitAt`] = recoveryCandles[hitIndex].time;
    item[`mae${threshold}TriggerPrice`] = triggerPrice;
    item[`postMae${threshold}High`] = postHigh;
    item[`reboundAfterMae${threshold}Pct`] = Math.max(0, ((postHigh - triggerPrice) / triggerPrice) * 100);
    item[`recoveredBaselineAfterMae${threshold}`] = postHigh >= baseline;
  }
  item.recoveryTrackingVersion = PUMP_RECOVERY_VERSION;
  item.lastEvaluatedAt = Date.now();
  if (ageMs >= 72 * 3_600_000) {
    item.status = "MATURE";
    item.closedAt ||= Number(item.createdAt) + 72 * 3_600_000;
    item.closeReason ||= "72H_COMPLETE";
    const finalCandle = recoveryCandles[recoveryCandles.length - 1];
    item.finalPrice = Number(finalCandle?.close) || Number(item.currentPrice) || null;
    item.end72Pct = item.finalPrice ? ((item.finalPrice - baseline) / baseline) * 100 : null;
  }
  return item;
}

function matureExpiredPumpWatches(now = Date.now()) {
  let changed = false;
  for (const item of [...pumpRadar, ...pumpControl]) {
    if (item.status !== "ACTIVE" || now < Number(item.createdAt) + 72 * 3_600_000) continue;
    item.status = "MATURE";
    item.closedAt = Number(item.createdAt) + 72 * 3_600_000;
    item.closeReason = "72H_COMPLETE";
    item.finalPrice = Number(item.currentPrice) || null;
    item.mfe72 ??= Math.max(0, Number(item.liveMfe) || 0);
    item.mae72 ??= Math.max(0, Number(item.liveMae) || 0);
    item.hit15_72 = Number(item.mfe72) >= 15;
    changed = true;
  }
  if (changed) {
    savePumpRadar();
    savePumpControl();
  }
  return changed;
}

function updatePumpRadarWithPrice(symbol, price, now = Date.now()) {
  const current = Number(price);
  if (!(current > 0)) return false;
  let changed = false;
  for (const item of [...pumpRadar, ...pumpControl]) {
    if (item.symbol !== symbol || item.status !== "ACTIVE") continue;
    const baseline = Number(item.baselinePrice);
    if (!(baseline > 0)) continue;
    const livePnl = ((current - baseline) / baseline) * 100;
    const liveMfe = Math.max(Number(item.liveMfe) || 0, livePnl);
    const liveMae = Math.max(Number(item.liveMae) || 0, -livePnl);
    item.currentPrice = current;
    item.livePnl = livePnl;
    item.liveMfe = Math.max(0, liveMfe);
    item.liveMae = Math.max(0, liveMae);
    for (const threshold of PUMP_RECOVERY_THRESHOLDS) {
      const hitKey = `mae${threshold}HitAt`;
      const triggerPrice = baseline * (1 - threshold / 100);
      item[`mae${threshold}TriggerPrice`] = triggerPrice;
      if (!item[hitKey] && livePnl <= -threshold) {
        item[hitKey] = now;
        item[`postMae${threshold}High`] = current;
      } else if (item[hitKey]) {
        item[`postMae${threshold}High`] = Math.max(Number(item[`postMae${threshold}High`]) || triggerPrice, current);
      }
      const postHigh = Number(item[`postMae${threshold}High`]);
      item[`reboundAfterMae${threshold}Pct`] = item[hitKey] && postHigh > 0
        ? Math.max(0, ((postHigh - triggerPrice) / triggerPrice) * 100)
        : null;
      item[`recoveredBaselineAfterMae${threshold}`] = Boolean(item[hitKey] && postHigh >= baseline);
    }
    item.lastLiveAt = now;
    changed = true;
  }
  return changed;
}

async function refreshPumpRadar() {
  matureExpiredPumpWatches();
  const allWatches = [...pumpRadar, ...pumpControl];
  const active = allWatches.filter((item) => item.status === "ACTIVE").slice(0, 60);
  if (active.length) {
    await Promise.allSettled(active.map(async (item) => {
      if (item.lastLiveAt && Date.now() - Number(item.lastLiveAt) < 60_000) return;
      const ticker = await getJson(`/fapi/v1/ticker/price?symbol=${item.symbol}`);
      const price = Number(ticker.price);
      priceCache.set(item.symbol, price);
      updatePumpRadarWithPrice(item.symbol, price, Date.now());
    }));
    savePumpRadar();
    savePumpControl();
  }
  const pending = allWatches.filter((item) =>
    (item.status === "ACTIVE" && (!item.lastEvaluatedAt || Date.now() - Number(item.lastEvaluatedAt) > 15 * 60 * 1000)) ||
    (item.status === "MATURE" && item.recoveryTrackingVersion !== PUMP_RECOVERY_VERSION)
  ).slice(0, 20);
  if (!pending.length) {
    renderPumpRadar();
    renderPumpJournal();
    return;
  }
  const results = await Promise.allSettled(pending.map(evaluatePumpWatch));
  if (results.some((result) => result.status === "fulfilled")) {
    savePumpRadar();
    savePumpControl();
  }
  renderPumpRadar();
  renderPumpJournal();
  if (allWatches.some((item) => item.status === "MATURE" && item.recoveryTrackingVersion !== PUMP_RECOVERY_VERSION)) {
    setTimeout(refreshPumpRadar, 1500);
  }
}

function renderPumpRadar() {
  if (!els.pumpTracked || !els.pumpStats) return;
  matureExpiredPumpWatches();
  const allItems = pumpRadar;
  const items = allItems.filter((item) => item.status === "ACTIVE");
  const matured = allItems.filter((item) => item.status === "MATURE");
  const livePnlFor = (item) => Number.isFinite(Number(item.livePnl)) ? Number(item.livePnl) : 0;
  const liveMfeFor = (item) => Number.isFinite(Number(item.liveMfe)) ? Number(item.liveMfe) : 0;
  const liveMaeFor = (item) => Number.isFinite(Number(item.liveMae)) ? Number(item.liveMae) : 0;
  const ageFor = (item) => Math.max(0, (Date.now() - Number(item.createdAt)) / 3_600_000);
  const positive = items.filter((item) => livePnlFor(item) > 0).length;
  const hit15Live = items.filter((item) => liveMfeFor(item) >= 15).length;
  const avgLivePnl = avgFor(items, livePnlFor) || 0;
  const medianLivePnl = medianFor(items.map(livePnlFor)) ?? 0;
  const avgLiveMfe = avgFor(items, liveMfeFor) || 0;
  const avgLiveMae = avgFor(items, liveMaeFor) || 0;
  const ageBuckets = [
    items.filter((item) => ageFor(item) < 24).length,
    items.filter((item) => ageFor(item) >= 24 && ageFor(item) < 48).length,
    items.filter((item) => ageFor(item) >= 48).length,
  ];
  const topPnl = [...items].sort((a, b) => livePnlFor(b) - livePnlFor(a)).slice(0, 3);
  const worstPnl = [...items].sort((a, b) => livePnlFor(a) - livePnlFor(b)).slice(0, 3);
  const topMfe = [...items].sort((a, b) => liveMfeFor(b) - liveMfeFor(a)).slice(0, 3);
  const ranking = (title, rankedItems, valueFor, valueLabel) => `
    <section class="pump-ranking-card">
      <div class="pump-ranking-head"><strong>${title}</strong><span>${valueLabel}</span></div>
      ${rankedItems.length ? rankedItems.map((item, index) => {
        const value = valueFor(item);
        return `<div class="pump-ranking-row">
          <span class="pump-rank">${index + 1}</span>
          <div class="pump-ranking-symbol">
            <strong>${item.symbol}</strong>
            <small>${ageFor(item).toFixed(1)}h · score ${item.grade || "-"} ${item.score ?? "-"}</small>
            <small>${valueLabel === "MFE" ? `PnL ${pct(livePnlFor(item))}` : `MFE ${pct(liveMfeFor(item))}`} · MAE ${maeDisplay(liveMaeFor(item))}</small>
          </div>
          <div class="pump-ranking-value ${value >= 0 ? "good" : "bad"}">${pct(value)}</div>
        </div>`;
      }).join("") : '<div class="pump-ranking-empty">Žiadne aktívne sledovania.</div>'}
    </section>`;
  els.pumpStats.className = "pump-live-summary";
  els.pumpStats.innerHTML = `
    <div class="pump-overview-grid">
      <div class="analysis-card"><span>Aktívne</span><strong>${items.length}</strong><div class="note">${matured.length} už v journale</div></div>
      <div class="analysis-card"><span>Aktuálne zelené</span><strong class="good">${items.length ? Math.round(positive / items.length * 100) : 0}%</strong><div class="note">${positive}/${items.length} nad baseline</div></div>
      <div class="analysis-card"><span>Avg / medián PnL</span><strong class="${avgLivePnl >= 0 ? "good" : "bad"}">${pct(avgLivePnl)}</strong><div class="note">medián ${pct(medianLivePnl)}</div></div>
      <div class="analysis-card"><span>Live MFE / MAE</span><strong><span class="good">${pct(avgLiveMfe)}</span> / <span class="bad">${maeDisplay(avgLiveMae)}</span></strong><div class="note">priemer aktívnych</div></div>
      <div class="analysis-card"><span>Dosiahli +15%</span><strong>${items.length ? Math.round(hit15Live / items.length * 100) : 0}%</strong><div class="note">${hit15Live}/${items.length} ešte počas behu</div></div>
      <div class="analysis-card"><span>Vek sledovaní</span><strong>${ageBuckets.join(" / ")}</strong><div class="note">0–24h / 24–48h / 48–72h</div></div>
    </div>
    <div class="pump-ranking-grid">
      ${ranking("Top 3 teraz", topPnl, livePnlFor, "PnL")}
      ${ranking("Bottom 3 teraz", worstPnl, livePnlFor, "PnL")}
      ${ranking("Top 3 podľa MFE", topMfe, liveMfeFor, "MFE")}
    </div>
  `;
  if (!items.length) {
    els.pumpTracked.className = "list empty";
    els.pumpTracked.textContent = "Zatiaľ nič nesledujeme.";
    return;
  }
  els.pumpTracked.className = "list";
  const windowMetric = (label, value, ageHours, windowHours, formatter = coloredPct) => {
    if (ageHours < windowHours) return metric(label, `<span class="muted">čaká ${formatDuration((windowHours - ageHours) * 3_600_000)}</span>`);
    return metric(label, formatter(value ?? 0));
  };
  els.pumpTracked.innerHTML = items.map((item) => {
    const ageHours = (Date.now() - Number(item.createdAt)) / 3_600_000;
    const livePnl = Number.isFinite(Number(item.livePnl)) ? Number(item.livePnl) : 0;
    const liveMfe = Number.isFinite(Number(item.liveMfe)) ? Number(item.liveMfe) : 0;
    const liveMae = Number.isFinite(Number(item.liveMae)) ? Number(item.liveMae) : 0;
    const liveNote = item.lastLiveAt ? `live ${formatDuration(Date.now() - Number(item.lastLiveAt))} dozadu` : "čaká na live cenu";
    return `
      <article class="card pump-card" data-pump-watch-card="${item.symbol}">
        <div class="row-top">
          <div><div class="symbol">${item.symbol}</div><div class="muted">${item.status} · ${ageHours.toFixed(1)}h · score ${item.grade} ${item.score}/100 · P ${item.potentialScore ?? "-"} / R ${item.riskScore ?? "-"}</div></div>
          <span class="badge ${item.hit15_72 ? "good" : ""}">${item.hit15_72 ? "HIT +15%" : liveNote}</span>
        </div>
        <div class="metrics">
          ${metric("Baseline", fmt(item.baselinePrice))}${metric("Pump hist.", `${item.pumpCount14d}× / ${pct(item.strongestPump)}`)}
          ${metric("PnL teraz", coloredPct(livePnl))}${metric("Live MFE", coloredPct(liveMfe))}
          ${metric("Live MAE", `<span class="bad">${maeDisplay(liveMae)}</span>`)}${metric("Cena teraz", item.currentPrice ? fmt(item.currentPrice) : "-")}
          ${windowMetric("MFE 24h", item.mfe24, ageHours, 24)}${windowMetric("MFE 48h", item.mfe48, ageHours, 48)}
          ${windowMetric("MFE 72h", item.mfe72, ageHours, 72)}${windowMetric("MAE 72h", item.mae72, ageHours, 72, (value) => `<span class="bad">${maeDisplay(value)}</span>`)}
        </div>
        <div class="note">Kompresia ${Number(item.compressionPct).toFixed(0)}% · volume creep ${Number(item.volumeCreep).toFixed(2)}× · ${item.btcRegimeLabel || "BTC režim -"} · corr ${Number.isFinite(Number(item.btcCorr)) ? Number(item.btcCorr).toFixed(2) : "-"} · 24h pri zaradení ${pct(item.change24AtWatch)}</div>
      </article>`;
  }).join("");
  els.pumpTracked.querySelectorAll("[data-pump-watch-card]").forEach((card) => {
    card.addEventListener("click", () => selectSymbol(card.dataset.pumpWatchCard));
  });
}

function renderPumpJournal() {
  if (!els.pumpJournal || !els.pumpJournalStats) return;
  matureExpiredPumpWatches();
  const optionalPct = (value) => value === null || value === undefined || value === "" ? "-" : pct(value);
  const items = pumpRadar
    .filter((item) => item.status === "MATURE")
    .sort((a, b) => Number(b.closedAt || b.createdAt) - Number(a.closedAt || a.createdAt));
  if (els.pumpControlStats) {
    const controls = pumpControl.filter((item) => item.status === "MATURE");
    const bestMfe = (item) => Math.max(Number(item.mfe24) || 0, Number(item.mfe48) || 0, Number(item.mfe72) || 0);
    const radarHits = items.filter((item) => bestMfe(item) >= 15).length;
    const controlHits = controls.filter((item) => bestMfe(item) >= 15).length;
    const radarRate = items.length ? radarHits / items.length : null;
    const controlRate = controls.length ? controlHits / controls.length : null;
    const lift = radarRate !== null && controlRate > 0 ? radarRate / controlRate : null;
    els.pumpControlStats.innerHTML = `<div class="pump-control-panel">
      <div><span>Radar vs. control</span><strong>${lift === null ? "čaká na dáta" : `${lift.toFixed(2)}× lift`}</strong><small>rovnaké 72h okno</small></div>
      <div><span>Radar hit +15%</span><strong>${radarRate === null ? "-" : `${Math.round(radarRate * 100)}%`}</strong><small>${radarHits}/${items.length}</small></div>
      <div><span>Control hit +15%</span><strong>${controlRate === null ? "-" : `${Math.round(controlRate * 100)}%`}</strong><small>${controlHits}/${controls.length}</small></div>
      <div><span>Medián MFE radar</span><strong class="good">${items.length ? pct(medianFor(items.map(bestMfe))) : "-"}</strong><small>vybrané scannerom</small></div>
      <div><span>Medián MFE control</span><strong>${controls.length ? pct(medianFor(controls.map(bestMfe))) : "-"}</strong><small>náhodní top losers</small></div>
    </div>`;
  }
  if (els.pumpRecoveryStats) {
    els.pumpRecoveryStats.innerHTML = PUMP_RECOVERY_THRESHOLDS.map((threshold) => {
      const triggered = items.filter((item) => item[`mae${threshold}HitAt`]);
      const rebounds = triggered
        .map((item) => Number(item[`reboundAfterMae${threshold}Pct`]))
        .filter(Number.isFinite);
      const medianRebound = medianFor(rebounds);
      const sameSizeRebound = triggered.filter((item) => Number(item[`reboundAfterMae${threshold}Pct`]) >= threshold).length;
      const recoveredBaseline = triggered.filter((item) => item[`recoveredBaselineAfterMae${threshold}`]).length;
      return `<div class="pump-recovery-card">
        <span>Po MAE −${threshold}%</span>
        <strong class="good">${medianRebound === null ? "-" : pct(medianRebound)}</strong>
        <small>medián následného odrazu · trigger ${triggered.length}/${items.length}</small>
        <small>odraz ≥ +${threshold}%: ${sameSizeRebound}/${triggered.length} · späť nad baseline: ${recoveredBaseline}/${triggered.length}</small>
      </div>`;
    }).join("");
  }
  const hits = items.filter((item) => item.hit15_72 || Number(item.mfe72) >= 15).length;
  const avgMfe = avgFor(items, (item) => Number(item.mfe72) || 0) || 0;
  const avgMae = avgFor(items, (item) => Number(item.mae72) || 0) || 0;
  const avgNet = avgFor(items, (item) => Number(item.end72Pct ?? item.livePnl) || 0) || 0;
  const medianMfe = medianFor(items.map((item) => Number(item.mfe72)).filter(Number.isFinite)) ?? 0;
  const excursionRatio = avgMae > 0 ? avgMfe / avgMae : null;
  const scorePairs = items
    .filter((item) => item.score !== null && item.score !== undefined && item.mfe72 !== null && item.mfe72 !== undefined)
    .map((item) => [Number(item.score), Number(item.mfe72)])
    .filter(([score, mfe]) => Number.isFinite(score) && Number.isFinite(mfe));
  const scoreCorrelation = (() => {
    if (scorePairs.length < 3) return null;
    const meanScore = scorePairs.reduce((sum, pair) => sum + pair[0], 0) / scorePairs.length;
    const meanMfe = scorePairs.reduce((sum, pair) => sum + pair[1], 0) / scorePairs.length;
    const covariance = scorePairs.reduce((sum, pair) => sum + (pair[0] - meanScore) * (pair[1] - meanMfe), 0);
    const scoreSpread = Math.sqrt(scorePairs.reduce((sum, pair) => sum + (pair[0] - meanScore) ** 2, 0));
    const mfeSpread = Math.sqrt(scorePairs.reduce((sum, pair) => sum + (pair[1] - meanMfe) ** 2, 0));
    return scoreSpread > 0 && mfeSpread > 0 ? covariance / (scoreSpread * mfeSpread) : null;
  })();
  const regimeGroups = new Map();
  for (const item of items) {
    const label = item.btcRegimeLabel || item.btcRegime || "Neurčený BTC režim";
    if (!regimeGroups.has(label)) regimeGroups.set(label, []);
    regimeGroups.get(label).push(item);
  }
  const eligibleRegimes = [...regimeGroups.entries()].filter(([, group]) => group.length >= 3);
  const bestRegime = eligibleRegimes
    .map(([label, group]) => ({
      label,
      count: group.length,
      hits: group.filter((item) => Number(item.mfe72) >= 15).length,
      hitRate: group.filter((item) => Number(item.mfe72) >= 15).length / group.length,
    }))
    .sort((a, b) => b.hitRate - a.hitRate || b.count - a.count)[0] || null;
  els.pumpJournalStats.innerHTML = `
    <div class="analysis-card"><span>Uzavreté</span><strong>${items.length}</strong><div class="note">kompletné 72h okná</div></div>
    <div class="analysis-card"><span>Hit +15%</span><strong>${items.length ? Math.round(hits / items.length * 100) : 0}%</strong><div class="note">${hits}/${items.length}</div></div>
    <div class="analysis-card"><span>Avg MFE 72h</span><strong class="good">${pct(avgMfe)}</strong><div class="note">najväčšia pumpa</div></div>
    <div class="analysis-card"><span>Avg MAE 72h</span><strong class="bad">${maeDisplay(avgMae)}</strong><div class="note">najväčší pokles</div></div>
    <div class="analysis-card"><span>Avg koniec 72h</span><strong class="${avgNet >= 0 ? "good" : "bad"}">${pct(avgNet)}</strong><div class="note">oproti baseline</div></div>
    <div class="analysis-card"><span>Medián MFE 72h</span><strong class="good">${pct(medianMfe)}</strong><div class="note">odolný voči extrémnym pumpám</div></div>
    <div class="analysis-card"><span>MFE / MAE edge</span><strong>${excursionRatio === null ? "-" : `${excursionRatio.toFixed(2)}×`}</strong><div class="note">potenciál voči drawdownu</div></div>
    <div class="analysis-card"><span>Score → MFE corr.</span><strong class="${scoreCorrelation !== null && scoreCorrelation > 0 ? "good" : scoreCorrelation !== null && scoreCorrelation < 0 ? "bad" : ""}">${scoreCorrelation === null ? "-" : `${scoreCorrelation >= 0 ? "+" : ""}${scoreCorrelation.toFixed(2)}`}</strong><div class="note">+1 znamená, že score dobre predikuje MFE</div></div>
    <div class="analysis-card"><span>Najlepší BTC režim</span><strong>${bestRegime ? `${Math.round(bestRegime.hitRate * 100)}%` : "-"}</strong><div class="note">${bestRegime ? `${bestRegime.label} · ${bestRegime.hits}/${bestRegime.count}` : "treba aspoň 3 záznamy v režime"}</div></div>`;
  if (!items.length) {
    els.pumpJournal.className = "journal-days empty";
    els.pumpJournal.textContent = "Zatiaľ žiadne ukončené radarové sledovania.";
    return;
  }
  const days = new Map();
  for (const item of items) {
    const date = new Date(item.closedAt || item.createdAt).toLocaleDateString("sv-SE");
    if (!days.has(date)) days.set(date, []);
    days.get(date).push(item);
  }
  els.pumpJournal.className = "journal-days";
  els.pumpJournal.innerHTML = [...days.entries()].map(([date, dayItems]) => `
    <section class="journal-day">
      <div class="journal-day-head"><strong>${date}</strong><span>${dayItems.length} ukončených 72h sledovaní</span></div>
      ${dayItems.map((item) => `
        <article class="journal-row pump-journal-row" data-pump-journal-symbol="${item.symbol}">
          <div class="journal-symbol"><strong>${item.symbol}</strong><span>score ${item.grade || "-"} ${item.score ?? "-"}/100 · P ${item.potentialScore ?? "-"} / R ${item.riskScore ?? "-"} · ${item.btcRegimeLabel || "BTC režim -"}</span></div>
          <div><span>Baseline</span><strong>${fmt(item.baselinePrice)}</strong></div>
          <div><span>MFE 24h</span><strong class="good">${optionalPct(item.mfe24)}</strong></div>
          <div><span>MFE 48h</span><strong class="good">${optionalPct(item.mfe48)}</strong></div>
          <div><span>MFE 72h</span><strong class="good">${optionalPct(item.mfe72)}</strong></div>
          <div><span>MAE 72h</span><strong class="bad">${item.mae72 === null || item.mae72 === undefined ? "-" : maeDisplay(item.mae72)}</strong></div>
          <div><span>Koniec 72h</span><strong class="${Number(item.end72Pct ?? item.livePnl) >= 0 ? "good" : "bad"}">${optionalPct(item.end72Pct ?? item.livePnl)}</strong></div>
          <div><span>Výsledok</span><strong class="${item.hit15_72 ? "good" : "muted"}">${item.hit15_72 ? "HIT +15%" : "bez +15%"}</strong></div>
        </article>`).join("")}
    </section>`).join("");
  els.pumpJournal.querySelectorAll("[data-pump-journal-symbol]").forEach((row) => {
    row.addEventListener("click", () => selectSymbol(row.dataset.pumpJournalSymbol));
  });
}

function exportPumpRadarCsv() {
  const header = [
    "cohort", "symbol", "status", "createdAt", "baselinePrice", "score", "grade", "potentialScore", "riskScore", "scoringModel",
    "radarMemoryAdjustment", "radarMemoryLabel", "previousRadarMfe", "previousRadarHit", "pumpCount14d", "strongestPump", "avgPumpQuality",
    "daysSincePump", "compressionPct", "volumeCreep", "quoteVolume24", "btcCorr", "btcBeta", "btcMode", "btcRegime", "btcRegimeLabel", "btcTrend7d", "btcVolatility", "btcPrice", "change24AtWatch",
    "currentPrice", "livePnl", "liveMfe", "liveMae", "mfe24", "mfe48", "mfe72", "mae72", "hit15_24", "hit15_48", "hit15_72",
    "recoveryTrackingVersion", "mae10HitAt", "mae10TriggerPrice", "postMae10High", "reboundAfterMae10Pct", "recoveredBaselineAfterMae10",
    "mae15HitAt", "mae15TriggerPrice", "postMae15High", "reboundAfterMae15Pct", "recoveredBaselineAfterMae15",
    "mae20HitAt", "mae20TriggerPrice", "postMae20High", "reboundAfterMae20Pct", "recoveredBaselineAfterMae20",
    "mae30HitAt", "mae30TriggerPrice", "postMae30High", "reboundAfterMae30Pct", "recoveredBaselineAfterMae30", "finalPrice", "end72Pct", "closedAt",
  ];
  const rows = [...pumpRadar, ...pumpControl].map((item) => [
    item.cohort || "RADAR", item.symbol, item.status, new Date(item.createdAt).toISOString(), item.baselinePrice, item.score, item.grade,
    item.potentialScore, item.riskScore, item.scoringModel, item.radarMemoryAdjustment, item.radarMemoryLabel,
    item.previousRadarMfe, item.previousRadarHit, item.pumpCount14d, item.strongestPump, item.avgPumpQuality, item.daysSincePump,
    item.compressionPct, item.volumeCreep, item.quoteVolume24, item.btcCorr, item.btcBeta, item.btcMode, item.btcRegime,
    item.btcRegimeLabel, item.btcTrend7d, item.btcVolatility, item.btcPrice, item.change24AtWatch,
    item.currentPrice, item.livePnl, item.liveMfe, item.liveMae, item.mfe24, item.mfe48, item.mfe72, item.mae72, item.hit15_24, item.hit15_48, item.hit15_72,
    item.recoveryTrackingVersion,
    item.mae10HitAt ? new Date(item.mae10HitAt).toISOString() : "", item.mae10TriggerPrice, item.postMae10High, item.reboundAfterMae10Pct, item.recoveredBaselineAfterMae10,
    item.mae15HitAt ? new Date(item.mae15HitAt).toISOString() : "", item.mae15TriggerPrice, item.postMae15High, item.reboundAfterMae15Pct, item.recoveredBaselineAfterMae15,
    item.mae20HitAt ? new Date(item.mae20HitAt).toISOString() : "", item.mae20TriggerPrice, item.postMae20High, item.reboundAfterMae20Pct, item.recoveredBaselineAfterMae20,
    item.mae30HitAt ? new Date(item.mae30HitAt).toISOString() : "", item.mae30TriggerPrice, item.postMae30High, item.reboundAfterMae30Pct, item.recoveredBaselineAfterMae30,
    item.finalPrice, item.end72Pct, item.closedAt ? new Date(item.closedAt).toISOString() : "",
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `fade-lab-pump-radar-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function pumpWatchKey(symbol) {
  return `${symbol}|${new Date().toISOString().slice(0, 10)}`;
}

function addPumpWatch(candidate) {
  if (pumpRadar.some((item) => item.symbol === candidate.symbol && item.status === "ACTIVE")) return;
  pumpRadar.unshift({
    id: crypto.randomUUID(),
    key: pumpWatchKey(candidate.symbol),
    symbol: candidate.symbol,
    cohort: "RADAR",
    status: "ACTIVE",
    createdAt: Date.now(),
    baselinePrice: candidate.last,
    score: candidate.score,
    grade: candidate.grade,
    potentialScore: candidate.potentialScore,
    riskScore: candidate.riskScore,
    scoringModel: candidate.scoringModel,
    radarMemoryAdjustment: candidate.radarMemoryAdjustment,
    radarMemoryLabel: candidate.radarMemoryLabel,
    previousRadarMfe: candidate.previousRadarMfe,
    previousRadarHit: candidate.previousRadarHit,
    pumpCount14d: candidate.pumpCount14d,
    strongestPump: candidate.strongestPump,
    avgPumpQuality: candidate.avgPumpQuality,
    daysSincePump: candidate.daysSincePump,
    compressionPct: candidate.compressionPct,
    volumeCreep: candidate.volumeCreep,
    btcCorr: candidate.btcCorr,
    btcBeta: candidate.btcBeta,
    btcMode: candidate.btcMode,
    btcRegime: candidate.btcRegime,
    btcRegimeLabel: candidate.btcRegimeLabel,
    btcTrend7d: candidate.btcTrend7d,
    btcVolatility: candidate.btcVolatility,
    btcPrice: candidate.btcPrice,
    change24AtWatch: candidate.change24,
    quoteVolume24: candidate.quoteVolume24,
    currentPrice: candidate.last,
    livePnl: 0,
    liveMfe: 0,
    liveMae: 0,
    lastLiveAt: Date.now(),
    mfe24: null,
    mfe48: null,
    mfe72: null,
    mae72: null,
    hit15_24: false,
    hit15_48: false,
    hit15_72: false,
  });
  savePumpRadar();
  renderPumpCandidates();
  renderPumpRadar();
  connectPriceSocket();
}

function addPumpControl(candidate) {
  const key = `CONTROL|${pumpWatchKey(candidate.symbol)}`;
  if (pumpControl.some((item) => item.key === key)) return false;
  pumpControl.unshift({
    id: crypto.randomUUID(), key, cohort: "CONTROL", symbol: candidate.symbol, status: "ACTIVE",
    createdAt: Date.now(), baselinePrice: candidate.last, score: candidate.score, grade: candidate.grade,
    potentialScore: candidate.potentialScore, riskScore: candidate.riskScore, scoringModel: candidate.scoringModel,
    pumpCount14d: candidate.pumpCount14d, strongestPump: candidate.strongestPump, avgPumpQuality: candidate.avgPumpQuality, daysSincePump: candidate.daysSincePump,
    compressionPct: candidate.compressionPct, volumeCreep: candidate.volumeCreep, btcCorr: candidate.btcCorr,
    btcBeta: candidate.btcBeta, btcMode: candidate.btcMode, btcRegime: candidate.btcRegime,
    btcRegimeLabel: candidate.btcRegimeLabel, btcTrend7d: candidate.btcTrend7d,
    btcVolatility: candidate.btcVolatility, btcPrice: candidate.btcPrice, change24AtWatch: candidate.change24,
    quoteVolume24: candidate.quoteVolume24, currentPrice: candidate.last, livePnl: 0, liveMfe: 0, liveMae: 0,
    lastLiveAt: Date.now(), mfe24: null, mfe48: null, mfe72: null, mae72: null,
    hit15_24: false, hit15_48: false, hit15_72: false,
  });
  return true;
}

async function scanPumpRadar() {
  if (!els.pumpScanButton) return;
  els.pumpScanButton.disabled = true;
  els.pumpScanStatus.textContent = "Tahám tickery...";
  els.pumpCandidates.className = "list empty";
  els.pumpCandidates.textContent = "Skenujem opakovateľné pumpy.";
  try {
    const [tickers, btcRaw4h] = await Promise.all([
      getJson("/fapi/v1/ticker/24hr"),
      getJson("/fapi/v1/klines?symbol=BTCUSDT&interval=4h&limit=90"),
    ]);
    const btcCandles4h = btcRaw4h.map(klineToCandle);
    const btcRegime = btcMarketRegime(btcCandles4h);
    const universe = tickers
      .filter((ticker) => ticker.symbol.endsWith("USDT") && !ticker.symbol.includes("_"))
      .filter((ticker) => Number(ticker.quoteVolume) >= 3_000_000)
      .sort((a, b) => Number(b.quoteVolume) - Number(a.quoteVolume))
      .slice(0, 160);

    const analyzed = [];
    const analyzedAll = [];
    const batchSize = 8;
    for (let index = 0; index < universe.length; index += batchSize) {
      const batch = universe.slice(index, index + batchSize);
      els.pumpScanStatus.textContent = `Analyzujem ${Math.min(index + batch.length, universe.length)}/${universe.length}...`;
      const results = await Promise.allSettled(batch.map(async (ticker) => {
        const [raw4h, raw1h] = await Promise.all([
          getJson(`/fapi/v1/klines?symbol=${ticker.symbol}&interval=4h&limit=90`),
          getJson(`/fapi/v1/klines?symbol=${ticker.symbol}&interval=1h&limit=120`),
        ]);
        const candles4h = raw4h.map(klineToCandle);
        return applyBtcContext(analyzePumpRadarSymbol(ticker, candles4h, raw1h.map(klineToCandle)), candles4h, btcCandles4h, btcRegime, 42);
      }));
      for (const result of results) {
        if (result.status !== "fulfilled") continue;
        const candidate = result.value;
        analyzedAll.push(candidate);
        const matureCount = pumpRadar.filter((item) => item.status === "MATURE").length;
        const hardFiltersEnabled = matureCount >= 100;
        const passesExperimentalHardFilters = candidate.daysSincePump >= 1.2 && candidate.volumeCreep <= 2;
        if (candidate.pumpCount14d > 0 && (!hardFiltersEnabled || (candidate.score >= 35 && passesExperimentalHardFilters))) analyzed.push(candidate);
      }
    }
    const trackedSymbols = new Set(
      pumpRadar.filter((item) => item.status === "ACTIVE").map((item) => item.symbol),
    );
    lastPumpCandidates = analyzed
      .filter((item) => !trackedSymbols.has(item.symbol))
      .sort((a, b) => b.score - a.score)
      .slice(0, 30);
    const radarSymbols = new Set(lastPumpCandidates.map((item) => item.symbol));
    const activeControlSymbols = new Set(pumpControl.filter((item) => item.status === "ACTIVE").map((item) => item.symbol));
    const controlPool = analyzedAll
      .filter((item) => item.change24 < 0 && !radarSymbols.has(item.symbol) && !trackedSymbols.has(item.symbol) && !activeControlSymbols.has(item.symbol))
      .sort((a, b) => a.change24 - b.change24)
      .slice(0, 50)
      .sort(() => Math.random() - 0.5);
    const controlTarget = Math.min(10, Math.max(5, Math.ceil(lastPumpCandidates.length / 3)));
    let controlsAdded = 0;
    for (const candidate of controlPool.slice(0, controlTarget)) {
      if (addPumpControl(candidate)) controlsAdded += 1;
    }
    if (controlsAdded) savePumpControl();
    const hardFiltersEnabled = pumpRadar.filter((item) => item.status === "MATURE").length >= 100;
    els.pumpScanStatus.textContent = `${lastPumpCandidates.length} kandidátov · ${controlsAdded} control${hardFiltersEnabled ? " · hard filtre ON" : " · experiment"}`;
    renderPumpCandidates();
    connectPriceSocket();
  } catch (error) {
    els.pumpScanStatus.textContent = "Pump scan zlyhal";
    els.pumpCandidates.className = "list empty";
    els.pumpCandidates.textContent = error.message;
  } finally {
    els.pumpScanButton.disabled = false;
  }
}

function metric(label, value) {
  return `<div class="metric"><span>${label}</span><strong>${value}</strong></div>`;
}

function addTrade(candidate, mode, triggerPrice, triggerKind = "STANDARD") {
  const isHtfTrigger = triggerKind === "HTF";
  const effectiveStop = isHtfTrigger && candidate.side === "LONG"
    ? Math.min(Number(candidate.stop), triggerPrice * 0.985)
    : isHtfTrigger && candidate.side === "SHORT"
      ? Math.max(Number(candidate.stop), triggerPrice * 1.015)
      : Number(candidate.stop);
  const trade = {
    id: crypto.randomUUID(),
    symbol: candidate.symbol,
    side: candidate.side || scannerSide,
    mode,
    logicVersion: LOGIC_VERSION,
    setupFamily: isHtfTrigger ? "HTF_TOUCH" : candidate.side === "LONG" ? "LONG_BREAKOUT_LEGACY" : "SHORT_REJECTION_LEGACY",
    scoringModel: candidate.scoringModel || (candidate.side === "LONG" ? "LONG_LEGACY" : "SHORT_LEGACY"),
    coinMemoryAdjustment: candidate.coinMemoryAdjustment || 0,
    coinMemoryLabel: candidate.coinMemoryLabel || "",
    status: mode === "market" ? "OPEN" : "WAITING",
    triggerPrice,
    entry: mode === "market" ? candidate.last : null,
    createdAt: Date.now(),
    openedAt: mode === "market" ? Date.now() : null,
    stop: effectiveStop,
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
    setupHtfLevel: candidate.htfLevel,
    setupHtfLevelType: candidate.htfLevelType,
    setupHtfTouches: candidate.htfTouches,
    setupHtfDistanceAtr: candidate.htfDistanceAtr,
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
    setupBtcCorr: candidate.btcCorr,
    setupBtcBeta: candidate.btcBeta,
    setupBtcMode: candidate.btcMode,
    setupBtcRegime: candidate.btcRegime,
    setupBtcRegimeLabel: candidate.btcRegimeLabel,
    setupBtcTrend7d: candidate.btcTrend7d,
    setupBtcVolatility: candidate.btcVolatility,
    setupBtcPrice: candidate.btcPrice,
    triggerKind,
    mfe: 0,
    mae: 0,
    bestPrice: mode === "market" ? candidate.last : null,
    worstPrice: mode === "market" ? candidate.last : null,
    triggerPhase: mode === "trigger" ? (isHtfTrigger ? "WAIT_TOUCH" : candidate.side === "LONG" ? "WAIT_BREAKOUT" : "WAIT_RETEST") : null,
    triggerTouchedAt: null,
    triggerExpiresAt: mode === "trigger" ? Date.now() + TRIGGER_EXPIRES_MS : null,
    triggerConfirmPrice: mode === "trigger" ? (isHtfTrigger ? triggerPrice : candidate.side === "LONG" ? triggerPrice : triggerConfirmationPrice(triggerPrice)) : null,
    triggerInvalidationPrice: mode === "trigger" ? (candidate.side === "LONG" ? effectiveStop : Math.min(effectiveStop, triggerPrice * (1 + TRIGGER_INVALIDATION_PCT / 100))) : null,
    bounceHigh: null,
    firstMove: null,
    mfeHitAt: null,
    maeHitAt: null,
    mfe1HitAt: null,
    mfe2HitAt: null,
    mfe3HitAt: null,
    mfe5HitAt: null,
    mfe10HitAt: null,
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
      const confirmPrice = Number(trade.triggerConfirmPrice) || triggerPrice;
      const invalidationPrice = Number(trade.triggerInvalidationPrice) || Number(trade.stop);
      let phase = trade.triggerPhase || "WAIT_BREAKOUT";
      for (const candle of candles) {
        if (candle.time > expiresAt) {
          trade.status = "EXPIRED";
          trade.backfillNote = "Long trigger expiroval po 2 hodinách.";
          break;
        }
        if (candle.low <= invalidationPrice) {
          trade.status = "INVALID";
          trade.backfillNote = "Long support/breakout zlyhal pred vstupom; bez vstupu.";
          break;
        }
        const openedByHtfTouch = phase === "WAIT_TOUCH" && candle.low <= triggerPrice;
        const openedByBreakout = phase === "WAIT_BREAKOUT" && candle.high >= triggerPrice;
        if (openedByBreakout || openedByHtfTouch) {
          trade.status = "OPEN";
          trade.triggerPhase = "CONFIRMED";
          trade.entry = triggerPrice;
          trade.openedAt = candle.time;
          trade.bestPrice = trade.entry;
          trade.worstPrice = trade.entry;
          openedAt = candle.time;
          trade.backfillNote = openedByHtfTouch ? "Long otvorený priamo na dotyku 1h supportu." : "Long otvorený po breakoute micro resistance.";
          break;
        }
      }
      trade.triggerExpiresAt = expiresAt;
      trade.triggerConfirmPrice = confirmPrice;
      trade.triggerInvalidationPrice = invalidationPrice;
      if (!openedAt) {
        if (!["INVALID", "EXPIRED"].includes(trade.status)) {
          trade.status = "WAITING";
          trade.triggerPhase = phase;
          trade.backfillNote = phase === "WAIT_TOUCH"
            ? "Čaká sa na dotyk 1h supportu."
            : "Čaká sa na potvrdený breakout nad micro resistance.";
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
        trade.backfillNote = "Rejection trigger expiroval po 2 hodinách.";
        break;
      }
      if (phase === "WAIT_TOUCH" && candle.high >= trade.triggerPrice) {
        trade.status = "OPEN";
        phase = "CONFIRMED";
        trade.triggerPhase = phase;
        trade.entry = trade.triggerPrice;
        trade.openedAt = candle.time;
        trade.bestPrice = trade.triggerPrice;
        trade.worstPrice = trade.triggerPrice;
        openedAt = candle.time;
        trade.backfillNote = "Short otvorený priamo na dotyku 1h rezistencie.";
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
        trade.backfillNote = phase === "WAIT_TOUCH"
          ? "Čaká sa na dotyk 1h rezistencie."
          : phase === "WAIT_REJECTION"
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
  const mfeThresholdTimes = Object.fromEntries(
    [1, 2, 3, 5, 10].map((threshold) => [threshold, trade[`mfe${threshold}HitAt`] || null]),
  );
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

    const candleFavorable = favorableExcursionPct(trade, trade.side === "LONG" ? candle.high : candle.low);
    for (const threshold of [1, 2, 3, 5, 10]) {
      if (!mfeThresholdTimes[threshold] && candleFavorable >= threshold) mfeThresholdTimes[threshold] = candle.time;
    }

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
  for (const threshold of [1, 2, 3, 5, 10]) {
    trade[`mfe${threshold}HitAt`] = mfeThresholdTimes[threshold];
  }
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

function updateMfeThresholdTimes(trade, currentMfe, now) {
  for (const threshold of [1, 2, 3, 5, 10]) {
    const key = `mfe${threshold}HitAt`;
    if (!trade[key] && currentMfe >= threshold) trade[key] = now;
  }
}

function updateTradeWithPrice(trade, price, now = Date.now()) {
  if (trade.status === "WAITING" && trade.mode === "trigger") {
    if (trade.side === "LONG") {
      const expiresAt = Number(trade.triggerExpiresAt) || (Number(trade.createdAt) + TRIGGER_EXPIRES_MS);
      const confirmPrice = Number(trade.triggerConfirmPrice) || Number(trade.triggerPrice);
      trade.triggerExpiresAt = expiresAt;
      trade.triggerPhase ||= "WAIT_BREAKOUT";
      if (now >= expiresAt) {
        trade.status = "EXPIRED";
        trade.backfillNote = "Long trigger expiroval po 2 hodinách.";
        return;
      }
      if (price <= Number(trade.stop)) {
        trade.status = "INVALID";
        trade.backfillNote = "Long support/breakout zlyhal pred vstupom; bez vstupu.";
        return;
      }
      const openedByHtfTouch = trade.triggerPhase === "WAIT_TOUCH" && price <= Number(trade.triggerPrice);
      const openedByBreakout = trade.triggerPhase === "WAIT_BREAKOUT" && price >= Number(trade.triggerPrice);
      if (openedByBreakout || openedByHtfTouch) {
        trade.status = "OPEN";
        trade.triggerPhase = "CONFIRMED";
        trade.entry = openedByHtfTouch ? Number(trade.triggerPrice) : price;
        trade.openedAt = now;
        trade.bestPrice = trade.entry;
        trade.worstPrice = trade.entry;
        trade.backfillNote = openedByHtfTouch ? "Long otvorený priamo na dotyku 1h supportu." : "Long otvorený po breakoute micro resistance.";
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
      trade.backfillNote = "Rejection trigger expiroval po 2 hodinách.";
      return;
    }
    if (trade.triggerPhase === "WAIT_TOUCH" && price >= trade.triggerPrice) {
      trade.status = "OPEN";
      trade.triggerPhase = "CONFIRMED";
      trade.entry = Number(trade.triggerPrice);
      trade.openedAt = now;
      trade.bestPrice = trade.entry;
      trade.worstPrice = trade.entry;
      trade.backfillNote = "Short otvorený priamo na dotyku 1h rezistencie.";
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
  updateMfeThresholdTimes(trade, trade.mfe, now);
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
  const tradeSymbols = trades.map((trade) => trade.symbol.toLowerCase());
  const pumpSymbols = pumpRadar
    .filter((item) => item.status === "ACTIVE")
    .map((item) => item.symbol.toLowerCase());
  const controlSymbols = pumpControl
    .filter((item) => item.status === "ACTIVE")
    .map((item) => item.symbol.toLowerCase());
  const symbols = [...new Set([...tradeSymbols, ...pumpSymbols, ...controlSymbols])].sort();
  const key = symbols.join(",");
  if (key === socketSymbolsKey && priceSocket && priceSocket.readyState <= WebSocket.OPEN) return;
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
    updatePumpRadarWithPrice(symbol, price, now);
    saveTrades();
    savePumpRadar();
    savePumpControl();
    renderTrades();
    renderPumpRadar();
  };
  priceSocket.onclose = () => {
    priceSocket = null;
    socketSymbolsKey = "";
    if (trades.length || pumpRadar.some((item) => item.status === "ACTIVE") || pumpControl.some((item) => item.status === "ACTIVE")) setTimeout(connectPriceSocket, 1500);
  };
  priceSocket.onerror = () => priceSocket?.close();
}

function tradeCardHtml(trade) {
  const price = priceCache.get(trade.symbol);
  const isOpen = trade.status === "OPEN" && Number.isFinite(Number(trade.entry));
  const currentPnl = isOpen && price ? tradePnlPct(trade, price) : null;
  const isLong = trade.side === "LONG";
  const isHtfTouchTrigger = trade.triggerKind === "HTF" || trade.triggerPhase === "WAIT_TOUCH";
  const statusText = trade.status === "WAITING"
    ? isHtfTouchTrigger ? `ČAKÁ NA 1H ${isLong ? "SUPPORT" : "REZISTENCIU"}` : isLong ? "ČAKÁ NA BREAKOUT" : trade.triggerPhase === "WAIT_REJECTION" ? "RETEST HIT / ČAKÁ NA REJECTION" : "ČAKÁ NA RETEST"
    : trade.status;
  const pnlClass = isOpen ? currentPnl >= 0 ? "positive-bg" : "negative-bg" : "";
  const confirmValue = trade.mode === "trigger"
    ? isLong ? trade.triggerConfirmPrice || trade.triggerPrice : trade.triggerConfirmPrice || triggerConfirmationPrice(trade.triggerPrice)
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
        ${metric(isHtfTouchTrigger ? isLong ? "1h support touch" : "1h resistance touch" : isLong ? "Breakout" : "Retest", fmt(trade.triggerPrice))}
        ${metric(isHtfTouchTrigger ? "Entry" : isLong ? "Confirm" : "Rejection confirm", trade.mode === "trigger" ? fmt(confirmValue) : "market")}
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
  const seen = new Map();
  for (const item of journal) {
    const key = journalTradeKey(item);
    if (!seen.has(key)) seen.set(key, item);
  }
  return [...seen.values()];
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
  const allItems = uniqueJournalItems();
  const items = allItems.filter((item) =>
    journalScope === "all" || (journalScope === "current" ? isCurrentSetup(item) : !isCurrentSetup(item))
  );
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
                <span>${item.side.toLowerCase()} · ${item.mode} · ${item.closeReason || "MANUAL"} · ${item.setupFamily || inferSetupFamily(item)} · score ${item.setupScoreGrade || "-"} ${item.setupScore ?? "-"}${item.setupOverextended ? " · extended" : ""}${item.setupBtcRegimeLabel ? ` · ${item.setupBtcRegimeLabel}` : ""}</span>
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
    "symbol", "side", "mode", "logicVersion", "setupFamily", "scoringModel", "coinMemoryAdjustment", "coinMemoryLabel",
    "score", "scoreGrade", "overextended", "rewardRisk", "distanceBelowRetestAtr", "volumeRatio",
    "btcCorr", "btcBeta", "btcMode", "btcRegime", "btcTrend7d", "btcVolatility", "btcPrice",
    "result", "closeReason", "firstMove", "entry", "closePrice", "pnlPct",
    "mfePct", "maePct", "mfeBeforeMae1Pct", "mfeBeforeMae2Pct", "mfeBeforeMae3Pct",
    "mae1HitAt", "mae2HitAt", "mae3HitAt", "preMae1Ambiguous", "preMae2Ambiguous", "preMae3Ambiguous",
    "bestPrice", "worstPrice", "mfeHitAt", "maeHitAt", "mfe1HitAt", "mfe2HitAt", "mfe3HitAt", "mfe5HitAt", "mfe10HitAt",
    "pumpPct", "fadeFromPeakPct", "change24Pct", "createdAt", "openedAt", "durationMs", "backfillNote", "closedAt",
  ];
  const rows = journal.map((item) => [
    item.symbol,
    item.side || "SHORT",
    item.mode,
    item.logicVersion || "legacy",
    item.setupFamily || inferSetupFamily(item),
    item.scoringModel || "",
    item.coinMemoryAdjustment ?? "",
    item.coinMemoryLabel || "",
    item.setupScore ?? "",
    item.setupScoreGrade ?? "",
    item.setupOverextended ?? "",
    item.setupRewardRisk ?? "",
    item.setupDistanceBelowRetestAtr ?? "",
    item.setupVolumeRatio ?? "",
    item.setupBtcCorr ?? "",
    item.setupBtcBeta ?? "",
    item.setupBtcMode ?? "",
    item.setupBtcRegime ?? "",
    item.setupBtcTrend7d ?? "",
    item.setupBtcVolatility ?? "",
    item.setupBtcPrice ?? "",
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
    item.mfe1HitAt ? new Date(item.mfe1HitAt).toISOString() : "",
    item.mfe2HitAt ? new Date(item.mfe2HitAt).toISOString() : "",
    item.mfe3HitAt ? new Date(item.mfe3HitAt).toISOString() : "",
    item.mfe5HitAt ? new Date(item.mfe5HitAt).toISOString() : "",
    item.mfe10HitAt ? new Date(item.mfe10HitAt).toISOString() : "",
    item.setupPumpPct ?? "",
    item.setupFadeFromPeak ?? "",
    item.setupChange24 ?? "",
    item.createdAt ? new Date(item.createdAt).toISOString() : "",
    item.openedAt ? new Date(item.openedAt).toISOString() : "",
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
    ? "Experimentálny bottom-bounce scanner pre top losers a paper sledovanie MFE vs MAE."
    : "Short continuation scanner a paper sledovanie MFE vs MAE.";
  els.strategyEyebrow.textContent = isLong ? "BOTTOM BOUNCE · EXPERIMENT" : "SHORT CONTINUATION";
  els.strategyEyebrow.className = `strategy-eyebrow ${isLong ? "long-text" : "short-text"}`;
  els.strategyTitle.textContent = isLong ? "Experiment: odraz priamo z 1h supportu" : "Fade po pumpe na 1h rezistencii";
  els.strategyDescription.textContent = isLong
    ? "Top losers sú discovery vrstva. Long sa otvorí iba dotykom 1h supportu; breakout vetva je legacy."
    : "Top losers sú discovery vrstva. Primárny short sa otvorí dotykom 1h rezistencie.";
  els.strategyBadge.textContent = isLong ? "LONG TEST" : "SHORT";
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
if (els.pumpScanButton) els.pumpScanButton.addEventListener("click", scanPumpRadar);
if (els.exportPumpRadarButton) els.exportPumpRadarButton.addEventListener("click", exportPumpRadarCsv);
if (els.exportPumpJournalButton) els.exportPumpJournalButton.addEventListener("click", exportPumpRadarCsv);
els.journalKindTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const showPumpJournal = tab.dataset.journalKind === "pump";
    els.journalKindTabs.forEach((item) => item.classList.toggle("active", item === tab));
    els.bounceJournalPane?.classList.toggle("active", !showPumpJournal);
    els.pumpJournalPane?.classList.toggle("active", showPumpJournal);
    if (showPumpJournal) renderPumpJournal();
  });
});
els.journalScopeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    journalScope = button.dataset.journalScope || "current";
    els.journalScopeButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderJournal();
  });
});
els.tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    els.tabs.forEach((item) => item.classList.toggle("active", item === tab));
    const showJournal = tab.dataset.tab === "journal";
    const showPump = tab.dataset.tab === "pump";
    els.scannerView.classList.toggle("active", !showJournal && !showPump);
    els.journalView.classList.toggle("active", showJournal);
    if (els.pumpRadarView) els.pumpRadarView.classList.toggle("active", showPump);
    if (!showJournal && !showPump) setScannerSide(tab.dataset.tab === "long" ? "LONG" : "SHORT");
    if (showJournal) {
      backfillJournalExcursions();
      renderPumpJournal();
    }
    if (showPump) refreshPumpRadar();
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
if (els.importJournalButton && els.importJournalInput) {
  els.importJournalButton.addEventListener("click", () => els.importJournalInput.click());
  els.importJournalInput.addEventListener("change", async () => {
    const file = els.importJournalInput.files?.[0];
    if (!file) return;
    try {
      const { added, total } = importJournalCsvText(await file.text());
      alert(`Import hotový: pridané ${added} z ${total} riadkov. Duplicitné obchody som preskočil.`);
    } catch (error) {
      alert(`CSV sa nepodarilo importovať: ${error.message}`);
    } finally {
      els.importJournalInput.value = "";
    }
  });
}

normalizeAllTrades();
migrateActivePumpScores();
setScannerSide("SHORT");
renderJournal();
renderPumpRadar();
renderPumpJournal();
refreshPumpRadar();
importBundledJournalSeed().then(renderJournal);
backfillJournalExcursions();
reconcileTrades(true).then(() => {
  renderTrades();
  renderJournal();
  refreshTrades();
});
connectPriceSocket();
setInterval(refreshTrades, 5000);
setInterval(refreshPumpRadar, 15 * 60 * 1000);
setInterval(() => {
  if (!matureExpiredPumpWatches()) return;
  renderPumpRadar();
  renderPumpJournal();
  connectPriceSocket();
}, 60 * 1000);
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
