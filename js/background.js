const ACTIVE_STATUS_STORE = "isActive";
const KEYWORDS_STRING_STORE = "keywordsString";
const KEYWORDS_ARRAY_STORE = "keywordsArray";

// Pages we care about
const MATCH_URLS = ["http://*/*", "https://*/*", "file://*/*"];

// Files that must be present in the page for highlighting to work
const CONTENT_JS_FILES = ["js/jquery.js", "js/highlighter.js", "js/content-action.js"];
const CONTENT_CSS_FILES = ["css/highlight.css"];

/**
 * Ensure content scripts are injected into a tab, then callback.
 * Requires "scripting" permission in MV3.
 */
function ensureInjected(tabId, done) {
  chrome.scripting.insertCSS(
    { target: { tabId, allFrames: true }, files: CONTENT_CSS_FILES },
    () => {
      // insertCSS can fail for restricted URLs; ignore and continue
      chrome.scripting.executeScript(
        { target: { tabId, allFrames: true }, files: CONTENT_JS_FILES },
        () => {
          // executeScript can also fail on restricted URLs; proceed anyway
          if (typeof done === "function") done();
        }
      );
    }
  );
}

/**
 * Try sending a message; if no receiver, inject and retry once.
 */
function sendWithInjection(tabId, message) {
  chrome.tabs.sendMessage(tabId, message, () => {
    if (chrome.runtime.lastError) {
      // No listener in this tab/frame yet — inject and retry
      ensureInjected(tabId, () => {
        chrome.tabs.sendMessage(tabId, message, () => {
          // Swallow errors on restricted pages
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

// Handle RPC messages from popup/content scripts
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
        }
      );
      return; // async but we don't use sendResponse
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
        // Notify all tabs that active status changed
        broadcastToAll({
          opt: "event",
          event: "storageChange",
          args: { key: ACTIVE_STATUS_STORE, value: active },
        });
      });
      return; // async but we don't use sendResponse
    }
  }
});

// On install/update, inject into open tabs so first change works without reload
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install" || reason === "update") {
    chrome.tabs.query({ url: MATCH_URLS }, (tabs) => {
      tabs.forEach((tab) => ensureInjected(tab.id));
    });
  }
});
