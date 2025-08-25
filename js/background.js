const ACTIVE_STATUS_STORE = "isActive";
const KEYWORDS_STRING_STORE = "keywordsString";
const KEYWORDS_ARRAY_STORE = "keywordsArray";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.opt == "rpc") {
        // TODO
    }
});