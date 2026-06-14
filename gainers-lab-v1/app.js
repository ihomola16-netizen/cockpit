const API = "https://fapi.binance.com";
const STORE = {
  paper: "gainers-lab-v1-paper",
  intuition: "gainers-lab-v1-intuition",
  journal: "gainers-lab-v1-journal",
  analysisManual: "gainers-lab-v1-analysis-manual",
  analysisManualPatch: "gainers-lab-v1-analysis-manual-patch-2026-05-22-service-pc",
  journalImportPatch: "gainers-lab-v1-journal-import-patch-2026-05-25-service-pc",
  journalImportPatch20260526: "gainers-lab-v1-journal-import-patch-2026-05-26-service-pc",
  journalImportPatch20260527: "gainers-lab-v1-journal-import-patch-2026-05-27-service-pc",
  journalImportPatch20260528: "gainers-lab-v1-journal-import-patch-2026-05-28-service-pc",
  journalImportPatch20260529: "gainers-lab-v1-journal-import-patch-2026-05-29-service-pc",
  journalImportPatch20260530: "gainers-lab-v1-journal-import-patch-2026-05-30-mobile",
  journalImportPatch20260531: "gainers-lab-v1-journal-import-patch-2026-05-31-mobile",
  journalImportPatch20260601: "gainers-lab-v1-journal-import-patch-2026-06-01-mobile",
  journalImportPatch20260601Work: "gainers-lab-v1-journal-import-patch-2026-06-01-work",
  journalImportPatch20260602Work: "gainers-lab-v1-journal-import-patch-2026-06-02-work",
  journalImportPatch20260603Work: "gainers-lab-v1-journal-import-patch-2026-06-03-work",
  journalImportPatch20260604Work: "gainers-lab-v1-journal-import-patch-2026-06-04-work",
  journalConsistencyPatch20260527: "gainers-lab-v1-journal-consistency-patch-2026-05-27",
  journalTpSlPatch20260527: "gainers-lab-v1-journal-tp-sl-patch-2026-05-27",
  journalTpSlPatch20260528: "gainers-lab-v1-journal-tp-sl-patch-2026-05-28",
  journalSlFillPatch20260529: "gainers-lab-v1-journal-sl-fill-patch-2026-05-29",
  removeOversizedRiskPatch20260531: "gainers-lab-v1-remove-oversized-risk-2026-05-31",
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

const SERVICE_PC_JOURNAL_IMPORTS_20260526 = [
  {
    importKey: "2026-05-26-inusdt-short-125055-162121",
    tradeId: "service-pc-2026-05-26-inusdt-short-125055",
    pair: "INUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.09779,
    exit: 0.09409,
    reason: "Final TP",
    status: "closed",
    tpHit: "TP1, TP2, TP3",
    resultPct: 3.77,
    mfe: 3.78,
    mae: -1.65,
    riskPct: 2.16,
    tp1R: 1.15,
    timeInTrade: "3h 30m",
    timeToTp1: "55m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-26T10:36:39.321Z",
    entryTouchedPrice: 0.09826,
    openedAt: "2026-05-26T12:50:55.969Z",
    tp1At: "2026-05-26T13:46:51.043Z",
    closedAt: "2026-05-26T16:21:21.760Z",
    outcome: "Win",
    market: { gainerRank: 10, btcMovePct: -1.07, metadata: { pump: { distanceFromHighPct: 1.00, timeSincePumpMin: 546 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-26-basusdt-short-091049-130151",
    tradeId: "service-pc-2026-05-26-basusdt-short-091049",
    pair: "BASUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.025372,
    exit: 0.026166,
    reason: "SL",
    status: "closed",
    tpHit: "nie",
    resultPct: -3.13,
    mfe: 1.67,
    mae: -3.13,
    riskPct: 1.76,
    tp1R: 1.69,
    timeInTrade: "3h 51m",
    timeToTp1: "-",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-26T09:09:48.278Z",
    entryTouchedPrice: 0.025485,
    openedAt: "2026-05-26T09:10:49.262Z",
    tp1At: null,
    closedAt: "2026-05-26T13:01:51.742Z",
    outcome: "Loss",
    market: { gainerRank: 4, btcMovePct: 0.57, metadata: { pump: { distanceFromHighPct: 0.89, timeSincePumpMin: 1298 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-26-phausdt-long-115751-122050",
    tradeId: "service-pc-2026-05-26-phausdt-long-115751",
    pair: "PHAUSDT",
    side: "long",
    scenario: "Pullback long",
    rating: 92,
    entry: 0.04665,
    exit: 0.04883,
    reason: "Final TP",
    status: "closed",
    tpHit: "TP1, TP2, TP3",
    resultPct: 4.55,
    mfe: 4.67,
    mae: 0,
    riskPct: 1.57,
    tp1R: 1.73,
    timeInTrade: "22m",
    timeToTp1: "0m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-26T11:57:43.423Z",
    entryTouchedPrice: 0.04643,
    openedAt: "2026-05-26T11:57:51.417Z",
    tp1At: "2026-05-26T11:58:15.425Z",
    closedAt: "2026-05-26T12:20:50.953Z",
    outcome: "Win",
    market: { gainerRank: 2, btcMovePct: 0.49, metadata: { pump: { distanceFromHighPct: 11.10, timeSincePumpMin: 1153 }, higherTimeframe: { h1: { trend: "down" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-26-ubusdt-long-111550-111553",
    tradeId: "service-pc-2026-05-26-ubusdt-long-111550",
    pair: "UBUSDT",
    side: "long",
    scenario: "Pullback long",
    rating: 89,
    entry: 0.19302,
    exit: 0.19302,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: -0.16,
    mfe: 0,
    mae: 0,
    riskPct: 1.46,
    tp1R: 1.63,
    timeInTrade: "0m",
    timeToTp1: "0m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-26T11:10:47.284Z",
    entryTouchedPrice: 0.19103,
    openedAt: "2026-05-26T11:15:50.574Z",
    tp1At: "2026-05-26T11:15:53.423Z",
    closedAt: "2026-05-26T11:15:53.428Z",
    outcome: "Win",
    market: { gainerRank: 12, btcMovePct: 0.44, metadata: { pump: { distanceFromHighPct: 7.03, timeSincePumpMin: 558 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-26-collectusdt-short-081422-081459",
    tradeId: "service-pc-2026-05-26-collectusdt-short-081422",
    pair: "COLLECTUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.05767,
    exit: 0.05767,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 2.20,
    mfe: 4.99,
    mae: -1.16,
    riskPct: 1.83,
    tp1R: 1.84,
    timeInTrade: "0m",
    timeToTp1: "56m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-26T08:12:54.962Z",
    entryTouchedPrice: 0.05787,
    openedAt: "2026-05-26T08:14:22.959Z",
    tp1At: "2026-05-26T09:10:49.262Z",
    closedAt: "2026-05-26T08:14:59.999Z",
    outcome: "Win",
    market: { gainerRank: 13, btcMovePct: -0.30, metadata: { pump: { distanceFromHighPct: 1.38, timeSincePumpMin: 88 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-26-guausdt-short-090250-090550",
    tradeId: "service-pc-2026-05-26-guausdt-short-090250",
    pair: "GUAUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 1.603,
    exit: 1.5826,
    reason: "Final TP",
    status: "closed",
    tpHit: "TP1, TP2, TP3",
    resultPct: 0.53,
    mfe: 1.27,
    mae: 0,
    riskPct: 1.34,
    tp1R: 2.08,
    timeInTrade: "3m",
    timeToTp1: "2m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-26T08:39:58.992Z",
    entryTouchedPrice: 1.6407,
    openedAt: "2026-05-26T09:02:50.256Z",
    tp1At: "2026-05-26T09:04:50.523Z",
    closedAt: "2026-05-26T09:05:50.282Z",
    outcome: "Win",
    market: { gainerRank: 2, btcMovePct: -0.08, metadata: { pump: { distanceFromHighPct: 2.65, timeSincePumpMin: 1039 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-26-guausdt-long-081518-083511",
    tradeId: "service-pc-2026-05-26-guausdt-long-081518",
    pair: "GUAUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 65,
    entry: 1.6242,
    exit: 1.6715,
    reason: "Final TP",
    status: "closed",
    tpHit: "TP1, TP2, TP3",
    resultPct: 2.51,
    mfe: 2.91,
    mae: -0.86,
    riskPct: 1.12,
    tp1R: 1.59,
    timeInTrade: "19m",
    timeToTp1: "1m",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-26T08:11:18.960Z",
    entryTouchedPrice: 1.6038,
    openedAt: "2026-05-26T08:15:18.960Z",
    tp1At: "2026-05-26T08:16:22.958Z",
    closedAt: "2026-05-26T08:35:11.001Z",
    outcome: "Win",
    market: { gainerRank: 5, btcMovePct: -0.11, metadata: { pump: { distanceFromHighPct: 8.47, timeSincePumpMin: 903 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-26-iousdt-short-071650-074150",
    tradeId: "service-pc-2026-05-26-iousdt-short-071650",
    pair: "IOUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.1676,
    exit: 0.1732,
    reason: "SL",
    status: "closed",
    tpHit: "nie",
    resultPct: -3.34,
    mfe: 0.06,
    mae: -3.34,
    riskPct: 1.66,
    tp1R: 2.00,
    timeInTrade: "24m",
    timeToTp1: "-",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-26T06:58:50.169Z",
    entryTouchedPrice: 0.1694,
    openedAt: "2026-05-26T07:16:50.199Z",
    tp1At: null,
    closedAt: "2026-05-26T07:41:50.186Z",
    outcome: "Loss",
    market: { gainerRank: 8, btcMovePct: -0.39, metadata: { pump: { distanceFromHighPct: 0.71, timeSincePumpMin: 993 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-26-phausdt-long-064809-074050",
    tradeId: "service-pc-2026-05-26-phausdt-long-064809",
    pair: "PHAUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 72,
    entry: 0.04659,
    exit: 0.04917,
    reason: "Final TP",
    status: "closed",
    tpHit: "TP1, TP2, TP3",
    resultPct: 5.14,
    mfe: 5.54,
    mae: -2.34,
    riskPct: 1.35,
    tp1R: 2.67,
    timeInTrade: "52m",
    timeToTp1: "33m",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-26T06:22:50.221Z",
    entryTouchedPrice: 0.0463,
    openedAt: "2026-05-26T06:48:09.950Z",
    tp1At: "2026-05-26T07:21:50.212Z",
    closedAt: "2026-05-26T07:40:50.191Z",
    outcome: "Win",
    market: { gainerRank: 2, btcMovePct: -0.26, metadata: { pump: { distanceFromHighPct: 14.56, timeSincePumpMin: 1068 }, higherTimeframe: { h1: { trend: "down" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-26-playusdt-long-064050-064241",
    tradeId: "service-pc-2026-05-26-playusdt-long-064050",
    pair: "PLAYUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 65,
    entry: 0.10215,
    exit: 0.10204,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: -0.14,
    mfe: 0,
    mae: -0.30,
    riskPct: 1.72,
    tp1R: 1.04,
    timeInTrade: "1m",
    timeToTp1: "1m",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-26T06:18:41.935Z",
    entryTouchedPrice: 0.10129,
    openedAt: "2026-05-26T06:40:50.148Z",
    tp1At: "2026-05-26T06:42:41.935Z",
    closedAt: "2026-05-26T06:42:41.940Z",
    outcome: "Win",
    market: { gainerRank: 1, btcMovePct: 0.17, metadata: { pump: { distanceFromHighPct: 13.37, timeSincePumpMin: 1368 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
];

const SERVICE_PC_JOURNAL_IMPORTS_20260527 = [
  {
    importKey: "2026-05-27-wdcusdt-long-161256-161259",
    tradeId: "service-pc-2026-05-27-wdcusdt-long-161256",
    pair: "WDCUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 61,
    entry: 532.02,
    exit: 532.02,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 0,
    mfe: 0,
    mae: -0.29,
    riskPct: 0.85,
    tp1R: 1.42,
    timeInTrade: "0m",
    timeToTp1: "0m",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-27T16:12:22.526Z",
    entryTouchedPrice: 530.47,
    openedAt: "2026-05-27T16:12:56.534Z",
    tp1At: "2026-05-27T16:12:59.999Z",
    closedAt: "2026-05-27T16:12:59.999Z",
    outcome: "Win",
    market: { gainerRank: 15, btcMovePct: -1.07, metadata: { pump: { distanceFromHighPct: 1.88, timeSincePumpMin: 1382 }, higherTimeframe: { h1: { trend: "down" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-27-1000luncusdt-long-161222-161259",
    tradeId: "service-pc-2026-05-27-1000luncusdt-long-161222",
    pair: "1000LUNCUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 54,
    entry: 0.0925,
    exit: 0.0925,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: -1.54,
    mfe: 0.32,
    mae: -0.05,
    riskPct: 1.85,
    tp1R: 0.65,
    timeInTrade: "0m",
    timeToTp1: "0m",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-27T13:10:12.552Z",
    entryTouchedPrice: 0.09064,
    openedAt: "2026-05-27T16:12:22.526Z",
    tp1At: "2026-05-27T16:12:32.533Z",
    closedAt: "2026-05-27T16:12:59.999Z",
    outcome: "Loss",
    market: { gainerRank: 7, btcMovePct: -1.02, metadata: { pump: { distanceFromHighPct: 1.68, timeSincePumpMin: 887 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-27-clousdt-short-114705-131459",
    tradeId: "service-pc-2026-05-27-clousdt-short-114705",
    pair: "CLOUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.07368,
    exit: 0.076359,
    reason: "SL",
    status: "closed",
    tpHit: "nie",
    resultPct: -3.64,
    mfe: 0.52,
    mae: -4.15,
    riskPct: 1.74,
    tp1R: 1.79,
    timeInTrade: "1h 27m",
    timeToTp1: "-",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-27T11:27:11.661Z",
    entryTouchedPrice: 0.0745,
    openedAt: "2026-05-27T11:47:05.333Z",
    tp1At: null,
    closedAt: "2026-05-27T13:14:59.999Z",
    outcome: "Loss",
    market: { gainerRank: 13, btcMovePct: -0.98, metadata: { pump: { distanceFromHighPct: 1.43, timeSincePumpMin: 1182 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-27-playusdt-short-125811-125925",
    tradeId: "service-pc-2026-05-27-playusdt-short-125811",
    pair: "PLAYUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.11314,
    exit: 0.11338,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 0.47,
    mfe: 0.90,
    mae: -0.21,
    riskPct: 2.07,
    tp1R: 1.39,
    timeInTrade: "1m",
    timeToTp1: "0m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-27T12:54:45.116Z",
    entryTouchedPrice: 0.11485,
    openedAt: "2026-05-27T12:58:11.559Z",
    tp1At: "2026-05-27T12:58:13.002Z",
    closedAt: "2026-05-27T12:59:25.115Z",
    outcome: "Win",
    market: { gainerRank: 7, btcMovePct: 0.07, metadata: { pump: { distanceFromHighPct: 0.77, timeSincePumpMin: 936 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-27-ustcusdt-short-110740-115459",
    tradeId: "service-pc-2026-05-27-ustcusdt-short-110740",
    pair: "USTCUSDT",
    side: "short",
    scenario: "Too hot / top watch",
    rating: 75,
    entry: 0.006644,
    exit: 0.0067478,
    reason: "SL",
    status: "closed",
    tpHit: "nie",
    resultPct: -1.56,
    mfe: 0.65,
    mae: -2.20,
    riskPct: 0.63,
    tp1R: 2.99,
    timeInTrade: "47m",
    timeToTp1: "-",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-27T10:58:05.029Z",
    entryTouchedPrice: 0.00666,
    openedAt: "2026-05-27T11:07:40.469Z",
    tp1At: null,
    closedAt: "2026-05-27T11:54:59.999Z",
    outcome: "Loss",
    market: { gainerRank: 12, btcMovePct: -0.19, metadata: { pump: { distanceFromHighPct: 1.06, timeSincePumpMin: 417 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-27-catiusdt-short-102519-105459",
    tradeId: "service-pc-2026-05-27-catiusdt-short-102519",
    pair: "CATIUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.05929,
    exit: 0.05929,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 1.07,
    mfe: 1.28,
    mae: -0.10,
    riskPct: 1.34,
    tp1R: 1.78,
    timeInTrade: "29m",
    timeToTp1: "4m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-27T10:11:32.465Z",
    entryTouchedPrice: 0.05972,
    openedAt: "2026-05-27T10:25:19.479Z",
    tp1At: "2026-05-27T10:29:59.999Z",
    closedAt: "2026-05-27T10:54:59.999Z",
    outcome: "Win",
    market: { gainerRank: 13, btcMovePct: 0.23, metadata: { pump: { distanceFromHighPct: 1.35, timeSincePumpMin: 88 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-27-ususdt-long-102519-102524",
    tradeId: "service-pc-2026-05-27-ususdt-long-102519",
    pair: "USUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 77,
    entry: 0.007001,
    exit: 0.007,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: -0.06,
    mfe: 0,
    mae: -0.01,
    riskPct: 0.92,
    tp1R: 1.59,
    timeInTrade: "0m",
    timeToTp1: "0m",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-27T10:11:24.443Z",
    entryTouchedPrice: 0.006907,
    openedAt: "2026-05-27T10:25:19.478Z",
    tp1At: "2026-05-27T10:25:24.903Z",
    closedAt: "2026-05-27T10:25:24.916Z",
    outcome: "Loss",
    market: { gainerRank: 9, btcMovePct: 0.15, metadata: { pump: { distanceFromHighPct: 4.36, timeSincePumpMin: 685 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-27-beatusdt-short-083804-091332",
    tradeId: "service-pc-2026-05-27-beatusdt-short-083804",
    pair: "BEATUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 1.1312,
    exit: 1.1845,
    reason: "SL",
    status: "closed",
    tpHit: "nie",
    resultPct: -4.71,
    mfe: 0.10,
    mae: -4.71,
    riskPct: 2.74,
    tp1R: 1.30,
    timeInTrade: "35m",
    timeToTp1: "-",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-27T07:35:53.980Z",
    entryTouchedPrice: 1.1381,
    openedAt: "2026-05-27T08:38:04.404Z",
    tp1At: null,
    closedAt: "2026-05-27T09:13:32.431Z",
    outcome: "Loss",
    market: { gainerRank: 6, btcMovePct: -0.13, metadata: { pump: { distanceFromHighPct: 1.34, timeSincePumpMin: 139 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-27-ususdt-long-080310-081259",
    tradeId: "service-pc-2026-05-27-ususdt-long-080310",
    pair: "USUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 61,
    entry: 0.006973,
    exit: 0.006973,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 0.61,
    mfe: 0.67,
    mae: -0.16,
    riskPct: 1.56,
    tp1R: 1.83,
    timeInTrade: "9m",
    timeToTp1: "6m",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-27T07:36:20.932Z",
    entryTouchedPrice: 0.006891,
    openedAt: "2026-05-27T08:03:10.998Z",
    tp1At: "2026-05-27T08:09:59.999Z",
    closedAt: "2026-05-27T08:12:59.999Z",
    outcome: "Win",
    market: { gainerRank: 1, btcMovePct: 0.39, metadata: { pump: { distanceFromHighPct: 1.69, timeSincePumpMin: 1246 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-27-soxlusdt-long-050442-050444",
    tradeId: "service-pc-2026-05-27-soxlusdt-long-050442",
    pair: "SOXLUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 61,
    entry: 231.22,
    exit: 231.17,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: -0.37,
    mfe: 0,
    mae: -0.02,
    riskPct: 1.65,
    tp1R: 0.33,
    timeInTrade: "0m",
    timeToTp1: "0m",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-27T05:01:08.526Z",
    entryTouchedPrice: 230.17,
    openedAt: "2026-05-27T05:04:42.055Z",
    tp1At: "2026-05-27T05:04:44.464Z",
    closedAt: "2026-05-27T05:04:44.470Z",
    outcome: "Loss",
    market: { gainerRank: 6, btcMovePct: 0.05, metadata: { pump: { distanceFromHighPct: 2.20, timeSincePumpMin: 931 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
];

const SERVICE_PC_JOURNAL_IMPORTS_20260528 = [
  {
    importKey: "2026-05-28-xlmusdt-short-135544-162659",
    tradeId: "service-pc-2026-05-28-xlmusdt-short-135544",
    pair: "XLMUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.19825,
    exit: 0.20507,
    reason: "SL",
    status: "closed",
    tpHit: "nie",
    resultPct: -3.44,
    mfe: 3.80,
    mae: -3.80,
    riskPct: 2.10,
    tp1R: 2.61,
    timeInTrade: "2h 31m",
    timeToTp1: "-",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-28T13:39:44.669Z",
    entryTouchedPrice: 0.1989,
    openedAt: "2026-05-28T13:55:44.235Z",
    tp1At: null,
    closedAt: "2026-05-28T16:26:59.999Z",
    outcome: "Loss",
    market: { gainerRank: 1, btcMovePct: 0.79, metadata: { pump: { distanceFromHighPct: 1.25, timeSincePumpMin: 68 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-28-beatusdt-short-155107-155114",
    tradeId: "service-pc-2026-05-28-beatusdt-short-155107",
    pair: "BEATUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 1.2061,
    exit: 1.2045,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 2.81,
    mfe: 0.13,
    mae: 0,
    riskPct: 2.16,
    tp1R: 1.30,
    timeInTrade: "0m",
    timeToTp1: "0m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-28T07:34:23.981Z",
    entryTouchedPrice: 1.2525,
    openedAt: "2026-05-28T15:51:07.517Z",
    tp1At: "2026-05-28T15:51:14.971Z",
    closedAt: "2026-05-28T15:51:14.977Z",
    outcome: "Win",
    market: { gainerRank: 3, btcMovePct: -0.32, metadata: { pump: { distanceFromHighPct: 1.85, timeSincePumpMin: 1056 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-28-swarmsusdt-short-140813-141936",
    tradeId: "service-pc-2026-05-28-swarmsusdt-short-140813",
    pair: "SWARMSUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.010503,
    exit: 0.010526,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 0.89,
    mfe: 2.42,
    mae: -2.62,
    riskPct: 0.90,
    tp1R: 2.88,
    timeInTrade: "11m",
    timeToTp1: "9m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-28T09:59:20.713Z",
    entryTouchedPrice: 0.010642,
    openedAt: "2026-05-28T14:08:13.716Z",
    tp1At: "2026-05-28T14:17:14.723Z",
    closedAt: "2026-05-28T14:19:36.259Z",
    outcome: "Win",
    market: { gainerRank: 2, btcMovePct: -0.03, metadata: { pump: { distanceFromHighPct: 0.38, timeSincePumpMin: 943 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-28-cbrsusdt-long-134408-134432",
    tradeId: "service-pc-2026-05-28-cbrsusdt-long-134408",
    pair: "CBRSUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 100,
    entry: 264.61,
    exit: 264.52,
    reason: "SL",
    status: "closed",
    tpHit: "TP1, TP2",
    resultPct: 0,
    mfe: 0.02,
    mae: -0.03,
    riskPct: 0.71,
    tp1R: 0.83,
    timeInTrade: "0m",
    timeToTp1: "0m",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-28T13:38:16.211Z",
    entryTouchedPrice: 260.92,
    openedAt: "2026-05-28T13:44:08.540Z",
    tp1At: "2026-05-28T13:44:16.207Z",
    closedAt: "2026-05-28T13:44:32.209Z",
    outcome: "Win",
    market: { gainerRank: 15, btcMovePct: -0.07, metadata: { pump: { distanceFromHighPct: 3.14, timeSincePumpMin: 1418 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-28-labusdt-long-133114-133314",
    tradeId: "service-pc-2026-05-28-labusdt-long-133114",
    pair: "LABUSDT",
    side: "long",
    scenario: "Pullback long",
    rating: 97,
    entry: 4.4838,
    exit: 4.48,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 0.65,
    mfe: 0,
    mae: -0.14,
    riskPct: 0.76,
    tp1R: 0.85,
    timeInTrade: "1m",
    timeToTp1: "1m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-28T13:06:14.674Z",
    entryTouchedPrice: 4.4748,
    openedAt: "2026-05-28T13:31:14.691Z",
    tp1At: "2026-05-28T13:33:14.673Z",
    closedAt: "2026-05-28T13:33:14.677Z",
    outcome: "Win",
    market: { gainerRank: 11, btcMovePct: -0.74, metadata: { pump: { distanceFromHighPct: 6.28, timeSincePumpMin: 1304 }, higherTimeframe: { h1: { trend: "down" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-28-xlmusdt-short-115214-122814",
    tradeId: "service-pc-2026-05-28-xlmusdt-short-115214",
    pair: "XLMUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.1777,
    exit: 0.18213,
    reason: "SL",
    status: "closed",
    tpHit: "nie",
    resultPct: -2.49,
    mfe: 0,
    mae: -2.49,
    riskPct: 1.47,
    tp1R: 1.70,
    timeInTrade: "36m",
    timeToTp1: "-",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-28T11:45:14.648Z",
    entryTouchedPrice: 0.17823,
    openedAt: "2026-05-28T11:52:14.639Z",
    tp1At: null,
    closedAt: "2026-05-28T12:28:14.644Z",
    outcome: "Loss",
    market: { gainerRank: 1, btcMovePct: -0.10, metadata: { pump: { distanceFromHighPct: 1.11, timeSincePumpMin: 1268 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-28-zamausdt-short-121752-122114",
    tradeId: "service-pc-2026-05-28-zamausdt-short-121752",
    pair: "ZAMAUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.03703,
    exit: 0.03712,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 0.19,
    mfe: 0.22,
    mae: -0.24,
    riskPct: 0.78,
    tp1R: 1.41,
    timeInTrade: "3m",
    timeToTp1: "1m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-28T11:42:48.606Z",
    entryTouchedPrice: 0.03723,
    openedAt: "2026-05-28T12:17:52.851Z",
    tp1At: "2026-05-28T12:18:56.634Z",
    closedAt: "2026-05-28T12:21:14.659Z",
    outcome: "Win",
    market: { gainerRank: 15, btcMovePct: -0.10, metadata: { pump: { distanceFromHighPct: 0.90, timeSincePumpMin: 1317 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-28-ffusdt-long-120114-121800",
    tradeId: "service-pc-2026-05-28-ffusdt-long-120114",
    pair: "FFUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 96,
    entry: 0.10201,
    exit: 0.10195,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 0.51,
    mfe: 1.16,
    mae: -0.06,
    riskPct: 0.85,
    tp1R: 1.86,
    timeInTrade: "16m",
    timeToTp1: "5m",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-28T11:59:14.630Z",
    entryTouchedPrice: 0.1017,
    openedAt: "2026-05-28T12:01:14.652Z",
    tp1At: "2026-05-28T12:06:16.614Z",
    closedAt: "2026-05-28T12:18:00.158Z",
    outcome: "Win",
    market: { gainerRank: 7, btcMovePct: -0.06, metadata: { pump: { distanceFromHighPct: 9.45, timeSincePumpMin: 1362 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-28-rifusdt-long-114614-114714",
    tradeId: "service-pc-2026-05-28-rifusdt-long-114614",
    pair: "RIFUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 96,
    entry: 0.06743,
    exit: 0.06737,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 1.11,
    mfe: 0,
    mae: -0.09,
    riskPct: 0.81,
    tp1R: 1.37,
    timeInTrade: "0m",
    timeToTp1: "0m",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-28T11:05:04.107Z",
    entryTouchedPrice: 0.06631,
    openedAt: "2026-05-28T11:46:14.655Z",
    tp1At: "2026-05-28T11:47:14.651Z",
    closedAt: "2026-05-28T11:47:14.661Z",
    outcome: "Win",
    market: { gainerRank: 13, btcMovePct: 0.38, metadata: { pump: { distanceFromHighPct: 5.61, timeSincePumpMin: 1354 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-28-labusdt-long-100414-100514",
    tradeId: "service-pc-2026-05-28-labusdt-long-100414",
    pair: "LABUSDT",
    side: "long",
    scenario: "Pullback long",
    rating: 100,
    entry: 4.4913,
    exit: 4.4796,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 0.89,
    mfe: 0,
    mae: -0.26,
    riskPct: 0.74,
    tp1R: 1.20,
    timeInTrade: "1m",
    timeToTp1: "1m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-28T09:58:00.044Z",
    entryTouchedPrice: 4.456,
    openedAt: "2026-05-28T10:04:14.553Z",
    tp1At: "2026-05-28T10:05:14.607Z",
    closedAt: "2026-05-28T10:05:14.612Z",
    outcome: "Win",
    market: { gainerRank: 13, btcMovePct: -0.06, metadata: { pump: { distanceFromHighPct: 7.22, timeSincePumpMin: 1138 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-28-billusdt-long-081000-093214",
    tradeId: "service-pc-2026-05-28-billusdt-long-081000",
    pair: "BILLUSDT",
    side: "long",
    scenario: "Pullback long",
    rating: 87,
    entry: 0.08557,
    exit: 0.08506,
    reason: "SL",
    status: "closed",
    tpHit: "TP1, TP2",
    resultPct: 3.42,
    mfe: 5.07,
    mae: -0.64,
    riskPct: 2.57,
    tp1R: 1.35,
    timeInTrade: "1h 22m",
    timeToTp1: "12m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-28T08:09:36.000Z",
    entryTouchedPrice: 0.08516,
    openedAt: "2026-05-28T08:10:00.016Z",
    tp1At: "2026-05-28T08:22:12.002Z",
    closedAt: "2026-05-28T09:32:14.579Z",
    outcome: "Win",
    market: { gainerRank: 6, btcMovePct: -0.04, metadata: { pump: { distanceFromHighPct: 5.09, timeSincePumpMin: 246 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-28-labusdt-long-071807-075314",
    tradeId: "service-pc-2026-05-28-labusdt-long-071807",
    pair: "LABUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 94,
    entry: 4.4636,
    exit: 4.4592,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 0.35,
    mfe: 1.24,
    mae: -0.43,
    riskPct: 2.10,
    tp1R: 0.90,
    timeInTrade: "35m",
    timeToTp1: "6m",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-28T07:07:51.969Z",
    entryTouchedPrice: 4.3975,
    openedAt: "2026-05-28T07:18:07.963Z",
    tp1At: "2026-05-28T07:24:07.982Z",
    closedAt: "2026-05-28T07:53:14.460Z",
    outcome: "Win",
    market: { gainerRank: 10, btcMovePct: 0.32, metadata: { pump: { distanceFromHighPct: 8.59, timeSincePumpMin: 966 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-28-ffusdt-long-065314-073831",
    tradeId: "service-pc-2026-05-28-ffusdt-long-065314",
    pair: "FFUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 78,
    entry: 0.10225,
    exit: 0.10496,
    reason: "Final TP",
    status: "closed",
    tpHit: "TP1, TP2, TP3",
    resultPct: 2.50,
    mfe: 2.65,
    mae: -0.02,
    riskPct: 1.06,
    tp1R: 1.38,
    timeInTrade: "45m",
    timeToTp1: "5m",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-28T06:50:48.058Z",
    entryTouchedPrice: 0.10191,
    openedAt: "2026-05-28T06:53:14.513Z",
    tp1At: "2026-05-28T06:59:11.953Z",
    closedAt: "2026-05-28T07:38:31.993Z",
    outcome: "Win",
    market: { gainerRank: 10, btcMovePct: 0.34, metadata: { pump: { distanceFromHighPct: 9.61, timeSincePumpMin: 1069 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
];

const SERVICE_PC_JOURNAL_IMPORTS_20260529 = [
  {
    importKey: "2026-05-29-jctusdt-short-102712-105012",
    tradeId: "service-pc-2026-05-29-jctusdt-short-102712",
    pair: "JCTUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.00414,
    exit: 0.0040401,
    reason: "Final TP",
    status: "closed",
    tpHit: "TP1, TP2, TP3",
    resultPct: 2.41,
    mfe: 3.16,
    mae: -0.41,
    riskPct: 3.39,
    tp1R: 0.24,
    timeInTrade: "23m",
    timeToTp1: "5m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-29T10:23:12.917Z",
    entryTouchedPrice: 0.004176,
    openedAt: "2026-05-29T10:27:12.934Z",
    tp1At: "2026-05-29T10:32:31.921Z",
    closedAt: "2026-05-29T10:50:12.983Z",
    outcome: "Win",
    market: { gainerRank: 5, btcMovePct: -0.08, metadata: { pump: { distanceFromHighPct: 1.38, timeSincePumpMin: 1200 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-29-idusdt-long-093713-104512",
    tradeId: "service-pc-2026-05-29-idusdt-long-093713",
    pair: "IDUSDT",
    side: "long",
    scenario: "Pullback long",
    rating: 93,
    entry: 0.02997,
    exit: 0.032701,
    reason: "Final TP",
    status: "closed",
    tpHit: "TP1, TP2, TP3",
    resultPct: 9.11,
    mfe: 9.54,
    mae: -0.23,
    riskPct: 3.65,
    tp1R: 0.53,
    timeInTrade: "1h 7m",
    timeToTp1: "31m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-29T09:18:12.884Z",
    entryTouchedPrice: 0.0298,
    openedAt: "2026-05-29T09:37:13.566Z",
    tp1At: "2026-05-29T10:09:12.952Z",
    closedAt: "2026-05-29T10:45:12.965Z",
    outcome: "Win",
    market: { gainerRank: 11, btcMovePct: -0.25, metadata: { pump: { distanceFromHighPct: 6.65, timeSincePumpMin: 37 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-29-guausdt-long-072012-074719",
    tradeId: "service-pc-2026-05-29-guausdt-long-072012",
    pair: "GUAUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 81,
    entry: 0.7415,
    exit: 0.7391,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 1.50,
    mfe: 1.62,
    mae: -4.29,
    riskPct: 13.12,
    tp1R: 0.11,
    timeInTrade: "27m",
    timeToTp1: "24m",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-29T07:06:55.323Z",
    entryTouchedPrice: 0.7028,
    openedAt: "2026-05-29T07:20:12.829Z",
    tp1At: "2026-05-29T07:44:47.343Z",
    closedAt: "2026-05-29T07:47:19.341Z",
    outcome: "Win",
    market: { gainerRank: 8, btcMovePct: -0.50, metadata: { pump: { distanceFromHighPct: 18.12, timeSincePumpMin: 1192 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-29-guausdt-long-065847-070612",
    tradeId: "service-pc-2026-05-29-guausdt-long-065847",
    pair: "GUAUSDT",
    side: "long",
    scenario: "Pullback long",
    rating: 80,
    entry: 0.7079,
    exit: 0.7059,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 1.43,
    mfe: 4.73,
    mae: -0.51,
    riskPct: 7.60,
    tp1R: 0.19,
    timeInTrade: "7m",
    timeToTp1: "0m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-29T06:50:47.300Z",
    entryTouchedPrice: 0.6982,
    openedAt: "2026-05-29T06:58:47.302Z",
    tp1At: "2026-05-29T06:59:19.305Z",
    closedAt: "2026-05-29T07:06:12.818Z",
    outcome: "Win",
    market: { gainerRank: 2, btcMovePct: -0.03, metadata: { pump: { distanceFromHighPct: 11.12, timeSincePumpMin: 1151 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-29-guausdt-short-062047-062711",
    tradeId: "service-pc-2026-05-29-guausdt-short-062047",
    pair: "GUAUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.7408,
    exit: 0.77888,
    reason: "SL",
    status: "closed",
    tpHit: "nie",
    resultPct: -5.14,
    mfe: 0,
    mae: -5.29,
    riskPct: 5.14,
    tp1R: 0.35,
    timeInTrade: "6m",
    timeToTp1: "-",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-29T06:20:31.799Z",
    entryTouchedPrice: 0.7632,
    openedAt: "2026-05-29T06:20:47.808Z",
    tp1At: null,
    closedAt: "2026-05-29T06:27:11.815Z",
    outcome: "Loss",
    market: { gainerRank: 2, btcMovePct: 0.28, metadata: { pump: { distanceFromHighPct: 2.14, timeSincePumpMin: 1372 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-29-xplusdt-short-060012-062511",
    tradeId: "service-pc-2026-05-29-xplusdt-short-060012",
    pair: "XPLUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.0959,
    exit: 0.0977,
    reason: "SL",
    status: "closed",
    tpHit: "nie",
    resultPct: -1.88,
    mfe: 0,
    mae: -1.88,
    riskPct: 1.87,
    tp1R: 0.37,
    timeInTrade: "24m",
    timeToTp1: "-",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-29T05:26:12.761Z",
    entryTouchedPrice: 0.0969,
    openedAt: "2026-05-29T06:00:12.767Z",
    tp1At: null,
    closedAt: "2026-05-29T06:25:11.313Z",
    outcome: "Loss",
    market: { gainerRank: 5, btcMovePct: 0.36, metadata: { pump: { distanceFromHighPct: 0.51, timeSincePumpMin: 727 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
];

const MOBILE_JOURNAL_IMPORTS_20260530 = [
  {
    importKey: "2026-05-30-husdt-short-202136-203759",
    tradeId: "mobile-2026-05-30-husdt-short-202136",
    pair: "HUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.38633,
    exit: 0.38633,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 1.36,
    mfe: 1.93,
    mae: -1.86,
    riskPct: 5.42,
    tp1R: 0.25,
    timeInTrade: "16m",
    timeToTp1: "14m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-30T18:22:10.395Z",
    entryTouchedPrice: 0.38934,
    openedAt: "2026-05-30T20:21:36.934Z",
    tp1At: "2026-05-30T20:35:59.999Z",
    closedAt: "2026-05-30T20:37:59.999Z",
    outcome: "Win",
    market: { gainerRank: 2, btcMovePct: -0.10, metadata: { pump: { distanceFromHighPct: 1.64, timeSincePumpMin: 477 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-30-labusdt-short-192052-193559",
    tradeId: "mobile-2026-05-30-labusdt-short-192052",
    pair: "LABUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 7.7623,
    exit: 7.7623,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 1.38,
    mfe: 1.50,
    mae: -2.09,
    riskPct: 6.25,
    tp1R: 0.22,
    timeInTrade: "15m",
    timeToTp1: "14m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-30T18:37:59.321Z",
    entryTouchedPrice: 7.9549,
    openedAt: "2026-05-30T19:20:52.073Z",
    tp1At: "2026-05-30T19:34:59.999Z",
    closedAt: "2026-05-30T19:35:59.999Z",
    outcome: "Win",
    market: { gainerRank: 3, btcMovePct: -0.05, metadata: { pump: { distanceFromHighPct: 2.05, timeSincePumpMin: 687 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-30-ptbusdt-short-105703-165859",
    tradeId: "mobile-2026-05-30-ptbusdt-short-105703",
    pair: "PTBUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.0008083,
    exit: 0.00077326,
    reason: "Final TP",
    status: "closed",
    tpHit: "TP1, TP2, TP3",
    resultPct: 4.33,
    mfe: 4.42,
    mae: -3.09,
    riskPct: 4.53,
    tp1R: 0.67,
    timeInTrade: "6h 1m",
    timeToTp1: "6h 1m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-30T10:40:19.109Z",
    entryTouchedPrice: 0.0008155,
    openedAt: "2026-05-30T10:57:03.971Z",
    tp1At: "2026-05-30T16:58:59.999Z",
    closedAt: "2026-05-30T16:58:59.999Z",
    outcome: "Win",
    market: { gainerRank: 10, btcMovePct: 0.42, metadata: { pump: { distanceFromHighPct: 1.59, timeSincePumpMin: 20 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-30-algousdt-long-145909-150259",
    tradeId: "mobile-2026-05-30-algousdt-long-145909",
    pair: "ALGOUSDT",
    side: "long",
    scenario: "Pullback long",
    rating: 95,
    entry: 0.1291,
    exit: 0.1291,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 0.30,
    mfe: 0.46,
    mae: -0.77,
    riskPct: 2.18,
    tp1R: 0.14,
    timeInTrade: "3m",
    timeToTp1: "1m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-30T14:47:18.942Z",
    entryTouchedPrice: 0.1279,
    openedAt: "2026-05-30T14:59:09.512Z",
    tp1At: "2026-05-30T15:00:59.999Z",
    closedAt: "2026-05-30T15:02:59.999Z",
    outcome: "Win",
    market: { gainerRank: 13, btcMovePct: -0.20, metadata: { pump: { distanceFromHighPct: 6.38, timeSincePumpMin: 747 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-30-husdt-short-115639-141759",
    tradeId: "mobile-2026-05-30-husdt-short-115639",
    pair: "HUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.32581,
    exit: 0.36246,
    reason: "SL",
    status: "closed",
    tpHit: "nie",
    resultPct: -11.25,
    mfe: 4.43,
    mae: -11.49,
    riskPct: 11.25,
    tp1R: 0.43,
    timeInTrade: "2h 21m",
    timeToTp1: "-",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-30T11:52:11.926Z",
    entryTouchedPrice: 0.3493,
    openedAt: "2026-05-30T11:56:39.027Z",
    tp1At: null,
    closedAt: "2026-05-30T14:17:59.999Z",
    outcome: "Loss",
    market: { gainerRank: 6, btcMovePct: 0.56, metadata: { pump: { distanceFromHighPct: 0.62, timeSincePumpMin: 111 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-30-starusdt-long-124510-133559",
    tradeId: "mobile-2026-05-30-starusdt-long-124510",
    pair: "STARUSDT",
    side: "long",
    scenario: "Pullback long",
    rating: 85,
    entry: 0.17331,
    exit: 0.17331,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 1.21,
    mfe: 1.28,
    mae: -1.11,
    riskPct: 5.27,
    tp1R: 0.23,
    timeInTrade: "50m",
    timeToTp1: "46m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-30T09:50:08.508Z",
    entryTouchedPrice: 0.16943,
    openedAt: "2026-05-30T12:45:10.441Z",
    tp1At: "2026-05-30T13:31:59.999Z",
    closedAt: "2026-05-30T13:35:59.999Z",
    outcome: "Win",
    market: { gainerRank: 7, btcMovePct: 0.19, metadata: { pump: { distanceFromHighPct: 5.97, timeSincePumpMin: 770 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "ok" } } },
  },
  {
    importKey: "2026-05-30-aprusdt-short-081827-091659",
    tradeId: "mobile-2026-05-30-aprusdt-short-081827",
    pair: "APRUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.21134,
    exit: 0.21134,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 0.69,
    mfe: 1.48,
    mae: -1.35,
    riskPct: 4.17,
    tp1R: 0.17,
    timeInTrade: "58m",
    timeToTp1: "54m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-30T07:58:54.453Z",
    entryTouchedPrice: 0.21372,
    openedAt: "2026-05-30T08:18:27.218Z",
    tp1At: "2026-05-30T09:12:59.999Z",
    closedAt: "2026-05-30T09:16:59.999Z",
    outcome: "Win",
    market: { gainerRank: 8, btcMovePct: 0, metadata: { pump: { distanceFromHighPct: 1.25, timeSincePumpMin: 1041 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
];

const MOBILE_JOURNAL_IMPORTS_20260531 = [
  {
    importKey: "2026-05-31-husdt-long-143954-150359",
    tradeId: "mobile-2026-05-31-husdt-long-143954",
    pair: "HUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 83,
    entry: 0.38822,
    exit: 0.38822,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 1.59,
    mfe: 1.94,
    mae: -0.42,
    riskPct: 3.02,
    tp1R: 0.53,
    timeInTrade: "24m",
    timeToTp1: "17m",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-31T13:36:17.720Z",
    entryTouchedPrice: 0.38619,
    openedAt: "2026-05-31T14:39:54.951Z",
    tp1At: "2026-05-31T14:56:59.999Z",
    closedAt: "2026-05-31T15:03:59.999Z",
    outcome: "Win",
    market: { gainerRank: 9, btcMovePct: -0.43, metadata: { pump: { distanceFromHighPct: 9.52, timeSincePumpMin: 1098 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-31-prlusdt-long-133642-140559",
    tradeId: "mobile-2026-05-31-prlusdt-long-133642",
    pair: "PRLUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 75,
    entry: 0.1994,
    exit: 0.1994,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 0.63,
    mfe: 1.20,
    mae: -1.25,
    riskPct: 1.51,
    tp1R: 0.42,
    timeInTrade: "29m",
    timeToTp1: "27m",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-31T13:21:38.211Z",
    entryTouchedPrice: 0.1987,
    openedAt: "2026-05-31T13:36:42.152Z",
    tp1At: "2026-05-31T14:03:59.999Z",
    closedAt: "2026-05-31T14:05:59.999Z",
    outcome: "Win",
    market: { gainerRank: 15, btcMovePct: -0.16, metadata: { pump: { distanceFromHighPct: 16.39, timeSincePumpMin: 648 }, higherTimeframe: { h1: { trend: "down" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-31-memeusdt-short-111434-130759",
    tradeId: "mobile-2026-05-31-memeusdt-short-111434",
    pair: "MEMEUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.0005921,
    exit: 0.00055868,
    reason: "Final TP",
    status: "closed",
    tpHit: "TP1, TP2, TP3",
    resultPct: 5.64,
    mfe: 5.84,
    mae: -2.62,
    riskPct: 3.74,
    tp1R: 0.78,
    timeInTrade: "1h 53m",
    timeToTp1: "48m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-31T10:47:46.388Z",
    entryTouchedPrice: 0.0005994,
    openedAt: "2026-05-31T11:14:34.903Z",
    tp1At: "2026-05-31T12:02:59.999Z",
    closedAt: "2026-05-31T13:07:59.999Z",
    outcome: "Win",
    market: { gainerRank: 10, btcMovePct: 0.12, metadata: { pump: { distanceFromHighPct: 1.85, timeSincePumpMin: 36 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-31-crossusdt-short-091729-123259",
    tradeId: "mobile-2026-05-31-crossusdt-short-091729",
    pair: "CROSSUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.11254,
    exit: 0.10191,
    reason: "Final TP",
    status: "closed",
    tpHit: "TP1, TP2, TP3",
    resultPct: 9.45,
    mfe: 9.49,
    mae: -0.54,
    riskPct: 3.78,
    tp1R: 0.31,
    timeInTrade: "3h 15m",
    timeToTp1: "4m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-31T07:52:33.870Z",
    entryTouchedPrice: 0.11507,
    openedAt: "2026-05-31T09:17:29.356Z",
    tp1At: "2026-05-31T09:21:56.491Z",
    closedAt: "2026-05-31T12:32:59.999Z",
    outcome: "Win",
    market: { gainerRank: 15, btcMovePct: 0.05, metadata: { pump: { distanceFromHighPct: 0.58, timeSincePumpMin: 1202 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-31-tausdt-long-085633-093036",
    tradeId: "mobile-2026-05-31-tausdt-long-085633",
    pair: "TAUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 79,
    entry: 0.08189,
    exit: 0.08189,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 1.48,
    mfe: 3.20,
    mae: -0.61,
    riskPct: 3.55,
    tp1R: 0.42,
    timeInTrade: "34m",
    timeToTp1: "18m",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-31T08:29:29.665Z",
    entryTouchedPrice: 0.08122,
    openedAt: "2026-05-31T08:56:33.742Z",
    tp1At: "2026-05-31T09:14:59.999Z",
    closedAt: "2026-05-31T09:30:36.535Z",
    outcome: "Win",
    market: { gainerRank: 4, btcMovePct: 0, metadata: { pump: { distanceFromHighPct: 15.40, timeSincePumpMin: 838 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-31-vvvusdt-short-090505-090659",
    tradeId: "mobile-2026-05-31-vvvusdt-short-090505",
    pair: "VVVUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 18.178,
    exit: 18.178,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 0.78,
    mfe: 0.80,
    mae: -0.24,
    riskPct: 2.39,
    tp1R: 0.33,
    timeInTrade: "1m",
    timeToTp1: "5m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-31T08:50:00.195Z",
    entryTouchedPrice: 18.359,
    openedAt: "2026-05-31T09:05:05.292Z",
    tp1At: "2026-05-31T09:10:59.999Z",
    closedAt: "2026-05-31T09:06:59.999Z",
    outcome: "Win",
    market: { gainerRank: 11, btcMovePct: -0.06, metadata: { pump: { distanceFromHighPct: 1.45, timeSincePumpMin: 883 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-31-cncoin-short-204832-232059",
    tradeId: "mobile-2026-05-31-cncoin-short-204832",
    pair: "我踏马来了USDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.008878,
    exit: 0.0093202,
    reason: "SL",
    status: "closed",
    tpHit: "nie",
    resultPct: -4.98,
    mfe: 0.34,
    mae: -5.07,
    riskPct: 4.98,
    tp1R: 0.43,
    timeInTrade: "2h 32m",
    timeToTp1: "-",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-30T20:21:36.934Z",
    entryTouchedPrice: 0.008983,
    openedAt: "2026-05-30T20:48:32.316Z",
    tp1At: null,
    closedAt: "2026-05-30T23:20:59.999Z",
    outcome: "Loss",
    market: { gainerRank: 14, btcMovePct: 0.23, metadata: { pump: { distanceFromHighPct: 2.49, timeSincePumpMin: 72 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
];

const MOBILE_JOURNAL_IMPORTS_20260601 = [
  {
    importKey: "2026-06-01-gunusdt-short-151109-074459",
    tradeId: "mobile-2026-06-01-gunusdt-short-151109",
    pair: "GUNUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.00861,
    exit: 0.00741,
    reason: "Final TP",
    status: "closed",
    tpHit: "TP1, TP2, TP3",
    resultPct: 13.94,
    mfe: 13.94,
    mae: -1.05,
    riskPct: 4.95,
    tp1R: 1.60,
    timeInTrade: "16h 33m",
    timeToTp1: "1h 53m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-31T15:00:31.777Z",
    entryTouchedPrice: 0.00878,
    openedAt: "2026-05-31T15:11:09.276Z",
    tp1At: "2026-05-31T17:04:59.999Z",
    closedAt: "2026-06-01T07:44:59.999Z",
    outcome: "Win",
    market: { gainerRank: 6, btcMovePct: -3.06, metadata: { pump: { distanceFromHighPct: 1.26, timeSincePumpMin: 16 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-05-31-playusdt-short-110400-215700",
    tradeId: "mobile-2026-05-31-playusdt-short-110400",
    pair: "PLAYUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.12123,
    exit: 0.13176,
    reason: "SL",
    status: "closed",
    tpHit: "nie",
    resultPct: -8.68,
    mfe: 0,
    mae: -8.68,
    riskPct: 8.68,
    tp1R: null,
    timeInTrade: "10h 53m",
    timeToTp1: "-",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: null,
    entryTouchedPrice: null,
    openedAt: "2026-05-31T11:04:00.000Z",
    tp1At: null,
    closedAt: "2026-05-31T21:57:00.000Z",
    outcome: "Loss",
    market: { metadata: { source: "phone screenshot", pump: {}, higherTimeframe: { h1: {} }, liquidity: {} } },
  },
];

const WORK_JOURNAL_IMPORTS_20260601 = [
  {
    importKey: "2026-06-01-epicusdt-long-133210-133659",
    tradeId: "work-2026-06-01-epicusdt-long-133210",
    pair: "EPICUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 84,
    entry: 0.3135,
    exit: 0.3135,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 0.80,
    mfe: 1.75,
    mae: -0.77,
    riskPct: 4.43,
    tp1R: 0.18,
    timeInTrade: "4m",
    timeToTp1: "2m",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-01T13:19:59.258Z",
    entryTouchedPrice: 0.3057,
    openedAt: "2026-06-01T13:32:10.834Z",
    tp1At: "2026-06-01T13:34:10.864Z",
    closedAt: "2026-06-01T13:36:59.999Z",
    outcome: "Win",
    market: { gainerRank: 6, btcMovePct: 0, metadata: { pump: { distanceFromHighPct: 14.65, timeSincePumpMin: 378 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-06-01-cncoin-long-103610-105859",
    tradeId: "work-2026-06-01-cncoin-long-103610",
    pair: "币安人生USDT",
    side: "long",
    scenario: "Range after pump",
    rating: 63,
    entry: 0.64129,
    exit: 0.62024,
    reason: "SL",
    status: "closed",
    tpHit: "nie",
    resultPct: -3.28,
    mfe: 0.26,
    mae: -4.10,
    riskPct: 3.28,
    tp1R: 0.12,
    timeInTrade: "22m",
    timeToTp1: "-",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-01T10:34:10.616Z",
    entryTouchedPrice: 0.63734,
    openedAt: "2026-06-01T10:36:10.627Z",
    tp1At: null,
    closedAt: "2026-06-01T10:58:59.999Z",
    outcome: "Loss",
    market: { gainerRank: 7, btcMovePct: -0.59, metadata: { pump: { distanceFromHighPct: 3.49, timeSincePumpMin: 38 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-06-01-homeusdt-long-095743-103710",
    tradeId: "work-2026-06-01-homeusdt-long-095743",
    pair: "HOMEUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 89,
    entry: 0.038977,
    exit: 0.038977,
    reason: "SL",
    status: "closed",
    tpHit: "TP2",
    resultPct: 0.78,
    mfe: 1.23,
    mae: -1.39,
    riskPct: 5.47,
    tp1R: 0.34,
    timeInTrade: "39m",
    timeToTp1: "-",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-01T09:07:18.940Z",
    entryTouchedPrice: 0.037741,
    openedAt: "2026-06-01T09:57:43.580Z",
    tp1At: null,
    closedAt: "2026-06-01T10:37:10.623Z",
    outcome: "Win",
    market: { gainerRank: 12, btcMovePct: -0.43, metadata: { pump: { distanceFromHighPct: 22.22, timeSincePumpMin: 1433 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-06-01-xnyusdt-short-055910-081639",
    tradeId: "work-2026-06-01-xnyusdt-short-055910",
    pair: "XNYUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.007071,
    exit: 0.007071,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 0.93,
    mfe: 2.50,
    mae: -2.31,
    riskPct: 4.34,
    tp1R: 0.22,
    timeInTrade: "2h 17m",
    timeToTp1: "1h 35m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-01T05:42:14.778Z",
    entryTouchedPrice: 0.007212,
    openedAt: "2026-06-01T05:59:10.435Z",
    tp1At: "2026-06-01T07:34:10.517Z",
    closedAt: "2026-06-01T08:16:39.553Z",
    outcome: "Win",
    market: { gainerRank: 10, btcMovePct: -0.79, metadata: { pump: { distanceFromHighPct: 1.03, timeSincePumpMin: 233 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-06-01-xlmusdt-short-071038-074742",
    tradeId: "work-2026-06-01-xlmusdt-short-071038",
    pair: "XLMUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.26329,
    exit: 0.25776,
    reason: "Final TP",
    status: "closed",
    tpHit: "TP1, TP2, TP3",
    resultPct: 2.10,
    mfe: 2.17,
    mae: -1.34,
    riskPct: 2.71,
    tp1R: 0.27,
    timeInTrade: "37m",
    timeToTp1: "22m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-01T06:59:42.836Z",
    entryTouchedPrice: 0.26827,
    openedAt: "2026-06-01T07:10:38.836Z",
    tp1At: "2026-06-01T07:33:10.523Z",
    closedAt: "2026-06-01T07:47:42.895Z",
    outcome: "Win",
    market: { gainerRank: 14, btcMovePct: -0.41, metadata: { pump: { distanceFromHighPct: 1.04, timeSincePumpMin: 323 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-06-01-acuusdt-short-072259-073622",
    tradeId: "work-2026-06-01-acuusdt-short-072259",
    pair: "ACUUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.09744,
    exit: 0.093733,
    reason: "Final TP",
    status: "closed",
    tpHit: "TP1, TP2, TP3",
    resultPct: 3.80,
    mfe: 3.86,
    mae: -0.05,
    riskPct: 3.37,
    tp1R: 0.30,
    timeInTrade: "13m",
    timeToTp1: "0m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-01T07:10:10.476Z",
    entryTouchedPrice: 0.09869,
    openedAt: "2026-06-01T07:22:59.983Z",
    tp1At: "2026-06-01T07:23:58.852Z",
    closedAt: "2026-06-01T07:36:22.869Z",
    outcome: "Win",
    market: { gainerRank: 12, btcMovePct: -0.36, metadata: { pump: { distanceFromHighPct: 0.85, timeSincePumpMin: 757 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-06-01-homeusdt-short-061110-065810",
    tradeId: "work-2026-06-01-homeusdt-short-061110",
    pair: "HOMEUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.042223,
    exit: 0.038322,
    reason: "Final TP",
    status: "closed",
    tpHit: "TP1, TP2, TP3",
    resultPct: 9.24,
    mfe: 11.74,
    mae: -0.45,
    riskPct: 7.17,
    tp1R: 0.59,
    timeInTrade: "47m",
    timeToTp1: "20m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-01T05:49:02.788Z",
    entryTouchedPrice: 0.043262,
    openedAt: "2026-06-01T06:11:10.469Z",
    tp1At: "2026-06-01T06:31:10.478Z",
    closedAt: "2026-06-01T06:58:10.500Z",
    outcome: "Win",
    market: { gainerRank: 5, btcMovePct: -0.35, metadata: { pump: { distanceFromHighPct: 3.57, timeSincePumpMin: 1313 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
];

const WORK_JOURNAL_IMPORTS_20260602 = [
  {
    importKey: "2026-06-02-flncusdt-short-142649-143249",
    tradeId: "work-2026-06-02-flncusdt-short-142649",
    pair: "FLNCUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 27.58,
    exit: 28.4517,
    reason: "SL",
    status: "closed",
    tpHit: "nie",
    resultPct: -3.16,
    mfe: 0,
    mae: -3.26,
    riskPct: 3.16,
    tp1R: 1,
    timeInTrade: "6m",
    timeToTp1: "-",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-02T14:21:04.407Z",
    entryTouchedPrice: 28.19,
    openedAt: "2026-06-02T14:26:49.399Z",
    tp1At: null,
    closedAt: "2026-06-02T14:32:49.401Z",
    outcome: "Loss",
    market: { gainerRank: 14, btcMovePct: -1.31, metadata: { pump: { distanceFromHighPct: 1.22, timeSincePumpMin: 20 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-06-02-uselessusdt-short-142404-142625",
    tradeId: "work-2026-06-02-uselessusdt-short-142404",
    pair: "USELESSUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.09818,
    exit: 0.09818,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 0.05,
    mfe: 0.45,
    mae: -1.03,
    riskPct: 5.05,
    tp1R: 0.01,
    timeInTrade: "2m",
    timeToTp1: "2m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-02T14:03:27.574Z",
    entryTouchedPrice: 0.10083,
    openedAt: "2026-06-02T14:24:04.403Z",
    tp1At: "2026-06-02T14:26:17.394Z",
    closedAt: "2026-06-02T14:26:25.404Z",
    outcome: "Win",
    market: { gainerRank: 7, btcMovePct: -1.36, metadata: { pump: { distanceFromHighPct: 0.67, timeSincePumpMin: 395 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-06-02-ususdt-long-130329-130409",
    tradeId: "work-2026-06-02-ususdt-long-130329",
    pair: "USUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 69,
    entry: 0.011457,
    exit: 0.011457,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 0.90,
    mfe: 1.33,
    mae: -0.47,
    riskPct: 4.81,
    tp1R: 0.19,
    timeInTrade: "0m",
    timeToTp1: "0m",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-02T11:58:04.333Z",
    entryTouchedPrice: 0.011295,
    openedAt: "2026-06-02T13:03:29.384Z",
    tp1At: "2026-06-02T13:03:45.378Z",
    closedAt: "2026-06-02T13:04:09.385Z",
    outcome: "Win",
    market: { gainerRank: 1, btcMovePct: -0.69, metadata: { pump: { distanceFromHighPct: 5.42, timeSincePumpMin: 413 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-06-02-esportsusdt-long-111016-115804",
    tradeId: "work-2026-06-02-esportsusdt-long-111016",
    pair: "ESPORTSUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 66,
    entry: 0.053,
    exit: 0.05135,
    reason: "SL",
    status: "closed",
    tpHit: "nie",
    resultPct: -3.11,
    mfe: 0.75,
    mae: -6.60,
    riskPct: 3.11,
    tp1R: 4.92,
    timeInTrade: "47m",
    timeToTp1: "-",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-02T11:01:04.278Z",
    entryTouchedPrice: 0.0525,
    openedAt: "2026-06-02T11:10:16.640Z",
    tp1At: null,
    closedAt: "2026-06-02T11:58:04.335Z",
    outcome: "Loss",
    market: { gainerRank: 1, btcMovePct: 0.03, metadata: { pump: { distanceFromHighPct: 29.99, timeSincePumpMin: 1038 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-06-02-stgusdt-long-063904-084759",
    tradeId: "work-2026-06-02-stgusdt-long-063904",
    pair: "STGUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 78,
    entry: 0.3683,
    exit: 0.3683,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 2.77,
    mfe: 2.77,
    mae: -2.55,
    riskPct: 4.08,
    tp1R: 0.68,
    timeInTrade: "2h 8m",
    timeToTp1: "2h 1m",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-02T06:36:04.187Z",
    entryTouchedPrice: 0.3605,
    openedAt: "2026-06-02T06:39:04.168Z",
    tp1At: "2026-06-02T08:40:59.999Z",
    closedAt: "2026-06-02T08:47:59.999Z",
    outcome: "Win",
    market: { gainerRank: 4, btcMovePct: -5.34, metadata: { pump: { distanceFromHighPct: 18.41, timeSincePumpMin: 633 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-06-02-epicusdt-short-064640-080959",
    tradeId: "work-2026-06-02-epicusdt-short-064640",
    pair: "EPICUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.3645,
    exit: 0.3645,
    reason: "SL",
    status: "closed",
    tpHit: "TP1, TP2",
    resultPct: 6.61,
    mfe: 7.93,
    mae: -1.62,
    riskPct: 5.63,
    tp1R: 1.17,
    timeInTrade: "1h 23m",
    timeToTp1: "51m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-02T06:42:04.172Z",
    entryTouchedPrice: 0.3795,
    openedAt: "2026-06-02T06:46:40.522Z",
    tp1At: "2026-06-02T07:38:04.255Z",
    closedAt: "2026-06-02T08:09:59.999Z",
    outcome: "Win",
    market: { gainerRank: 5, btcMovePct: -1.17, metadata: { pump: { distanceFromHighPct: 4.97, timeSincePumpMin: 1405 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-06-02-skyaiusdt-short-064104-084759",
    tradeId: "work-2026-06-02-skyaiusdt-short-064104",
    pair: "SKYAIUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.30324,
    exit: 0.30324,
    reason: "SL",
    status: "closed",
    tpHit: "TP1, TP2",
    resultPct: 16.35,
    mfe: 18.04,
    mae: -5.39,
    riskPct: 6.18,
    tp1R: 1.03,
    timeInTrade: "2h 6m",
    timeToTp1: "24m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-02T06:27:20.717Z",
    entryTouchedPrice: 0.3102,
    openedAt: "2026-06-02T06:41:04.158Z",
    tp1At: "2026-06-02T07:05:04.541Z",
    closedAt: "2026-06-02T08:47:59.999Z",
    outcome: "Win",
    market: { gainerRank: 2, btcMovePct: -1.17, metadata: { pump: { distanceFromHighPct: 3.37, timeSincePumpMin: 85 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-06-02-homeusdt-short-062833-063404",
    tradeId: "work-2026-06-02-homeusdt-short-062833",
    pair: "HOMEUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.044751,
    exit: 0.044751,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 0.06,
    mfe: 0.30,
    mae: -0.16,
    riskPct: 4.97,
    tp1R: 0.01,
    timeInTrade: "5m",
    timeToTp1: "3m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-01T13:39:11.184Z",
    entryTouchedPrice: 0.045983,
    openedAt: "2026-06-02T06:28:33.234Z",
    tp1At: "2026-06-02T06:32:04.222Z",
    closedAt: "2026-06-02T06:34:04.184Z",
    outcome: "Win",
    market: { gainerRank: 5, btcMovePct: -2.13, metadata: { pump: { distanceFromHighPct: 5.69, timeSincePumpMin: 158 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-06-02-mboxusdt-short-061510-101259",
    tradeId: "work-2026-06-02-mboxusdt-short-061510",
    pair: "MBOXUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.01344,
    exit: 0.01344,
    reason: "SL",
    status: "closed",
    tpHit: "TP1, TP2",
    resultPct: 2.21,
    mfe: 8.93,
    mae: -0.07,
    riskPct: 4.13,
    tp1R: 0.04,
    timeInTrade: "27h 57m",
    timeToTp1: "1m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-01T06:04:10.456Z",
    entryTouchedPrice: 0.01376,
    openedAt: "2026-06-01T06:15:10.449Z",
    tp1At: "2026-06-01T06:16:10.454Z",
    closedAt: "2026-06-02T10:12:59.999Z",
    outcome: "Win",
    market: { gainerRank: 9, btcMovePct: -5.31, metadata: { pump: { distanceFromHighPct: 3.42, timeSincePumpMin: 473 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-06-02-komausdt-short-052312-090559",
    tradeId: "work-2026-06-02-komausdt-short-052312",
    pair: "KOMAUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.007738,
    exit: 0.0066843,
    reason: "Final TP",
    status: "closed",
    tpHit: "TP1, TP2, TP3",
    resultPct: 13.62,
    mfe: 14.05,
    mae: -3.67,
    riskPct: 5.45,
    tp1R: 0.63,
    timeInTrade: "99h 42m",
    timeToTp1: "7h 41m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-05-29T05:07:43.363Z",
    entryTouchedPrice: 0.007886,
    openedAt: "2026-05-29T05:23:12.738Z",
    tp1At: "2026-05-29T13:04:29.540Z",
    closedAt: "2026-06-02T09:05:59.999Z",
    outcome: "Win",
    market: { gainerRank: 3, btcMovePct: -5.57, metadata: { pump: { distanceFromHighPct: 0.78, timeSincePumpMin: 907 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
];

const WORK_JOURNAL_IMPORTS_20260603 = [
  {
    importKey: "2026-06-03-uselessusdt-long-084324-113403",
    tradeId: "work-2026-06-03-uselessusdt-long-084324",
    pair: "USELESSUSDT",
    side: "long",
    scenario: "Pullback long",
    rating: 70,
    entry: 0.09727,
    exit: 0.09727,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 1.36,
    mfe: 1.95,
    mae: -2.79,
    riskPct: 4.16,
    tp1R: 0.33,
    timeInTrade: "2h 50m",
    timeToTp1: "2h 18m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-03T08:42:12.110Z",
    entryTouchedPrice: 0.09623,
    openedAt: "2026-06-03T08:43:24.133Z",
    tp1At: "2026-06-03T11:01:48.952Z",
    closedAt: "2026-06-03T11:34:03.996Z",
    outcome: "Win",
    market: { gainerRank: 9, btcMovePct: 0.09, metadata: { pump: { distanceFromHighPct: 5.26, timeSincePumpMin: 855 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-06-03-enausdt-short-101652-105704",
    tradeId: "work-2026-06-03-enausdt-short-101652",
    pair: "ENAUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.10365,
    exit: 0.10726,
    reason: "SL",
    status: "closed",
    tpHit: "nie",
    resultPct: -3.48,
    mfe: 0.38,
    mae: -3.54,
    riskPct: 3.48,
    tp1R: 0.32,
    timeInTrade: "40m",
    timeToTp1: "-",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-03T10:08:12.181Z",
    entryTouchedPrice: 0.10482,
    openedAt: "2026-06-03T10:16:52.957Z",
    tp1At: null,
    closedAt: "2026-06-03T10:57:04.036Z",
    outcome: "Loss",
    market: { gainerRank: 11, btcMovePct: 0.49, metadata: { pump: { distanceFromHighPct: 1.00, timeSincePumpMin: 972 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-06-03-cohrusdt-long-054203-091604",
    tradeId: "work-2026-06-03-cohrusdt-long-054203",
    pair: "COHRUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 98,
    entry: 450.31,
    exit: 437.1,
    reason: "SL",
    status: "closed",
    tpHit: "nie",
    resultPct: -2.93,
    mfe: 0.58,
    mae: -2.95,
    riskPct: 2.93,
    tp1R: 0.53,
    timeInTrade: "3h 34m",
    timeToTp1: "-",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-03T05:30:03.782Z",
    entryTouchedPrice: 446.93,
    openedAt: "2026-06-03T05:42:03.771Z",
    tp1At: null,
    closedAt: "2026-06-03T09:16:04.149Z",
    outcome: "Loss",
    market: { gainerRank: 7, btcMovePct: -0.32, metadata: { pump: { distanceFromHighPct: 3.34, timeSincePumpMin: 942 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-06-03-zorausdt-short-070948-090304",
    tradeId: "work-2026-06-03-zorausdt-short-070948",
    pair: "ZORAUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.01283,
    exit: 0.01283,
    reason: "SL",
    status: "closed",
    tpHit: "TP1, TP2",
    resultPct: 3.32,
    mfe: 3.43,
    mae: -0.62,
    riskPct: 3.05,
    tp1R: 0.71,
    timeInTrade: "1h 53m",
    timeToTp1: "46m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-03T07:02:01.830Z",
    entryTouchedPrice: 0.01304,
    openedAt: "2026-06-03T07:09:48.843Z",
    tp1At: "2026-06-03T07:56:03.866Z",
    closedAt: "2026-06-03T09:03:04.225Z",
    outcome: "Win",
    market: { gainerRank: 11, btcMovePct: -0.02, metadata: { pump: { distanceFromHighPct: 0.53, timeSincePumpMin: 1057 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-06-03-bbxusdt-long-060603-073804",
    tradeId: "work-2026-06-03-bbxusdt-long-060603",
    pair: "BBXUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 81,
    entry: 11.63,
    exit: 11.3218,
    reason: "SL",
    status: "closed",
    tpHit: "nie",
    resultPct: -2.65,
    mfe: 0,
    mae: -2.67,
    riskPct: 2.65,
    tp1R: 0.29,
    timeInTrade: "1h 32m",
    timeToTp1: "-",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-03T05:28:36.775Z",
    entryTouchedPrice: 11.55,
    openedAt: "2026-06-03T06:06:03.798Z",
    tp1At: null,
    closedAt: "2026-06-03T07:38:04.845Z",
    outcome: "Loss",
    market: { gainerRank: 10, btcMovePct: 1.34, metadata: { pump: { distanceFromHighPct: 4.37, timeSincePumpMin: 457 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-06-03-dexeusdt-long-065724-065812",
    tradeId: "work-2026-06-03-dexeusdt-long-065724",
    pair: "DEXEUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 93,
    entry: 22.255,
    exit: 23.5328,
    reason: "Final TP",
    status: "closed",
    tpHit: "TP1, TP2, TP3",
    resultPct: 5.74,
    mfe: 6.21,
    mae: 0,
    riskPct: 7.02,
    tp1R: 0.15,
    timeInTrade: "0m",
    timeToTp1: "0m",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-03T06:57:16.079Z",
    entryTouchedPrice: 21.733,
    openedAt: "2026-06-03T06:57:24.069Z",
    tp1At: "2026-06-03T06:57:40.062Z",
    closedAt: "2026-06-03T06:58:12.833Z",
    outcome: "Win",
    market: { gainerRank: 10, btcMovePct: -0.26, metadata: { pump: { distanceFromHighPct: 11.22, timeSincePumpMin: 252 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-06-03-xanusdt-short-060403-065724",
    tradeId: "work-2026-06-03-xanusdt-short-060403",
    pair: "XANUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.011854,
    exit: 0.011508,
    reason: "Final TP",
    status: "closed",
    tpHit: "TP1, TP2, TP3",
    resultPct: 2.92,
    mfe: 3.47,
    mae: -3.69,
    riskPct: 4.88,
    tp1R: 0.44,
    timeInTrade: "53m",
    timeToTp1: "53m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-03T05:43:08.776Z",
    entryTouchedPrice: 0.012065,
    openedAt: "2026-06-03T06:04:03.801Z",
    tp1At: "2026-06-03T06:57:08.057Z",
    closedAt: "2026-06-03T06:57:24.082Z",
    outcome: "Win",
    market: { gainerRank: 6, btcMovePct: -0.18, metadata: { pump: { distanceFromHighPct: 1.79, timeSincePumpMin: 477 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
];

const WORK_JOURNAL_IMPORTS_20260604 = [
  {
    importKey: "2026-06-04-memeusdt-short-090201-110959",
    tradeId: "work-2026-06-04-memeusdt-short-090201",
    pair: "MEMEUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.0006017,
    exit: 0.0005751,
    reason: "Final TP",
    status: "closed",
    tpHit: "TP1, TP2, TP3",
    resultPct: 4.42,
    mfe: 4.50,
    mae: 0,
    riskPct: 3.22,
    tp1R: 0.61,
    timeInTrade: "2h 7m",
    timeToTp1: "13m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-04T08:52:01.728Z",
    entryTouchedPrice: 0.0006101,
    openedAt: "2026-06-04T09:02:01.699Z",
    tp1At: "2026-06-04T09:16:00.142Z",
    closedAt: "2026-06-04T11:09:59.999Z",
    outcome: "Win",
    market: { gainerRank: 10, btcMovePct: -2.83, metadata: { pump: { distanceFromHighPct: 1.05, timeSincePumpMin: 224 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-06-04-velvetusdt-short-091136-092424",
    tradeId: "work-2026-06-04-velvetusdt-short-091136",
    pair: "VELVETUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.10861,
    exit: 0.10714,
    reason: "Final TP",
    status: "closed",
    tpHit: "TP1, TP2, TP3",
    resultPct: 1.35,
    mfe: 1.42,
    mae: -0.51,
    riskPct: 1.57,
    tp1R: 0.50,
    timeInTrade: "12m",
    timeToTp1: "12m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-04T06:49:28.830Z",
    entryTouchedPrice: 0.10976,
    openedAt: "2026-06-04T09:11:36.139Z",
    tp1At: "2026-06-04T09:23:44.232Z",
    closedAt: "2026-06-04T09:24:24.188Z",
    outcome: "Win",
    market: { gainerRank: 13, btcMovePct: -1.81, metadata: { pump: { distanceFromHighPct: 0.36, timeSincePumpMin: 864 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "ok" } } },
  },
  {
    importKey: "2026-06-04-lobsterusdt-long-083903-100659",
    tradeId: "work-2026-06-04-lobsterusdt-long-083903",
    pair: "龙虾USDT",
    side: "long",
    scenario: "Range after pump",
    rating: 89,
    entry: 0.008993,
    exit: 0.008993,
    reason: "SL",
    status: "closed",
    tpHit: "TP1, TP2",
    resultPct: 2.73,
    mfe: 4.56,
    mae: -2.35,
    riskPct: 4.17,
    tp1R: 0.21,
    timeInTrade: "1h 27m",
    timeToTp1: "15m",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-04T06:43:22.631Z",
    entryTouchedPrice: 0.008756,
    openedAt: "2026-06-04T08:39:03.106Z",
    tp1At: "2026-06-04T08:55:01.721Z",
    closedAt: "2026-06-04T10:06:59.999Z",
    outcome: "Win",
    market: { gainerRank: 12, btcMovePct: -2.56, metadata: { pump: { distanceFromHighPct: 10.43, timeSincePumpMin: 1209 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-06-04-inusdt-short-064705-104659",
    tradeId: "work-2026-06-04-inusdt-short-064705",
    pair: "INUSDT",
    side: "short",
    scenario: "Top rejection short",
    rating: 100,
    entry: 0.10572,
    exit: 0.094664,
    reason: "Final TP",
    status: "closed",
    tpHit: "TP1, TP2, TP3",
    resultPct: 10.46,
    mfe: 10.71,
    mae: -0.57,
    riskPct: 4.33,
    tp1R: 0.49,
    timeInTrade: "3h 59m",
    timeToTp1: "13m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-04T06:02:08.824Z",
    entryTouchedPrice: 0.10723,
    openedAt: "2026-06-04T06:47:05.000Z",
    tp1At: "2026-06-04T07:00:16.552Z",
    closedAt: "2026-06-04T10:46:59.999Z",
    outcome: "Win",
    market: { gainerRank: 10, btcMovePct: -6.71, metadata: { pump: { distanceFromHighPct: 1.24, timeSincePumpMin: 393 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-06-04-wldusdt-long-060557-071259",
    tradeId: "work-2026-06-04-wldusdt-long-060557",
    pair: "WLDUSDT",
    side: "long",
    scenario: "Range after pump",
    rating: 92,
    entry: 0.5171,
    exit: 0.5171,
    reason: "SL",
    status: "closed",
    tpHit: "TP1",
    resultPct: 1.05,
    mfe: 3.46,
    mae: -0.54,
    riskPct: 5.77,
    tp1R: 0.18,
    timeInTrade: "1h 7m",
    timeToTp1: "11m",
    setupMode: "watch",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-04T06:03:28.825Z",
    entryTouchedPrice: 0.5107,
    openedAt: "2026-06-04T06:05:57.947Z",
    tp1At: "2026-06-04T06:17:57.545Z",
    closedAt: "2026-06-04T07:12:59.999Z",
    outcome: "Win",
    market: { gainerRank: 7, btcMovePct: -0.86, metadata: { pump: { distanceFromHighPct: 9.88, timeSincePumpMin: 182 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
  },
  {
    importKey: "2026-06-03-ususdt-long-102220-235959",
    tradeId: "work-2026-06-03-ususdt-long-102220",
    pair: "USUSDT",
    side: "long",
    scenario: "Pullback long",
    rating: 85,
    entry: 0.013443,
    exit: 0.015671,
    reason: "Final TP",
    status: "closed",
    tpHit: "TP1, TP2, TP3",
    resultPct: 16.57,
    mfe: 19.02,
    mae: -4.47,
    riskPct: 6.63,
    tp1R: 0.71,
    timeInTrade: "13h 37m",
    timeToTp1: "6h 19m",
    setupMode: "trade",
    entryRule: "touch-and-confirm",
    entryTouchedAt: "2026-06-03T10:12:12.951Z",
    entryTouchedPrice: 0.013196,
    openedAt: "2026-06-03T10:22:20.965Z",
    tp1At: "2026-06-03T16:41:59.999Z",
    closedAt: "2026-06-03T23:59:59.999Z",
    outcome: "Win",
    market: { gainerRank: 10, btcMovePct: -5.16, metadata: { pump: { distanceFromHighPct: 19.26, timeSincePumpMin: 626 }, higherTimeframe: { h1: { trend: "up" } }, liquidity: { bucket: "clean" } } },
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
  intuitionStatus: document.getElementById("intuitionStatus"),
  intuitionGainersMeta: document.getElementById("intuitionGainersMeta"),
  intuitionGainerList: document.getElementById("intuitionGainerList"),
  intuitionTradesMeta: document.getElementById("intuitionTradesMeta"),
  intuitionSummary: document.getElementById("intuitionSummary"),
  intuitionWaitingList: document.getElementById("intuitionWaitingList"),
  intuitionActiveList: document.getElementById("intuitionActiveList"),
  intuitionChartFrame: document.getElementById("intuitionChartFrame"),
  intuitionChartMeta: document.getElementById("intuitionChartMeta"),
  intuitionJournalMeta: document.getElementById("intuitionJournalMeta"),
  intuitionJournalSummary: document.getElementById("intuitionJournalSummary"),
  intuitionSideBars: document.getElementById("intuitionSideBars"),
  intuitionExcursionSummary: document.getElementById("intuitionExcursionSummary"),
  intuitionDaysMeta: document.getElementById("intuitionDaysMeta"),
  intuitionDays: document.getElementById("intuitionDays"),
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
  analysisExcursionSummary: document.getElementById("analysisExcursionSummary"),
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
const ENTRY_CONFIRM_PROFILES = {
  default: { type: "zone-confirm", atr: ENTRY_CONFIRM_ATR },
  rangeAfterPump: { type: "range-bounce-confirm", atr: 0.16 },
  rangeAfterPumpNearHigh: { type: "range-bounce-near-high-confirm", atr: 0.24 },
  rangeAfterPumpDeep: { type: "deep-range-strong-bounce-confirm", atr: 0.34 },
  pullback: { type: "pullback-reclaim-confirm", atr: 0.16 },
  pullbackIdeal: { type: "pullback-ideal-reclaim-confirm", atr: 0.10 },
  pullbackNearHigh: { type: "pullback-near-high-confirm", atr: 0.24 },
  momentumContinuation: { type: "momentum-continuation-retest-confirm", atr: 0.14 },
  momentumContinuationHot: { type: "momentum-hot-retest-confirm", atr: 0.22 },
  rangeLowBounce: { type: "range-low-bounce-confirm", atr: 0.10 },
  rejection: { type: "short-rejection-confirm", atr: 0.12 },
  rejectionStrict: { type: "short-rejection-futures-confirm", atr: 0.22 },
  tooHot: { type: "too-hot-rejection-confirm", atr: 0.24 },
};
const WIDE_SETUP_REFINE_PCT = 5;
const MIN_REFINED_MOVE_PCT = 0.8;
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

function minutesSince(from, to = new Date().toISOString()) {
  const start = new Date(from).getTime();
  const end = new Date(to).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end)) return NaN;
  return Math.max(0, (end - start) / 60000);
}

function dedupeWarnings(items = []) {
  return [...new Set(items.filter(Boolean))];
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

function pathPoint(trade, current, resultPct, stamp) {
  return {
    at: stamp,
    price: current,
    pnlPct: Number.isFinite(resultPct) ? resultPct : 0,
    ageMin: Math.max(0, Math.floor(minutesSince(trade.openedAt || stamp, stamp))),
  };
}

function shouldKeepPathPoint(samples, point) {
  const last = samples[samples.length - 1];
  if (!last) return true;
  const lastMs = new Date(last.at).getTime();
  const pointMs = new Date(point.at).getTime();
  const seconds = Number.isFinite(lastMs) && Number.isFinite(pointMs) ? (pointMs - lastMs) / 1000 : 0;
  const pnlDelta = Math.abs((Number(point.pnlPct) || 0) - (Number(last.pnlPct) || 0));
  const crossedZero = Math.sign(Number(point.pnlPct) || 0) !== Math.sign(Number(last.pnlPct) || 0);
  return seconds >= 30 || pnlDelta >= 0.25 || crossedZero;
}

function pointAtOrAbove(points, level) {
  return points.find((point) => Number(point.pnlPct) >= level) || null;
}

function minPnlBefore(points, stamp) {
  if (!stamp) return null;
  const end = new Date(stamp).getTime();
  const before = points.filter((point) => new Date(point.at).getTime() <= end);
  if (!before.length) return null;
  return before.reduce((min, point) => Math.min(min, Number(point.pnlPct) || 0), 0);
}

function derivePathMeta(samples = []) {
  const points = samples.filter((point) => Number.isFinite(Number(point.pnlPct)));
  const positives = points.filter((point) => Number(point.pnlPct) > 0);
  const negatives = points.filter((point) => Number(point.pnlPct) < 0);
  const mfePoint = points.reduce((best, point) => Number(point.pnlPct) > Number(best?.pnlPct ?? -Infinity) ? point : best, null);
  const maePoint = points.reduce((worst, point) => Number(point.pnlPct) < Number(worst?.pnlPct ?? Infinity) ? point : worst, null);
  const firstPositive = positives[0] || null;
  const firstNegative = negatives[0] || null;
  let firstMove = "flat";
  if (firstPositive && firstNegative) firstMove = new Date(firstPositive.at).getTime() <= new Date(firstNegative.at).getTime() ? "positive-first" : "negative-first";
  else if (firstPositive) firstMove = "positive-only";
  else if (firstNegative) firstMove = "negative-only";
  const mfe = Math.max(0, Number(mfePoint?.pnlPct) || 0);
  const absMae = Math.abs(Math.min(0, Number(maePoint?.pnlPct) || 0));
  const plus1 = pointAtOrAbove(points, 1);
  const plus3 = pointAtOrAbove(points, 3);
  const plus5 = pointAtOrAbove(points, 5);
  return {
    sampleCount: points.length,
    firstMove,
    firstPositiveAt: firstPositive?.at || null,
    firstNegativeAt: firstNegative?.at || null,
    mfeAt: mfePoint?.at || null,
    maeAt: maePoint?.at || null,
    mfeBeforeMae: mfePoint && maePoint ? new Date(mfePoint.at).getTime() <= new Date(maePoint.at).getTime() : null,
    mfeMaeRatio: absMae > 0 ? mfe / absMae : (mfe > 0 ? null : 0),
    netExcursionEdge: mfe - absMae,
    excursionEfficiency: mfe + absMae > 0 ? (mfe / (mfe + absMae)) * 100 : 0,
    plus1At: plus1?.at || null,
    plus3At: plus3?.at || null,
    plus5At: plus5?.at || null,
    maeBeforePlus1: minPnlBefore(points, plus1?.at),
    maeBeforePlus3: minPnlBefore(points, plus3?.at),
    maeBeforePlus5: minPnlBefore(points, plus5?.at),
  };
}

function appendPathSample(trade, current, resultPct, stamp) {
  const samples = Array.isArray(trade.pricePath) ? [...trade.pricePath] : [];
  const point = pathPoint(trade, current, resultPct, stamp);
  if (shouldKeepPathPoint(samples, point)) samples.push(point);
  const trimmed = samples.length > 720 ? [samples[0], ...samples.slice(-719)] : samples;
  return {
    pricePath: trimmed,
    pathMeta: derivePathMeta(trimmed),
  };
}

function pathMetaLabel(trade) {
  const meta = trade?.pathMeta || trade?.quality?.pathMeta || {};
  if (!meta.sampleCount) return "bez path";
  const labels = {
    "positive-first": "najprv plus",
    "negative-first": "najprv mínus",
    "positive-only": "iba plus",
    "negative-only": "iba mínus",
    flat: "flat",
  };
  return labels[meta.firstMove] || meta.firstMove || "path";
}

function ratioLabel(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "-";
  return `${number.toFixed(2)}x`;
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
  if (hour >= 5 && hour < 11) return "ráno";
  if (hour >= 11 && hour < 17) return "deň";
  if (hour >= 17 && hour < 23) return "večer";
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
    `  path ${pathMetaLabel(trade)} | eff ${pct(trade.excursionEfficiency ?? trade.pathMeta?.excursionEfficiency ?? trade.quality?.excursionEfficiency, 0)} | MFE/MAE ${ratioLabel(trade.mfeMaeRatio ?? trade.pathMeta?.mfeMaeRatio ?? trade.quality?.mfeMaeRatio)} | edge ${pct(trade.netExcursionEdge ?? trade.pathMeta?.netExcursionEdge ?? trade.quality?.netExcursionEdge)} | MAE before +3 ${pct(trade.maeBeforePlus3 ?? trade.pathMeta?.maeBeforePlus3 ?? trade.quality?.maeBeforePlus3)}`,
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
      wideSetupRefine: `Ak 15m SL alebo TP1 presiahne ${WIDE_SETUP_REFINE_PCT}%, entry/SL/TP1 sa môžu spresniť cez 5m. TP2/TP3 ostávajú z 15m.`,
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
  const allRows = bundle.analysisRowsAll;
  const stats = analysisStats(rows);
  const allStats = analysisStats(allRows);
  const lines = [
    "GAINERS_LAB_FULL_ANALYSIS_EXPORT",
    `date: ${date}`,
    `exportedAt: ${bundle.exportedAt}`,
    `rowsToday: ${rows.length}`,
    `allAnalysisRows: ${bundle.counts.analysisRowsAll}`,
    `journalRows: ${bundle.counts.journalRows}`,
    `manualRows: ${bundle.counts.manualRows}`,
    `daySnapshots: ${bundle.counts.daySnapshotsToday} today / ${bundle.counts.daySnapshotsAll} all`,
    `paper: ${bundle.counts.paperWaiting} waiting / ${bundle.counts.paperActive} active`,
    "",
    "ALL_ANALYSIS_SUMMARY",
    `WR ${fmt(allStats.winrate, 0)}% | wins ${allStats.wins} | losses ${allStats.losses} | avg ${pct(allStats.avg)} | total ${pct(allStats.total)}`,
    `TP1 hit ${fmt(allStats.tp1Rate, 0)}% | avg MFE ${pct(allStats.avgMfe)} | avg MAE ${pct(allStats.avgMae)}`,
    "",
    "TODAY_SUMMARY",
    `WR ${fmt(stats.winrate, 0)}% | wins ${stats.wins} | losses ${stats.losses} | avg ${pct(stats.avg)} | total ${pct(stats.total)}`,
    "",
    "ALL_ANALYSIS_ROWS",
  ];
  if (!allRows.length) {
    lines.push("-");
  } else {
    allRows.forEach((row) => {
      const metadata = row.metadata || {};
      const pump = metadata.pump || {};
      const h1 = metadata.higherTimeframe?.h1 || {};
      const liquidity = metadata.liquidity || {};
      lines.push(
        `${row.date} | ${row.pair} | ${row.side} | ${row.session} | ${row.scenario} | rating ${Number.isFinite(row.rating) ? row.rating : "-"} | ${row.tpHit || "nie"} | ${pct(row.resultPct)} | ${row.status} | ${row.account}`,
        `  entry ${fmt(row.entry)} | exit ${fmt(row.exit)} | MFE ${pct(row.mfe)} | MAE ${pct(row.mae)} | time ${row.timeInTrade || "-"} | TP1 time ${row.timeToTp1 || "-"}`,
        `  risk ${pct(row.riskPct)} | TP1/R ${fmtLogNum(row.tp1R, 2, "R")} | confirm ${row.entryConfirmType || "-"} | noTP1Failure ${row.noTp1Failure ? "yes" : "no"} | mfeBeforeClose ${pct(row.mfeBeforeClose)}`,
        `  path ${pathMetaLabel(row)} | eff ${pct(row.excursionEfficiency, 0)} | MFE/MAE ${ratioLabel(row.mfeMaeRatio)} | edge ${pct(row.netExcursionEdge)} | MAE before +3 ${pct(row.maeBeforePlus3)}`,
        `  opened ${row.openedAt || "-"} (${dateTimeLabel(row.openedAt)}) | TP1 ${row.tp1At || "-"} (${dateTimeLabel(row.tp1At)}) | closed ${row.closedAt || "-"} (${dateTimeLabel(row.closedAt)})`,
        `  metadata: rank #${row.gainerRank || metadata.gainerRank || "-"} | highDist ${fmtLogNum(pump.distanceFromHighPct, 2, "%")} | highDistAtOpen ${pct(row.distanceFromHighAtOpen)} | pumpAge ${durationLabel(pump.timeSincePumpMin)} | 1h ${h1.trend || "-"} | liquidity ${liquidity.bucket || "-"} | BTC move ${pct(row.btcMovePct)}`
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
  downloadText(`gainers-lab-full-analysis-${date}.txt`, buildAnalysisText(date));
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

async function openInterestHist(pair, period = "5m", limit = 12) {
  const rows = await json(`${API}/futures/data/openInterestHist?symbol=${pair}&period=${period}&limit=${limit}`);
  return rows.map((row) => ({
    timestamp: Number(row.timestamp),
    sumOpenInterest: Number(row.sumOpenInterest),
    sumOpenInterestValue: Number(row.sumOpenInterestValue),
  }));
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
  if ((target === "both" || target === "intuition") && ui.intuitionChartFrame && ui.intuitionChartFrame.dataset.url !== url) {
    ui.intuitionChartFrame.dataset.url = url;
    ui.intuitionChartFrame.src = url;
  }
  if ((target === "both" || target === "intuition") && ui.intuitionChartMeta) ui.intuitionChartMeta.textContent = `${pair} | 15m`;
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
  const momentumContinuation = aboveTrend
    && rangePosition >= 68
    && rangePosition <= 96
    && nearHighAtr <= 1.8
    && extensionAtr >= 0.75
    && extensionAtr <= 2.05
    && volumeRatio >= 1.02
    && last.close >= last.open
    && upperWick <= body * 1.35;

  if (clearReject && extensionAtr >= 1.15) return "Top rejection short";
  if (extensionAtr >= 2.2 && nearHighAtr <= 0.8) return "Too hot / top watch";
  if (momentumContinuation) return "Momentum continuation long";
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

  if (scenario === "Momentum continuation long") {
    const momentumAnchor = Math.max(
      nearestBelow([...levels.highs, ma7, vwapNow], priceNow, priceNow - atrNow * 0.45),
      priceNow - atrNow * 0.62
    );
    const entryZone = zoneAround(momentumAnchor, atrNow, 0.18);
    const structuralLow = nearestBelow([ma7, ...levels.lows, vwapNow, ma25, rangeLow], entryZone.from, entryZone.from - atrNow * 0.85);
    const stop = Math.max(0, Math.min(structuralLow - atrNow * 0.18, entryZone.from - atrNow * 0.50));
    const risk = Math.abs(entryZone.from - stop);
    const tp1 = Math.max(priceNow + atrNow * 0.55, entryZone.to + risk * 0.75);
    const tp2 = Math.max(rangeHigh + atrNow * 0.45, entryZone.to + risk * 1.45);
    const tp3 = Math.max(rangeHigh + atrNow * 1.15, entryZone.to + risk * 2.15);
    return finalizePlan({
      side: "long",
      entryZone,
      stop,
      targets: [tp1, tp2, tp3],
      invalidation: "Strata posledného momentum higher-low alebo návrat pod VWAP bez rýchleho reclaimu.",
      note: "Momentum continuation: coin rastie bez hlbšieho pullbacku. Vstup až po mikro reteste/reclaime, nie chase uprostred sviečky.",
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

function planTp1Pct(plan) {
  return absMovePct(plan.entry, plan.targets?.[0]);
}

function pctChange(from, to) {
  const a = Number(from);
  const b = Number(to);
  if (!Number.isFinite(a) || !Number.isFinite(b) || a === 0) return NaN;
  return ((b - a) / a) * 100;
}

function candleTakerBuyPct(candles = []) {
  const volume = candles.reduce((sum, candle) => sum + (Number(candle.volume) || 0), 0);
  const taker = candles.reduce((sum, candle) => sum + (Number(candle.takerBuyVolume) || 0), 0);
  return volume ? (taker / volume) * 100 : NaN;
}

function oiContext(openInterestHistory = []) {
  const rows = openInterestHistory
    .map((row) => ({
      timestamp: Number(row.timestamp),
      value: Number(row.sumOpenInterest),
    }))
    .filter((row) => Number.isFinite(row.value))
    .sort((a, b) => a.timestamp - b.timestamp);
  const first = rows[0]?.value;
  const prev = rows.at(-2)?.value;
  const last = rows.at(-1)?.value;
  return {
    available: rows.length >= 2,
    changePct: pctChange(first, last),
    recentChangePct: pctChange(prev, last),
    samples: rows.length,
  };
}

function shortFuturesConfirmation({ candles, last, atrNow, rangeHigh, volumeRatio, takerBuyPct, openInterestHistory }) {
  const recent = candles.slice(-4);
  const prior = candles.slice(-12, -4);
  const upperWick = last.high - Math.max(last.open, last.close);
  const body = Math.abs(last.close - last.open) || atrNow * 0.05;
  const priceRejection = upperWick > body * 1.15 && last.close < last.high - atrNow * 0.22;
  const failedHighFollowThrough = Number.isFinite(rangeHigh) && last.close < rangeHigh - atrNow * 0.15;
  const recentTakerBuyPct = candleTakerBuyPct(recent);
  const priorTakerBuyPct = candleTakerBuyPct(prior);
  const takerBuyWeakening = Number.isFinite(recentTakerBuyPct) && (
    recentTakerBuyPct <= 50 || (Number.isFinite(priorTakerBuyPct) && recentTakerBuyPct <= priorTakerBuyPct - 4)
  );
  const volumeClimax = volumeRatio >= 1.35 && priceRejection;
  const oi = oiContext(openInterestHistory);
  const oiLongTrap = oi.available && oi.changePct >= 2 && priceRejection;
  const oiCooling = oi.available && oi.recentChangePct <= -0.5 && failedHighFollowThrough;
  const checks = [
    ["priceRejection", priceRejection],
    ["failedHighFollowThrough", failedHighFollowThrough],
    ["takerBuyWeakening", takerBuyWeakening],
    ["volumeClimax", volumeClimax],
    ["oiLongTrap", oiLongTrap],
    ["oiCooling", oiCooling],
  ];
  const passed = checks.filter(([, ok]) => ok).map(([name]) => name);
  return {
    score: passed.length,
    passed,
    oi,
    priceRejection,
    failedHighFollowThrough,
    takerBuyWeakening,
    volumeClimax,
    recentTakerBuyPct,
    priorTakerBuyPct,
    takerBuyPct,
  };
}

function shouldRefineWideSetup(plan) {
  return Number.isFinite(plan?.riskPct)
    && (plan.riskPct > WIDE_SETUP_REFINE_PCT || planTp1Pct(plan) > WIDE_SETUP_REFINE_PCT);
}

function refinedPlanMoveIsUsable(plan, originalPlan) {
  const riskPct = Number(plan.riskPct);
  const tp1Pct = planTp1Pct(plan);
  const originalRiskPct = Number(originalPlan.riskPct);
  const originalTp1Pct = planTp1Pct(originalPlan);
  return Number.isFinite(riskPct)
    && Number.isFinite(tp1Pct)
    && riskPct >= MIN_REFINED_MOVE_PCT
    && tp1Pct >= MIN_REFINED_MOVE_PCT
    && riskPct < originalRiskPct
    && tp1Pct < originalTp1Pct;
}

function refineWidePlanWith5m(originalPlan, scenario, context15m, candles5m = []) {
  if (!shouldRefineWideSetup(originalPlan) || !candles5m.length) return originalPlan;
  const closes5m = candles5m.map((candle) => candle.close);
  const last5m = candles5m.at(-1);
  const atr5m = atr(candles5m);
  if (!last5m || !Number.isFinite(atr5m) || atr5m <= 0) return originalPlan;
  const recent5m = candles5m.slice(-72);
  const rangeHigh5m = Math.max(...recent5m.map((candle) => candle.high));
  const rangeLow5m = Math.min(...recent5m.map((candle) => candle.low));
  const ma7_5m = sma(closes5m, 7);
  const ma25_5m = sma(closes5m, 25);
  const vwap5m = vwap(candles5m);
  const levels5m = swingLevels(candles5m);
  const priceNow = last5m.close;
  let refined = null;

  if (originalPlan.side === "short") {
    const entryAnchor = bestZoneAnchor([rangeHigh5m, ...levels5m.highs, ma7_5m], priceNow, atr5m, "short");
    const entryZone = zoneAround(entryAnchor, atr5m, 0.28);
    const swingStop = nearestAbove([rangeHigh5m, ...levels5m.highs], entryZone.to, entryZone.to + atr5m * 0.9);
    const stop = Math.max(swingStop + atr5m * 0.16, entryZone.to + atr5m * 0.55);
    const tp1 = nearestBelow([vwap5m, ma25_5m, rangeLow5m, ...levels5m.lows], entryZone.from, entryZone.from - atr5m * 1.1);
    refined = finalizePlan({
      ...originalPlan,
      entryZone,
      stop,
      targets: [tp1, originalPlan.targets[1], originalPlan.targets[2]],
      note: `${originalPlan.note} Entry/SL/TP1 sú zúžené cez 5m refine, TP2/TP3 ostávajú z 15m kontextu.`,
      refinement: {
        mode: "5m-wide-setup",
        source: "5m",
        reason: `15m SL/TP1 boli nad ${WIDE_SETUP_REFINE_PCT}%.`,
        originalRiskPct: originalPlan.riskPct,
        originalTp1Pct: planTp1Pct(originalPlan),
      },
    });
  } else {
    const preference = scenario === "Range low bounce" || scenario === "Range after pump" ? "deep" : (scenario === "Breakout retest" || scenario === "Momentum continuation long") ? "breakout" : "near";
    const anchorPool = scenario === "Range low bounce"
      ? [rangeLow5m, ...levels5m.lows, ma25_5m, vwap5m]
      : (scenario === "Breakout retest" || scenario === "Momentum continuation long")
        ? [rangeHigh5m, ...levels5m.highs, vwap5m, ma7_5m]
        : scenario === "Range after pump"
          ? [rangeLow5m, ...levels5m.lows, vwap5m, ma25_5m, ma7_5m]
          : [vwap5m, ma25_5m, ma7_5m, ...levels5m.lows, rangeLow5m];
    const entryAnchor = bestZoneAnchor(anchorPool, priceNow, atr5m, "long", preference);
    const entryZone = zoneAround(entryAnchor, atr5m, (scenario === "Breakout retest" || scenario === "Momentum continuation long") ? 0.24 : 0.32);
    const structuralLow = nearestBelow([rangeLow5m, ...levels5m.lows, vwap5m, ma25_5m], entryZone.from, entryZone.from - atr5m);
    const stop = Math.max(0, Math.min(structuralLow - atr5m * 0.25, entryZone.from - atr5m * 0.60));
    const tp1 = nearestAbove([rangeHigh5m, ...levels5m.highs, vwap5m, ma25_5m], entryZone.to, entryZone.to + atr5m * 1.1);
    refined = finalizePlan({
      ...originalPlan,
      entryZone,
      stop,
      targets: [tp1, originalPlan.targets[1], originalPlan.targets[2]],
      note: `${originalPlan.note} Entry/SL/TP1 sú zúžené cez 5m refine, TP2/TP3 ostávajú z 15m kontextu.`,
      refinement: {
        mode: "5m-wide-setup",
        source: "5m",
        reason: `15m SL/TP1 boli nad ${WIDE_SETUP_REFINE_PCT}%.`,
        originalRiskPct: originalPlan.riskPct,
        originalTp1Pct: planTp1Pct(originalPlan),
      },
    });
  }

  if (!refinedPlanMoveIsUsable(refined, originalPlan)) return {
    ...originalPlan,
    refinement: {
      mode: "15m-kept",
      source: "15m",
      reason: "5m refine by bol príliš úzky alebo nezlepšil risk/TP1.",
      originalRiskPct: originalPlan.riskPct,
      originalTp1Pct: planTp1Pct(originalPlan),
    },
  };

  return {
    ...refined,
    refinement: {
      ...refined.refinement,
      refinedRiskPct: refined.riskPct,
      refinedTp1Pct: planTp1Pct(refined),
    },
  };
}

function normalizedTradeTargets(trade, entry = trade.entry) {
  const stop = Number(trade.stop);
  const rawTargets = (trade.targets || [])
    .map((target) => Number(target.price ?? target))
    .filter(Number.isFinite)
    .filter((target) => trade.side === "long" ? target > entry : target < entry)
    .slice(0, 3);
  const fallbackRisk = Math.max(Math.abs(entry - stop), entry * 0.012);
  while (rawTargets.length < 3) {
    const multiple = 1 + rawTargets.length * 0.75;
    rawTargets.push(trade.side === "long" ? entry + fallbackRisk * multiple : Math.max(0, entry - fallbackRisk * multiple));
  }
  return rawTargets.map((price, index) => ({ label: `TP${index + 1}`, price, hit: false }));
}

function normalizeTradeAtOpen(trade, entry) {
  const nextTrade = { ...trade, entry };
  const stop = Number(nextTrade.stop);
  const invalidStop = nextTrade.side === "long" ? stop >= entry : stop <= entry;
  if (!Number.isFinite(stop) || invalidStop) {
    const fallbackRisk = Math.max(entry * 0.018, Number(nextTrade.market?.atr) || 0);
    nextTrade.stop = nextTrade.side === "long" ? Math.max(0, entry - fallbackRisk) : entry + fallbackRisk;
    nextTrade.originalStop = nextTrade.originalStop ?? nextTrade.stop;
  }
  nextTrade.targets = normalizedTradeTargets(nextTrade, entry);
  nextTrade.breakEven = false;
  nextTrade.tp1At = null;
  nextTrade.timeToTp1 = null;
  nextTrade.riskPct = absMovePct(entry, nextTrade.stop);
  nextTrade.tp1R = rewardRiskRatio(entry, nextTrade.targets[0]?.price, nextTrade.stop, nextTrade.side);
  nextTrade.distanceFromHighAtOpen = distanceFromHighAtPrice(nextTrade, entry);
  const confirmProfile = entryConfirmProfile(nextTrade, entry);
  nextTrade.entryConfirmType = nextTrade.entryConfirmType || confirmProfile.type;
  nextTrade.entryConfirmAtr = nextTrade.entryConfirmAtr || confirmProfile.atr;
  nextTrade.entryConfirmedAt = nextTrade.entryConfirmedAt || new Date().toISOString();
  nextTrade.entryConfirmedPrice = nextTrade.entryConfirmedPrice ?? entry;
  if (nextTrade.side === "short") {
    nextTrade.shortConfirmAfterTouch = Boolean(nextTrade.entryTouchedAt);
    nextTrade.shortEntryBelowHighPct = Number.isFinite(nextTrade.shortEntryBelowHighPct)
      ? nextTrade.shortEntryBelowHighPct
      : nextTrade.distanceFromHighAtOpen;
  }
  nextTrade.noTp1Failure = false;
  nextTrade.mfeBeforeClose = 0;
  nextTrade.quality = {
    ...(nextTrade.quality || {}),
    distanceFromHighAtOpen: nextTrade.distanceFromHighAtOpen,
    tp1R: nextTrade.tp1R,
    tp1Quality: tp1QualityBucket(nextTrade.tp1R),
    entryConfirmType: nextTrade.entryConfirmType,
    entryConfirmAtr: nextTrade.entryConfirmAtr,
    entryConfirmedAt: nextTrade.entryConfirmedAt,
    entryConfirmedPrice: nextTrade.entryConfirmedPrice,
    shortRejectionTouched: nextTrade.side === "short" ? Boolean(nextTrade.shortRejectionTouched) : null,
    shortEntryBelowHighPct: nextTrade.side === "short" ? nextTrade.shortEntryBelowHighPct : null,
    shortConfirmAfterTouch: nextTrade.side === "short" ? Boolean(nextTrade.shortConfirmAfterTouch) : null,
    noTp1Failure: false,
    mfeBeforeClose: 0,
  };
  return nextTrade;
}

function distanceFromHighAtPrice(trade, price) {
  const high = Number(trade.market?.rangeHigh || trade.market?.metadata?.pump?.rangeHigh);
  if (Number.isFinite(high) && high > 0 && Number.isFinite(price)) return ((high - price) / high) * 100;
  const fallback = Number(trade.market?.metadata?.pump?.distanceFromHighPct);
  return Number.isFinite(fallback) ? fallback : NaN;
}

function entryConfirmProfile(trade, current = null) {
  const scenario = trade?.scenario || "";
  const highDist = Number.isFinite(current)
    ? distanceFromHighAtPrice(trade, current)
    : Number(trade?.distanceFromHighAtOpen ?? trade?.market?.metadata?.pump?.distanceFromHighPct);
  if (scenario === "Range after pump") {
    if (Number.isFinite(highDist) && highDist < 2) return ENTRY_CONFIRM_PROFILES.rangeAfterPumpNearHigh;
    if (Number.isFinite(highDist) && highDist > 12) return ENTRY_CONFIRM_PROFILES.rangeAfterPumpDeep;
    return ENTRY_CONFIRM_PROFILES.rangeAfterPump;
  }
  if (scenario === "Pullback long") {
    if (Number.isFinite(highDist) && highDist >= 6 && highDist < 12) return ENTRY_CONFIRM_PROFILES.pullbackIdeal;
    if (Number.isFinite(highDist) && highDist < 2) return ENTRY_CONFIRM_PROFILES.pullbackNearHigh;
    return ENTRY_CONFIRM_PROFILES.pullback;
  }
  if (scenario === "Momentum continuation long") {
    if (Number.isFinite(highDist) && highDist < 1.5) return ENTRY_CONFIRM_PROFILES.momentumContinuationHot;
    return ENTRY_CONFIRM_PROFILES.momentumContinuation;
  }
  if (scenario === "Range low bounce") return ENTRY_CONFIRM_PROFILES.rangeLowBounce;
  if (scenario === "Too hot / top watch") return ENTRY_CONFIRM_PROFILES.tooHot;
  if (scenario === "Top rejection short") {
    const futuresShort = trade?.futuresShortConfirmation || trade?.market?.metadata?.futuresShortConfirmation;
    const riskPct = Number(trade?.riskPct ?? trade?.planSnapshot?.riskPct);
    if ((Number.isFinite(riskPct) && riskPct >= 6) || (Number(futuresShort?.score) || 0) < 3) {
      return ENTRY_CONFIRM_PROFILES.rejectionStrict;
    }
    return ENTRY_CONFIRM_PROFILES.rejection;
  }
  return ENTRY_CONFIRM_PROFILES.default;
}

function tp1QualityBucket(tp1R) {
  if (!Number.isFinite(tp1R)) return "unknown";
  if (tp1R < 0.25) return "very-weak";
  if (tp1R < 0.4) return "weak";
  if (tp1R < 0.8) return "ok";
  return "good";
}

function scenarioBaseScore(scenario) {
  if (scenario === "Top rejection short") return 72;
  if (scenario === "Range after pump") return 58;
  if (scenario === "Momentum continuation long") return 54;
  if (scenario === "Range low bounce") return 62;
  if (scenario === "Pullback long") return 46;
  if (scenario === "Breakout retest") return 42;
  if (scenario === "Too hot / top watch") return 16;
  return 34;
}

function qualityRating({ scenario, plan, volumeRatio, extensionAtr, distanceToZoneAtr, atrPct, rangePosition, reactionScore, setupMode, warnings, gainerRank, pump, session, futuresShort }) {
  let score = scenarioBaseScore(scenario);
  const tp1R = rewardRiskRatio(plan.entry, plan.targets[0], plan.stop, plan.side);
  const distanceFromHighPct = Number(pump?.distanceFromHighPct);
  score += clamp((1.0 - distanceToZoneAtr) * 9, -12, 12);
  score += clamp((volumeRatio - 0.85) * 10, -10, 14);
  score += clamp((MAX_STRUCTURAL_RISK_PCT - plan.riskPct) * 2.6, -20, 14);
  score += reactionScore;

  if (scenario === "Range after pump") {
    score += rangePosition <= 42 ? 11 : rangePosition >= 65 ? -18 : -7;
    score += extensionAtr <= 1.6 ? 4 : -8;
    if (Number.isFinite(distanceFromHighPct)) {
      if (distanceFromHighPct >= 2 && distanceFromHighPct < 12) score += 9;
      else if (distanceFromHighPct > 12) score -= 12;
      else if (distanceFromHighPct < 2) score -= 8;
    }
  } else if (scenario === "Pullback long") {
    score += rangePosition >= 35 && rangePosition <= 75 ? 8 : -12;
    score += extensionAtr <= 1.25 ? 6 : -10;
    if (Number.isFinite(distanceFromHighPct)) {
      if (distanceFromHighPct >= 6 && distanceFromHighPct < 12) score += 10;
      else if (distanceFromHighPct < 2) score -= 12;
      else if (distanceFromHighPct < 6) score -= 5;
    }
  } else if (scenario === "Momentum continuation long") {
    score += rangePosition >= 68 && rangePosition <= 92 ? 9 : -10;
    score += extensionAtr >= 0.75 && extensionAtr <= 1.75 ? 8 : -8;
    score += volumeRatio >= 1.15 ? 8 : 0;
    if (Number.isFinite(distanceFromHighPct)) {
      if (distanceFromHighPct >= 1.5 && distanceFromHighPct <= 6) score += 9;
      else if (distanceFromHighPct < 0.8) score -= 14;
      else if (distanceFromHighPct > 9) score -= 8;
    }
  } else if (scenario === "Top rejection short") {
    score += extensionAtr >= 1.15 ? 10 : -10;
    score += rangePosition >= 68 ? 8 : -6;
    score += clamp(((Number(futuresShort?.score) || 0) - 2) * 8, -16, 18);
    if (session === "večer") score -= 10;
    if (Number.isFinite(gainerRank) && gainerRank <= 3) score += 8;
    if (Number.isFinite(gainerRank) && gainerRank >= 11) score -= 14;
  } else if (scenario === "Too hot / top watch") {
    score += extensionAtr >= 2.2 ? -10 : -22;
  } else if (scenario === "Breakout retest") {
    score -= 8;
  }

  if (Number.isFinite(distanceFromHighPct)) {
    if (distanceFromHighPct < 1) score -= 12;
    else if (distanceFromHighPct >= 3 && distanceFromHighPct <= 7) score += 8;
    else if (distanceFromHighPct > 12) score -= 4;
  }

  if (Number.isFinite(tp1R)) {
    if (tp1R < 0.25) score -= 22;
    else if (scenario === "Range after pump" && tp1R < 0.5) score -= 16;
    else if (tp1R < 0.4) score -= 12;
    else if (tp1R >= 0.5 && tp1R < 0.75) score += 8;
    else if (tp1R >= 0.8 && tp1R <= 1.6) score += 4;
  }

  if (Number.isFinite(gainerRank)) {
    if (gainerRank <= 3) {
      score += scenario === "Top rejection short" ? 6 : 3;
      if (Number.isFinite(distanceFromHighPct) && distanceFromHighPct < 1) score -= 5;
    }
    else if (gainerRank >= 4 && gainerRank <= 10) score += 4;
    else if (gainerRank >= 11) score -= 9;
  }

  if (atrPct >= 0.8 && atrPct <= 8) score += 8;
  if (atrPct > 12) score -= 14;
  if (setupMode === "watch") score -= scenario === "Too hot / top watch" ? 14 : 6;
  score -= Math.min((warnings || []).length * 6, 18);
  return clamp(Math.round(score), 0, 100);
}

function analyzeGainer(ticker, candles, book = null, candles1h = [], gainerRank = null, candles5m = [], openInterestHistory = []) {
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
  const basePlan = scenarioPlan({ last, atrNow, vwapNow, ma7, ma25, ma99, rangeHigh, rangeLow, levels }, scenario);
  const plan = refineWidePlanWith5m(basePlan, scenario, { last, atrNow, vwapNow, ma7, ma25, ma99, rangeHigh, rangeLow, levels }, candles5m);
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
  if (plan.refinement?.mode === "5m-wide-setup") warnings.push("Wide setup: entry/SL/TP1 sú spresnené cez 5m.");
  if (plan.refinement?.mode === "15m-kept") warnings.push("Wide setup: 5m refine bol príliš úzky, ponechaný 15m plán.");
  if (Number.isFinite(pump.distanceFromHighPct) && pump.distanceFromHighPct < 1) warnings.push("Setup je veľmi blízko high, pozor na prehriaty vstup.");
  const tp1R = rewardRiskRatio(plan.entry, plan.targets[0], plan.stop, plan.side);
  if (Number.isFinite(tp1R) && tp1R < 0.25) warnings.push("TP1/R je extrémne nízke, výsledok bude skôr BE ochrana.");
  else if (Number.isFinite(tp1R) && tp1R < 0.4) warnings.push("TP1 je nízke voči risku.");
  if (scenario === "Range after pump" && Number.isFinite(tp1R) && tp1R >= 0.25 && tp1R < 0.5) warnings.push("Range after pump má slabý TP1/R bucket 0.25-0.49R.");
  if (scenario === "Range after pump" && rangePosition > 62) warnings.push("Range after pump je vyššie v range, čakať hlbšiu zónu alebo reakciu.");
  if (scenario === "Range after pump" && Number.isFinite(pump.distanceFromHighPct) && pump.distanceFromHighPct > 12) warnings.push("Range after pump je hlboko od high, potrebuje silnejší bounce confirm.");
  if (scenario === "Range after pump" && Number.isFinite(pump.distanceFromHighPct) && pump.distanceFromHighPct < 2) warnings.push("Range after pump je príliš blízko high, nebrať bez potvrdenej reakcie.");
  if (scenario === "Pullback long" && volumeRatio < 0.8) warnings.push("Long pullback má slabší volume kontext.");
  if (scenario === "Pullback long" && rangePosition > 80) warnings.push("Pullback long je príliš vysoko v range.");
  if (scenario === "Pullback long" && Number.isFinite(pump.distanceFromHighPct) && pump.distanceFromHighPct < 2) warnings.push("Pullback long je príliš blízko high, čakať reclaim po pullbacku.");
  if (scenario === "Momentum continuation long" && volumeRatio < 1.05) warnings.push("Momentum continuation potrebuje silnejší aktuálny volume.");
  if (scenario === "Momentum continuation long" && extensionAtr > 2.05) warnings.push("Momentum continuation je už príliš natiahnutý, nechaseovať bez retestu.");
  if (scenario === "Momentum continuation long" && Number.isFinite(pump.distanceFromHighPct) && pump.distanceFromHighPct < 0.8) warnings.push("Momentum je extrémne blízko high, čakať mikro retest/reclaim.");
  if (scenario === "Momentum continuation long" && rangePosition > 96) warnings.push("Momentum continuation je úplne na hornej hrane range.");
  if ((scenario === "Top rejection short" || scenario === "Too hot / top watch") && extensionAtr < 1.1) warnings.push("Short rejection nemá dostatočné natiahnutie.");
  const currentSession = sessionLabel();
  const futuresShort = scenario === "Top rejection short"
    ? shortFuturesConfirmation({ candles, last, atrNow, rangeHigh, volumeRatio, takerBuyPct, openInterestHistory })
    : null;
  if (scenario === "Top rejection short" && Number.isFinite(tp1R) && tp1R > 1) warnings.push("Top rejection short má TP1 ďaleko voči risku, dáta favorizujú rýchlejšie zabezpečenie.");
  if (scenario === "Top rejection short" && currentSession === "večer") warnings.push("Večerný Top rejection short má slabšie výsledky v dátach.");
  if (scenario === "Top rejection short" && Number.isFinite(gainerRank) && gainerRank >= 11) warnings.push("Top rejection short mimo TOP 10 mal slabšie výsledky.");
  if (scenario === "Top rejection short" && plan.riskPct >= 8) warnings.push("Top rejection short má risk nad 8%, podľa dát len watch.");
  if (scenario === "Top rejection short" && futuresShort?.score < 2) warnings.push("Top rejection short nemá dosť futures potvrdení: chýba OI/taker/volume odmietnutie.");
  if (scenario === "Top rejection short" && plan.riskPct >= 6 && futuresShort?.score < 3) warnings.push("Široký Top rejection short potrebuje aspoň 3 futures potvrdenia.");
  if (scenario === "Top rejection short" && ["deň", "večer"].includes(currentSession) && futuresShort?.score < 3) warnings.push("Denný/večerný Top rejection short potrebuje silnejšie futures potvrdenie.");
  if (scenario === "Too hot / top watch") warnings.push("Too hot je len watch, nie high-confidence obchod bez potvrdeného rejectionu.");
  const setupMode = scenario === "Too hot / top watch" || scenario === "Range after pump" ? "watch" : "trade";
  const tradable = setupMode === "trade" && warnings.length === 0;
  const state = `${setupMode === "watch" ? "paper watch" : "paper trade"} | ${distanceToZoneAtr <= 0.45 ? "ready zone" : "forming"}`;
  const atrPct = atrNow ? (atrNow / last.close) * 100 : NaN;
  const rating = qualityRating({ scenario, plan, volumeRatio, extensionAtr, distanceToZoneAtr, atrPct, rangePosition, reactionScore, setupMode, warnings, gainerRank, pump, session: currentSession, futuresShort });
  const entryProfile = entryConfirmProfile({ scenario, side: plan.side, riskPct: plan.riskPct, futuresShortConfirmation: futuresShort, market: { metadata: { pump, futuresShortConfirmation: futuresShort } } });

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
    futuresShortConfirmation: futuresShort,
    extensionAtr,
    scenario,
    state,
    plan,
    rangePosition,
    distanceToZoneAtr,
    metadata: {
      gainerRank,
      pump,
      quality: {
        distanceFromHighAtOpen: null,
        tp1R,
        tp1Quality: tp1QualityBucket(tp1R),
        noTp1Failure: null,
        mfeBeforeClose: null,
      },
      higherTimeframe,
      liquidity,
      futuresShortConfirmation: futuresShort,
      decision: {
        setupMode,
        session: currentSession,
        rangePosition,
        distanceToZoneAtr,
        reactionScore,
        refinement: plan.refinement || null,
        entryRule: "touch-and-confirm",
        entryConfirmType: entryProfile.type,
        entryConfirmAtr: entryProfile.atr,
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
  if (p.refinement?.mode === "5m-wide-setup") return `${p.note} Wide setup je spresnený cez 5m pre entry/SL/TP1.`;
  if (item.setupMode === "watch") return `${p.note} Paper sa pustí kvôli dátam, ale setup je označený ako watch.`;
  if (item.scenario === "Momentum continuation long") return "Coin rastie bez hlbšieho pullbacku. Nechaseovať sviečku, čakať mikro retest alebo reclaim momentum zóny.";
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
    <span>Plan TF <b>${selected.plan.refinement?.mode === "5m-wide-setup" ? "15m + 5m refine" : "15m"}</b></span>
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
            <span>Plan TF <b>${p.refinement?.mode === "5m-wide-setup" ? "15m + 5m refine" : "15m"}</b></span>
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
    const analyses = await Promise.allSettled(top.map(async (ticker) => {
      const [candles15m, candles1h, candles5m, oiHistory] = await Promise.all([
        klines(ticker.symbol, "15m"),
        klines(ticker.symbol, "1h", 48),
        klines(ticker.symbol, "5m", 180),
        openInterestHist(ticker.symbol, "5m", 12).catch(() => []),
      ]);
      return analyzeGainer(ticker, candles15m, books[ticker.symbol], candles1h, ticker.gainerRank, candles5m, oiHistory);
    }));
    gainers = analyses
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value)
      .sort((a, b) => b.rating - a.rating || b.dayChange - a.dayChange);
    const preferred = localStorage.getItem(STORE.selected);
    selected = gainers.find((item) => item.pair === preferred) || gainers[0] || null;
    renderGainers();
    renderIntuition();
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

function intuitionState() {
  const state = storeGet(STORE.intuition, { waiting: [], active: [], closed: [] });
  return {
    waiting: Array.isArray(state.waiting) ? state.waiting : [],
    active: Array.isArray(state.active) ? state.active : [],
    closed: Array.isArray(state.closed) ? state.closed : [],
  };
}

function saveIntuition(state) {
  storeSet(STORE.intuition, {
    waiting: Array.isArray(state.waiting) ? state.waiting : [],
    active: Array.isArray(state.active) ? state.active : [],
    closed: Array.isArray(state.closed) ? state.closed : [],
  });
}

function intuitionMovePct(trade, current) {
  return movePct(Number(trade.entry), Number(current), trade.side);
}

function normalizeIntuitionTrigger(type, value, live) {
  const triggerType = type || "market";
  const triggerPrice = Number(value);
  if (triggerType === "market" || !Number.isFinite(triggerPrice) || triggerPrice <= 0) {
    return { triggerType: "market", triggerPrice: Number(live) || null };
  }
  return { triggerType, triggerPrice };
}

function intuitionTriggerHit(trade, current) {
  if (trade.triggerType === "above") return current >= trade.triggerPrice;
  if (trade.triggerType === "below") return current <= trade.triggerPrice;
  return true;
}

function intuitionMarketSnapshot(gainer, stamp) {
  return {
    capturedAt: stamp,
    rank: gainer?.gainerRank || gainer?.rank || null,
    rating: gainer?.rating ?? null,
    dayChange: gainer?.dayChange ?? null,
    quoteVolume: gainer?.quoteVolume ?? null,
    tradeCount: gainer?.tradeCount ?? null,
    spreadPct: gainer?.spreadPct ?? null,
    takerBuyPct: gainer?.takerBuyPct ?? null,
    atrPct: gainer?.atrPct ?? null,
    scenario: gainer?.scenario || null,
  };
}

function createIntuitionTrade(gainer, side, triggerType, triggerPrice) {
  const stamp = new Date().toISOString();
  const live = Number(gainer.price);
  const trigger = normalizeIntuitionTrigger(triggerType, triggerPrice, live);
  const opened = trigger.triggerType === "market";
  const initialPath = opened ? appendPathSample({ openedAt: stamp, pricePath: [] }, live, 0, stamp) : { pricePath: [], pathMeta: derivePathMeta([]) };
  return {
    id: uid("intuition"),
    source: "intuition-web",
    pair: gainer.pair,
    side,
    account: "Intuition",
    scenario: "Intuition",
    status: opened ? "active" : "waiting",
    createdAt: stamp,
    createdSession: sessionLabel(stamp),
    openedAt: opened ? stamp : null,
    openedSession: opened ? sessionLabel(stamp) : null,
    closedAt: null,
    entry: opened ? live : null,
    exit: null,
    live,
    resultPct: opened ? 0 : null,
    mfe: 0,
    mae: 0,
    timeInTrade: opened ? "0m" : "-",
    triggerType: trigger.triggerType,
    triggerPrice: trigger.triggerPrice,
    market: intuitionMarketSnapshot(gainer, stamp),
    pricePath: initialPath.pricePath,
    pathMeta: initialPath.pathMeta,
    lastCheckedAt: stamp,
  };
}

function updateIntuitionTracking(trade, current, stamp = new Date().toISOString()) {
  const resultPct = intuitionMovePct(trade, current);
  if (!Number.isFinite(resultPct)) return trade;
  const path = appendPathSample(trade, current, resultPct, stamp);
  return {
    ...trade,
    live: current,
    resultPct,
    mfe: Math.max(Number(trade.mfe) || 0, resultPct),
    mae: Math.min(Number(trade.mae) || 0, resultPct),
    timeInTrade: timeAgo(trade.openedAt, stamp),
    pricePath: path.pricePath,
    pathMeta: path.pathMeta,
    lastCheckedAt: stamp,
  };
}

function startIntuitionFromGainer(pair, side, triggerType, triggerPrice) {
  const gainer = gainers.find((item) => item.pair === pair);
  if (!gainer) return;
  const trade = createIntuitionTrade(gainer, side, triggerType, triggerPrice);
  const state = intuitionState();
  const next = trade.status === "active"
    ? { ...state, active: [trade, ...state.active] }
    : { ...state, waiting: [trade, ...state.waiting] };
  saveIntuition(next);
  syncChart(pair, "intuition");
  renderIntuition();
}

function closeIntuitionTrade(id, reason = "manual-close") {
  const state = intuitionState();
  const stamp = new Date().toISOString();
  const trade = state.active.find((item) => item.id === id);
  if (!trade) return null;
  const current = Number(trade.live) || Number(trade.entry);
  const tracked = updateIntuitionTracking(trade, current, stamp);
  const closed = {
    ...tracked,
    status: "closed",
    exit: current,
    closedAt: stamp,
    closedSession: sessionLabel(stamp),
    closeReason: reason,
  };
  saveIntuition({
    waiting: state.waiting,
    active: state.active.filter((item) => item.id !== id),
    closed: [closed, ...state.closed],
  });
  renderIntuition();
  renderIntuitionJournal();
  return closed;
}

function flipIntuitionTrade(id) {
  const closed = closeIntuitionTrade(id, "flip");
  if (!closed) return;
  const stamp = new Date().toISOString();
  const side = closed.side === "short" ? "long" : "short";
  const initialPath = appendPathSample({ openedAt: stamp, pricePath: [] }, closed.exit, 0, stamp);
  const opened = {
    ...closed,
    id: uid("intuition"),
    side,
    status: "active",
    createdAt: stamp,
    openedAt: stamp,
    openedSession: sessionLabel(stamp),
    closedAt: null,
    exit: null,
    entry: closed.exit,
    resultPct: 0,
    mfe: 0,
    mae: 0,
    triggerType: "market",
    triggerPrice: closed.exit,
    flippedFrom: closed.id,
    pricePath: initialPath.pricePath,
    pathMeta: initialPath.pathMeta,
    timeInTrade: "0m",
    lastCheckedAt: stamp,
  };
  const state = intuitionState();
  saveIntuition({ ...state, active: [opened, ...state.active] });
  renderIntuition();
  renderIntuitionJournal();
}

function cancelIntuitionWaiting(id) {
  const state = intuitionState();
  saveIntuition({ ...state, waiting: state.waiting.filter((trade) => trade.id !== id) });
  renderIntuition();
}

function journal() {
  return storeGet(STORE.journal, []);
}

function saveJournal(entries) {
  storeSet(STORE.journal, entries);
}

function migrateJournalImportRows(importRows, patchStoreKey) {
  if (localStorage.getItem(patchStoreKey)) return;
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
  const imported = importRows
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
  localStorage.setItem(patchStoreKey, "1");
}

function migrateServicePcJournalImports() {
  migrateJournalImportRows(SERVICE_PC_JOURNAL_IMPORTS, STORE.journalImportPatch);
  migrateJournalImportRows(SERVICE_PC_JOURNAL_IMPORTS_20260526, STORE.journalImportPatch20260526);
  migrateJournalImportRows(SERVICE_PC_JOURNAL_IMPORTS_20260527, STORE.journalImportPatch20260527);
  migrateJournalImportRows(SERVICE_PC_JOURNAL_IMPORTS_20260528, STORE.journalImportPatch20260528);
  migrateJournalImportRows(SERVICE_PC_JOURNAL_IMPORTS_20260529, STORE.journalImportPatch20260529);
  migrateJournalImportRows(MOBILE_JOURNAL_IMPORTS_20260530, STORE.journalImportPatch20260530);
  migrateJournalImportRows(MOBILE_JOURNAL_IMPORTS_20260531, STORE.journalImportPatch20260531);
  migrateJournalImportRows(MOBILE_JOURNAL_IMPORTS_20260601, STORE.journalImportPatch20260601);
  migrateJournalImportRows(WORK_JOURNAL_IMPORTS_20260601, STORE.journalImportPatch20260601Work);
  migrateJournalImportRows(WORK_JOURNAL_IMPORTS_20260602, STORE.journalImportPatch20260602Work);
  migrateJournalImportRows(WORK_JOURNAL_IMPORTS_20260603, STORE.journalImportPatch20260603Work);
  migrateJournalImportRows(WORK_JOURNAL_IMPORTS_20260604, STORE.journalImportPatch20260604Work);
}

function migrateJournalConsistency() {
  if (localStorage.getItem(STORE.journalConsistencyPatch20260527)) return;
  const rows = journal();
  let changed = false;
  const fixedRows = rows.map((row) => {
    const impossibleFinalTp = row.status === "closed" && row.reason === "Final TP" && Number(row.resultPct) < 0;
    if (!impossibleFinalTp) return row;
    changed = true;
    return {
      ...row,
      reason: "SL",
      outcome: "Loss",
      tpHit: "nie",
      tp1At: null,
      tp1Clock: null,
      timeToTp1: "-",
      updatedAt: new Date().toISOString(),
    };
  });
  if (changed) saveJournal(fixedRows);
  localStorage.setItem(STORE.journalConsistencyPatch20260527, "1");
}

function correctedTpSlResult(row) {
  const riskReward = Number(row.riskPct) * Number(row.tp1R);
  if (Number.isFinite(riskReward) && riskReward > 0) return riskReward;
  const mfe = Number(row.mfe);
  if (Number.isFinite(mfe) && mfe > 0) return mfe;
  const current = Math.abs(Number(row.resultPct) || 0);
  return current > 0 ? current : 0;
}

function migrateTpSlJournalResults() {
  const patchKey = STORE.journalTpSlPatch20260528;
  if (localStorage.getItem(patchKey)) return;
  const rows = journal();
  let changed = false;
  const fixedRows = rows.map((row) => {
    const hitTp1 = String(row.tpHit || "").toLowerCase().includes("tp1");
    const closedOnSl = row.status === "closed" && row.reason === "SL";
    const badTpSlResult = hitTp1 && closedOnSl && Number(row.resultPct) < 0;
    if (!badTpSlResult) return row;
    changed = true;
    return {
      ...row,
      resultPct: correctedTpSlResult(row),
      outcome: "Win",
      updatedAt: new Date().toISOString(),
    };
  });
  if (changed) saveJournal(fixedRows);
  localStorage.setItem(patchKey, "1");
}

function stopExitFromRisk(row) {
  const entry = Number(row.entry);
  const riskPct = Math.abs(Number(row.riskPct));
  if (!Number.isFinite(entry) || !Number.isFinite(riskPct) || entry <= 0 || riskPct <= 0) return NaN;
  return row.side === "short" ? entry * (1 + riskPct / 100) : entry * (1 - riskPct / 100);
}

function migrateSlFillOvershoots() {
  if (localStorage.getItem(STORE.journalSlFillPatch20260529)) return;
  const rows = journal();
  let changed = false;
  const fixedRows = rows.map((row) => {
    const noTpSl = row.status === "closed" && row.reason === "SL" && String(row.tpHit || "").toLowerCase() === "nie";
    const riskPct = Math.abs(Number(row.riskPct));
    const resultPct = Number(row.resultPct);
    const overshotStop = noTpSl && Number.isFinite(riskPct) && Number.isFinite(resultPct) && resultPct < -(riskPct + 0.05);
    if (!overshotStop) return row;
    const exit = stopExitFromRisk(row);
    changed = true;
    return {
      ...row,
      exit: Number.isFinite(exit) ? exit : row.exit,
      resultPct: -riskPct,
      outcome: "Loss",
      updatedAt: new Date().toISOString(),
    };
  });
  if (changed) saveJournal(fixedRows);
  localStorage.setItem(STORE.journalSlFillPatch20260529, "1");
}

function migrateRemoveOversizedRiskTrade() {
  if (localStorage.getItem(STORE.removeOversizedRiskPatch20260531)) return;
  const pair = "币安人生USDT";
  const paper = paperState();
  const nextWaiting = paper.waiting.filter((trade) => trade.pair !== pair);
  const nextActive = paper.active.filter((trade) => trade.pair !== pair);
  if (nextWaiting.length !== paper.waiting.length || nextActive.length !== paper.active.length) {
    savePaper({ waiting: nextWaiting, active: nextActive });
  }
  const rows = journal();
  const nextRows = rows.filter((row) => !(row.pair === pair && row.status === "running"));
  if (nextRows.length !== rows.length) saveJournal(nextRows);
  localStorage.setItem(STORE.removeOversizedRiskPatch20260531, "1");
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
      const entryProfile = selected.metadata?.decision?.entryConfirmType
        ? { type: selected.metadata.decision.entryConfirmType, atr: selected.metadata.decision.entryConfirmAtr || ENTRY_CONFIRM_ATR }
        : entryConfirmProfile({ scenario: selected.scenario, side: p.side, market: { metadata: selected.metadata } });
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
        entryConfirmType: entryProfile.type,
        entryConfirmAtr: entryProfile.atr,
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
          rangeHigh: selected.rangeHigh,
          rangeLow: selected.rangeLow,
          distanceToZoneAtr: selected.distanceToZoneAtr,
          refinement: p.refinement || null,
          metadata: selected.metadata,
          btc,
        },
        distanceFromHighAtOpen: null,
        noTp1Failure: false,
        mfeBeforeClose: 0,
        quality: {
          distanceFromHighAtOpen: null,
          tp1R: rewardRiskRatio(p.entry, p.targets[0], p.stop, p.side),
          tp1Quality: tp1QualityBucket(rewardRiskRatio(p.entry, p.targets[0], p.stop, p.side)),
          entryConfirmType: entryProfile.type,
          noTp1Failure: false,
          mfeBeforeClose: 0,
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

function entryConfirmDistance(trade, current = null) {
  const zoneWidth = Math.abs((trade.entryZone?.to || 0) - (trade.entryZone?.from || 0));
  const atrValue = Number(trade.market?.atr);
  const profile = entryConfirmProfile(trade, current);
  trade.entryConfirmType = trade.entryConfirmType || profile.type;
  trade.entryConfirmAtr = trade.entryConfirmAtr || profile.atr;
  if (Number.isFinite(atrValue) && atrValue > 0) return atrValue * (trade.entryConfirmAtr || profile.atr || ENTRY_CONFIRM_ATR);
  if (Number.isFinite(zoneWidth) && zoneWidth > 0) return zoneWidth * 0.35;
  return Math.abs(Number(trade.entry) || 0) * 0.0015;
}

function shortRejectionTouchLevel(trade) {
  const from = Math.min(trade.entryZone.from, trade.entryZone.to);
  const to = Math.max(trade.entryZone.from, trade.entryZone.to);
  return to - (to - from) * 0.25;
}

function entryStatusText(trade) {
  if (trade.side === "short" && !trade.entryTouchedAt) return "čaká na horný touch zóny";
  if (trade.entryTouchedAt) return "zóna dotknutá, čaká sa confirm";
  return "čaká na dotyk zóny";
}

function entryTriggerText(trade) {
  const from = Math.min(trade.entryZone.from, trade.entryZone.to);
  const to = Math.max(trade.entryZone.from, trade.entryZone.to);
  const confirm = entryConfirmDistance(trade);
  if (trade.side === "long") return `Touch zóny, potom confirm nad ${fmt(to + confirm)}`;
  return `Najprv horný touch ${fmt(shortRejectionTouchLevel(trade))}, potom confirm pod ${fmt(from - confirm)}`;
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
  const confirm = entryConfirmDistance(trade, current);
  const profile = entryConfirmProfile(trade, current);
  trade.entryConfirmType = profile.type;
  trade.entryConfirmAtr = profile.atr;

  if (!trade.entryTouchedAt) {
    const touched = trade.side === "short"
      ? current >= shortRejectionTouchLevel(trade) && current <= to + confirm
      : current >= from && current <= to;
    if (touched) {
      trade.entryTouchedAt = new Date().toISOString();
      trade.entryTouchedPrice = current;
      trade.entryTouchConfirmType = profile.type;
      if (trade.side === "short") {
        trade.shortRejectionTouched = true;
        trade.shortEntryBelowHighPct = distanceFromHighAtPrice(trade, current);
      }
      return "wait";
    }
  }

  if (!trade.entryTouchedAt) return "wait";
  if (trade.side === "short" && !trade.shortRejectionTouched) {
    if (current >= shortRejectionTouchLevel(trade) && current <= to + confirm) {
      trade.shortRejectionTouched = true;
      trade.entryTouchedAt = new Date().toISOString();
      trade.entryTouchedPrice = current;
      trade.entryTouchConfirmType = profile.type;
      trade.shortEntryBelowHighPct = distanceFromHighAtPrice(trade, current);
    }
    return "wait";
  }
  const confirmed = trade.side === "long" ? current >= to + confirm : current <= from - confirm;
  if (confirmed) {
    trade.entryConfirmedAt = new Date().toISOString();
    trade.entryConfirmedPrice = current;
    trade.entryConfirmType = profile.type;
    if (trade.side === "short") trade.shortConfirmAfterTouch = true;
    return "open";
  }
  return "wait";
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

function runtimeWarnings(trade, stamp = new Date().toISOString()) {
  const warnings = [];
  const hasTp1 = (trade.targets || []).some((target) => target.label === "TP1" && target.hit);
  const minutesOpen = minutesSince(trade.openedAt, stamp);
  const mfe = Number(trade.mfe) || 0;
  const mae = Number(trade.mae) || 0;
  const tp1R = Number(trade.tp1R);
  const riskPct = Number(trade.riskPct);

  if (!hasTp1 && Number.isFinite(minutesOpen)) {
    if (minutesOpen >= 240) warnings.push("Stale before TP1: 4h bez TP1.");
    else if (minutesOpen >= 60) warnings.push("Slow setup: 60m bez TP1.");
    if (minutesOpen >= 30 && mfe < 0.5) warnings.push("Weak reaction: po 30m MFE pod +0.5%.");
    if (Math.abs(mae) >= 2 && mfe < 1) warnings.push("MAE pred reakciou: trade ide proti nám skôr než ukázal silu.");
  }

  if (Number.isFinite(riskPct) && riskPct >= 8) warnings.push("Široký risk nad 8% - podľa dát vyžaduje opatrnosť.");
  if (trade.scenario === "Range after pump" && Number.isFinite(tp1R) && tp1R >= 0.25 && tp1R < 0.5) {
    warnings.push("Range after pump má slabý TP1/R bucket 0.25-0.49R.");
  }

  return dedupeWarnings(warnings);
}

function updateTradeTracking(trade, current, stamp = new Date().toISOString()) {
  const livePct = movePct(trade.entry, current, trade.side);
  if (!Number.isFinite(livePct)) return;
  trade.mfe = Math.max(Number(trade.mfe) || 0, livePct);
  trade.mae = Math.min(Number(trade.mae) || 0, livePct);
  trade.mfeBeforeClose = trade.mfe;
  trade.timeInTrade = timeAgo(trade.openedAt, stamp);
  const path = appendPathSample(trade, current, livePct, stamp);
  trade.pricePath = path.pricePath;
  trade.pathMeta = path.pathMeta;
  trade.liveWarnings = runtimeWarnings(trade, stamp);
  trade.quality = {
    ...(trade.quality || {}),
    distanceFromHighAtOpen: trade.distanceFromHighAtOpen,
    tp1R: trade.tp1R,
    tp1Quality: tp1QualityBucket(trade.tp1R),
    entryConfirmType: trade.entryConfirmType || null,
    entryConfirmAtr: trade.entryConfirmAtr || null,
    entryConfirmedAt: trade.entryConfirmedAt || null,
    entryConfirmedPrice: trade.entryConfirmedPrice ?? null,
    mfeBeforeClose: trade.mfeBeforeClose,
    pathMeta: trade.pathMeta,
    mfeMaeRatio: trade.pathMeta?.mfeMaeRatio,
    netExcursionEdge: trade.pathMeta?.netExcursionEdge,
    excursionEfficiency: trade.pathMeta?.excursionEfficiency,
    maeBeforePlus1: trade.pathMeta?.maeBeforePlus1,
    maeBeforePlus3: trade.pathMeta?.maeBeforePlus3,
    maeBeforePlus5: trade.pathMeta?.maeBeforePlus5,
    liveWarnings: trade.liveWarnings,
    noTp1Failure: false,
  };
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
  const closedWithoutTp1 = status === "closed" && !hitTargets.some((target) => target.label === "TP1");
  const distanceFromHighAtOpen = Number.isFinite(trade.distanceFromHighAtOpen)
    ? trade.distanceFromHighAtOpen
    : distanceFromHighAtPrice(trade, trade.entry);
  const mfeBeforeClose = Number.isFinite(trade.mfeBeforeClose) ? trade.mfeBeforeClose : Number(trade.mfe) || 0;
  const quality = {
    ...(trade.quality || {}),
    distanceFromHighAtOpen,
    tp1R: trade.tp1R ?? rewardRiskRatio(trade.entry, trade.targets.find((target) => target.label === "TP1")?.price, trade.stop, trade.side),
    tp1Quality: tp1QualityBucket(trade.tp1R ?? rewardRiskRatio(trade.entry, trade.targets.find((target) => target.label === "TP1")?.price, trade.stop, trade.side)),
    entryConfirmType: trade.entryConfirmType || null,
    entryConfirmAtr: trade.entryConfirmAtr || null,
    entryTouchConfirmType: trade.entryTouchConfirmType || null,
    entryConfirmedAt: trade.entryConfirmedAt || null,
    entryConfirmedPrice: trade.entryConfirmedPrice ?? null,
    shortRejectionTouched: trade.side === "short" ? Boolean(trade.shortRejectionTouched) : null,
    shortEntryBelowHighPct: trade.side === "short" ? trade.shortEntryBelowHighPct ?? null : null,
    shortConfirmAfterTouch: trade.side === "short" ? Boolean(trade.shortConfirmAfterTouch) : null,
    noTp1Failure: closedWithoutTp1,
    mfeBeforeClose,
    pathMeta: trade.pathMeta || trade.quality?.pathMeta || null,
    mfeMaeRatio: trade.pathMeta?.mfeMaeRatio ?? trade.quality?.mfeMaeRatio,
    netExcursionEdge: trade.pathMeta?.netExcursionEdge ?? trade.quality?.netExcursionEdge,
    excursionEfficiency: trade.pathMeta?.excursionEfficiency ?? trade.quality?.excursionEfficiency,
    maeBeforePlus1: trade.pathMeta?.maeBeforePlus1 ?? trade.quality?.maeBeforePlus1,
    maeBeforePlus3: trade.pathMeta?.maeBeforePlus3 ?? trade.quality?.maeBeforePlus3,
    maeBeforePlus5: trade.pathMeta?.maeBeforePlus5 ?? trade.quality?.maeBeforePlus5,
    liveWarnings: dedupeWarnings([...(trade.liveWarnings || []), ...((trade.quality || {}).liveWarnings || [])]),
  };
  const warnings = dedupeWarnings([...(trade.warnings || []), ...(trade.liveWarnings || []), ...(quality.liveWarnings || [])]);
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
    distanceFromHighAtOpen,
    shortRejectionTouched: trade.side === "short" ? Boolean(trade.shortRejectionTouched) : null,
    shortEntryBelowHighPct: trade.side === "short" ? trade.shortEntryBelowHighPct ?? null : null,
    shortConfirmAfterTouch: trade.side === "short" ? Boolean(trade.shortConfirmAfterTouch) : null,
    entryConfirmType: trade.entryConfirmType || null,
    entryConfirmAtr: trade.entryConfirmAtr || null,
    entryTouchConfirmType: trade.entryTouchConfirmType || null,
    entryConfirmedAt: trade.entryConfirmedAt || null,
    entryConfirmedPrice: trade.entryConfirmedPrice ?? null,
    noTp1Failure: closedWithoutTp1,
    mfeBeforeClose,
    pricePath: trade.pricePath || [],
    pathMeta: quality.pathMeta,
    mfeMaeRatio: quality.mfeMaeRatio,
    netExcursionEdge: quality.netExcursionEdge,
    excursionEfficiency: quality.excursionEfficiency,
    maeBeforePlus1: quality.maeBeforePlus1,
    maeBeforePlus3: quality.maeBeforePlus3,
    maeBeforePlus5: quality.maeBeforePlus5,
    quality,
    warnings,
    riskPct: trade.riskPct ?? absMovePct(trade.entry, trade.stop),
    tp1R: trade.tp1R ?? rewardRiskRatio(trade.entry, trade.targets.find((target) => target.label === "TP1")?.price, trade.stop, trade.side),
    timeInTrade: trade.timeInTrade || timeAgo(trade.openedAt, now),
    timeToTp1: trade.timeToTp1 || (trade.targets.find((target) => target.label === "TP1" && target.hitAt) ? timeAgo(trade.openedAt, trade.targets.find((target) => target.label === "TP1").hitAt) : "-"),
    setupMode: trade.setupMode || "trade",
    entryRule: trade.entryRule || null,
    entryTouchedAt: trade.entryTouchedAt || null,
    entryTouchedPrice: trade.entryTouchedPrice || null,
    entryConfirmedAt: trade.entryConfirmedAt || null,
    entryConfirmedPrice: trade.entryConfirmedPrice ?? null,
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
    "Momentum continuation long",
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
    distanceFromHighAtOpen: row.distanceFromHighAtOpen ?? row.quality?.distanceFromHighAtOpen ?? row.market?.metadata?.pump?.distanceFromHighPct,
    entryConfirmType: row.entryConfirmType ?? row.quality?.entryConfirmType ?? row.market?.metadata?.decision?.entryConfirmType,
    entryConfirmAtr: row.entryConfirmAtr ?? row.quality?.entryConfirmAtr ?? row.market?.metadata?.decision?.entryConfirmAtr,
    entryConfirmedAt: row.entryConfirmedAt ?? row.quality?.entryConfirmedAt,
    entryConfirmedPrice: row.entryConfirmedPrice ?? row.quality?.entryConfirmedPrice,
    noTp1Failure: row.noTp1Failure ?? row.quality?.noTp1Failure ?? (!String(row.tpHit || "").toLowerCase().includes("tp1") && row.outcome === "Loss"),
    mfeBeforeClose: row.mfeBeforeClose ?? row.quality?.mfeBeforeClose ?? row.mfe,
    pathMeta: row.pathMeta ?? row.quality?.pathMeta ?? null,
    mfeMaeRatio: row.mfeMaeRatio ?? row.quality?.mfeMaeRatio,
    netExcursionEdge: row.netExcursionEdge ?? row.quality?.netExcursionEdge,
    excursionEfficiency: row.excursionEfficiency ?? row.quality?.excursionEfficiency,
    maeBeforePlus1: row.maeBeforePlus1 ?? row.quality?.maeBeforePlus1,
    maeBeforePlus3: row.maeBeforePlus3 ?? row.quality?.maeBeforePlus3,
    maeBeforePlus5: row.maeBeforePlus5 ?? row.quality?.maeBeforePlus5,
    quality: row.quality || null,
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
      <span>Path <b>${pathMetaLabel(row)}</b></span>
      <span>Eff <b>${pct(row.excursionEfficiency, 0)}</b></span>
      <span>MFE/MAE R <b>${ratioLabel(row.mfeMaeRatio)}</b></span>
      <span>MAE pred +3 <b class="negative">${pct(row.maeBeforePlus3)}</b></span>
      <span>High dist <b>${pct(row.distanceFromHighAtOpen)}</b></span>
      <span>TP1/R <b class="${Number(row.tp1R) < 0.4 ? "warning" : "positive"}">${fmt(row.tp1R, 2)}</b></span>
      <span>Confirm <b>${row.entryConfirmType || "-"}</b></span>
      <span>No TP1 <b class="${row.noTp1Failure ? "negative" : "positive"}">${row.noTp1Failure ? "áno" : "nie"}</b></span>
      <span>Time <b>${row.timeInTrade || "-"}</b></span>
      <span>Open <b>${clockTime(row.openedAt)}</b></span>
      <span>TP1 <b>${clockTime(row.tp1At)}</b></span>
      <span>${row.account || "Paper"}</span>
    </article>
  `;
}

function averageNumber(rows, getValue) {
  const values = rows.map(getValue).map(Number).filter(Number.isFinite);
  return values.length ? average(values) : NaN;
}

function excursionSummaryHtml(rows) {
  const withPath = rows.filter((row) => Number(row.pathMeta?.sampleCount) > 1 || Number.isFinite(Number(row.excursionEfficiency)));
  if (!withPath.length) return `<p>Nové path metriky sa začnú plniť pri ďalších webových paper tradoch.</p>`;
  const avgRatio = averageNumber(withPath, (row) => row.mfeMaeRatio);
  const avgEfficiency = averageNumber(withPath, (row) => row.excursionEfficiency);
  const avgEdge = averageNumber(withPath, (row) => row.netExcursionEdge);
  const avgMaeBeforePlus3 = averageNumber(withPath, (row) => row.maeBeforePlus3);
  return `
    <div class="analysis-bars compact">
      <div class="analysis-bar"><div><strong>Path samples</strong><small>${withPath.length} / ${rows.length} trades</small></div><i style="width:${rows.length ? (withPath.length / rows.length) * 100 : 0}%"></i><span>${withPath.length}</span></div>
      <div class="analysis-bar"><div><strong>Avg MFE/MAE</strong><small>potenciál voči bolesti</small></div><i style="width:60%"></i><span>${ratioLabel(avgRatio)}</span></div>
      <div class="analysis-bar"><div><strong>Avg efficiency</strong><small>MFE / (MFE + abs(MAE))</small></div><i style="width:${Math.max(4, Math.min(100, Number(avgEfficiency) || 0))}%"></i><span>${pct(avgEfficiency, 0)}</span></div>
      <div class="analysis-bar"><div><strong>Avg edge</strong><small>MFE - abs(MAE)</small></div><i class="${Number(avgEdge) < 0 ? "loss" : ""}" style="width:${Math.max(4, Math.min(100, Math.abs(Number(avgEdge) || 0) * 8))}%"></i><span class="${Number(avgEdge) >= 0 ? "positive" : "negative"}">${pct(avgEdge)}</span></div>
      <div class="analysis-bar"><div><strong>Avg MAE pred +3%</strong><small>bolesť pred prvým +3%</small></div><i class="loss" style="width:${Math.max(4, Math.min(100, Math.abs(Number(avgMaeBeforePlus3) || 0) * 10))}%"></i><span class="negative">${pct(avgMaeBeforePlus3)}</span></div>
    </div>
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
  if (ui.analysisExcursionSummary) ui.analysisExcursionSummary.innerHTML = excursionSummaryHtml(rows);
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
      const openedTrade = normalizeTradeAtOpen(trade, current);
      const initialPath = appendPathSample({ openedAt, pricePath: [] }, current, 0, openedAt);
      nextActive.push({
        ...openedTrade,
        status: "active",
        originalStop: openedTrade.originalStop ?? openedTrade.stop,
        openedAt,
        openedSession: sessionLabel(),
        openedPrice: current,
        mfe: 0,
        mae: 0,
        timeInTrade: "0m",
        pricePath: initialPath.pricePath,
        pathMeta: initialPath.pathMeta,
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
      upsertJournalEntry(journalEntryFromTrade(trade, hitFinal ? finalTarget.price : trade.stop, hitFinal ? "Final TP" : "SL"));
    } else {
      trade.lastCheckedAt = now;
      nextActive.push(trade);
    }
  });

  savePaper({ waiting: nextWaiting, active: nextActive });
  renderPaper();
  renderJournal();
}

async function updateIntuition() {
  const state = intuitionState();
  if (!state.waiting.length && !state.active.length) return;
  const stamp = new Date().toISOString();
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
    const liveTrade = { ...trade, live: current, lastCheckedAt: stamp };
    if (intuitionTriggerHit(liveTrade, current)) {
      nextActive.push(updateIntuitionTracking({
        ...liveTrade,
        status: "active",
        entry: current,
        openedAt: stamp,
        openedSession: sessionLabel(stamp),
        mfe: 0,
        mae: 0,
        pricePath: [],
        pathMeta: derivePathMeta([]),
      }, current, stamp));
    } else {
      nextWaiting.push(liveTrade);
    }
  });
  state.active.forEach((trade) => {
    const current = priceMap[trade.pair];
    nextActive.push(Number.isFinite(current) ? updateIntuitionTracking(trade, current, stamp) : trade);
  });
  saveIntuition({ waiting: nextWaiting, active: nextActive, closed: state.closed });
  renderIntuition();
  renderIntuitionJournal();
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
  const warningList = dedupeWarnings([...(trade.warnings || []), ...(trade.liveWarnings || []), ...((trade.quality || {}).liveWarnings || [])]);
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
          ${warningList.length ? `<span class="badge warn">${warningList.length} warn</span>` : ""}
          <span class="side-chip ${mode === "watch" ? "watch" : trade.side}">${mode}</span>
        </div>
      </div>
      <p>${trade.scenario}</p>
      ${warningList.length ? `<p class="warning">${mode === "watch" ? "Watch note" : "Warning"}: ${warningList.join(" ")}</p>` : ""}
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
        <span>Confirm <b>${trade.entryConfirmType || entryConfirmProfile(trade).type}</b></span>
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
          <span>Path <b>${pathMetaLabel(trade)}</b></span>
          <span>Eff <b>${pct(trade.pathMeta?.excursionEfficiency, 0)}</b></span>
          <span>MFE/MAE <b>${ratioLabel(trade.pathMeta?.mfeMaeRatio)}</b></span>
          <span>MAE pred +3 <b class="negative">${pct(trade.pathMeta?.maeBeforePlus3)}</b></span>
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

function intuitionStats(rows = []) {
  const wins = rows.filter((row) => Number(row.resultPct) > 0).length;
  const losses = rows.filter((row) => Number(row.resultPct) <= 0).length;
  const total = rows.reduce((sum, row) => sum + (Number(row.resultPct) || 0), 0);
  const avgMfe = rows.length ? average(rows.map((row) => Number(row.mfe) || 0)) : 0;
  const avgMae = rows.length ? average(rows.map((row) => Number(row.mae) || 0)) : 0;
  return {
    count: rows.length,
    wins,
    losses,
    winrate: rows.length ? (wins / rows.length) * 100 : 0,
    total,
    avg: rows.length ? total / rows.length : 0,
    avgMfe,
    avgMae,
  };
}

function renderIntuitionSummary(state) {
  const stats = intuitionStats(state.closed);
  if (!ui.intuitionSummary) return;
  ui.intuitionSummary.innerHTML = `
    <article><span>Closed</span><strong>${stats.count}</strong></article>
    <article><span>WR</span><strong>${fmt(stats.winrate, 0)}%</strong></article>
    <article><span>Avg</span><strong class="${stats.avg >= 0 ? "positive" : "negative"}">${pct(stats.avg)}</strong></article>
    <article><span>Total</span><strong class="${stats.total >= 0 ? "positive" : "negative"}">${pct(stats.total)}</strong></article>
    <article><span>Avg MFE</span><strong class="positive">${pct(stats.avgMfe)}</strong></article>
    <article><span>Avg MAE</span><strong class="negative">${pct(stats.avgMae)}</strong></article>
  `;
}

function renderIntuitionGainers() {
  if (!ui.intuitionGainerList) return;
  const controls = {};
  ui.intuitionGainerList.querySelectorAll(".intuition-gainer-card[data-pair]").forEach((card) => {
    controls[card.dataset.pair] = {
      trigger: card.querySelector("[data-intuition-trigger]")?.value || "market",
      price: card.querySelector("[data-intuition-price]")?.value || "",
    };
  });
  const byPump = gainers.slice().sort((a, b) => (a.gainerRank || 999) - (b.gainerRank || 999)).slice(0, 15);
  if (ui.intuitionGainersMeta) ui.intuitionGainersMeta.textContent = byPump.length ? `${byPump.length} gainers | pump order` : "0 gainers";
  if (!byPump.length) {
    ui.intuitionGainerList.innerHTML = `<p class="muted">Spusti Scan Live. Tu budú TOP 15 gainers pre intuitívne Long/Short.</p>`;
    return;
  }
  ui.intuitionGainerList.innerHTML = byPump.map((item, index) => {
    const control = controls[item.pair] || {};
    const triggerValue = control.trigger || "market";
    const priceValue = control.price || (Number(item.price) || "");
    return `
    <article class="intuition-gainer-card" data-pair="${item.pair}">
      <div class="gainer-head">
        <div>
          <strong>#${index + 1} ${item.pair}</strong>
          <span>Live <b>${fmt(item.price)}</b> | 24h <b class="${item.dayChange >= 0 ? "positive" : "negative"}">${pct(item.dayChange)}</b></span>
        </div>
        <span class="rating-chip">${Number.isFinite(item.rating) ? fmt(item.rating, 0) : "-"}</span>
      </div>
      <div class="intuition-trigger-row">
        <select data-intuition-trigger>
          <option value="market" ${triggerValue === "market" ? "selected" : ""}>market</option>
          <option value="above" ${triggerValue === "above" ? "selected" : ""}>above</option>
          <option value="below" ${triggerValue === "below" ? "selected" : ""}>below</option>
        </select>
        <input data-intuition-price type="number" step="any" value="${priceValue}">
        <button class="secondary intuition-long" data-side="long" type="button">Long</button>
        <button class="secondary danger intuition-short" data-side="short" type="button">Short</button>
      </div>
    </article>
  `;
  }).join("");
  ui.intuitionGainerList.querySelectorAll(".intuition-gainer-card").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("button, input, select")) return;
      syncChart(card.dataset.pair, "intuition");
    });
    card.querySelectorAll("[data-side]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        startIntuitionFromGainer(
          card.dataset.pair,
          button.dataset.side,
          card.querySelector("[data-intuition-trigger]").value,
          card.querySelector("[data-intuition-price]").value
        );
      });
    });
  });
}

function intuitionTradeCard(trade, type) {
  const pnl = Number(trade.resultPct);
  return `
    <article class="trade-card intuition-card ${trade.side}" data-pair="${trade.pair}" data-id="${trade.id}">
      <div class="trade-head">
        <strong>${trade.pair} ${trade.side.toUpperCase()}</strong>
        <span class="badge ${type === "active" ? "good" : "neutral"}">${type}</span>
      </div>
      <div class="metric-list">
        <span>Entry <b>${fmt(trade.entry)}</b></span>
        <span>Live <b>${fmt(trade.live)}</b></span>
        <span>PnL <b class="${pnl >= 0 ? "positive" : "negative"}">${Number.isFinite(pnl) ? pct(pnl) : "-"}</b></span>
        <span>MFE <b class="positive">${pct(trade.mfe || 0)}</b></span>
        <span>MAE <b class="negative">${pct(trade.mae || 0)}</b></span>
        <span>Path <b>${pathMetaLabel(trade)}</b></span>
        <span>Eff <b>${pct(trade.pathMeta?.excursionEfficiency, 0)}</b></span>
        <span>MFE/MAE <b>${ratioLabel(trade.pathMeta?.mfeMaeRatio)}</b></span>
      </div>
      <div class="trade-context">
        <span>Created <b>${dateTimeLabel(trade.createdAt)}</b></span>
        <span>Opened <b>${dateTimeLabel(trade.openedAt)}</b></span>
        <span>Trigger <b>${trade.triggerType === "market" ? "market" : `${trade.triggerType} ${fmt(trade.triggerPrice)}`}</b></span>
        <span>Time <b>${trade.timeInTrade || "-"}</b></span>
      </div>
      <div class="trade-actions">
        ${type === "waiting"
          ? `<button class="secondary cancel-intuition" data-id="${trade.id}" type="button">Cancel</button>`
          : `<button class="secondary close-intuition" data-id="${trade.id}" type="button">Close</button><button class="secondary flip-intuition" data-id="${trade.id}" type="button">Flip</button>`}
      </div>
    </article>
  `;
}

function renderIntuition() {
  const state = intuitionState();
  renderIntuitionGainers();
  renderIntuitionSummary(state);
  if (ui.intuitionStatus) ui.intuitionStatus.textContent = `${state.waiting.length} čaká | ${state.active.length} aktívne | ${state.closed.length} closed`;
  if (ui.intuitionTradesMeta) ui.intuitionTradesMeta.textContent = `${state.waiting.length + state.active.length} open`;
  if (ui.intuitionWaitingList) ui.intuitionWaitingList.innerHTML = state.waiting.map((trade) => intuitionTradeCard(trade, "waiting")).join("") || `<p class="muted">Žiadne čakajúce triggery.</p>`;
  if (ui.intuitionActiveList) ui.intuitionActiveList.innerHTML = state.active.map((trade) => intuitionTradeCard(trade, "active")).join("") || `<p class="muted">Žiadne aktívne intuície.</p>`;
  document.querySelectorAll(".intuition-card[data-pair]").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;
      syncChart(card.dataset.pair, "intuition");
    });
  });
  document.querySelectorAll(".cancel-intuition").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    cancelIntuitionWaiting(button.dataset.id);
  }));
  document.querySelectorAll(".close-intuition").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    closeIntuitionTrade(button.dataset.id);
  }));
  document.querySelectorAll(".flip-intuition").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    flipIntuitionTrade(button.dataset.id);
  }));
}

function renderIntuitionJournal() {
  const state = intuitionState();
  const rows = state.closed;
  const stats = intuitionStats(rows);
  if (ui.intuitionJournalMeta) ui.intuitionJournalMeta.textContent = `${rows.length} closed`;
  if (ui.intuitionJournalSummary) ui.intuitionJournalSummary.innerHTML = `
    <article><span>WR</span><strong>${fmt(stats.winrate, 0)}%</strong></article>
    <article><span>Wins / Losses</span><strong>${stats.wins} / ${stats.losses}</strong></article>
    <article><span>Avg</span><strong class="${stats.avg >= 0 ? "positive" : "negative"}">${pct(stats.avg)}</strong></article>
    <article><span>Total</span><strong class="${stats.total >= 0 ? "positive" : "negative"}">${pct(stats.total)}</strong></article>
    <article><span>Avg MFE</span><strong class="positive">${pct(stats.avgMfe)}</strong></article>
    <article><span>Avg MAE</span><strong class="negative">${pct(stats.avgMae)}</strong></article>
  `;
  if (ui.intuitionSideBars) ui.intuitionSideBars.innerHTML = analysisBarHtml(groupRows(rows.map((row) => ({ ...row, tpHit: row.closeReason || "manual", status: row.closeReason || "closed" })), "side"));
  if (ui.intuitionExcursionSummary) ui.intuitionExcursionSummary.innerHTML = excursionSummaryHtml(rows);
  const byDay = Object.entries(groupRows(rows.map((row) => ({ ...row, date: isoDay(row.closedAt || row.openedAt || row.createdAt) })), "date")).sort((a, b) => b[0].localeCompare(a[0]));
  if (ui.intuitionDaysMeta) ui.intuitionDaysMeta.textContent = `${byDay.length} dní`;
  if (ui.intuitionDays) ui.intuitionDays.innerHTML = byDay.map(([date, dayRows], index) => {
    const stat = intuitionStats(dayRows);
    return `
      <details class="analysis-day" ${index === 0 ? "open" : ""}>
        <summary><strong>${date}</strong><span>${stat.count} closed | WR ${fmt(stat.winrate, 0)}% | avg ${pct(stat.avg)}</span></summary>
        <div class="analysis-trades">${dayRows.map((row) => `
          <article class="analysis-trade intuition-analysis-trade">
            <div><strong>${row.pair}</strong><span>${row.side} | ${row.triggerType}</span></div>
            <span class="rating-chip">${row.market?.rank || "-"}</span>
            <span>Intuition</span>
            <span>Entry <b>${fmt(row.entry)}</b></span>
            <span>Exit <b>${fmt(row.exit)}</b></span>
            <span>Result <b class="${row.resultPct >= 0 ? "positive" : "negative"}">${pct(row.resultPct)}</b></span>
            <span>MFE/MAE <b><em class="positive">${pct(row.mfe)}</em> / <em class="negative">${pct(row.mae)}</em></b></span>
            <span>Path <b>${pathMetaLabel(row)}</b></span>
            <span>Eff <b>${pct(row.pathMeta?.excursionEfficiency, 0)}</b></span>
            <span>MFE/MAE R <b>${ratioLabel(row.pathMeta?.mfeMaeRatio)}</b></span>
            <span>MAE pred +3 <b class="negative">${pct(row.pathMeta?.maeBeforePlus3)}</b></span>
            <span>Time <b>${row.timeInTrade || "-"}</b></span>
          </article>
        `).join("")}</div>
      </details>
    `;
  }).join("") || `<p class="muted">Zatiaľ žiadne uzavreté intuition trady.</p>`;
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
  if (view === "intuition") renderIntuition();
  if (view === "intuitionJournal") renderIntuitionJournal();
}

ui.navButtons.forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
ui.scanButton.addEventListener("click", scanLive);
ui.startPaperButton.addEventListener("click", startPaper);
ui.refreshCoinButton.addEventListener("click", async () => {
  if (!selected) return;
  const ticker = await json(`${API}/fapi/v1/ticker/24hr?symbol=${selected.pair}`);
  const book = await json(`${API}/fapi/v1/ticker/bookTicker?symbol=${selected.pair}`).catch(() => null);
  const [candles15m, candles1h, candles5m, oiHistory] = await Promise.all([
    klines(selected.pair, "15m"),
    klines(selected.pair, "1h", 48),
    klines(selected.pair, "5m", 180),
    openInterestHist(selected.pair, "5m", 12).catch(() => []),
  ]);
  const updated = analyzeGainer(
    { ...ticker, gainerRank: selected.gainerRank },
    candles15m,
    book,
    candles1h,
    selected.gainerRank,
    candles5m,
    oiHistory,
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
migrateJournalConsistency();
migrateTpSlJournalResults();
migrateSlFillOvershoots();
migrateRemoveOversizedRiskTrade();
setInterval(updatePaper, 8000);
setInterval(updateIntuition, 8000);
setInterval(scanLive, AUTO_SCAN_MS);
renderPaper();
renderIntuition();
renderIntuitionJournal();
renderJournal();
scanLive();
