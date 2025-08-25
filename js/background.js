/*! Highlighter-v2 version: 1.0.2 Aug 25, 2025 */ 

const ACTIVE_STATUS_STORE = "isActive";
const KEYWORDS_STRING_STORE = "keywordsString";
const KEYWORDS_ARRAY_STORE = "keywordsArray";
const MATCH_URLS = ["http://*/*", "https://*/*", "file://*/*"];
const CONTENT_JS_FILES = ["js/jquery.js", "js/highlighter.js", "js/content-action.js"];
const CONTENT_CSS_FILES = ["css/highlight.css"];

function ensureInjected(tabId, done) {
  chrome.scripting.insertCSS(
    { target: { tabId, allFrames: true }, files: CONTENT_CSS_FILES },
    () => {
      chrome.scripting.executeScript(
        { target: { tabId, allFrames: true }, files: CONTENT_JS_FILES },
        () => {
          if (typeof done === "function") done();
        }
      );
    }
  );
}

function sendWithInjection(tabId, message) {
  chrome.tabs.sendMessage(tabId, message, () => {
    if (chrome.runtime.lastError) {
      ensureInjected(tabId, () => {
        chrome.tabs.sendMessage(tabId, message, () => {
        });
      });
    }
  });
}

function broadcastToAll(message) {
  chrome.tabs.query({ url: MATCH_URLS }, (tabs) => {
    tabs.forEach((tab) => sendWithInjection(tab.id, message));
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.opt !== "rpc") return;
  switch (message.func) {
    case "getKeywordsString": {
      chrome.storage.local.get(KEYWORDS_STRING_STORE, (data) => {
        sendResponse(data[KEYWORDS_STRING_STORE] || "");
      });
      return true;
    }
    case "getKeywords": {
      chrome.storage.local.get(KEYWORDS_ARRAY_STORE, (data) => {
        sendResponse(data[KEYWORDS_ARRAY_STORE] || []);
      });
      return true;
    }
    case "setKeywordsString": {
      const str = message.args?.[0] || "";
      const arr =
        str.trim() === "" ? [] : str.trim().toLowerCase().split(/\s+/);
      chrome.storage.local.set(
        {
          [KEYWORDS_STRING_STORE]: str,
          [KEYWORDS_ARRAY_STORE]: arr,
        },
        () => {
          broadcastToAll({
            opt: "event",
            event: "storageChange",
            args: { key: KEYWORDS_ARRAY_STORE, value: arr },
          });
          sendResponse({ ok: true });
        }
      );
      return;
    }
    case "getActiveStatus": {
      chrome.storage.local.get(ACTIVE_STATUS_STORE, (data) => {
        let active = true;
        if (Object.prototype.hasOwnProperty.call(data, ACTIVE_STATUS_STORE)) {
          active = data[ACTIVE_STATUS_STORE];
        }
        sendResponse(active);
      });
      return true;
    }
    case "setActiveStatus": {
      const active = !!message.args?.[0];
      chrome.storage.local.set({ [ACTIVE_STATUS_STORE]: active }, () => {
        broadcastToAll({
          opt: "event",
          event: "storageChange",
          args: { key: ACTIVE_STATUS_STORE, value: active },
        });
        sendResponse({ ok: true });
      });
      return;
    }
  }
});
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install" || reason === "update") {
    chrome.tabs.query({ url: MATCH_URLS }, (tabs) => {
      tabs.forEach((tab) => ensureInjected(tab.id));
    });
  }
});
