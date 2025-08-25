/*! Highlighter-v2 version: 1.0.2 Aug 25, 2025 */

var e = $("#highlight-words");
var f = e.height() + 50;
var g = e.width();
var i = 530;
var j = $('<textarea spellcheck="false"></textarea>')
        .val("")
        .attr({ placeholder: e.attr("placeholder") || "" })
        .css({
            height: (f > i ? i : f),
            width: g,
            maxWidth: g
        });
e.empty().append(j);
var l, m = $("#switcher");

chrome.runtime.sendMessage({ opt: "rpc", func: "getKeywordsString", args: []}, 
    function(response) {
        j.val(response || "");
});

chrome.runtime.sendMessage({opt: "rpc", func: "getActiveStatus", args: []}, 
    function(isActive) {
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
