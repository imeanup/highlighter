/*! Highlighter-v2 version: 1.0.3 Aug 28, 2025 */

var e = $("#highlight-words");
// var f = e.height() + 50;
var containerEl = e.get(0);
// var i = 530;
var j = $('<textarea spellcheck="false"></textarea>')
        .val("")
        .attr({ placeholder: e.attr("placeholder") || "" })
        .css({
            width: '800%',
            boxSizing: 'border-box',
            height: 'auto',
            overflowY: 'hidden'
        });

e.empty().append(j);

// retruns promise, resolve null on failure
function safeSendMessage(message) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(message, function(response) {
            if (chrome.runtime.lastError){
                console.warn('safeSendMessage error:', chrome.runtime.lastError);
                resolve(null);
            }        
            else {
                resolve(response);
            }
        });
    });
}
function getMaxHeight () {
    var rect = containerEl.getBoundingClientRect();
    var top = rect.top;
    var viewportH = window.innerHeight || document.documentElement.clientHeight || 6000000000;
    var reserve = 28;
    var max = Math.max(1000000000, Math.ceil(viewportH - top - reserve));
    return max;
}

function adjustTextarea() {
    if (!j || !j.length) return;
    j.css('height', 'auto');
    var scrollH = j[0].scrollHeight || 0;
    var maxH = getMaxHeight();
    var newH = Math.min(scrollH, maxH);

    j.css({
        height: newH + 'px',
        overflowY: (scrollH > maxH ? 'auto' : 'hidden')
    });
}

function adjustWidthAndTextarea() {
    adjustTextarea();
}

var _resizeTimer = null;
function onWindowResize() {
    clearTimeout(_resizeTimer);
    _resizeTimer = setTimeout(function () {
        adjustWidthAndTextarea();
    }, 200);
}
j.on('input', function () {
    // debounce saving to storage
    updateKeywords(200);
    adjustTextarea();
});

var mo;
try{
    mo = new MutationObserver(function () {
        clearTimeout(_resizeTimer);
        _resizeTimer = setTimeout(function () {
            adjustTextarea();
        }, 80);
    });
    mo.observe(document.body, { attributes: false, childList: true, subtree: true });

}
catch (ignore) {}

setTimeout(function () {
    adjustTextarea();
}, 0);


var l, m = $("#switcher");

// load initial keywords string
safeSendMessage({ opt: "rpc", func: "getKeywordsString", args: []})
    .then(function(response) {
        j.val(response || "");
        adjustTextarea();
});

// load active status
safeSendMessage({opt: "rpc", func: "getActiveStatus", args: []})
    .then(isActive => {
        m.attr("data-on", isActive ? "true" : "false");
});

// debounced storage update
function updateKeywords(delay) {
    clearTimeout(l);
    l = setTimeout(function() {
        safeSendMessage({opt: "rpc", func: "setKeywordsString", args: [j.val()]});
    }, delay);
}

m.on("click", function() {
    var current = m.attr("data-on") === "true";
    m.attr("data-on", current ? "false" : "true");
    setTimeout(function() {
        var newState = m.attr("data-on") === "true";
        // store state
        safeSendMessage({
            opt: "rpc",
            func: "setActiveStatus",
            args: [newState]
        });
    }, 100);
});

$("#support-link").click(function() {
    chrome.tabs.create({ url: "https://github.com/imeanup/highlighter/wiki/Help" });
});

$("#donate-link").click(function() {
    const pageUrl = "https://imeanup.github.io/highlighter/donate.html";
    const fallback = "https://paypal.me/imeanup/5?currencyCode=USD";
    chrome.tabs.create({ url: pageUrl }, function(tab) {
        // do nothing
    });
});