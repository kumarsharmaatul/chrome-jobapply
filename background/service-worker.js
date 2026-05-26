chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["profiles"], ({ profiles }) => {
    if (!profiles) chrome.storage.local.set({ profiles: [], activityLogs: [] });
  });
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "run_autofill") return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) chrome.tabs.sendMessage(tab.id, { type: "RUN_AUTOFILL" });
});

chrome.runtime.onMessage.addListener(async (msg) => {
  if (msg?.type === "RUN_AUTOFILL_ACTIVE_TAB") {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) chrome.tabs.sendMessage(tab.id, { type: "RUN_AUTOFILL" });
  }
});
