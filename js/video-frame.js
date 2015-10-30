 /**! @license
VideoFrame: HTML5 Video - SMTPE Time Code capturing and Frame Seeking API
Version: 0.1.9
(c) 2012 Allen Sarkisyan - Released under the Open Source MIT License

Contributors:
Allen Sarkisyan - Lead engineer
Paige Raynes - Product Development
Dan Jacinto - Video Asset Quality Analyst

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, and/or distribute copies of the
Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

- The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
- Attribution must be credited to the original authors in derivative works.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
var VideoFrame = function(a) {
    if (this === window)
        return new VideoFrame(a);
    this.obj = a || {};
    this.frameRate = this.obj.frameRate || 24;
    this.video = document.getElementById(this.obj.id) || document.getElementsByTagName("video")[0]
}, FrameRates = {film: 24,NTSC: 29.97,NTSC_Film: 23.98,NTSC_HD: 59.94,PAL: 25,PAL_HD: 50,web: 30,high: 60};
VideoFrame.prototype = {get: function() {
        return Math.floor(this.video.currentTime.toFixed(5) * this.frameRate)
    },listen: function(a, b) {
        var c = this;
        a ? this.interval = setInterval(function() {
            if (!c.video.paused && !c.video.ended) {
                var b = "SMPTE" === a ? c.toSMPTE() : "time" === a ? c.toTime() : c.get();
                c.obj.callback && c.obj.callback(b, a);
                return b
            }
        }, b ? b : 1E3 / c.frameRate / 2) : console.log("VideoFrame: Error - The listen method requires the format parameter.")
    },stopListen: function() {
        clearInterval(this.interval)
    },fps: FrameRates};
VideoFrame.prototype.toTime = function(a) {
    function b(a) {
        return 10 > a ? "0" + a : a
    }
    var c = "number" !== typeof a ? this.video.currentTime : a, e = this.frameRate, d = new Date;
    a = "hh:mm:ss" + ("number" === typeof a ? ":ff" : "");
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(1E3 * c);
    return a.replace(/hh|mm|ss|ff/g, function(a) {
        switch (a) {
            case "hh":
                return b(13 > d.getHours() ? d.getHours() : d.getHours() - 12);
            case "mm":
                return b(d.getMinutes());
            case "ss":
                return b(d.getSeconds());
            case "ff":
                return b(Math.floor(c % 1 * e))
        }
    })
};
VideoFrame.prototype.toSMPTE = function(a) {
    if (!a)
        return this.toTime(this.video.currentTime);
    a = Number(a);
    var b = this.frameRate, c = 60 * b, e = (a / (3600 * b)).toFixed(0), c = Number((a / c).toString().split(".")[0]) % 60, d = Number((a / b).toString().split(".")[0]) % 60;
    return (10 > e ? "0" + e : e) + ":" + (10 > c ? "0" + c : c) + ":" + (10 > d ? "0" + d : d) + ":" + (10 > a % b ? "0" + a % b : a % b)
};
VideoFrame.prototype.toSeconds = function(a) {
    if (!a)
        return Math.floor(this.video.currentTime);
    a = a.split(":");
    return 3600 * Number(a[0]) + 60 * Number(a[1]) + Number(a[2])
};
VideoFrame.prototype.toMilliseconds = function(a) {
    var b = !a ? Number(this.toSMPTE().split(":")[3]) : Number(a.split(":")[3]), b = 1E3 / this.frameRate * b;
    return Math.floor(1E3 * this.toSeconds(a) + b)
};
VideoFrame.prototype.toFrames = function(a) {
    a = !a ? this.toSMPTE().split(":") : a.split(":");
    var b = this.frameRate;
    return Math.floor(3600 * Number(a[0]) * b + 60 * Number(a[1]) * b + Number(a[2]) * b + Number(a[3]))
};
VideoFrame.prototype.__seek = function(a, b) {
    this.video.paused || this.video.pause();
    var c = Number(this.get());
    this.video.currentTime = ("backward" === a ? c - b : c + b) / this.frameRate + 1E-5
};
VideoFrame.prototype.seekForward = function(a, b) {
    a || (a = 1);
    this.__seek("forward", Number(a));
    return b ? b() : !0
};
VideoFrame.prototype.seekBackward = function(a, b) {
    a || (a = 1);
    this.__seek("backward", Number(a));
    return b ? b() : !0
};
/**! @license
* Modernizr 2.6.2 (Custom Build) | MIT & BSD
* Build: http://modernizr.com/download/#-fontface-backgroundsize-borderimage-borderradius-boxshadow-flexbox-flexboxlegacy-hsla-multiplebgs-opacity-rgba-textshadow-cssanimations-csscolumns-generatedcontent-cssgradients-cssreflections-csstransforms-csstransforms3d-csstransitions-applicationcache-canvas-canvastext-draganddrop-hashchange-history-audio-video-indexeddb-input-inputtypes-localstorage-postmessage-sessionstorage-websockets-websqldatabase-webworkers-geolocation-inlinesvg-smil-svg-svgclippaths-touch-webgl-shiv-cssclasses-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes-load
*/
window.Modernizr = function(a, b, c) {
    function C(a) {
        j.cssText = a
    }
    function D(a, b) {
        return C(n.join(a + ";") + (b || ""))
    }
    function E(a, b) {
        return typeof a === b
    }
    function F(a, b) {
        return !!~("" + a).indexOf(b)
    }
    function G(a, b) {
        for (var d in a) {
            var e = a[d];
            if (!F(e, "-") && j[e] !== c)
                return b == "pfx" ? e : !0
        }
        return !1
    }
    function H(a, b, d) {
        for (var e in a) {
            var f = b[a[e]];
            if (f !== c)
                return d === !1 ? a[e] : E(f, "function") ? f.bind(d || b) : f
        }
        return !1
    }
    function I(a, b, c) {
        var d = a.charAt(0).toUpperCase() + a.slice(1), e = (a + " " + p.join(d + " ") + d).split(" ");
        return E(b, "string") || E(b, "undefined") ? G(e, b) : (e = (a + " " + q.join(d + " ") + d).split(" "), H(e, b, c))
    }
    function J() {
        e.input = function(c) {
            for (var d = 0, e = c.length; d < e; d++)
                u[c[d]] = c[d] in k;
            return u.list && (u.list = !!b.createElement("datalist") && !!a.HTMLDataListElement), u
        }("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")), e.inputtypes = function(a) {
            for (var d = 0, e, f, h, i = a.length; d < i; d++)
                k.setAttribute("type", f = a[d]), e = k.type !== "text", e && (k.value = l, k.style.cssText = "position:absolute;visibility:hidden;", /^range$/.test(f) && k.style.WebkitAppearance !== c ? (g.appendChild(k), h = b.defaultView, e = h.getComputedStyle && h.getComputedStyle(k, null).WebkitAppearance !== "textfield" && k.offsetHeight !== 0, g.removeChild(k)) : /^(search|tel)$/.test(f) || (/^(url|email)$/.test(f) ? e = k.checkValidity && k.checkValidity() === !1 : e = k.value != l)), t[a[d]] = !!e;
            return t
        }("search tel url email datetime date month week time datetime-local number range color".split(" "))
    }
    var d = "2.6.2", e = {}, f = !0, g = b.documentElement, h = "modernizr", i = b.createElement(h), j = i.style, k = b.createElement("input"), l = ":)", m = {}.toString, n = " -webkit- -moz- -o- -ms- ".split(" "), o = "Webkit Moz O ms", p = o.split(" "), q = o.toLowerCase().split(" "), r = {svg: "http://www.w3.org/2000/svg"}, s = {}, t = {}, u = {}, v = [], w = v.slice, x, y = function(a, c, d, e) {
        var f, i, j, k, l = b.createElement("div"), m = b.body, n = m || b.createElement("body");
        if (parseInt(d, 10))
            while (d--)
                j = b.createElement("div"), j.id = e ? e[d] : h + (d + 1), l.appendChild(j);
        return f = ["&#173;", '<style id="s', h, '">', a, "</style>"].join(""), l.id = h, (m ? l : n).innerHTML += f, n.appendChild(l), m || (n.style.background = "", n.style.overflow = "hidden", k = g.style.overflow, g.style.overflow = "hidden", g.appendChild(n)), i = c(l, a), m ? l.parentNode.removeChild(l) : (n.parentNode.removeChild(n), g.style.overflow = k), !!i
    }, z = function() {
        function d(d, e) {
            e = e || b.createElement(a[d] || "div"), d = "on" + d;
            var f = d in e;
            return f || (e.setAttribute || (e = b.createElement("div")), e.setAttribute && e.removeAttribute && (e.setAttribute(d, ""), f = E(e[d], "function"), E(e[d], "undefined") || (e[d] = c), e.removeAttribute(d))), e = null, f
        }
        var a = {select: "input",change: "input",submit: "form",reset: "form",error: "img",load: "img",abort: "img"};
        return d
    }(), A = {}.hasOwnProperty, B;
    !E(A, "undefined") && !E(A.call, "undefined") ? B = function(a, b) {
        return A.call(a, b)
    } : B = function(a, b) {
        return b in a && E(a.constructor.prototype[b], "undefined")
    }, Function.prototype.bind || (Function.prototype.bind = function(b) {
        var c = this;
        if (typeof c != "function")
            throw new TypeError;
        var d = w.call(arguments, 1), e = function() {
            if (this instanceof e) {
                var a = function() {
                };
                a.prototype = c.prototype;
                var f = new a, g = c.apply(f, d.concat(w.call(arguments)));
                return Object(g) === g ? g : f
            }
            return c.apply(b, d.concat(w.call(arguments)))
        };
        return e
    }), s.flexbox = function() {
        return I("flexWrap")
    }, s.flexboxlegacy = function() {
        return I("boxDirection")
    }, s.canvas = function() {
        var a = b.createElement("canvas");
        return !!a.getContext && !!a.getContext("2d")
    }, s.canvastext = function() {
        return !!e.canvas && !!E(b.createElement("canvas").getContext("2d").fillText, "function")
    }, s.webgl = function() {
        return !!a.WebGLRenderingContext
    }, s.touch = function() {
        var c;
        return "ontouchstart" in a || a.DocumentTouch && b instanceof DocumentTouch ? c = !0 : y(["@media (", n.join("touch-enabled),("), h, ")", "{#modernizr{top:9px;position:absolute}}"].join(""), function(a) {
            c = a.offsetTop === 9
        }), c
    }, s.geolocation = function() {
        return "geolocation" in navigator
    }, s.postmessage = function() {
        return !!a.postMessage
    }, s.websqldatabase = function() {
        return !!a.openDatabase
    }, s.indexedDB = function() {
        return !!I("indexedDB", a)
    }, s.hashchange = function() {
        return z("hashchange", a) && (b.documentMode === c || b.documentMode > 7)
    }, s.history = function() {
        return !!a.history && !!history.pushState
    }, s.draganddrop = function() {
        var a = b.createElement("div");
        return "draggable" in a || "ondragstart" in a && "ondrop" in a
    }, s.websockets = function() {
        return "WebSocket" in a || "MozWebSocket" in a
    }, s.rgba = function() {
        return C("background-color:rgba(150,255,150,.5)"), F(j.backgroundColor, "rgba")
    }, s.hsla = function() {
        return C("background-color:hsla(120,40%,100%,.5)"), F(j.backgroundColor, "rgba") || F(j.backgroundColor, "hsla")
    }, s.multiplebgs = function() {
        return C("background:url(https://),url(https://),red url(https://)"), /(url\s*\(.*?){3}/.test(j.background)
    }, s.backgroundsize = function() {
        return I("backgroundSize")
    }, s.borderimage = function() {
        return I("borderImage")
    }, s.borderradius = function() {
        return I("borderRadius")
    }, s.boxshadow = function() {
        return I("boxShadow")
    }, s.textshadow = function() {
        return b.createElement("div").style.textShadow === ""
    }, s.opacity = function() {
        return D("opacity:.55"), /^0.55$/.test(j.opacity)
    }, s.cssanimations = function() {
        return I("animationName")
    }, s.csscolumns = function() {
        return I("columnCount")
    }, s.cssgradients = function() {
        var a = "background-image:", b = "gradient(linear,left top,right bottom,from(#9f9),to(white));", c = "linear-gradient(left top,#9f9, white);";
        return C((a + "-webkit- ".split(" ").join(b + a) + n.join(c + a)).slice(0, -a.length)), F(j.backgroundImage, "gradient")
    }, s.cssreflections = function() {
        return I("boxReflect")
    }, s.csstransforms = function() {
        return !!I("transform")
    }, s.csstransforms3d = function() {
        var a = !!I("perspective");
        return a && "webkitPerspective" in g.style && y("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}", function(b, c) {
            a = b.offsetLeft === 9 && b.offsetHeight === 3
        }), a
    }, s.csstransitions = function() {
        return I("transition")
    }, s.fontface = function() {
        var a;
        return y('@font-face {font-family:"font";src:url("https://")}', function(c, d) {
            var e = b.getElementById("smodernizr"), f = e.sheet || e.styleSheet, g = f ? f.cssRules && f.cssRules[0] ? f.cssRules[0].cssText : f.cssText || "" : "";
            a = /src/i.test(g) && g.indexOf(d.split(" ")[0]) === 0
        }), a
    }, s.generatedcontent = function() {
        var a;
        return y(["#", h, "{font:0/0 a}#", h, ':after{content:"', l, '";visibility:hidden;font:3px/1 a}'].join(""), function(b) {
            a = b.offsetHeight >= 3
        }), a
    }, s.video = function() {
        var a = b.createElement("video"), c = !1;
        try {
            if (c = !!a.canPlayType)
                c = new Boolean(c), c.ogg = a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, ""), c.h264 = a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, ""), c.webm = a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, "")
        } catch (d) {
        }
        return c
    }, s.audio = function() {
        var a = b.createElement("audio"), c = !1;
        try {
            if (c = !!a.canPlayType)
                c = new Boolean(c), c.ogg = a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""), c.mp3 = a.canPlayType("audio/mpeg;").replace(/^no$/, ""), c.wav = a.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""), c.m4a = (a.canPlayType("audio/x-m4a;") || a.canPlayType("audio/aac;")).replace(/^no$/, "")
        } catch (d) {
        }
        return c
    }, s.localstorage = function() {
        try {
            return localStorage.setItem(h, h), localStorage.removeItem(h), !0
        } catch (a) {
            return !1
        }
    }, s.sessionstorage = function() {
        try {
            return sessionStorage.setItem(h, h), sessionStorage.removeItem(h), !0
        } catch (a) {
            return !1
        }
    }, s.webworkers = function() {
        return !!a.Worker
    }, s.applicationcache = function() {
        return !!a.applicationCache
    }, s.svg = function() {
        return !!b.createElementNS && !!b.createElementNS(r.svg, "svg").createSVGRect
    }, s.inlinesvg = function() {
        var a = b.createElement("div");
        return a.innerHTML = "<svg/>", (a.firstChild && a.firstChild.namespaceURI) == r.svg
    }, s.smil = function() {
        return !!b.createElementNS && /SVGAnimate/.test(m.call(b.createElementNS(r.svg, "animate")))
    }, s.svgclippaths = function() {
        return !!b.createElementNS && /SVGClipPath/.test(m.call(b.createElementNS(r.svg, "clipPath")))
    };
    for (var K in s)
        B(s, K) && (x = K.toLowerCase(), e[x] = s[K](), v.push((e[x] ? "" : "no-") + x));
    return e.input || J(), e.addTest = function(a, b) {
        if (typeof a == "object")
            for (var d in a)
                B(a, d) && e.addTest(d, a[d]);
        else {
            a = a.toLowerCase();
            if (e[a] !== c)
                return e;
            b = typeof b == "function" ? b() : b, typeof f != "undefined" && f && (g.className += " " + (b ? "" : "no-") + a), e[a] = b
        }
        return e
    }, C(""), i = k = null, function(a, b) {
        function k(a, b) {
            var c = a.createElement("p"), d = a.getElementsByTagName("head")[0] || a.documentElement;
            return c.innerHTML = "x<style>" + b + "</style>", d.insertBefore(c.lastChild, d.firstChild)
        }
        function l() {
            var a = r.elements;
            return typeof a == "string" ? a.split(" ") : a
        }
        function m(a) {
            var b = i[a[g]];
            return b || (b = {}, h++, a[g] = h, i[h] = b), b
        }
        function n(a, c, f) {
            c || (c = b);
            if (j)
                return c.createElement(a);
            f || (f = m(c));
            var g;
            return f.cache[a] ? g = f.cache[a].cloneNode() : e.test(a) ? g = (f.cache[a] = f.createElem(a)).cloneNode() : g = f.createElem(a), g.canHaveChildren && !d.test(a) ? f.frag.appendChild(g) : g
        }
        function o(a, c) {
            a || (a = b);
            if (j)
                return a.createDocumentFragment();
            c = c || m(a);
            var d = c.frag.cloneNode(), e = 0, f = l(), g = f.length;
            for (; e < g; e++)
                d.createElement(f[e]);
            return d
        }
        function p(a, b) {
            b.cache || (b.cache = {}, b.createElem = a.createElement, b.createFrag = a.createDocumentFragment, b.frag = b.createFrag()), a.createElement = function(c) {
                return r.shivMethods ? n(c, a, b) : b.createElem(c)
            }, a.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + l().join().replace(/\w+/g, function(a) {
                return b.createElem(a), b.frag.createElement(a), 'c("' + a + '")'
            }) + ");return n}")(r, b.frag)
        }
        function q(a) {
            a || (a = b);
            var c = m(a);
            return r.shivCSS && !f && !c.hasCSS && (c.hasCSS = !!k(a, "article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")), j || p(a, c), a
        }
        var c = a.html5 || {}, d = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i, e = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i, f, g = "_html5shiv", h = 0, i = {}, j;
        (function() {
            try {
                var a = b.createElement("a");
                a.innerHTML = "<xyz></xyz>", f = "hidden" in a, j = a.childNodes.length == 1 || function() {
                    b.createElement("a");
                    var a = b.createDocumentFragment();
                    return typeof a.cloneNode == "undefined" || typeof a.createDocumentFragment == "undefined" || typeof a.createElement == "undefined"
                }()
            } catch (c) {
                f = !0, j = !0
            }
        })();
        var r = {elements: c.elements || "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS: c.shivCSS !== !1,supportsUnknownElements: j,shivMethods: c.shivMethods !== !1,type: "default",shivDocument: q,createElement: n,createDocumentFragment: o};
        a.html5 = r, q(b)
    }(this, b), e._version = d, e._prefixes = n, e._domPrefixes = q, e._cssomPrefixes = p, e.hasEvent = z, e.testProp = function(a) {
        return G([a])
    }, e.testAllProps = I, e.testStyles = y, g.className = g.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (f ? " js " + v.join(" ") : ""), e
}(this, this.document), function(a, b, c) {
    function d(a) {
        return "[object Function]" == o.call(a)
    }
    function e(a) {
        return "string" == typeof a
    }
    function f() {
    }
    function g(a) {
        return !a || "loaded" == a || "complete" == a || "uninitialized" == a
    }
    function h() {
        var a = p.shift();
        q = 1, a ? a.t ? m(function() {
            ("c" == a.t ? B.injectCss : B.injectJs)(a.s, 0, a.a, a.x, a.e, 1)
        }, 0) : (a(), h()) : q = 0
    }
    function i(a, c, d, e, f, i, j) {
        function k(b) {
            if (!o && g(l.readyState) && (u.r = o = 1, !q && h(), l.onload = l.onreadystatechange = null, b)) {
                "img" != a && m(function() {
                    t.removeChild(l)
                }, 50);
                for (var d in y[c])
                    y[c].hasOwnProperty(d) && y[c][d].onload()
            }
        }
        var j = j || B.errorTimeout, l = b.createElement(a), o = 0, r = 0, u = {t: d,s: c,e: f,a: i,x: j};
        1 === y[c] && (r = 1, y[c] = []), "object" == a ? l.data = c : (l.src = c, l.type = a), l.width = l.height = "0", l.onerror = l.onload = l.onreadystatechange = function() {
            k.call(this, r)
        }, p.splice(e, 0, u), "img" != a && (r || 2 === y[c] ? (t.insertBefore(l, s ? null : n), m(k, j)) : y[c].push(l))
    }
    function j(a, b, c, d, f) {
        return q = 0, b = b || "j", e(a) ? i("c" == b ? v : u, a, b, this.i++, c, d, f) : (p.splice(this.i++, 0, a), 1 == p.length && h()), this
    }
    function k() {
        var a = B;
        return a.loader = {load: j,i: 0}, a
    }
    var l = b.documentElement, m = a.setTimeout, n = b.getElementsByTagName("script")[0], o = {}.toString, p = [], q = 0, r = "MozAppearance" in l.style, s = r && !!b.createRange().compareNode, t = s ? l : n.parentNode, l = a.opera && "[object Opera]" == o.call(a.opera), l = !!b.attachEvent && !l, u = r ? "object" : l ? "script" : "img", v = l ? "script" : u, w = Array.isArray || function(a) {
        return "[object Array]" == o.call(a)
    }, x = [], y = {}, z = {timeout: function(a, b) {
            return b.length && (a.timeout = b[0]), a
        }}, A, B;
    B = function(a) {
        function b(a) {
            var a = a.split("!"), b = x.length, c = a.pop(), d = a.length, c = {url: c,origUrl: c,prefixes: a}, e, f, g;
            for (f = 0; f < d; f++)
                g = a[f].split("="), (e = z[g.shift()]) && (c = e(c, g));
            for (f = 0; f < b; f++)
                c = x[f](c);
            return c
        }
        function g(a, e, f, g, h) {
            var i = b(a), j = i.autoCallback;
            i.url.split(".").pop().split("?").shift(), i.bypass || (e && (e = d(e) ? e : e[a] || e[g] || e[a.split("/").pop().split("?")[0]]), i.instead ? i.instead(a, e, f, g, h) : (y[i.url] ? i.noexec = !0 : y[i.url] = 1, f.load(i.url, i.forceCSS || !i.forceJS && "css" == i.url.split(".").pop().split("?").shift() ? "c" : c, i.noexec, i.attrs, i.timeout), (d(e) || d(j)) && f.load(function() {
                k(), e && e(i.origUrl, h, g), j && j(i.origUrl, h, g), y[i.url] = 2
            })))
        }
        function h(a, b) {
            function c(a, c) {
                if (a) {
                    if (e(a))
                        c || (j = function() {
                            var a = [].slice.call(arguments);
                            k.apply(this, a), l()
                        }), g(a, j, b, 0, h);
                    else if (Object(a) === a)
                        for (n in m = function() {
                            var b = 0, c;
                            for (c in a)
                                a.hasOwnProperty(c) && b++;
                            return b
                        }(), a)
                            a.hasOwnProperty(n) && (!c && !--m && (d(j) ? j = function() {
                                var a = [].slice.call(arguments);
                                k.apply(this, a), l()
                            } : j[n] = function(a) {
                                return function() {
                                    var b = [].slice.call(arguments);
                                    a && a.apply(this, b), l()
                                }
                            }(k[n])), g(a[n], j, b, n, h))
                } else
                    !c && l()
            }
            var h = !!a.test, i = a.load || a.both, j = a.callback || f, k = j, l = a.complete || f, m, n;
            c(h ? a.yep : a.nope, !!i), i && c(i)
        }
        var i, j, l = this.yepnope.loader;
        if (e(a))
            g(a, 0, l, 0);
        else if (w(a))
            for (i = 0; i < a.length; i++)
                j = a[i], e(j) ? g(j, 0, l, 0) : w(j) ? B(j) : Object(j) === j && h(j, l);
        else
            Object(a) === a && h(a, l)
    }, B.addPrefix = function(a, b) {
        z[a] = b
    }, B.addFilter = function(a) {
        x.push(a)
    }, B.errorTimeout = 1e4, null == b.readyState && b.addEventListener && (b.readyState = "loading", b.addEventListener("DOMContentLoaded", A = function() {
        b.removeEventListener("DOMContentLoaded", A, 0), b.readyState = "complete"
    }, 0)), a.yepnope = k(), a.yepnope.executeStack = h, a.yepnope.injectJs = function(a, c, d, e, i, j) {
        var k = b.createElement("script"), l, o, e = e || B.errorTimeout;
        k.src = a;
        for (o in d)
            k.setAttribute(o, d[o]);
        c = j ? h : c || f, k.onreadystatechange = k.onload = function() {
            !l && g(k.readyState) && (l = 1, c(), k.onload = k.onreadystatechange = null)
        }, m(function() {
            l || (l = 1, c(1))
        }, e), i ? k.onload() : n.parentNode.insertBefore(k, n)
    }, a.yepnope.injectCss = function(a, c, d, e, g, i) {
        var e = b.createElement("link"), j, c = i ? h : c || f;
        e.href = a, e.rel = "stylesheet", e.type = "text/css";
        for (j in d)
            e.setAttribute(j, d[j]);
        g || (n.parentNode.insertBefore(e, n), m(c, 0))
    }
}(this, document), Modernizr.load = function() {
    yepnope.apply(window, [].slice.call(arguments, 0))
};
/**! @license 
* jQuery v1.8.2 jquery.com | jquery.org/license 
*/
(function(a, b) {
    function G(a) {
        var b = F[a] = {};
        return p.each(a.split(s), function(a, c) {
            b[c] = !0
        }), b
    }
    function J(a, c, d) {
        if (d === b && a.nodeType === 1) {
            var e = "data-" + c.replace(I, "-$1").toLowerCase();
            d = a.getAttribute(e);
            if (typeof d == "string") {
                try {
                    d = d === "true" ? !0 : d === "false" ? !1 : d === "null" ? null : +d + "" === d ? +d : H.test(d) ? p.parseJSON(d) : d
                } catch (f) {
                }
                p.data(a, c, d)
            } else
                d = b
        }
        return d
    }
    function K(a) {
        var b;
        for (b in a) {
            if (b === "data" && p.isEmptyObject(a[b]))
                continue;
            if (b !== "toJSON")
                return !1
        }
        return !0
    }
    function ba() {
        return !1
    }
    function bb() {
        return !0
    }
    function bh(a) {
        return !a || !a.parentNode || a.parentNode.nodeType === 11
    }
    function bi(a, b) {
        do
            a = a[b];
        while (a && a.nodeType !== 1);
        return a
    }
    function bj(a, b, c) {
        b = b || 0;
        if (p.isFunction(b))
            return p.grep(a, function(a, d) {
                var e = !!b.call(a, d, a);
                return e === c
            });
        if (b.nodeType)
            return p.grep(a, function(a, d) {
                return a === b === c
            });
        if (typeof b == "string") {
            var d = p.grep(a, function(a) {
                return a.nodeType === 1
            });
            if (be.test(b))
                return p.filter(b, d, !c);
            b = p.filter(b, d)
        }
        return p.grep(a, function(a, d) {
            return p.inArray(a, b) >= 0 === c
        })
    }
    function bk(a) {
        var b = bl.split("|"), c = a.createDocumentFragment();
        if (c.createElement)
            while (b.length)
                c.createElement(b.pop());
        return c
    }
    function bC(a, b) {
        return a.getElementsByTagName(b)[0] || a.appendChild(a.ownerDocument.createElement(b))
    }
    function bD(a, b) {
        if (b.nodeType !== 1 || !p.hasData(a))
            return;
        var c, d, e, f = p._data(a), g = p._data(b, f), h = f.events;
        if (h) {
            delete g.handle, g.events = {};
            for (c in h)
                for (d = 0, e = h[c].length; d < e; d++)
                    p.event.add(b, c, h[c][d])
        }
        g.data && (g.data = p.extend({}, g.data))
    }
    function bE(a, b) {
        var c;
        if (b.nodeType !== 1)
            return;
        b.clearAttributes && b.clearAttributes(), b.mergeAttributes && b.mergeAttributes(a), c = b.nodeName.toLowerCase(), c === "object" ? (b.parentNode && (b.outerHTML = a.outerHTML), p.support.html5Clone && a.innerHTML && !p.trim(b.innerHTML) && (b.innerHTML = a.innerHTML)) : c === "input" && bv.test(a.type) ? (b.defaultChecked = b.checked = a.checked, b.value !== a.value && (b.value = a.value)) : c === "option" ? b.selected = a.defaultSelected : c === "input" || c === "textarea" ? b.defaultValue = a.defaultValue : c === "script" && b.text !== a.text && (b.text = a.text), b.removeAttribute(p.expando)
    }
    function bF(a) {
        return typeof a.getElementsByTagName != "undefined" ? a.getElementsByTagName("*") : typeof a.querySelectorAll != "undefined" ? a.querySelectorAll("*") : []
    }
    function bG(a) {
        bv.test(a.type) && (a.defaultChecked = a.checked)
    }
    function bY(a, b) {
        if (b in a)
            return b;
        var c = b.charAt(0).toUpperCase() + b.slice(1), d = b, e = bW.length;
        while (e--) {
            b = bW[e] + c;
            if (b in a)
                return b
        }
        return d
    }
    function bZ(a, b) {
        return a = b || a, p.css(a, "display") === "none" || !p.contains(a.ownerDocument, a)
    }
    function b$(a, b) {
        var c, d, e = [], f = 0, g = a.length;
        for (; f < g; f++) {
            c = a[f];
            if (!c.style)
                continue;
            e[f] = p._data(c, "olddisplay"), b ? (!e[f] && c.style.display === "none" && (c.style.display = ""), c.style.display === "" && bZ(c) && (e[f] = p._data(c, "olddisplay", cc(c.nodeName)))) : (d = bH(c, "display"), !e[f] && d !== "none" && p._data(c, "olddisplay", d))
        }
        for (f = 0; f < g; f++) {
            c = a[f];
            if (!c.style)
                continue;
            if (!b || c.style.display === "none" || c.style.display === "")
                c.style.display = b ? e[f] || "" : "none"
        }
        return a
    }
    function b_(a, b, c) {
        var d = bP.exec(b);
        return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b
    }
    function ca(a, b, c, d) {
        var e = c === (d ? "border" : "content") ? 4 : b === "width" ? 1 : 0, f = 0;
        for (; e < 4; e += 2)
            c === "margin" && (f += p.css(a, c + bV[e], !0)), d ? (c === "content" && (f -= parseFloat(bH(a, "padding" + bV[e])) || 0), c !== "margin" && (f -= parseFloat(bH(a, "border" + bV[e] + "Width")) || 0)) : (f += parseFloat(bH(a, "padding" + bV[e])) || 0, c !== "padding" && (f += parseFloat(bH(a, "border" + bV[e] + "Width")) || 0));
        return f
    }
    function cb(a, b, c) {
        var d = b === "width" ? a.offsetWidth : a.offsetHeight, e = !0, f = p.support.boxSizing && p.css(a, "boxSizing") === "border-box";
        if (d <= 0 || d == null) {
            d = bH(a, b);
            if (d < 0 || d == null)
                d = a.style[b];
            if (bQ.test(d))
                return d;
            e = f && (p.support.boxSizingReliable || d === a.style[b]), d = parseFloat(d) || 0
        }
        return d + ca(a, b, c || (f ? "border" : "content"), e) + "px"
    }
    function cc(a) {
        if (bS[a])
            return bS[a];
        var b = p("<" + a + ">").appendTo(e.body), c = b.css("display");
        b.remove();
        if (c === "none" || c === "") {
            bI = e.body.appendChild(bI || p.extend(e.createElement("iframe"), {frameBorder: 0,width: 0,height: 0}));
            if (!bJ || !bI.createElement)
                bJ = (bI.contentWindow || bI.contentDocument).document, bJ.write("<!doctype html><html><body>"), bJ.close();
            b = bJ.body.appendChild(bJ.createElement(a)), c = bH(b, "display"), e.body.removeChild(bI)
        }
        return bS[a] = c, c
    }
    function ci(a, b, c, d) {
        var e;
        if (p.isArray(b))
            p.each(b, function(b, e) {
                c || ce.test(a) ? d(a, e) : ci(a + "[" + (typeof e == "object" ? b : "") + "]", e, c, d)
            });
        else if (!c && p.type(b) === "object")
            for (e in b)
                ci(a + "[" + e + "]", b[e], c, d);
        else
            d(a, b)
    }
    function cz(a) {
        return function(b, c) {
            typeof b != "string" && (c = b, b = "*");
            var d, e, f, g = b.toLowerCase().split(s), h = 0, i = g.length;
            if (p.isFunction(c))
                for (; h < i; h++)
                    d = g[h], f = /^\+/.test(d), f && (d = d.substr(1) || "*"), e = a[d] = a[d] || [], e[f ? "unshift" : "push"](c)
        }
    }
    function cA(a, c, d, e, f, g) {
        f = f || c.dataTypes[0], g = g || {}, g[f] = !0;
        var h, i = a[f], j = 0, k = i ? i.length : 0, l = a === cv;
        for (; j < k && (l || !h); j++)
            h = i[j](c, d, e), typeof h == "string" && (!l || g[h] ? h = b : (c.dataTypes.unshift(h), h = cA(a, c, d, e, h, g)));
        return (l || !h) && !g["*"] && (h = cA(a, c, d, e, "*", g)), h
    }
    function cB(a, c) {
        var d, e, f = p.ajaxSettings.flatOptions || {};
        for (d in c)
            c[d] !== b && ((f[d] ? a : e || (e = {}))[d] = c[d]);
        e && p.extend(!0, a, e)
    }
    function cC(a, c, d) {
        var e, f, g, h, i = a.contents, j = a.dataTypes, k = a.responseFields;
        for (f in k)
            f in d && (c[k[f]] = d[f]);
        while (j[0] === "*")
            j.shift(), e === b && (e = a.mimeType || c.getResponseHeader("content-type"));
        if (e)
            for (f in i)
                if (i[f] && i[f].test(e)) {
                    j.unshift(f);
                    break
                }
        if (j[0] in d)
            g = j[0];
        else {
            for (f in d) {
                if (!j[0] || a.converters[f + " " + j[0]]) {
                    g = f;
                    break
                }
                h || (h = f)
            }
            g = g || h
        }
        if (g)
            return g !== j[0] && j.unshift(g), d[g]
    }
    function cD(a, b) {
        var c, d, e, f, g = a.dataTypes.slice(), h = g[0], i = {}, j = 0;
        a.dataFilter && (b = a.dataFilter(b, a.dataType));
        if (g[1])
            for (c in a.converters)
                i[c.toLowerCase()] = a.converters[c];
        for (; e = g[++j]; )
            if (e !== "*") {
                if (h !== "*" && h !== e) {
                    c = i[h + " " + e] || i["* " + e];
                    if (!c)
                        for (d in i) {
                            f = d.split(" ");
                            if (f[1] === e) {
                                c = i[h + " " + f[0]] || i["* " + f[0]];
                                if (c) {
                                    c === !0 ? c = i[d] : i[d] !== !0 && (e = f[0], g.splice(j--, 0, e));
                                    break
                                }
                            }
                        }
                    if (c !== !0)
                        if (c && a["throws"])
                            b = c(b);
                        else
                            try {
                                b = c(b)
                            } catch (k) {
                                return {state: "parsererror",error: c ? k : "No conversion from " + h + " to " + e}
                            }
                }
                h = e
            }
        return {state: "success",data: b}
    }
    function cL() {
        try {
            return new a.XMLHttpRequest
        } catch (b) {
        }
    }
    function cM() {
        try {
            return new a.ActiveXObject("Microsoft.XMLHTTP")
        } catch (b) {
        }
    }
    function cU() {
        return setTimeout(function() {
            cN = b
        }, 0), cN = p.now()
    }
    function cV(a, b) {
        p.each(b, function(b, c) {
            var d = (cT[b] || []).concat(cT["*"]), e = 0, f = d.length;
            for (; e < f; e++)
                if (d[e].call(a, b, c))
                    return
        })
    }
    function cW(a, b, c) {
        var d, e = 0, f = 0, g = cS.length, h = p.Deferred().always(function() {
            delete i.elem
        }), i = function() {
            var b = cN || cU(), c = Math.max(0, j.startTime + j.duration - b), d = 1 - (c / j.duration || 0), e = 0, f = j.tweens.length;
            for (; e < f; e++)
                j.tweens[e].run(d);
            return h.notifyWith(a, [j, d, c]), d < 1 && f ? c : (h.resolveWith(a, [j]), !1)
        }, j = h.promise({elem: a,props: p.extend({}, b),opts: p.extend(!0, {specialEasing: {}}, c),originalProperties: b,originalOptions: c,startTime: cN || cU(),duration: c.duration,tweens: [],createTween: function(b, c, d) {
                var e = p.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
                return j.tweens.push(e), e
            },stop: function(b) {
                var c = 0, d = b ? j.tweens.length : 0;
                for (; c < d; c++)
                    j.tweens[c].run(1);
                return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]), this
            }}), k = j.props;
        cX(k, j.opts.specialEasing);
        for (; e < g; e++) {
            d = cS[e].call(j, a, k, j.opts);
            if (d)
                return d
        }
        return cV(j, k), p.isFunction(j.opts.start) && j.opts.start.call(a, j), p.fx.timer(p.extend(i, {anim: j,queue: j.opts.queue,elem: a})), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
    }
    function cX(a, b) {
        var c, d, e, f, g;
        for (c in a) {
            d = p.camelCase(c), e = b[d], f = a[c], p.isArray(f) && (e = f[1], f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = p.cssHooks[d];
            if (g && "expand" in g) {
                f = g.expand(f), delete a[d];
                for (c in f)
                    c in a || (a[c] = f[c], b[c] = e)
            } else
                b[d] = e
        }
    }
    function cY(a, b, c) {
        var d, e, f, g, h, i, j, k, l = this, m = a.style, n = {}, o = [], q = a.nodeType && bZ(a);
        c.queue || (j = p._queueHooks(a, "fx"), j.unqueued == null && (j.unqueued = 0, k = j.empty.fire, j.empty.fire = function() {
            j.unqueued || k()
        }), j.unqueued++, l.always(function() {
            l.always(function() {
                j.unqueued--, p.queue(a, "fx").length || j.empty.fire()
            })
        })), a.nodeType === 1 && ("height" in b || "width" in b) && (c.overflow = [m.overflow, m.overflowX, m.overflowY], p.css(a, "display") === "inline" && p.css(a, "float") === "none" && (!p.support.inlineBlockNeedsLayout || cc(a.nodeName) === "inline" ? m.display = "inline-block" : m.zoom = 1)), c.overflow && (m.overflow = "hidden", p.support.shrinkWrapBlocks || l.done(function() {
            m.overflow = c.overflow[0], m.overflowX = c.overflow[1], m.overflowY = c.overflow[2]
        }));
        for (d in b) {
            f = b[d];
            if (cP.exec(f)) {
                delete b[d];
                if (f === (q ? "hide" : "show"))
                    continue;
                o.push(d)
            }
        }
        g = o.length;
        if (g) {
            h = p._data(a, "fxshow") || p._data(a, "fxshow", {}), q ? p(a).show() : l.done(function() {
                p(a).hide()
            }), l.done(function() {
                var b;
                p.removeData(a, "fxshow", !0);
                for (b in n)
                    p.style(a, b, n[b])
            });
            for (d = 0; d < g; d++)
                e = o[d], i = l.createTween(e, q ? h[e] : 0), n[e] = h[e] || p.style(a, e), e in h || (h[e] = i.start, q && (i.end = i.start, i.start = e === "width" || e === "height" ? 1 : 0))
        }
    }
    function cZ(a, b, c, d, e) {
        return new cZ.prototype.init(a, b, c, d, e)
    }
    function c$(a, b) {
        var c, d = {height: a}, e = 0;
        b = b ? 1 : 0;
        for (; e < 4; e += 2 - b)
            c = bV[e], d["margin" + c] = d["padding" + c] = a;
        return b && (d.opacity = d.width = a), d
    }
    function da(a) {
        return p.isWindow(a) ? a : a.nodeType === 9 ? a.defaultView || a.parentWindow : !1
    }
    var c, d, e = a.document, f = a.location, g = a.navigator, h = a.jQuery, i = a.$, j = Array.prototype.push, k = Array.prototype.slice, l = Array.prototype.indexOf, m = Object.prototype.toString, n = Object.prototype.hasOwnProperty, o = String.prototype.trim, p = function(a, b) {
        return new p.fn.init(a, b, c)
    }, q = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source, r = /\S/, s = /\s+/, t = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, u = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/, v = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, w = /^[\],:{}\s]*$/, x = /(?:^|:|,)(?:\s*\[)+/g, y = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, z = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g, A = /^-ms-/, B = /-([\da-z])/gi, C = function(a, b) {
        return (b + "").toUpperCase()
    }, D = function() {
        e.addEventListener ? (e.removeEventListener("DOMContentLoaded", D, !1), p.ready()) : e.readyState === "complete" && (e.detachEvent("onreadystatechange", D), p.ready())
    }, E = {};
    p.fn = p.prototype = {constructor: p,init: function(a, c, d) {
            var f, g, h, i;
            if (!a)
                return this;
            if (a.nodeType)
                return this.context = this[0] = a, this.length = 1, this;
            if (typeof a == "string") {
                a.charAt(0) === "<" && a.charAt(a.length - 1) === ">" && a.length >= 3 ? f = [null, a, null] : f = u.exec(a);
                if (f && (f[1] || !c)) {
                    if (f[1])
                        return c = c instanceof p ? c[0] : c, i = c && c.nodeType ? c.ownerDocument || c : e, a = p.parseHTML(f[1], i, !0), v.test(f[1]) && p.isPlainObject(c) && this.attr.call(a, c, !0), p.merge(this, a);
                    g = e.getElementById(f[2]);
                    if (g && g.parentNode) {
                        if (g.id !== f[2])
                            return d.find(a);
                        this.length = 1, this[0] = g
                    }
                    return this.context = e, this.selector = a, this
                }
                return !c || c.jquery ? (c || d).find(a) : this.constructor(c).find(a)
            }
            return p.isFunction(a) ? d.ready(a) : (a.selector !== b && (this.selector = a.selector, this.context = a.context), p.makeArray(a, this))
        },selector: "",jquery: "1.8.2",length: 0,size: function() {
            return this.length
        },toArray: function() {
            return k.call(this)
        },get: function(a) {
            return a == null ? this.toArray() : a < 0 ? this[this.length + a] : this[a]
        },pushStack: function(a, b, c) {
            var d = p.merge(this.constructor(), a);
            return d.prevObject = this, d.context = this.context, b === "find" ? d.selector = this.selector + (this.selector ? " " : "") + c : b && (d.selector = this.selector + "." + b + "(" + c + ")"), d
        },each: function(a, b) {
            return p.each(this, a, b)
        },ready: function(a) {
            return p.ready.promise().done(a), this
        },eq: function(a) {
            return a = +a, a === -1 ? this.slice(a) : this.slice(a, a + 1)
        },first: function() {
            return this.eq(0)
        },last: function() {
            return this.eq(-1)
        },slice: function() {
            return this.pushStack(k.apply(this, arguments), "slice", k.call(arguments).join(","))
        },map: function(a) {
            return this.pushStack(p.map(this, function(b, c) {
                return a.call(b, c, b)
            }))
        },end: function() {
            return this.prevObject || this.constructor(null)
        },push: j,sort: [].sort,splice: [].splice}, p.fn.init.prototype = p.fn, p.extend = p.fn.extend = function() {
        var a, c, d, e, f, g, h = arguments[0] || {}, i = 1, j = arguments.length, k = !1;
        typeof h == "boolean" && (k = h, h = arguments[1] || {}, i = 2), typeof h != "object" && !p.isFunction(h) && (h = {}), j === i && (h = this, --i);
        for (; i < j; i++)
            if ((a = arguments[i]) != null)
                for (c in a) {
                    d = h[c], e = a[c];
                    if (h === e)
                        continue;
                    k && e && (p.isPlainObject(e) || (f = p.isArray(e))) ? (f ? (f = !1, g = d && p.isArray(d) ? d : []) : g = d && p.isPlainObject(d) ? d : {}, h[c] = p.extend(k, g, e)) : e !== b && (h[c] = e)
                }
        return h
    }, p.extend({noConflict: function(b) {
            return a.$ === p && (a.$ = i), b && a.jQuery === p && (a.jQuery = h), p
        },isReady: !1,readyWait: 1,holdReady: function(a) {
            a ? p.readyWait++ : p.ready(!0)
        },ready: function(a) {
            if (a === !0 ? --p.readyWait : p.isReady)
                return;
            if (!e.body)
                return setTimeout(p.ready, 1);
            p.isReady = !0;
            if (a !== !0 && --p.readyWait > 0)
                return;
            d.resolveWith(e, [p]), p.fn.trigger && p(e).trigger("ready").off("ready")
        },isFunction: function(a) {
            return p.type(a) === "function"
        },isArray: Array.isArray || function(a) {
            return p.type(a) === "array"
        },isWindow: function(a) {
            return a != null && a == a.window
        },isNumeric: function(a) {
            return !isNaN(parseFloat(a)) && isFinite(a)
        },type: function(a) {
            return a == null ? String(a) : E[m.call(a)] || "object"
        },isPlainObject: function(a) {
            if (!a || p.type(a) !== "object" || a.nodeType || p.isWindow(a))
                return !1;
            try {
                if (a.constructor && !n.call(a, "constructor") && !n.call(a.constructor.prototype, "isPrototypeOf"))
                    return !1
            } catch (c) {
                return !1
            }
            var d;
            for (d in a)
                ;
            return d === b || n.call(a, d)
        },isEmptyObject: function(a) {
            var b;
            for (b in a)
                return !1;
            return !0
        },error: function(a) {
            throw new Error(a)
        },parseHTML: function(a, b, c) {
            var d;
            return !a || typeof a != "string" ? null : (typeof b == "boolean" && (c = b, b = 0), b = b || e, (d = v.exec(a)) ? [b.createElement(d[1])] : (d = p.buildFragment([a], b, c ? null : []), p.merge([], (d.cacheable ? p.clone(d.fragment) : d.fragment).childNodes)))
        },parseJSON: function(b) {
            if (!b || typeof b != "string")
                return null;
            b = p.trim(b);
            if (a.JSON && a.JSON.parse)
                return a.JSON.parse(b);
            if (w.test(b.replace(y, "@").replace(z, "]").replace(x, "")))
                return (new Function("return " + b))();
            p.error("Invalid JSON: " + b)
        },parseXML: function(c) {
            var d, e;
            if (!c || typeof c != "string")
                return null;
            try {
                a.DOMParser ? (e = new DOMParser, d = e.parseFromString(c, "text/xml")) : (d = new ActiveXObject("Microsoft.XMLDOM"), d.async = "false", d.loadXML(c))
            } catch (f) {
                d = b
            }
            return (!d || !d.documentElement || d.getElementsByTagName("parsererror").length) && p.error("Invalid XML: " + c), d
        },noop: function() {
        },globalEval: function(b) {
            b && r.test(b) && (a.execScript || function(b) {
                a.eval.call(a, b)
            })(b)
        },camelCase: function(a) {
            return a.replace(A, "ms-").replace(B, C)
        },nodeName: function(a, b) {
            return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
        },each: function(a, c, d) {
            var e, f = 0, g = a.length, h = g === b || p.isFunction(a);
            if (d) {
                if (h) {
                    for (e in a)
                        if (c.apply(a[e], d) === !1)
                            break
                } else
                    for (; f < g; )
                        if (c.apply(a[f++], d) === !1)
                            break
            } else if (h) {
                for (e in a)
                    if (c.call(a[e], e, a[e]) === !1)
                        break
            } else
                for (; f < g; )
                    if (c.call(a[f], f, a[f++]) === !1)
                        break;
            return a
        },trim: o && !o.call("﻿ ") ? function(a) {
            return a == null ? "" : o.call(a)
        } : function(a) {
            return a == null ? "" : (a + "").replace(t, "")
        },makeArray: function(a, b) {
            var c, d = b || [];
            return a != null && (c = p.type(a), a.length == null || c === "string" || c === "function" || c === "regexp" || p.isWindow(a) ? j.call(d, a) : p.merge(d, a)), d
        },inArray: function(a, b, c) {
            var d;
            if (b) {
                if (l)
                    return l.call(b, a, c);
                d = b.length, c = c ? c < 0 ? Math.max(0, d + c) : c : 0;
                for (; c < d; c++)
                    if (c in b && b[c] === a)
                        return c
            }
            return -1
        },merge: function(a, c) {
            var d = c.length, e = a.length, f = 0;
            if (typeof d == "number")
                for (; f < d; f++)
                    a[e++] = c[f];
            else
                while (c[f] !== b)
                    a[e++] = c[f++];
            return a.length = e, a
        },grep: function(a, b, c) {
            var d, e = [], f = 0, g = a.length;
            c = !!c;
            for (; f < g; f++)
                d = !!b(a[f], f), c !== d && e.push(a[f]);
            return e
        },map: function(a, c, d) {
            var e, f, g = [], h = 0, i = a.length, j = a instanceof p || i !== b && typeof i == "number" && (i > 0 && a[0] && a[i - 1] || i === 0 || p.isArray(a));
            if (j)
                for (; h < i; h++)
                    e = c(a[h], h, d), e != null && (g[g.length] = e);
            else
                for (f in a)
                    e = c(a[f], f, d), e != null && (g[g.length] = e);
            return g.concat.apply([], g)
        },guid: 1,proxy: function(a, c) {
            var d, e, f;
            return typeof c == "string" && (d = a[c], c = a, a = d), p.isFunction(a) ? (e = k.call(arguments, 2), f = function() {
                return a.apply(c, e.concat(k.call(arguments)))
            }, f.guid = a.guid = a.guid || p.guid++, f) : b
        },access: function(a, c, d, e, f, g, h) {
            var i, j = d == null, k = 0, l = a.length;
            if (d && typeof d == "object") {
                for (k in d)
                    p.access(a, c, k, d[k], 1, g, e);
                f = 1
            } else if (e !== b) {
                i = h === b && p.isFunction(e), j && (i ? (i = c, c = function(a, b, c) {
                    return i.call(p(a), c)
                }) : (c.call(a, e), c = null));
                if (c)
                    for (; k < l; k++)
                        c(a[k], d, i ? e.call(a[k], k, c(a[k], d)) : e, h);
                f = 1
            }
            return f ? a : j ? c.call(a) : l ? c(a[0], d) : g
        },now: function() {
            return (new Date).getTime()
        }}), p.ready.promise = function(b) {
        if (!d) {
            d = p.Deferred();
            if (e.readyState === "complete")
                setTimeout(p.ready, 1);
            else if (e.addEventListener)
                e.addEventListener("DOMContentLoaded", D, !1), a.addEventListener("load", p.ready, !1);
            else {
                e.attachEvent("onreadystatechange", D), a.attachEvent("onload", p.ready);
                var c = !1;
                try {
                    c = a.frameElement == null && e.documentElement
                } catch (f) {
                }
                c && c.doScroll && function g() {
                    if (!p.isReady) {
                        try {
                            c.doScroll("left")
                        } catch (a) {
                            return setTimeout(g, 50)
                        }
                        p.ready()
                    }
                }()
            }
        }
        return d.promise(b)
    }, p.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(a, b) {
        E["[object " + b + "]"] = b.toLowerCase()
    }), c = p(e);
    var F = {};
    p.Callbacks = function(a) {
        a = typeof a == "string" ? F[a] || G(a) : p.extend({}, a);
        var c, d, e, f, g, h, i = [], j = !a.once && [], k = function(b) {
            c = a.memory && b, d = !0, h = f || 0, f = 0, g = i.length, e = !0;
            for (; i && h < g; h++)
                if (i[h].apply(b[0], b[1]) === !1 && a.stopOnFalse) {
                    c = !1;
                    break
                }
            e = !1, i && (j ? j.length && k(j.shift()) : c ? i = [] : l.disable())
        }, l = {add: function() {
                if (i) {
                    var b = i.length;
                    (function d(b) {
                        p.each(b, function(b, c) {
                            var e = p.type(c);
                            e === "function" && (!a.unique || !l.has(c)) ? i.push(c) : c && c.length && e !== "string" && d(c)
                        })
                    })(arguments), e ? g = i.length : c && (f = b, k(c))
                }
                return this
            },remove: function() {
                return i && p.each(arguments, function(a, b) {
                    var c;
                    while ((c = p.inArray(b, i, c)) > -1)
                        i.splice(c, 1), e && (c <= g && g--, c <= h && h--)
                }), this
            },has: function(a) {
                return p.inArray(a, i) > -1
            },empty: function() {
                return i = [], this
            },disable: function() {
                return i = j = c = b, this
            },disabled: function() {
                return !i
            },lock: function() {
                return j = b, c || l.disable(), this
            },locked: function() {
                return !j
            },fireWith: function(a, b) {
                return b = b || [], b = [a, b.slice ? b.slice() : b], i && (!d || j) && (e ? j.push(b) : k(b)), this
            },fire: function() {
                return l.fireWith(this, arguments), this
            },fired: function() {
                return !!d
            }};
        return l
    }, p.extend({Deferred: function(a) {
            var b = [["resolve", "done", p.Callbacks("once memory"), "resolved"], ["reject", "fail", p.Callbacks("once memory"), "rejected"], ["notify", "progress", p.Callbacks("memory")]], c = "pending", d = {state: function() {
                    return c
                },always: function() {
                    return e.done(arguments).fail(arguments), this
                },then: function() {
                    var a = arguments;
                    return p.Deferred(function(c) {
                        p.each(b, function(b, d) {
                            var f = d[0], g = a[b];
                            e[d[1]](p.isFunction(g) ? function() {
                                var a = g.apply(this, arguments);
                                a && p.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f + "With"](this === e ? c : this, [a])
                            } : c[f])
                        }), a = null
                    }).promise()
                },promise: function(a) {
                    return a != null ? p.extend(a, d) : d
                }}, e = {};
            return d.pipe = d.then, p.each(b, function(a, f) {
                var g = f[2], h = f[3];
                d[f[1]] = g.add, h && g.add(function() {
                    c = h
                }, b[a ^ 1][2].disable, b[2][2].lock), e[f[0]] = g.fire, e[f[0] + "With"] = g.fireWith
            }), d.promise(e), a && a.call(e, e), e
        },when: function(a) {
            var b = 0, c = k.call(arguments), d = c.length, e = d !== 1 || a && p.isFunction(a.promise) ? d : 0, f = e === 1 ? a : p.Deferred(), g = function(a, b, c) {
                return function(d) {
                    b[a] = this, c[a] = arguments.length > 1 ? k.call(arguments) : d, c === h ? f.notifyWith(b, c) : --e || f.resolveWith(b, c)
                }
            }, h, i, j;
            if (d > 1) {
                h = new Array(d), i = new Array(d), j = new Array(d);
                for (; b < d; b++)
                    c[b] && p.isFunction(c[b].promise) ? c[b].promise().done(g(b, j, c)).fail(f.reject).progress(g(b, i, h)) : --e
            }
            return e || f.resolveWith(j, c), f.promise()
        }}), p.support = function() {
        var b, c, d, f, g, h, i, j, k, l, m, n = e.createElement("div");
        n.setAttribute("className", "t"), n.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", c = n.getElementsByTagName("*"), d = n.getElementsByTagName("a")[0], d.style.cssText = "top:1px;float:left;opacity:.5";
        if (!c || !c.length)
            return {};
        f = e.createElement("select"), g = f.appendChild(e.createElement("option")), h = n.getElementsByTagName("input")[0], b = {leadingWhitespace: n.firstChild.nodeType === 3,tbody: !n.getElementsByTagName("tbody").length,htmlSerialize: !!n.getElementsByTagName("link").length,style: /top/.test(d.getAttribute("style")),hrefNormalized: d.getAttribute("href") === "/a",opacity: /^0.5/.test(d.style.opacity),cssFloat: !!d.style.cssFloat,checkOn: h.value === "on",optSelected: g.selected,getSetAttribute: n.className !== "t",enctype: !!e.createElement("form").enctype,html5Clone: e.createElement("nav").cloneNode(!0).outerHTML !== "<:nav></:nav>",boxModel: e.compatMode === "CSS1Compat",submitBubbles: !0,changeBubbles: !0,focusinBubbles: !1,deleteExpando: !0,noCloneEvent: !0,inlineBlockNeedsLayout: !1,shrinkWrapBlocks: !1,reliableMarginRight: !0,boxSizingReliable: !0,pixelPosition: !1}, h.checked = !0, b.noCloneChecked = h.cloneNode(!0).checked, f.disabled = !0, b.optDisabled = !g.disabled;
        try {
            delete n.test
        } catch (o) {
            b.deleteExpando = !1
        }
        !n.addEventListener && n.attachEvent && n.fireEvent && (n.attachEvent("onclick", m = function() {
            b.noCloneEvent = !1
        }), n.cloneNode(!0).fireEvent("onclick"), n.detachEvent("onclick", m)), h = e.createElement("input"), h.value = "t", h.setAttribute("type", "radio"), b.radioValue = h.value === "t", h.setAttribute("checked", "checked"), h.setAttribute("name", "t"), n.appendChild(h), i = e.createDocumentFragment(), i.appendChild(n.lastChild), b.checkClone = i.cloneNode(!0).cloneNode(!0).lastChild.checked, b.appendChecked = h.checked, i.removeChild(h), i.appendChild(n);
        if (n.attachEvent)
            for (k in {submit: !0,change: !0,focusin: !0})
                j = "on" + k, l = j in n, l || (n.setAttribute(j, "return;"), l = typeof n[j] == "function"), b[k + "Bubbles"] = l;
        return p(function() {
            var c, d, f, g, h = "padding:0;margin:0;border:0;display:block;overflow:hidden;", i = e.getElementsByTagName("body")[0];
            if (!i)
                return;
            c = e.createElement("div"), c.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px", i.insertBefore(c, i.firstChild), d = e.createElement("div"), c.appendChild(d), d.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", f = d.getElementsByTagName("td"), f[0].style.cssText = "padding:0;margin:0;border:0;display:none", l = f[0].offsetHeight === 0, f[0].style.display = "", f[1].style.display = "none", b.reliableHiddenOffsets = l && f[0].offsetHeight === 0, d.innerHTML = "", d.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", b.boxSizing = d.offsetWidth === 4, b.doesNotIncludeMarginInBodyOffset = i.offsetTop !== 1, a.getComputedStyle && (b.pixelPosition = (a.getComputedStyle(d, null) || {}).top !== "1%", b.boxSizingReliable = (a.getComputedStyle(d, null) || {width: "4px"}).width === "4px", g = e.createElement("div"), g.style.cssText = d.style.cssText = h, g.style.marginRight = g.style.width = "0", d.style.width = "1px", d.appendChild(g), b.reliableMarginRight = !parseFloat((a.getComputedStyle(g, null) || {}).marginRight)), typeof d.style.zoom != "undefined" && (d.innerHTML = "", d.style.cssText = h + "width:1px;padding:1px;display:inline;zoom:1", b.inlineBlockNeedsLayout = d.offsetWidth === 3, d.style.display = "block", d.style.overflow = "visible", d.innerHTML = "<div></div>", d.firstChild.style.width = "5px", b.shrinkWrapBlocks = d.offsetWidth !== 3, c.style.zoom = 1), i.removeChild(c), c = d = f = g = null
        }), i.removeChild(n), c = d = f = g = h = i = n = null, b
    }();
    var H = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, I = /([A-Z])/g;
    p.extend({cache: {},deletedIds: [],uuid: 0,expando: "jQuery" + (p.fn.jquery + Math.random()).replace(/\D/g, ""),noData: {embed: !0,object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet: !0},hasData: function(a) {
            return a = a.nodeType ? p.cache[a[p.expando]] : a[p.expando], !!a && !K(a)
        },data: function(a, c, d, e) {
            if (!p.acceptData(a))
                return;
            var f, g, h = p.expando, i = typeof c == "string", j = a.nodeType, k = j ? p.cache : a, l = j ? a[h] : a[h] && h;
            if ((!l || !k[l] || !e && !k[l].data) && i && d === b)
                return;
            l || (j ? a[h] = l = p.deletedIds.pop() || p.guid++ : l = h), k[l] || (k[l] = {}, j || (k[l].toJSON = p.noop));
            if (typeof c == "object" || typeof c == "function")
                e ? k[l] = p.extend(k[l], c) : k[l].data = p.extend(k[l].data, c);
            return f = k[l], e || (f.data || (f.data = {}), f = f.data), d !== b && (f[p.camelCase(c)] = d), i ? (g = f[c], g == null && (g = f[p.camelCase(c)])) : g = f, g
        },removeData: function(a, b, c) {
            if (!p.acceptData(a))
                return;
            var d, e, f, g = a.nodeType, h = g ? p.cache : a, i = g ? a[p.expando] : p.expando;
            if (!h[i])
                return;
            if (b) {
                d = c ? h[i] : h[i].data;
                if (d) {
                    p.isArray(b) || (b in d ? b = [b] : (b = p.camelCase(b), b in d ? b = [b] : b = b.split(" ")));
                    for (e = 0, f = b.length; e < f; e++)
                        delete d[b[e]];
                    if (!(c ? K : p.isEmptyObject)(d))
                        return
                }
            }
            if (!c) {
                delete h[i].data;
                if (!K(h[i]))
                    return
            }
            g ? p.cleanData([a], !0) : p.support.deleteExpando || h != h.window ? delete h[i] : h[i] = null
        },_data: function(a, b, c) {
            return p.data(a, b, c, !0)
        },acceptData: function(a) {
            var b = a.nodeName && p.noData[a.nodeName.toLowerCase()];
            return !b || b !== !0 && a.getAttribute("classid") === b
        }}), p.fn.extend({data: function(a, c) {
            var d, e, f, g, h, i = this[0], j = 0, k = null;
            if (a === b) {
                if (this.length) {
                    k = p.data(i);
                    if (i.nodeType === 1 && !p._data(i, "parsedAttrs")) {
                        f = i.attributes;
                        for (h = f.length; j < h; j++)
                            g = f[j].name, g.indexOf("data-") || (g = p.camelCase(g.substring(5)), J(i, g, k[g]));
                        p._data(i, "parsedAttrs", !0)
                    }
                }
                return k
            }
            return typeof a == "object" ? this.each(function() {
                p.data(this, a)
            }) : (d = a.split(".", 2), d[1] = d[1] ? "." + d[1] : "", e = d[1] + "!", p.access(this, function(c) {
                if (c === b)
                    return k = this.triggerHandler("getData" + e, [d[0]]), k === b && i && (k = p.data(i, a), k = J(i, a, k)), k === b && d[1] ? this.data(d[0]) : k;
                d[1] = c, this.each(function() {
                    var b = p(this);
                    b.triggerHandler("setData" + e, d), p.data(this, a, c), b.triggerHandler("changeData" + e, d)
                })
            }, null, c, arguments.length > 1, null, !1))
        },removeData: function(a) {
            return this.each(function() {
                p.removeData(this, a)
            })
        }}), p.extend({queue: function(a, b, c) {
            var d;
            if (a)
                return b = (b || "fx") + "queue", d = p._data(a, b), c && (!d || p.isArray(c) ? d = p._data(a, b, p.makeArray(c)) : d.push(c)), d || []
        },dequeue: function(a, b) {
            b = b || "fx";
            var c = p.queue(a, b), d = c.length, e = c.shift(), f = p._queueHooks(a, b), g = function() {
                p.dequeue(a, b)
            };
            e === "inprogress" && (e = c.shift(), d--), e && (b === "fx" && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire()
        },_queueHooks: function(a, b) {
            var c = b + "queueHooks";
            return p._data(a, c) || p._data(a, c, {empty: p.Callbacks("once memory").add(function() {
                    p.removeData(a, b + "queue", !0), p.removeData(a, c, !0)
                })})
        }}), p.fn.extend({queue: function(a, c) {
            var d = 2;
            return typeof a != "string" && (c = a, a = "fx", d--), arguments.length < d ? p.queue(this[0], a) : c === b ? this : this.each(function() {
                var b = p.queue(this, a, c);
                p._queueHooks(this, a), a === "fx" && b[0] !== "inprogress" && p.dequeue(this, a)
            })
        },dequeue: function(a) {
            return this.each(function() {
                p.dequeue(this, a)
            })
        },delay: function(a, b) {
            return a = p.fx ? p.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function(b, c) {
                var d = setTimeout(b, a);
                c.stop = function() {
                    clearTimeout(d)
                }
            })
        },clearQueue: function(a) {
            return this.queue(a || "fx", [])
        },promise: function(a, c) {
            var d, e = 1, f = p.Deferred(), g = this, h = this.length, i = function() {
                --e || f.resolveWith(g, [g])
            };
            typeof a != "string" && (c = a, a = b), a = a || "fx";
            while (h--)
                d = p._data(g[h], a + "queueHooks"), d && d.empty && (e++, d.empty.add(i));
            return i(), f.promise(c)
        }});
    var L, M, N, O = /[\t\r\n]/g, P = /\r/g, Q = /^(?:button|input)$/i, R = /^(?:button|input|object|select|textarea)$/i, S = /^a(?:rea|)$/i, T = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i, U = p.support.getSetAttribute;
    p.fn.extend({attr: function(a, b) {
            return p.access(this, p.attr, a, b, arguments.length > 1)
        },removeAttr: function(a) {
            return this.each(function() {
                p.removeAttr(this, a)
            })
        },prop: function(a, b) {
            return p.access(this, p.prop, a, b, arguments.length > 1)
        },removeProp: function(a) {
            return a = p.propFix[a] || a, this.each(function() {
                try {
                    this[a] = b, delete this[a]
                } catch (c) {
                }
            })
        },addClass: function(a) {
            var b, c, d, e, f, g, h;
            if (p.isFunction(a))
                return this.each(function(b) {
                    p(this).addClass(a.call(this, b, this.className))
                });
            if (a && typeof a == "string") {
                b = a.split(s);
                for (c = 0, d = this.length; c < d; c++) {
                    e = this[c];
                    if (e.nodeType === 1)
                        if (!e.className && b.length === 1)
                            e.className = a;
                        else {
                            f = " " + e.className + " ";
                            for (g = 0, h = b.length; g < h; g++)
                                f.indexOf(" " + b[g] + " ") < 0 && (f += b[g] + " ");
                            e.className = p.trim(f)
                        }
                }
            }
            return this
        },removeClass: function(a) {
            var c, d, e, f, g, h, i;
            if (p.isFunction(a))
                return this.each(function(b) {
                    p(this).removeClass(a.call(this, b, this.className))
                });
            if (a && typeof a == "string" || a === b) {
                c = (a || "").split(s);
                for (h = 0, i = this.length; h < i; h++) {
                    e = this[h];
                    if (e.nodeType === 1 && e.className) {
                        d = (" " + e.className + " ").replace(O, " ");
                        for (f = 0, g = c.length; f < g; f++)
                            while (d.indexOf(" " + c[f] + " ") >= 0)
                                d = d.replace(" " + c[f] + " ", " ");
                        e.className = a ? p.trim(d) : ""
                    }
                }
            }
            return this
        },toggleClass: function(a, b) {
            var c = typeof a, d = typeof b == "boolean";
            return p.isFunction(a) ? this.each(function(c) {
                p(this).toggleClass(a.call(this, c, this.className, b), b)
            }) : this.each(function() {
                if (c === "string") {
                    var e, f = 0, g = p(this), h = b, i = a.split(s);
                    while (e = i[f++])
                        h = d ? h : !g.hasClass(e), g[h ? "addClass" : "removeClass"](e)
                } else if (c === "undefined" || c === "boolean")
                    this.className && p._data(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : p._data(this, "__className__") || ""
            })
        },hasClass: function(a) {
            var b = " " + a + " ", c = 0, d = this.length;
            for (; c < d; c++)
                if (this[c].nodeType === 1 && (" " + this[c].className + " ").replace(O, " ").indexOf(b) >= 0)
                    return !0;
            return !1
        },val: function(a) {
            var c, d, e, f = this[0];
            if (!arguments.length) {
                if (f)
                    return c = p.valHooks[f.type] || p.valHooks[f.nodeName.toLowerCase()], c && "get" in c && (d = c.get(f, "value")) !== b ? d : (d = f.value, typeof d == "string" ? d.replace(P, "") : d == null ? "" : d);
                return
            }
            return e = p.isFunction(a), this.each(function(d) {
                var f, g = p(this);
                if (this.nodeType !== 1)
                    return;
                e ? f = a.call(this, d, g.val()) : f = a, f == null ? f = "" : typeof f == "number" ? f += "" : p.isArray(f) && (f = p.map(f, function(a) {
                    return a == null ? "" : a + ""
                })), c = p.valHooks[this.type] || p.valHooks[this.nodeName.toLowerCase()];
                if (!c || !("set" in c) || c.set(this, f, "value") === b)
                    this.value = f
            })
        }}), p.extend({valHooks: {option: {get: function(a) {
                    var b = a.attributes.value;
                    return !b || b.specified ? a.value : a.text
                }},select: {get: function(a) {
                    var b, c, d, e, f = a.selectedIndex, g = [], h = a.options, i = a.type === "select-one";
                    if (f < 0)
                        return null;
                    c = i ? f : 0, d = i ? f + 1 : h.length;
                    for (; c < d; c++) {
                        e = h[c];
                        if (e.selected && (p.support.optDisabled ? !e.disabled : e.getAttribute("disabled") === null) && (!e.parentNode.disabled || !p.nodeName(e.parentNode, "optgroup"))) {
                            b = p(e).val();
                            if (i)
                                return b;
                            g.push(b)
                        }
                    }
                    return i && !g.length && h.length ? p(h[f]).val() : g
                },set: function(a, b) {
                    var c = p.makeArray(b);
                    return p(a).find("option").each(function() {
                        this.selected = p.inArray(p(this).val(), c) >= 0
                    }), c.length || (a.selectedIndex = -1), c
                }}},attrFn: {},attr: function(a, c, d, e) {
            var f, g, h, i = a.nodeType;
            if (!a || i === 3 || i === 8 || i === 2)
                return;
            if (e && p.isFunction(p.fn[c]))
                return p(a)[c](d);
            if (typeof a.getAttribute == "undefined")
                return p.prop(a, c, d);
            h = i !== 1 || !p.isXMLDoc(a), h && (c = c.toLowerCase(), g = p.attrHooks[c] || (T.test(c) ? M : L));
            if (d !== b) {
                if (d === null) {
                    p.removeAttr(a, c);
                    return
                }
                return g && "set" in g && h && (f = g.set(a, d, c)) !== b ? f : (a.setAttribute(c, d + ""), d)
            }
            return g && "get" in g && h && (f = g.get(a, c)) !== null ? f : (f = a.getAttribute(c), f === null ? b : f)
        },removeAttr: function(a, b) {
            var c, d, e, f, g = 0;
            if (b && a.nodeType === 1) {
                d = b.split(s);
                for (; g < d.length; g++)
                    e = d[g], e && (c = p.propFix[e] || e, f = T.test(e), f || p.attr(a, e, ""), a.removeAttribute(U ? e : c), f && c in a && (a[c] = !1))
            }
        },attrHooks: {type: {set: function(a, b) {
                    if (Q.test(a.nodeName) && a.parentNode)
                        p.error("type property can't be changed");
                    else if (!p.support.radioValue && b === "radio" && p.nodeName(a, "input")) {
                        var c = a.value;
                        return a.setAttribute("type", b), c && (a.value = c), b
                    }
                }},value: {get: function(a, b) {
                    return L && p.nodeName(a, "button") ? L.get(a, b) : b in a ? a.value : null
                },set: function(a, b, c) {
                    if (L && p.nodeName(a, "button"))
                        return L.set(a, b, c);
                    a.value = b
                }}},propFix: {tabindex: "tabIndex",readonly: "readOnly","for": "htmlFor","class": "className",maxlength: "maxLength",cellspacing: "cellSpacing",cellpadding: "cellPadding",rowspan: "rowSpan",colspan: "colSpan",usemap: "useMap",frameborder: "frameBorder",contenteditable: "contentEditable"},prop: function(a, c, d) {
            var e, f, g, h = a.nodeType;
            if (!a || h === 3 || h === 8 || h === 2)
                return;
            return g = h !== 1 || !p.isXMLDoc(a), g && (c = p.propFix[c] || c, f = p.propHooks[c]), d !== b ? f && "set" in f && (e = f.set(a, d, c)) !== b ? e : a[c] = d : f && "get" in f && (e = f.get(a, c)) !== null ? e : a[c]
        },propHooks: {tabIndex: {get: function(a) {
                    var c = a.getAttributeNode("tabindex");
                    return c && c.specified ? parseInt(c.value, 10) : R.test(a.nodeName) || S.test(a.nodeName) && a.href ? 0 : b
                }}}}), M = {get: function(a, c) {
            var d, e = p.prop(a, c);
            return e === !0 || typeof e != "boolean" && (d = a.getAttributeNode(c)) && d.nodeValue !== !1 ? c.toLowerCase() : b
        },set: function(a, b, c) {
            var d;
            return b === !1 ? p.removeAttr(a, c) : (d = p.propFix[c] || c, d in a && (a[d] = !0), a.setAttribute(c, c.toLowerCase())), c
        }}, U || (N = {name: !0,id: !0,coords: !0}, L = p.valHooks.button = {get: function(a, c) {
            var d;
            return d = a.getAttributeNode(c), d && (N[c] ? d.value !== "" : d.specified) ? d.value : b
        },set: function(a, b, c) {
            var d = a.getAttributeNode(c);
            return d || (d = e.createAttribute(c), a.setAttributeNode(d)), d.value = b + ""
        }}, p.each(["width", "height"], function(a, b) {
        p.attrHooks[b] = p.extend(p.attrHooks[b], {set: function(a, c) {
                if (c === "")
                    return a.setAttribute(b, "auto"), c
            }})
    }), p.attrHooks.contenteditable = {get: L.get,set: function(a, b, c) {
            b === "" && (b = "false"), L.set(a, b, c)
        }}), p.support.hrefNormalized || p.each(["href", "src", "width", "height"], function(a, c) {
        p.attrHooks[c] = p.extend(p.attrHooks[c], {get: function(a) {
                var d = a.getAttribute(c, 2);
                return d === null ? b : d
            }})
    }), p.support.style || (p.attrHooks.style = {get: function(a) {
            return a.style.cssText.toLowerCase() || b
        },set: function(a, b) {
            return a.style.cssText = b + ""
        }}), p.support.optSelected || (p.propHooks.selected = p.extend(p.propHooks.selected, {get: function(a) {
            var b = a.parentNode;
            return b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex), null
        }})), p.support.enctype || (p.propFix.enctype = "encoding"), p.support.checkOn || p.each(["radio", "checkbox"], function() {
        p.valHooks[this] = {get: function(a) {
                return a.getAttribute("value") === null ? "on" : a.value
            }}
    }), p.each(["radio", "checkbox"], function() {
        p.valHooks[this] = p.extend(p.valHooks[this], {set: function(a, b) {
                if (p.isArray(b))
                    return a.checked = p.inArray(p(a).val(), b) >= 0
            }})
    });
    var V = /^(?:textarea|input|select)$/i, W = /^([^\.]*|)(?:\.(.+)|)$/, X = /(?:^|\s)hover(\.\S+|)\b/, Y = /^key/, Z = /^(?:mouse|contextmenu)|click/, $ = /^(?:focusinfocus|focusoutblur)$/, _ = function(a) {
        return p.event.special.hover ? a : a.replace(X, "mouseenter$1 mouseleave$1")
    };
    p.event = {add: function(a, c, d, e, f) {
            var g, h, i, j, k, l, m, n, o, q, r;
            if (a.nodeType === 3 || a.nodeType === 8 || !c || !d || !(g = p._data(a)))
                return;
            d.handler && (o = d, d = o.handler, f = o.selector), d.guid || (d.guid = p.guid++), i = g.events, i || (g.events = i = {}), h = g.handle, h || (g.handle = h = function(a) {
                return typeof p != "undefined" && (!a || p.event.triggered !== a.type) ? p.event.dispatch.apply(h.elem, arguments) : b
            }, h.elem = a), c = p.trim(_(c)).split(" ");
            for (j = 0; j < c.length; j++) {
                k = W.exec(c[j]) || [], l = k[1], m = (k[2] || "").split(".").sort(), r = p.event.special[l] || {}, l = (f ? r.delegateType : r.bindType) || l, r = p.event.special[l] || {}, n = p.extend({type: l,origType: k[1],data: e,handler: d,guid: d.guid,selector: f,needsContext: f && p.expr.match.needsContext.test(f),namespace: m.join(".")}, o), q = i[l];
                if (!q) {
                    q = i[l] = [], q.delegateCount = 0;
                    if (!r.setup || r.setup.call(a, e, m, h) === !1)
                        a.addEventListener ? a.addEventListener(l, h, !1) : a.attachEvent && a.attachEvent("on" + l, h)
                }
                r.add && (r.add.call(a, n), n.handler.guid || (n.handler.guid = d.guid)), f ? q.splice(q.delegateCount++, 0, n) : q.push(n), p.event.global[l] = !0
            }
            a = null
        },global: {},remove: function(a, b, c, d, e) {
            var f, g, h, i, j, k, l, m, n, o, q, r = p.hasData(a) && p._data(a);
            if (!r || !(m = r.events))
                return;
            b = p.trim(_(b || "")).split(" ");
            for (f = 0; f < b.length; f++) {
                g = W.exec(b[f]) || [], h = i = g[1], j = g[2];
                if (!h) {
                    for (h in m)
                        p.event.remove(a, h + b[f], c, d, !0);
                    continue
                }
                n = p.event.special[h] || {}, h = (d ? n.delegateType : n.bindType) || h, o = m[h] || [], k = o.length, j = j ? new RegExp("(^|\\.)" + j.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
                for (l = 0; l < o.length; l++)
                    q = o[l], (e || i === q.origType) && (!c || c.guid === q.guid) && (!j || j.test(q.namespace)) && (!d || d === q.selector || d === "**" && q.selector) && (o.splice(l--, 1), q.selector && o.delegateCount--, n.remove && n.remove.call(a, q));
                o.length === 0 && k !== o.length && ((!n.teardown || n.teardown.call(a, j, r.handle) === !1) && p.removeEvent(a, h, r.handle), delete m[h])
            }
            p.isEmptyObject(m) && (delete r.handle, p.removeData(a, "events", !0))
        },customEvent: {getData: !0,setData: !0,changeData: !0},trigger: function(c, d, f, g) {
            if (!f || f.nodeType !== 3 && f.nodeType !== 8) {
                var h, i, j, k, l, m, n, o, q, r, s = c.type || c, t = [];
                if ($.test(s + p.event.triggered))
                    return;
                s.indexOf("!") >= 0 && (s = s.slice(0, -1), i = !0), s.indexOf(".") >= 0 && (t = s.split("."), s = t.shift(), t.sort());
                if ((!f || p.event.customEvent[s]) && !p.event.global[s])
                    return;
                c = typeof c == "object" ? c[p.expando] ? c : new p.Event(s, c) : new p.Event(s), c.type = s, c.isTrigger = !0, c.exclusive = i, c.namespace = t.join("."), c.namespace_re = c.namespace ? new RegExp("(^|\\.)" + t.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, m = s.indexOf(":") < 0 ? "on" + s : "";
                if (!f) {
                    h = p.cache;
                    for (j in h)
                        h[j].events && h[j].events[s] && p.event.trigger(c, d, h[j].handle.elem, !0);
                    return
                }
                c.result = b, c.target || (c.target = f), d = d != null ? p.makeArray(d) : [], d.unshift(c), n = p.event.special[s] || {};
                if (n.trigger && n.trigger.apply(f, d) === !1)
                    return;
                q = [[f, n.bindType || s]];
                if (!g && !n.noBubble && !p.isWindow(f)) {
                    r = n.delegateType || s, k = $.test(r + s) ? f : f.parentNode;
                    for (l = f; k; k = k.parentNode)
                        q.push([k, r]), l = k;
                    l === (f.ownerDocument || e) && q.push([l.defaultView || l.parentWindow || a, r])
                }
                for (j = 0; j < q.length && !c.isPropagationStopped(); j++)
                    k = q[j][0], c.type = q[j][1], o = (p._data(k, "events") || {})[c.type] && p._data(k, "handle"), o && o.apply(k, d), o = m && k[m], o && p.acceptData(k) && o.apply && o.apply(k, d) === !1 && c.preventDefault();
                return c.type = s, !g && !c.isDefaultPrevented() && (!n._default || n._default.apply(f.ownerDocument, d) === !1) && (s !== "click" || !p.nodeName(f, "a")) && p.acceptData(f) && m && f[s] && (s !== "focus" && s !== "blur" || c.target.offsetWidth !== 0) && !p.isWindow(f) && (l = f[m], l && (f[m] = null), p.event.triggered = s, f[s](), p.event.triggered = b, l && (f[m] = l)), c.result
            }
            return
        },dispatch: function(c) {
            c = p.event.fix(c || a.event);
            var d, e, f, g, h, i, j, l, m, n, o = (p._data(this, "events") || {})[c.type] || [], q = o.delegateCount, r = k.call(arguments), s = !c.exclusive && !c.namespace, t = p.event.special[c.type] || {}, u = [];
            r[0] = c, c.delegateTarget = this;
            if (t.preDispatch && t.preDispatch.call(this, c) === !1)
                return;
            if (q && (!c.button || c.type !== "click"))
                for (f = c.target; f != this; f = f.parentNode || this)
                    if (f.disabled !== !0 || c.type !== "click") {
                        h = {}, j = [];
                        for (d = 0; d < q; d++)
                            l = o[d], m = l.selector, h[m] === b && (h[m] = l.needsContext ? p(m, this).index(f) >= 0 : p.find(m, this, null, [f]).length), h[m] && j.push(l);
                        j.length && u.push({elem: f,matches: j})
                    }
            o.length > q && u.push({elem: this,matches: o.slice(q)});
            for (d = 0; d < u.length && !c.isPropagationStopped(); d++) {
                i = u[d], c.currentTarget = i.elem;
                for (e = 0; e < i.matches.length && !c.isImmediatePropagationStopped(); e++) {
                    l = i.matches[e];
                    if (s || !c.namespace && !l.namespace || c.namespace_re && c.namespace_re.test(l.namespace))
                        c.data = l.data, c.handleObj = l, g = ((p.event.special[l.origType] || {}).handle || l.handler).apply(i.elem, r), g !== b && (c.result = g, g === !1 && (c.preventDefault(), c.stopPropagation()))
                }
            }
            return t.postDispatch && t.postDispatch.call(this, c), c.result
        },props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks: {},keyHooks: {props: "char charCode key keyCode".split(" "),filter: function(a, b) {
                return a.which == null && (a.which = b.charCode != null ? b.charCode : b.keyCode), a
            }},mouseHooks: {props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter: function(a, c) {
                var d, f, g, h = c.button, i = c.fromElement;
                return a.pageX == null && c.clientX != null && (d = a.target.ownerDocument || e, f = d.documentElement, g = d.body, a.pageX = c.clientX + (f && f.scrollLeft || g && g.scrollLeft || 0) - (f && f.clientLeft || g && g.clientLeft || 0), a.pageY = c.clientY + (f && f.scrollTop || g && g.scrollTop || 0) - (f && f.clientTop || g && g.clientTop || 0)), !a.relatedTarget && i && (a.relatedTarget = i === a.target ? c.toElement : i), !a.which && h !== b && (a.which = h & 1 ? 1 : h & 2 ? 3 : h & 4 ? 2 : 0), a
            }},fix: function(a) {
            if (a[p.expando])
                return a;
            var b, c, d = a, f = p.event.fixHooks[a.type] || {}, g = f.props ? this.props.concat(f.props) : this.props;
            a = p.Event(d);
            for (b = g.length; b; )
                c = g[--b], a[c] = d[c];
            return a.target || (a.target = d.srcElement || e), a.target.nodeType === 3 && (a.target = a.target.parentNode), a.metaKey = !!a.metaKey, f.filter ? f.filter(a, d) : a
        },special: {load: {noBubble: !0},focus: {delegateType: "focusin"},blur: {delegateType: "focusout"},beforeunload: {setup: function(a, b, c) {
                    p.isWindow(this) && (this.onbeforeunload = c)
                },teardown: function(a, b) {
                    this.onbeforeunload === b && (this.onbeforeunload = null)
                }}},simulate: function(a, b, c, d) {
            var e = p.extend(new p.Event, c, {type: a,isSimulated: !0,originalEvent: {}});
            d ? p.event.trigger(e, null, b) : p.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault()
        }}, p.event.handle = p.event.dispatch, p.removeEvent = e.removeEventListener ? function(a, b, c) {
        a.removeEventListener && a.removeEventListener(b, c, !1)
    } : function(a, b, c) {
        var d = "on" + b;
        a.detachEvent && (typeof a[d] == "undefined" && (a[d] = null), a.detachEvent(d, c))
    }, p.Event = function(a, b) {
        if (this instanceof p.Event)
            a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || a.returnValue === !1 || a.getPreventDefault && a.getPreventDefault() ? bb : ba) : this.type = a, b && p.extend(this, b), this.timeStamp = a && a.timeStamp || p.now(), this[p.expando] = !0;
        else
            return new p.Event(a, b)
    }, p.Event.prototype = {preventDefault: function() {
            this.isDefaultPrevented = bb;
            var a = this.originalEvent;
            if (!a)
                return;
            a.preventDefault ? a.preventDefault() : a.returnValue = !1
        },stopPropagation: function() {
            this.isPropagationStopped = bb;
            var a = this.originalEvent;
            if (!a)
                return;
            a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0
        },stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = bb, this.stopPropagation()
        },isDefaultPrevented: ba,isPropagationStopped: ba,isImmediatePropagationStopped: ba}, p.each({mouseenter: "mouseover",mouseleave: "mouseout"}, function(a, b) {
        p.event.special[a] = {delegateType: b,bindType: b,handle: function(a) {
                var c, d = this, e = a.relatedTarget, f = a.handleObj, g = f.selector;
                if (!e || e !== d && !p.contains(d, e))
                    a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b;
                return c
            }}
    }), p.support.submitBubbles || (p.event.special.submit = {setup: function() {
            if (p.nodeName(this, "form"))
                return !1;
            p.event.add(this, "click._submit keypress._submit", function(a) {
                var c = a.target, d = p.nodeName(c, "input") || p.nodeName(c, "button") ? c.form : b;
                d && !p._data(d, "_submit_attached") && (p.event.add(d, "submit._submit", function(a) {
                    a._submit_bubble = !0
                }), p._data(d, "_submit_attached", !0))
            })
        },postDispatch: function(a) {
            a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && p.event.simulate("submit", this.parentNode, a, !0))
        },teardown: function() {
            if (p.nodeName(this, "form"))
                return !1;
            p.event.remove(this, "._submit")
        }}), p.support.changeBubbles || (p.event.special.change = {setup: function() {
            if (V.test(this.nodeName)) {
                if (this.type === "checkbox" || this.type === "radio")
                    p.event.add(this, "propertychange._change", function(a) {
                        a.originalEvent.propertyName === "checked" && (this._just_changed = !0)
                    }), p.event.add(this, "click._change", function(a) {
                        this._just_changed && !a.isTrigger && (this._just_changed = !1), p.event.simulate("change", this, a, !0)
                    });
                return !1
            }
            p.event.add(this, "beforeactivate._change", function(a) {
                var b = a.target;
                V.test(b.nodeName) && !p._data(b, "_change_attached") && (p.event.add(b, "change._change", function(a) {
                    this.parentNode && !a.isSimulated && !a.isTrigger && p.event.simulate("change", this.parentNode, a, !0)
                }), p._data(b, "_change_attached", !0))
            })
        },handle: function(a) {
            var b = a.target;
            if (this !== b || a.isSimulated || a.isTrigger || b.type !== "radio" && b.type !== "checkbox")
                return a.handleObj.handler.apply(this, arguments)
        },teardown: function() {
            return p.event.remove(this, "._change"), !V.test(this.nodeName)
        }}), p.support.focusinBubbles || p.each({focus: "focusin",blur: "focusout"}, function(a, b) {
        var c = 0, d = function(a) {
            p.event.simulate(b, a.target, p.event.fix(a), !0)
        };
        p.event.special[b] = {setup: function() {
                c++ === 0 && e.addEventListener(a, d, !0)
            },teardown: function() {
                --c === 0 && e.removeEventListener(a, d, !0)
            }}
    }), p.fn.extend({on: function(a, c, d, e, f) {
            var g, h;
            if (typeof a == "object") {
                typeof c != "string" && (d = d || c, c = b);
                for (h in a)
                    this.on(h, c, d, a[h], f);
                return this
            }
            d == null && e == null ? (e = c, d = c = b) : e == null && (typeof c == "string" ? (e = d, d = b) : (e = d, d = c, c = b));
            if (e === !1)
                e = ba;
            else if (!e)
                return this;
            return f === 1 && (g = e, e = function(a) {
                return p().off(a), g.apply(this, arguments)
            }, e.guid = g.guid || (g.guid = p.guid++)), this.each(function() {
                p.event.add(this, a, e, d, c)
            })
        },one: function(a, b, c, d) {
            return this.on(a, b, c, d, 1)
        },off: function(a, c, d) {
            var e, f;
            if (a && a.preventDefault && a.handleObj)
                return e = a.handleObj, p(a.delegateTarget).off(e.namespace ? e.origType + "." + e.namespace : e.origType, e.selector, e.handler), this;
            if (typeof a == "object") {
                for (f in a)
                    this.off(f, c, a[f]);
                return this
            }
            if (c === !1 || typeof c == "function")
                d = c, c = b;
            return d === !1 && (d = ba), this.each(function() {
                p.event.remove(this, a, d, c)
            })
        },bind: function(a, b, c) {
            return this.on(a, null, b, c)
        },unbind: function(a, b) {
            return this.off(a, null, b)
        },live: function(a, b, c) {
            return p(this.context).on(a, this.selector, b, c), this
        },die: function(a, b) {
            return p(this.context).off(a, this.selector || "**", b), this
        },delegate: function(a, b, c, d) {
            return this.on(b, a, c, d)
        },undelegate: function(a, b, c) {
            return arguments.length === 1 ? this.off(a, "**") : this.off(b, a || "**", c)
        },trigger: function(a, b) {
            return this.each(function() {
                p.event.trigger(a, b, this)
            })
        },triggerHandler: function(a, b) {
            if (this[0])
                return p.event.trigger(a, b, this[0], !0)
        },toggle: function(a) {
            var b = arguments, c = a.guid || p.guid++, d = 0, e = function(c) {
                var e = (p._data(this, "lastToggle" + a.guid) || 0) % d;
                return p._data(this, "lastToggle" + a.guid, e + 1), c.preventDefault(), b[e].apply(this, arguments) || !1
            };
            e.guid = c;
            while (d < b.length)
                b[d++].guid = c;
            return this.click(e)
        },hover: function(a, b) {
            return this.mouseenter(a).mouseleave(b || a)
        }}), p.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
        p.fn[b] = function(a, c) {
            return c == null && (c = a, a = null), arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
        }, Y.test(b) && (p.event.fixHooks[b] = p.event.keyHooks), Z.test(b) && (p.event.fixHooks[b] = p.event.mouseHooks)
    }), function(a, b) {
        function bc(a, b, c, d) {
            c = c || [], b = b || r;
            var e, f, i, j, k = b.nodeType;
            if (!a || typeof a != "string")
                return c;
            if (k !== 1 && k !== 9)
                return [];
            i = g(b);
            if (!i && !d)
                if (e = P.exec(a))
                    if (j = e[1]) {
                        if (k === 9) {
                            f = b.getElementById(j);
                            if (!f || !f.parentNode)
                                return c;
                            if (f.id === j)
                                return c.push(f), c
                        } else if (b.ownerDocument && (f = b.ownerDocument.getElementById(j)) && h(b, f) && f.id === j)
                            return c.push(f), c
                    } else {
                        if (e[2])
                            return w.apply(c, x.call(b.getElementsByTagName(a), 0)), c;
                        if ((j = e[3]) && _ && b.getElementsByClassName)
                            return w.apply(c, x.call(b.getElementsByClassName(j), 0)), c
                    }
            return bp(a.replace(L, "$1"), b, c, d, i)
        }
        function bd(a) {
            return function(b) {
                var c = b.nodeName.toLowerCase();
                return c === "input" && b.type === a
            }
        }
        function be(a) {
            return function(b) {
                var c = b.nodeName.toLowerCase();
                return (c === "input" || c === "button") && b.type === a
            }
        }
        function bf(a) {
            return z(function(b) {
                return b = +b, z(function(c, d) {
                    var e, f = a([], c.length, b), g = f.length;
                    while (g--)
                        c[e = f[g]] && (c[e] = !(d[e] = c[e]))
                })
            })
        }
        function bg(a, b, c) {
            if (a === b)
                return c;
            var d = a.nextSibling;
            while (d) {
                if (d === b)
                    return -1;
                d = d.nextSibling
            }
            return 1
        }
        function bh(a, b) {
            var c, d, f, g, h, i, j, k = C[o][a];
            if (k)
                return b ? 0 : k.slice(0);
            h = a, i = [], j = e.preFilter;
            while (h) {
                if (!c || (d = M.exec(h)))
                    d && (h = h.slice(d[0].length)), i.push(f = []);
                c = !1;
                if (d = N.exec(h))
                    f.push(c = new q(d.shift())), h = h.slice(c.length), c.type = d[0].replace(L, " ");
                for (g in e.filter)
                    (d = W[g].exec(h)) && (!j[g] || (d = j[g](d, r, !0))) && (f.push(c = new q(d.shift())), h = h.slice(c.length), c.type = g, c.matches = d);
                if (!c)
                    break
            }
            return b ? h.length : h ? bc.error(a) : C(a, i).slice(0)
        }
        function bi(a, b, d) {
            var e = b.dir, f = d && b.dir === "parentNode", g = u++;
            return b.first ? function(b, c, d) {
                while (b = b[e])
                    if (f || b.nodeType === 1)
                        return a(b, c, d)
            } : function(b, d, h) {
                if (!h) {
                    var i, j = t + " " + g + " ", k = j + c;
                    while (b = b[e])
                        if (f || b.nodeType === 1) {
                            if ((i = b[o]) === k)
                                return b.sizset;
                            if (typeof i == "string" && i.indexOf(j) === 0) {
                                if (b.sizset)
                                    return b
                            } else {
                                b[o] = k;
                                if (a(b, d, h))
                                    return b.sizset = !0, b;
                                b.sizset = !1
                            }
                        }
                } else
                    while (b = b[e])
                        if (f || b.nodeType === 1)
                            if (a(b, d, h))
                                return b
            }
        }
        function bj(a) {
            return a.length > 1 ? function(b, c, d) {
                var e = a.length;
                while (e--)
                    if (!a[e](b, c, d))
                        return !1;
                return !0
            } : a[0]
        }
        function bk(a, b, c, d, e) {
            var f, g = [], h = 0, i = a.length, j = b != null;
            for (; h < i; h++)
                if (f = a[h])
                    if (!c || c(f, d, e))
                        g.push(f), j && b.push(h);
            return g
        }
        function bl(a, b, c, d, e, f) {
            return d && !d[o] && (d = bl(d)), e && !e[o] && (e = bl(e, f)), z(function(f, g, h, i) {
                if (f && e)
                    return;
                var j, k, l, m = [], n = [], o = g.length, p = f || bo(b || "*", h.nodeType ? [h] : h, [], f), q = a && (f || !b) ? bk(p, m, a, h, i) : p, r = c ? e || (f ? a : o || d) ? [] : g : q;
                c && c(q, r, h, i);
                if (d) {
                    l = bk(r, n), d(l, [], h, i), j = l.length;
                    while (j--)
                        if (k = l[j])
                            r[n[j]] = !(q[n[j]] = k)
                }
                if (f) {
                    j = a && r.length;
                    while (j--)
                        if (k = r[j])
                            f[m[j]] = !(g[m[j]] = k)
                } else
                    r = bk(r === g ? r.splice(o, r.length) : r), e ? e(null, g, r, i) : w.apply(g, r)
            })
        }
        function bm(a) {
            var b, c, d, f = a.length, g = e.relative[a[0].type], h = g || e.relative[" "], i = g ? 1 : 0, j = bi(function(a) {
                return a === b
            }, h, !0), k = bi(function(a) {
                return y.call(b, a) > -1
            }, h, !0), m = [function(a, c, d) {
                    return !g && (d || c !== l) || ((b = c).nodeType ? j(a, c, d) : k(a, c, d))
                }];
            for (; i < f; i++)
                if (c = e.relative[a[i].type])
                    m = [bi(bj(m), c)];
                else {
                    c = e.filter[a[i].type].apply(null, a[i].matches);
                    if (c[o]) {
                        d = ++i;
                        for (; d < f; d++)
                            if (e.relative[a[d].type])
                                break;
                        return bl(i > 1 && bj(m), i > 1 && a.slice(0, i - 1).join("").replace(L, "$1"), c, i < d && bm(a.slice(i, d)), d < f && bm(a = a.slice(d)), d < f && a.join(""))
                    }
                    m.push(c)
                }
            return bj(m)
        }
        function bn(a, b) {
            var d = b.length > 0, f = a.length > 0, g = function(h, i, j, k, m) {
                var n, o, p, q = [], s = 0, u = "0", x = h && [], y = m != null, z = l, A = h || f && e.find.TAG("*", m && i.parentNode || i), B = t += z == null ? 1 : Math.E;
                y && (l = i !== r && i, c = g.el);
                for (; (n = A[u]) != null; u++) {
                    if (f && n) {
                        for (o = 0; p = a[o]; o++)
                            if (p(n, i, j)) {
                                k.push(n);
                                break
                            }
                        y && (t = B, c = ++g.el)
                    }
                    d && ((n = !p && n) && s--, h && x.push(n))
                }
                s += u;
                if (d && u !== s) {
                    for (o = 0; p = b[o]; o++)
                        p(x, q, i, j);
                    if (h) {
                        if (s > 0)
                            while (u--)
                                !x[u] && !q[u] && (q[u] = v.call(k));
                        q = bk(q)
                    }
                    w.apply(k, q), y && !h && q.length > 0 && s + b.length > 1 && bc.uniqueSort(k)
                }
                return y && (t = B, l = z), x
            };
            return g.el = 0, d ? z(g) : g
        }
        function bo(a, b, c, d) {
            var e = 0, f = b.length;
            for (; e < f; e++)
                bc(a, b[e], c, d);
            return c
        }
        function bp(a, b, c, d, f) {
            var g, h, j, k, l, m = bh(a), n = m.length;
            if (!d && m.length === 1) {
                h = m[0] = m[0].slice(0);
                if (h.length > 2 && (j = h[0]).type === "ID" && b.nodeType === 9 && !f && e.relative[h[1].type]) {
                    b = e.find.ID(j.matches[0].replace(V, ""), b, f)[0];
                    if (!b)
                        return c;
                    a = a.slice(h.shift().length)
                }
                for (g = W.POS.test(a) ? -1 : h.length - 1; g >= 0; g--) {
                    j = h[g];
                    if (e.relative[k = j.type])
                        break;
                    if (l = e.find[k])
                        if (d = l(j.matches[0].replace(V, ""), R.test(h[0].type) && b.parentNode || b, f)) {
                            h.splice(g, 1), a = d.length && h.join("");
                            if (!a)
                                return w.apply(c, x.call(d, 0)), c;
                            break
                        }
                }
            }
            return i(a, m)(d, b, f, c, R.test(a)), c
        }
        function bq() {
        }
        var c, d, e, f, g, h, i, j, k, l, m = !0, n = "undefined", o = ("sizcache" + Math.random()).replace(".", ""), q = String, r = a.document, s = r.documentElement, t = 0, u = 0, v = [].pop, w = [].push, x = [].slice, y = [].indexOf || function(a) {
            var b = 0, c = this.length;
            for (; b < c; b++)
                if (this[b] === a)
                    return b;
            return -1
        }, z = function(a, b) {
            return a[o] = b == null || b, a
        }, A = function() {
            var a = {}, b = [];
            return z(function(c, d) {
                return b.push(c) > e.cacheLength && delete a[b.shift()], a[c] = d
            }, a)
        }, B = A(), C = A(), D = A(), E = "[\\x20\\t\\r\\n\\f]", F = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+", G = F.replace("w", "w#"), H = "([*^$|!~]?=)", I = "\\[" + E + "*(" + F + ")" + E + "*(?:" + H + E + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + G + ")|)|)" + E + "*\\]", J = ":(" + F + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" + I + ")|[^:]|\\\\.)*|.*))\\)|)", K = ":(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + E + "*((?:-\\d)?\\d*)" + E + "*\\)|)(?=[^-]|$)", L = new RegExp("^" + E + "+|((?:^|[^\\\\])(?:\\\\.)*)" + E + "+$", "g"), M = new RegExp("^" + E + "*," + E + "*"), N = new RegExp("^" + E + "*([\\x20\\t\\r\\n\\f>+~])" + E + "*"), O = new RegExp(J), P = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/, Q = /^:not/, R = /[\x20\t\r\n\f]*[+~]/, S = /:not\($/, T = /h\d/i, U = /input|select|textarea|button/i, V = /\\(?!\\)/g, W = {ID: new RegExp("^#(" + F + ")"),CLASS: new RegExp("^\\.(" + F + ")"),NAME: new RegExp("^\\[name=['\"]?(" + F + ")['\"]?\\]"),TAG: new RegExp("^(" + F.replace("w", "w*") + ")"),ATTR: new RegExp("^" + I),PSEUDO: new RegExp("^" + J),POS: new RegExp(K, "i"),CHILD: new RegExp("^:(only|nth|first|last)-child(?:\\(" + E + "*(even|odd|(([+-]|)(\\d*)n|)" + E + "*(?:([+-]|)" + E + "*(\\d+)|))" + E + "*\\)|)", "i"),needsContext: new RegExp("^" + E + "*[>+~]|" + K, "i")}, X = function(a) {
            var b = r.createElement("div");
            try {
                return a(b)
            } catch (c) {
                return !1
            }finally {
                b = null
            }
        }, Y = X(function(a) {
            return a.appendChild(r.createComment("")), !a.getElementsByTagName("*").length
        }), Z = X(function(a) {
            return a.innerHTML = "<a href='#'></a>", a.firstChild && typeof a.firstChild.getAttribute !== n && a.firstChild.getAttribute("href") === "#"
        }), $ = X(function(a) {
            a.innerHTML = "<select></select>";
            var b = typeof a.lastChild.getAttribute("multiple");
            return b !== "boolean" && b !== "string"
        }), _ = X(function(a) {
            return a.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>", !a.getElementsByClassName || !a.getElementsByClassName("e").length ? !1 : (a.lastChild.className = "e", a.getElementsByClassName("e").length === 2)
        }), ba = X(function(a) {
            a.id = o + 0, a.innerHTML = "<a name='" + o + "'></a><div name='" + o + "'></div>", s.insertBefore(a, s.firstChild);
            var b = r.getElementsByName && r.getElementsByName(o).length === 2 + r.getElementsByName(o + 0).length;
            return d = !r.getElementById(o), s.removeChild(a), b
        });
        try {
            x.call(s.childNodes, 0)[0].nodeType
        } catch (bb) {
            x = function(a) {
                var b, c = [];
                for (; b = this[a]; a++)
                    c.push(b);
                return c
            }
        }
        bc.matches = function(a, b) {
            return bc(a, null, null, b)
        }, bc.matchesSelector = function(a, b) {
            return bc(b, null, null, [a]).length > 0
        }, f = bc.getText = function(a) {
            var b, c = "", d = 0, e = a.nodeType;
            if (e) {
                if (e === 1 || e === 9 || e === 11) {
                    if (typeof a.textContent == "string")
                        return a.textContent;
                    for (a = a.firstChild; a; a = a.nextSibling)
                        c += f(a)
                } else if (e === 3 || e === 4)
                    return a.nodeValue
            } else
                for (; b = a[d]; d++)
                    c += f(b);
            return c
        }, g = bc.isXML = function(a) {
            var b = a && (a.ownerDocument || a).documentElement;
            return b ? b.nodeName !== "HTML" : !1
        }, h = bc.contains = s.contains ? function(a, b) {
            var c = a.nodeType === 9 ? a.documentElement : a, d = b && b.parentNode;
            return a === d || !!(d && d.nodeType === 1 && c.contains && c.contains(d))
        } : s.compareDocumentPosition ? function(a, b) {
            return b && !!(a.compareDocumentPosition(b) & 16)
        } : function(a, b) {
            while (b = b.parentNode)
                if (b === a)
                    return !0;
            return !1
        }, bc.attr = function(a, b) {
            var c, d = g(a);
            return d || (b = b.toLowerCase()), (c = e.attrHandle[b]) ? c(a) : d || $ ? a.getAttribute(b) : (c = a.getAttributeNode(b), c ? typeof a[b] == "boolean" ? a[b] ? b : null : c.specified ? c.value : null : null)
        }, e = bc.selectors = {cacheLength: 50,createPseudo: z,match: W,attrHandle: Z ? {} : {href: function(a) {
                    return a.getAttribute("href", 2)
                },type: function(a) {
                    return a.getAttribute("type")
                }},find: {ID: d ? function(a, b, c) {
                    if (typeof b.getElementById !== n && !c) {
                        var d = b.getElementById(a);
                        return d && d.parentNode ? [d] : []
                    }
                } : function(a, c, d) {
                    if (typeof c.getElementById !== n && !d) {
                        var e = c.getElementById(a);
                        return e ? e.id === a || typeof e.getAttributeNode !== n && e.getAttributeNode("id").value === a ? [e] : b : []
                    }
                },TAG: Y ? function(a, b) {
                    if (typeof b.getElementsByTagName !== n)
                        return b.getElementsByTagName(a)
                } : function(a, b) {
                    var c = b.getElementsByTagName(a);
                    if (a === "*") {
                        var d, e = [], f = 0;
                        for (; d = c[f]; f++)
                            d.nodeType === 1 && e.push(d);
                        return e
                    }
                    return c
                },NAME: ba && function(a, b) {
                    if (typeof b.getElementsByName !== n)
                        return b.getElementsByName(name)
                },CLASS: _ && function(a, b, c) {
                    if (typeof b.getElementsByClassName !== n && !c)
                        return b.getElementsByClassName(a)
                }},relative: {">": {dir: "parentNode",first: !0}," ": {dir: "parentNode"},"+": {dir: "previousSibling",first: !0},"~": {dir: "previousSibling"}},preFilter: {ATTR: function(a) {
                    return a[1] = a[1].replace(V, ""), a[3] = (a[4] || a[5] || "").replace(V, ""), a[2] === "~=" && (a[3] = " " + a[3] + " "), a.slice(0, 4)
                },CHILD: function(a) {
                    return a[1] = a[1].toLowerCase(), a[1] === "nth" ? (a[2] || bc.error(a[0]), a[3] = +(a[3] ? a[4] + (a[5] || 1) : 2 * (a[2] === "even" || a[2] === "odd")), a[4] = +(a[6] + a[7] || a[2] === "odd")) : a[2] && bc.error(a[0]), a
                },PSEUDO: function(a) {
                    var b, c;
                    if (W.CHILD.test(a[0]))
                        return null;
                    if (a[3])
                        a[2] = a[3];
                    else if (b = a[4])
                        O.test(b) && (c = bh(b, !0)) && (c = b.indexOf(")", b.length - c) - b.length) && (b = b.slice(0, c), a[0] = a[0].slice(0, c)), a[2] = b;
                    return a.slice(0, 3)
                }},filter: {ID: d ? function(a) {
                    return a = a.replace(V, ""), function(b) {
                        return b.getAttribute("id") === a
                    }
                } : function(a) {
                    return a = a.replace(V, ""), function(b) {
                        var c = typeof b.getAttributeNode !== n && b.getAttributeNode("id");
                        return c && c.value === a
                    }
                },TAG: function(a) {
                    return a === "*" ? function() {
                        return !0
                    } : (a = a.replace(V, "").toLowerCase(), function(b) {
                        return b.nodeName && b.nodeName.toLowerCase() === a
                    })
                },CLASS: function(a) {
                    var b = B[o][a];
                    return b || (b = B(a, new RegExp("(^|" + E + ")" + a + "(" + E + "|$)"))), function(a) {
                        return b.test(a.className || typeof a.getAttribute !== n && a.getAttribute("class") || "")
                    }
                },ATTR: function(a, b, c) {
                    return function(d, e) {
                        var f = bc.attr(d, a);
                        return f == null ? b === "!=" : b ? (f += "", b === "=" ? f === c : b === "!=" ? f !== c : b === "^=" ? c && f.indexOf(c) === 0 : b === "*=" ? c && f.indexOf(c) > -1 : b === "$=" ? c && f.substr(f.length - c.length) === c : b === "~=" ? (" " + f + " ").indexOf(c) > -1 : b === "|=" ? f === c || f.substr(0, c.length + 1) === c + "-" : !1) : !0
                    }
                },CHILD: function(a, b, c, d) {
                    return a === "nth" ? function(a) {
                        var b, e, f = a.parentNode;
                        if (c === 1 && d === 0)
                            return !0;
                        if (f) {
                            e = 0;
                            for (b = f.firstChild; b; b = b.nextSibling)
                                if (b.nodeType === 1) {
                                    e++;
                                    if (a === b)
                                        break
                                }
                        }
                        return e -= d, e === c || e % c === 0 && e / c >= 0
                    } : function(b) {
                        var c = b;
                        switch (a) {
                            case "only":
                            case "first":
                                while (c = c.previousSibling)
                                    if (c.nodeType === 1)
                                        return !1;
                                if (a === "first")
                                    return !0;
                                c = b;
                            case "last":
                                while (c = c.nextSibling)
                                    if (c.nodeType === 1)
                                        return !1;
                                return !0
                        }
                    }
                },PSEUDO: function(a, b) {
                    var c, d = e.pseudos[a] || e.setFilters[a.toLowerCase()] || bc.error("unsupported pseudo: " + a);
                    return d[o] ? d(b) : d.length > 1 ? (c = [a, a, "", b], e.setFilters.hasOwnProperty(a.toLowerCase()) ? z(function(a, c) {
                        var e, f = d(a, b), g = f.length;
                        while (g--)
                            e = y.call(a, f[g]), a[e] = !(c[e] = f[g])
                    }) : function(a) {
                        return d(a, 0, c)
                    }) : d
                }},pseudos: {not: z(function(a) {
                    var b = [], c = [], d = i(a.replace(L, "$1"));
                    return d[o] ? z(function(a, b, c, e) {
                        var f, g = d(a, null, e, []), h = a.length;
                        while (h--)
                            if (f = g[h])
                                a[h] = !(b[h] = f)
                    }) : function(a, e, f) {
                        return b[0] = a, d(b, null, f, c), !c.pop()
                    }
                }),has: z(function(a) {
                    return function(b) {
                        return bc(a, b).length > 0
                    }
                }),contains: z(function(a) {
                    return function(b) {
                        return (b.textContent || b.innerText || f(b)).indexOf(a) > -1
                    }
                }),enabled: function(a) {
                    return a.disabled === !1
                },disabled: function(a) {
                    return a.disabled === !0
                },checked: function(a) {
                    var b = a.nodeName.toLowerCase();
                    return b === "input" && !!a.checked || b === "option" && !!a.selected
                },selected: function(a) {
                    return a.parentNode && a.parentNode.selectedIndex, a.selected === !0
                },parent: function(a) {
                    return !e.pseudos.empty(a)
                },empty: function(a) {
                    var b;
                    a = a.firstChild;
                    while (a) {
                        if (a.nodeName > "@" || (b = a.nodeType) === 3 || b === 4)
                            return !1;
                        a = a.nextSibling
                    }
                    return !0
                },header: function(a) {
                    return T.test(a.nodeName)
                },text: function(a) {
                    var b, c;
                    return a.nodeName.toLowerCase() === "input" && (b = a.type) === "text" && ((c = a.getAttribute("type")) == null || c.toLowerCase() === b)
                },radio: bd("radio"),checkbox: bd("checkbox"),file: bd("file"),password: bd("password"),image: bd("image"),submit: be("submit"),reset: be("reset"),button: function(a) {
                    var b = a.nodeName.toLowerCase();
                    return b === "input" && a.type === "button" || b === "button"
                },input: function(a) {
                    return U.test(a.nodeName)
                },focus: function(a) {
                    var b = a.ownerDocument;
                    return a === b.activeElement && (!b.hasFocus || b.hasFocus()) && (!!a.type || !!a.href)
                },active: function(a) {
                    return a === a.ownerDocument.activeElement
                },first: bf(function(a, b, c) {
                    return [0]
                }),last: bf(function(a, b, c) {
                    return [b - 1]
                }),eq: bf(function(a, b, c) {
                    return [c < 0 ? c + b : c]
                }),even: bf(function(a, b, c) {
                    for (var d = 0; d < b; d += 2)
                        a.push(d);
                    return a
                }),odd: bf(function(a, b, c) {
                    for (var d = 1; d < b; d += 2)
                        a.push(d);
                    return a
                }),lt: bf(function(a, b, c) {
                    for (var d = c < 0 ? c + b : c; --d >= 0; )
                        a.push(d);
                    return a
                }),gt: bf(function(a, b, c) {
                    for (var d = c < 0 ? c + b : c; ++d < b; )
                        a.push(d);
                    return a
                })}}, j = s.compareDocumentPosition ? function(a, b) {
            return a === b ? (k = !0, 0) : (!a.compareDocumentPosition || !b.compareDocumentPosition ? a.compareDocumentPosition : a.compareDocumentPosition(b) & 4) ? -1 : 1
        } : function(a, b) {
            if (a === b)
                return k = !0, 0;
            if (a.sourceIndex && b.sourceIndex)
                return a.sourceIndex - b.sourceIndex;
            var c, d, e = [], f = [], g = a.parentNode, h = b.parentNode, i = g;
            if (g === h)
                return bg(a, b);
            if (!g)
                return -1;
            if (!h)
                return 1;
            while (i)
                e.unshift(i), i = i.parentNode;
            i = h;
            while (i)
                f.unshift(i), i = i.parentNode;
            c = e.length, d = f.length;
            for (var j = 0; j < c && j < d; j++)
                if (e[j] !== f[j])
                    return bg(e[j], f[j]);
            return j === c ? bg(a, f[j], -1) : bg(e[j], b, 1)
        }, [0, 0].sort(j), m = !k, bc.uniqueSort = function(a) {
            var b, c = 1;
            k = m, a.sort(j);
            if (k)
                for (; b = a[c]; c++)
                    b === a[c - 1] && a.splice(c--, 1);
            return a
        }, bc.error = function(a) {
            throw new Error("Syntax error, unrecognized expression: " + a)
        }, i = bc.compile = function(a, b) {
            var c, d = [], e = [], f = D[o][a];
            if (!f) {
                b || (b = bh(a)), c = b.length;
                while (c--)
                    f = bm(b[c]), f[o] ? d.push(f) : e.push(f);
                f = D(a, bn(e, d))
            }
            return f
        }, r.querySelectorAll && function() {
            var a, b = bp, c = /'|\\/g, d = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g, e = [":focus"], f = [":active", ":focus"], h = s.matchesSelector || s.mozMatchesSelector || s.webkitMatchesSelector || s.oMatchesSelector || s.msMatchesSelector;
            X(function(a) {
                a.innerHTML = "<select><option selected=''></option></select>", a.querySelectorAll("[selected]").length || e.push("\\[" + E + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)"), a.querySelectorAll(":checked").length || e.push(":checked")
            }), X(function(a) {
                a.innerHTML = "<p test=''></p>", a.querySelectorAll("[test^='']").length && e.push("[*^$]=" + E + "*(?:\"\"|'')"), a.innerHTML = "<input type='hidden'/>", a.querySelectorAll(":enabled").length || e.push(":enabled", ":disabled")
            }), e = new RegExp(e.join("|")), bp = function(a, d, f, g, h) {
                if (!g && !h && (!e || !e.test(a))) {
                    var i, j, k = !0, l = o, m = d, n = d.nodeType === 9 && a;
                    if (d.nodeType === 1 && d.nodeName.toLowerCase() !== "object") {
                        i = bh(a), (k = d.getAttribute("id")) ? l = k.replace(c, "\\$&") : d.setAttribute("id", l), l = "[id='" + l + "'] ", j = i.length;
                        while (j--)
                            i[j] = l + i[j].join("");
                        m = R.test(a) && d.parentNode || d, n = i.join(",")
                    }
                    if (n)
                        try {
                            return w.apply(f, x.call(m.querySelectorAll(n), 0)), f
                        } catch (p) {
                        }finally {
                            k || d.removeAttribute("id")
                        }
                }
                return b(a, d, f, g, h)
            }, h && (X(function(b) {
                a = h.call(b, "div");
                try {
                    h.call(b, "[test!='']:sizzle"), f.push("!=", J)
                } catch (c) {
                }
            }), f = new RegExp(f.join("|")), bc.matchesSelector = function(b, c) {
                c = c.replace(d, "='$1']");
                if (!g(b) && !f.test(c) && (!e || !e.test(c)))
                    try {
                        var i = h.call(b, c);
                        if (i || a || b.document && b.document.nodeType !== 11)
                            return i
                    } catch (j) {
                    }
                return bc(c, null, null, [b]).length > 0
            })
        }(), e.pseudos.nth = e.pseudos.eq, e.filters = bq.prototype = e.pseudos, e.setFilters = new bq, bc.attr = p.attr, p.find = bc, p.expr = bc.selectors, p.expr[":"] = p.expr.pseudos, p.unique = bc.uniqueSort, p.text = bc.getText, p.isXMLDoc = bc.isXML, p.contains = bc.contains
    }(a);
    var bc = /Until$/, bd = /^(?:parents|prev(?:Until|All))/, be = /^.[^:#\[\.,]*$/, bf = p.expr.match.needsContext, bg = {children: !0,contents: !0,next: !0,prev: !0};
    p.fn.extend({find: function(a) {
            var b, c, d, e, f, g, h = this;
            if (typeof a != "string")
                return p(a).filter(function() {
                    for (b = 0, c = h.length; b < c; b++)
                        if (p.contains(h[b], this))
                            return !0
                });
            g = this.pushStack("", "find", a);
            for (b = 0, c = this.length; b < c; b++) {
                d = g.length, p.find(a, this[b], g);
                if (b > 0)
                    for (e = d; e < g.length; e++)
                        for (f = 0; f < d; f++)
                            if (g[f] === g[e]) {
                                g.splice(e--, 1);
                                break
                            }
            }
            return g
        },has: function(a) {
            var b, c = p(a, this), d = c.length;
            return this.filter(function() {
                for (b = 0; b < d; b++)
                    if (p.contains(this, c[b]))
                        return !0
            })
        },not: function(a) {
            return this.pushStack(bj(this, a, !1), "not", a)
        },filter: function(a) {
            return this.pushStack(bj(this, a, !0), "filter", a)
        },is: function(a) {
            return !!a && (typeof a == "string" ? bf.test(a) ? p(a, this.context).index(this[0]) >= 0 : p.filter(a, this).length > 0 : this.filter(a).length > 0)
        },closest: function(a, b) {
            var c, d = 0, e = this.length, f = [], g = bf.test(a) || typeof a != "string" ? p(a, b || this.context) : 0;
            for (; d < e; d++) {
                c = this[d];
                while (c && c.ownerDocument && c !== b && c.nodeType !== 11) {
                    if (g ? g.index(c) > -1 : p.find.matchesSelector(c, a)) {
                        f.push(c);
                        break
                    }
                    c = c.parentNode
                }
            }
            return f = f.length > 1 ? p.unique(f) : f, this.pushStack(f, "closest", a)
        },index: function(a) {
            return a ? typeof a == "string" ? p.inArray(this[0], p(a)) : p.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.prevAll().length : -1
        },add: function(a, b) {
            var c = typeof a == "string" ? p(a, b) : p.makeArray(a && a.nodeType ? [a] : a), d = p.merge(this.get(), c);
            return this.pushStack(bh(c[0]) || bh(d[0]) ? d : p.unique(d))
        },addBack: function(a) {
            return this.add(a == null ? this.prevObject : this.prevObject.filter(a))
        }}), p.fn.andSelf = p.fn.addBack, p.each({parent: function(a) {
            var b = a.parentNode;
            return b && b.nodeType !== 11 ? b : null
        },parents: function(a) {
            return p.dir(a, "parentNode")
        },parentsUntil: function(a, b, c) {
            return p.dir(a, "parentNode", c)
        },next: function(a) {
            return bi(a, "nextSibling")
        },prev: function(a) {
            return bi(a, "previousSibling")
        },nextAll: function(a) {
            return p.dir(a, "nextSibling")
        },prevAll: function(a) {
            return p.dir(a, "previousSibling")
        },nextUntil: function(a, b, c) {
            return p.dir(a, "nextSibling", c)
        },prevUntil: function(a, b, c) {
            return p.dir(a, "previousSibling", c)
        },siblings: function(a) {
            return p.sibling((a.parentNode || {}).firstChild, a)
        },children: function(a) {
            return p.sibling(a.firstChild)
        },contents: function(a) {
            return p.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : p.merge([], a.childNodes)
        }}, function(a, b) {
        p.fn[a] = function(c, d) {
            var e = p.map(this, b, c);
            return bc.test(a) || (d = c), d && typeof d == "string" && (e = p.filter(d, e)), e = this.length > 1 && !bg[a] ? p.unique(e) : e, this.length > 1 && bd.test(a) && (e = e.reverse()), this.pushStack(e, a, k.call(arguments).join(","))
        }
    }), p.extend({filter: function(a, b, c) {
            return c && (a = ":not(" + a + ")"), b.length === 1 ? p.find.matchesSelector(b[0], a) ? [b[0]] : [] : p.find.matches(a, b)
        },dir: function(a, c, d) {
            var e = [], f = a[c];
            while (f && f.nodeType !== 9 && (d === b || f.nodeType !== 1 || !p(f).is(d)))
                f.nodeType === 1 && e.push(f), f = f[c];
            return e
        },sibling: function(a, b) {
            var c = [];
            for (; a; a = a.nextSibling)
                a.nodeType === 1 && a !== b && c.push(a);
            return c
        }});
    var bl = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", bm = / jQuery\d+="(?:null|\d+)"/g, bn = /^\s+/, bo = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, bp = /<([\w:]+)/, bq = /<tbody/i, br = /<|&#?\w+;/, bs = /<(?:script|style|link)/i, bt = /<(?:script|object|embed|option|style)/i, bu = new RegExp("<(?:" + bl + ")[\\s/>]", "i"), bv = /^(?:checkbox|radio)$/, bw = /checked\s*(?:[^=]|=\s*.checked.)/i, bx = /\/(java|ecma)script/i, by = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g, bz = {option: [1, "<select multiple='multiple'>", "</select>"],legend: [1, "<fieldset>", "</fieldset>"],thead: [1, "<table>", "</table>"],tr: [2, "<table><tbody>", "</tbody></table>"],td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],area: [1, "<map>", "</map>"],_default: [0, "", ""]}, bA = bk(e), bB = bA.appendChild(e.createElement("div"));
    bz.optgroup = bz.option, bz.tbody = bz.tfoot = bz.colgroup = bz.caption = bz.thead, bz.th = bz.td, p.support.htmlSerialize || (bz._default = [1, "X<div>", "</div>"]), p.fn.extend({text: function(a) {
            return p.access(this, function(a) {
                return a === b ? p.text(this) : this.empty().append((this[0] && this[0].ownerDocument || e).createTextNode(a))
            }, null, a, arguments.length)
        },wrapAll: function(a) {
            if (p.isFunction(a))
                return this.each(function(b) {
                    p(this).wrapAll(a.call(this, b))
                });
            if (this[0]) {
                var b = p(a, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && b.insertBefore(this[0]), b.map(function() {
                    var a = this;
                    while (a.firstChild && a.firstChild.nodeType === 1)
                        a = a.firstChild;
                    return a
                }).append(this)
            }
            return this
        },wrapInner: function(a) {
            return p.isFunction(a) ? this.each(function(b) {
                p(this).wrapInner(a.call(this, b))
            }) : this.each(function() {
                var b = p(this), c = b.contents();
                c.length ? c.wrapAll(a) : b.append(a)
            })
        },wrap: function(a) {
            var b = p.isFunction(a);
            return this.each(function(c) {
                p(this).wrapAll(b ? a.call(this, c) : a)
            })
        },unwrap: function() {
            return this.parent().each(function() {
                p.nodeName(this, "body") || p(this).replaceWith(this.childNodes)
            }).end()
        },append: function() {
            return this.domManip(arguments, !0, function(a) {
                (this.nodeType === 1 || this.nodeType === 11) && this.appendChild(a)
            })
        },prepend: function() {
            return this.domManip(arguments, !0, function(a) {
                (this.nodeType === 1 || this.nodeType === 11) && this.insertBefore(a, this.firstChild)
            })
        },before: function() {
            if (!bh(this[0]))
                return this.domManip(arguments, !1, function(a) {
                    this.parentNode.insertBefore(a, this)
                });
            if (arguments.length) {
                var a = p.clean(arguments);
                return this.pushStack(p.merge(a, this), "before", this.selector)
            }
        },after: function() {
            if (!bh(this[0]))
                return this.domManip(arguments, !1, function(a) {
                    this.parentNode.insertBefore(a, this.nextSibling)
                });
            if (arguments.length) {
                var a = p.clean(arguments);
                return this.pushStack(p.merge(this, a), "after", this.selector)
            }
        },remove: function(a, b) {
            var c, d = 0;
            for (; (c = this[d]) != null; d++)
                if (!a || p.filter(a, [c]).length)
                    !b && c.nodeType === 1 && (p.cleanData(c.getElementsByTagName("*")), p.cleanData([c])), c.parentNode && c.parentNode.removeChild(c);
            return this
        },empty: function() {
            var a, b = 0;
            for (; (a = this[b]) != null; b++) {
                a.nodeType === 1 && p.cleanData(a.getElementsByTagName("*"));
                while (a.firstChild)
                    a.removeChild(a.firstChild)
            }
            return this
        },clone: function(a, b) {
            return a = a == null ? !1 : a, b = b == null ? a : b, this.map(function() {
                return p.clone(this, a, b)
            })
        },html: function(a) {
            return p.access(this, function(a) {
                var c = this[0] || {}, d = 0, e = this.length;
                if (a === b)
                    return c.nodeType === 1 ? c.innerHTML.replace(bm, "") : b;
                if (typeof a == "string" && !bs.test(a) && (p.support.htmlSerialize || !bu.test(a)) && (p.support.leadingWhitespace || !bn.test(a)) && !bz[(bp.exec(a) || ["", ""])[1].toLowerCase()]) {
                    a = a.replace(bo, "<$1></$2>");
                    try {
                        for (; d < e; d++)
                            c = this[d] || {}, c.nodeType === 1 && (p.cleanData(c.getElementsByTagName("*")), c.innerHTML = a);
                        c = 0
                    } catch (f) {
                    }
                }
                c && this.empty().append(a)
            }, null, a, arguments.length)
        },replaceWith: function(a) {
            return bh(this[0]) ? this.length ? this.pushStack(p(p.isFunction(a) ? a() : a), "replaceWith", a) : this : p.isFunction(a) ? this.each(function(b) {
                var c = p(this), d = c.html();
                c.replaceWith(a.call(this, b, d))
            }) : (typeof a != "string" && (a = p(a).detach()), this.each(function() {
                var b = this.nextSibling, c = this.parentNode;
                p(this).remove(), b ? p(b).before(a) : p(c).append(a)
            }))
        },detach: function(a) {
            return this.remove(a, !0)
        },domManip: function(a, c, d) {
            a = [].concat.apply([], a);
            var e, f, g, h, i = 0, j = a[0], k = [], l = this.length;
            if (!p.support.checkClone && l > 1 && typeof j == "string" && bw.test(j))
                return this.each(function() {
                    p(this).domManip(a, c, d)
                });
            if (p.isFunction(j))
                return this.each(function(e) {
                    var f = p(this);
                    a[0] = j.call(this, e, c ? f.html() : b), f.domManip(a, c, d)
                });
            if (this[0]) {
                e = p.buildFragment(a, this, k), g = e.fragment, f = g.firstChild, g.childNodes.length === 1 && (g = f);
                if (f) {
                    c = c && p.nodeName(f, "tr");
                    for (h = e.cacheable || l - 1; i < l; i++)
                        d.call(c && p.nodeName(this[i], "table") ? bC(this[i], "tbody") : this[i], i === h ? g : p.clone(g, !0, !0))
                }
                g = f = null, k.length && p.each(k, function(a, b) {
                    b.src ? p.ajax ? p.ajax({url: b.src,type: "GET",dataType: "script",async: !1,global: !1,"throws": !0}) : p.error("no ajax") : p.globalEval((b.text || b.textContent || b.innerHTML || "").replace(by, "")), b.parentNode && b.parentNode.removeChild(b)
                })
            }
            return this
        }}), p.buildFragment = function(a, c, d) {
        var f, g, h, i = a[0];
        return c = c || e, c = !c.nodeType && c[0] || c, c = c.ownerDocument || c, a.length === 1 && typeof i == "string" && i.length < 512 && c === e && i.charAt(0) === "<" && !bt.test(i) && (p.support.checkClone || !bw.test(i)) && (p.support.html5Clone || !bu.test(i)) && (g = !0, f = p.fragments[i], h = f !== b), f || (f = c.createDocumentFragment(), p.clean(a, c, f, d), g && (p.fragments[i] = h && f)), {fragment: f,cacheable: g}
    }, p.fragments = {}, p.each({appendTo: "append",prependTo: "prepend",insertBefore: "before",insertAfter: "after",replaceAll: "replaceWith"}, function(a, b) {
        p.fn[a] = function(c) {
            var d, e = 0, f = [], g = p(c), h = g.length, i = this.length === 1 && this[0].parentNode;
            if ((i == null || i && i.nodeType === 11 && i.childNodes.length === 1) && h === 1)
                return g[b](this[0]), this;
            for (; e < h; e++)
                d = (e > 0 ? this.clone(!0) : this).get(), p(g[e])[b](d), f = f.concat(d);
            return this.pushStack(f, a, g.selector)
        }
    }), p.extend({clone: function(a, b, c) {
            var d, e, f, g;
            p.support.html5Clone || p.isXMLDoc(a) || !bu.test("<" + a.nodeName + ">") ? g = a.cloneNode(!0) : (bB.innerHTML = a.outerHTML, bB.removeChild(g = bB.firstChild));
            if ((!p.support.noCloneEvent || !p.support.noCloneChecked) && (a.nodeType === 1 || a.nodeType === 11) && !p.isXMLDoc(a)) {
                bE(a, g), d = bF(a), e = bF(g);
                for (f = 0; d[f]; ++f)
                    e[f] && bE(d[f], e[f])
            }
            if (b) {
                bD(a, g);
                if (c) {
                    d = bF(a), e = bF(g);
                    for (f = 0; d[f]; ++f)
                        bD(d[f], e[f])
                }
            }
            return d = e = null, g
        },clean: function(a, b, c, d) {
            var f, g, h, i, j, k, l, m, n, o, q, r, s = b === e && bA, t = [];
            if (!b || typeof b.createDocumentFragment == "undefined")
                b = e;
            for (f = 0; (h = a[f]) != null; f++) {
                typeof h == "number" && (h += "");
                if (!h)
                    continue;
                if (typeof h == "string")
                    if (!br.test(h))
                        h = b.createTextNode(h);
                    else {
                        s = s || bk(b), l = b.createElement("div"), s.appendChild(l), h = h.replace(bo, "<$1></$2>"), i = (bp.exec(h) || ["", ""])[1].toLowerCase(), j = bz[i] || bz._default, k = j[0], l.innerHTML = j[1] + h + j[2];
                        while (k--)
                            l = l.lastChild;
                        if (!p.support.tbody) {
                            m = bq.test(h), n = i === "table" && !m ? l.firstChild && l.firstChild.childNodes : j[1] === "<table>" && !m ? l.childNodes : [];
                            for (g = n.length - 1; g >= 0; --g)
                                p.nodeName(n[g], "tbody") && !n[g].childNodes.length && n[g].parentNode.removeChild(n[g])
                        }
                        !p.support.leadingWhitespace && bn.test(h) && l.insertBefore(b.createTextNode(bn.exec(h)[0]), l.firstChild), h = l.childNodes, l.parentNode.removeChild(l)
                    }
                h.nodeType ? t.push(h) : p.merge(t, h)
            }
            l && (h = l = s = null);
            if (!p.support.appendChecked)
                for (f = 0; (h = t[f]) != null; f++)
                    p.nodeName(h, "input") ? bG(h) : typeof h.getElementsByTagName != "undefined" && p.grep(h.getElementsByTagName("input"), bG);
            if (c) {
                q = function(a) {
                    if (!a.type || bx.test(a.type))
                        return d ? d.push(a.parentNode ? a.parentNode.removeChild(a) : a) : c.appendChild(a)
                };
                for (f = 0; (h = t[f]) != null; f++)
                    if (!p.nodeName(h, "script") || !q(h))
                        c.appendChild(h), typeof h.getElementsByTagName != "undefined" && (r = p.grep(p.merge([], h.getElementsByTagName("script")), q), t.splice.apply(t, [f + 1, 0].concat(r)), f += r.length)
            }
            return t
        },cleanData: function(a, b) {
            var c, d, e, f, g = 0, h = p.expando, i = p.cache, j = p.support.deleteExpando, k = p.event.special;
            for (; (e = a[g]) != null; g++)
                if (b || p.acceptData(e)) {
                    d = e[h], c = d && i[d];
                    if (c) {
                        if (c.events)
                            for (f in c.events)
                                k[f] ? p.event.remove(e, f) : p.removeEvent(e, f, c.handle);
                        i[d] && (delete i[d], j ? delete e[h] : e.removeAttribute ? e.removeAttribute(h) : e[h] = null, p.deletedIds.push(d))
                    }
                }
        }}), function() {
        var a, b;
        p.uaMatch = function(a) {
            a = a.toLowerCase();
            var b = /(chrome)[ \/]([\w.]+)/.exec(a) || /(webkit)[ \/]([\w.]+)/.exec(a) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(a) || /(msie) ([\w.]+)/.exec(a) || a.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(a) || [];
            return {browser: b[1] || "",version: b[2] || "0"}
        }, a = p.uaMatch(g.userAgent), b = {}, a.browser && (b[a.browser] = !0, b.version = a.version), b.chrome ? b.webkit = !0 : b.webkit && (b.safari = !0), p.browser = b, p.sub = function() {
            function a(b, c) {
                return new a.fn.init(b, c)
            }
            p.extend(!0, a, this), a.superclass = this, a.fn = a.prototype = this(), a.fn.constructor = a, a.sub = this.sub, a.fn.init = function c(c, d) {
                return d && d instanceof p && !(d instanceof a) && (d = a(d)), p.fn.init.call(this, c, d, b)
            }, a.fn.init.prototype = a.fn;
            var b = a(e);
            return a
        }
    }();
    var bH, bI, bJ, bK = /alpha\([^)]*\)/i, bL = /opacity=([^)]*)/, bM = /^(top|right|bottom|left)$/, bN = /^(none|table(?!-c[ea]).+)/, bO = /^margin/, bP = new RegExp("^(" + q + ")(.*)$", "i"), bQ = new RegExp("^(" + q + ")(?!px)[a-z%]+$", "i"), bR = new RegExp("^([-+])=(" + q + ")", "i"), bS = {}, bT = {position: "absolute",visibility: "hidden",display: "block"}, bU = {letterSpacing: 0,fontWeight: 400}, bV = ["Top", "Right", "Bottom", "Left"], bW = ["Webkit", "O", "Moz", "ms"], bX = p.fn.toggle;
    p.fn.extend({css: function(a, c) {
            return p.access(this, function(a, c, d) {
                return d !== b ? p.style(a, c, d) : p.css(a, c)
            }, a, c, arguments.length > 1)
        },show: function() {
            return b$(this, !0)
        },hide: function() {
            return b$(this)
        },toggle: function(a, b) {
            var c = typeof a == "boolean";
            return p.isFunction(a) && p.isFunction(b) ? bX.apply(this, arguments) : this.each(function() {
                (c ? a : bZ(this)) ? p(this).show() : p(this).hide()
            })
        }}), p.extend({cssHooks: {opacity: {get: function(a, b) {
                    if (b) {
                        var c = bH(a, "opacity");
                        return c === "" ? "1" : c
                    }
                }}},cssNumber: {fillOpacity: !0,fontWeight: !0,lineHeight: !0,opacity: !0,orphans: !0,widows: !0,zIndex: !0,zoom: !0},cssProps: {"float": p.support.cssFloat ? "cssFloat" : "styleFloat"},style: function(a, c, d, e) {
            if (!a || a.nodeType === 3 || a.nodeType === 8 || !a.style)
                return;
            var f, g, h, i = p.camelCase(c), j = a.style;
            c = p.cssProps[i] || (p.cssProps[i] = bY(j, i)), h = p.cssHooks[c] || p.cssHooks[i];
            if (d === b)
                return h && "get" in h && (f = h.get(a, !1, e)) !== b ? f : j[c];
            g = typeof d, g === "string" && (f = bR.exec(d)) && (d = (f[1] + 1) * f[2] + parseFloat(p.css(a, c)), g = "number");
            if (d == null || g === "number" && isNaN(d))
                return;
            g === "number" && !p.cssNumber[i] && (d += "px");
            if (!h || !("set" in h) || (d = h.set(a, d, e)) !== b)
                try {
                    j[c] = d
                } catch (k) {
                }
        },css: function(a, c, d, e) {
            var f, g, h, i = p.camelCase(c);
            return c = p.cssProps[i] || (p.cssProps[i] = bY(a.style, i)), h = p.cssHooks[c] || p.cssHooks[i], h && "get" in h && (f = h.get(a, !0, e)), f === b && (f = bH(a, c)), f === "normal" && c in bU && (f = bU[c]), d || e !== b ? (g = parseFloat(f), d || p.isNumeric(g) ? g || 0 : f) : f
        },swap: function(a, b, c) {
            var d, e, f = {};
            for (e in b)
                f[e] = a.style[e], a.style[e] = b[e];
            d = c.call(a);
            for (e in b)
                a.style[e] = f[e];
            return d
        }}), a.getComputedStyle ? bH = function(b, c) {
        var d, e, f, g, h = a.getComputedStyle(b, null), i = b.style;
        return h && (d = h[c], d === "" && !p.contains(b.ownerDocument, b) && (d = p.style(b, c)), bQ.test(d) && bO.test(c) && (e = i.width, f = i.minWidth, g = i.maxWidth, i.minWidth = i.maxWidth = i.width = d, d = h.width, i.width = e, i.minWidth = f, i.maxWidth = g)), d
    } : e.documentElement.currentStyle && (bH = function(a, b) {
        var c, d, e = a.currentStyle && a.currentStyle[b], f = a.style;
        return e == null && f && f[b] && (e = f[b]), bQ.test(e) && !bM.test(b) && (c = f.left, d = a.runtimeStyle && a.runtimeStyle.left, d && (a.runtimeStyle.left = a.currentStyle.left), f.left = b === "fontSize" ? "1em" : e, e = f.pixelLeft + "px", f.left = c, d && (a.runtimeStyle.left = d)), e === "" ? "auto" : e
    }), p.each(["height", "width"], function(a, b) {
        p.cssHooks[b] = {get: function(a, c, d) {
                if (c)
                    return a.offsetWidth === 0 && bN.test(bH(a, "display")) ? p.swap(a, bT, function() {
                        return cb(a, b, d)
                    }) : cb(a, b, d)
            },set: function(a, c, d) {
                return b_(a, c, d ? ca(a, b, d, p.support.boxSizing && p.css(a, "boxSizing") === "border-box") : 0)
            }}
    }), p.support.opacity || (p.cssHooks.opacity = {get: function(a, b) {
            return bL.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : b ? "1" : ""
        },set: function(a, b) {
            var c = a.style, d = a.currentStyle, e = p.isNumeric(b) ? "alpha(opacity=" + b * 100 + ")" : "", f = d && d.filter || c.filter || "";
            c.zoom = 1;
            if (b >= 1 && p.trim(f.replace(bK, "")) === "" && c.removeAttribute) {
                c.removeAttribute("filter");
                if (d && !d.filter)
                    return
            }
            c.filter = bK.test(f) ? f.replace(bK, e) : f + " " + e
        }}), p(function() {
        p.support.reliableMarginRight || (p.cssHooks.marginRight = {get: function(a, b) {
                return p.swap(a, {display: "inline-block"}, function() {
                    if (b)
                        return bH(a, "marginRight")
                })
            }}), !p.support.pixelPosition && p.fn.position && p.each(["top", "left"], function(a, b) {
            p.cssHooks[b] = {get: function(a, c) {
                    if (c) {
                        var d = bH(a, b);
                        return bQ.test(d) ? p(a).position()[b] + "px" : d
                    }
                }}
        })
    }), p.expr && p.expr.filters && (p.expr.filters.hidden = function(a) {
        return a.offsetWidth === 0 && a.offsetHeight === 0 || !p.support.reliableHiddenOffsets && (a.style && a.style.display || bH(a, "display")) === "none"
    }, p.expr.filters.visible = function(a) {
        return !p.expr.filters.hidden(a)
    }), p.each({margin: "",padding: "",border: "Width"}, function(a, b) {
        p.cssHooks[a + b] = {expand: function(c) {
                var d, e = typeof c == "string" ? c.split(" ") : [c], f = {};
                for (d = 0; d < 4; d++)
                    f[a + bV[d] + b] = e[d] || e[d - 2] || e[0];
                return f
            }}, bO.test(a) || (p.cssHooks[a + b].set = b_)
    });
    var cd = /%20/g, ce = /\[\]$/, cf = /\r?\n/g, cg = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i, ch = /^(?:select|textarea)/i;
    p.fn.extend({serialize: function() {
            return p.param(this.serializeArray())
        },serializeArray: function() {
            return this.map(function() {
                return this.elements ? p.makeArray(this.elements) : this
            }).filter(function() {
                return this.name && !this.disabled && (this.checked || ch.test(this.nodeName) || cg.test(this.type))
            }).map(function(a, b) {
                var c = p(this).val();
                return c == null ? null : p.isArray(c) ? p.map(c, function(a, c) {
                    return {name: b.name,value: a.replace(cf, "\r\n")}
                }) : {name: b.name,value: c.replace(cf, "\r\n")}
            }).get()
        }}), p.param = function(a, c) {
        var d, e = [], f = function(a, b) {
            b = p.isFunction(b) ? b() : b == null ? "" : b, e[e.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
        };
        c === b && (c = p.ajaxSettings && p.ajaxSettings.traditional);
        if (p.isArray(a) || a.jquery && !p.isPlainObject(a))
            p.each(a, function() {
                f(this.name, this.value)
            });
        else
            for (d in a)
                ci(d, a[d], c, f);
        return e.join("&").replace(cd, "+")
    };
    var cj, ck, cl = /#.*$/, cm = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, cn = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/, co = /^(?:GET|HEAD)$/, cp = /^\/\//, cq = /\?/, cr = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, cs = /([?&])_=[^&]*/, ct = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/, cu = p.fn.load, cv = {}, cw = {}, cx = ["*/"] + ["*"];
    try {
        ck = f.href
    } catch (cy) {
        ck = e.createElement("a"), ck.href = "", ck = ck.href
    }
    cj = ct.exec(ck.toLowerCase()) || [], p.fn.load = function(a, c, d) {
        if (typeof a != "string" && cu)
            return cu.apply(this, arguments);
        if (!this.length)
            return this;
        var e, f, g, h = this, i = a.indexOf(" ");
        return i >= 0 && (e = a.slice(i, a.length), a = a.slice(0, i)), p.isFunction(c) ? (d = c, c = b) : c && typeof c == "object" && (f = "POST"), p.ajax({url: a,type: f,dataType: "html",data: c,complete: function(a, b) {
                d && h.each(d, g || [a.responseText, b, a])
            }}).done(function(a) {
            g = arguments, h.html(e ? p("<div>").append(a.replace(cr, "")).find(e) : a)
        }), this
    }, p.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(a, b) {
        p.fn[b] = function(a) {
            return this.on(b, a)
        }
    }), p.each(["get", "post"], function(a, c) {
        p[c] = function(a, d, e, f) {
            return p.isFunction(d) && (f = f || e, e = d, d = b), p.ajax({type: c,url: a,data: d,success: e,dataType: f})
        }
    }), p.extend({getScript: function(a, c) {
            return p.get(a, b, c, "script")
        },getJSON: function(a, b, c) {
            return p.get(a, b, c, "json")
        },ajaxSetup: function(a, b) {
            return b ? cB(a, p.ajaxSettings) : (b = a, a = p.ajaxSettings), cB(a, b), a
        },ajaxSettings: {url: ck,isLocal: cn.test(cj[1]),global: !0,type: "GET",contentType: "application/x-www-form-urlencoded; charset=UTF-8",processData: !0,async: !0,accepts: {xml: "application/xml, text/xml",html: "text/html",text: "text/plain",json: "application/json, text/javascript","*": cx},contents: {xml: /xml/,html: /html/,json: /json/},responseFields: {xml: "responseXML",text: "responseText"},converters: {"* text": a.String,"text html": !0,"text json": p.parseJSON,"text xml": p.parseXML},flatOptions: {context: !0,url: !0}},ajaxPrefilter: cz(cv),ajaxTransport: cz(cw),ajax: function(a, c) {
            function y(a, c, f, i) {
                var k, s, t, u, w, y = c;
                if (v === 2)
                    return;
                v = 2, h && clearTimeout(h), g = b, e = i || "", x.readyState = a > 0 ? 4 : 0, f && (u = cC(l, x, f));
                if (a >= 200 && a < 300 || a === 304)
                    l.ifModified && (w = x.getResponseHeader("Last-Modified"), w && (p.lastModified[d] = w), w = x.getResponseHeader("Etag"), w && (p.etag[d] = w)), a === 304 ? (y = "notmodified", k = !0) : (k = cD(l, u), y = k.state, s = k.data, t = k.error, k = !t);
                else {
                    t = y;
                    if (!y || a)
                        y = "error", a < 0 && (a = 0)
                }
                x.status = a, x.statusText = (c || y) + "", k ? o.resolveWith(m, [s, y, x]) : o.rejectWith(m, [x, y, t]), x.statusCode(r), r = b, j && n.trigger("ajax" + (k ? "Success" : "Error"), [x, l, k ? s : t]), q.fireWith(m, [x, y]), j && (n.trigger("ajaxComplete", [x, l]), --p.active || p.event.trigger("ajaxStop"))
            }
            typeof a == "object" && (c = a, a = b), c = c || {};
            var d, e, f, g, h, i, j, k, l = p.ajaxSetup({}, c), m = l.context || l, n = m !== l && (m.nodeType || m instanceof p) ? p(m) : p.event, o = p.Deferred(), q = p.Callbacks("once memory"), r = l.statusCode || {}, t = {}, u = {}, v = 0, w = "canceled", x = {readyState: 0,setRequestHeader: function(a, b) {
                    if (!v) {
                        var c = a.toLowerCase();
                        a = u[c] = u[c] || a, t[a] = b
                    }
                    return this
                },getAllResponseHeaders: function() {
                    return v === 2 ? e : null
                },getResponseHeader: function(a) {
                    var c;
                    if (v === 2) {
                        if (!f) {
                            f = {};
                            while (c = cm.exec(e))
                                f[c[1].toLowerCase()] = c[2]
                        }
                        c = f[a.toLowerCase()]
                    }
                    return c === b ? null : c
                },overrideMimeType: function(a) {
                    return v || (l.mimeType = a), this
                },abort: function(a) {
                    return a = a || w, g && g.abort(a), y(0, a), this
                }};
            o.promise(x), x.success = x.done, x.error = x.fail, x.complete = q.add, x.statusCode = function(a) {
                if (a) {
                    var b;
                    if (v < 2)
                        for (b in a)
                            r[b] = [r[b], a[b]];
                    else
                        b = a[x.status], x.always(b)
                }
                return this
            }, l.url = ((a || l.url) + "").replace(cl, "").replace(cp, cj[1] + "//"), l.dataTypes = p.trim(l.dataType || "*").toLowerCase().split(s), l.crossDomain == null && (i = ct.exec(l.url.toLowerCase()) || !1, l.crossDomain = i && i.join(":") + (i[3] ? "" : i[1] === "http:" ? 80 : 443) !== cj.join(":") + (cj[3] ? "" : cj[1] === "http:" ? 80 : 443)), l.data && l.processData && typeof l.data != "string" && (l.data = p.param(l.data, l.traditional)), cA(cv, l, c, x);
            if (v === 2)
                return x;
            j = l.global, l.type = l.type.toUpperCase(), l.hasContent = !co.test(l.type), j && p.active++ === 0 && p.event.trigger("ajaxStart");
            if (!l.hasContent) {
                l.data && (l.url += (cq.test(l.url) ? "&" : "?") + l.data, delete l.data), d = l.url;
                if (l.cache === !1) {
                    var z = p.now(), A = l.url.replace(cs, "$1_=" + z);
                    l.url = A + (A === l.url ? (cq.test(l.url) ? "&" : "?") + "_=" + z : "")
                }
            }
            (l.data && l.hasContent && l.contentType !== !1 || c.contentType) && x.setRequestHeader("Content-Type", l.contentType), l.ifModified && (d = d || l.url, p.lastModified[d] && x.setRequestHeader("If-Modified-Since", p.lastModified[d]), p.etag[d] && x.setRequestHeader("If-None-Match", p.etag[d])), x.setRequestHeader("Accept", l.dataTypes[0] && l.accepts[l.dataTypes[0]] ? l.accepts[l.dataTypes[0]] + (l.dataTypes[0] !== "*" ? ", " + cx + "; q=0.01" : "") : l.accepts["*"]);
            for (k in l.headers)
                x.setRequestHeader(k, l.headers[k]);
            if (!l.beforeSend || l.beforeSend.call(m, x, l) !== !1 && v !== 2) {
                w = "abort";
                for (k in {success: 1,error: 1,complete: 1})
                    x[k](l[k]);
                g = cA(cw, l, c, x);
                if (!g)
                    y(-1, "No Transport");
                else {
                    x.readyState = 1, j && n.trigger("ajaxSend", [x, l]), l.async && l.timeout > 0 && (h = setTimeout(function() {
                        x.abort("timeout")
                    }, l.timeout));
                    try {
                        v = 1, g.send(t, y)
                    } catch (B) {
                        if (v < 2)
                            y(-1, B);
                        else
                            throw B
                    }
                }
                return x
            }
            return x.abort()
        },active: 0,lastModified: {},etag: {}});
    var cE = [], cF = /\?/, cG = /(=)\?(?=&|$)|\?\?/, cH = p.now();
    p.ajaxSetup({jsonp: "callback",jsonpCallback: function() {
            var a = cE.pop() || p.expando + "_" + cH++;
            return this[a] = !0, a
        }}), p.ajaxPrefilter("json jsonp", function(c, d, e) {
        var f, g, h, i = c.data, j = c.url, k = c.jsonp !== !1, l = k && cG.test(j), m = k && !l && typeof i == "string" && !(c.contentType || "").indexOf("application/x-www-form-urlencoded") && cG.test(i);
        if (c.dataTypes[0] === "jsonp" || l || m)
            return f = c.jsonpCallback = p.isFunction(c.jsonpCallback) ? c.jsonpCallback() : c.jsonpCallback, g = a[f], l ? c.url = j.replace(cG, "$1" + f) : m ? c.data = i.replace(cG, "$1" + f) : k && (c.url += (cF.test(j) ? "&" : "?") + c.jsonp + "=" + f), c.converters["script json"] = function() {
                return h || p.error(f + " was not called"), h[0]
            }, c.dataTypes[0] = "json", a[f] = function() {
                h = arguments
            }, e.always(function() {
                a[f] = g, c[f] && (c.jsonpCallback = d.jsonpCallback, cE.push(f)), h && p.isFunction(g) && g(h[0]), h = g = b
            }), "script"
    }), p.ajaxSetup({accepts: {script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents: {script: /javascript|ecmascript/},converters: {"text script": function(a) {
                return p.globalEval(a), a
            }}}), p.ajaxPrefilter("script", function(a) {
        a.cache === b && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1)
    }), p.ajaxTransport("script", function(a) {
        if (a.crossDomain) {
            var c, d = e.head || e.getElementsByTagName("head")[0] || e.documentElement;
            return {send: function(f, g) {
                    c = e.createElement("script"), c.async = "async", a.scriptCharset && (c.charset = a.scriptCharset), c.src = a.url, c.onload = c.onreadystatechange = function(a, e) {
                        if (e || !c.readyState || /loaded|complete/.test(c.readyState))
                            c.onload = c.onreadystatechange = null, d && c.parentNode && d.removeChild(c), c = b, e || g(200, "success")
                    }, d.insertBefore(c, d.firstChild)
                },abort: function() {
                    c && c.onload(0, 1)
                }}
        }
    });
    var cI, cJ = a.ActiveXObject ? function() {
        for (var a in cI)
            cI[a](0, 1)
    } : !1, cK = 0;
    p.ajaxSettings.xhr = a.ActiveXObject ? function() {
        return !this.isLocal && cL() || cM()
    } : cL, function(a) {
        p.extend(p.support, {ajax: !!a,cors: !!a && "withCredentials" in a})
    }(p.ajaxSettings.xhr()), p.support.ajax && p.ajaxTransport(function(c) {
        if (!c.crossDomain || p.support.cors) {
            var d;
            return {send: function(e, f) {
                    var g, h, i = c.xhr();
                    c.username ? i.open(c.type, c.url, c.async, c.username, c.password) : i.open(c.type, c.url, c.async);
                    if (c.xhrFields)
                        for (h in c.xhrFields)
                            i[h] = c.xhrFields[h];
                    c.mimeType && i.overrideMimeType && i.overrideMimeType(c.mimeType), !c.crossDomain && !e["X-Requested-With"] && (e["X-Requested-With"] = "XMLHttpRequest");
                    try {
                        for (h in e)
                            i.setRequestHeader(h, e[h])
                    } catch (j) {
                    }
                    i.send(c.hasContent && c.data || null), d = function(a, e) {
                        var h, j, k, l, m;
                        try {
                            if (d && (e || i.readyState === 4)) {
                                d = b, g && (i.onreadystatechange = p.noop, cJ && delete cI[g]);
                                if (e)
                                    i.readyState !== 4 && i.abort();
                                else {
                                    h = i.status, k = i.getAllResponseHeaders(), l = {}, m = i.responseXML, m && m.documentElement && (l.xml = m);
                                    try {
                                        l.text = i.responseText
                                    } catch (a) {
                                    }
                                    try {
                                        j = i.statusText
                                    } catch (n) {
                                        j = ""
                                    }
                                    !h && c.isLocal && !c.crossDomain ? h = l.text ? 200 : 404 : h === 1223 && (h = 204)
                                }
                            }
                        } catch (o) {
                            e || f(-1, o)
                        }
                        l && f(h, j, l, k)
                    }, c.async ? i.readyState === 4 ? setTimeout(d, 0) : (g = ++cK, cJ && (cI || (cI = {}, p(a).unload(cJ)), cI[g] = d), i.onreadystatechange = d) : d()
                },abort: function() {
                    d && d(0, 1)
                }}
        }
    });
    var cN, cO, cP = /^(?:toggle|show|hide)$/, cQ = new RegExp("^(?:([-+])=|)(" + q + ")([a-z%]*)$", "i"), cR = /queueHooks$/, cS = [cY], cT = {"*": [function(a, b) {
                var c, d, e = this.createTween(a, b), f = cQ.exec(b), g = e.cur(), h = +g || 0, i = 1, j = 20;
                if (f) {
                    c = +f[2], d = f[3] || (p.cssNumber[a] ? "" : "px");
                    if (d !== "px" && h) {
                        h = p.css(e.elem, a, !0) || c || 1;
                        do
                            i = i || ".5", h = h / i, p.style(e.elem, a, h + d);
                        while (i !== (i = e.cur() / g) && i !== 1 && --j)
                    }
                    e.unit = d, e.start = h, e.end = f[1] ? h + (f[1] + 1) * c : c
                }
                return e
            }]};
    p.Animation = p.extend(cW, {tweener: function(a, b) {
            p.isFunction(a) ? (b = a, a = ["*"]) : a = a.split(" ");
            var c, d = 0, e = a.length;
            for (; d < e; d++)
                c = a[d], cT[c] = cT[c] || [], cT[c].unshift(b)
        },prefilter: function(a, b) {
            b ? cS.unshift(a) : cS.push(a)
        }}), p.Tween = cZ, cZ.prototype = {constructor: cZ,init: function(a, b, c, d, e, f) {
            this.elem = a, this.prop = c, this.easing = e || "swing", this.options = b, this.start = this.now = this.cur(), this.end = d, this.unit = f || (p.cssNumber[c] ? "" : "px")
        },cur: function() {
            var a = cZ.propHooks[this.prop];
            return a && a.get ? a.get(this) : cZ.propHooks._default.get(this)
        },run: function(a) {
            var b, c = cZ.propHooks[this.prop];
            return this.options.duration ? this.pos = b = p.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : this.pos = b = a, this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), c && c.set ? c.set(this) : cZ.propHooks._default.set(this), this
        }}, cZ.prototype.init.prototype = cZ.prototype, cZ.propHooks = {_default: {get: function(a) {
                var b;
                return a.elem[a.prop] == null || !!a.elem.style && a.elem.style[a.prop] != null ? (b = p.css(a.elem, a.prop, !1, ""), !b || b === "auto" ? 0 : b) : a.elem[a.prop]
            },set: function(a) {
                p.fx.step[a.prop] ? p.fx.step[a.prop](a) : a.elem.style && (a.elem.style[p.cssProps[a.prop]] != null || p.cssHooks[a.prop]) ? p.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now
            }}}, cZ.propHooks.scrollTop = cZ.propHooks.scrollLeft = {set: function(a) {
            a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
        }}, p.each(["toggle", "show", "hide"], function(a, b) {
        var c = p.fn[b];
        p.fn[b] = function(d, e, f) {
            return d == null || typeof d == "boolean" || !a && p.isFunction(d) && p.isFunction(e) ? c.apply(this, arguments) : this.animate(c$(b, !0), d, e, f)
        }
    }), p.fn.extend({fadeTo: function(a, b, c, d) {
            return this.filter(bZ).css("opacity", 0).show().end().animate({opacity: b}, a, c, d)
        },animate: function(a, b, c, d) {
            var e = p.isEmptyObject(a), f = p.speed(b, c, d), g = function() {
                var b = cW(this, p.extend({}, a), f);
                e && b.stop(!0)
            };
            return e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
        },stop: function(a, c, d) {
            var e = function(a) {
                var b = a.stop;
                delete a.stop, b(d)
            };
            return typeof a != "string" && (d = c, c = a, a = b), c && a !== !1 && this.queue(a || "fx", []), this.each(function() {
                var b = !0, c = a != null && a + "queueHooks", f = p.timers, g = p._data(this);
                if (c)
                    g[c] && g[c].stop && e(g[c]);
                else
                    for (c in g)
                        g[c] && g[c].stop && cR.test(c) && e(g[c]);
                for (c = f.length; c--; )
                    f[c].elem === this && (a == null || f[c].queue === a) && (f[c].anim.stop(d), b = !1, f.splice(c, 1));
                (b || !d) && p.dequeue(this, a)
            })
        }}), p.each({slideDown: c$("show"),slideUp: c$("hide"),slideToggle: c$("toggle"),fadeIn: {opacity: "show"},fadeOut: {opacity: "hide"},fadeToggle: {opacity: "toggle"}}, function(a, b) {
        p.fn[a] = function(a, c, d) {
            return this.animate(b, a, c, d)
        }
    }), p.speed = function(a, b, c) {
        var d = a && typeof a == "object" ? p.extend({}, a) : {complete: c || !c && b || p.isFunction(a) && a,duration: a,easing: c && b || b && !p.isFunction(b) && b};
        d.duration = p.fx.off ? 0 : typeof d.duration == "number" ? d.duration : d.duration in p.fx.speeds ? p.fx.speeds[d.duration] : p.fx.speeds._default;
        if (d.queue == null || d.queue === !0)
            d.queue = "fx";
        return d.old = d.complete, d.complete = function() {
            p.isFunction(d.old) && d.old.call(this), d.queue && p.dequeue(this, d.queue)
        }, d
    }, p.easing = {linear: function(a) {
            return a
        },swing: function(a) {
            return .5 - Math.cos(a * Math.PI) / 2
        }}, p.timers = [], p.fx = cZ.prototype.init, p.fx.tick = function() {
        var a, b = p.timers, c = 0;
        for (; c < b.length; c++)
            a = b[c], !a() && b[c] === a && b.splice(c--, 1);
        b.length || p.fx.stop()
    }, p.fx.timer = function(a) {
        a() && p.timers.push(a) && !cO && (cO = setInterval(p.fx.tick, p.fx.interval))
    }, p.fx.interval = 13, p.fx.stop = function() {
        clearInterval(cO), cO = null
    }, p.fx.speeds = {slow: 600,fast: 200,_default: 400}, p.fx.step = {}, p.expr && p.expr.filters && (p.expr.filters.animated = function(a) {
        return p.grep(p.timers, function(b) {
            return a === b.elem
        }).length
    });
    var c_ = /^(?:body|html)$/i;
    p.fn.offset = function(a) {
        if (arguments.length)
            return a === b ? this : this.each(function(b) {
                p.offset.setOffset(this, a, b)
            });
        var c, d, e, f, g, h, i, j = {top: 0,left: 0}, k = this[0], l = k && k.ownerDocument;
        if (!l)
            return;
        return (d = l.body) === k ? p.offset.bodyOffset(k) : (c = l.documentElement, p.contains(c, k) ? (typeof k.getBoundingClientRect != "undefined" && (j = k.getBoundingClientRect()), e = da(l), f = c.clientTop || d.clientTop || 0, g = c.clientLeft || d.clientLeft || 0, h = e.pageYOffset || c.scrollTop, i = e.pageXOffset || c.scrollLeft, {top: j.top + h - f,left: j.left + i - g}) : j)
    }, p.offset = {bodyOffset: function(a) {
            var b = a.offsetTop, c = a.offsetLeft;
            return p.support.doesNotIncludeMarginInBodyOffset && (b += parseFloat(p.css(a, "marginTop")) || 0, c += parseFloat(p.css(a, "marginLeft")) || 0), {top: b,left: c}
        },setOffset: function(a, b, c) {
            var d = p.css(a, "position");
            d === "static" && (a.style.position = "relative");
            var e = p(a), f = e.offset(), g = p.css(a, "top"), h = p.css(a, "left"), i = (d === "absolute" || d === "fixed") && p.inArray("auto", [g, h]) > -1, j = {}, k = {}, l, m;
            i ? (k = e.position(), l = k.top, m = k.left) : (l = parseFloat(g) || 0, m = parseFloat(h) || 0), p.isFunction(b) && (b = b.call(a, c, f)), b.top != null && (j.top = b.top - f.top + l), b.left != null && (j.left = b.left - f.left + m), "using" in b ? b.using.call(a, j) : e.css(j)
        }}, p.fn.extend({position: function() {
            if (!this[0])
                return;
            var a = this[0], b = this.offsetParent(), c = this.offset(), d = c_.test(b[0].nodeName) ? {top: 0,left: 0} : b.offset();
            return c.top -= parseFloat(p.css(a, "marginTop")) || 0, c.left -= parseFloat(p.css(a, "marginLeft")) || 0, d.top += parseFloat(p.css(b[0], "borderTopWidth")) || 0, d.left += parseFloat(p.css(b[0], "borderLeftWidth")) || 0, {top: c.top - d.top,left: c.left - d.left}
        },offsetParent: function() {
            return this.map(function() {
                var a = this.offsetParent || e.body;
                while (a && !c_.test(a.nodeName) && p.css(a, "position") === "static")
                    a = a.offsetParent;
                return a || e.body
            })
        }}), p.each({scrollLeft: "pageXOffset",scrollTop: "pageYOffset"}, function(a, c) {
        var d = /Y/.test(c);
        p.fn[a] = function(e) {
            return p.access(this, function(a, e, f) {
                var g = da(a);
                if (f === b)
                    return g ? c in g ? g[c] : g.document.documentElement[e] : a[e];
                g ? g.scrollTo(d ? p(g).scrollLeft() : f, d ? f : p(g).scrollTop()) : a[e] = f
            }, a, e, arguments.length, null)
        }
    }), p.each({Height: "height",Width: "width"}, function(a, c) {
        p.each({padding: "inner" + a,content: c,"": "outer" + a}, function(d, e) {
            p.fn[e] = function(e, f) {
                var g = arguments.length && (d || typeof e != "boolean"), h = d || (e === !0 || f === !0 ? "margin" : "border");
                return p.access(this, function(c, d, e) {
                    var f;
                    return p.isWindow(c) ? c.document.documentElement["client" + a] : c.nodeType === 9 ? (f = c.documentElement, Math.max(c.body["scroll" + a], f["scroll" + a], c.body["offset" + a], f["offset" + a], f["client" + a])) : e === b ? p.css(c, d, e, h) : p.style(c, d, e, h)
                }, c, g ? e : b, g, null)
            }
        })
    }), a.jQuery = a.$ = p, typeof define == "function" && define.amd && define.amd.jQuery && define("jquery", [], function() {
        return p
    })
})(window);
/**! @license
Video.js - HTML5 Video Player
Version 3.2.0

LGPL v3 LICENSE INFO
This file is part of Video.js. Copyright 2011 Zencoder, Inc.

Video.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Video.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with Video.js.  If not, see <http://www.gnu.org/licenses/>.
*/
(function(window, undefined) {
    var document = window.document;
    document.createElement("video");
    document.createElement("audio");
    var VideoJS = function(id, addOptions, ready) {
        var tag;
        if (typeof id == "string") {
            if (id.indexOf("#") === 0) {
                id = id.slice(1)
            }
            if (_V_.players[id]) {
                return _V_.players[id]
            } else {
                tag = _V_.el(id)
            }
        } else {
            tag = id
        }
        if (!tag || !tag.nodeName) {
            throw new TypeError("The element or ID supplied is not valid. (VideoJS)")
        }
        return tag.player || new _V_.Player(tag, addOptions, ready)
    }, _V_ = VideoJS, CDN_VERSION = "3.2";
    VideoJS.players = {};
    VideoJS.options = {techOrder: ["html5", "flash"],html5: {},flash: {swf: "http://vjs.zencdn.net/c/video-js.swf"},width: "auto",height: "auto",defaultVolume: 0,components: {posterImage: {},textTrackDisplay: {},loadingSpinner: {},bigPlayButton: {},controlBar: {}}};
    if (CDN_VERSION != "GENERATED_CDN_VSN") {
        _V_.options.flash.swf = "http://vjs.zencdn.net/" + CDN_VERSION + "/video-js.swf"
    }
    _V_.merge = function(obj1, obj2, safe) {
        if (!obj2) {
            obj2 = {}
        }
        for (var attrname in obj2) {
            if (obj2.hasOwnProperty(attrname) && (!safe || !obj1.hasOwnProperty(attrname))) {
                obj1[attrname] = obj2[attrname]
            }
        }
        return obj1
    };
    _V_.extend = function(obj) {
        this.merge(this, obj, true)
    };
    _V_.extend({tech: {},controlSets: {},isIE: function() {
            return !+"\v1"
        },isFF: function() {
            return !!_V_.ua.match("Firefox")
        },isIPad: function() {
            return navigator.userAgent.match(/iPad/i) !== null
        },isIPhone: function() {
            return navigator.userAgent.match(/iPhone/i) !== null
        },isIOS: function() {
            return VideoJS.isIPhone() || VideoJS.isIPad()
        },iOSVersion: function() {
            var match = navigator.userAgent.match(/OS (\d+)_/i);
            if (match && match[1]) {
                return match[1]
            }
        },isAndroid: function() {
            return navigator.userAgent.match(/Android.*AppleWebKit/i) !== null
        },androidVersion: function() {
            var match = navigator.userAgent.match(/Android (\d+)\./i);
            if (match && match[1]) {
                return match[1]
            }
        },testVid: document.createElement("video"),ua: navigator.userAgent,support: {},each: function(arr, fn) {
            if (!arr || arr.length === 0) {
                return
            }
            for (var i = 0, j = arr.length; i < j; i++) {
                fn.call(this, arr[i], i)
            }
        },eachProp: function(obj, fn) {
            if (!obj) {
                return
            }
            for (var name in obj) {
                if (obj.hasOwnProperty(name)) {
                    fn.call(this, name, obj[name])
                }
            }
        },el: function(id) {
            return document.getElementById(id)
        },createElement: function(tagName, attributes) {
            var el = document.createElement(tagName), attrname;
            for (attrname in attributes) {
                if (attributes.hasOwnProperty(attrname)) {
                    if (attrname.indexOf("-") !== -1) {
                        el.setAttribute(attrname, attributes[attrname])
                    } else {
                        el[attrname] = attributes[attrname]
                    }
                }
            }
            return el
        },insertFirst: function(node, parent) {
            if (parent.firstChild) {
                parent.insertBefore(node, parent.firstChild)
            } else {
                parent.appendChild(node)
            }
        },addClass: function(element, classToAdd) {
            if ((" " + element.className + " ").indexOf(" " + classToAdd + " ") == -1) {
                element.className = element.className === "" ? classToAdd : element.className + " " + classToAdd
            }
        },removeClass: function(element, classToRemove) {
            if (element.className.indexOf(classToRemove) == -1) {
                return
            }
            var classNames = element.className.split(" ");
            classNames.splice(classNames.indexOf(classToRemove), 1);
            element.className = classNames.join(" ")
        },remove: function(item, array) {
            if (!array) {
                return
            }
            var i = array.indexOf(item);
            if (i != -1) {
                return array.splice(i, 1)
            }
        },blockTextSelection: function() {
            document.body.focus();
            document.onselectstart = function() {
                return false
            }
        },unblockTextSelection: function() {
            document.onselectstart = function() {
                return true
            }
        },formatTime: function(seconds, guide) {
            guide = guide || seconds;
            var s = Math.floor(seconds % 60), m = Math.floor(seconds / 60 % 60), h = Math.floor(seconds / 3600), gm = Math.floor(guide / 60 % 60), gh = Math.floor(guide / 3600);
            h = (h > 0 || gh > 0) ? h + ":" : "";
            m = (((h || gm >= 10) && m < 10) ? "0" + m : m) + ":";
            s = (s < 10) ? "0" + s : s;
            return h + m + s
        },uc: function(string) {
            return string.charAt(0).toUpperCase() + string.slice(1)
        },getRelativePosition: function(x, relativeElement) {
            return Math.max(0, Math.min(1, (x - _V_.findPosX(relativeElement)) / relativeElement.offsetWidth))
        },getComputedStyleValue: function(element, style) {
            return window.getComputedStyle(element, null).getPropertyValue(style)
        },trim: function(string) {
            return string.toString().replace(/^\s+/, "").replace(/\s+$/, "")
        },round: function(num, dec) {
            if (!dec) {
                dec = 0
            }
            return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec)
        },isEmpty: function(object) {
            for (var prop in object) {
                return false
            }
            return true
        },createTimeRange: function(start, end) {
            return {length: 1,start: function() {
                    return start
                },end: function() {
                    return end
                }}
        },cache: {},guid: 1,expando: "vdata" + (new Date).getTime(),getData: function(elem) {
            var id = elem[_V_.expando];
            if (!id) {
                id = elem[_V_.expando] = _V_.guid++;
                _V_.cache[id] = {}
            }
            return _V_.cache[id]
        },removeData: function(elem) {
            var id = elem[_V_.expando];
            if (!id) {
                return
            }
            delete _V_.cache[id];
            try {
                delete elem[_V_.expando]
            } catch (e) {
                if (elem.removeAttribute) {
                    elem.removeAttribute(_V_.expando)
                } else {
                    elem[_V_.expando] = null
                }
            }
        },proxy: function(context, fn, uid) {
            if (!fn.guid) {
                fn.guid = _V_.guid++
            }
            var ret = function() {
                return fn.apply(context, arguments)
            };
            ret.guid = (uid) ? uid + "_" + fn.guid : fn.guid;
            return ret
        },get: function(url, onSuccess, onError) {
            var local = (url.indexOf("file:") == 0 || (window.location.href.indexOf("file:") == 0 && url.indexOf("http:") == -1));
            if (typeof XMLHttpRequest == "undefined") {
                XMLHttpRequest = function() {
                    try {
                        return new ActiveXObject("Msxml2.XMLHTTP.6.0")
                    } catch (e) {
                    }
                    try {
                        return new ActiveXObject("Msxml2.XMLHTTP.3.0")
                    } catch (f) {
                    }
                    try {
                        return new ActiveXObject("Msxml2.XMLHTTP")
                    } catch (g) {
                    }
                    throw new Error("This browser does not support XMLHttpRequest.")
                }
            }
            var request = new XMLHttpRequest();
            try {
                request.open("GET", url)
            } catch (e) {
                _V_.log("VideoJS XMLHttpRequest (open)", e);
                return false
            }
            request.onreadystatechange = _V_.proxy(this, function() {
                if (request.readyState == 4) {
                    if (request.status == 200 || local && request.status == 0) {
                        onSuccess(request.responseText)
                    } else {
                        if (onError) {
                            onError()
                        }
                    }
                }
            });
            try {
                request.send()
            } catch (e) {
                _V_.log("VideoJS XMLHttpRequest (send)", e);
                if (onError) {
                    onError(e)
                }
            }
        },setLocalStorage: function(key, value) {
            var localStorage = window.localStorage || false;
            if (!localStorage) {
                return
            }
            try {
                localStorage[key] = value
            } catch (e) {
                if (e.code == 22 || e.code == 1014) {
                    _V_.log("LocalStorage Full (VideoJS)", e)
                } else {
                    _V_.log("LocalStorage Error (VideoJS)", e)
                }
            }
        },getAbsoluteURL: function(url) {
            if (!url.match(/^https?:\/\//)) {
                url = _V_.createElement("div", {innerHTML: '<a href="' + url + '">x</a>'}).firstChild.href
            }
            return url
        }});
    _V_.log = function() {
        _V_.log.history = _V_.log.history || [];
        _V_.log.history.push(arguments);
        if (window.console) {
            arguments.callee = arguments.callee.caller;
            var newarr = [].slice.call(arguments);
            (typeof console.log === "object" ? _V_.log.apply.call(console.log, console, newarr) : console.log.apply(console, newarr))
        }
    };
    (function(b) {
        function c() {
        }
        for (var d = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","), a; a = d.pop(); ) {
            b[a] = b[a] || c
        }
    })((function() {
        try {
            console.log();
            return window.console
        } catch (err) {
            return window.console = {}
        }
    })());
    if ("getBoundingClientRect" in document.documentElement) {
        _V_.findPosX = function(el) {
            var box;
            try {
                box = el.getBoundingClientRect()
            } catch (e) {
            }
            if (!box) {
                return 0
            }
            var docEl = document.documentElement, body = document.body, clientLeft = docEl.clientLeft || body.clientLeft || 0, scrollLeft = window.pageXOffset || body.scrollLeft, left = box.left + scrollLeft - clientLeft;
            return left
        }
    } else {
        _V_.findPosX = function(el) {
            var curleft = el.offsetLeft;
            while (el = obj.offsetParent) {
                if (el.className.indexOf("video-js") == -1) {
                } else {
                }
                curleft += el.offsetLeft
            }
            return curleft
        }
    }
    (function() {
        var initializing = false, fnTest = /xyz/.test(function() {
            xyz
        }) ? /\b_super\b/ : /.*/;
        _V_.Class = function() {
        };
        _V_.Class.extend = function(prop) {
            var _super = this.prototype;
            initializing = true;
            var prototype = new this();
            initializing = false;
            for (var name in prop) {
                prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? (function(name, fn) {
                    return function() {
                        var tmp = this._super;
                        this._super = _super[name];
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;
                        return ret
                    }
                })(name, prop[name]) : prop[name]
            }
            function Class() {
                if (!initializing && this.init) {
                    return this.init.apply(this, arguments)
                } else {
                    if (!initializing) {
                        return arguments.callee.prototype.init()
                    }
                }
            }
            Class.prototype = prototype;
            Class.constructor = Class;
            Class.extend = arguments.callee;
            return Class
        }
    })();
    _V_.Component = _V_.Class.extend({init: function(player, options) {
            this.player = player;
            options = this.options = _V_.merge(this.options || {}, options);
            if (options.el) {
                this.el = options.el
            } else {
                this.el = this.createElement()
            }
            this.initComponents()
        },destroy: function() {
        },createElement: function(type, attrs) {
            return _V_.createElement(type || "div", attrs)
        },buildCSSClass: function() {
            return ""
        },initComponents: function() {
            var options = this.options;
            if (options && options.components) {
                this.eachProp(options.components, function(name, opts) {
                    var tempAdd = this.proxy(function() {
                        this[name] = this.addComponent(name, opts)
                    });
                    if (opts.loadEvent) {
                        this.one(opts.loadEvent, tempAdd)
                    } else {
                        tempAdd()
                    }
                })
            }
        },addComponent: function(name, options) {
            var component, componentClass;
            if (typeof name == "string") {
                options = options || {};
                componentClass = options.componentClass || _V_.uc(name);
                component = new _V_[componentClass](this.player || this, options)
            } else {
                component = name
            }
            this.el.appendChild(component.el);
            return component
        },removeComponent: function(component) {
            this.el.removeChild(component.el)
        },show: function() {
            this.el.style.display = "block"
        },hide: function() {
            this.el.style.display = "none"
        },fadeIn: function() {
            this.removeClass("vjs-fade-out");
            this.addClass("vjs-fade-in")
        },fadeOut: function() {
            this.removeClass("vjs-fade-in");
            this.addClass("vjs-fade-out")
        },lockShowing: function() {
            var style = this.el.style;
            style.display = "block";
            style.opacity = 1;
            style.visiblity = "visible"
        },unlockShowing: function() {
            var style = this.el.style;
            style.display = "";
            style.opacity = "";
            style.visiblity = ""
        },addClass: function(classToAdd) {
            _V_.addClass(this.el, classToAdd)
        },removeClass: function(classToRemove) {
            _V_.removeClass(this.el, classToRemove)
        },addEvent: function(type, fn, uid) {
            return _V_.addEvent(this.el, type, _V_.proxy(this, fn))
        },removeEvent: function(type, fn) {
            return _V_.removeEvent(this.el, type, fn)
        },triggerEvent: function(type, e) {
            return _V_.triggerEvent(this.el, type, e)
        },one: function(type, fn) {
            _V_.one(this.el, type, _V_.proxy(this, fn))
        },ready: function(fn) {
            if (!fn) {
                return this
            }
            if (this.isReady) {
                fn.call(this)
            } else {
                if (this.readyQueue === undefined) {
                    this.readyQueue = []
                }
                this.readyQueue.push(fn)
            }
            return this
        },triggerReady: function() {
            this.isReady = true;
            if (this.readyQueue && this.readyQueue.length > 0) {
                this.each(this.readyQueue, function(fn) {
                    fn.call(this)
                });
                this.readyQueue = [];
                this.triggerEvent("ready")
            }
        },each: function(arr, fn) {
            _V_.each.call(this, arr, fn)
        },eachProp: function(obj, fn) {
            _V_.eachProp.call(this, obj, fn)
        },extend: function(obj) {
            _V_.merge(this, obj)
        },proxy: function(fn, uid) {
            return _V_.proxy(this, fn, uid)
        }});
    _V_.Control = _V_.Component.extend({buildCSSClass: function() {
            return "vjs-control " + this._super()
        }});
    _V_.ControlBar = _V_.Component.extend({options: {loadEvent: "play",components: {playToggle: {},fullscreenToggle: {},currentTimeDisplay: {},timeDivider: {},durationDisplay: {},remainingTimeDisplay: {},progressControl: {},volumeControl: {},muteToggle: {}}},init: function(player, options) {
            this._super(player, options);
            player.addEvent("play", this.proxy(function() {
                this.fadeIn();
                this.player.addEvent("mouseover", this.proxy(this.fadeIn));
                this.player.addEvent("mouseout", this.proxy(this.fadeOut))
            }))
        },createElement: function() {
            return _V_.createElement("div", {className: "vjs-controls"})
        },fadeIn: function() {
            this._super();
            this.player.triggerEvent("controlsvisible")
        },fadeOut: function() {
            this._super();
            this.player.triggerEvent("controlshidden")
        },lockShowing: function() {
            this.el.style.opacity = "1"
        }});
    _V_.Button = _V_.Control.extend({init: function(player, options) {
            this._super(player, options);
            this.addEvent("click", this.onClick);
            this.addEvent("focus", this.onFocus);
            this.addEvent("blur", this.onBlur)
        },createElement: function(type, attrs) {
            attrs = _V_.merge({className: this.buildCSSClass(),innerHTML: '<div><span class="vjs-control-text">' + (this.buttonText || "Need Text") + "</span></div>",role: "button",tabIndex: 0}, attrs);
            return this._super(type, attrs)
        },onClick: function() {
        },onFocus: function() {
            _V_.addEvent(document, "keyup", _V_.proxy(this, this.onKeyPress))
        },onKeyPress: function(event) {
            if (event.which == 32 || event.which == 13) {
                event.preventDefault();
                this.onClick()
            }
        },onBlur: function() {
            _V_.removeEvent(document, "keyup", _V_.proxy(this, this.onKeyPress))
        }});
    _V_.PlayButton = _V_.Button.extend({buttonText: "Play",buildCSSClass: function() {
            return "vjs-play-button " + this._super()
        },onClick: function() {
            this.player.play()
        }});
    _V_.PauseButton = _V_.Button.extend({buttonText: "Pause",buildCSSClass: function() {
            return "vjs-pause-button " + this._super()
        },onClick: function() {
            this.player.pause()
        }});
    _V_.PlayToggle = _V_.Button.extend({buttonText: "Play",init: function(player, options) {
            this._super(player, options);
            player.addEvent("play", _V_.proxy(this, this.onPlay));
            player.addEvent("pause", _V_.proxy(this, this.onPause))
        },buildCSSClass: function() {
            return "vjs-play-control " + this._super()
        },onClick: function() {
            if (this.player.paused()) {
                this.player.play()
            } else {
                this.player.pause()
            }
        },onPlay: function() {
            _V_.removeClass(this.el, "vjs-paused");
            _V_.addClass(this.el, "vjs-playing")
        },onPause: function() {
            _V_.removeClass(this.el, "vjs-playing");
            _V_.addClass(this.el, "vjs-paused")
        }});
    _V_.FullscreenToggle = _V_.Button.extend({buttonText: "Fullscreen",buildCSSClass: function() {
            return "vjs-fullscreen-control " + this._super()
        },onClick: function() {
            if (!this.player.isFullScreen) {
                this.player.requestFullScreen()
            } else {
                this.player.cancelFullScreen()
            }
        }});
    _V_.BigPlayButton = _V_.Button.extend({init: function(player, options) {
            this._super(player, options);
            player.addEvent("play", _V_.proxy(this, this.hide));
            player.addEvent("ended", _V_.proxy(this, this.show))
        },createElement: function() {
            return this._super("div", {className: "vjs-big-play-button",innerHTML: "<span></span>"})
        },onClick: function() {
            if (this.player.currentTime()) {
                this.player.currentTime(0)
            }
            this.player.play()
        }});
    _V_.LoadingSpinner = _V_.Component.extend({init: function(player, options) {
            this._super(player, options);
            player.addEvent("canplay", _V_.proxy(this, this.hide));
            player.addEvent("canplaythrough", _V_.proxy(this, this.hide));
            player.addEvent("playing", _V_.proxy(this, this.hide));
            player.addEvent("seeking", _V_.proxy(this, this.show));
            player.addEvent("error", _V_.proxy(this, this.show));
            player.addEvent("waiting", _V_.proxy(this, this.show))
        },createElement: function() {
            var classNameSpinner, innerHtmlSpinner;
            if (typeof this.player.el.style.WebkitBorderRadius == "string" || typeof this.player.el.style.MozBorderRadius == "string" || typeof this.player.el.style.KhtmlBorderRadius == "string" || typeof this.player.el.style.borderRadius == "string") {
                classNameSpinner = "vjs-loading-spinner";
                innerHtmlSpinner = "<div class='ball1'></div><div class='ball2'></div><div class='ball3'></div><div class='ball4'></div><div class='ball5'></div><div class='ball6'></div><div class='ball7'></div><div class='ball8'></div>"
            } else {
                classNameSpinner = "vjs-loading-spinner-fallback";
                innerHtmlSpinner = ""
            }
            return this._super("div", {className: classNameSpinner,innerHTML: innerHtmlSpinner})
        }});
    _V_.CurrentTimeDisplay = _V_.Component.extend({init: function(player, options) {
            this._super(player, options);
            player.addEvent("timeupdate", _V_.proxy(this, this.updateContent))
        },createElement: function() {
            var el = this._super("div", {className: "vjs-current-time vjs-time-controls vjs-control"});
            this.content = _V_.createElement("div", {className: "vjs-current-time-display",innerHTML: "0:00"});
            el.appendChild(_V_.createElement("div").appendChild(this.content));
            return el
        },updateContent: function() {
            var time = (this.player.scrubbing) ? this.player.values.currentTime : this.player.currentTime();
            this.content.innerHTML = _V_.formatTime(time, this.player.duration())
        }});
    _V_.DurationDisplay = _V_.Component.extend({init: function(player, options) {
            this._super(player, options);
            player.addEvent("timeupdate", _V_.proxy(this, this.updateContent))
        },createElement: function() {
            var el = this._super("div", {className: "vjs-duration vjs-time-controls vjs-control"});
            this.content = _V_.createElement("div", {className: "vjs-duration-display",innerHTML: "0:00"});
            el.appendChild(_V_.createElement("div").appendChild(this.content));
            return el
        },updateContent: function() {
            if (this.player.duration()) {
                this.content.innerHTML = _V_.formatTime(this.player.duration())
            }
        }});
    _V_.TimeDivider = _V_.Component.extend({createElement: function() {
            return this._super("div", {className: "vjs-time-divider",innerHTML: "<div><span>/</span></div>"})
        }});
    _V_.RemainingTimeDisplay = _V_.Component.extend({init: function(player, options) {
            this._super(player, options);
            player.addEvent("timeupdate", _V_.proxy(this, this.updateContent))
        },createElement: function() {
            var el = this._super("div", {className: "vjs-remaining-time vjs-time-controls vjs-control"});
            this.content = _V_.createElement("div", {className: "vjs-remaining-time-display",innerHTML: "-0:00"});
            el.appendChild(_V_.createElement("div").appendChild(this.content));
            return el
        },updateContent: function() {
            if (this.player.duration()) {
                this.content.innerHTML = "-" + _V_.formatTime(this.player.remainingTime())
            }
        }});
    _V_.Slider = _V_.Component.extend({init: function(player, options) {
            this._super(player, options);
            player.addEvent(this.playerEvent, _V_.proxy(this, this.update));
            this.addEvent("mousedown", this.onMouseDown);
            this.addEvent("focus", this.onFocus);
            this.addEvent("blur", this.onBlur);
            this.player.addEvent("controlsvisible", this.proxy(this.update));
            this.update()
        },createElement: function(type, attrs) {
            attrs = _V_.merge({role: "slider","aria-valuenow": 0,"aria-valuemin": 0,"aria-valuemax": 100,tabIndex: 0}, attrs);
            return this._super(type, attrs)
        },onMouseDown: function(event) {
            event.preventDefault();
            _V_.blockTextSelection();
            _V_.addEvent(document, "mousemove", _V_.proxy(this, this.onMouseMove));
            _V_.addEvent(document, "mouseup", _V_.proxy(this, this.onMouseUp));
            this.onMouseMove(event)
        },onMouseUp: function(event) {
            _V_.unblockTextSelection();
            _V_.removeEvent(document, "mousemove", this.onMouseMove, false);
            _V_.removeEvent(document, "mouseup", this.onMouseUp, false);
            this.update()
        },update: function() {
            var barProgress, progress = this.getPercent();
            handle = this.handle, bar = this.bar;
            if (isNaN(progress)) {
                progress = 0
            }
            barProgress = progress;
            if (handle) {
                var box = this.el, boxWidth = box.offsetWidth, handleWidth = handle.el.offsetWidth, handlePercent = (handleWidth) ? handleWidth / boxWidth : 0, boxAdjustedPercent = 1 - handlePercent;
                adjustedProgress = progress * boxAdjustedPercent, barProgress = adjustedProgress + (handlePercent / 2);
                handle.el.style.left = _V_.round(adjustedProgress * 100, 2) + "%"
            }
            bar.el.style.width = _V_.round(barProgress * 100, 2) + "%"
        },calculateDistance: function(event) {
            var box = this.el, boxX = _V_.findPosX(box), boxW = box.offsetWidth, handle = this.handle;
            if (handle) {
                var handleW = handle.el.offsetWidth;
                boxX = boxX + (handleW / 2);
                boxW = boxW - handleW
            }
            return Math.max(0, Math.min(1, (event.pageX - boxX) / boxW))
        },onFocus: function(event) {
            _V_.addEvent(document, "keyup", _V_.proxy(this, this.onKeyPress))
        },onKeyPress: function(event) {
            if (event.which == 37) {
                event.preventDefault();
                this.stepBack()
            } else {
                if (event.which == 39) {
                    event.preventDefault();
                    this.stepForward()
                }
            }
        },onBlur: function(event) {
            _V_.removeEvent(document, "keyup", _V_.proxy(this, this.onKeyPress))
        }});
    _V_.ProgressControl = _V_.Component.extend({options: {components: {seekBar: {}}},createElement: function() {
            return this._super("div", {className: "vjs-progress-control vjs-control"})
        }});
    _V_.SeekBar = _V_.Slider.extend({options: {components: {loadProgressBar: {},bar: {componentClass: "PlayProgressBar"},handle: {componentClass: "SeekHandle"}}},playerEvent: "timeupdate",init: function(player, options) {
            this._super(player, options)
        },createElement: function() {
            return this._super("div", {className: "vjs-progress-holder"})
        },getPercent: function() {
            return this.player.currentTime() / this.player.duration()
        },onMouseDown: function(event) {
            this._super(event);
            this.player.scrubbing = true;
            this.videoWasPlaying = !this.player.paused();
            this.player.pause()
        },onMouseMove: function(event) {
            var newTime = this.calculateDistance(event) * this.player.duration();
            if (newTime == this.player.duration()) {
                newTime = newTime - 0.1
            }
            this.player.currentTime(newTime)
        },onMouseUp: function(event) {
            this._super(event);
            this.player.scrubbing = false;
            if (this.videoWasPlaying) {
                this.player.play()
            }
        },stepForward: function() {
            this.player.currentTime(this.player.currentTime() + 1)
        },stepBack: function() {
            this.player.currentTime(this.player.currentTime() - 1)
        }});
    _V_.LoadProgressBar = _V_.Component.extend({init: function(player, options) {
            this._super(player, options);
            player.addEvent("progress", _V_.proxy(this, this.update))
        },createElement: function() {
            return this._super("div", {className: "vjs-load-progress",innerHTML: '<span class="vjs-control-text">Loaded: 0%</span>'})
        },update: function() {
            if (this.el.style) {
                this.el.style.width = _V_.round(this.player.bufferedPercent() * 100, 2) + "%"
            }
        }});
    _V_.PlayProgressBar = _V_.Component.extend({createElement: function() {
            return this._super("div", {className: "vjs-play-progress",innerHTML: '<span class="vjs-control-text">Progress: 0%</span>'})
        }});
    _V_.SeekHandle = _V_.Component.extend({createElement: function() {
            return this._super("div", {className: "vjs-seek-handle",innerHTML: '<span class="vjs-control-text">00:00</span>'})
        }});
    _V_.VolumeControl = _V_.Component.extend({options: {components: {volumeBar: {}}},createElement: function() {
            return this._super("div", {className: "vjs-volume-control vjs-control"})
        }});
    _V_.VolumeBar = _V_.Slider.extend({options: {components: {bar: {componentClass: "VolumeLevel"},handle: {componentClass: "VolumeHandle"}}},playerEvent: "volumechange",createElement: function() {
            return this._super("div", {className: "vjs-volume-bar"})
        },onMouseMove: function(event) {
            this.player.volume(this.calculateDistance(event))
        },getPercent: function() {
            return this.player.volume()
        },stepForward: function() {
            this.player.volume(this.player.volume() + 0.1)
        },stepBack: function() {
            this.player.volume(this.player.volume() - 0.1)
        }});
    _V_.VolumeLevel = _V_.Component.extend({createElement: function() {
            return this._super("div", {className: "vjs-volume-level",innerHTML: '<span class="vjs-control-text"></span>'})
        }});
    _V_.VolumeHandle = _V_.Component.extend({createElement: function() {
            return this._super("div", {className: "vjs-volume-handle",innerHTML: '<span class="vjs-control-text"></span>'})
        }});
    _V_.MuteToggle = _V_.Button.extend({init: function(player, options) {
            this._super(player, options);
            player.addEvent("volumechange", _V_.proxy(this, this.update))
        },createElement: function() {
            return this._super("div", {className: "vjs-mute-control vjs-control",innerHTML: '<div><span class="vjs-control-text">Mute</span></div>'})
        },onClick: function(event) {
            this.player.muted(this.player.muted() ? false : true)
        },update: function(event) {
            var vol = this.player.volume(), level = 3;
            if (vol == 0 || this.player.muted()) {
                level = 0
            } else {
                if (vol < 0.33) {
                    level = 1
                } else {
                    if (vol < 0.67) {
                        level = 2
                    }
                }
            }
            _V_.each.call(this, [0, 1, 2, 3], function(i) {
                _V_.removeClass(this.el, "vjs-vol-" + i)
            });
            _V_.addClass(this.el, "vjs-vol-" + level)
        }});
    _V_.PosterImage = _V_.Button.extend({init: function(player, options) {
            this._super(player, options);
            if (!this.player.options.poster) {
                this.hide()
            }
            player.addEvent("play", _V_.proxy(this, this.hide))
        },createElement: function() {
            return _V_.createElement("img", {className: "vjs-poster",src: this.player.options.poster,tabIndex: -1})
        },onClick: function() {
            this.player.play()
        }});
    _V_.Menu = _V_.Component.extend({init: function(player, options) {
            this._super(player, options)
        },addItem: function(component) {
            this.addComponent(component);
            component.addEvent("click", this.proxy(function() {
                this.unlockShowing()
            }))
        },createElement: function() {
            return this._super("ul", {className: "vjs-menu"})
        }});
    _V_.MenuItem = _V_.Button.extend({init: function(player, options) {
            this._super(player, options);
            if (options.selected) {
                this.addClass("vjs-selected")
            }
        },createElement: function(type, attrs) {
            return this._super("li", _V_.merge({className: "vjs-menu-item",innerHTML: this.options.label}, attrs))
        },onClick: function() {
            this.selected(true)
        },selected: function(selected) {
            if (selected) {
                this.addClass("vjs-selected")
            } else {
                this.removeClass("vjs-selected")
            }
        }});
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(searchElement) {
            if (this === void 0 || this === null) {
                throw new TypeError()
            }
            var t = Object(this);
            var len = t.length >>> 0;
            if (len === 0) {
                return -1
            }
            var n = 0;
            if (arguments.length > 0) {
                n = Number(arguments[1]);
                if (n !== n) {
                    n = 0
                } else {
                    if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
                        n = (n > 0 || -1) * Math.floor(Math.abs(n))
                    }
                }
            }
            if (n >= len) {
                return -1
            }
            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
            for (; k < len; k++) {
                if (k in t && t[k] === searchElement) {
                    return k
                }
            }
            return -1
        }
    }
    _V_.extend({addEvent: function(elem, type, fn) {
            var data = _V_.getData(elem), handlers;
            if (data && !data.handler) {
                data.handler = function(event) {
                    event = _V_.fixEvent(event);
                    var handlers = _V_.getData(elem).events[event.type];
                    if (handlers) {
                        var handlersCopy = [];
                        _V_.each(handlers, function(handler, i) {
                            handlersCopy[i] = handler
                        });
                        for (var i = 0, l = handlersCopy.length; i < l; i++) {
                            handlersCopy[i].call(elem, event)
                        }
                    }
                }
            }
            if (!data.events) {
                data.events = {}
            }
            handlers = data.events[type];
            if (!handlers) {
                handlers = data.events[type] = [];
                if (document.addEventListener) {
                    elem.addEventListener(type, data.handler, false)
                } else {
                    if (document.attachEvent) {
                        elem.attachEvent("on" + type, data.handler)
                    }
                }
            }
            if (!fn.guid) {
                fn.guid = _V_.guid++
            }
            handlers.push(fn)
        },removeEvent: function(elem, type, fn) {
            var data = _V_.getData(elem), handlers;
            if (!data.events) {
                return
            }
            if (!type) {
                for (type in data.events) {
                    _V_.cleanUpEvents(elem, type)
                }
                return
            }
            handlers = data.events[type];
            if (!handlers) {
                return
            }
            if (fn && fn.guid) {
                for (var i = 0; i < handlers.length; i++) {
                    if (handlers[i].guid === fn.guid) {
                        handlers.splice(i--, 1)
                    }
                }
            }
            _V_.cleanUpEvents(elem, type)
        },cleanUpEvents: function(elem, type) {
            var data = _V_.getData(elem);
            if (data.events[type].length === 0) {
                delete data.events[type];
                if (document.removeEventListener) {
                    elem.removeEventListener(type, data.handler, false)
                } else {
                    if (document.detachEvent) {
                        elem.detachEvent("on" + type, data.handler)
                    }
                }
            }
            if (_V_.isEmpty(data.events)) {
                delete data.events;
                delete data.handler
            }
            if (_V_.isEmpty(data)) {
                _V_.removeData(elem)
            }
        },fixEvent: function(event) {
            if (event[_V_.expando]) {
                return event
            }
            var originalEvent = event;
            event = new _V_.Event(originalEvent);
            for (var i = _V_.Event.props.length, prop; i; ) {
                prop = _V_.Event.props[--i];
                event[prop] = originalEvent[prop]
            }
            if (!event.target) {
                event.target = event.srcElement || document
            }
            if (event.target.nodeType === 3) {
                event.target = event.target.parentNode
            }
            if (!event.relatedTarget && event.fromElement) {
                event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement
            }
            if (event.pageX == null && event.clientX != null) {
                var eventDocument = event.target.ownerDocument || document, doc = eventDocument.documentElement, body = eventDocument.body;
                event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0)
            }
            if (event.which == null && (event.charCode != null || event.keyCode != null)) {
                event.which = event.charCode != null ? event.charCode : event.keyCode
            }
            if (!event.metaKey && event.ctrlKey) {
                event.metaKey = event.ctrlKey
            }
            if (!event.which && event.button !== undefined) {
                event.which = (event.button & 1 ? 1 : (event.button & 2 ? 3 : (event.button & 4 ? 2 : 0)))
            }
            return event
        },triggerEvent: function(elem, event) {
            var data = _V_.getData(elem), parent = elem.parentNode || elem.ownerDocument, type = event.type || event, handler;
            if (data) {
                handler = data.handler
            }
            event = typeof event === "object" ? event[_V_.expando] ? event : new _V_.Event(type, event) : new _V_.Event(type);
            event.type = type;
            if (handler) {
                handler.call(elem, event)
            }
            event.result = undefined;
            event.target = elem
        },one: function(elem, type, fn) {
            _V_.addEvent(elem, type, function() {
                _V_.removeEvent(elem, type, arguments.callee);
                fn.apply(this, arguments)
            })
        }});
    _V_.Event = function(src, props) {
        if (src && src.type) {
            this.originalEvent = src;
            this.type = src.type;
            this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false || src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse
        } else {
            this.type = src
        }
        if (props) {
            _V_.merge(this, props)
        }
        this.timeStamp = (new Date).getTime();
        this[_V_.expando] = true
    };
    _V_.Event.prototype = {preventDefault: function() {
            this.isDefaultPrevented = returnTrue;
            var e = this.originalEvent;
            if (!e) {
                return
            }
            if (e.preventDefault) {
                e.preventDefault()
            } else {
                e.returnValue = false
            }
        },stopPropagation: function() {
            this.isPropagationStopped = returnTrue;
            var e = this.originalEvent;
            if (!e) {
                return
            }
            if (e.stopPropagation) {
                e.stopPropagation()
            }
            e.cancelBubble = true
        },stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = returnTrue;
            this.stopPropagation()
        },isDefaultPrevented: returnFalse,isPropagationStopped: returnFalse,isImmediatePropagationStopped: returnFalse};
    _V_.Event.props = "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" ");
    function returnTrue() {
        return true
    }
    function returnFalse() {
        return false
    }
    var JSON;
    if (!JSON) {
        JSON = {}
    }
    (function() {
        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        if (typeof JSON.parse !== "function") {
            JSON.parse = function(text, reviver) {
                var j;
                function walk(holder, key) {
                    var k, v, value = holder[key];
                    if (value && typeof value === "object") {
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v
                                } else {
                                    delete value[k]
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value)
                }
                text = String(text);
                cx.lastIndex = 0;
                if (cx.test(text)) {
                    text = text.replace(cx, function(a) {
                        return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                    })
                }
                if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                    j = eval("(" + text + ")");
                    return typeof reviver === "function" ? walk({"": j}, "") : j
                }
                throw new SyntaxError("JSON.parse")
            }
        }
    }());
    _V_.Player = _V_.Component.extend({init: function(tag, addOptions, ready) {
            this.tag = tag;
            var el = this.el = _V_.createElement("div"), options = this.options = {}, width = options.width = tag.getAttribute("width"), height = options.height = tag.getAttribute("height"), initWidth = width || 300, initHeight = height || 150;
            tag.player = el.player = this;
            this.ready(ready);
            tag.parentNode.insertBefore(el, tag);
            el.appendChild(tag);
            el.id = this.id = tag.id;
            el.className = tag.className;
            tag.id += "_html5_api";
            tag.className = "vjs-tech";
            _V_.players[el.id] = this;
            el.setAttribute("width", initWidth);
            el.setAttribute("height", initHeight);
            el.style.width = initWidth + "px";
            el.style.height = initHeight + "px";
            tag.removeAttribute("width");
            tag.removeAttribute("height");
            _V_.merge(options, _V_.options);
            _V_.merge(options, this.getVideoTagSettings());
            _V_.merge(options, addOptions);
            tag.removeAttribute("controls");
            tag.removeAttribute("poster");
            if (tag.hasChildNodes()) {
                for (var i = 0, j = tag.childNodes; i < j.length; i++) {
                    if (j[i].nodeName == "SOURCE" || j[i].nodeName == "TRACK") {
                        tag.removeChild(j[i])
                    }
                }
            }
            this.values = {};
            this.addClass("vjs-paused");
            this.addEvent("ended", this.onEnded);
            this.addEvent("play", this.onPlay);
            this.addEvent("pause", this.onPause);
            this.addEvent("progress", this.onProgress);
            this.addEvent("error", this.onError);
            if (options.controls) {
                this.ready(function() {
                    this.initComponents()
                })
            }
            this.textTracks = [];
            if (options.tracks && options.tracks.length > 0) {
                this.addTextTracks(options.tracks)
            }
            if (!options.sources || options.sources.length == 0) {
                for (var i = 0, j = options.techOrder; i < j.length; i++) {
                    var techName = j[i], tech = _V_[techName];
                    if (tech.isSupported()) {
                        this.loadTech(techName);
                        break
                    }
                }
            } else {
                this.src(options.sources)
            }
        },values: {},destroy: function() {
            this.stopTrackingProgress();
            this.stopTrackingCurrentTime();
            _V_.players[this.id] = null;
            delete _V_.players[this.id];
            this.tech.destroy();
            this.el.parentNode.removeChild(this.el)
        },createElement: function(type, options) {
        },getVideoTagSettings: function() {
            var options = {sources: [],tracks: []};
            options.src = this.tag.getAttribute("src");
            options.controls = this.tag.getAttribute("controls") !== null;
            options.poster = this.tag.getAttribute("poster");
            options.preload = this.tag.getAttribute("preload");
            options.autoplay = this.tag.getAttribute("autoplay") !== null;
            options.loop = this.tag.getAttribute("loop") !== null;
            options.muted = this.tag.getAttribute("muted") !== null;
            if (this.tag.hasChildNodes()) {
                for (var c, i = 0, j = this.tag.childNodes; i < j.length; i++) {
                    c = j[i];
                    if (c.nodeName == "SOURCE") {
                        options.sources.push({src: c.getAttribute("src"),type: c.getAttribute("type"),media: c.getAttribute("media"),title: c.getAttribute("title")})
                    }
                    if (c.nodeName == "TRACK") {
                        options.tracks.push({src: c.getAttribute("src"),kind: c.getAttribute("kind"),srclang: c.getAttribute("srclang"),label: c.getAttribute("label"),"default": c.getAttribute("default") !== null,title: c.getAttribute("title")})
                    }
                }
            }
            return options
        },loadTech: function(techName, source) {
          debugger
            if (this.tech) {
                this.unloadTech()
            } else {
                if (techName != "html5" && this.tag) {
                    this.el.removeChild(this.tag);
                    this.tag = false
                }
            }
            this.techName = techName;
            this.isReady = false;
            var techReady = function() {
                this.player.triggerReady();
                if (!this.support.progressEvent) {
                    this.player.manualProgressOn()
                }
                if (!this.support.timeupdateEvent) {
                    this.player.manualTimeUpdatesOn()
                }
            };
            var techOptions = _V_.merge({source: source,parentEl: this.el}, this.options[techName]);
            if (source) {
                if (source.src == this.values.src && this.values.currentTime > 0) {
                    techOptions.startTime = this.values.currentTime
                }
                this.values.src = source.src
            }
            this.tech = new _V_[techName](this, techOptions);
            this.tech.ready(techReady)
        },unloadTech: function() {
            this.tech.destroy();
            if (this.manualProgress) {
                this.manualProgressOff()
            }
            if (this.manualTimeUpdates) {
                this.manualTimeUpdatesOff()
            }
            this.tech = false
        },manualProgressOn: function() {
            this.manualProgress = true;
            this.trackProgress();
            this.tech.addEvent("progress", function() {
                this.removeEvent("progress", arguments.callee);
                this.support.progressEvent = true;
                this.player.manualProgressOff()
            })
        },manualProgressOff: function() {
            this.manualProgress = false;
            this.stopTrackingProgress()
        },trackProgress: function() {
            this.progressInterval = setInterval(_V_.proxy(this, function() {
                if (this.values.bufferEnd < this.buffered().end(0)) {
                    this.triggerEvent("progress")
                } else {
                    if (this.bufferedPercent() == 1) {
                        this.stopTrackingProgress();
                        this.triggerEvent("progress")
                    }
                }
            }), 500)
        },stopTrackingProgress: function() {
            clearInterval(this.progressInterval)
        },manualTimeUpdatesOn: function() {
            this.manualTimeUpdates = true;
            this.addEvent("play", this.trackCurrentTime);
            this.addEvent("pause", this.stopTrackingCurrentTime);
            this.tech.addEvent("timeupdate", function() {
                this.removeEvent("timeupdate", arguments.callee);
                this.support.timeupdateEvent = true;
                this.player.manualTimeUpdatesOff()
            })
        },manualTimeUpdatesOff: function() {
            this.manualTimeUpdates = false;
            this.stopTrackingCurrentTime();
            this.removeEvent("play", this.trackCurrentTime);
            this.removeEvent("pause", this.stopTrackingCurrentTime)
        },trackCurrentTime: function() {
            if (this.currentTimeInterval) {
                this.stopTrackingCurrentTime()
            }
            this.currentTimeInterval = setInterval(_V_.proxy(this, function() {
                this.triggerEvent("timeupdate")
            }), 250)
        },stopTrackingCurrentTime: function() {
            clearInterval(this.currentTimeInterval)
        },onEnded: function() {
            if (this.options.loop) {
                this.currentTime(0);
                this.play()
            } else {
                this.pause();
                this.currentTime(0);
                this.pause()
            }
        },onPlay: function() {
            _V_.removeClass(this.el, "vjs-paused");
            _V_.addClass(this.el, "vjs-playing")
        },onPause: function() {
            _V_.removeClass(this.el, "vjs-playing");
            _V_.addClass(this.el, "vjs-paused")
        },onProgress: function() {
            if (this.bufferedPercent() == 1) {
                this.triggerEvent("loadedalldata")
            }
        },onError: function(e) {
            _V_.log("Video Error", e)
        },techCall: function(method, arg) {
            if (!this.tech.isReady) {
                this.tech.ready(function() {
                    this[method](arg)
                })
            } else {
                try {
                    this.tech[method](arg)
                } catch (e) {
                    _V_.log(e)
                }
            }
        },techGet: function(method) {
            if (this.tech.isReady) {
                try {
                    return this.tech[method]()
                } catch (e) {
                    if (this.tech[method] === undefined) {
                        _V_.log("Video.js: " + method + " method not defined for " + this.techName + " playback technology.", e)
                    } else {
                        if (e.name == "TypeError") {
                            _V_.log("Video.js: " + method + " unavailable on " + this.techName + " playback technology element.", e);
                            this.tech.isReady = false
                        } else {
                            _V_.log(e)
                        }
                    }
                }
            }
            return
        },play: function() {
            this.techCall("play");
            return this
        },pause: function() {
            this.techCall("pause");
            return this
        },paused: function() {
            return (this.techGet("paused") === false) ? false : true
        },currentTime: function(seconds) {
            if (seconds !== undefined) {
                this.values.lastSetCurrentTime = seconds;
                this.techCall("setCurrentTime", seconds);
                if (this.manualTimeUpdates) {
                    this.triggerEvent("timeupdate")
                }
                return this
            }
            return this.values.currentTime = (this.techGet("currentTime") || 0)
        },duration: function() {
            return parseFloat(this.techGet("duration"))
        },remainingTime: function() {
            return this.duration() - this.currentTime()
        },buffered: function() {
            var buffered = this.techGet("buffered"), start = 0, end = this.values.bufferEnd = this.values.bufferEnd || 0, timeRange;
            if (buffered && buffered.length > 0 && buffered.end(0) !== end) {
                end = buffered.end(0);
                this.values.bufferEnd = end
            }
            return _V_.createTimeRange(start, end)
        },bufferedPercent: function() {
            return (this.duration()) ? this.buffered().end(0) / this.duration() : 0
        },volume: function(percentAsDecimal) {
            var vol;
            if (percentAsDecimal !== undefined) {
                vol = Math.max(0, Math.min(1, parseFloat(percentAsDecimal)));
                this.values.volume = vol;
                this.techCall("setVolume", vol);
                _V_.setLocalStorage("volume", vol);
                return this
            }
            vol = parseFloat(this.techGet("volume"));
            return (isNaN(vol)) ? 1 : vol
        },muted: function(muted) {
            if (muted !== undefined) {
                this.techCall("setMuted", muted);
                return this
            }
            return this.techGet("muted") || false
        },width: function(width, skipListeners) {
            if (width !== undefined) {
                this.el.width = width;
                this.el.style.width = width + "px";
                if (!skipListeners) {
                    this.triggerEvent("resize")
                }
                return this
            }
            return parseInt(this.el.getAttribute("width"))
        },height: function(height) {
            if (height !== undefined) {
                this.el.height = height;
                this.el.style.height = height + "px";
                this.triggerEvent("resize");
                return this
            }
            return parseInt(this.el.getAttribute("height"))
        },size: function(width, height) {
            return this.width(width, true).height(height)
        },supportsFullScreen: function() {
            return this.techGet("supportsFullScreen") || false
        },requestFullScreen: function() {
            var requestFullScreen = _V_.support.requestFullScreen;
            this.isFullScreen = true;
            if (requestFullScreen) {
                _V_.addEvent(document, requestFullScreen.eventName, this.proxy(function() {
                    this.isFullScreen = document[requestFullScreen.isFullScreen];
                    if (this.isFullScreen == false) {
                        _V_.removeEvent(document, requestFullScreen.eventName, arguments.callee)
                    }
                    this.triggerEvent("fullscreenchange")
                }));
                if (this.tech.support.fullscreenResize === false && this.options.flash.iFrameMode != true) {
                    this.pause();
                    this.unloadTech();
                    _V_.addEvent(document, requestFullScreen.eventName, this.proxy(function() {
                        _V_.removeEvent(document, requestFullScreen.eventName, arguments.callee);
                        this.loadTech(this.techName, {src: this.values.src})
                    }));
                    this.el[requestFullScreen.requestFn]()
                } else {
                    this.el[requestFullScreen.requestFn]()
                }
            } else {
                if (this.tech.supportsFullScreen()) {
                    this.triggerEvent("fullscreenchange");
                    this.techCall("enterFullScreen")
                } else {
                    this.triggerEvent("fullscreenchange");
                    this.enterFullWindow()
                }
            }
            return this
        },cancelFullScreen: function() {
            var requestFullScreen = _V_.support.requestFullScreen;
            this.isFullScreen = false;
            if (requestFullScreen) {
                if (this.tech.support.fullscreenResize === false && this.options.flash.iFrameMode != true) {
                    this.pause();
                    this.unloadTech();
                    _V_.addEvent(document, requestFullScreen.eventName, this.proxy(function() {
                        _V_.removeEvent(document, requestFullScreen.eventName, arguments.callee);
                        this.loadTech(this.techName, {src: this.values.src})
                    }));
                    document[requestFullScreen.cancelFn]()
                } else {
                    document[requestFullScreen.cancelFn]()
                }
            } else {
                if (this.tech.supportsFullScreen()) {
                    this.techCall("exitFullScreen");
                    this.triggerEvent("fullscreenchange")
                } else {
                    this.exitFullWindow();
                    this.triggerEvent("fullscreenchange")
                }
            }
            return this
        },enterFullWindow: function() {
            this.isFullWindow = true;
            this.docOrigOverflow = document.documentElement.style.overflow;
            _V_.addEvent(document, "keydown", _V_.proxy(this, this.fullWindowOnEscKey));
            document.documentElement.style.overflow = "hidden";
            _V_.addClass(document.body, "vjs-full-window");
            _V_.addClass(this.el, "vjs-fullscreen");
            this.triggerEvent("enterFullWindow")
        },fullWindowOnEscKey: function(event) {
            if (event.keyCode == 27) {
                if (this.isFullScreen == true) {
                    this.cancelFullScreen()
                } else {
                    this.exitFullWindow()
                }
            }
        },exitFullWindow: function() {
            this.isFullWindow = false;
            _V_.removeEvent(document, "keydown", this.fullWindowOnEscKey);
            document.documentElement.style.overflow = this.docOrigOverflow;
            _V_.removeClass(document.body, "vjs-full-window");
            _V_.removeClass(this.el, "vjs-fullscreen");
            this.triggerEvent("exitFullWindow")
        },selectSource: function(sources) {
            for (var i = 0, j = this.options.techOrder; i < j.length; i++) {
                var techName = j[i], tech = _V_[techName];
                if (tech.isSupported()) {
                    for (var a = 0, b = sources; a < b.length; a++) {
                        var source = b[a];
                        if (tech.canPlaySource.call(this, source)) {
                            return {source: source,tech: techName}
                        }
                    }
                }
            }
            return false
        },src: function(source) {
            if (source instanceof Array) {
                var sourceTech = this.selectSource(source), source, techName;
                if (sourceTech) {
                    source = sourceTech.source;
                    techName = sourceTech.tech;
                    if (techName == this.techName) {
                        this.src(source)
                    } else {
                        this.loadTech(techName, source)
                    }
                } else {
                    _V_.log("No compatible source and playback technology were found.")
                }
            } else {
                if (source instanceof Object) {
                    if (_V_[this.techName].canPlaySource(source)) {
                        this.src(source.src)
                    } else {
                        this.src([source])
                    }
                } else {
                    this.values.src = source;
                    if (!this.isReady) {
                        this.ready(function() {
                            this.src(source)
                        })
                    } else {
                        this.techCall("src", source);
                        if (this.options.preload == "auto") {
                            this.load()
                        }
                        if (this.options.autoplay) {
                            this.play()
                        }
                    }
                }
            }
            return this
        },load: function() {
            this.techCall("load");
            return this
        },currentSrc: function() {
            return this.techGet("currentSrc") || this.values.src || ""
        },preload: function(value) {
            if (value !== undefined) {
                this.techCall("setPreload", value);
                this.options.preload = value;
                return this
            }
            return this.techGet("preload")
        },autoplay: function(value) {
            if (value !== undefined) {
                this.techCall("setAutoplay", value);
                this.options.autoplay = value;
                return this
            }
            return this.techGet("autoplay", value)
        },loop: function(value) {
            if (value !== undefined) {
                this.techCall("setLoop", value);
                this.options.loop = value;
                return this
            }
            return this.techGet("loop")
        },controls: function() {
            return this.options.controls
        },poster: function() {
            return this.techGet("poster")
        },error: function() {
            return this.techGet("error")
        },ended: function() {
            return this.techGet("ended")
        }});
    (function() {
        var requestFn, cancelFn, eventName, isFullScreen, playerProto = _V_.Player.prototype;
        if (document.cancelFullscreen !== undefined) {
            requestFn = "requestFullscreen";
            cancelFn = "exitFullscreen";
            eventName = "fullscreenchange";
            isFullScreen = "fullScreen"
        } else {
            _V_.each(["moz", "webkit"], function(prefix) {
                if ((prefix != "moz" || document.mozFullScreenEnabled) && document[prefix + "CancelFullScreen"] !== undefined) {
                    requestFn = prefix + "RequestFullScreen";
                    cancelFn = prefix + "CancelFullScreen";
                    eventName = prefix + "fullscreenchange";
                    if (prefix == "webkit") {
                        isFullScreen = prefix + "IsFullScreen"
                    } else {
                        isFullScreen = prefix + "FullScreen"
                    }
                }
            })
        }
        if (requestFn) {
            _V_.support.requestFullScreen = {requestFn: requestFn,cancelFn: cancelFn,eventName: eventName,isFullScreen: isFullScreen}
        }
    })();
    _V_.PlaybackTech = _V_.Component.extend({init: function(player, options) {
        },onClick: function() {
            if (this.player.options.controls) {
                _V_.PlayToggle.prototype.onClick.call(this)
            }
        }});
    _V_.apiMethods = "play,pause,paused,currentTime,setCurrentTime,duration,buffered,volume,setVolume,muted,setMuted,width,height,supportsFullScreen,enterFullScreen,src,load,currentSrc,preload,setPreload,autoplay,setAutoplay,loop,setLoop,error,networkState,readyState,seeking,initialTime,startOffsetTime,played,seekable,ended,videoTracks,audioTracks,videoWidth,videoHeight,textTracks,defaultPlaybackRate,playbackRate,mediaGroup,controller,controls,defaultMuted".split(",");
    _V_.each(_V_.apiMethods, function(methodName) {
        _V_.PlaybackTech.prototype[methodName] = function() {
            throw new Error("The '" + methodName + "' method is not available on the playback technology's API")
        }
    });
    _V_.html5 = _V_.PlaybackTech.extend({init: function(player, options, ready) {
            this.player = player;
            this.el = this.createElement();
            this.ready(ready);
            this.addEvent("click", this.proxy(this.onClick));
            var source = options.source;
            if (source && this.el.currentSrc == source.src) {
                player.triggerEvent("loadstart")
            } else {
                if (source) {
                    this.el.src = source.src
                }
            }
            player.ready(function() {
                if (this.options.autoplay && this.paused()) {
                    this.tag.poster = null;
                    this.play()
                }
            });
            this.setupTriggers();
            this.triggerReady()
        },destroy: function() {
            this.player.tag = false;
            this.removeTriggers();
            this.el.parentNode.removeChild(this.el)
        },createElement: function() {
            var html5 = _V_.html5, player = this.player, el = player.tag, newEl;
            if (!el || this.support.movingElementInDOM === false) {
                if (el) {
                    player.el.removeChild(el)
                }
                newEl = _V_.createElement("video", {id: el.id || player.el.id + "_html5_api",className: el.className || "vjs-tech"});
                el = newEl;
                _V_.insertFirst(el, player.el)
            }
            _V_.each(["autoplay", "preload", "loop", "muted"], function(attr) {
                if (player.options[attr] !== null) {
                    el[attr] = player.options[attr]
                }
            }, this);
            return el
        },setupTriggers: function() {
            _V_.each.call(this, _V_.html5.events, function(type) {
                _V_.addEvent(this.el, type, _V_.proxy(this.player, this.eventHandler))
            })
        },removeTriggers: function() {
            _V_.each.call(this, _V_.html5.events, function(type) {
                _V_.removeEvent(this.el, type, _V_.proxy(this.player, this.eventHandler))
            })
        },eventHandler: function(e) {
            e.stopPropagation();
            this.triggerEvent(e)
        },play: function() {
            this.el.play()
        },pause: function() {
            this.el.pause()
        },paused: function() {
            return this.el.paused
        },currentTime: function() {
            return this.el.currentTime
        },setCurrentTime: function(seconds) {
            try {
                this.el.currentTime = seconds
            } catch (e) {
                _V_.log(e, "Video isn't ready. (VideoJS)")
            }
        },duration: function() {
            return this.el.duration || 0
        },buffered: function() {
            return this.el.buffered
        },volume: function() {
            return this.el.volume
        },setVolume: function(percentAsDecimal) {
            this.el.volume = percentAsDecimal
        },muted: function() {
            return this.el.muted
        },setMuted: function(muted) {
            this.el.muted = muted
        },width: function() {
            return this.el.offsetWidth
        },height: function() {
            return this.el.offsetHeight
        },supportsFullScreen: function() {
            if (typeof this.el.webkitEnterFullScreen == "function") {
                if (!navigator.userAgent.match("Chrome") && !navigator.userAgent.match("Mac OS X 10.5")) {
                    return true
                }
            }
            return false
        },enterFullScreen: function() {
            try {
                this.el.webkitEnterFullScreen()
            } catch (e) {
                if (e.code == 11) {
                    _V_.log("VideoJS: Video not ready.")
                }
            }
        },src: function(src) {
            this.el.src = src
        },load: function() {
            this.el.load()
        },currentSrc: function() {
            return this.el.currentSrc
        },preload: function() {
            return this.el.preload
        },setPreload: function(val) {
            this.el.preload = val
        },autoplay: function() {
            return this.el.autoplay
        },setAutoplay: function(val) {
            this.el.autoplay = val
        },loop: function() {
            return this.el.loop
        },setLoop: function(val) {
            this.el.loop = val
        },error: function() {
            return this.el.error
        },seeking: function() {
            return this.el.seeking
        },ended: function() {
            return this.el.ended
        },controls: function() {
            return this.player.options.controls
        },defaultMuted: function() {
            return this.el.defaultMuted
        }});
    _V_.html5.isSupported = function() {
        return !!document.createElement("video").canPlayType
    };
    _V_.html5.canPlaySource = function(srcObj) {
        return !!document.createElement("video").canPlayType(srcObj.type)
    };
    _V_.html5.events = "loadstart,suspend,abort,error,emptied,stalled,loadedmetadata,loadeddata,canplay,canplaythrough,playing,waiting,seeking,seeked,ended,durationchange,timeupdate,progress,play,pause,ratechange,volumechange".split(",");
    _V_.html5.prototype.support = {fullscreen: (typeof _V_.testVid.webkitEnterFullScreen !== undefined) ? (!_V_.ua.match("Chrome") && !_V_.ua.match("Mac OS X 10.5") ? true : false) : false,movingElementInDOM: !_V_.isIOS()};
    if (_V_.isAndroid()) {
        if (_V_.androidVersion() < 3) {
            document.createElement("video").constructor.prototype.canPlayType = function(type) {
                return (type && type.toLowerCase().indexOf("video/mp4") != -1) ? "maybe" : ""
            }
        }
    }
    _V_.flash = _V_.PlaybackTech.extend({init: function(player, options) {
            this.player = player;
            var source = options.source, parentEl = options.parentEl, placeHolder = this.el = _V_.createElement("div", {id: parentEl.id + "_temp_flash"}), objId = player.el.id + "_flash_api", playerOptions = player.options, flashVars = _V_.merge({readyFunction: "_V_.flash.onReady",eventProxyFunction: "_V_.flash.onEvent",errorEventProxyFunction: "_V_.flash.onError",autoplay: playerOptions.autoplay,preload: playerOptions.preload,loop: playerOptions.loop,muted: playerOptions.muted}, options.flashVars), params = _V_.merge({wmode: "opaque",bgcolor: "#000000"}, options.params), attributes = _V_.merge({id: objId,name: objId,"class": "vjs-tech"}, options.attributes);
            if (source) {
                flashVars.src = encodeURIComponent(_V_.getAbsoluteURL(source.src))
            }
            _V_.insertFirst(placeHolder, parentEl);
            if (options.startTime) {
                this.ready(function() {
                    this.load();
                    this.play();
                    this.currentTime(options.startTime)
                })
            }
            if (options.iFrameMode == true && !_V_.isFF) {
                var iFrm = _V_.createElement("iframe", {id: objId + "_iframe",name: objId + "_iframe",className: "vjs-tech",scrolling: "no",marginWidth: 0,marginHeight: 0,frameBorder: 0});
                flashVars.readyFunction = "ready";
                flashVars.eventProxyFunction = "events";
                flashVars.errorEventProxyFunction = "errors";
                _V_.addEvent(iFrm, "load", _V_.proxy(this, function() {
                    var iDoc, objTag, swfLoc, iWin = iFrm.contentWindow, varString = "";
                    iDoc = iFrm.contentDocument ? iFrm.contentDocument : iFrm.contentWindow.document;
                    iDoc.write(_V_.flash.getEmbedCode(options.swf, flashVars, params, attributes));
                    iWin.player = this.player;
                    iWin.ready = _V_.proxy(this.player, function(currSwf) {
                        var el = iDoc.getElementById(currSwf), player = this, tech = player.tech;
                        tech.el = el;
                        _V_.addEvent(el, "click", tech.proxy(tech.onClick));
                        _V_.flash.checkReady(tech)
                    });
                    iWin.events = _V_.proxy(this.player, function(swfID, eventName, other) {
                        var player = this;
                        if (player && player.techName == "flash") {
                            player.triggerEvent(eventName)
                        }
                    });
                    iWin.errors = _V_.proxy(this.player, function(swfID, eventName) {
                        _V_.log("Flash Error", eventName)
                    })
                }));
                placeHolder.parentNode.replaceChild(iFrm, placeHolder)
            } else {
                _V_.flash.embed(options.swf, placeHolder, flashVars, params, attributes)
            }
        },destroy: function() {
            this.el.parentNode.removeChild(this.el)
        },play: function() {
            this.el.vjs_play()
        },pause: function() {
            this.el.vjs_pause()
        },src: function(src) {
            src = _V_.getAbsoluteURL(src);
            this.el.vjs_src(src);
            if (this.player.autoplay()) {
                var tech = this;
                setTimeout(function() {
                    tech.play()
                }, 0)
            }
        },load: function() {
            this.el.vjs_load()
        },poster: function() {
            this.el.vjs_getProperty("poster")
        },buffered: function() {
            return _V_.createTimeRange(0, this.el.vjs_getProperty("buffered"))
        },supportsFullScreen: function() {
            return false
        },enterFullScreen: function() {
            return false
        }});
    (function() {
        var api = _V_.flash.prototype, readWrite = "preload,currentTime,defaultPlaybackRate,playbackRate,autoplay,loop,mediaGroup,controller,controls,volume,muted,defaultMuted".split(","), readOnly = "error,currentSrc,networkState,readyState,seeking,initialTime,duration,startOffsetTime,paused,played,seekable,ended,videoTracks,audioTracks,videoWidth,videoHeight,textTracks".split(","), callOnly = "load,play,pause".split(",");
        createSetter = function(attr) {
            var attrUpper = attr.charAt(0).toUpperCase() + attr.slice(1);
            api["set" + attrUpper] = function(val) {
                return this.el.vjs_setProperty(attr, val)
            }
        }, createGetter = function(attr) {
            api[attr] = function() {
                return this.el.vjs_getProperty(attr)
            }
        };
        _V_.each(readWrite, function(attr) {
            createGetter(attr);
            createSetter(attr)
        });
        _V_.each(readOnly, function(attr) {
            createGetter(attr)
        })
    })();
    _V_.flash.isSupported = function() {
        return _V_.flash.version()[0] >= 10
    };
    _V_.flash.canPlaySource = function(srcObj) {
        if (srcObj.type in _V_.flash.prototype.support.formats) {
            return "maybe"
        }
    };
    _V_.flash.prototype.support = {formats: {"video/flv": "FLV","video/x-flv": "FLV","video/mp4": "MP4","video/m4v": "MP4"},progressEvent: false,timeupdateEvent: false,fullscreenResize: false,parentResize: !(_V_.ua.match("Firefox"))};
    _V_.flash.onReady = function(currSwf) {
        var el = _V_.el(currSwf);
        var player = el.player || el.parentNode.player, tech = player.tech;
        el.player = player;
        tech.el = el;
        tech.addEvent("click", tech.onClick);
        _V_.flash.checkReady(tech)
    };
    _V_.flash.checkReady = function(tech) {
        if (tech.el.vjs_getProperty) {
            tech.triggerReady()
        } else {
            setTimeout(function() {
                _V_.flash.checkReady(tech)
            }, 50)
        }
    };
    _V_.flash.onEvent = function(swfID, eventName) {
        var player = _V_.el(swfID).player;
        player.triggerEvent(eventName)
    };
    _V_.flash.onError = function(swfID, err) {
        var player = _V_.el(swfID).player;
        player.triggerEvent("error");
        _V_.log("Flash Error", err, swfID)
    };
    _V_.flash.version = function() {
        var version = "0,0,0";
        try {
            version = new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version").replace(/\D+/g, ",").match(/^,?(.+),?$/)[1]
        } catch (e) {
            try {
                if (navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin) {
                    version = (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1]
                }
            } catch (e) {
            }
        }
        return version.split(",")
    };
    _V_.flash.embed = function(swf, placeHolder, flashVars, params, attributes) {
        var code = _V_.flash.getEmbedCode(swf, flashVars, params, attributes), obj = _V_.createElement("div", {innerHTML: code}).childNodes[0], par = placeHolder.parentNode;
        placeHolder.parentNode.replaceChild(obj, placeHolder);
        if (_V_.isIE()) {
            var newObj = par.childNodes[0];
            setTimeout(function() {
                newObj.style.display = "block"
            }, 1000)
        }
        return obj
    };
    _V_.flash.getEmbedCode = function(swf, flashVars, params, attributes) {
        var objTag = '<object type="application/x-shockwave-flash"', flashVarsString = "", paramsString = "";
        attrsString = "";
        if (flashVars) {
            _V_.eachProp(flashVars, function(key, val) {
                flashVarsString += (key + "=" + val + "&amp;")
            })
        }
        params = _V_.merge({movie: swf,flashvars: flashVarsString,allowScriptAccess: "always",allowNetworking: "all"}, params);
        _V_.eachProp(params, function(key, val) {
            paramsString += '<param name="' + key + '" value="' + val + '" />'
        });
        attributes = _V_.merge({data: swf,width: "100%",height: "100%"}, attributes);
        _V_.eachProp(attributes, function(key, val) {
            attrsString += (key + '="' + val + '" ')
        });
        return objTag + attrsString + ">" + paramsString + "</object>"
    };
    _V_.merge(_V_.Player.prototype, {addTextTracks: function(trackObjects) {
            var tracks = this.textTracks = (this.textTracks) ? this.textTracks : [], i = 0, j = trackObjects.length, track, Kind;
            for (; i < j; i++) {
                Kind = _V_.uc(trackObjects[i].kind || "subtitles");
                track = new _V_[Kind + "Track"](this, trackObjects[i]);
                tracks.push(track);
                if (track["default"]) {
                    this.ready(_V_.proxy(track, track.show))
                }
            }
            return this
        },showTextTrack: function(id, disableSameKind) {
            var tracks = this.textTracks, i = 0, j = tracks.length, track, showTrack, kind;
            for (; i < j; i++) {
                track = tracks[i];
                if (track.id === id) {
                    track.show();
                    showTrack = track
                } else {
                    if (disableSameKind && track.kind == disableSameKind && track.mode > 0) {
                        track.disable()
                    }
                }
            }
            kind = (showTrack) ? showTrack.kind : ((disableSameKind) ? disableSameKind : false);
            if (kind) {
                this.triggerEvent(kind + "trackchange")
            }
            return this
        }});
    _V_.Track = _V_.Component.extend({init: function(player, options) {
            this._super(player, options);
            _V_.merge(this, {id: options.id || ("vjs_" + options.kind + "_" + options.language + "_" + _V_.guid++),src: options.src,"default": options["default"],title: options.title,language: options.srclang,label: options.label,cues: [],activeCues: [],readyState: 0,mode: 0})
        },createElement: function() {
            return this._super("div", {className: "vjs-" + this.kind + " vjs-text-track"})
        },show: function() {
            this.activate();
            this.mode = 2;
            this._super()
        },hide: function() {
            this.activate();
            this.mode = 1;
            this._super()
        },disable: function() {
            if (this.mode == 2) {
                this.hide()
            }
            this.deactivate();
            this.mode = 0
        },activate: function() {
            if (this.readyState == 0) {
                this.load()
            }
            if (this.mode == 0) {
                this.player.addEvent("timeupdate", this.proxy(this.update, this.id));
                this.player.addEvent("ended", this.proxy(this.reset, this.id));
                if (this.kind == "captions" || this.kind == "subtitles") {
                    this.player.textTrackDisplay.addComponent(this)
                }
            }
        },deactivate: function() {
            this.player.removeEvent("timeupdate", this.proxy(this.update, this.id));
            this.player.removeEvent("ended", this.proxy(this.reset, this.id));
            this.reset();
            this.player.textTrackDisplay.removeComponent(this)
        },load: function() {
            if (this.readyState == 0) {
                this.readyState = 1;
                _V_.get(this.src, this.proxy(this.parseCues), this.proxy(this.onError))
            }
        },onError: function(err) {
            this.error = err;
            this.readyState = 3;
            this.triggerEvent("error")
        },parseCues: function(srcContent) {
            var cue, time, text, lines = srcContent.split("\n"), line = "", id;
            for (var i = 1, j = lines.length; i < j; i++) {
                line = _V_.trim(lines[i]);
                if (line) {
                    if (line.indexOf("-->") == -1) {
                        id = line;
                        line = _V_.trim(lines[++i])
                    } else {
                        id = this.cues.length
                    }
                    cue = {id: id,index: this.cues.length};
                    time = line.split(" --> ");
                    cue.startTime = this.parseCueTime(time[0]);
                    cue.endTime = this.parseCueTime(time[1]);
                    text = [];
                    while (lines[++i] && (line = _V_.trim(lines[i]))) {
                        text.push(line)
                    }
                    cue.text = text.join("<br/>");
                    this.cues.push(cue)
                }
            }
            this.readyState = 2;
            this.triggerEvent("loaded")
        },parseCueTime: function(timeText) {
            var parts = timeText.split(":"), time = 0, hours, minutes, other, seconds, ms, flags;
            if (parts.length == 3) {
                hours = parts[0];
                minutes = parts[1];
                other = parts[2]
            } else {
                hours = 0;
                minutes = parts[0];
                other = parts[1]
            }
            other = other.split(/\s+/);
            seconds = other.splice(0, 1)[0];
            seconds = seconds.split(/\.|,/);
            ms = parseFloat(seconds[1]);
            seconds = seconds[0];
            time += parseFloat(hours) * 3600;
            time += parseFloat(minutes) * 60;
            time += parseFloat(seconds);
            if (ms) {
                time += ms / 1000
            }
            return time
        },update: function() {
            if (this.cues.length > 0) {
                var time = this.player.currentTime();
                if (this.prevChange === undefined || time < this.prevChange || this.nextChange <= time) {
                    var cues = this.cues, newNextChange = this.player.duration(), newPrevChange = 0, reverse = false, newCues = [], firstActiveIndex, lastActiveIndex, html = "", cue, i, j;
                    if (time >= this.nextChange || this.nextChange === undefined) {
                        i = (this.firstActiveIndex !== undefined) ? this.firstActiveIndex : 0
                    } else {
                        reverse = true;
                        i = (this.lastActiveIndex !== undefined) ? this.lastActiveIndex : cues.length - 1
                    }
                    while (true) {
                        cue = cues[i];
                        if (cue.endTime <= time) {
                            newPrevChange = Math.max(newPrevChange, cue.endTime);
                            if (cue.active) {
                                cue.active = false
                            }
                        } else {
                            if (time < cue.startTime) {
                                newNextChange = Math.min(newNextChange, cue.startTime);
                                if (cue.active) {
                                    cue.active = false
                                }
                                if (!reverse) {
                                    break
                                }
                            } else {
                                if (reverse) {
                                    newCues.splice(0, 0, cue);
                                    if (lastActiveIndex === undefined) {
                                        lastActiveIndex = i
                                    }
                                    firstActiveIndex = i
                                } else {
                                    newCues.push(cue);
                                    if (firstActiveIndex === undefined) {
                                        firstActiveIndex = i
                                    }
                                    lastActiveIndex = i
                                }
                                newNextChange = Math.min(newNextChange, cue.endTime);
                                newPrevChange = Math.max(newPrevChange, cue.startTime);
                                cue.active = true
                            }
                        }
                        if (reverse) {
                            if (i === 0) {
                                break
                            } else {
                                i--
                            }
                        } else {
                            if (i === cues.length - 1) {
                                break
                            } else {
                                i++
                            }
                        }
                    }
                    this.activeCues = newCues;
                    this.nextChange = newNextChange;
                    this.prevChange = newPrevChange;
                    this.firstActiveIndex = firstActiveIndex;
                    this.lastActiveIndex = lastActiveIndex;
                    this.updateDisplay();
                    this.triggerEvent("cuechange")
                }
            }
        },updateDisplay: function() {
            var cues = this.activeCues, html = "", i = 0, j = cues.length;
            for (; i < j; i++) {
                html += "<span class='vjs-tt-cue'>" + cues[i].text + "</span>"
            }
            this.el.innerHTML = html
        },reset: function() {
            this.nextChange = 0;
            this.prevChange = this.player.duration();
            this.firstActiveIndex = 0;
            this.lastActiveIndex = 0
        }});
    _V_.CaptionsTrack = _V_.Track.extend({kind: "captions"});
    _V_.SubtitlesTrack = _V_.Track.extend({kind: "subtitles"});
    _V_.ChaptersTrack = _V_.Track.extend({kind: "chapters"});
    _V_.TextTrackDisplay = _V_.Component.extend({createElement: function() {
            return this._super("div", {className: "vjs-text-track-display"})
        }});
    _V_.TextTrackMenuItem = _V_.MenuItem.extend({init: function(player, options) {
            var track = this.track = options.track;
            options.label = track.label;
            options.selected = track["default"];
            this._super(player, options);
            this.player.addEvent(track.kind + "trackchange", _V_.proxy(this, this.update))
        },onClick: function() {
            this._super();
            this.player.showTextTrack(this.track.id, this.track.kind)
        },update: function() {
            if (this.track.mode == 2) {
                this.selected(true)
            } else {
                this.selected(false)
            }
        }});
    _V_.OffTextTrackMenuItem = _V_.TextTrackMenuItem.extend({init: function(player, options) {
            options.track = {kind: options.kind,player: player,label: "Off"};
            this._super(player, options)
        },onClick: function() {
            this._super();
            this.player.showTextTrack(this.track.id, this.track.kind)
        },update: function() {
            var tracks = this.player.textTracks, i = 0, j = tracks.length, track, off = true;
            for (; i < j; i++) {
                track = tracks[i];
                if (track.kind == this.track.kind && track.mode == 2) {
                    off = false
                }
            }
            if (off) {
                this.selected(true)
            } else {
                this.selected(false)
            }
        }});
    _V_.TextTrackButton = _V_.Button.extend({init: function(player, options) {
            this._super(player, options);
            this.menu = this.createMenu();
            if (this.items.length === 0) {
                this.hide()
            }
        },createMenu: function() {
            var menu = new _V_.Menu(this.player);
            menu.el.appendChild(_V_.createElement("li", {className: "vjs-menu-title",innerHTML: _V_.uc(this.kind)}));
            menu.addItem(new _V_.OffTextTrackMenuItem(this.player, {kind: this.kind}));
            this.items = this.createItems();
            this.each(this.items, function(item) {
                menu.addItem(item)
            });
            this.addComponent(menu);
            return menu
        },createItems: function() {
            var items = [];
            this.each(this.player.textTracks, function(track) {
                if (track.kind === this.kind) {
                    items.push(new _V_.TextTrackMenuItem(this.player, {track: track}))
                }
            });
            return items
        },buildCSSClass: function() {
            return this.className + " vjs-menu-button " + this._super()
        },onFocus: function() {
            this.menu.lockShowing();
            _V_.one(this.menu.el.childNodes[this.menu.el.childNodes.length - 1], "blur", this.proxy(function() {
                this.menu.unlockShowing()
            }))
        },onBlur: function() {
        },onClick: function() {
            this.one("mouseout", this.proxy(function() {
                this.menu.unlockShowing();
                this.el.blur()
            }))
        }});
    _V_.CaptionsButton = _V_.TextTrackButton.extend({kind: "captions",buttonText: "Captions",className: "vjs-captions-button"});
    _V_.SubtitlesButton = _V_.TextTrackButton.extend({kind: "subtitles",buttonText: "Subtitles",className: "vjs-subtitles-button"});
    _V_.ChaptersButton = _V_.TextTrackButton.extend({kind: "chapters",buttonText: "Chapters",className: "vjs-chapters-button",createItems: function(chaptersTrack) {
            var items = [];
            this.each(this.player.textTracks, function(track) {
                if (track.kind === this.kind) {
                    items.push(new _V_.TextTrackMenuItem(this.player, {track: track}))
                }
            });
            return items
        },createMenu: function() {
            var tracks = this.player.textTracks, i = 0, j = tracks.length, track, chaptersTrack, items = this.items = [];
            for (; i < j; i++) {
                track = tracks[i];
                if (track.kind == this.kind && track["default"]) {
                    if (track.readyState < 2) {
                        this.chaptersTrack = track;
                        track.addEvent("loaded", this.proxy(this.createMenu));
                        return
                    } else {
                        chaptersTrack = track;
                        break
                    }
                }
            }
            var menu = this.menu = new _V_.Menu(this.player);
            menu.el.appendChild(_V_.createElement("li", {className: "vjs-menu-title",innerHTML: _V_.uc(this.kind)}));
            if (chaptersTrack) {
                var cues = chaptersTrack.cues, i = 0, j = cues.length, cue, mi;
                for (; i < j; i++) {
                    cue = cues[i];
                    mi = new _V_.ChaptersTrackMenuItem(this.player, {track: chaptersTrack,cue: cue});
                    items.push(mi);
                    menu.addComponent(mi)
                }
            }
            this.addComponent(menu);
            if (this.items.length > 0) {
                this.show()
            }
            return menu
        }});
    _V_.ChaptersTrackMenuItem = _V_.MenuItem.extend({init: function(player, options) {
            var track = this.track = options.track, cue = this.cue = options.cue, currentTime = player.currentTime();
            options.label = cue.text;
            options.selected = (cue.startTime <= currentTime && currentTime < cue.endTime);
            this._super(player, options);
            track.addEvent("cuechange", _V_.proxy(this, this.update))
        },onClick: function() {
            this._super();
            this.player.currentTime(this.cue.startTime);
            this.update(this.cue.startTime)
        },update: function(time) {
            var cue = this.cue, currentTime = this.player.currentTime();
            if (cue.startTime <= currentTime && currentTime < cue.endTime) {
                this.selected(true)
            } else {
                this.selected(false)
            }
        }});
    _V_.merge(_V_.ControlBar.prototype.options.components, {subtitlesButton: {},captionsButton: {},chaptersButton: {}});
    _V_.autoSetup = function() {
        var options, vid, player, vids = document.getElementsByTagName("video");
        if (vids && vids.length > 0) {
            for (var i = 0, j = vids.length; i < j; i++) {
                vid = vids[i];
                if (vid && vid.getAttribute) {
                    if (vid.player === undefined) {
                        options = vid.getAttribute("data-setup");
                        if (options !== null) {
                            options = JSON.parse(options || "{}");
                            player = _V_(vid, options)
                        }
                    }
                } else {
                    _V_.autoSetupTimeout(1);
                    break
                }
            }
        } else {
            if (!_V_.windowLoaded) {
                _V_.autoSetupTimeout(1)
            }
        }
    };
    _V_.autoSetupTimeout = function(wait) {
        setTimeout(_V_.autoSetup, wait)
    };
    _V_.addEvent(window, "load", function() {
        _V_.windowLoaded = true
    });
    _V_.autoSetup();
    window.VideoJS = window._V_ = VideoJS
})(window);
/**! @license
* Bootstrap.js by @fat & @mdo
* plugins: bootstrap-transition.js, bootstrap-modal.js, bootstrap-dropdown.js, bootstrap-scrollspy.js, bootstrap-tab.js, bootstrap-tooltip.js, bootstrap-popover.js, bootstrap-affix.js, bootstrap-alert.js, bootstrap-button.js, bootstrap-collapse.js, bootstrap-carousel.js, bootstrap-typeahead.js
* Copyright 2012 Twitter, Inc.
* http://www.apache.org/licenses/LICENSE-2.0.txt
*/
!function(a) {
    a(function() {
        a.support.transition = function() {
            var a = function() {
                var a = document.createElement("bootstrap"), b = {WebkitTransition: "webkitTransitionEnd",MozTransition: "transitionend",OTransition: "oTransitionEnd otransitionend",transition: "transitionend"}, c;
                for (c in b)
                    if (a.style[c] !== undefined)
                        return b[c]
            }();
            return a && {end: a}
        }()
    })
}(window.jQuery), !function(a) {
    var b = function(b, c) {
        this.options = c, this.$element = a(b).delegate('[data-dismiss="modal"]', "click.dismiss.modal", a.proxy(this.hide, this)), this.options.remote && this.$element.find(".modal-body").load(this.options.remote)
    };
    b.prototype = {constructor: b,toggle: function() {
            return this[this.isShown ? "hide" : "show"]()
        },show: function() {
            var b = this, c = a.Event("show");
            this.$element.trigger(c);
            if (this.isShown || c.isDefaultPrevented())
                return;
            this.isShown = !0, this.escape(), this.backdrop(function() {
                var c = a.support.transition && b.$element.hasClass("fade");
                b.$element.parent().length || b.$element.appendTo(document.body), b.$element.show(), c && b.$element[0].offsetWidth, b.$element.addClass("in").attr("aria-hidden", !1), b.enforceFocus(), c ? b.$element.one(a.support.transition.end, function() {
                    b.$element.focus().trigger("shown")
                }) : b.$element.focus().trigger("shown")
            })
        },hide: function(b) {
            b && b.preventDefault();
            var c = this;
            b = a.Event("hide"), this.$element.trigger(b);
            if (!this.isShown || b.isDefaultPrevented())
                return;
            this.isShown = !1, this.escape(), a(document).off("focusin.modal"), this.$element.removeClass("in").attr("aria-hidden", !0), a.support.transition && this.$element.hasClass("fade") ? this.hideWithTransition() : this.hideModal()
        },enforceFocus: function() {
            var b = this;
            a(document).on("focusin.modal", function(a) {
                b.$element[0] !== a.target && !b.$element.has(a.target).length && b.$element.focus()
            })
        },escape: function() {
            var a = this;
            this.isShown && this.options.keyboard ? this.$element.on("keyup.dismiss.modal", function(b) {
                b.which == 27 && a.hide()
            }) : this.isShown || this.$element.off("keyup.dismiss.modal")
        },hideWithTransition: function() {
            var b = this, c = setTimeout(function() {
                b.$element.off(a.support.transition.end), b.hideModal()
            }, 500);
            this.$element.one(a.support.transition.end, function() {
                clearTimeout(c), b.hideModal()
            })
        },hideModal: function(a) {
            this.$element.hide().trigger("hidden"), this.backdrop()
        },removeBackdrop: function() {
            this.$backdrop.remove(), this.$backdrop = null
        },backdrop: function(b) {
            var c = this, d = this.$element.hasClass("fade") ? "fade" : "";
            if (this.isShown && this.options.backdrop) {
                var e = a.support.transition && d;
                this.$backdrop = a('<div class="modal-backdrop ' + d + '" />').appendTo(document.body), this.$backdrop.click(this.options.backdrop == "static" ? a.proxy(this.$element[0].focus, this.$element[0]) : a.proxy(this.hide, this)), e && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), e ? this.$backdrop.one(a.support.transition.end, b) : b()
            } else
                !this.isShown && this.$backdrop ? (this.$backdrop.removeClass("in"), a.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one(a.support.transition.end, a.proxy(this.removeBackdrop, this)) : this.removeBackdrop()) : b && b()
        }};
    var c = a.fn.modal;
    a.fn.modal = function(c) {
        return this.each(function() {
            var d = a(this), e = d.data("modal"), f = a.extend({}, a.fn.modal.defaults, d.data(), typeof c == "object" && c);
            e || d.data("modal", e = new b(this, f)), typeof c == "string" ? e[c]() : f.show && e.show()
        })
    }, a.fn.modal.defaults = {backdrop: !0,keyboard: !0,show: !0}, a.fn.modal.Constructor = b, a.fn.modal.noConflict = function() {
        return a.fn.modal = c, this
    }, a(document).on("click.modal.data-api", '[data-toggle="modal"]', function(b) {
        var c = a(this), d = c.attr("href"), e = a(c.attr("data-target") || d && d.replace(/.*(?=#[^\s]+$)/, "")), f = e.data("modal") ? "toggle" : a.extend({remote: !/#/.test(d) && d}, e.data(), c.data());
        b.preventDefault(), e.modal(f).one("hide", function() {
            c.focus()
        })
    })
}(window.jQuery), !function(a) {
    function d() {
        a(b).each(function() {
            e(a(this)).removeClass("open")
        })
    }
    function e(b) {
        var c = b.attr("data-target"), d;
        return c || (c = b.attr("href"), c = c && /#/.test(c) && c.replace(/.*(?=#[^\s]*$)/, "")), d = a(c), d.length || (d = b.parent()), d
    }
    var b = "[data-toggle=dropdown]", c = function(b) {
        var c = a(b).on("click.dropdown.data-api", this.toggle);
        a("html").on("click.dropdown.data-api", function() {
            c.parent().removeClass("open")
        })
    };
    c.prototype = {constructor: c,toggle: function(b) {
            var c = a(this), f, g;
            if (c.is(".disabled, :disabled"))
                return;
            return f = e(c), g = f.hasClass("open"), d(), g || f.toggleClass("open"), c.focus(), !1
        },keydown: function(b) {
            var c, d, f, g, h, i;
            if (!/(38|40|27)/.test(b.keyCode))
                return;
            c = a(this), b.preventDefault(), b.stopPropagation();
            if (c.is(".disabled, :disabled"))
                return;
            g = e(c), h = g.hasClass("open");
            if (!h || h && b.keyCode == 27)
                return c.click();
            d = a("[role=menu] li:not(.divider):visible a", g);
            if (!d.length)
                return;
            i = d.index(d.filter(":focus")), b.keyCode == 38 && i > 0 && i--, b.keyCode == 40 && i < d.length - 1 && i++, ~i || (i = 0), d.eq(i).focus()
        }};
    var f = a.fn.dropdown;
    a.fn.dropdown = function(b) {
        return this.each(function() {
            var d = a(this), e = d.data("dropdown");
            e || d.data("dropdown", e = new c(this)), typeof b == "string" && e[b].call(d)
        })
    }, a.fn.dropdown.Constructor = c, a.fn.dropdown.noConflict = function() {
        return a.fn.dropdown = f, this
    }, a(document).on("click.dropdown.data-api touchstart.dropdown.data-api", d).on("click.dropdown touchstart.dropdown.data-api", ".dropdown form", function(a) {
        a.stopPropagation()
    }).on("touchstart.dropdown.data-api", ".dropdown-menu", function(a) {
        a.stopPropagation()
    }).on("click.dropdown.data-api touchstart.dropdown.data-api", b, c.prototype.toggle).on("keydown.dropdown.data-api touchstart.dropdown.data-api", b + ", [role=menu]", c.prototype.keydown)
}(window.jQuery), !function(a) {
    function b(b, c) {
        var d = a.proxy(this.process, this), e = a(b).is("body") ? a(window) : a(b), f;
        this.options = a.extend({}, a.fn.scrollspy.defaults, c), this.$scrollElement = e.on("scroll.scroll-spy.data-api", d), this.selector = (this.options.target || (f = a(b).attr("href")) && f.replace(/.*(?=#[^\s]+$)/, "") || "") + " .nav li > a", this.$body = a("body"), this.refresh(), this.process()
    }
    b.prototype = {constructor: b,refresh: function() {
            var b = this, c;
            this.offsets = a([]), this.targets = a([]), c = this.$body.find(this.selector).map(function() {
                var c = a(this), d = c.data("target") || c.attr("href"), e = /^#\w/.test(d) && a(d);
                return e && e.length && [[e.position().top + b.$scrollElement.scrollTop(), d]] || null
            }).sort(function(a, b) {
                return a[0] - b[0]
            }).each(function() {
                b.offsets.push(this[0]), b.targets.push(this[1])
            })
        },process: function() {
            var a = this.$scrollElement.scrollTop() + this.options.offset, b = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight, c = b - this.$scrollElement.height(), d = this.offsets, e = this.targets, f = this.activeTarget, g;
            if (a >= c)
                return f != (g = e.last()[0]) && this.activate(g);
            for (g = d.length; g--; )
                f != e[g] && a >= d[g] && (!d[g + 1] || a <= d[g + 1]) && this.activate(e[g])
        },activate: function(b) {
            var c, d;
            this.activeTarget = b, a(this.selector).parent(".active").removeClass("active"), d = this.selector + '[data-target="' + b + '"],' + this.selector + '[href="' + b + '"]', c = a(d).parent("li").addClass("active"), c.parent(".dropdown-menu").length && (c = c.closest("li.dropdown").addClass("active")), c.trigger("activate")
        }};
    var c = a.fn.scrollspy;
    a.fn.scrollspy = function(c) {
        return this.each(function() {
            var d = a(this), e = d.data("scrollspy"), f = typeof c == "object" && c;
            e || d.data("scrollspy", e = new b(this, f)), typeof c == "string" && e[c]()
        })
    }, a.fn.scrollspy.Constructor = b, a.fn.scrollspy.defaults = {offset: 10}, a.fn.scrollspy.noConflict = function() {
        return a.fn.scrollspy = c, this
    }, a(window).on("load", function() {
        a('[data-spy="scroll"]').each(function() {
            var b = a(this);
            b.scrollspy(b.data())
        })
    })
}(window.jQuery), !function(a) {
    var b = function(b) {
        this.element = a(b)
    };
    b.prototype = {constructor: b,show: function() {
            var b = this.element, c = b.closest("ul:not(.dropdown-menu)"), d = b.attr("data-target"), e, f, g;
            d || (d = b.attr("href"), d = d && d.replace(/.*(?=#[^\s]*$)/, ""));
            if (b.parent("li").hasClass("active"))
                return;
            e = c.find(".active:last a")[0], g = a.Event("show", {relatedTarget: e}), b.trigger(g);
            if (g.isDefaultPrevented())
                return;
            f = a(d), this.activate(b.parent("li"), c), this.activate(f, f.parent(), function() {
                b.trigger({type: "shown",relatedTarget: e})
            })
        },activate: function(b, c, d) {
            function g() {
                e.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"), b.addClass("active"), f ? (b[0].offsetWidth, b.addClass("in")) : b.removeClass("fade"), b.parent(".dropdown-menu") && b.closest("li.dropdown").addClass("active"), d && d()
            }
            var e = c.find("> .active"), f = d && a.support.transition && e.hasClass("fade");
            f ? e.one(a.support.transition.end, g) : g(), e.removeClass("in")
        }};
    var c = a.fn.tab;
    a.fn.tab = function(c) {
        return this.each(function() {
            var d = a(this), e = d.data("tab");
            e || d.data("tab", e = new b(this)), typeof c == "string" && e[c]()
        })
    }, a.fn.tab.Constructor = b, a.fn.tab.noConflict = function() {
        return a.fn.tab = c, this
    }, a(document).on("click.tab.data-api", '[data-toggle="tab"], [data-toggle="pill"]', function(b) {
        b.preventDefault(), a(this).tab("show")
    })
}(window.jQuery), !function(a) {
    var b = function(a, b) {
        this.init("tooltip", a, b)
    };
    b.prototype = {constructor: b,init: function(b, c, d) {
            var e, f;
            this.type = b, this.$element = a(c), this.options = this.getOptions(d), this.enabled = !0, this.options.trigger == "click" ? this.$element.on("click." + this.type, this.options.selector, a.proxy(this.toggle, this)) : this.options.trigger != "manual" && (e = this.options.trigger == "hover" ? "mouseenter" : "focus", f = this.options.trigger == "hover" ? "mouseleave" : "blur", this.$element.on(e + "." + this.type, this.options.selector, a.proxy(this.enter, this)), this.$element.on(f + "." + this.type, this.options.selector, a.proxy(this.leave, this))), this.options.selector ? this._options = a.extend({}, this.options, {trigger: "manual",selector: ""}) : this.fixTitle()
        },getOptions: function(b) {
            return b = a.extend({}, a.fn[this.type].defaults, b, this.$element.data()), b.delay && typeof b.delay == "number" && (b.delay = {show: b.delay,hide: b.delay}), b
        },enter: function(b) {
            var c = a(b.currentTarget)[this.type](this._options).data(this.type);
            if (!c.options.delay || !c.options.delay.show)
                return c.show();
            clearTimeout(this.timeout), c.hoverState = "in", this.timeout = setTimeout(function() {
                c.hoverState == "in" && c.show()
            }, c.options.delay.show)
        },leave: function(b) {
            var c = a(b.currentTarget)[this.type](this._options).data(this.type);
            this.timeout && clearTimeout(this.timeout);
            if (!c.options.delay || !c.options.delay.hide)
                return c.hide();
            c.hoverState = "out", this.timeout = setTimeout(function() {
                c.hoverState == "out" && c.hide()
            }, c.options.delay.hide)
        },show: function() {
            var a, b, c, d, e, f, g;
            if (this.hasContent() && this.enabled) {
                a = this.tip(), this.setContent(), this.options.animation && a.addClass("fade"), f = typeof this.options.placement == "function" ? this.options.placement.call(this, a[0], this.$element[0]) : this.options.placement, b = /in/.test(f), a.detach().css({top: 0,left: 0,display: "block"}).insertAfter(this.$element), c = this.getPosition(b), d = a[0].offsetWidth, e = a[0].offsetHeight;
                switch (b ? f.split(" ")[1] : f) {
                    case "bottom":
                        g = {top: c.top + c.height,left: c.left + c.width / 2 - d / 2};
                        break;
                    case "top":
                        g = {top: c.top - e,left: c.left + c.width / 2 - d / 2};
                        break;
                    case "left":
                        g = {top: c.top + c.height / 2 - e / 2,left: c.left - d};
                        break;
                    case "right":
                        g = {top: c.top + c.height / 2 - e / 2,left: c.left + c.width}
                }
                a.offset(g).addClass(f).addClass("in")
            }
        },setContent: function() {
            var a = this.tip(), b = this.getTitle();
            a.find(".tooltip-inner")[this.options.html ? "html" : "text"](b), a.removeClass("fade in top bottom left right")
        },hide: function() {
            function d() {
                var b = setTimeout(function() {
                    c.off(a.support.transition.end).detach()
                }, 500);
                c.one(a.support.transition.end, function() {
                    clearTimeout(b), c.detach()
                })
            }
            var b = this, c = this.tip();
            return c.removeClass("in"), a.support.transition && this.$tip.hasClass("fade") ? d() : c.detach(), this
        },fixTitle: function() {
            var a = this.$element;
            (a.attr("title") || typeof a.attr("data-original-title") != "string") && a.attr("data-original-title", a.attr("title") || "").removeAttr("title")
        },hasContent: function() {
            return this.getTitle()
        },getPosition: function(b) {
            return a.extend({}, b ? {top: 0,left: 0} : this.$element.offset(), {width: this.$element[0].offsetWidth,height: this.$element[0].offsetHeight})
        },getTitle: function() {
            var a, b = this.$element, c = this.options;
            return a = b.attr("data-original-title") || (typeof c.title == "function" ? c.title.call(b[0]) : c.title), a
        },tip: function() {
            return this.$tip = this.$tip || a(this.options.template)
        },validate: function() {
            this.$element[0].parentNode || (this.hide(), this.$element = null, this.options = null)
        },enable: function() {
            this.enabled = !0
        },disable: function() {
            this.enabled = !1
        },toggleEnabled: function() {
            this.enabled = !this.enabled
        },toggle: function(b) {
            var c = a(b.currentTarget)[this.type](this._options).data(this.type);
            c[c.tip().hasClass("in") ? "hide" : "show"]()
        },destroy: function() {
            this.hide().$element.off("." + this.type).removeData(this.type)
        }};
    var c = a.fn.tooltip;
    a.fn.tooltip = function(c) {
        return this.each(function() {
            var d = a(this), e = d.data("tooltip"), f = typeof c == "object" && c;
            e || d.data("tooltip", e = new b(this, f)), typeof c == "string" && e[c]()
        })
    }, a.fn.tooltip.Constructor = b, a.fn.tooltip.defaults = {animation: !0,placement: "top",selector: !1,template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger: "hover",title: "",delay: 0,html: !1}, a.fn.tooltip.noConflict = function() {
        return a.fn.tooltip = c, this
    }
}(window.jQuery), !function(a) {
    var b = function(a, b) {
        this.init("popover", a, b)
    };
    b.prototype = a.extend({}, a.fn.tooltip.Constructor.prototype, {constructor: b,setContent: function() {
            var a = this.tip(), b = this.getTitle(), c = this.getContent();
            a.find(".popover-title")[this.options.html ? "html" : "text"](b), a.find(".popover-content")[this.options.html ? "html" : "text"](c), a.removeClass("fade top bottom left right in")
        },hasContent: function() {
            return this.getTitle() || this.getContent()
        },getContent: function() {
            var a, b = this.$element, c = this.options;
            return a = b.attr("data-content") || (typeof c.content == "function" ? c.content.call(b[0]) : c.content), a
        },tip: function() {
            return this.$tip || (this.$tip = a(this.options.template)), this.$tip
        },destroy: function() {
            this.hide().$element.off("." + this.type).removeData(this.type)
        }});
    var c = a.fn.popover;
    a.fn.popover = function(c) {
        return this.each(function() {
            var d = a(this), e = d.data("popover"), f = typeof c == "object" && c;
            e || d.data("popover", e = new b(this, f)), typeof c == "string" && e[c]()
        })
    }, a.fn.popover.Constructor = b, a.fn.popover.defaults = a.extend({}, a.fn.tooltip.defaults, {placement: "right",trigger: "click",content: "",template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"></div></div></div>'}), a.fn.popover.noConflict = function() {
        return a.fn.popover = c, this
    }
}(window.jQuery), !function(a) {
    var b = function(b, c) {
        this.options = a.extend({}, a.fn.affix.defaults, c), this.$window = a(window).on("scroll.affix.data-api", a.proxy(this.checkPosition, this)).on("click.affix.data-api", a.proxy(function() {
            setTimeout(a.proxy(this.checkPosition, this), 1)
        }, this)), this.$element = a(b), this.checkPosition()
    };
    b.prototype.checkPosition = function() {
        if (!this.$element.is(":visible"))
            return;
        var b = a(document).height(), c = this.$window.scrollTop(), d = this.$element.offset(), e = this.options.offset, f = e.bottom, g = e.top, h = "affix affix-top affix-bottom", i;
        typeof e != "object" && (f = g = e), typeof g == "function" && (g = e.top()), typeof f == "function" && (f = e.bottom()), i = this.unpin != null && c + this.unpin <= d.top ? !1 : f != null && d.top + this.$element.height() >= b - f ? "bottom" : g != null && c <= g ? "top" : !1;
        if (this.affixed === i)
            return;
        this.affixed = i, this.unpin = i == "bottom" ? d.top - c : null, this.$element.removeClass(h).addClass("affix" + (i ? "-" + i : ""))
    };
    var c = a.fn.affix;
    a.fn.affix = function(c) {
        return this.each(function() {
            var d = a(this), e = d.data("affix"), f = typeof c == "object" && c;
            e || d.data("affix", e = new b(this, f)), typeof c == "string" && e[c]()
        })
    }, a.fn.affix.Constructor = b, a.fn.affix.defaults = {offset: 0}, a.fn.affix.noConflict = function() {
        return a.fn.affix = c, this
    }, a(window).on("load", function() {
        a('[data-spy="affix"]').each(function() {
            var b = a(this), c = b.data();
            c.offset = c.offset || {}, c.offsetBottom && (c.offset.bottom = c.offsetBottom), c.offsetTop && (c.offset.top = c.offsetTop), b.affix(c)
        })
    })
}(window.jQuery), !function(a) {
    var b = '[data-dismiss="alert"]', c = function(c) {
        a(c).on("click", b, this.close)
    };
    c.prototype.close = function(b) {
        function f() {
            e.trigger("closed").remove()
        }
        var c = a(this), d = c.attr("data-target"), e;
        d || (d = c.attr("href"), d = d && d.replace(/.*(?=#[^\s]*$)/, "")), e = a(d), b && b.preventDefault(), e.length || (e = c.hasClass("alert") ? c : c.parent()), e.trigger(b = a.Event("close"));
        if (b.isDefaultPrevented())
            return;
        e.removeClass("in"), a.support.transition && e.hasClass("fade") ? e.on(a.support.transition.end, f) : f()
    };
    var d = a.fn.alert;
    a.fn.alert = function(b) {
        return this.each(function() {
            var d = a(this), e = d.data("alert");
            e || d.data("alert", e = new c(this)), typeof b == "string" && e[b].call(d)
        })
    }, a.fn.alert.Constructor = c, a.fn.alert.noConflict = function() {
        return a.fn.alert = d, this
    }, a(document).on("click.alert.data-api", b, c.prototype.close)
}(window.jQuery), !function(a) {
    var b = function(b, c) {
        this.$element = a(b), this.options = a.extend({}, a.fn.button.defaults, c)
    };
    b.prototype.setState = function(a) {
        var b = "disabled", c = this.$element, d = c.data(), e = c.is("input") ? "val" : "html";
        a += "Text", d.resetText || c.data("resetText", c[e]()), c[e](d[a] || this.options[a]), setTimeout(function() {
            a == "loadingText" ? c.addClass(b).attr(b, b) : c.removeClass(b).removeAttr(b)
        }, 0)
    }, b.prototype.toggle = function() {
        var a = this.$element.closest('[data-toggle="buttons-radio"]');
        a && a.find(".active").removeClass("active"), this.$element.toggleClass("active")
    };
    var c = a.fn.button;
    a.fn.button = function(c) {
        return this.each(function() {
            var d = a(this), e = d.data("button"), f = typeof c == "object" && c;
            e || d.data("button", e = new b(this, f)), c == "toggle" ? e.toggle() : c && e.setState(c)
        })
    }, a.fn.button.defaults = {loadingText: "loading..."}, a.fn.button.Constructor = b, a.fn.button.noConflict = function() {
        return a.fn.button = c, this
    }, a(document).on("click.button.data-api", "[data-toggle^=button]", function(b) {
        var c = a(b.target);
        c.hasClass("btn") || (c = c.closest(".btn")), c.button("toggle")
    })
}(window.jQuery), !function(a) {
    var b = function(b, c) {
        this.$element = a(b), this.options = a.extend({}, a.fn.collapse.defaults, c), this.options.parent && (this.$parent = a(this.options.parent)), this.options.toggle && this.toggle()
    };
    b.prototype = {constructor: b,dimension: function() {
            var a = this.$element.hasClass("width");
            return a ? "width" : "height"
        },show: function() {
            var b, c, d, e;
            if (this.transitioning)
                return;
            b = this.dimension(), c = a.camelCase(["scroll", b].join("-")), d = this.$parent && this.$parent.find("> .accordion-group > .in");
            if (d && d.length) {
                e = d.data("collapse");
                if (e && e.transitioning)
                    return;
                d.collapse("hide"), e || d.data("collapse", null)
            }
            this.$element[b](0), this.transition("addClass", a.Event("show"), "shown"), a.support.transition && this.$element[b](this.$element[0][c])
        },hide: function() {
            var b;
            if (this.transitioning)
                return;
            b = this.dimension(), this.reset(this.$element[b]()), this.transition("removeClass", a.Event("hide"), "hidden"), this.$element[b](0)
        },reset: function(a) {
            var b = this.dimension();
            return this.$element.removeClass("collapse")[b](a || "auto")[0].offsetWidth, this.$element[a !== null ? "addClass" : "removeClass"]("collapse"), this
        },transition: function(b, c, d) {
            var e = this, f = function() {
                c.type == "show" && e.reset(), e.transitioning = 0, e.$element.trigger(d)
            };
            this.$element.trigger(c);
            if (c.isDefaultPrevented())
                return;
            this.transitioning = 1, this.$element[b]("in"), a.support.transition && this.$element.hasClass("collapse") ? this.$element.one(a.support.transition.end, f) : f()
        },toggle: function() {
            this[this.$element.hasClass("in") ? "hide" : "show"]()
        }};
    var c = a.fn.collapse;
    a.fn.collapse = function(c) {
        return this.each(function() {
            var d = a(this), e = d.data("collapse"), f = typeof c == "object" && c;
            e || d.data("collapse", e = new b(this, f)), typeof c == "string" && e[c]()
        })
    }, a.fn.collapse.defaults = {toggle: !0}, a.fn.collapse.Constructor = b, a.fn.collapse.noConflict = function() {
        return a.fn.collapse = c, this
    }, a(document).on("click.collapse.data-api", "[data-toggle=collapse]", function(b) {
        var c = a(this), d, e = c.attr("data-target") || b.preventDefault() || (d = c.attr("href")) && d.replace(/.*(?=#[^\s]+$)/, ""), f = a(e).data("collapse") ? "toggle" : c.data();
        c[a(e).hasClass("in") ? "addClass" : "removeClass"]("collapsed"), a(e).collapse(f)
    })
}(window.jQuery), !function(a) {
    var b = function(b, c) {
        this.$element = a(b), this.options = c, this.options.pause == "hover" && this.$element.on("mouseenter", a.proxy(this.pause, this)).on("mouseleave", a.proxy(this.cycle, this))
    };
    b.prototype = {cycle: function(b) {
            return b || (this.paused = !1), this.options.interval && !this.paused && (this.interval = setInterval(a.proxy(this.next, this), this.options.interval)), this
        },to: function(b) {
            var c = this.$element.find(".item.active"), d = c.parent().children(), e = d.index(c), f = this;
            if (b > d.length - 1 || b < 0)
                return;
            return this.sliding ? this.$element.one("slid", function() {
                f.to(b)
            }) : e == b ? this.pause().cycle() : this.slide(b > e ? "next" : "prev", a(d[b]))
        },pause: function(b) {
            return b || (this.paused = !0), this.$element.find(".next, .prev").length && a.support.transition.end && (this.$element.trigger(a.support.transition.end), this.cycle()), clearInterval(this.interval), this.interval = null, this
        },next: function() {
            if (this.sliding)
                return;
            return this.slide("next")
        },prev: function() {
            if (this.sliding)
                return;
            return this.slide("prev")
        },slide: function(b, c) {
            var d = this.$element.find(".item.active"), e = c || d[b](), f = this.interval, g = b == "next" ? "left" : "right", h = b == "next" ? "first" : "last", i = this, j;
            this.sliding = !0, f && this.pause(), e = e.length ? e : this.$element.find(".item")[h](), j = a.Event("slide", {relatedTarget: e[0]});
            if (e.hasClass("active"))
                return;
            if (a.support.transition && this.$element.hasClass("slide")) {
                this.$element.trigger(j);
                if (j.isDefaultPrevented())
                    return;
                e.addClass(b), e[0].offsetWidth, d.addClass(g), e.addClass(g), this.$element.one(a.support.transition.end, function() {
                    e.removeClass([b, g].join(" ")).addClass("active"), d.removeClass(["active", g].join(" ")), i.sliding = !1, setTimeout(function() {
                        i.$element.trigger("slid")
                    }, 0)
                })
            } else {
                this.$element.trigger(j);
                if (j.isDefaultPrevented())
                    return;
                d.removeClass("active"), e.addClass("active"), this.sliding = !1, this.$element.trigger("slid")
            }
            return f && this.cycle(), this
        }};
    var c = a.fn.carousel;
    a.fn.carousel = function(c) {
        return this.each(function() {
            var d = a(this), e = d.data("carousel"), f = a.extend({}, a.fn.carousel.defaults, typeof c == "object" && c), g = typeof c == "string" ? c : f.slide;
            e || d.data("carousel", e = new b(this, f)), typeof c == "number" ? e.to(c) : g ? e[g]() : f.interval && e.cycle()
        })
    }, a.fn.carousel.defaults = {interval: 5e3,pause: "hover"}, a.fn.carousel.Constructor = b, a.fn.carousel.noConflict = function() {
        return a.fn.carousel = c, this
    }, a(document).on("click.carousel.data-api", "[data-slide]", function(b) {
        var c = a(this), d, e = a(c.attr("data-target") || (d = c.attr("href")) && d.replace(/.*(?=#[^\s]+$)/, "")), f = a.extend({}, e.data(), c.data());
        e.carousel(f), b.preventDefault()
    })
}(window.jQuery), !function(a) {
    var b = function(b, c) {
        this.$element = a(b), this.options = a.extend({}, a.fn.typeahead.defaults, c), this.matcher = this.options.matcher || this.matcher, this.sorter = this.options.sorter || this.sorter, this.highlighter = this.options.highlighter || this.highlighter, this.updater = this.options.updater || this.updater, this.source = this.options.source, this.$menu = a(this.options.menu), this.shown = !1, this.listen()
    };
    b.prototype = {constructor: b,select: function() {
            var a = this.$menu.find(".active").attr("data-value");
            return this.$element.val(this.updater(a)).change(), this.hide()
        },updater: function(a) {
            return a
        },show: function() {
            var b = a.extend({}, this.$element.position(), {height: this.$element[0].offsetHeight});
            return this.$menu.insertAfter(this.$element).css({top: b.top + b.height,left: b.left}).show(), this.shown = !0, this
        },hide: function() {
            return this.$menu.hide(), this.shown = !1, this
        },lookup: function(b) {
            var c;
            return this.query = this.$element.val(), !this.query || this.query.length < this.options.minLength ? this.shown ? this.hide() : this : (c = a.isFunction(this.source) ? this.source(this.query, a.proxy(this.process, this)) : this.source, c ? this.process(c) : this)
        },process: function(b) {
            var c = this;
            return b = a.grep(b, function(a) {
                return c.matcher(a)
            }), b = this.sorter(b), b.length ? this.render(b.slice(0, this.options.items)).show() : this.shown ? this.hide() : this
        },matcher: function(a) {
            return ~a.toLowerCase().indexOf(this.query.toLowerCase())
        },sorter: function(a) {
            var b = [], c = [], d = [], e;
            while (e = a.shift())
                e.toLowerCase().indexOf(this.query.toLowerCase()) ? ~e.indexOf(this.query) ? c.push(e) : d.push(e) : b.push(e);
            return b.concat(c, d)
        },highlighter: function(a) {
            var b = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
            return a.replace(new RegExp("(" + b + ")", "ig"), function(a, b) {
                return "<strong>" + b + "</strong>"
            })
        },render: function(b) {
            var c = this;
            return b = a(b).map(function(b, d) {
                return b = a(c.options.item).attr("data-value", d), b.find("a").html(c.highlighter(d)), b[0]
            }), b.first().addClass("active"), this.$menu.html(b), this
        },next: function(b) {
            var c = this.$menu.find(".active").removeClass("active"), d = c.next();
            d.length || (d = a(this.$menu.find("li")[0])), d.addClass("active")
        },prev: function(a) {
            var b = this.$menu.find(".active").removeClass("active"), c = b.prev();
            c.length || (c = this.$menu.find("li").last()), c.addClass("active")
        },listen: function() {
            this.$element.on("blur", a.proxy(this.blur, this)).on("keypress", a.proxy(this.keypress, this)).on("keyup", a.proxy(this.keyup, this)), this.eventSupported("keydown") && this.$element.on("keydown", a.proxy(this.keydown, this)), this.$menu.on("click", a.proxy(this.click, this)).on("mouseenter", "li", a.proxy(this.mouseenter, this))
        },eventSupported: function(a) {
            var b = a in this.$element;
            return b || (this.$element.setAttribute(a, "return;"), b = typeof this.$element[a] == "function"), b
        },move: function(a) {
            if (!this.shown)
                return;
            switch (a.keyCode) {
                case 9:
                case 13:
                case 27:
                    a.preventDefault();
                    break;
                case 38:
                    a.preventDefault(), this.prev();
                    break;
                case 40:
                    a.preventDefault(), this.next()
            }
            a.stopPropagation()
        },keydown: function(b) {
            this.suppressKeyPressRepeat = ~a.inArray(b.keyCode, [40, 38, 9, 13, 27]), this.move(b)
        },keypress: function(a) {
            if (this.suppressKeyPressRepeat)
                return;
            this.move(a)
        },keyup: function(a) {
            switch (a.keyCode) {
                case 40:
                case 38:
                case 16:
                case 17:
                case 18:
                    break;
                case 9:
                case 13:
                    if (!this.shown)
                        return;
                    this.select();
                    break;
                case 27:
                    if (!this.shown)
                        return;
                    this.hide();
                    break;
                default:
                    this.lookup()
            }
            a.stopPropagation(), a.preventDefault()
        },blur: function(a) {
            var b = this;
            setTimeout(function() {
                b.hide()
            }, 150)
        },click: function(a) {
            a.stopPropagation(), a.preventDefault(), this.select()
        },mouseenter: function(b) {
            this.$menu.find(".active").removeClass("active"), a(b.currentTarget).addClass("active")
        }};
    var c = a.fn.typeahead;
    a.fn.typeahead = function(c) {
        return this.each(function() {
            var d = a(this), e = d.data("typeahead"), f = typeof c == "object" && c;
            e || d.data("typeahead", e = new b(this, f)), typeof c == "string" && e[c]()
        })
    }, a.fn.typeahead.defaults = {source: [],items: 8,menu: '<ul class="typeahead dropdown-menu"></ul>',item: '<li><a href="#"></a></li>',minLength: 1}, a.fn.typeahead.Constructor = b, a.fn.typeahead.noConflict = function() {
        return a.fn.typeahead = c, this
    }, a(document).on("focus.typeahead.data-api", '[data-provide="typeahead"]', function(b) {
        var c = a(this);
        if (c.data("typeahead"))
            return;
        b.preventDefault(), c.typeahead(c.data())
    })
}(window.jQuery)
var q = null;
window.PR_SHOULD_USE_CONTINUATION = !0;
(function() {
    function L(a) {
        function m(a) {
            var f = a.charCodeAt(0);
            if (f !== 92)
                return f;
            var b = a.charAt(1);
            return (f = r[b]) ? f : "0" <= b && b <= "7" ? parseInt(a.substring(1), 8) : b === "u" || b === "x" ? parseInt(a.substring(2), 16) : a.charCodeAt(1)
        }
        function e(a) {
            if (a < 32)
                return (a < 16 ? "\\x0" : "\\x") + a.toString(16);
            a = String.fromCharCode(a);
            if (a === "\\" || a === "-" || a === "[" || a === "]")
                a = "\\" + a;
            return a
        }
        function h(a) {
            for (var f = a.substring(1, a.length - 1).match(/\\u[\dA-Fa-f]{4}|\\x[\dA-Fa-f]{2}|\\[0-3][0-7]{0,2}|\\[0-7]{1,2}|\\[\S\s]|[^\\]/g), a = 
            [], b = [], o = f[0] === "^", c = o ? 1 : 0, i = f.length; c < i; ++c) {
                var j = f[c];
                if (/\\[bdsw]/i.test(j))
                    a.push(j);
                else {
                    var j = m(j), d;
                    c + 2 < i && "-" === f[c + 1] ? (d = m(f[c + 2]), c += 2) : d = j;
                    b.push([j, d]);
                    d < 65 || j > 122 || (d < 65 || j > 90 || b.push([Math.max(65, j) | 32, Math.min(d, 90) | 32]), d < 97 || j > 122 || b.push([Math.max(97, j) & -33, Math.min(d, 122) & -33]))
                }
            }
            b.sort(function(a, f) {
                return a[0] - f[0] || f[1] - a[1]
            });
            f = [];
            j = [NaN, NaN];
            for (c = 0; c < b.length; ++c)
                i = b[c], i[0] <= j[1] + 1 ? j[1] = Math.max(j[1], i[1]) : f.push(j = i);
            b = ["["];
            o && b.push("^");
            b.push.apply(b, a);
            for (c = 0; c < 
            f.length; ++c)
                i = f[c], b.push(e(i[0])), i[1] > i[0] && (i[1] + 1 > i[0] && b.push("-"), b.push(e(i[1])));
            b.push("]");
            return b.join("")
        }
        function y(a) {
            for (var f = a.source.match(/\[(?:[^\\\]]|\\[\S\s])*]|\\u[\dA-Fa-f]{4}|\\x[\dA-Fa-f]{2}|\\\d+|\\[^\dux]|\(\?[!:=]|[()^]|[^()[\\^]+/g), b = f.length, d = [], c = 0, i = 0; c < b; ++c) {
                var j = f[c];
                j === "(" ? ++i : "\\" === j.charAt(0) && (j = +j.substring(1)) && j <= i && (d[j] = -1)
            }
            for (c = 1; c < d.length; ++c)
                -1 === d[c] && (d[c] = ++t);
            for (i = c = 0; c < b; ++c)
                j = f[c], j === "(" ? (++i, d[i] === void 0 && (f[c] = "(?:")) : "\\" === j.charAt(0) && 
                (j = +j.substring(1)) && j <= i && (f[c] = "\\" + d[i]);
            for (i = c = 0; c < b; ++c)
                "^" === f[c] && "^" !== f[c + 1] && (f[c] = "");
            if (a.ignoreCase && s)
                for (c = 0; c < b; ++c)
                    j = f[c], a = j.charAt(0), j.length >= 2 && a === "[" ? f[c] = h(j) : a !== "\\" && (f[c] = j.replace(/[A-Za-z]/g, function(a) {
                        a = a.charCodeAt(0);
                        return "[" + String.fromCharCode(a & -33, a | 32) + "]"
                    }));
            return f.join("")
        }
        for (var t = 0, s = !1, l = !1, p = 0, d = a.length; p < d; ++p) {
            var g = a[p];
            if (g.ignoreCase)
                l = !0;
            else if (/[a-z]/i.test(g.source.replace(/\\u[\da-f]{4}|\\x[\da-f]{2}|\\[^UXux]/gi, ""))) {
                s = !0;
                l = !1;
                break
            }
        }
        for (var r = 
        {b: 8,t: 9,n: 10,v: 11,f: 12,r: 13}, n = [], p = 0, d = a.length; p < d; ++p) {
            g = a[p];
            if (g.global || g.multiline)
                throw Error("" + g);
            n.push("(?:" + y(g) + ")")
        }
        return RegExp(n.join("|"), l ? "gi" : "g")
    }
    function M(a) {
        function m(a) {
            switch (a.nodeType) {
                case 1:
                    if (e.test(a.className))
                        break;
                    for (var g = a.firstChild; g; g = g.nextSibling)
                        m(g);
                    g = a.nodeName;
                    if ("BR" === g || "LI" === g)
                        h[s] = "\n", t[s << 1] = y++, t[s++ << 1 | 1] = a;
                    break;
                case 3:
                case 4:
                    g = a.nodeValue, g.length && (g = p ? g.replace(/\r\n?/g, "\n") : g.replace(/[\t\n\r ]+/g, " "), h[s] = g, t[s << 1] = y, y += g.length, 
                    t[s++ << 1 | 1] = a)
            }
        }
        var e = /(?:^|\s)nocode(?:\s|$)/, h = [], y = 0, t = [], s = 0, l;
        a.currentStyle ? l = a.currentStyle.whiteSpace : window.getComputedStyle && (l = document.defaultView.getComputedStyle(a, q).getPropertyValue("white-space"));
        var p = l && "pre" === l.substring(0, 3);
        m(a);
        return {a: h.join("").replace(/\n$/, ""),c: t}
    }
    function B(a, m, e, h) {
        m && (a = {a: m,d: a}, e(a), h.push.apply(h, a.e))
    }
    function x(a, m) {
        function e(a) {
            for (var l = a.d, p = [l, "pln"], d = 0, g = a.a.match(y) || [], r = {}, n = 0, z = g.length; n < z; ++n) {
                var f = g[n], b = r[f], o = void 0, c;
                if (typeof b === 
                "string")
                    c = !1;
                else {
                    var i = h[f.charAt(0)];
                    if (i)
                        o = f.match(i[1]), b = i[0];
                    else {
                        for (c = 0; c < t; ++c)
                            if (i = m[c], o = f.match(i[1])) {
                                b = i[0];
                                break
                            }
                        o || (b = "pln")
                    }
                    if ((c = b.length >= 5 && "lang-" === b.substring(0, 5)) && !(o && typeof o[1] === "string"))
                        c = !1, b = "src";
                    c || (r[f] = b)
                }
                i = d;
                d += f.length;
                if (c) {
                    c = o[1];
                    var j = f.indexOf(c), k = j + c.length;
                    o[2] && (k = f.length - o[2].length, j = k - c.length);
                    b = b.substring(5);
                    B(l + i, f.substring(0, j), e, p);
                    B(l + i + j, c, C(b, c), p);
                    B(l + i + k, f.substring(k), e, p)
                } else
                    p.push(l + i, b)
            }
            a.e = p
        }
        var h = {}, y;
        (function() {
            for (var e = a.concat(m), 
            l = [], p = {}, d = 0, g = e.length; d < g; ++d) {
                var r = e[d], n = r[3];
                if (n)
                    for (var k = n.length; --k >= 0; )
                        h[n.charAt(k)] = r;
                r = r[1];
                n = "" + r;
                p.hasOwnProperty(n) || (l.push(r), p[n] = q)
            }
            l.push(/[\S\s]/);
            y = L(l)
        })();
        var t = m.length;
        return e
    }
    function u(a) {
        var m = [], e = [];
        a.tripleQuotedStrings ? m.push(["str", /^(?:'''(?:[^'\\]|\\[\S\s]|''?(?=[^']))*(?:'''|$)|"""(?:[^"\\]|\\[\S\s]|""?(?=[^"]))*(?:"""|$)|'(?:[^'\\]|\\[\S\s])*(?:'|$)|"(?:[^"\\]|\\[\S\s])*(?:"|$))/, q, "'\""]) : a.multiLineStrings ? m.push(["str", /^(?:'(?:[^'\\]|\\[\S\s])*(?:'|$)|"(?:[^"\\]|\\[\S\s])*(?:"|$)|`(?:[^\\`]|\\[\S\s])*(?:`|$))/, 
            q, "'\"`"]) : m.push(["str", /^(?:'(?:[^\n\r'\\]|\\.)*(?:'|$)|"(?:[^\n\r"\\]|\\.)*(?:"|$))/, q, "\"'"]);
        a.verbatimStrings && e.push(["str", /^@"(?:[^"]|"")*(?:"|$)/, q]);
        var h = a.hashComments;
        h && (a.cStyleComments ? (h > 1 ? m.push(["com", /^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/, q, "#"]) : m.push(["com", /^#(?:(?:define|elif|else|endif|error|ifdef|include|ifndef|line|pragma|undef|warning)\b|[^\n\r]*)/, q, "#"]), e.push(["str", /^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h|[a-z]\w*)>/, q])) : m.push(["com", /^#[^\n\r]*/, 
            q, "#"]));
        a.cStyleComments && (e.push(["com", /^\/\/[^\n\r]*/, q]), e.push(["com", /^\/\*[\S\s]*?(?:\*\/|$)/, q]));
        a.regexLiterals && e.push(["lang-regex", /^(?:^^\.?|[!+-]|!=|!==|#|%|%=|&|&&|&&=|&=|\(|\*|\*=|\+=|,|-=|->|\/|\/=|:|::|;|<|<<|<<=|<=|=|==|===|>|>=|>>|>>=|>>>|>>>=|[?@[^]|\^=|\^\^|\^\^=|{|\||\|=|\|\||\|\|=|~|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\s*(\/(?=[^*/])(?:[^/[\\]|\\[\S\s]|\[(?:[^\\\]]|\\[\S\s])*(?:]|$))+\/)/]);
        (h = a.types) && e.push(["typ", h]);
        a = ("" + a.keywords).replace(/^ | $/g, 
        "");
        a.length && e.push(["kwd", RegExp("^(?:" + a.replace(/[\s,]+/g, "|") + ")\\b"), q]);
        m.push(["pln", /^\s+/, q, " \r\n\t\xa0"]);
        e.push(["lit", /^@[$_a-z][\w$@]*/i, q], ["typ", /^(?:[@_]?[A-Z]+[a-z][\w$@]*|\w+_t\b)/, q], ["pln", /^[$_a-z][\w$@]*/i, q], ["lit", /^(?:0x[\da-f]+|(?:\d(?:_\d+)*\d*(?:\.\d*)?|\.\d\+)(?:e[+-]?\d+)?)[a-z]*/i, q, "0123456789"], ["pln", /^\\[\S\s]?/, q], ["pun", /^.[^\s\w"-$'./@\\`]*/, q]);
        return x(m, e)
    }
    function D(a, m) {
        function e(a) {
            switch (a.nodeType) {
                case 1:
                    if (k.test(a.className))
                        break;
                    if ("BR" === a.nodeName)
                        h(a), 
                        a.parentNode && a.parentNode.removeChild(a);
                    else
                        for (a = a.firstChild; a; a = a.nextSibling)
                            e(a);
                    break;
                case 3:
                case 4:
                    if (p) {
                        var b = a.nodeValue, d = b.match(t);
                        if (d) {
                            var c = b.substring(0, d.index);
                            a.nodeValue = c;
                            (b = b.substring(d.index + d[0].length)) && a.parentNode.insertBefore(s.createTextNode(b), a.nextSibling);
                            h(a);
                            c || a.parentNode.removeChild(a)
                        }
                    }
            }
        }
        function h(a) {
            function b(a, d) {
                var e = d ? a.cloneNode(!1) : a, f = a.parentNode;
                if (f) {
                    var f = b(f, 1), g = a.nextSibling;
                    f.appendChild(e);
                    for (var h = g; h; h = g)
                        g = h.nextSibling, f.appendChild(h)
                }
                return e
            }
            for (; !a.nextSibling; )
                if (a = a.parentNode, !a)
                    return;
            for (var a = b(a.nextSibling, 0), e; (e = a.parentNode) && e.nodeType === 1; )
                a = e;
            d.push(a)
        }
        var k = /(?:^|\s)nocode(?:\s|$)/, t = /\r\n?|\n/, s = a.ownerDocument, l;
        a.currentStyle ? l = a.currentStyle.whiteSpace : window.getComputedStyle && (l = s.defaultView.getComputedStyle(a, q).getPropertyValue("white-space"));
        var p = l && "pre" === l.substring(0, 3);
        for (l = s.createElement("LI"); a.firstChild; )
            l.appendChild(a.firstChild);
        for (var d = [l], g = 0; g < d.length; ++g)
            e(d[g]);
        m === (m | 0) && d[0].setAttribute("value", 
        m);
        var r = s.createElement("OL");
        r.className = "linenums";
        for (var n = Math.max(0, m - 1 | 0) || 0, g = 0, z = d.length; g < z; ++g)
            l = d[g], l.className = "L" + (g + n) % 10, l.firstChild || l.appendChild(s.createTextNode("\xa0")), r.appendChild(l);
        a.appendChild(r)
    }
    function k(a, m) {
        for (var e = m.length; --e >= 0; ) {
            var h = m[e];
            A.hasOwnProperty(h) ? window.console && console.warn("cannot override language handler %s", h) : A[h] = a
        }
    }
    function C(a, m) {
        if (!a || !A.hasOwnProperty(a))
            a = /^\s*</.test(m) ? "default-markup" : "default-code";
        return A[a]
    }
    function E(a) {
        var m = 
        a.g;
        try {
            var e = M(a.h), h = e.a;
            a.a = h;
            a.c = e.c;
            a.d = 0;
            C(m, h)(a);
            var k = /\bMSIE\b/.test(navigator.userAgent), m = /\n/g, t = a.a, s = t.length, e = 0, l = a.c, p = l.length, h = 0, d = a.e, g = d.length, a = 0;
            d[g] = s;
            var r, n;
            for (n = r = 0; n < g; )
                d[n] !== d[n + 2] ? (d[r++] = d[n++], d[r++] = d[n++]) : n += 2;
            g = r;
            for (n = r = 0; n < g; ) {
                for (var z = d[n], f = d[n + 1], b = n + 2; b + 2 <= g && d[b + 1] === f; )
                    b += 2;
                d[r++] = z;
                d[r++] = f;
                n = b
            }
            for (d.length = r; h < p; ) {
                var o = l[h + 2] || s, c = d[a + 2] || s, b = Math.min(o, c), i = l[h + 1], j;
                if (i.nodeType !== 1 && (j = t.substring(e, b))) {
                    k && (j = j.replace(m, "\r"));
                    i.nodeValue = 
                    j;
                    var u = i.ownerDocument, v = u.createElement("SPAN");
                    v.className = d[a + 1];
                    var x = i.parentNode;
                    x.replaceChild(v, i);
                    v.appendChild(i);
                    e < o && (l[h + 1] = i = u.createTextNode(t.substring(b, o)), x.insertBefore(i, v.nextSibling))
                }
                e = b;
                e >= o && (h += 2);
                e >= c && (a += 2)
            }
        } catch (w) {
            "console" in window && console.log(w && w.stack ? w.stack : w)
        }
    }
    var v = ["break,continue,do,else,for,if,return,while"], w = [[v, "auto,case,char,const,default,double,enum,extern,float,goto,int,long,register,short,signed,sizeof,static,struct,switch,typedef,union,unsigned,void,volatile"], 
        "catch,class,delete,false,import,new,operator,private,protected,public,this,throw,true,try,typeof"], F = [w, "alignof,align_union,asm,axiom,bool,concept,concept_map,const_cast,constexpr,decltype,dynamic_cast,explicit,export,friend,inline,late_check,mutable,namespace,nullptr,reinterpret_cast,static_assert,static_cast,template,typeid,typename,using,virtual,where"], G = [w, "abstract,boolean,byte,extends,final,finally,implements,import,instanceof,null,native,package,strictfp,super,synchronized,throws,transient"], 
    H = [G, "as,base,by,checked,decimal,delegate,descending,dynamic,event,fixed,foreach,from,group,implicit,in,interface,internal,into,is,lock,object,out,override,orderby,params,partial,readonly,ref,sbyte,sealed,stackalloc,string,select,uint,ulong,unchecked,unsafe,ushort,var"], w = [w, "debugger,eval,export,function,get,null,set,undefined,var,with,Infinity,NaN"], I = [v, "and,as,assert,class,def,del,elif,except,exec,finally,from,global,import,in,is,lambda,nonlocal,not,or,pass,print,raise,try,with,yield,False,True,None"], 
    J = [v, "alias,and,begin,case,class,def,defined,elsif,end,ensure,false,in,module,next,nil,not,or,redo,rescue,retry,self,super,then,true,undef,unless,until,when,yield,BEGIN,END"], v = [v, "case,done,elif,esac,eval,fi,function,in,local,set,then,until"], K = /^(DIR|FILE|vector|(de|priority_)?queue|list|stack|(const_)?iterator|(multi)?(set|map)|bitset|u?(int|float)\d*)/, N = /\S/, O = u({keywords: [F, H, w, "caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END" + 
            I, J, v],hashComments: !0,cStyleComments: !0,multiLineStrings: !0,regexLiterals: !0}), A = {};
    k(O, ["default-code"]);
    k(x([], [["pln", /^[^<?]+/], ["dec", /^<!\w[^>]*(?:>|$)/], ["com", /^<\!--[\S\s]*?(?:--\>|$)/], ["lang-", /^<\?([\S\s]+?)(?:\?>|$)/], ["lang-", /^<%([\S\s]+?)(?:%>|$)/], ["pun", /^(?:<[%?]|[%?]>)/], ["lang-", /^<xmp\b[^>]*>([\S\s]+?)<\/xmp\b[^>]*>/i], ["lang-js", /^<script\b[^>]*>([\S\s]*?)(<\/script\b[^>]*>)/i], ["lang-css", /^<style\b[^>]*>([\S\s]*?)(<\/style\b[^>]*>)/i], ["lang-in.tag", /^(<\/?[a-z][^<>]*>)/i]]), 
    ["default-markup", "htm", "html", "mxml", "xhtml", "xml", "xsl"]);
    k(x([["pln", /^\s+/, q, " \t\r\n"], ["atv", /^(?:"[^"]*"?|'[^']*'?)/, q, "\"'"]], [["tag", /^^<\/?[a-z](?:[\w-.:]*\w)?|\/?>$/i], ["atn", /^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i], ["lang-uq.val", /^=\s*([^\s"'>]*(?:[^\s"'/>]|\/(?=\s)))/], ["pun", /^[/<->]+/], ["lang-js", /^on\w+\s*=\s*"([^"]+)"/i], ["lang-js", /^on\w+\s*=\s*'([^']+)'/i], ["lang-js", /^on\w+\s*=\s*([^\s"'>]+)/i], ["lang-css", /^style\s*=\s*"([^"]+)"/i], ["lang-css", /^style\s*=\s*'([^']+)'/i], ["lang-css", 
            /^style\s*=\s*([^\s"'>]+)/i]]), ["in.tag"]);
    k(x([], [["atv", /^[\S\s]+/]]), ["uq.val"]);
    k(u({keywords: F,hashComments: !0,cStyleComments: !0,types: K}), ["c", "cc", "cpp", "cxx", "cyc", "m"]);
    k(u({keywords: "null,true,false"}), ["json"]);
    k(u({keywords: H,hashComments: !0,cStyleComments: !0,verbatimStrings: !0,types: K}), ["cs"]);
    k(u({keywords: G,cStyleComments: !0}), ["java"]);
    k(u({keywords: v,hashComments: !0,multiLineStrings: !0}), ["bsh", "csh", "sh"]);
    k(u({keywords: I,hashComments: !0,multiLineStrings: !0,tripleQuotedStrings: !0}), 
    ["cv", "py"]);
    k(u({keywords: "caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END",hashComments: !0,multiLineStrings: !0,regexLiterals: !0}), ["perl", "pl", "pm"]);
    k(u({keywords: J,hashComments: !0,multiLineStrings: !0,regexLiterals: !0}), ["rb"]);
    k(u({keywords: w,cStyleComments: !0,regexLiterals: !0}), ["js"]);
    k(u({keywords: "all,and,by,catch,class,else,extends,false,finally,for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then,true,try,unless,until,when,while,yes",
        hashComments: 3,cStyleComments: !0,multilineStrings: !0,tripleQuotedStrings: !0,regexLiterals: !0}), ["coffee"]);
    k(x([], [["str", /^[\S\s]+/]]), ["regex"]);
    window.prettyPrintOne = function(a, m, e) {
        var h = document.createElement("PRE");
        h.innerHTML = a;
        e && D(h, e);
        E({g: m,i: e,h: h});
        return h.innerHTML
    };
    window.prettyPrint = function(a) {
        function m() {
            for (var e = window.PR_SHOULD_USE_CONTINUATION ? l.now() + 250 : Infinity; p < h.length && l.now() < e; p++) {
                var n = h[p], k = n.className;
                if (k.indexOf("prettyprint") >= 0) {
                    var k = k.match(g), f, b;
                    if (b = 
                    !k) {
                        b = n;
                        for (var o = void 0, c = b.firstChild; c; c = c.nextSibling)
                            var i = c.nodeType, o = i === 1 ? o ? b : c : i === 3 ? N.test(c.nodeValue) ? b : o : o;
                        b = (f = o === b ? void 0 : o) && "CODE" === f.tagName
                    }
                    b && (k = f.className.match(g));
                    k && (k = k[1]);
                    b = !1;
                    for (o = n.parentNode; o; o = o.parentNode)
                        if ((o.tagName === "pre" || o.tagName === "code" || o.tagName === "xmp") && o.className && o.className.indexOf("prettyprint") >= 0) {
                            b = !0;
                            break
                        }
                    b || ((b = (b = n.className.match(/\blinenums\b(?::(\d+))?/)) ? b[1] && b[1].length ? +b[1] : !0 : !1) && D(n, b), d = {g: k,h: n,i: b}, E(d))
                }
            }
            p < h.length ? setTimeout(m, 
            250) : a && a()
        }
        for (var e = [document.getElementsByTagName("pre"), document.getElementsByTagName("code"), document.getElementsByTagName("xmp")], h = [], k = 0; k < e.length; ++k)
            for (var t = 0, s = e[k].length; t < s; ++t)
                h.push(e[k][t]);
        var e = q, l = Date;
        l.now || (l = {now: function() {
                return +new Date
            }});
        var p = 0, d, g = /\blang(?:uage)?-([\w.]+)(?!\S)/;
        m()
    };
    window.PR = {createSimpleLexer: x,registerLangHandler: k,sourceDecorator: u,PR_ATTRIB_NAME: "atn",PR_ATTRIB_VALUE: "atv",PR_COMMENT: "com",PR_DECLARATION: "dec",PR_KEYWORD: "kwd",PR_LITERAL: "lit",
        PR_NOCODE: "nocode",PR_PLAIN: "pln",PR_PUNCTUATION: "pun",PR_SOURCE: "src",PR_STRING: "str",PR_TAG: "tag",PR_TYPE: "typ"}
})();

var b6 = {_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",e: function(b) {
        if ("undefined" !== typeof btoa)
            return btoa(b);
        var a = "", d, c, f, g, h, e, j = 0;
        for (b = b6.utf8e(b); j < b.length; )
            d = b.charCodeAt(j++), c = b.charCodeAt(j++), f = b.charCodeAt(j++), g = d >> 2, d = (d & 3) << 4 | c >> 4, h = (c & 15) << 2 | f >> 6, e = f & 63, isNaN(c) ? h = e = 64 : isNaN(f) && (e = 64), a = a + this._keyStr.charAt(g) + this._keyStr.charAt(d) + this._keyStr.charAt(h) + this._keyStr.charAt(e);
        return a
    },d: function(b) {
        if ("undefined" !== typeof atob)
            return atob(b);
        var a = "", d, c, f, g, h, e = 0;
        for (b = b.replace(/[^A-Za-z0-9\+\/\=]/g, ""); e < b.length; )
            d = this._keyStr.indexOf(b.charAt(e++)), c = this._keyStr.indexOf(b.charAt(e++)), g = this._keyStr.indexOf(b.charAt(e++)), h = this._keyStr.indexOf(b.charAt(e++)), d = d << 2 | c >> 4, c = (c & 15) << 4 | g >> 2, f = (g & 3) << 6 | h, a += String.fromCharCode(d), 64 != g && (a += String.fromCharCode(c)), 64 != h && (a += String.fromCharCode(f));
        return a = b6.utf8d(a)
    },utf8e: function(b) {
        b = b.replace(/\r\n/g, "\n");
        for (var a = "", d = 0; d < b.length; d++) {
            var c = b.charCodeAt(d);
            128 > c ? a += String.fromCharCode(c) : 
            (127 < c && 2048 > c ? a += String.fromCharCode(c >> 6 | 192) : (a += String.fromCharCode(c >> 12 | 224), a += String.fromCharCode(c >> 6 & 63 | 128)), a += String.fromCharCode(c & 63 | 128))
        }
        return a
    },utf8d: function(b) {
        for (var a = "", d = 0, c = c1 = c2 = 0; d < b.length; )
            c = b.charCodeAt(d), 128 > c ? (a += String.fromCharCode(c), d++) : 191 < c && 224 > c ? (c2 = b.charCodeAt(d + 1), a += String.fromCharCode((c & 31) << 6 | c2 & 63), d += 2) : (c2 = b.charCodeAt(d + 1), c3 = b.charCodeAt(d + 2), a += String.fromCharCode((c & 15) << 12 | (c2 & 63) << 6 | c3 & 63), d += 3);
        return a
    }};
