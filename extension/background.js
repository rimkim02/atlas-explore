// Toolbar icon → open the Explore page (planning doc §8: click = explore)
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("explore.html") });
});

// Content script (FAB click) asks the worker to open Explore
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg && msg.type === "atlas:open-explore") {
    chrome.tabs.create({ url: chrome.runtime.getURL("explore.html") });
    sendResponse({ ok: true });
  }
});
