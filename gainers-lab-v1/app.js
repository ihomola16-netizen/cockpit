const API = "https://fapi.binance.com";
const STORE = {
  paper: "gainers-lab-v1-paper",
  journal: "gainers-lab-v1-journal",
  analysisManual: "gainers-lab-v1-analysis-manual",
  analysisManualPatch: "gainers-lab-v1-analysis-manual-patch-2026-05-22-service-pc",
  journalImportPatch: "gainers-lab-v1-journal-import-patch-2026-05-25-service-pc",
  dayLog: "gainers-lab-v1-day-log",
  selected: "gainers-lab-v1-selected",
  paperChartPair: "gainers-lab-v1-paper-chart-pair",
};

const SERVICE_PC_JOURNAL_IMPORTS = [
  {
    importKey: "2026-05-25-truthusdt-short-114555-131632",
    tradeId: "service-pc-2026-05-25-truthusdt-short-114555",
    pair: "TRUTHUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.01393,
    exit: 0.013934,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 0.37,
    mfe: 1.26,
    mae: -2.09,
    timeInTrade: "1h 30m",
    timeToTp1: "1h 4m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-25T11:41:13.201Z",
    entryTouchedPrice: 0.014011,
    openedAt: "2026-05-25T11:45:55.891Z",
    tp1At: "2026-05-25T12:50:10.784Z",
    closedAt: "2026-05-25T13:16:32.481Z",
    outcome: "Win",
    market: { gainerRank: 9, btcMovePct: -0.15, metadata: { pump: { distanceFromHighPct: 0.73, timeSincePumpMin: 1061 }, h1: { trend: "up" }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-25-soonusdt-short-062255-104706",
    tradeId: "service-pc-2026-05-25-soonusdt-short-062255",
    pair: "SOONUSDT",
    side: "short",
    scenario: "Too hot / top watch",
    rating: 56,
    entry: 0.1799,
    exit: 0.1848,
    reason: "SL",
    status: "closed",
    tpHit: "nie",
    resultPct: -2.72,
    mfe: 3.67,
    mae: -2.72,
    timeInTrade: "4h 24m",
    timeToTp1: "-",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-25T06:03:55.948Z",
    entryTouchedPrice: 0.1811,
    openedAt: "2026-05-25T06:22:55.972Z",
    tp1At: null,
    closedAt: "2026-05-25T10:47:06.194Z",
    outcome: "Loss",
    market: { gainerRank: 14, btcMovePct: 0.12, metadata: { pump: { distanceFromHighPct: 0.11, timeSincePumpMin: 16 }, h1: { trend: "up" }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-25-geniususdt-long-085156-091256",
    tradeId: "service-pc-2026-05-25-geniususdt-long-085156",
    pair: "GENIUSUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 75,
    entry: 0.704,
    exit: 0.6768,
    reason: "SL",
    status: "closed",
    tpHit: "nie",
    resultPct: -3.86,
    mfe: 0.03,
    mae: -3.86,
    timeInTrade: "21m",
    timeToTp1: "-",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-25T08:24:53.988Z",
    entryTouchedPrice: 0.6955,
    openedAt: "2026-05-25T08:51:56.063Z",
    tp1At: null,
    closedAt: "2026-05-25T09:12:56.117Z",
    outcome: "Loss",
    market: { gainerRank: 15, btcMovePct: 0.20, metadata: { pump: { distanceFromHighPct: 13.62, timeSincePumpMin: 1351 }, h1: { trend: "down" }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-25-sportfunusdt-long-085056-094656",
    tradeId: "service-pc-2026-05-25-sportfunusdt-long-085056",
    pair: "SPORTFUNUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 56,
    entry: 0.06149,
    exit: 0.06448,
    reason: "Final TP",
    status: "closed",
    tpHit: "TP1, TP2, TP3",
    resultPct: 3.36,
    mfe: 4.86,
    mae: 0,
    timeInTrade: "56m",
    timeToTp1: "1m",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-25T07:20:39.503Z",
    entryTouchedPrice: 0.0601,
    openedAt: "2026-05-25T08:50:56.028Z",
    tp1At: "2026-05-25T08:51:56.064Z",
    closedAt: "2026-05-25T09:46:56.133Z",
    outcome: "Win",
    market: { gainerRank: 6, btcMovePct: 0.35, metadata: { pump: { distanceFromHighPct: 2.36, timeSincePumpMin: 736 }, h1: { trend: "up" }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-25-xanusdt-short-081556-113652",
    tradeId: "service-pc-2026-05-25-xanusdt-short-081556",
    pair: "XANUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.013266,
    exit: 0.012619,
    reason: "Final TP",
    status: "closed",
    tpHit: "TP1, TP2, TP3",
    resultPct: 4.76,
    mfe: 4.88,
    mae: 0,
    timeInTrade: "3h 20m",
    timeToTp1: "4m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-25T07:32:55.960Z",
    entryTouchedPrice: 0.013437,
    openedAt: "2026-05-25T08:15:56.147Z",
    tp1At: "2026-05-25T08:20:24.965Z",
    closedAt: "2026-05-25T11:36:52.007Z",
    outcome: "Win",
    market: { gainerRank: 1, btcMovePct: 0.37, metadata: { pump: { distanceFromHighPct: 3.65, timeSincePumpMin: 330 }, h1: { trend: "up" }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-25-fidausdt-long-063136-081928",
    tradeId: "service-pc-2026-05-25-fidausdt-long-063136",
    pair: "FIDAUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 61,
    entry: 0.03658,
    exit: 0.03657,
    reason: "SL",
    status: "closed",
    tpHit: "TP1, TP2",
    resultPct: 2.06,
    mfe: 2.73,
    mae: -0.66,
    timeInTrade: "1h 47m",
    timeToTp1: "9m",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-25T06:27:55.947Z",
    entryTouchedPrice: 0.03637,
    openedAt: "2026-05-25T06:31:36.996Z",
    tp1At: "2026-05-25T06:40:56.997Z",
    closedAt: "2026-05-25T08:19:28.282Z",
    outcome: "Win",
    market: { gainerRank: 8, btcMovePct: -0.01, metadata: { pump: { distanceFromHighPct: 8.90, timeSincePumpMin: 826 }, h1: { trend: "up" }, liquidity: { bucket: "clean" } } },
  },
];

const SERVICE_PC_ANALYSIS_ROWS = `2026-05-22,PROVEUSDT,long,deň -> ráno,Range after pump,-,-,nie,-8.93,Loss SL,15,-,-,-,-,Paper
2026-05-22,AVNTUSDT,long,deň -> ráno,Pullback long,-,-,TP1 TP2,3.31,Win SL,99,-,-,-,-,Paper
2026-05-22,EDENUSDT,long,ráno,Range after pump,-,-,TP1 TP2 TP3,36.88,Win Final TP,14,-,-,-,-,Paper`;

const ANALYSIS_SEED_DATA = `${SERVICE_PC_ANALYSIS_ROWS}
2026-05-21,BEATUSDT,short,deň,Too hot / top watch,-,-,nie,-1.61,Loss SL,63,-,-,-,-,Paper
2026-05-21,JTOUSDT,long,ráno,Range after pump,-,-,nie,-3.86,Loss SL,44,-,-,-,-,Paper
2026-05-21,USELESSUSDT,short,ráno -> deň,Top rejection short,-,-,TP1,2.34,Win SL,100,-,-,-,-,Paper
2026-05-21,EDENUSDT,long,ráno,Range after pump,-,-,nie,-3.46,Loss SL,52,-,-,-,-,Paper
2026-05-21,UAIUSDT,short,ráno,Too hot / top watch,-,-,nie,-1.42,Loss SL,73,-,-,-,-,Paper
2026-05-21,BEATUSDT,long,ráno,Range after pump,-,-,TP1,0.11,Win SL,44,-,-,-,-,Paper
2026-05-21,AINUSDT,long,ráno,Range after pump,-,-,TP1,1.17,Win SL,54,-,-,-,-,Paper
2026-05-21,BEATUSDT,short,ráno,Top rejection short,-,-,TP1,1.32,Win SL,100,-,-,-,-,Paper
2026-05-21,VVVUSDT,long,deň -> noc,Pullback long,-,-,nie,-8.47,Loss SL,-,-,-,-,-,Paper
2026-05-20,RONINUSDT,short,večer,Top rejection short,0.1133,0.10661,TP1,5.91,Running TP running / SL na entry,-,6.97,-0.71,33h 20m,33h 20m,Paper
2026-05-20,ENJUSDT,short,večer -> ráno,Top rejection short,0.04956,0.0456,TP1 TP2 TP3,6.34,Win Final TP,-,7.99,-0.08,10h 9m,10h 9m,Paper
2026-05-20,CFGUSDT,short,večer -> noc,Top rejection short,0.2896,0.2997,TP1,2.30,Win SL,-,0,0,-,-,Paper
2026-05-20,PLAYUSDT,long,deň,Pullback long,0.1551,0.15481,TP1,2.52,Win SL,-,-,-,-,-,Paper
2026-05-20,PROMPTUSDT,long,deň,Range after pump,0.03972,0.03956,TP1,1.63,Win SL,-,-,-,-,-,Paper
2026-05-20,BSBUSDT,long,deň,Range low bounce,0.76419,0.82258,TP1 TP2 TP3,7.17,Win Final TP,-,-,-,-,-,Paper
2026-05-20,BANANAS31USDT,short,deň,Too hot / top watch,0.012171,0.012447,nie,-2.27,Loss SL,-,-,-,-,-,Paper
2026-05-20,FIGHTUSDT,long,deň,Range after pump,0.004999,0.005341,TP1 TP2 TP3,6.55,Win Final TP,-,-,-,-,-,Paper
2026-05-20,BSBUSDT,long,deň,Range after pump,0.80828,0.80585,TP1,1.34,Win SL,-,-,-,-,-,Paper
2026-05-20,PLAYUSDT,short,ráno -> deň,Top rejection short,0.15377,0.16027,nie,-4.23,Loss SL,-,-,-,-,-,Paper
2026-05-20,EDENUSDT,long,ráno -> deň,Range after pump,0.07996,0.07995,TP1,3.25,Win SL,-,-,-,-,-,Paper
2026-05-20,LITUSDT,long,ráno,Range after pump,1.1815,1.1808,TP1,2.32,Win SL,-,-,-,-,-,Paper
2026-05-20,MUSDT,long,noc -> ráno,Range after pump,3.5072,3.4429,nie,-1.83,Loss SL,-,-,-,-,-,Paper
2026-05-19,BROCCOLIF3BUSDT,short,večer,Top rejection short,0.004719,0.004885,nie,-3.52,Loss SL,-,0,0,-,-,Paper
2026-05-19,MLNUSDT,long,večer -> noc,Range after pump,2.579,2.372,nie,-8.03,Loss SL,-,0,0,-,-,Paper
2026-05-19,ONDOUSDT,long,ráno,Range after pump,0.3795,0.3697,nie,-2.58,Loss SL
2026-05-19,IDOLUSDT,long,ráno,Range after pump,0.0261,0.0261,TP1,0.31,Win SL
2026-05-19,EDENUSDT,short,ráno,Too hot / top watch,0.0643,0.0683,nie,-6.29,Loss SL
2026-05-19,STARUSDT,long,ráno,Range after pump,0.1721,0.1681,nie,-2.31,Loss SL
2026-05-19,ONTUSDT,long,ráno,Pullback long,0.0625,0.067,TP1 TP2 TP3,6.17,Win Final TP
2026-05-18,APRUSDT,short,deň,Top rejection short,0.175,0.1644,TP1 TP2 TP3,4.71,Win Final TP
2026-05-18,EDENUSDT,long,deň,Range after pump,0.0534,0.0533,TP1,2.21,Win SL
2026-05-18,FHEUSDT,long,deň,Range after pump,0.0297,0.0297,TP1,0.67,Win SL
2026-05-18,BSBUSDT,short,-,Top rejection short,0.6573,0.6573,TP1,1.44,Win SL
2026-05-18,STARUSDT,long,-,Range after pump,0.2647,0.1511,nie,-42.93,Loss SL
2026-05-18,AIGENSYNUSDT,short,-,Top rejection short,0.0461,0.037,TP1 TP2 TP3,14.43,Win Final TP
2026-05-15,GPSUSDT,short,večer,Too hot / top watch,0.0087,0.0088,nie,-2.22,Loss SL
2026-05-15,PLAYUSDT,long,deň,Range after pump,0.1041,0.1105,TP1 TP2 TP3,5.92,Win Final TP
2026-05-15,AIGENSYNUSDT,long,večer,Range after pump,0.0421,0.0414,TP1,8.76,Win SL
2026-05-15,SAPIENUSDT,short,večer,Top rejection short,0.1402,0.1283,TP1 TP2 TP3,3.72,Win Final TP
2026-05-15,AIOUSDT,long,večer,Range after pump,0.1211,0.1209,TP1,2.04,Win SL
2026-05-14,AIOUSDT,short,Top rejection short,0.1137,0.1168,nie,-2.76,Loss SL
2026-05-14,COLLECTUSDT,short,Too hot / top watch,0.0686,0.0613,TP1 TP2 TP3,10.65,Win Final TP
2026-05-14,COLLECTUSDT,long,Range after pump,0.0617,0.069,TP1 TP2 TP3,11.42,Win Final TP
2026-05-14,MLNUSDT,long,Pullback long,2.911,3.624,TP1 TP2 TP3,23.48,Win Final TP
2026-05-14,PIEVERSEUSDT,short,Top rejection short,1.0556,1.0093,TP1 TP2 TP3,3.53,Win Final TP
2026-05-14,MLNUSDT,long,Pullback long,2.833,2.803,TP1,3.35,Win SL
2026-05-14,AINUSDT,long,Range after pump,0.1268,0.1194,nie,-5.80,Loss SL
2026-05-14,RIVERUSDT,long,Range after pump,7.251,7.156,TP1 TP2,5.59,Win SL
2026-05-14,IDOLUSDT,long,Pullback long,0.0317,0.031,nie,-2.15,Loss SL
2026-05-14,TRUTHUSDT,long,Range after pump,0.0216,0.0216,TP1,3.07,Win SL
2026-05-14,KITEUSDT,short,Too hot / top watch,0.2269,0.2269,TP1,1.52,Win SL
2026-05-14,QUSDT,long,Pullback long,0.0235,0.0235,TP1,2.95,Win SL
2026-05-14,JCTUSDT,long,Range after pump,0.0045,0.0042,nie,-7.23,Loss SL
2026-05-14,UBUSDT,short,Top rejection short,0.2085,0.192,TP1 TP2 TP3,5.26,Win Final TP
2026-05-14,QUSDT,short,Top rejection short,0.0226,0.0253,nie,-12.11,Loss SL
2026-05-14,LABUSDT,long,Pullback long,6.2007,5.679,nie,-8.41,Loss SL
2026-05-13,NAORISUSDT,long,Range after pump,0.1224,0.1187,nie,-3.07,Loss SL
2026-05-13,VELVETUSDT,long,Pullback long,0.1205,0.114,nie,-5.41,Loss SL
2026-05-13,TRUTHUSDT,short,Top rejection short,0.0234,0.0245,TP1,1.79,Win SL
2026-05-13,VELVETUSDT,long,Pullback long,0.1232,0.1164,nie,-5.48,Loss SL
2026-05-13,COSUSDT,long,Pullback long,0.0018,0.0017,nie,-6.99,Loss SL`;

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
  pumpRankList: document.getElementById("pumpRankList"),
  pumpRankMeta: document.getElementById("pumpRankMeta"),
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
  analysisManualInput: document.getElementById("analysisManualInput"),
  analysisManualMeta: document.getElementById("analysisManualMeta"),
  saveAnalysisManualButton: document.getElementById("saveAnalysisManualButton"),
  clearAnalysisManualButton: document.getElementById("clearAnalysisManualButton"),
  dayLogMeta: document.getElementById("dayLogMeta"),
  exportDayLogButton: document.getElementById("exportDayLogButton"),
  exportAnalysisTextButton: document.getElementById("exportAnalysisTextButton"),
  exportAnalysisJsonButton: document.getElementById("exportAnalysisJsonButton"),
  clearDayLogButton: document.getElementById("clearDayLogButton"),
  analysisMeta: document.getElementById("analysisMeta"),
  analysisSummary: document.getElementById("analysisSummary"),
  analysisBestList: document.getElementById("analysisBestList"),
  analysisWorstList: document.getElementById("analysisWorstList"),
  analysisInsights: document.getElementById("analysisInsights"),
  analysisScenarioBars: document.getElementById("analysisScenarioBars"),
  analysisSideBars: document.getElementById("analysisSideBars"),
  analysisRatingBars: document.getElementById("analysisRatingBars"),
  analysisSetupSideBars: document.getElementById("analysisSetupSideBars"),
  analysisMonthMeta: document.getElementById("analysisMonthMeta"),
  analysisMonths: document.getElementById("analysisMonths"),
  analysisWeekMeta: document.getElementById("analysisWeekMeta"),
  analysisWeeks: document.getElementById("analysisWeeks"),
  analysisDayBars: document.getElementById("analysisDayBars"),
  analysisDayMeta: document.getElementById("analysisDayMeta"),
  analysisDays: document.getElementById("analysisDays"),
};

let gainers = [];
let selected = null;
const MAX_STRUCTURAL_RISK_PCT = 7;
const AUTO_SCAN_MS = 10 * 60 * 1000;
const ENTRY_CONFIRM_ATR = 0.12;
const PAPER_CATCHUP_GAP_MS = 90 * 1000;
const PAPER_CATCHUP_MAX_REQUESTS = 3;

function uid(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function priceDigits(value) {
  const abs = Math.abs(Number(value));
  if (!Number.isFinite(abs)) return 4;
  if (abs >= 100) return 2;
  if (abs >= 1) return 4;
  if (abs >= 0.1) return 5;
  if (abs >= 0.01) return 6;
  if (abs >= 0.001) return 7;
  if (abs >= 0.0001) return 8;
  return 10;
}

function priceDigitsFor(values) {
  const nums = values.map(Number).filter(Number.isFinite);
  if (!nums.length) return 4;
  const spread = Math.max(...nums) - Math.min(...nums);
  const spreadDigits = spread > 0 ? Math.ceil(-Math.log10(spread)) + 1 : 0;
  return clamp(Math.max(...nums.map(priceDigits), spreadDigits), 2, 10);
}

function fmt(value, digits = "auto") {
  if (!Number.isFinite(value)) return "-";
  const fractionDigits = digits === "auto" ? priceDigits(value) : digits;
  return value.toLocaleString("en-US", { maximumFractionDigits: fractionDigits });
}

function fmtPrice(value, peers = []) {
  if (!Number.isFinite(value)) return "-";
  return value.toLocaleString("en-US", { maximumFractionDigits: priceDigitsFor([value, ...peers]) });
}

function pct(value, digits = 2) {
  if (!Number.isFinite(value)) return "-";
  return `${value >= 0 ? "+" : ""}${value.toFixed(digits)}%`;
}

function compactNumber(value, digits = 1) {
  if (!Number.isFinite(value)) return "-";
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: digits,
  }).format(value);
}

function usd(value) {
  if (!Number.isFinite(value)) return "-";
  return `$${compactNumber(value, value >= 1000000 ? 1 : 0)}`;
}

function timeAgo(from, to = new Date().toISOString()) {
  if (!from) return "-";
  const minutes = Math.max(0, Math.floor((new Date(to) - new Date(from)) / 60000));
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours > 0) return `${hours}h ${rest}m`;
  return `${minutes}m`;
}

function clockTime(stamp) {
  if (!stamp) return "-";
  return new Date(stamp).toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit" });
}

function dateTimeLabel(stamp) {
  if (!stamp) return "-";
  const date = new Date(stamp);
  return `${date.toLocaleDateString("sk-SK", { day: "2-digit", month: "2-digit" })} ${clockTime(stamp)}`;
}

function movePct(entry, price, side) {
  if (!Number.isFinite(entry) || !Number.isFinite(price) || entry <= 0) return NaN;
  return ((price - entry) / entry) * 100 * (side === "short" ? -1 : 1);
}

function absMovePct(entry, price) {
  if (!Number.isFinite(entry) || !Number.isFinite(price) || entry <= 0) return NaN;
  return Math.abs(((price - entry) / entry) * 100);
}

function rewardRiskRatio(entry, target, stop, side) {
  const reward = Math.max(0, movePct(entry, target, side));
  const risk = absMovePct(entry, stop);
  return Number.isFinite(reward) && Number.isFinite(risk) && risk > 0 ? reward / risk : NaN;
}

function sessionLabel(stamp = new Date().toISOString()) {
  const hour = new Date(stamp).getHours();
  if (hour >= 6 && hour < 12) return "ráno";
  if (hour >= 12 && hour < 18) return "deň";
  if (hour >= 18 && hour < 23) return "večer";
  return "noc";
}

function average(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
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

function dayLog() {
  return storeGet(STORE.dayLog, []);
}

function saveDayLog(entries) {
  storeSet(STORE.dayLog, entries);
}

function localIsoDay(stamp = new Date().toISOString()) {
  const date = new Date(stamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function simplifyGainerForLog(item) {
  const pump = item.metadata?.pump || {};
  const h1 = item.metadata?.higherTimeframe?.h1 || {};
  const liquidity = item.metadata?.liquidity || {};
  return {
    pair: item.pair,
    gainerRank: item.gainerRank,
    dayChange: item.dayChange,
    price: item.price,
    rating: item.rating,
    side: item.plan?.side,
    scenario: item.scenario,
    state: item.state,
    tradable: item.tradable,
    entryZone: item.plan?.entryZone,
    entry: item.plan?.entry,
    stop: item.plan?.stop,
    targets: item.plan?.targets || [],
    riskPct: item.plan?.riskPct,
    tp1R: rewardRiskRatio(item.plan?.entry, item.plan?.targets?.[0], item.plan?.stop, item.plan?.side),
    quoteVolume: item.quoteVolume,
    tradeCount: item.tradeCount,
    spreadPct: item.spreadPct,
    volumeRatio: item.volumeRatio,
    takerBuyPct: item.takerBuyPct,
    atrPct: item.atrPct,
    extensionAtr: item.extensionAtr,
    rangePosition: item.rangePosition,
    distanceToZoneAtr: item.distanceToZoneAtr,
    distanceFromHighPct: pump.distanceFromHighPct,
    distanceFromHighAtr: pump.distanceFromHighAtr,
    timeSincePumpMin: pump.timeSincePumpMin,
    pumpCandleMovePct: pump.pumpCandleMovePct,
    h1Trend: h1.trend,
    h1CloseStrength: h1.closeStrength,
    h1RejectionFromHigh: h1.rejectionFromHigh,
    h1ExtensionAtr: h1.extensionAtr,
    h1RangePosition: h1.rangePosition,
    liquidityScore: liquidity.score,
    liquidityBucket: liquidity.bucket,
    warnings: item.warnings || [],
  };
}

function recordDaySnapshot(source = "scan") {
  if (!gainers.length) return;
  const capturedAt = new Date().toISOString();
  const snapshot = {
    id: uid("snap"),
    source,
    capturedAt,
    date: localIsoDay(capturedAt),
    universe: "TOP15",
    items: gainers.slice().sort((a, b) => (a.gainerRank || 999) - (b.gainerRank || 999)).map(simplifyGainerForLog),
  };
  const next = [snapshot, ...dayLog()].slice(0, 240);
  saveDayLog(next);
  renderDayLogMeta();
}

function renderDayLogMeta() {
  if (!ui.dayLogMeta) return;
  const today = localIsoDay();
  const count = dayLog().filter((entry) => entry.date === today).length;
  ui.dayLogMeta.textContent = `${count} snapshots dnes`;
}

function fmtLogNum(value, digits = 2, suffix = "") {
  if (!Number.isFinite(value)) return "-";
  return `${Number(value).toFixed(digits)}${suffix}`;
}

function formatDayLogEntry(snapshot) {
  const time = new Date(snapshot.capturedAt).toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit" });
  const lines = [
    "",
    `[${time}] ${snapshot.universe} snapshot | ${snapshot.source} | ${snapshot.items.length} coins`,
  ];
  snapshot.items.forEach((item) => {
    lines.push(
      `#${item.gainerRank || "-"} ${item.pair} | ${item.side} | ${item.scenario} | rating ${item.rating}/100 | 24h ${fmtLogNum(item.dayChange, 2, "%")} | state ${item.state}`,
      `  price ${fmt(item.price)} | entryZone ${zoneText(item.entryZone)} | entry ${fmt(item.entry)} | SL ${fmt(item.stop)} | TP ${item.targets.map((target, index) => `TP${index + 1} ${fmt(target)}`).join(" / ")}`,
      `  risk ${fmtLogNum(item.riskPct, 2, "%")} | tp1R ${fmtLogNum(item.tp1R, 2, "R")} | spread ${fmtLogNum(item.spreadPct, 3, "%")} | volume ${usd(item.quoteVolume)} | trades ${compactNumber(item.tradeCount, 1)} | volRatio ${fmtLogNum(item.volumeRatio, 2)} | takerBuy ${fmtLogNum(item.takerBuyPct, 0, "%")}`,
      `  pump: highDist ${fmtLogNum(item.distanceFromHighPct, 2, "%")} | highDistAtr ${fmtLogNum(item.distanceFromHighAtr, 2)} | pumpAge ${durationLabel(item.timeSincePumpMin)} | pumpCandle ${fmtLogNum(item.pumpCandleMovePct, 2, "%")}`,
      `  1h: trend ${item.h1Trend || "-"} | closeStrength ${fmtLogNum(item.h1CloseStrength, 0, "%")} | rejectionHigh ${item.h1RejectionFromHigh ? "yes" : "no"} | ext ${fmtLogNum(item.h1ExtensionAtr, 2)} ATR | rangePos ${fmtLogNum(item.h1RangePosition, 0, "%")}`,
      `  liquidity: ${item.liquidityBucket || "-"} (${Number.isFinite(item.liquidityScore) ? item.liquidityScore : "-"}/100) | warnings: ${item.warnings.length ? item.warnings.join(" | ") : "-"}`
    );
  });
  return lines.join("\n");
}

function formatTradeLogLine(trade, label) {
  const market = trade.market || {};
  const metadata = market.metadata || {};
  const pump = metadata.pump || {};
  const h1 = metadata.higherTimeframe?.h1 || {};
  const liquidity = metadata.liquidity || {};
  return [
    `${label}: ${trade.pair} | ${trade.side} | ${trade.scenario} | rating ${Number.isFinite(trade.rating) ? trade.rating : "-"} | rank #${market.gainerRank || metadata.gainerRank || "-"}`,
    `  created ${trade.createdAt || "-"} (${dateTimeLabel(trade.createdAt)}) | opened ${trade.openedAt || "-"} (${dateTimeLabel(trade.openedAt)}) | closed ${trade.closedAt || "-"} (${dateTimeLabel(trade.closedAt)})`,
    `  status ${trade.status || "-"} | entry ${fmt(trade.entry)} | exit ${fmt(trade.exit)} | result ${pct(trade.resultPct)}`,
    `  openFilter ${trade.entryRule || "-"} | touchedAt ${trade.entryTouchedAt || "-"} | touchedPrice ${fmt(trade.entryTouchedPrice)}`,
    `  TP ${trade.tpHit || trade.targets?.filter((target) => target.hit).map((target) => target.label).join(" ") || "nie"} | TP1 at ${trade.tp1At || trade.targets?.find((target) => target.label === "TP1")?.hitAt || "-"} (${dateTimeLabel(trade.tp1At || trade.targets?.find((target) => target.label === "TP1")?.hitAt)}) | TP1 after ${trade.timeToTp1 || "-"} | MFE ${pct(trade.mfe)} | MAE ${pct(trade.mae)} | time ${trade.timeInTrade || "-"}`,
    `  risk: initial ${pct(trade.riskPct)} | TP1/R ${fmtLogNum(trade.tp1R, 2, "R")}`,
    `  metadata: highDist ${fmtLogNum(pump.distanceFromHighPct, 2, "%")} | pumpAge ${durationLabel(pump.timeSincePumpMin)} | 1h ${h1.trend || "-"} | liquidity ${liquidity.bucket || "-"} | BTC move ${pct(market.btcMovePct)}`,
  ].join("\n");
}

function buildDayLogText(date = localIsoDay()) {
  const snapshots = dayLog().filter((entry) => entry.date === date).sort((a, b) => a.capturedAt.localeCompare(b.capturedAt));
  const paper = paperState();
  const paperTrades = [...paper.waiting, ...paper.active].filter((trade) => localIsoDay(trade.createdAt || trade.openedAt || new Date().toISOString()) === date);
  const journalRows = journal().filter((row) => localIsoDay(row.closedAt || row.updatedAt || row.createdAt || new Date().toISOString()) === date);
  const lines = [
    "GAINERS_LAB_DAY_LOG",
    `date: ${date}`,
    `exportedAt: ${new Date().toISOString()}`,
    `snapshots: ${snapshots.length}`,
    `openPaperTrades: ${paperTrades.length}`,
    `journalRows: ${journalRows.length}`,
    "",
    "HOW_TO_USE",
    "Pošli tento text spolu s výsledkami pracovných obchodov. Stačí dopísať coin, side, result, TP/status a približný čas vstupu.",
    "",
    "OPEN_PAPER_TRADES",
    paperTrades.length ? paperTrades.map((trade) => formatTradeLogLine(trade, "OPEN")).join("\n") : "-",
    "",
    "JOURNAL_ROWS",
    journalRows.length ? journalRows.map((row) => formatTradeLogLine(row, row.status === "running" ? "RUNNING" : "CLOSED")).join("\n") : "-",
    "",
    "TOP15_SNAPSHOTS",
    snapshots.length ? snapshots.map(formatDayLogEntry).join("\n") : "-",
  ];
  return lines.join("\n");
}

function localStorageSnapshot() {
  const snapshot = {};
  const keys = new Set(Object.values(STORE));
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key?.startsWith("gainers-lab-v1")) keys.add(key);
  }
  keys.forEach((key) => {
    const raw = localStorage.getItem(key);
    if (raw === null) return;
    try {
      snapshot[key] = JSON.parse(raw);
    } catch {
      snapshot[key] = raw;
    }
  });
  return snapshot;
}

function analysisExportRows(date = localIsoDay()) {
  return analysisRows().filter((row) => row.date === date);
}

function buildAnalysisBundle(date = localIsoDay()) {
  const rows = analysisExportRows(date);
  const allRows = analysisRows();
  const paper = paperState();
  const snapshots = dayLog().filter((entry) => entry.date === date);
  return {
    schema: "GAINERS_LAB_ANALYSIS_EXPORT_V1",
    exportedAt: new Date().toISOString(),
    date,
    app: {
      universe: "TOP15",
      chartTimeframe: "15m",
      note: "Analysis export keeps raw journal, manual rows, paper state, day snapshots, analysis rows and hidden metadata.",
    },
    counts: {
      analysisRowsToday: rows.length,
      analysisRowsAll: allRows.length,
      journalRows: journal().length,
      manualRows: parseManualAnalysisRows(manualAnalysisText()).length,
      daySnapshotsToday: snapshots.length,
      daySnapshotsAll: dayLog().length,
      paperWaiting: paper.waiting.length,
      paperActive: paper.active.length,
    },
    analysisRowsToday: rows,
    analysisRowsAll: allRows,
    raw: {
      journal: journal(),
      manualAnalysisText: manualAnalysisText(),
      paper,
      dayLog: dayLog(),
      latestTopGainers: gainers.map(simplifyGainerForLog),
      selectedPair: selected?.pair || null,
      selected: selected ? simplifyGainerForLog(selected) : null,
      localStorage: localStorageSnapshot(),
    },
  };
}

function buildAnalysisText(date = localIsoDay()) {
  const bundle = buildAnalysisBundle(date);
  const rows = bundle.analysisRowsToday;
  const stats = analysisStats(rows);
  const lines = [
    "GAINERS_LAB_ANALYSIS_EXPORT",
    `date: ${date}`,
    `exportedAt: ${bundle.exportedAt}`,
    `rowsToday: ${rows.length}`,
    `allAnalysisRows: ${bundle.counts.analysisRowsAll}`,
    `journalRows: ${bundle.counts.journalRows}`,
    `manualRows: ${bundle.counts.manualRows}`,
    `daySnapshots: ${bundle.counts.daySnapshotsToday} today / ${bundle.counts.daySnapshotsAll} all`,
    `paper: ${bundle.counts.paperWaiting} waiting / ${bundle.counts.paperActive} active`,
    "",
    "TODAY_SUMMARY",
    `WR ${fmt(stats.winrate, 0)}% | wins ${stats.wins} | losses ${stats.losses} | avg ${pct(stats.avg)} | total ${pct(stats.total)}`,
    "",
    "TODAY_ANALYSIS_ROWS",
  ];
  if (!rows.length) {
    lines.push("-");
  } else {
    rows.forEach((row) => {
      const metadata = row.metadata || {};
      const pump = metadata.pump || {};
      const h1 = metadata.higherTimeframe?.h1 || {};
      const liquidity = metadata.liquidity || {};
      lines.push(
        `${row.date} | ${row.pair} | ${row.side} | ${row.session} | ${row.scenario} | rating ${Number.isFinite(row.rating) ? row.rating : "-"} | ${row.tpHit || "nie"} | ${pct(row.resultPct)} | ${row.status} | ${row.account}`,
        `  entry ${fmt(row.entry)} | exit ${fmt(row.exit)} | MFE ${pct(row.mfe)} | MAE ${pct(row.mae)} | time ${row.timeInTrade || "-"} | TP1 time ${row.timeToTp1 || "-"}`,
        `  risk ${pct(row.riskPct)} | TP1/R ${fmtLogNum(row.tp1R, 2, "R")}`,
        `  opened ${row.openedAt || "-"} (${dateTimeLabel(row.openedAt)}) | TP1 ${row.tp1At || "-"} (${dateTimeLabel(row.tp1At)}) | closed ${row.closedAt || "-"} (${dateTimeLabel(row.closedAt)})`,
        `  metadata: rank #${row.gainerRank || metadata.gainerRank || "-"} | highDist ${fmtLogNum(pump.distanceFromHighPct, 2, "%")} | pumpAge ${durationLabel(pump.timeSincePumpMin)} | 1h ${h1.trend || "-"} | liquidity ${liquidity.bucket || "-"} | BTC move ${pct(row.btcMovePct)}`
      );
    });
  }
  lines.push(
    "",
    "RAW_JSON",
    JSON.stringify(bundle)
  );
  return lines.join("\n");
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportDayLog() {
  const date = localIsoDay();
  downloadText(`gainers-lab-day-log-${date}.txt`, buildDayLogText(date));
}

function exportAnalysisText() {
  const date = localIsoDay();
  downloadText(`gainers-lab-analysis-${date}.txt`, buildAnalysisText(date));
}

function exportAnalysisJson() {
  const date = localIsoDay();
  downloadText(`gainers-lab-full-data-${date}.json`, JSON.stringify(buildAnalysisBundle(date), null, 2));
}

function clearTodayDayLog() {
  const today = localIsoDay();
  saveDayLog(dayLog().filter((entry) => entry.date !== today));
  renderDayLogMeta();
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
    closeTime: row[6],
    open: Number(row[1]),
    high: Number(row[2]),
    low: Number(row[3]),
    close: Number(row[4]),
    volume: Number(row[5]),
    takerBuyVolume: Number(row[9]),
  }));
}

async function klinesRange(pair, interval = "1m", startTime = Date.now() - 60 * 60 * 1000, endTime = Date.now()) {
  const out = [];
  let cursor = Math.max(0, Number(startTime) || 0);
  const stop = Number(endTime) || Date.now();
  for (let request = 0; request < PAPER_CATCHUP_MAX_REQUESTS && cursor < stop; request += 1) {
    const rows = await json(`${API}/fapi/v1/klines?symbol=${pair}&interval=${interval}&startTime=${Math.floor(cursor)}&endTime=${Math.floor(stop)}&limit=1500`);
    if (!rows.length) break;
    rows.forEach((row) => out.push({
      time: row[0],
      closeTime: row[6],
      open: Number(row[1]),
      high: Number(row[2]),
      low: Number(row[3]),
      close: Number(row[4]),
      volume: Number(row[5]),
      takerBuyVolume: Number(row[9]),
    }));
    const next = rows.at(-1)[6] + 1;
    if (next <= cursor) break;
    cursor = next;
  }
  return out;
}

async function price(pair) {
  const data = await json(`${API}/fapi/v1/ticker/price?symbol=${pair}`);
  return Number(data.price);
}

async function btcContext(openedAt = null) {
  const [ticker, candles15m, candles1h] = await Promise.all([
    json(`${API}/fapi/v1/ticker/24hr?symbol=BTCUSDT`),
    klines("BTCUSDT", "15m", 96),
    klines("BTCUSDT", "1h", 48),
  ]);
  const last15 = candles15m.at(-1);
  const last1h = candles1h.at(-1);
  const closes15m = candles15m.map((candle) => candle.close);
  const vwap15m = vwap(candles15m, 48);
  const atr15m = atr(candles15m);
  const hourAgo = candles15m.at(-5)?.close;
  const fourHoursAgo = candles15m.at(-17)?.close;
  const openedPrice = openedAt
    ? candles15m.find((candle) => candle.time >= new Date(openedAt).getTime())?.open
    : null;
  return {
    capturedAt: new Date().toISOString(),
    price: last15?.close ?? Number(ticker.lastPrice),
    dayChange: Number(ticker.priceChangePercent),
    change1h: hourAgo ? ((last15.close - hourAgo) / hourAgo) * 100 : NaN,
    change4h: fourHoursAgo ? ((last15.close - fourHoursAgo) / fourHoursAgo) * 100 : NaN,
    atrPct: atr15m && last15?.close ? (atr15m / last15.close) * 100 : NaN,
    aboveVwap: Number.isFinite(vwap15m) && last15?.close ? last15.close >= vwap15m : null,
    ma7Above25: sma(closes15m, 7) >= sma(closes15m, 25),
    hourClose: last1h?.close,
    openedPrice,
  };
}

async function bookTickers() {
  const rows = await json(`${API}/fapi/v1/ticker/bookTicker`);
  return rows.reduce((map, row) => {
    map[row.symbol] = row;
    return map;
  }, {});
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

function minutesAgo(stamp) {
  if (!stamp) return NaN;
  return Math.max(0, Math.round((Date.now() - stamp) / 60000));
}

function durationLabel(minutes) {
  if (!Number.isFinite(minutes)) return "-";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins ? `${hours}h ${mins}m` : `${hours}h`;
}

function pumpContext(candles, atrValue, rangeHigh, rangeLow) {
  const last = candles.at(-1);
  const recent = candles.slice(-96);
  const strongest = recent
    .map((candle) => {
      const bodyPct = candle.open ? ((candle.close - candle.open) / candle.open) * 100 : 0;
      const rangePct = candle.open ? ((candle.high - candle.low) / candle.open) * 100 : 0;
      return { candle, bodyPct, rangePct, score: Math.max(0, bodyPct) + rangePct * 0.25 };
    })
    .sort((a, b) => b.score - a.score)[0];
  const distanceFromHighPct = rangeHigh && last?.close ? ((rangeHigh - last.close) / rangeHigh) * 100 : NaN;
  return {
    distanceFromHighPct,
    distanceFromHighAtr: atrValue ? (rangeHigh - last.close) / atrValue : NaN,
    timeSincePumpMin: minutesAgo(strongest?.candle?.time),
    pumpCandleMovePct: strongest?.bodyPct ?? NaN,
    rangePosition: ((last.close - rangeLow) / (rangeHigh - rangeLow || 1)) * 100,
  };
}

function higherTimeframeContext(candles1h = []) {
  if (!candles1h.length) return null;
  const closes = candles1h.map((candle) => candle.close);
  const last = candles1h.at(-1);
  const recent = candles1h.slice(-24);
  const high24 = Math.max(...recent.map((candle) => candle.high));
  const low24 = Math.min(...recent.map((candle) => candle.low));
  const ma7 = sma(closes, 7);
  const ma25 = sma(closes, 25);
  const atr1h = atr(candles1h);
  const vwap1h = vwap(candles1h, 24);
  const upperWick = last.high - Math.max(last.open, last.close);
  const body = Math.abs(last.close - last.open) || (atr1h || last.close * 0.002);
  const closeStrength = ((last.close - last.low) / (last.high - last.low || 1)) * 100;
  const rejectionFromHigh = high24 && atr1h ? ((high24 - last.close) / atr1h) <= 1.2 && upperWick > body * 1.1 : false;
  return {
    trend: ma7 >= ma25 ? "up" : "down",
    closeStrength,
    rejectionFromHigh,
    extensionAtr: atr1h ? Math.abs(last.close - vwap1h) / atr1h : NaN,
    rangePosition: ((last.close - low24) / (high24 - low24 || 1)) * 100,
  };
}

function liquidityContext({ quoteVolume, tradeCount, spreadPct }) {
  let score = 100;
  if (Number.isFinite(spreadPct)) score -= clamp((spreadPct - 0.05) * 450, 0, 45);
  if (Number.isFinite(quoteVolume)) score += clamp(Math.log10(Math.max(quoteVolume, 1)) * 7 - 42, -18, 14);
  if (Number.isFinite(tradeCount)) score += clamp(Math.log10(Math.max(tradeCount, 1)) * 5 - 20, -12, 10);
  return {
    score: clamp(Math.round(score), 0, 100),
    bucket: score >= 78 ? "clean" : score >= 55 ? "ok" : "thin",
  };
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

function clusterLevels(levels, atrValue) {
  const sorted = [...new Set(levels.filter(Number.isFinite).map((level) => Number(level.toFixed(8))))].sort((a, b) => a - b);
  const clusters = [];
  sorted.forEach((level) => {
    const last = clusters.at(-1);
    if (last && Math.abs(level - last.anchor) <= atrValue * 0.28) {
      last.values.push(level);
      last.anchor = average(last.values);
    } else {
      clusters.push({ anchor: level, values: [level] });
    }
  });
  return clusters;
}

function bestZoneAnchor(levels, price, atrValue, side, preference = "near") {
  const clusters = clusterLevels(levels, atrValue);
  const scored = clusters
    .map((cluster) => {
      const distanceAtr = atrValue ? Math.abs(price - cluster.anchor) / atrValue : 0;
      const isCorrectSide = side === "long" ? cluster.anchor <= price : cluster.anchor >= price;
      const confluence = Math.min(cluster.values.length, 4);
      let score = confluence * 10;
      if (isCorrectSide) score += 18;
      if (distanceAtr >= 0.25 && distanceAtr <= 2.4) score += 18;
      if (distanceAtr > 0.05 && distanceAtr < 0.25) score += 6;
      if (distanceAtr > 2.4) score -= (distanceAtr - 2.4) * 9;
      if (preference === "deep" && distanceAtr >= 1.2) score += 10;
      if (preference === "breakout" && distanceAtr <= 1.2) score += 10;
      return { anchor: cluster.anchor, score, distanceAtr };
    })
    .sort((a, b) => b.score - a.score);
  return scored[0]?.anchor ?? (side === "long" ? price - atrValue : price + atrValue);
}

function zoneAround(anchor, atrValue, width = 0.28) {
  return {
    from: Math.max(0, anchor - atrValue * width),
    to: Math.max(0, anchor + atrValue * width),
  };
}

function zoneText(zone) {
  if (!zone) return "-";
  return `${fmtPrice(zone.from, [zone.to])}-${fmtPrice(zone.to, [zone.from])}`;
}

function chartUrl(pair, interval = "15") {
  return `https://www.tradingview.com/widgetembed/?symbol=${encodeURIComponent(`BINANCE:${pair}.P`)}&interval=${interval}&hidesidetoolbar=1&symboledit=0&saveimage=0&toolbarbg=0f1113&studies=[]&theme=dark&style=1&timezone=Europe%2FBratislava&withdateranges=1&hideideas=1`;
}

function syncChart(pair, target = "both") {
  if (!pair) return;
  const url = chartUrl(pair);
  if ((target === "both" || target === "main") && ui.chartFrame && ui.chartFrame.dataset.url !== url) {
    ui.chartFrame.dataset.url = url;
    ui.chartFrame.src = url;
  }
  if ((target === "both" || target === "main") && ui.chartMeta) ui.chartMeta.textContent = `${pair} | 15m`;
  if ((target === "both" || target === "paper") && ui.paperChartFrame && ui.paperChartFrame.dataset.url !== url) {
    ui.paperChartFrame.dataset.url = url;
    ui.paperChartFrame.src = url;
  }
  if ((target === "both" || target === "paper") && ui.paperChartMeta) ui.paperChartMeta.textContent = `${pair} | 15m`;
}

function classifyScenario(data) {
  const { last, rangeHigh, rangeLow, atrNow, vwapNow, volumeRatio, extensionAtr, ma7, ma25 } = data;
  const nearHighAtr = atrNow ? (rangeHigh - last.close) / atrNow : 0;
  const aboveTrend = last.close >= vwapNow && ma7 >= ma25;
  const upperWick = last.high - Math.max(last.open, last.close);
  const lowerWick = Math.min(last.open, last.close) - last.low;
  const body = Math.abs(last.close - last.open) || atrNow * 0.05;
  const rangePosition = ((last.close - rangeLow) / (rangeHigh - rangeLow || 1)) * 100;
  const clearReject = nearHighAtr <= 1.1 && upperWick > body * 1.15 && last.close < last.high - atrNow * 0.22;
  const clearBounce = rangePosition <= 32 && lowerWick >= body * 0.8 && last.close > last.low + atrNow * 0.18;
  const healthyPullback = aboveTrend && extensionAtr <= 1.25 && last.close >= ma25 && volumeRatio >= 0.8 && rangePosition >= 35 && rangePosition <= 82;

  if (clearReject && extensionAtr >= 1.15) return "Top rejection short";
  if (extensionAtr >= 2.2 && nearHighAtr <= 0.8) return "Too hot / top watch";
  if (last.close >= rangeHigh - atrNow * 0.35 && volumeRatio >= 1.15) return "Breakout retest";
  if (clearBounce) return "Range low bounce";
  if (healthyPullback) return "Pullback long";
  if (rangePosition >= 75 && clearReject) return "Top rejection short";
  return "Range after pump";
}

function scenarioPlan(data, scenario) {
  const { last, atrNow, vwapNow, ma7, ma25, rangeHigh, rangeLow, levels } = data;
  const priceNow = last.close;
  const side = scenario.includes("Short") || scenario.includes("top") ? "short" : "long";
  const supports = [...levels.lows, rangeLow, vwapNow, ma25, ma7].filter(Number.isFinite);
  const resistances = [...levels.highs, rangeHigh, ma7, ma25, vwapNow].filter(Number.isFinite);

  if (scenario === "Top rejection short" || scenario === "Too hot / top watch") {
    const entryAnchor = bestZoneAnchor([rangeHigh, ...levels.highs, ma7], priceNow, atrNow, "short");
    const entryZone = zoneAround(entryAnchor, atrNow, 0.26);
    const swingStop = nearestAbove([rangeHigh, ...levels.highs], entryZone.to, entryZone.to + atrNow * 0.9);
    const stop = Math.max(swingStop + atrNow * 0.18, entryZone.to + atrNow * 0.45);
    const tp1 = nearestBelow([vwapNow, ma25, ...supports], entryZone.from, entryZone.from - atrNow * 0.9);
    const tp2 = nearestBelow([ma25, rangeLow, ...supports], tp1, entryZone.from - atrNow * 1.8);
    const tp3 = Math.max(0, nearestBelow([rangeLow, ...supports], tp2, entryZone.from - atrNow * 2.8));
    return finalizePlan({
      side: "short",
      entryZone,
      stop,
      targets: [tp1, tp2, tp3],
      invalidation: "15m close späť nad rejection/high zónou.",
      note: scenario === "Too hot / top watch"
        ? "Cena je príliš natiahnutá. Bez návratu do zóny a odmietnutia vrchu je to watch only."
        : "Short až po odmietnutí vrchu alebo návrate pod zónu. Samotná vysoká cena nestačí.",
    });
  }

  const preference = scenario === "Range low bounce" || scenario === "Range after pump" ? "deep" : scenario === "Breakout retest" ? "breakout" : "near";
  const anchorPool = scenario === "Range low bounce"
    ? [rangeLow, ...levels.lows, ma25, vwapNow]
    : scenario === "Breakout retest"
      ? [rangeHigh, ...levels.highs, vwapNow, ma7]
      : scenario === "Range after pump"
        ? [rangeLow, ...levels.lows, vwapNow, ma25, ma7]
        : [vwapNow, ma25, ma7, ...levels.lows, rangeLow];
  const entryAnchor = bestZoneAnchor(anchorPool, priceNow, atrNow, "long", preference);
  const entryZone = zoneAround(entryAnchor, atrNow, scenario === "Breakout retest" ? 0.22 : 0.30);
  const structuralLow = nearestBelow([rangeLow, ...supports], entryZone.from, entryZone.from - atrNow);
  const stop = Math.max(0, Math.min(structuralLow - atrNow * 0.30, entryZone.from - atrNow * 0.55));
  const tp1 = nearestAbove([rangeHigh, ...resistances], entryZone.to, entryZone.to + atrNow * 1.0);
  const risk = Math.abs(entryZone.from - stop);
  const tp2 = Math.max(tp1 + atrNow * 0.65, entryZone.to + risk * 1.55);
  const tp3 = Math.max(tp2 + atrNow * 0.75, entryZone.to + risk * 2.25);
  return finalizePlan({
    side,
    entryZone,
    stop,
    targets: [tp1, tp2, tp3],
    invalidation: "Strata štrukturálneho low alebo návrat pod VWAP bez reakcie.",
    note: "Long až pri reakcii na pullback/retest zónu. Pumpovaný coin nebrať uprostred range.",
  });
}

function finalizePlan(plan) {
  const from = Math.min(plan.entryZone.from, plan.entryZone.to);
  const to = Math.max(plan.entryZone.from, plan.entryZone.to);
  const entry = plan.side === "long" ? from : to;
  const riskPct = absMovePct(entry, plan.stop);
  const targets = plan.targets
    .filter(Number.isFinite)
    .filter((target) => plan.side === "long" ? target > entry : target < entry)
    .slice(0, 3);
  while (targets.length < 3) {
    const risk = Math.abs(entry - plan.stop);
    const multiple = 1 + targets.length * 0.75;
    targets.push(plan.side === "long" ? entry + risk * multiple : Math.max(0, entry - risk * multiple));
  }
  return {
    ...plan,
    entry,
    entryZone: { from, to },
    targets,
    riskPct,
  };
}

function scenarioBaseScore(scenario) {
  if (scenario === "Top rejection short") return 72;
  if (scenario === "Range after pump") return 58;
  if (scenario === "Range low bounce") return 62;
  if (scenario === "Pullback long") return 46;
  if (scenario === "Breakout retest") return 42;
  if (scenario === "Too hot / top watch") return 28;
  return 34;
}

function qualityRating({ scenario, plan, volumeRatio, extensionAtr, distanceToZoneAtr, atrPct, rangePosition, reactionScore, setupMode, warnings }) {
  let score = scenarioBaseScore(scenario);
  score += clamp((1.0 - distanceToZoneAtr) * 9, -12, 12);
  score += clamp((volumeRatio - 0.85) * 10, -10, 14);
  score += clamp((MAX_STRUCTURAL_RISK_PCT - plan.riskPct) * 2.6, -20, 14);
  score += reactionScore;

  if (scenario === "Range after pump") {
    score += rangePosition <= 45 ? 8 : rangePosition >= 65 ? -14 : -5;
    score += extensionAtr <= 1.6 ? 4 : -8;
  } else if (scenario === "Pullback long") {
    score += rangePosition >= 35 && rangePosition <= 75 ? 8 : -12;
    score += extensionAtr <= 1.25 ? 6 : -10;
  } else if (scenario === "Top rejection short") {
    score += extensionAtr >= 1.15 ? 10 : -10;
    score += rangePosition >= 68 ? 8 : -6;
  } else if (scenario === "Too hot / top watch") {
    score += extensionAtr >= 2.2 ? 8 : -8;
  } else if (scenario === "Breakout retest") {
    score -= 8;
  }

  if (atrPct >= 0.8 && atrPct <= 8) score += 8;
  if (atrPct > 12) score -= 14;
  if (setupMode === "watch") score -= 6;
  score -= Math.min((warnings || []).length * 6, 18);
  return clamp(Math.round(score), 0, 100);
}

function analyzeGainer(ticker, candles, book = null, candles1h = [], gainerRank = null) {
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
  const totalTakerVolume = candles.slice(-8).reduce((sum, candle) => sum + candle.volume, 0);
  const takerBuyVolume = candles.slice(-8).reduce((sum, candle) => sum + candle.takerBuyVolume, 0);
  const takerBuyPct = totalTakerVolume ? (takerBuyVolume / totalTakerVolume) * 100 : NaN;
  const extensionAtr = atrNow ? Math.abs(last.close - vwapNow) / atrNow : 0;
  const bid = Number(book?.bidPrice);
  const ask = Number(book?.askPrice);
  const spreadPct = Number.isFinite(bid) && Number.isFinite(ask) && bid > 0 ? ((ask - bid) / bid) * 100 : NaN;
  const liquidity = liquidityContext({ quoteVolume: Number(ticker.quoteVolume), tradeCount: Number(ticker.count), spreadPct });
  const pump = pumpContext(candles, atrNow, rangeHigh, rangeLow);
  const higherTimeframe = { h1: higherTimeframeContext(candles1h) };
  const levels = swingLevels(candles);
  const scenario = classifyScenario({ last, rangeHigh, rangeLow, atrNow, vwapNow, volumeRatio, extensionAtr, ma7, ma25 });
  const plan = scenarioPlan({ last, atrNow, vwapNow, ma7, ma25, ma99, rangeHigh, rangeLow, levels }, scenario);
  const distanceToZone = plan.side === "long"
    ? Math.max(0, last.close - plan.entryZone.to)
    : Math.max(0, plan.entryZone.from - last.close);
  const distanceToZoneAtr = atrNow ? distanceToZone / atrNow : 0;
  const rangePosition = ((last.close - rangeLow) / (rangeHigh - rangeLow || 1)) * 100;
  const upperWick = last.high - Math.max(last.open, last.close);
  const lowerWick = Math.min(last.open, last.close) - last.low;
  const body = Math.abs(last.close - last.open) || atrNow * 0.05;
  const reactionScore = plan.side === "long"
    ? (lowerWick >= body * 0.8 ? 8 : 0) + (last.close > last.open ? 4 : -3)
    : (upperWick >= body * 1.0 ? 8 : 0) + (last.close < last.open ? 4 : -3);
  const warnings = [];
  if (plan.riskPct > MAX_STRUCTURAL_RISK_PCT) warnings.push(`SL je široký ${pct(-plan.riskPct)}.`);
  if (scenario === "Range after pump" && rangePosition > 62) warnings.push("Range after pump je vyššie v range, čakať hlbšiu zónu alebo reakciu.");
  if (scenario === "Pullback long" && volumeRatio < 0.8) warnings.push("Long pullback má slabší volume kontext.");
  if (scenario === "Pullback long" && rangePosition > 80) warnings.push("Pullback long je príliš vysoko v range.");
  if ((scenario === "Top rejection short" || scenario === "Too hot / top watch") && extensionAtr < 1.1) warnings.push("Short rejection nemá dostatočné natiahnutie.");
  const setupMode = scenario === "Too hot / top watch" || scenario === "Range after pump" ? "watch" : "trade";
  const tradable = setupMode === "trade" && warnings.length === 0;
  const state = `${setupMode === "watch" ? "paper watch" : "paper trade"} | ${distanceToZoneAtr <= 0.45 ? "ready zone" : "forming"}`;
  const atrPct = atrNow ? (atrNow / last.close) * 100 : NaN;
  const rating = qualityRating({ scenario, plan, volumeRatio, extensionAtr, distanceToZoneAtr, atrPct, rangePosition, reactionScore, setupMode, warnings });

  return {
    id: ticker.symbol,
    pair: ticker.symbol,
    gainerRank,
    price: last.close,
    dayChange: Number(ticker.priceChangePercent),
    quoteVolume: Number(ticker.quoteVolume),
    tradeCount: Number(ticker.count),
    bid,
    ask,
    spreadPct,
    candles,
    atr: atrNow,
    atrPct,
    vwap: vwapNow,
    ma7,
    ma25,
    ma99,
    rangeHigh,
    rangeLow,
    volumeRatio,
    takerBuyPct,
    extensionAtr,
    scenario,
    state,
    plan,
    rangePosition,
    distanceToZoneAtr,
    metadata: {
      gainerRank,
      pump,
      higherTimeframe,
      liquidity,
      decision: {
        setupMode,
        rangePosition,
        distanceToZoneAtr,
        reactionScore,
        entryRule: "touch-and-confirm",
        reason: `${scenario} | ${setupMode} | ${distanceToZoneAtr <= 0.45 ? "ready zone" : "forming"}`,
      },
      capturedAt: new Date().toISOString(),
    },
    warnings,
    tradable,
    setupMode,
    rating,
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
  if (item.setupMode === "watch") return `${p.note} Paper sa pustí kvôli dátam, ale setup je označený ako watch.`;
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
    <span>Rank <b>#${selected.gainerRank || "-"}</b></span>
    <span>Live <b>${fmt(selected.price)}</b></span>
    <span>24h <b class="positive">${pct(selected.dayChange)}</b></span>
    <span>Spread <b class="${selected.spreadPct <= 0.08 ? "positive" : "warning"}">${pct(selected.spreadPct)}</b></span>
    <span>Vol <b>${usd(selected.quoteVolume)}</b></span>
    <span>Risk <b class="${selected.plan.riskPct > MAX_STRUCTURAL_RISK_PCT ? "negative" : "positive"}">${pct(-selected.plan.riskPct)}</b></span>
    <span>Rating <b>${selected.rating}/100</b></span>
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
      <div class="setup-sections">
        <section>
          <h4>Price setup</h4>
          <div class="setup-levels">
            <span>Entry zóna <b>${zoneText(p.entryZone)}</b></span>
            <span>Trigger entry <b>${fmt(p.entry)}</b></span>
            <span>Open filter <b>${entryTriggerText({ ...selected, entryZone: p.entryZone, side: p.side, market: { atr: selected.atr } })}</b></span>
            <span>Štrukturálny SL <b class="negative">${fmt(p.stop)} ${pct(movePct(p.entry, p.stop, p.side))}</b></span>
            ${targetHtml}
          </div>
        </section>
        <section>
          <h4>Market quality</h4>
          <div class="setup-levels compact">
            <span>24h gain <b class="positive">${pct(selected.dayChange)}</b></span>
            <span>Quote volume <b>${usd(selected.quoteVolume)}</b></span>
            <span>Spread <b class="${selected.spreadPct <= 0.08 ? "positive" : "warning"}">${pct(selected.spreadPct)}</b></span>
            <span>Trades <b>${compactNumber(selected.tradeCount, 1)}</b></span>
          </div>
        </section>
        <section>
          <h4>Futures context</h4>
          <div class="setup-levels compact">
            <span>VWAP ext <b>${fmt(selected.extensionAtr, 2)} ATR</b></span>
            <span>ATR <b>${pct(selected.atrPct)}</b></span>
            <span>Taker buy <b>${pct(selected.takerBuyPct, 0)}</b></span>
            <span>Range pozícia <b>${fmt(selected.rangePosition, 0)}%</b></span>
            <span>Zone dist <b>${fmt(selected.distanceToZoneAtr, 2)} ATR</b></span>
            <span>Range <b>${fmt(selected.rangeLow)} / ${fmt(selected.rangeHigh)}</b></span>
          </div>
        </section>
      </div>
      <p class="muted">Invalidácia: ${p.invalidation}</p>
      ${selected.warnings.length ? `<p class="warning">Filter note: ${selected.warnings.join(" ")}</p>` : ""}
    </article>
  `;
  ui.startPaperButton.disabled = false;
  ui.startPaperButton.textContent = selected.setupMode === "watch" ? "Spustiť paper watch" : "Spustiť paper trade";
  syncChart(selected.pair, "main");
  renderGainers();
}

function renderGainers() {
  ui.gainersMeta.textContent = `${gainers.length} live gainers | score order`;
  if (!gainers.length) {
    ui.gainerList.innerHTML = `<p class="muted">Žiadne dáta. Spusti Scan Live.</p>`;
    renderPumpRank();
    return;
  }
  ui.gainerList.innerHTML = gainers.map((item) => `
    <article class="gainer-card ${scenarioSide(item.scenario, item.plan)} ${selected?.pair === item.pair ? "active" : ""}" data-pair="${item.pair}">
      <div class="gainer-head">
        <strong>#${item.gainerRank || "-"} ${item.pair}</strong>
        <div class="badge-row">
          <span class="rating-chip">${item.rating}</span>
          <span class="side-chip ${scenarioSide(item.scenario, item.plan)}">${scenarioSide(item.scenario, item.plan).toUpperCase()}</span>
          <span class="badge ${scenarioTone(item.scenario)}">${item.scenario}</span>
        </div>
      </div>
      <p>${scenarioText(item)}</p>
      <div class="metric-list">
        <span>Live <b>${fmt(item.price)}</b></span>
        <span>24h <b class="positive">${pct(item.dayChange)}</b></span>
        <span>Spread <b class="${item.spreadPct <= 0.08 ? "positive" : "warning"}">${pct(item.spreadPct)}</b></span>
        <span>Vol <b>${usd(item.quoteVolume)}</b></span>
        <span>Entry <b>${zoneText(item.plan.entryZone)}</b></span>
        <span>Risk <b class="${item.plan.riskPct > MAX_STRUCTURAL_RISK_PCT ? "negative" : ""}">${pct(-item.plan.riskPct)}</b></span>
        <span>TP1 <b class="positive">${pct(movePct(item.plan.entry, item.plan.targets[0], item.plan.side))}</b></span>
      </div>
    </article>
  `).join("");
  ui.gainerList.querySelectorAll(".gainer-card").forEach((card) => {
    card.addEventListener("click", () => selectGainer(card.dataset.pair));
  });
  renderPumpRank();
}

function renderPumpRank() {
  if (!ui.pumpRankList) return;
  const byPump = gainers.slice().sort((a, b) => (a.gainerRank || 999) - (b.gainerRank || 999));
  ui.pumpRankMeta.textContent = byPump.length ? `${byPump.length} live | 24h gain order` : "čakám na scan";
  if (!byPump.length) {
    ui.pumpRankList.innerHTML = `<p class="muted">Po live scane sa tu zobrazí TOP 15 podľa 24h gainu.</p>`;
    return;
  }
  ui.pumpRankList.innerHTML = byPump.map((item) => {
    const h1 = item.metadata?.higherTimeframe?.h1;
    const pump = item.metadata?.pump || {};
    const liquidity = item.metadata?.liquidity || {};
    return `
      <article class="pump-rank-row">
        <div>
          <strong>#${item.gainerRank || "-"} ${item.pair}</strong>
          <span>${item.scenario} | ${scenarioSide(item.scenario, item.plan)}</span>
        </div>
        <span>24h <b class="positive">${pct(item.dayChange)}</b></span>
        <span>Rating <b>${item.rating}/100</b></span>
        <span>Live <b>${fmt(item.price)}</b></span>
        <span>Vol <b>${usd(item.quoteVolume)}</b></span>
        <span>Spread <b class="${item.spreadPct <= 0.08 ? "positive" : "warning"}">${pct(item.spreadPct)}</b></span>
        <span>High dist <b>${pct(pump.distanceFromHighPct)}</b></span>
        <span>Pump age <b>${durationLabel(pump.timeSincePumpMin)}</b></span>
        <span>1h <b class="${h1?.trend === "up" ? "positive" : "negative"}">${h1?.trend || "-"}</b></span>
        <span>Liq <b>${liquidity.bucket || "-"}</b></span>
      </article>
    `;
  }).join("");
}

async function scanLive() {
  if (ui.scanButton.disabled) return;
  ui.scanButton.disabled = true;
  ui.scanStatus.textContent = "Načítavam top futures gainers a 15m sviečky...";
  ui.refreshStatus.textContent = "running";
  try {
    const all = await json(`${API}/fapi/v1/ticker/24hr`);
    const top = all
      .filter((item) => item.symbol.endsWith("USDT") && Number(item.priceChangePercent) > 0)
      .sort((a, b) => Number(b.priceChangePercent) - Number(a.priceChangePercent))
      .slice(0, 15)
      .map((ticker, index) => ({ ...ticker, gainerRank: index + 1 }));
    const books = await bookTickers().catch(() => ({}));
    const analyses = await Promise.allSettled(top.map(async (ticker) => analyzeGainer(
      ticker,
      await klines(ticker.symbol, "15m"),
      books[ticker.symbol],
      await klines(ticker.symbol, "1h", 48),
      ticker.gainerRank,
    )));
    gainers = analyses
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value)
      .sort((a, b) => b.rating - a.rating || b.dayChange - a.dayChange);
    const preferred = localStorage.getItem(STORE.selected);
    selected = gainers.find((item) => item.pair === preferred) || gainers[0] || null;
    renderGainers();
    if (selected) selectGainer(selected.pair);
    recordDaySnapshot("live-scan");
    ui.scanStatus.textContent = `Live scan hotový: ${gainers.length} top gainers, dashboard podľa ratingu, pump rank podľa 24h gainu.`;
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

function migrateServicePcJournalImports() {
  if (localStorage.getItem(STORE.journalImportPatch)) return;
  const rows = journal();
  const existingImportKeys = new Set(rows.map((row) => row.importKey).filter(Boolean));
  const existingTradeIds = new Set(rows.map((row) => row.tradeId).filter(Boolean));
  const existingFingerprints = new Set(rows.map((row) => [
    row.pair,
    row.side,
    row.scenario,
    row.openedAt,
    row.closedAt,
    Number(row.entry).toFixed(10),
    Number(row.exit).toFixed(10),
    Number(row.resultPct).toFixed(2),
  ].join("|").toLowerCase()));
  const imported = SERVICE_PC_JOURNAL_IMPORTS
    .filter((row) => {
      const fingerprint = [
        row.pair,
        row.side,
        row.scenario,
        row.openedAt,
        row.closedAt,
        Number(row.entry).toFixed(10),
        Number(row.exit).toFixed(10),
        Number(row.resultPct).toFixed(2),
      ].join("|").toLowerCase();
      return !existingImportKeys.has(row.importKey) && !existingTradeIds.has(row.tradeId) && !existingFingerprints.has(fingerprint);
    })
    .map((row) => ({
      ...row,
      id: `journal-${row.importKey}`,
      session: sessionLabel(row.closedAt),
      openSession: sessionLabel(row.openedAt),
      closeSession: sessionLabel(row.closedAt),
      openedClock: clockTime(row.openedAt),
      tp1Clock: clockTime(row.tp1At),
      closedClock: clockTime(row.closedAt),
      realTrade: false,
      updatedAt: row.closedAt,
    }));
  if (imported.length) saveJournal([...imported, ...rows]);
  localStorage.setItem(STORE.journalImportPatch, "1");
}

  async function startPaper() {
    if (!selected) return;
    const p = selected.plan;
    const state = paperState();
    const createdAt = new Date().toISOString();
    const defaultButtonText = ui.startPaperButton.textContent;
    ui.startPaperButton.disabled = true;
    ui.startPaperButton.textContent = "Ukladám BTC kontext...";
    try {
      const btc = await btcContext().catch(() => null);
      state.waiting.unshift({
        id: uid("paper"),
        pair: selected.pair,
        side: p.side,
        scenario: selected.scenario,
        rating: selected.rating,
        entry: p.entry,
        entryZone: p.entryZone,
        stop: p.stop,
        targets: p.targets.map((price, index) => ({ label: `TP${index + 1}`, price, hit: false })),
        riskPct: p.riskPct,
        tp1R: rewardRiskRatio(p.entry, p.targets[0], p.stop, p.side),
        tradable: selected.tradable,
        setupMode: selected.setupMode || "trade",
        warnings: selected.warnings,
        market: {
          dayChange: selected.dayChange,
          quoteVolume: selected.quoteVolume,
          tradeCount: selected.tradeCount,
          spreadPct: selected.spreadPct,
          volumeRatio: selected.volumeRatio,
          takerBuyPct: selected.takerBuyPct,
          gainerRank: selected.gainerRank,
          atr: selected.atr,
          atrPct: selected.atrPct,
          distanceToZoneAtr: selected.distanceToZoneAtr,
          metadata: selected.metadata,
          btc,
        },
        createdAt,
        createdSession: sessionLabel(createdAt),
        status: "waiting",
        entryRule: "touch-and-confirm",
        lastCheckedAt: createdAt,
      });
      savePaper(state);
      renderPaper();
      setView("paper");
    } finally {
      ui.startPaperButton.disabled = false;
      ui.startPaperButton.textContent = defaultButtonText;
    }
  }

function hitEntry(trade, current) {
  const from = Math.min(trade.entryZone.from, trade.entryZone.to);
  const to = Math.max(trade.entryZone.from, trade.entryZone.to);
  return current >= from && current <= to;
}

function entryConfirmDistance(trade) {
  const zoneWidth = Math.abs((trade.entryZone?.to || 0) - (trade.entryZone?.from || 0));
  const atrValue = Number(trade.market?.atr);
  if (Number.isFinite(atrValue) && atrValue > 0) return atrValue * ENTRY_CONFIRM_ATR;
  if (Number.isFinite(zoneWidth) && zoneWidth > 0) return zoneWidth * 0.35;
  return Math.abs(Number(trade.entry) || 0) * 0.0015;
}

function entryStatusText(trade) {
  if (trade.entryTouchedAt) return "zóna dotknutá, čaká sa confirm";
  return "čaká na dotyk zóny";
}

function entryTriggerText(trade) {
  const from = Math.min(trade.entryZone.from, trade.entryZone.to);
  const to = Math.max(trade.entryZone.from, trade.entryZone.to);
  const confirm = entryConfirmDistance(trade);
  if (trade.side === "long") return `Touch zóny, potom confirm nad ${fmt(to + confirm)}`;
  return `Touch zóny, potom confirm pod ${fmt(from - confirm)}`;
}

function entryTriggerValue(trade) {
  const from = Math.min(trade.entryZone.from, trade.entryZone.to);
  const to = Math.max(trade.entryZone.from, trade.entryZone.to);
  const confirm = entryConfirmDistance(trade);
  return fmt(trade.side === "long" ? to + confirm : from - confirm);
}

function entryDecision(trade, current) {
  if (!trade.entryZone || !Number.isFinite(current)) return "wait";
  const from = Math.min(trade.entryZone.from, trade.entryZone.to);
  const to = Math.max(trade.entryZone.from, trade.entryZone.to);
  const confirm = entryConfirmDistance(trade);

  if (!trade.entryTouchedAt && current >= from && current <= to) {
    trade.entryTouchedAt = new Date().toISOString();
    trade.entryTouchedPrice = current;
    return "wait";
  }

  if (!trade.entryTouchedAt) return "wait";
  if (trade.side === "long") return current >= to + confirm ? "open" : "wait";
  return current <= from - confirm ? "open" : "wait";
}

function updateTradeTargets(trade, current, stamp = new Date().toISOString()) {
  if (!Number.isFinite(trade.riskPct)) trade.riskPct = absMovePct(trade.entry, trade.stop);
  if (!Number.isFinite(trade.tp1R)) {
    trade.tp1R = rewardRiskRatio(trade.entry, trade.targets.find((target) => target.label === "TP1")?.price, trade.stop, trade.side);
  }
  let changed = false;
  trade.targets.forEach((target) => {
    if (target.hit) return;
    if (trade.side === "long" ? current >= target.price : current <= target.price) {
      target.hit = true;
      target.hitAt = stamp;
      if (target.label === "TP1") {
        trade.tp1At = trade.tp1At || stamp;
        if (!trade.timeToTp1) trade.timeToTp1 = timeAgo(trade.openedAt, target.hitAt);
      }
      changed = true;
    }
  });
  return changed;
}

function updateTradeTracking(trade, current, stamp = new Date().toISOString()) {
  const livePct = movePct(trade.entry, current, trade.side);
  if (!Number.isFinite(livePct)) return;
  trade.mfe = Math.max(Number(trade.mfe) || 0, livePct);
  trade.mae = Math.min(Number(trade.mae) || 0, livePct);
  trade.timeInTrade = timeAgo(trade.openedAt, stamp);
}

function updateTradeBtcContext(trade, btcPrice) {
  const openedPrice = trade.market?.btc?.openedPrice || trade.market?.btc?.price;
  if (!Number.isFinite(btcPrice) || !Number.isFinite(openedPrice) || openedPrice <= 0) return;
  trade.market = trade.market || {};
  trade.market.btcClosePrice = btcPrice;
  trade.market.btcMovePct = ((btcPrice - openedPrice) / openedPrice) * 100;
  trade.market.btcUpdatedAt = new Date().toISOString();
}

function tradeFavorablePrice(trade, candle) {
  return trade.side === "long" ? candle.high : candle.low;
}

function tradeAdversePrice(trade, candle) {
  return trade.side === "long" ? candle.low : candle.high;
}

function tradeStopHit(trade, price) {
  return trade.side === "long" ? price <= trade.stop : price >= trade.stop;
}

function candleStamp(candle) {
  return new Date(candle.closeTime || candle.time || Date.now()).toISOString();
}

function processTradeCandle(trade, candle) {
  const stamp = candleStamp(candle);
  const favorable = tradeFavorablePrice(trade, candle);
  const adverse = tradeAdversePrice(trade, candle);
  updateTradeTracking(trade, favorable, stamp);
  updateTradeTracking(trade, adverse, stamp);

  const stopBeforeTarget = tradeStopHit(trade, adverse) && !trade.targets.some((target) => target.hit);
  const wouldHitTarget = trade.targets.some((target) => !target.hit && (trade.side === "long" ? favorable >= target.price : favorable <= target.price));
  if (stopBeforeTarget && !wouldHitTarget) {
    upsertJournalEntry(journalEntryFromTrade(trade, trade.stop, "SL", "closed", stamp));
    return "closed";
  }

  const targetChanged = updateTradeTargets(trade, favorable, stamp);
  const hitTargets = trade.targets.filter((target) => target.hit);
  if (targetChanged && hitTargets.length) {
    trade.stop = trade.entry;
    trade.breakEven = true;
    upsertJournalEntry(journalEntryFromTrade(trade, hitTargets.at(-1).price, "TP running / SL na entry", "running", stamp));
  }

  const hitStop = tradeStopHit(trade, adverse);
  const finalTarget = trade.targets.at(-1);
  const hitFinal = finalTarget?.hit;
  if (hitStop || hitFinal) {
    upsertJournalEntry(journalEntryFromTrade(trade, hitFinal ? finalTarget.price : trade.stop, hitFinal ? "Final TP" : "SL", "closed", stamp));
    return "closed";
  }

  trade.lastCheckedAt = stamp;
  return "active";
}

function journalEntryFromTrade(trade, exit, reason, status = "closed", stamp = new Date().toISOString()) {
  const hitTargets = trade.targets.filter((target) => target.hit);
  const lastTarget = hitTargets.at(-1);
  const resultPct = lastTarget ? movePct(trade.entry, lastTarget.price, trade.side) : movePct(trade.entry, exit, trade.side);
  const now = stamp || new Date().toISOString();
  const openSession = trade.openedSession || trade.createdSession || sessionLabel(trade.openedAt || trade.createdAt || now);
  const closeSession = sessionLabel(now);
  return {
    id: trade.journalId || uid("journal"),
    tradeId: trade.id,
    pair: trade.pair,
    side: trade.side,
    scenario: trade.scenario,
    rating: trade.rating,
    session: status === "closed" ? closeSession : openSession,
    openSession,
    closeSession: status === "closed" ? closeSession : null,
    entry: trade.entry,
    exit,
    reason,
    status,
    tpHit: hitTargets.map((target) => target.label).join(", ") || "nie",
    resultPct,
    mfe: trade.mfe ?? 0,
    mae: trade.mae ?? 0,
    riskPct: trade.riskPct ?? absMovePct(trade.entry, trade.stop),
    tp1R: trade.tp1R ?? rewardRiskRatio(trade.entry, trade.targets.find((target) => target.label === "TP1")?.price, trade.stop, trade.side),
    timeInTrade: trade.timeInTrade || timeAgo(trade.openedAt, now),
    timeToTp1: trade.timeToTp1 || (trade.targets.find((target) => target.label === "TP1" && target.hitAt) ? timeAgo(trade.openedAt, trade.targets.find((target) => target.label === "TP1").hitAt) : "-"),
    setupMode: trade.setupMode || "trade",
    entryRule: trade.entryRule || null,
    entryTouchedAt: trade.entryTouchedAt || null,
    entryTouchedPrice: trade.entryTouchedPrice || null,
    openedAt: trade.openedAt,
    openedClock: clockTime(trade.openedAt),
    tp1At: trade.tp1At || trade.targets.find((target) => target.label === "TP1")?.hitAt || null,
    tp1Clock: clockTime(trade.tp1At || trade.targets.find((target) => target.label === "TP1")?.hitAt),
    closedClock: status === "closed" ? clockTime(now) : null,
    market: trade.market || {},
    outcome: status === "running" ? "Running" : hitTargets.length ? "Win" : reason === "Final TP" ? "Win" : "Loss",
    closedAt: status === "closed" ? now : null,
    updatedAt: now,
  };
}

function upsertJournalEntry(entry) {
  const rows = journal();
  const index = rows.findIndex((row) => row.tradeId === entry.tradeId);
  if (index >= 0) rows[index] = { ...rows[index], ...entry, id: rows[index].id, realTrade: rows[index].realTrade || false };
  else rows.unshift(entry);
  saveJournal(rows);
}

function toggleRealJournalTrade(id) {
  const rows = journal();
  const nextRows = rows.map((row) => row.id === id ? { ...row, realTrade: !row.realTrade } : row);
  saveJournal(nextRows);
  renderJournal();
}

function journalDisplaySession(row) {
  const open = row.openSession || row.session || "-";
  if (row.status !== "running" && row.closedAt) {
    const close = row.closeSession || sessionLabel(row.closedAt);
    return open !== close ? `${open} -> ${close}` : close;
  }
  return open;
}

function dayKey(stamp = new Date().toISOString()) {
  return new Date(stamp).toLocaleDateString("sk-SK", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function isoDay(stamp = new Date().toISOString()) {
  return new Date(stamp).toISOString().slice(0, 10);
}

function manualAnalysisText() {
  const stored = localStorage.getItem(STORE.analysisManual);
  return stored === null ? ANALYSIS_SEED_DATA : storeGet(STORE.analysisManual, "");
}

function saveManualAnalysis(text) {
  storeSet(STORE.analysisManual, text || "");
}

function mergeAnalysisRows(baseText, patchText) {
  const lines = String(baseText || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const existing = new Set(lines.map((line) => line.split(",").slice(0, 9).join("|").toLowerCase()));
  const missing = String(patchText || "").split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !existing.has(line.split(",").slice(0, 9).join("|").toLowerCase()));
  return [...missing, ...lines].join("\n");
}

function migrateAnalysisManualRows() {
  if (localStorage.getItem(STORE.analysisManualPatch)) return;
  const stored = localStorage.getItem(STORE.analysisManual);
  if (stored !== null) saveManualAnalysis(mergeAnalysisRows(storeGet(STORE.analysisManual, ""), SERVICE_PC_ANALYSIS_ROWS));
  localStorage.setItem(STORE.analysisManualPatch, "1");
}

function isRunningAnalysis(row) {
  return String(row.status || "").toLowerCase().includes("running");
}

function hasTp1(row) {
  return String(row.tpHit || "").toLowerCase().includes("tp1");
}

function analysisNumber(value) {
  const parsed = Number(String(value ?? "").replace("%", "").replace(",", ".").trim());
  return Number.isFinite(parsed) ? parsed : NaN;
}

function parseManualAnalysisRows(text) {
  const scenarios = new Set([
    "Pullback long",
    "Top rejection short",
    "Too hot / top watch",
    "Range after pump",
    "Range low bounce",
    "Breakout retest",
  ]);
  return String(text || "").split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(",").map((part) => part.trim());
      const hasSession = !scenarios.has(parts[3]);
      const offset = hasSession ? 1 : 0;
      return {
        source: "manual",
        date: parts[0],
        pair: parts[1],
        side: (parts[2] || "").toLowerCase(),
        session: hasSession ? parts[3] : "-",
        scenario: parts[3 + offset],
        entry: analysisNumber(parts[4 + offset]),
        exit: analysisNumber(parts[5 + offset]),
        tpHit: parts[6 + offset] || "nie",
        resultPct: analysisNumber(parts[7 + offset]),
        status: parts[8 + offset] || "-",
        rating: analysisNumber(parts[9 + offset]),
        mfe: analysisNumber(parts[10 + offset]),
        mae: analysisNumber(parts[11 + offset]),
        timeInTrade: parts[12 + offset] || "-",
        timeToTp1: parts[13 + offset] || "-",
        account: parts[14 + offset] || "Paper",
        setupMode: "manual",
      };
    })
    .filter((row) => row.date && row.pair && Number.isFinite(row.resultPct) && !isRunningAnalysis(row));
}

function journalToAnalysisRows() {
  return journal().filter((row) => row.status !== "running").map((row) => ({
    source: "auto",
    date: isoDay(row.closedAt || row.updatedAt || row.openedAt || row.createdAt),
    pair: row.pair,
    side: row.side,
    session: journalDisplaySession(row),
    scenario: row.scenario,
    entry: row.entry,
    exit: row.exit,
    tpHit: row.tpHit,
    resultPct: row.resultPct,
    status: `${row.outcome} ${row.reason}`,
    rating: row.rating,
    mfe: row.mfe,
    mae: row.mae,
    riskPct: row.riskPct,
    tp1R: row.tp1R,
    timeInTrade: row.timeInTrade || "-",
    timeToTp1: row.timeToTp1 || "-",
    openedAt: row.openedAt,
    tp1At: row.tp1At,
    closedAt: row.closedAt,
    setupMode: row.setupMode || "trade",
    account: row.realTrade ? "Real" : "Paper",
    gainerRank: row.market?.gainerRank,
    metadata: row.market?.metadata || null,
    btc: row.market?.btc || null,
    btcMovePct: row.market?.btcMovePct,
  }));
}

function analysisRows() {
  const rows = [...journalToAnalysisRows(), ...parseManualAnalysisRows(manualAnalysisText())];
  const seen = new Set();
  return rows
    .sort((a, b) => (a.source === "auto" ? -1 : 1) - (b.source === "auto" ? -1 : 1))
    .filter((row) => {
    const key = [
      row.pair,
      row.side,
      row.scenario,
      Number(row.entry).toFixed(10),
      Number(row.exit).toFixed(10),
      Number(row.resultPct).toFixed(2),
    ].join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function analysisStats(rows) {
  const wins = rows.filter((row) => row.resultPct > 0).length;
  const losses = rows.length - wins;
  const total = rows.reduce((sum, row) => sum + (Number(row.resultPct) || 0), 0);
  const mfeRows = rows.filter((row) => Number.isFinite(row.mfe));
  const maeRows = rows.filter((row) => Number.isFinite(row.mae));
  return {
    count: rows.length,
    running: 0,
    wins,
    losses,
    winrate: rows.length ? (wins / rows.length) * 100 : 0,
    avg: rows.length ? total / rows.length : 0,
    total,
    tp1Rate: rows.length ? (rows.filter(hasTp1).length / rows.length) * 100 : 0,
    avgMfe: mfeRows.length ? average(mfeRows.map((row) => row.mfe)) : NaN,
    avgMae: maeRows.length ? average(maeRows.map((row) => row.mae)) : NaN,
  };
}

function groupRows(rows, key) {
  return rows.reduce((acc, row) => {
    const name = typeof key === "function" ? key(row) : row[key];
    acc[name] = acc[name] || [];
    acc[name].push(row);
    return acc;
  }, {});
}

function ratingBucket(row) {
  if (!Number.isFinite(row.rating)) return "bez ratingu";
  if (row.rating >= 80) return "80-100";
  if (row.rating >= 60) return "60-79";
  if (row.rating >= 40) return "40-59";
  return "<40";
}

function setupSideKey(row) {
  return `${row.scenario} | ${row.side}`;
}

function monthKey(row) {
  return String(row.date || "").slice(0, 7) || "-";
}

function isoWeekInfo(dateText) {
  const date = new Date(`${dateText}T12:00:00`);
  if (Number.isNaN(date.getTime())) return { key: "-", label: "-" };
  const day = date.getDay() || 7;
  const thursday = new Date(date);
  thursday.setDate(date.getDate() + 4 - day);
  const yearStart = new Date(thursday.getFullYear(), 0, 1);
  const week = Math.ceil((((thursday - yearStart) / 86400000) + 1) / 7);
  const monday = new Date(date);
  monday.setDate(date.getDate() - day + 1);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const key = `${thursday.getFullYear()}-W${String(week).padStart(2, "0")}`;
  const label = `${key} | ${monday.toLocaleDateString("sk-SK", { day: "2-digit", month: "2-digit" })} - ${sunday.toLocaleDateString("sk-SK", { day: "2-digit", month: "2-digit" })}`;
  return { key, label };
}

function weekKey(row) {
  return isoWeekInfo(row.date).key;
}

function periodBestWorst(rows, key) {
  const entries = Object.entries(groupRows(rows, key)).map(([name, list]) => [name, analysisStats(list)]);
  return {
    best: entries.slice().sort((a, b) => b[1].avg - a[1].avg)[0],
    worst: entries.slice().sort((a, b) => a[1].avg - b[1].avg)[0],
  };
}

function periodSummaryCards(rows) {
  const all = analysisStats(rows);
  const tradeOnly = analysisStats(rows.filter((row) => row.setupMode === "trade"));
  const watchOnly = analysisStats(rows.filter((row) => row.setupMode === "watch"));
  const realOnly = analysisStats(rows.filter((row) => row.account === "Real"));
  return [
    ["All", all],
    ["Trade", tradeOnly],
    ["Watch", watchOnly],
    ["Real", realOnly],
  ].map(([label, stat]) => `
    <article>
      <span>${label}</span>
      <strong class="${stat.total >= 0 ? "positive" : "negative"}">${pct(stat.total)}</strong>
      <small>${stat.count} closed | WR ${fmt(stat.winrate, 0)}% | avg ${pct(stat.avg)}</small>
    </article>
  `).join("");
}

function periodDetailHtml(rows) {
  const sorted = rows.slice().sort((a, b) => b.resultPct - a.resultPct);
  const daily = Object.entries(groupRows(rows, "date"))
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([day, list]) => {
      const stat = analysisStats(list);
      return `<span>${day} <b class="${stat.total >= 0 ? "positive" : "negative"}">${pct(stat.total)}</b> WR ${fmt(stat.winrate, 0)}%</span>`;
    }).join("");
  return `
    <div class="period-detail">
      <section>
        <h4>Setupy</h4>
        <div class="analysis-bars compact">${analysisBarHtml(groupRows(rows, "scenario"))}</div>
      </section>
      <section>
        <h4>Side</h4>
        <div class="analysis-bars compact">${analysisBarHtml(groupRows(rows, "side"))}</div>
      </section>
      <section>
        <h4>Režim</h4>
        <div class="analysis-bars compact">${analysisBarHtml(groupRows(rows, (row) => row.setupMode || "manual"))}</div>
      </section>
      <section>
        <h4>Dni</h4>
        <div class="period-days">${daily || "<span>-</span>"}</div>
      </section>
      <section>
        <h4>Top / bottom</h4>
        <ul>
          ${sorted.slice(0, 3).map(analysisListItem).join("")}
          ${sorted.slice(-3).reverse().map(analysisListItem).join("")}
        </ul>
      </section>
    </div>
  `;
}

function periodSummaryHtml(rows, keyFn, labelFn = (key) => key, storagePrefix = "period", stateOverride = new Map()) {
  const grouped = Object.entries(groupRows(rows, keyFn)).sort((a, b) => b[0].localeCompare(a[0]));
  return grouped.map(([key, periodRows]) => {
    const stat = analysisStats(periodRows);
    const { best, worst } = periodBestWorst(periodRows, "scenario");
    const storageKey = `${storagePrefix}-${key}`;
    const open = stateOverride.has(storageKey) ? stateOverride.get(storageKey) : localStorage.getItem(storageKey) === "1";
    return `
      <details class="analysis-period" data-period-key="${storageKey}" ${open ? "open" : ""}>
        <summary>
          <div>
            <strong>${labelFn(key)}</strong>
            <span>${stat.count} closed | WR ${fmt(stat.winrate, 0)}% | avg ${pct(stat.avg)} | total ${pct(stat.total)}</span>
          </div>
          <span class="${stat.total >= 0 ? "positive" : "negative"}">${pct(stat.total)}</span>
        </summary>
        <div class="period-cards">${periodSummaryCards(periodRows)}</div>
        <p class="period-note">Best: <strong>${best?.[0] || "-"}</strong> ${best ? pct(best[1].avg) : ""} | Worst: <strong>${worst?.[0] || "-"}</strong> ${worst ? pct(worst[1].avg) : ""}</p>
        ${periodDetailHtml(periodRows)}
      </details>
    `;
  }).join("") || `<p class="muted">Zatiaľ žiadne dáta.</p>`;
}

function readPeriodStates(root) {
  const states = new Map();
  root?.querySelectorAll(".analysis-period").forEach((item) => {
    if (item.dataset.periodKey) states.set(item.dataset.periodKey, item.open);
  });
  return states;
}

function bindPeriodToggles(root) {
  root?.querySelectorAll(".analysis-period").forEach((item) => {
    item.querySelector("summary")?.addEventListener("click", () => {
      if (!item.dataset.periodKey) return;
      localStorage.setItem(item.dataset.periodKey, item.open ? "0" : "1");
    });
    item.addEventListener("toggle", () => {
      if (!item.dataset.periodKey) return;
      localStorage.setItem(item.dataset.periodKey, item.open ? "1" : "0");
    });
  });
}

function analysisBarHtml(grouped) {
  const entries = Object.entries(grouped)
    .map(([name, rows]) => [name, analysisStats(rows)])
    .sort((a, b) => b[1].avg - a[1].avg);
  const max = Math.max(1, ...entries.map(([, item]) => Math.abs(item.avg)));
  return entries.map(([name, item]) => {
    const width = Math.max(5, (Math.abs(item.avg) / max) * 100);
    return `
      <div class="analysis-bar">
        <strong>${name}</strong>
        <div><i style="width:${width}%; background:${item.avg >= 0 ? "var(--green)" : "var(--red)"}"></i></div>
        <span class="${item.avg >= 0 ? "positive" : "negative"}">${pct(item.avg)}</span>
        <small>${item.count} closed | WR ${fmt(item.winrate, 0)}% | TP1 ${fmt(item.tp1Rate, 0)}%</small>
      </div>
    `;
  }).join("") || `<p class="muted">Zatiaľ žiadne dáta.</p>`;
}

function analysisListItem(row) {
  const tone = row.resultPct >= 0 ? "positive" : "negative";
  return `<li><strong>${row.pair}</strong> ${row.side} | ${row.scenario} | <span class="${tone}">${pct(row.resultPct)}</span></li>`;
}

function analysisInsightHtml(rows) {
  const closed = rows.filter((row) => !isRunningAnalysis(row));
  const byScenario = Object.entries(groupRows(closed, "scenario")).map(([name, list]) => [name, analysisStats(list)]);
  const bestScenario = byScenario.slice().sort((a, b) => b[1].avg - a[1].avg)[0];
  const worstScenario = byScenario.slice().sort((a, b) => a[1].avg - b[1].avg)[0];
  const longs = analysisStats(closed.filter((row) => row.side === "long"));
  const shorts = analysisStats(closed.filter((row) => row.side === "short"));
  const noTpLosses = closed.filter((row) => row.resultPct < 0 && !hasTp1(row)).length;
  return `
    <h3>Čitateľný záver</h3>
    <p>Najlepšie zatiaľ vyzerá <strong>${bestScenario?.[0] || "-"}</strong> s priemerom <span class="positive">${pct(bestScenario?.[1].avg || 0)}</span>. Najslabšie vyzerá <strong>${worstScenario?.[0] || "-"}</strong> s priemerom <span class="negative">${pct(worstScenario?.[1].avg || 0)}</span>.</p>
    <p>Longy: WR ${fmt(longs.winrate, 0)}%, avg ${pct(longs.avg)}. Shorty: WR ${fmt(shorts.winrate, 0)}%, avg ${pct(shorts.avg)}.</p>
    <p>Strát bez TP1 zásahu je <strong>${noTpLosses}</strong>. Toto je dobrý filter pre neskoršie sprísnenie setupov.</p>
  `;
}

function analysisTradeCard(row) {
  return `
    <article class="analysis-trade ${isRunningAnalysis(row) ? "running" : ""}">
      <div>
        <strong>${row.pair}</strong>
        <span>${row.side} | ${row.session} | ${row.source}</span>
      </div>
      <span class="rating-chip">${Number.isFinite(row.rating) ? row.rating : "-"}</span>
      <span>${row.scenario}</span>
      <span>Entry <b>${fmt(row.entry)}</b></span>
      <span>Exit <b>${fmt(row.exit)}</b></span>
      <span>TP <b>${row.tpHit || "nie"}</b></span>
      <span>Result <b class="${row.resultPct >= 0 ? "positive" : "negative"}">${pct(row.resultPct)}</b></span>
      <span>MFE/MAE <b><em class="positive">${pct(row.mfe)}</em> / <em class="negative">${pct(row.mae)}</em></b></span>
      <span>Time <b>${row.timeInTrade || "-"}</b></span>
      <span>Open <b>${clockTime(row.openedAt)}</b></span>
      <span>TP1 <b>${clockTime(row.tp1At)}</b></span>
      <span>${row.account || "Paper"}</span>
    </article>
  `;
}

function renderAnalysis() {
  if (!ui.analysisSummary) return;
  renderDayLogMeta();
  const manualRows = parseManualAnalysisRows(manualAnalysisText());
  const rows = analysisRows();
  const all = analysisStats(rows);
  ui.analysisManualInput.value = manualAnalysisText();
  ui.analysisManualMeta.textContent = `${manualRows.length} closed manual rows`;
  ui.analysisMeta.textContent = `${all.count} closed rows`;
  ui.analysisSummary.innerHTML = `
    <article><span>WR</span><strong>${fmt(all.winrate, 0)}%</strong></article>
    <article><span>Wins / Losses</span><strong>${all.wins} / ${all.losses}</strong></article>
    <article><span>Avg %</span><strong class="${all.avg >= 0 ? "positive" : "negative"}">${pct(all.avg)}</strong></article>
    <article><span>TP1 hit</span><strong>${fmt(all.tp1Rate, 0)}%</strong></article>
    <article><span>Avg MFE</span><strong class="positive">${pct(all.avgMfe)}</strong></article>
    <article><span>Avg MAE</span><strong class="negative">${pct(all.avgMae)}</strong></article>
    <article><span>Running</span><strong>0</strong></article>
    <article><span>Manual</span><strong>${manualRows.length}</strong></article>
  `;
  ui.analysisScenarioBars.innerHTML = analysisBarHtml(groupRows(rows, "scenario"));
  ui.analysisSideBars.innerHTML = analysisBarHtml(groupRows(rows, "side"));
  ui.analysisRatingBars.innerHTML = analysisBarHtml(groupRows(rows, ratingBucket));
  ui.analysisSetupSideBars.innerHTML = analysisBarHtml(groupRows(rows, setupSideKey));
  const monthGroups = groupRows(rows, monthKey);
  const weekGroups = groupRows(rows, weekKey);
  const monthStates = readPeriodStates(ui.analysisMonths);
  const weekStates = readPeriodStates(ui.analysisWeeks);
  if (ui.analysisMonthMeta) ui.analysisMonthMeta.textContent = `${Object.keys(monthGroups).length} mesiacov`;
  if (ui.analysisMonths) {
    ui.analysisMonths.innerHTML = periodSummaryHtml(rows, monthKey, (key) => key, "analysis-month", monthStates);
    bindPeriodToggles(ui.analysisMonths);
  }
  if (ui.analysisWeekMeta) ui.analysisWeekMeta.textContent = `${Object.keys(weekGroups).length} týždňov`;
  if (ui.analysisWeeks) {
    const weekLabels = Object.fromEntries(rows.map((row) => {
      const info = isoWeekInfo(row.date);
      return [info.key, info.label];
    }));
    ui.analysisWeeks.innerHTML = periodSummaryHtml(rows, weekKey, (key) => weekLabels[key] || key, "analysis-week", weekStates);
    bindPeriodToggles(ui.analysisWeeks);
  }
  ui.analysisDayBars.innerHTML = analysisBarHtml(groupRows(rows, "date"));
  const sorted = rows.slice().sort((a, b) => b.resultPct - a.resultPct);
  ui.analysisBestList.innerHTML = sorted.slice(0, 5).map(analysisListItem).join("");
  ui.analysisWorstList.innerHTML = sorted.slice(-5).reverse().map(analysisListItem).join("");
  ui.analysisInsights.innerHTML = analysisInsightHtml(rows);
  const byDay = Object.entries(groupRows(rows, "date")).sort((a, b) => b[0].localeCompare(a[0]));
  ui.analysisDayMeta.textContent = `${byDay.length} dní`;
  ui.analysisDays.innerHTML = byDay.map(([date, dayRows], index) => {
    const stat = analysisStats(dayRows);
    return `
      <details class="analysis-day" ${index === 0 ? "open" : ""}>
        <summary>
          <strong>${date}</strong>
          <span>${stat.count} closed | ${stat.running} running | WR ${fmt(stat.winrate, 0)}% | avg ${pct(stat.avg)}</span>
        </summary>
        <div class="analysis-trades">
          ${dayRows.map(analysisTradeCard).join("")}
        </div>
      </details>
    `;
  }).join("") || `<p class="muted">Analysis je zatiaľ prázdna.</p>`;
}

async function updatePaper() {
  const state = paperState();
  if (!state.waiting.length && !state.active.length) return;
  const now = new Date().toISOString();
  const pairs = [...new Set([...state.waiting, ...state.active].map((trade) => trade.pair))];
  if (state.active.length) pairs.push("BTCUSDT");
  const priceMap = {};
  await Promise.allSettled(pairs.map(async (pair) => { priceMap[pair] = await price(pair); }));
  const catchupMap = {};
  const catchupPairs = [...new Set(state.active
    .filter((trade) => {
      const last = new Date(trade.lastCheckedAt || trade.openedAt || trade.createdAt || now).getTime();
      return Number.isFinite(last) && Date.now() - last > PAPER_CATCHUP_GAP_MS;
    })
    .map((trade) => trade.pair))];
  await Promise.allSettled(catchupPairs.map(async (pair) => {
    const start = Math.min(...state.active
      .filter((trade) => trade.pair === pair)
      .map((trade) => new Date(trade.lastCheckedAt || trade.openedAt || trade.createdAt || now).getTime())
      .filter(Number.isFinite));
    catchupMap[pair] = await klinesRange(pair, "1m", Math.max(0, start - 60 * 1000), Date.now());
  }));
  const nextWaiting = [];
  const nextActive = [];

  state.waiting.forEach((trade) => {
    const current = priceMap[trade.pair];
    if (!Number.isFinite(current)) {
      nextWaiting.push(trade);
      return;
    }
    trade.live = current;
    if (entryDecision(trade, current) === "open") {
      const openedAt = new Date().toISOString();
      nextActive.push({
        ...trade,
        status: "active",
        entry: current,
        originalStop: trade.originalStop ?? trade.stop,
        openedAt,
        openedSession: sessionLabel(),
        openedPrice: current,
        mfe: 0,
        mae: 0,
        timeInTrade: "0m",
        lastCheckedAt: openedAt,
      });
    } else {
      trade.lastCheckedAt = now;
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
    updateTradeBtcContext(trade, priceMap.BTCUSDT);
    const lastChecked = new Date(trade.lastCheckedAt || trade.openedAt || trade.createdAt || now).getTime();
    const catchupCandles = (catchupMap[trade.pair] || [])
      .filter((candle) => (candle.closeTime || candle.time) > lastChecked)
      .sort((a, b) => (a.closeTime || a.time) - (b.closeTime || b.time));
    let closedByCatchup = false;
    if (catchupCandles.length) {
      for (const candle of catchupCandles) {
        if (processTradeCandle(trade, candle) === "closed") {
          closedByCatchup = true;
          break;
        }
      }
    }
    if (closedByCatchup) return;
    updateTradeTracking(trade, current);
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
      trade.lastCheckedAt = now;
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
  const market = trade.market || {};
  const mode = trade.setupMode || (trade.tradable === false ? "watch" : "trade");
  const targets = trade.targets.map((target) => {
    const hitClass = target.hit ? "tp-hit" : "";
    const cls = target.hit ? "positive" : "";
    return `<span class="${hitClass}">${target.label} <b class="${cls}">${fmt(target.price)} ${pct(movePct(trade.entry, target.price, trade.side))}</b></span>`;
  }).join("");
  return `
    <article class="trade-card ${active ? "active" : "waiting"} ${trade.side}" data-pair="${trade.pair}">
      <div class="trade-head">
        <strong>${trade.pair} ${trade.side.toUpperCase()}</strong>
        <div class="badge-row">
          <span class="badge ${active ? "good" : "neutral"}">${active ? "active" : "waiting"}</span>
          <span class="side-chip ${mode === "watch" ? "watch" : trade.side}">${mode}</span>
        </div>
      </div>
      <p>${trade.scenario}</p>
      ${mode === "watch" && (trade.warnings || []).length ? `<p class="warning">Watch note: ${(trade.warnings || []).join(" ")}</p>` : ""}
      <div class="metric-list">
        <span>Entry <b>${active ? fmt(trade.entry) : zoneText(trade.entryZone)}</b></span>
        <span>Live <b>${fmt(live)}</b></span>
        <span>Now <b class="${currentPct >= 0 ? "positive" : "negative"}">${pct(currentPct)}</b></span>
        <span class="${trade.breakEven ? "tp-hit" : ""}">SL <b class="${trade.breakEven ? "positive" : "negative"}">${fmt(trade.stop)} ${pct(movePct(trade.entry, trade.stop, trade.side))}${trade.breakEven ? " BE" : ""}</b></span>
        ${targets}
      </div>
      <div class="trade-context">
        <span>Created <b>${dateTimeLabel(trade.createdAt)}</b></span>
        <span>Opened <b>${dateTimeLabel(trade.openedAt)}</b></span>
        <span>Open filter <b>${active ? "confirmed" : entryStatusText(trade)}</b></span>
        <span>Trigger <b>${active ? "opened" : entryTriggerValue(trade)}</b></span>
        <span>Spread <b>${pct(market.spreadPct)}</b></span>
        <span>Vol <b>${usd(market.quoteVolume)}</b></span>
        <span>Trades <b>${compactNumber(market.tradeCount, 1)}</b></span>
        <span>Taker buy <b>${pct(market.takerBuyPct, 0)}</b></span>
      </div>
      ${active ? `
        <div class="tracking-grid">
          <span>Live PnL <b class="${currentPct >= 0 ? "positive" : "negative"}">${pct(currentPct)}</b></span>
          <span>MFE <b class="positive">${pct(trade.mfe || 0)}</b></span>
          <span>MAE <b class="negative">${pct(trade.mae || 0)}</b></span>
          <span>Time <b>${trade.timeInTrade || timeAgo(trade.openedAt)}</b></span>
          <span>TP1 at <b>${dateTimeLabel(trade.tp1At || trade.targets.find((target) => target.label === "TP1")?.hitAt)}</b></span>
          <span>TP1 after <b>${trade.timeToTp1 || "-"}</b></span>
          <span>SL state <b class="${trade.breakEven ? "positive" : ""}">${trade.breakEven ? "BE po TP1" : "initial"}</b></span>
        </div>
      ` : ""}
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
  if (chartPair) syncChart(chartPair, "paper");
  ui.waitingMeta.textContent = `${state.waiting.length} waiting`;
  ui.activeMeta.textContent = `${state.active.length} active`;
  ui.waitingTrades.innerHTML = state.waiting.length ? state.waiting.map((trade) => tradeCard(trade, false)).join("") : `<p class="muted">Žiadne čakajúce scenáre.</p>`;
  ui.activeTrades.innerHTML = state.active.length ? state.active.map((trade) => tradeCard(trade, true)).join("") : `<p class="muted">Žiadne aktívne paper trades.</p>`;
  document.querySelectorAll(".trade-card[data-pair]").forEach((card) => {
    card.addEventListener("click", () => {
      localStorage.setItem(STORE.paperChartPair, card.dataset.pair);
      syncChart(card.dataset.pair, "paper");
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
  const realRows = closedRows.filter((row) => row.realTrade);
  const wins = closedRows.filter((row) => row.outcome === "Win").length;
  const avg = closedRows.length ? average(closedRows.map((row) => Number(row.resultPct) || 0)) : 0;
  const realWins = realRows.filter((row) => row.outcome === "Win").length;
  const realAvg = realRows.length ? average(realRows.map((row) => Number(row.resultPct) || 0)) : 0;
  const realVsPaperAvg = realRows.length ? realAvg - avg : 0;
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
    <article><span>Paper WR</span><strong>${closedRows.length ? Math.round((wins / closedRows.length) * 100) : 0}%</strong></article>
    <article><span>Wins / Losses</span><strong>${wins} / ${closedRows.length - wins}</strong></article>
    <article><span>Paper avg</span><strong class="${avg >= 0 ? "positive" : "negative"}">${pct(avg)}</strong></article>
    <article><span>TP pred SL</span><strong>${tpBeforeSl}</strong></article>
    <article><span>Najlepší scenár</span><strong>${best ? best[0] : "-"}</strong></article>
    <article><span>Real marked</span><strong>${realRows.length}</strong></article>
    <article><span>Real WR</span><strong>${realRows.length ? Math.round((realWins / realRows.length) * 100) : 0}%</strong></article>
    <article><span>Real vs paper</span><strong class="${realVsPaperAvg >= 0 ? "positive" : "negative"}">${realRows.length ? pct(realVsPaperAvg) : "-"}</strong></article>
  `;
  const grouped = rows.reduce((acc, row) => {
    const key = dayKey(row.closedAt || row.updatedAt || new Date().toISOString());
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
      ${dayRows.map((row) => `
      <div class="journal-simple ${row.status === "running" ? "running" : ""}">
        <div>
          <strong>${row.pair}</strong>
          <span>${row.side} | ${journalDisplaySession(row)} | ${row.setupMode || "trade"}</span>
        </div>
        <span class="rating-chip">${Number.isFinite(row.rating) ? row.rating : "-"}</span>
        <span>${row.scenario}</span>
        <span>Entry <b>${fmt(row.entry)}</b></span>
        <span>Exit <b>${fmt(row.exit)}</b></span>
        <span>TP <b>${row.tpHit}</b></span>
        <span class="${row.resultPct >= 0 ? "positive" : "negative"}">${pct(row.resultPct)}</span>
        <div class="journal-time">
          <span>Open</span>
          <b>${dateTimeLabel(row.openedAt)}</b>
        </div>
        <div class="journal-time">
          <span>TP1</span>
          <b>${dateTimeLabel(row.tp1At)}</b>
          <small>${row.timeToTp1 || "-"}</small>
        </div>
        <div class="journal-time">
          <span>Close</span>
          <b>${dateTimeLabel(row.closedAt)}</b>
          <small>${row.timeInTrade || "-"}</small>
        </div>
        <span class="${row.outcome === "Win" || row.outcome === "Running" ? "positive" : "negative"}">${row.outcome} | ${row.reason}</span>
        <span><button class="real-toggle ${row.realTrade ? "active" : ""}" data-id="${row.id}" type="button">${row.realTrade ? "Real" : "Paper"}</button></span>
        </div>
    `).join("")}
    `;
  }).join("") || `<p class="muted">Journal je zatiaľ prázdny.</p>`;
  ui.journalTable.querySelectorAll(".real-toggle").forEach((button) => {
    button.addEventListener("click", () => toggleRealJournalTrade(button.dataset.id));
  });
  renderAnalysis();
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
  const book = await json(`${API}/fapi/v1/ticker/bookTicker?symbol=${selected.pair}`).catch(() => null);
  const updated = analyzeGainer(
    { ...ticker, gainerRank: selected.gainerRank },
    await klines(selected.pair, "15m"),
    book,
    await klines(selected.pair, "1h", 48),
    selected.gainerRank,
  );
  gainers = gainers.map((item) => item.pair === updated.pair ? updated : item).sort((a, b) => b.rating - a.rating || b.dayChange - a.dayChange);
  selectGainer(updated.pair);
});
ui.clearJournalButton.addEventListener("click", () => {
  saveJournal([]);
  renderJournal();
});
if (ui.saveAnalysisManualButton) {
  ui.saveAnalysisManualButton.addEventListener("click", () => {
    saveManualAnalysis(ui.analysisManualInput.value);
    renderAnalysis();
  });
}
if (ui.clearAnalysisManualButton) {
  ui.clearAnalysisManualButton.addEventListener("click", () => {
    saveManualAnalysis("");
    renderAnalysis();
  });
}
if (ui.exportDayLogButton) {
  ui.exportDayLogButton.addEventListener("click", exportDayLog);
}
if (ui.exportAnalysisTextButton) {
  ui.exportAnalysisTextButton.addEventListener("click", exportAnalysisText);
}
if (ui.exportAnalysisJsonButton) {
  ui.exportAnalysisJsonButton.addEventListener("click", exportAnalysisJson);
}
if (ui.clearDayLogButton) {
  ui.clearDayLogButton.addEventListener("click", clearTodayDayLog);
}

migrateAnalysisManualRows();
migrateServicePcJournalImports();
setInterval(updatePaper, 8000);
setInterval(scanLive, AUTO_SCAN_MS);
renderPaper();
renderJournal();
scanLive();
