/*! Multi-highlight version:1.21  18-06-2020 */ ! function(a, b) {
    var c = a.background = {},
        d = chrome.app.getDetails(),
        e = c.USER_ID_STORE = "userUUID",
        f = c.ACTIVE_STATUS_STORE = "isActive",
        g = c.KEYWORDS_STRING_STORE = "keywordsString",
        h = c.KEYWORDS_ARRAY_STORE = "keywordsArray";
    c.setLocalStorage = function(c, d) {
            var e = a.localStorage.getItem(c),
                f = e != d;
            a.localStorage.setItem(c, d), f && b.trigger("storageChange", {
                key: c,
                value: d
            })
        }, c.getLocalStorage = function(b) {
            return a.localStorage.getItem(b)
        }, c.getUserId = function() {
            function a() {
                for (var a = [], b = "0123456789abcdef", c = 0; 36 > c; c++) a[c] = b.substr(Math.floor(16 * Math.random()), 1);
                a[14] = "4", a[19] = b.substr(8 | 3 & a[19], 1), a[8] = a[13] = a[18] = a[23] = "-";
                var d = a.join("");
                return d
            }
            var b = this.getLocalStorage(e);
            return b || (b = a(), this.setLocalStorage(e, b)), b
        }, c.getActiveStatus = function() {
            return "false" == this.getLocalStorage(f) ? !1 : !0
        }, c.setActiveStatus = function(a) {
            this.setLocalStorage(f, a ? "true" : "false")
        }, c.getKeywordsString = function() {
            return this.getLocalStorage(g) || ""
        }, c.setKeywordsString = function(a) {
            this.setLocalStorage(g, a), this.setKeywords("" == $.trim(a) ? [] : $.trim(a).toLowerCase().split(/\s+/))
        }, c.getKeywords = function() {
            return JSON.parse(this.getLocalStorage(h)) || []
        }, c.setKeywords = function(a) {
            this.setLocalStorage(h, JSON.stringify(a))
        }, chrome.runtime.onMessage.addListener(function(a, b, d) {
            var e;
            "rpc" == a.opt && (e = c[a.func].apply(c, a.args)), d(e)
        }), b.on("storageChange", function(a, b) {
            console.log('Event "storageChange" on key "' + b.key + '" triggered.'), chrome.tabs.query({
                active: !0,
                currentWindow: !0
            }, function(a) {
                $.each(a, function() {
                    chrome.tabs.sendMessage(a[0].id, {
                        opt: "event",
                        event: "storageChange",
                        args: b
                    })
                })
            })
        }),
        function() {
            function a(a) {
                for (var b = 0, c = h.length; c > b; b++)
                    if (new RegExp(h[b].replace(/\*/gi, ".*?")).test(a)) return !0;
                return !1
            }

            function b(a) {
                for (var b = 0, c = f.length; c > b; b++) chrome.tabs.executeScript(a.id, {
                    file: f[b],
                    allFrames: e.all_frames
                });
                for (var b = 0, c = g.length; c > b; b++) chrome.tabs.insertCSS(a.id, {
                    file: g[b],
                    allFrames: e.all_frames
                })
            }

            function c() {
                chrome.windows.getAll({
                    populate: !0
                }, function(c) {
                    for (var d, e = 0, f = c.length; f > e; e++) {
                        d = c[e];
                        for (var g, h = 0, i = d.tabs.length; i > h; h++) g = d.tabs[h], a(g.url) && b(g)
                    }
                })
            }
            var e = d.content_scripts[0],
                f = e.js,
                g = e.css,
                h = e.matches;
            chrome.runtime.onInstalled.addListener(function(a) {
                "install" == a.reason && (console.log("This is a first install!"), c())
            })
        }()
}(this, $(this));