(() => {
  const MAX_LOGS = 300;
  async function add(entry) {
    const stamp = new Date().toISOString();
    const logEntry = { ...entry, timestamp: stamp };
    const { activityLogs = [] } = await chrome.storage.local.get("activityLogs");
    activityLogs.unshift(logEntry);
    await chrome.storage.local.set({ activityLogs: activityLogs.slice(0, MAX_LOGS) });
  }
  window.AIAFLogger = {
    info(message, meta = {}) { return add({ level: "info", message, meta }); },
    warn(message, meta = {}) { return add({ level: "warn", message, meta }); },
    error(message, meta = {}) { return add({ level: "error", message, meta }); }
  };
})();
