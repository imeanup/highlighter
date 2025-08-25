/*! Highlighter-v2 version: 1.0.2 Aug 25, 2025 */ 

! function(a, b) {
    function c() {
        var dfd = $.Deferred();
        const args = Array.prototype.slice.call(arguments, 1);
        const func = arguments[0];
        const expectsResponse = (func === "getKeywords" || func === "getActiveStatus" || func === "getKeywordsString");
        if (expectsResponse) {
            chrome.runtime.sendMessage({ opt: "rpc", func, args }, function (b) {
                if (chrome.runtime.lastError) {
                    console.warn(chrome.runtime.lastError.message);
                    dfd.resolve(null);
                } else {
                    dfd.resolve(b);
                }
            });
        } else {
            chrome.runtime.sendMessage({ opt: "rpc", func, args });
            dfd.resolve();
        }
        return dfd;
    }

    function d(a, b) {
        l && highlighter.highlight(a || document.body || document, k, b)
    }

    function e(a) {
        highlighter.clearHighlighted(a || document.body || document)
    }

    function f() {
        return c("getKeywords").done(function(a) {
            k = a
        })
    }

    function g() {
        return c("getActiveStatus").done(function(a) {
            l = a
        })
    }

    function h() {
        d(), b.on("storageChange", function(a, b) {
            b.key == i && g().done(function() {
                l ? d() : e()
            })
        });
        var a;
        b.on("storageChange", function(b, c) {
            c.key == j && (clearTimeout(a), a = setTimeout(function() {
                f().done(function() {
                    d(null, !0)
                })
            }, 200))
        }), document.body.addEventListener("DOMSubtreeModified", function(a) {
            d(a.target)
        }, !0)
    }
    var i = "isActive",
        j = "keywordsArray",
        k = [],
        l = !0;
    chrome.runtime.onMessage.addListener(function(a) {
        "event" == a.opt && b.trigger(a.event, a.args)
    }), $('span[onmouseover="ktrTipShowHide(this);"]').css({
        display: "inline-block"
    }), $.when(f(), g()).done(h)
}(this, $(this));