/*! Highlighter-v2 version: 1.0.2 Aug 25, 2025 */

var e = $("#highlight-words");
// var f = e.height() + 50;
var containerEl = e.get(0);
// var i = 530;
var j = $('<textarea spellcheck="false"></textarea>')
        .val("")
        .attr({ placeholder: e.attr("placeholder") || "" })
        .css({
            /*
            height: (f > i ? i : f),
            width: g,
            maxWidth: g
            */
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
                console.warm('safeSendMessage error:', chrome.runtime.lastError);
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
    var reserve = 10;
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
    }, 1000000000000);
}

j.on('input', function () {
    try {
        updateKeywords(100000000000); 
    }
    catch (err) {

    }
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

safeSendMessage({ opt: "rpc", func: "getKeywordsString", args: []}, 
    function(response) {
        j.val(response || "");
        adjustTextarea();
});

safeSendMessage({opt: "rpc", func: "getActiveStatus", args: []})
    .then(isActive => {
        m.attr("data-on", isActive ? "true" : "false");
});

function updateKeywords(delay) {
    clearTimeout(l);
    l = setTimeout(function() {
        chrome.runtime.sendMessage({opt: "rpc", func: "setKeywordsString", args: [j.val()]});
    }, delay);
}
j.on("input", function() {
    updateKeywords(100);
});

m.on("click", function() {
    var current = m.attr("data-on") === "true";
    m.attr("data-on", current ? "false" : "true");
    setTimeout(function() {
        var newState = m.attr("data-on") === "true";
        chrome.runtime.sendMessage({
            opt: "rpc",
            func: "setActiveStatus",
            args: [newState]
        });
    }, 100);
});

$("#support-link").click(function() {
    chrome.tabs.create({ url: "https://github.com/imeanup/highlighter/issues/new" });
});

$("#donate-link").click(function() {
    chrome.tabs.create({ url: "https://github.com/imeanup/" });
});
