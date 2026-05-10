const StorageKeys = Object.freeze({
  selectedCoin: "cockpit-v3-selected-coin",
  dataMode: "cockpit-v3-data-mode",
  paperState: "cockpit-v3-paper-state",
  watchedTriggers: "cockpit-v3-watched-triggers",
  journalEntries: "cockpit-v3-journal-entries",
  realTrades: "cockpit-v3-real-trades",
  rules: "cockpit-v3-rules",
});

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function removeStorage(key) {
  localStorage.removeItem(key);
}

function loadAppSettings() {
  return {
    selectedCoin: readStorage(StorageKeys.selectedCoin, "SOLUSDT"),
    dataMode: DataMode.LIVE,
    rules: readStorage(StorageKeys.rules, defaultRules),
  };
}

function saveSelectedCoin(pair) {
  writeStorage(StorageKeys.selectedCoin, pair);
}

function saveDataMode(mode) {
  writeStorage(StorageKeys.dataMode, mode);
}

function saveRules(rules) {
  writeStorage(StorageKeys.rules, rules);
}

function loadPaperState() {
  return readStorage(StorageKeys.paperState, null);
}

function savePaperState(state) {
  writeStorage(StorageKeys.paperState, state);
}

function loadWatchedTriggers() {
  return readStorage(StorageKeys.watchedTriggers, []);
}

function saveWatchedTriggers(items) {
  writeStorage(StorageKeys.watchedTriggers, items);
}

function loadJournalEntries() {
  return readStorage(StorageKeys.journalEntries, null);
}

function saveJournalEntries(entries) {
  writeStorage(StorageKeys.journalEntries, entries);
}

function clearTradingStorage() {
  removeStorage(StorageKeys.paperState);
  removeStorage(StorageKeys.journalEntries);
}

function clearAllRuntimeStorage() {
  removeStorage(StorageKeys.paperState);
  removeStorage(StorageKeys.watchedTriggers);
  removeStorage(StorageKeys.journalEntries);
  removeStorage(StorageKeys.realTrades);
}

function loadRealTrades() {
  return readStorage(StorageKeys.realTrades, null);
}

function saveRealTrades(trades) {
  writeStorage(StorageKeys.realTrades, trades);
}

window.CockpitStorage = {
  StorageKeys,
  readStorage,
  writeStorage,
  loadAppSettings,
  saveSelectedCoin,
  saveDataMode,
  saveRules,
  loadPaperState,
  savePaperState,
  loadWatchedTriggers,
  saveWatchedTriggers,
  loadJournalEntries,
  saveJournalEntries,
  loadRealTrades,
  saveRealTrades,
  clearTradingStorage,
  clearAllRuntimeStorage,
};
