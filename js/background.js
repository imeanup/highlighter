const ACTIVE_STATUS_STORE = "isActive";
const KEYWORDS_STRING_STORE = "keywordsString";
const KEYWORDS_ARRAY_STORE = "keywordsArray";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.opt == "rpc") {
        switch(message.func) {
            case "getKeywordsString":
                chrome.storage.local.get(KEYWORDS_STRING_STORE, (data) => {
                    sendResponse(data[KEYWORDS_STRING_STORE] || "");
                });
                return true;
            case "getKeywords":
                chrome.storage.local.get(KEYWORDS_ARRAY_STORE, (data) => {
                    sendResponse(data[KEYWORDS_ARRAY_STORE] || []);
                });
                return true;
            case "setKeywordsString":
                const str = message.args[0] || "";
                const arr = (str.trim() === "" ? [] : str.split(/\\r?\\n/));
                chrome.storage.local.set({[KEYWORDS_STRING_STORE]: str, [KEYWORDS_ARRAY_STORE]: arr}, () => {
                    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                        tabs.forEach(tab => {
                            chrome.tabs.sendMessage(tab.id, {
                                opt: "event",
                                event: "storageChange",
                                args: {keys: KEYWORDS_ARRAY_STORE, value: arr}
                            });
                        });
                    });
                });
                return;
            case "getActiveStatus":
                chrome.storage.local.get(ACTIVE_STATUS_STORE, (data) => {
                    let active = true;
                    if (data.hasOwnProperty(ACTIVE_STATUS_STORE)) {
                        active = data[ACTIVE_STATUS_STORE];
                    }
                    sendResponse(active);
                });
                return true;
            case "setActiveStatus":
                const active = message.args[0];
                chrome.storage.local.set({[ACTIVE_STATUS_STORE]:active}, () => {
                    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                        tabs.forEach(tab => {
                            chrome.tabs.sendMessage(tab.id, {
                                opt: "event",
                                event: "storageChange",
                                args: {key: ACTIVE_STATUS_STORE, value: active}
                            });
                        });
                    });
                });
                return;
        }
    }
});