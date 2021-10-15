var Hogan = {};

! function (n) {
    function f(n, e, r) {
        var t;
        return e && "object" == typeof e && (void 0 !== e[n] ? t = e[n] : r && e.get && "function" == typeof e.get && (t = e.get(n))),
            t;
    }

    function a(n) {
        return String(null == n ? "" : n);
    }
    n.Template = function (n, e, r, t) {
        n = n || {}, this.r = n.code || this.r, this.c = r, this.options = t || {}, this.text = e || "",
            this.partials = n.partials || {}, this.subs = n.subs || {}, this.buf = "";
    }, n.Template.prototype = {
        r: function () {
            return "";
        },
        v: function (n) {
            return n = a(n), s.test(n) ? n.replace(e, "&amp;").replace(r, "&lt;").replace(t, "&gt;").replace(o, "&#39;").replace(i, "&quot;") : n;
        },
        t: a,
        render: function (n, e, r) {
            return this.ri([n], e || {}, r);
        },
        ri: function (n, e, r) {
            return this.r(n, e, r);
        },
        ep: function (n, e) {
            var r = this.partials[n],
                t = e[r.name];
            if (r.instance && r.base == t) return r.instance;
            if ("string" == typeof t) {
                if (!this.c) throw new Error("No compiler available.");
                t = this.c.compile(t, this.options);
            }
            if (!t) return null;
            if (this.partials[n].base = t, r.subs) {
                for (key in e.stackText || (e.stackText = {}), r.subs) e.stackText[key] || (e.stackText[key] = void 0 !== this.activeSub && e.stackText[this.activeSub] ? e.stackText[this.activeSub] : this.text);
                t = function (n, e, r, t, o, i) {
                    function a() {}

                    function s() {}
                    s.prototype = (a.prototype = n).subs;
                    var c, u = new a();
                    for (c in u.subs = new s(), u.subsText = {}, u.buf = "", t = t || {}, u.stackSubs = t,
                        u.subsText = i, e) t[c] || (t[c] = e[c]);
                    for (c in t) u.subs[c] = t[c];
                    for (c in o = o || {}, u.stackPartials = o, r) o[c] || (o[c] = r[c]);
                    for (c in o) u.partials[c] = o[c];
                    return u;
                }(t, r.subs, r.partials, this.stackSubs, this.stackPartials, e.stackText);
            }
            return this.partials[n].instance = t;
        },
        rp: function (n, e, r, t) {
            var o = this.ep(n, r);
            return o ? o.ri(e, r, t) : "";
        },
        rs: function (n, e, r) {
            var t = n[n.length - 1];
            if (l(t))
                for (var o = 0; o < t.length; o++) n.push(t[o]), r(n, e, this), n.pop();
            else r(n, e, this);
        },
        s: function (n, e, r, t, o, i, a) {
            var s;
            return (!l(n) || 0 !== n.length) && ("function" == typeof n && (n = this.ms(n, e, r, t, o, i, a)),
                s = !!n, !t && s && e && e.push("object" == typeof n ? n : e[e.length - 1]), s);
        },
        d: function (n, e, r, t) {
            var o, i = n.split("."),
                a = this.f(i[0], e, r, t),
                s = this.options.modelGet,
                c = null;
            if ("." === n && l(e[e.length - 2])) a = e[e.length - 1];
            else
                for (var u = 1; u < i.length; u++) a = void 0 !== (o = f(i[u], a, s)) ? (c = a,
                    o) : "";
            return !(t && !a) && (t || "function" != typeof a || (e.push(c), a = this.mv(a, e, r),
                e.pop()), a);
        },
        f: function (n, e, r, t) {
            for (var o = !1, i = !1, a = this.options.modelGet, s = e.length - 1; 0 <= s; s--)
                if (void 0 !== (o = f(n, e[s], a))) {
                    i = !0;
                    break;
                }
            return i ? (t || "function" != typeof o || (o = this.mv(o, e, r)), o) : !t && "";
        },
        ls: function (n, e, r, t, o) {
            var i = this.options.delimiters;
            return this.options.delimiters = o, this.b(this.ct(a(n.call(e, t)), e, r)), this.options.delimiters = i,
                !1;
        },
        ct: function (n, e, r) {
            if (this.options.disableLambda) throw new Error("Lambda features disabled.");
            return this.c.compile(n, this.options).render(e, r);
        },
        b: function (n) {
            this.buf += n;
        },
        fl: function () {
            var n = this.buf;
            return this.buf = "", n;
        },
        ms: function (n, e, r, t, o, i, a) {
            var s, c = e[e.length - 1],
                u = n.call(c);
            return "function" == typeof u ? !!t || (s = this.activeSub && this.subsText && this.subsText[this.activeSub] ? this.subsText[this.activeSub] : this.text,
                this.ls(u, c, r, s.substring(o, i), a)) : u;
        },
        mv: function (n, e, r) {
            var t = e[e.length - 1],
                o = n.call(t);
            return "function" == typeof o ? this.ct(a(o.call(t)), t, r) : o;
        },
        sub: function (n, e, r, t) {
            var o = this.subs[n];
            o && (this.activeSub = n, o(e, r, this, t), this.activeSub = !1);
        }
    };
    var e = /&/g,
        r = /</g,
        t = />/g,
        o = /\'/g,
        i = /\"/g,
        s = /[&<>\"\']/,
        l = Array.isArray || function (n) {
            return "[object Array]" === Object.prototype.toString.call(n);
        };
}("undefined" != typeof exports ? exports : Hogan),
function (x) {
    function A(n) {
        return n.trim ? n.trim() : n.replace(/^\s*|\s*$/g, "");
    }

    function U(n, e, r) {
        if (e.charAt(r) == n.charAt(0)) {
            for (var t = 1, o = n.length; t < o; t++)
                if (e.charAt(r + t) != n.charAt(t)) return;
            return 1;
        }
    }

    function c(n, e, r, t) {
        for (var o = [], i = null, a = null, s = r[r.length - 1]; 0 < n.length;) {
            if (a = n.shift(), s && "<" == s.tag && !(a.tag in p)) throw new Error("Illegal content in < super tag.");
            if (x.tags[a.tag] <= x.tags.$ || function (n, e) {
                    for (var r = 0, t = e.length; r < t; r++)
                        if (e[r].o == n.n) return n.tag = "#",
                            !0;
                }(a, t)) r.push(a), a.nodes = c(n, a.tag, r, t);
            else {
                if ("/" == a.tag) {
                    if (0 === r.length) throw new Error("Closing tag without opener: /" + a.n);
                    if (i = r.pop(), a.n != i.n && ! function (n, e, r) {
                            for (var t = 0, o = r.length; t < o; t++)
                                if (r[t].c == n && r[t].o == e) return !0;
                        }(a.n, i.n, t)) throw new Error("Nesting error: " + i.n + " vs. " + a.n);
                    return i.end = a.i, o;
                }
                "\n" == a.tag && (a.last = 0 == n.length || "\n" == n[0].tag);
            }
            o.push(a);
        }
        if (0 < r.length) throw new Error("missing closing tag: " + r.pop().n);
        return o;
    }

    function t(n) {
        var e = [];
        for (var r in n.partials) e.push('"' + o(r) + '":{name:"' + o(n.partials[r].name) + '", ' + t(n.partials[r]) + "}");
        return "partials: {" + e.join(",") + "}, subs: " + function (n) {
            var e = [];
            for (var r in n) e.push('"' + o(r) + '": function(c,p,t,i) {' + n[r] + "}");
            return "{ " + e.join(",") + " }";
        }(n.subs);
    }

    function o(n) {
        return n.replace(f, "\\\\").replace(e, '\\"').replace(s, "\\n").replace(u, "\\r").replace(l, "\\u2028").replace(h, "\\u2029");
    }

    function r(n) {
        return ~n.indexOf(".") ? "d" : "f";
    }

    function i(n, e) {
        var r = "<" + (e.prefix || "") + n.n + w++;
        return e.partials[r] = {
            name: n.n,
            partials: {}
        }, e.code += 't.b(t.rp("' + o(r) + '",c,p,"' + (n.indent || "") + '"));', r;
    }

    function n(n, e) {
        e.code += "t.b(t.t(t." + r(n.n) + '("' + o(n.n) + '",c,p,0)));';
    }

    function a(n) {
        return "t.b(" + n + ");";
    }
    var _ = /\S/,
        e = /\"/g,
        s = /\n/g,
        u = /\r/g,
        f = /\\/g,
        l = /\u2028/,
        h = /\u2029/;
    x.tags = {
        "#": 1,
        "^": 2,
        "<": 3,
        $: 4,
        "/": 5,
        "!": 6,
        ">": 7,
        "=": 8,
        _v: 9,
        "{": 10,
        "&": 11,
        _t: 12
    }, x.scan = function (n, e) {
        function o() {
            0 < w.length && (d.push({
                tag: "_t",
                text: new String(w)
            }), w = "");
        }

        function r(n, e) {
            if (o(), n && function () {
                    for (var n = !0, e = v; e < d.length; e++)
                        if (!(n = x.tags[d[e].tag] < x.tags._v || "_t" == d[e].tag && null === d[e].text.match(_))) return;
                    return n;
                }())
                for (var r, t = v; t < d.length; t++) d[t].text && ((r = d[t + 1]) && ">" == r.tag && (r.indent = d[t].text.toString()),
                    d.splice(t, 1));
            else e || d.push({
                tag: "\n"
            });
            y = !1, v = d.length;
        }
        var t, i, a, s, c, u, f = n.length,
            l = 0,
            h = null,
            p = null,
            w = "",
            d = [],
            y = !1,
            g = 0,
            v = 0,
            b = "{{",
            m = "}}";
        for (e && (e = e.split(" "), b = e[0], m = e[1]), g = 0; g < f; g++) 0 == l ? U(b, n, g) ? (--g,
            o(), l = 1) : "\n" == n.charAt(g) ? r(y) : w += n.charAt(g) : 1 == l ? (g += b.length - 1,
            l = "=" == (h = (p = x.tags[n.charAt(g + 1)]) ? n.charAt(g + 1) : "_v") ? (a = g,
                0, s = "=" + m, c = (i = n).indexOf(s, a), u = A(i.substring(i.indexOf("=", a) + 1, c)).split(" "),
                b = u[0], m = u[u.length - 1], g = c + s.length - 1, 0) : (p && g++, 2), y = g) : U(m, n, g) ? (d.push({
            tag: h,
            n: A(w),
            otag: b,
            ctag: m,
            i: "/" == h ? y - b.length : g + m.length
        }), w = "", g += m.length - 1, l = 0, "{" == h && ("}}" == m ? g++ : "}" === (t = d[d.length - 1]).n.substr(t.n.length - 1) && (t.n = t.n.substring(0, t.n.length - 1)))) : w += n.charAt(g);
        return r(y, !0), d;
    };
    var p = {
        _t: !0,
        "\n": !0,
        $: !0,
        "/": !0
    };
    x.stringify = function (n) {
        return "{code: function (c,p,i) { " + x.wrapMain(n.code) + " }," + t(n) + "}";
    };
    var w = 0;
    x.generate = function (n, e, r) {
        w = 0;
        var t = {
            code: "",
            subs: {},
            partials: {}
        };
        return x.walk(n, t), r.asString ? this.stringify(t, e, r) : this.makeTemplate(t, e, r);
    }, x.wrapMain = function (n) {
        return 'var t=this;t.b(i=i||"");' + n + "return t.fl();";
    }, x.template = x.Template, x.makeTemplate = function (n, e, r) {
        var t = this.makePartials(n);
        return t.code = new Function("c", "p", "i", this.wrapMain(n.code)), new this.template(t, e, this, r);
    }, x.makePartials = function (n) {
        var e, r = {
            subs: {},
            partials: n.partials,
            name: n.name
        };
        for (e in r.partials) r.partials[e] = this.makePartials(r.partials[e]);
        for (e in n.subs) r.subs[e] = new Function("c", "p", "t", "i", n.subs[e]);
        return r;
    }, x.codegen = {
        "#": function (n, e) {
            e.code += "if(t.s(t." + r(n.n) + '("' + o(n.n) + '",c,p,1),c,p,0,' + n.i + "," + n.end + ',"' + n.otag + " " + n.ctag + '")){t.rs(c,p,function(c,p,t){',
                x.walk(n.nodes, e), e.code += "});c.pop();}";
        },
        "^": function (n, e) {
            e.code += "if(!t.s(t." + r(n.n) + '("' + o(n.n) + '",c,p,1),c,p,1,0,0,"")){', x.walk(n.nodes, e),
                e.code += "};";
        },
        ">": i,
        "<": function (n, e) {
            var r = {
                partials: {},
                code: "",
                subs: {},
                inPartial: !0
            };
            x.walk(n.nodes, r);
            var t = e.partials[i(n, e)];
            t.subs = r.subs, t.partials = r.partials;
        },
        $: function (n, e) {
            var r = {
                subs: {},
                code: "",
                partials: e.partials,
                prefix: n.n
            };
            x.walk(n.nodes, r), e.subs[n.n] = r.code, e.inPartial || (e.code += 't.sub("' + o(n.n) + '",c,p,i);');
        },
        "\n": function (n, e) {
            e.code += a('"\\n"' + (n.last ? "" : " + i"));
        },
        _v: function (n, e) {
            e.code += "t.b(t.v(t." + r(n.n) + '("' + o(n.n) + '",c,p,0)));';
        },
        _t: function (n, e) {
            e.code += a('"' + o(n.text) + '"');
        },
        "{": n,
        "&": n
    }, x.walk = function (n, e) {
        for (var r, t = 0, o = n.length; t < o; t++)(r = x.codegen[n[t].tag]) && r(n[t], e);
        return e;
    }, x.parse = function (n, e, r) {
        return c(n, 0, [], (r = r || {}).sectionTags || []);
    }, x.cache = {}, x.cacheKey = function (n, e) {
        return [n, !!e.asString, !!e.disableLambda, e.delimiters, !!e.modelGet].join("||");
    }, x.compile = function (n, e) {
        e = e || {};
        var r = x.cacheKey(n, e),
            t = this.cache[r];
        if (t) {
            var o = t.partials;
            for (var i in o) delete o[i].instance;
            return t;
        }
        return t = this.generate(this.parse(this.scan(n, e.delimiters), n, e), n, e), this.cache[r] = t;
    };
}("undefined" != typeof exports ? exports : Hogan);

var templates = {};

function formMaker(n) {
    var e = {
        applicationId: window.envVariables[window.env].applicationId,
        inputClass: "sq-input",
        autoBuild: !1,
        inputStyles: [{
            fontSize: "16px",
            lineHeight: "24px",
            padding: "16px",
            placeholderColor: "#a0a0a0",
            backgroundColor: "transparent"
        }],
        callbacks: functionObject
    };
    return new SqPaymentForm(e);
}

function buildLockForm() {}

templates.modal = new Hogan.Template({
        code: function (n, e, r) {
            var t = this;
            return t.b(r = r || ""), t.b("\x3c!-- Modal --\x3e\r"), t.b("\n" + r), t.b("\r"),
                t.b("\n" + r), t.b('  <div class="modal-dialog '), t.s(t.f("large", n, e, 1), n, e, 0, 55, 63, "{{ }}") && (t.rs(n, e, function (n, e, r) {
                    r.b("modal-lg");
                }), n.pop()), t.b('" role="document">\r'), t.b("\n" + r), t.b('    <div class="modal-content">\r'),
                t.b("\n" + r), t.b("      \x3c!-- HEADER --\x3e\r"), t.b("\n" + r), t.b('      <div class="modal-header">\r'),
                t.b("\n" + r), t.b('        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\r'),
                t.b("\n" + r), t.b('        <h4 class="modal-title" id="myModalLabel">'), t.b(t.v(t.f("title", n, e, 0))),
                t.b("</h4>\r"), t.b("\n" + r), t.b("      </div>\r"), t.b("\n" + r), t.b('      <div class="modal-body" id="modal_body">'),
                t.b(t.t(t.f("body", n, e, 0))), t.b("</div>\r"), t.b("\n" + r), t.b("    </div>\r"),
                t.b("\n" + r), t.b("  </div>"), t.fl();
        },
        partials: {},
        subs: {}
    }), window.envVariables = {
        dev: {
            applicationId: "sandbox-sq0idb-ql9ntpIplhCuwt96Ccw3rQ",
            apiUrl: "https://cuklsa8e3k.execute-api.us-east-1.amazonaws.com/dev/"
        },
        prod: {}
    }, randomKey = function () {
        return nacl.util.encodeBase64(nacl.randomBytes(nacl.secretbox.keyLength));
    }, randomNonce = function (n) {
        return nacl.util.encodeBase64(nacl.randomBytes(nacl.secretbox.nonceLength));
    }, decodeKey = function (n) {
        try {
            var e = nacl.util.decodeBase64(n);
            if (e.length != nacl.secretbox.keyLength) throw new Error("Bad key length: must be " + nacl.secretbox.keyLength + " bytes");
            return e;
        } catch (n) {
            throw new Error("Failed to decode key from Base64");
        }
    }, decodeNonce = function (n) {
        try {
            var e = nacl.util.decodeBase64(n);
            if (e.length != nacl.secretbox.nonceLength) throw new Error("Bad nonce length: must be " + nacl.secretbox.nonceLength + " bytes");
            return e;
        } catch (n) {
            throw new Error("Failed to decode nonce from Base64");
        }
    }, encrypt = function (n, e, r) {
        var t, o, i;
        if ((o = decodeNonce(e)) && (t = decodeKey(n))) return i = nacl.util.decodeUTF8(r),
            nacl.util.encodeBase64(nacl.secretbox(i, o, t));
    }, decrypt = function (n, e, r) {
        var t, o, i, a;
        if ((o = decodeNonce(e)) && (t = decodeKey(n))) {
            try {
                i = nacl.util.decodeBase64(r);
            } catch (n) {
                throw new Error("Cannot decode box");
            }
            if (!1 === (a = nacl.secretbox.open(i, o, t))) throw new Error("Failed to decrypt");
            try {
                return nacl.util.encodeUTF8(a);
            } catch (n) {
                throw new Error("Cannot decode decrypted message to string");
            }
        }
    }, ezEncrypt = function (n) {
        var e = {};
        return e.key = randomKey(), e.nonce = randomNonce(), e.lookup = randomNonce(), e.msg = encrypt(e.key, e.nonce, n),
            e;
    },
    function (n, e) {
        "use strict";
        "undefined" != typeof module && module.exports ? module.exports = e() : (n.nacl || (n.nacl = {}),
            n.nacl.util = e());
    }(this, function () {
        "use strict";
        var n = {
            decodeUTF8: function (n) {
                for (var e = unescape(encodeURIComponent(n)), r = new Uint8Array(e.length), t = 0; t < e.length; t++) r[t] = e.charCodeAt(t);
                return r;
            },
            encodeUTF8: function (n) {
                for (var e = [], r = 0; r < n.length; r++) e.push(String.fromCharCode(n[r]));
                return decodeURIComponent(escape(e.join("")));
            },
            encodeBase64: function (n) {
                if ("undefined" == typeof btoa) return new Buffer(n).toString("base64");
                for (var e = [], r = n.length, t = 0; t < r; t++) e.push(String.fromCharCode(n[t]));
                return btoa(e.join(""));
            },
            decodeBase64: function (n) {
                if ("undefined" == typeof atob) return new Uint8Array(Array.prototype.slice.call(new Buffer(n, "base64"), 0));
                for (var e = atob(n), r = new Uint8Array(e.length), t = 0; t < e.length; t++) r[t] = e.charCodeAt(t);
                return r;
            }
        };
        return n;
    }),
    function (i) {
        "use strict";
        var E = function (n, e) {
                this.hi = 0 | n, this.lo = 0 | e;
            },
            d = function (n) {
                var e, r = new Float64Array(16);
                if (n)
                    for (e = 0; e < n.length; e++) r[e] = n[e];
                return r;
            },
            a = function () {
                throw new Error("no PRNG");
            },
            o = new Uint8Array(16),
            r = new Uint8Array(32);
        r[0] = 9;
        var u = d(),
            f = d([1]),
            y = d([56129, 1]),
            l = d([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]),
            h = d([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]),
            t = d([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]),
            s = d([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]),
            p = d([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);

        function w(n, e) {
            return n << e | n >>> 32 - e;
        }

        function g(n, e) {
            var r = 255 & n[e + 3];
            return (r = (r = r << 8 | 255 & n[e + 2]) << 8 | 255 & n[e + 1]) << 8 | 255 & n[e + 0];
        }

        function k(n, e) {
            var r = n[e] << 24 | n[e + 1] << 16 | n[e + 2] << 8 | n[e + 3],
                t = n[e + 4] << 24 | n[e + 5] << 16 | n[e + 6] << 8 | n[e + 7];
            return new E(r, t);
        }

        function v(n, e, r) {
            for (var t = 0; t < 4; t++) n[e + t] = 255 & r, r >>>= 8;
        }

        function S(n, e, r) {
            n[e] = r.hi >> 24 & 255, n[e + 1] = r.hi >> 16 & 255, n[e + 2] = r.hi >> 8 & 255,
                n[e + 3] = 255 & r.hi, n[e + 4] = r.lo >> 24 & 255, n[e + 5] = r.lo >> 16 & 255,
                n[e + 6] = r.lo >> 8 & 255, n[e + 7] = 255 & r.lo;
        }

        function c(n, e, r, t, o) {
            for (var i = 0, a = 0; a < o; a++) i |= n[e + a] ^ r[t + a];
            return (1 & i - 1 >>> 8) - 1;
        }

        function b(n, e, r, t) {
            return c(n, e, r, t, 16);
        }

        function m(n, e, r, t) {
            return c(n, e, r, t, 32);
        }

        function x(n, e, r, t, o) {
            for (var i, a, s = new Uint32Array(16), c = new Uint32Array(16), u = new Uint32Array(16), f = new Uint32Array(4), l = 0; l < 4; l++) c[5 * l] = g(t, 4 * l),
                c[1 + l] = g(r, 4 * l), c[6 + l] = g(e, 4 * l), c[11 + l] = g(r, 16 + 4 * l);
            for (l = 0; l < 16; l++) u[l] = c[l];
            for (l = 0; l < 20; l++) {
                for (i = 0; i < 4; i++) {
                    for (a = 0; a < 4; a++) f[a] = c[(5 * i + 4 * a) % 16];
                    for (f[1] ^= w(f[0] + f[3] | 0, 7), f[2] ^= w(f[1] + f[0] | 0, 9), f[3] ^= w(f[2] + f[1] | 0, 13),
                        f[0] ^= w(f[3] + f[2] | 0, 18), a = 0; a < 4; a++) s[4 * i + (i + a) % 4] = f[a];
                }
                for (a = 0; a < 16; a++) c[a] = s[a];
            }
            if (o) {
                for (l = 0; l < 16; l++) c[l] = c[l] + u[l] | 0;
                for (l = 0; l < 4; l++) c[5 * l] = c[5 * l] - g(t, 4 * l) | 0, c[6 + l] = c[6 + l] - g(e, 4 * l) | 0;
                for (l = 0; l < 4; l++) v(n, 4 * l, c[5 * l]), v(n, 16 + 4 * l, c[6 + l]);
            } else
                for (l = 0; l < 16; l++) v(n, 4 * l, c[l] + u[l] | 0);
        }

        function A(n, e, r, t) {
            x(n, e, r, t, !1);
        }

        function U(n, e, r, t) {
            return x(n, e, r, t, !0), 0;
        }
        var _ = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);

        function T(n, e, r, t, o, i, a) {
            var s, c, u = new Uint8Array(16),
                f = new Uint8Array(64);
            if (!o) return 0;
            for (c = 0; c < 16; c++) u[c] = 0;
            for (c = 0; c < 8; c++) u[c] = i[c];
            for (; 64 <= o;) {
                for (A(f, u, a, _), c = 0; c < 64; c++) n[e + c] = (r ? r[t + c] : 0) ^ f[c];
                for (s = 1, c = 8; c < 16; c++) s = s + (255 & u[c]) | 0, u[c] = 255 & s, s >>>= 8;
                o -= 64, e += 64, r && (t += 64);
            }
            if (0 < o)
                for (A(f, u, a, _), c = 0; c < o; c++) n[e + c] = (r ? r[t + c] : 0) ^ f[c];
            return 0;
        }

        function B(n, e, r, t, o) {
            return T(n, e, null, 0, r, t, o);
        }

        function C(n, e, r, t, o) {
            var i = new Uint8Array(32);
            return U(i, t, o, _), B(n, e, r, t.subarray(16), i);
        }

        function L(n, e, r, t, o, i, a) {
            var s = new Uint8Array(32);
            return U(s, i, a, _), T(n, e, r, t, o, i.subarray(16), s);
        }

        function K(n, e) {
            for (var r = 0, t = 0; t < 17; t++) r = r + (n[t] + e[t] | 0) | 0, n[t] = 255 & r,
                r >>>= 8;
        }
        var P = new Uint32Array([5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 252]);

        function Y(n, e, r, t, o, i) {
            for (var a, s, c, u = new Uint32Array(17), f = new Uint32Array(17), l = new Uint32Array(17), h = new Uint32Array(17), p = new Uint32Array(17), w = 0; w < 17; w++) f[w] = l[w] = 0;
            for (w = 0; w < 16; w++) f[w] = i[w];
            for (f[3] &= 15, f[4] &= 252, f[7] &= 15, f[8] &= 252, f[11] &= 15, f[12] &= 252,
                f[15] &= 15; 0 < o;) {
                for (w = 0; w < 17; w++) h[w] = 0;
                for (w = 0; w < 16 && w < o; ++w) h[w] = r[t + w];
                for (h[w] = 1, t += w, o -= w, K(l, h), s = 0; s < 17; s++)
                    for (w = u[s] = 0; w < 17; w++) u[s] = u[s] + l[w] * (w <= s ? f[s - w] : 320 * f[s + 17 - w] | 0) | 0;
                for (s = 0; s < 17; s++) l[s] = u[s];
                for (w = c = 0; w < 16; w++) c = c + l[w] | 0, l[w] = 255 & c, c >>>= 8;
                for (c = c + l[16] | 0, l[16] = 3 & c, c = 5 * (c >>> 2) | 0, w = 0; w < 16; w++) c = c + l[w] | 0,
                    l[w] = 255 & c, c >>>= 8;
                c = c + l[16] | 0, l[16] = c;
            }
            for (w = 0; w < 17; w++) p[w] = l[w];
            for (K(l, P), a = 0 | -(l[16] >>> 7), w = 0; w < 17; w++) l[w] ^= a & (p[w] ^ l[w]);
            for (w = 0; w < 16; w++) h[w] = i[w + 16];
            for (h[16] = 0, K(l, h), w = 0; w < 16; w++) n[e + w] = l[w];
            return 0;
        }

        function R(n, e, r, t, o, i) {
            var a = new Uint8Array(16);
            return Y(a, 0, r, t, o, i), b(n, e, a, 0);
        }

        function j(n, e, r, t, o) {
            var i;
            if (r < 32) return -1;
            for (L(n, 0, e, 0, r, t, o), Y(n, 16, n, 32, r - 32, n), i = 0; i < 16; i++) n[i] = 0;
            return 0;
        }

        function F(n, e, r, t, o) {
            var i, a = new Uint8Array(32);
            if (r < 32) return -1;
            if (C(a, 0, 32, t, o), 0 !== R(e, 16, e, 32, r - 32, a)) return -1;
            for (L(n, 0, e, 0, r, t, o), i = 0; i < 32; i++) n[i] = 0;
            return 0;
        }

        function O(n, e) {
            for (var r = 0; r < 16; r++) n[r] = 0 | e[r];
        }

        function z(n) {
            for (var e, r = 0; r < 16; r++) n[r] += 65536, e = Math.floor(n[r] / 65536), n[(r + 1) * (r < 15 ? 1 : 0)] += e - 1 + 37 * (e - 1) * (15 === r ? 1 : 0),
                n[r] -= 65536 * e;
        }

        function N(n, e, r) {
            for (var t, o = ~(r - 1), i = 0; i < 16; i++) t = o & (n[i] ^ e[i]), n[i] ^= t,
                e[i] ^= t;
        }

        function M(n, e) {
            for (var r, t, o = d(), i = d(), a = 0; a < 16; a++) i[a] = e[a];
            for (z(i), z(i), z(i), r = 0; r < 2; r++) {
                for (o[0] = i[0] - 65517, a = 1; a < 15; a++) o[a] = i[a] - 65535 - (o[a - 1] >> 16 & 1),
                    o[a - 1] &= 65535;
                o[15] = i[15] - 32767 - (o[14] >> 16 & 1), t = o[15] >> 16 & 1, o[14] &= 65535,
                    N(i, o, 1 - t);
            }
            for (a = 0; a < 16; a++) n[2 * a] = 255 & i[a], n[2 * a + 1] = i[a] >> 8;
        }

        function I(n, e) {
            var r = new Uint8Array(32),
                t = new Uint8Array(32);
            return M(r, n), M(t, e), m(r, 0, t, 0);
        }

        function V(n) {
            var e = new Uint8Array(32);
            return M(e, n), 1 & e[0];
        }

        function q(n, e) {
            for (var r = 0; r < 16; r++) n[r] = e[2 * r] + (e[2 * r + 1] << 8);
            n[15] &= 32767;
        }

        function G(n, e, r) {
            for (var t = 0; t < 16; t++) n[t] = e[t] + r[t] | 0;
        }

        function $(n, e, r) {
            for (var t = 0; t < 16; t++) n[t] = e[t] - r[t] | 0;
        }

        function H(n, e, r) {
            for (var t, o = new Float64Array(31), i = 0; i < 31; i++) o[i] = 0;
            for (i = 0; i < 16; i++)
                for (t = 0; t < 16; t++) o[i + t] += e[i] * r[t];
            for (i = 0; i < 15; i++) o[i] += 38 * o[i + 16];
            for (i = 0; i < 16; i++) n[i] = o[i];
            z(n), z(n);
        }

        function Z(n, e) {
            H(n, e, e);
        }

        function D(n, e) {
            for (var r = d(), t = 0; t < 16; t++) r[t] = e[t];
            for (t = 253; 0 <= t; t--) Z(r, r), 2 !== t && 4 !== t && H(r, r, e);
            for (t = 0; t < 16; t++) n[t] = r[t];
        }

        function W(n, e) {
            for (var r = d(), t = 0; t < 16; t++) r[t] = e[t];
            for (t = 250; 0 <= t; t--) Z(r, r), 1 !== t && H(r, r, e);
            for (t = 0; t < 16; t++) n[t] = r[t];
        }

        function X(n, e, r) {
            for (var t, o = new Uint8Array(32), i = new Float64Array(80), a = d(), s = d(), c = d(), u = d(), f = d(), l = d(), h = 0; h < 31; h++) o[h] = e[h];
            for (o[31] = 127 & e[31] | 64, o[0] &= 248, q(i, r), h = 0; h < 16; h++) s[h] = i[h],
                u[h] = a[h] = c[h] = 0;
            for (a[0] = u[0] = 1, h = 254; 0 <= h; --h) N(a, s, t = o[h >>> 3] >>> (7 & h) & 1),
                N(c, u, t), G(f, a, c), $(a, a, c), G(c, s, u), $(s, s, u), Z(u, f), Z(l, a), H(a, c, a),
                H(c, s, f), G(f, a, c), $(a, a, c), Z(s, a), $(c, u, l), H(a, c, y), G(a, a, u),
                H(c, c, a), H(a, u, l), H(u, s, i), Z(s, f), N(a, s, t), N(c, u, t);
            for (h = 0; h < 16; h++) i[h + 16] = a[h], i[h + 32] = c[h], i[h + 48] = s[h], i[h + 64] = u[h];
            var p = i.subarray(32),
                w = i.subarray(16);
            return D(p, p), H(w, w, p), M(n, w), 0;
        }

        function Q(n, e) {
            return X(n, e, r);
        }

        function J(n, e) {
            return a(e, 32), Q(n, e);
        }

        function nn(n, e, r) {
            var t = new Uint8Array(32);
            return X(t, r, e), U(n, o, t, _);
        }
        var en = j,
            rn = F;

        function tn() {
            for (var n, e, r = 0, t = 0, o = 0, i = 0, a = 65535, s = 0; s < arguments.length; s++) r += (n = arguments[s].lo) & a,
                t += n >>> 16, o += (e = arguments[s].hi) & a, i += e >>> 16;
            return new E((o += (t += r >>> 16) >>> 16) & a | (i += o >>> 16) << 16, r & a | t << 16);
        }

        function on(n, e) {
            return new E(n.hi >>> e, n.lo >>> e | n.hi << 32 - e);
        }

        function an() {
            for (var n = 0, e = 0, r = 0; r < arguments.length; r++) n ^= arguments[r].lo, e ^= arguments[r].hi;
            return new E(e, n);
        }

        function sn(n, e) {
            var r, t, o = 32 - e;
            return e < 32 ? (r = n.hi >>> e | n.lo << o, t = n.lo >>> e | n.hi << o) : e < 64 && (r = n.lo >>> e | n.hi << o,
                t = n.hi >>> e | n.lo << o), new E(r, t);
        }
        var cn = [new E(1116352408, 3609767458), new E(1899447441, 602891725), new E(3049323471, 3964484399), new E(3921009573, 2173295548), new E(961987163, 4081628472), new E(1508970993, 3053834265), new E(2453635748, 2937671579), new E(2870763221, 3664609560), new E(3624381080, 2734883394), new E(310598401, 1164996542), new E(607225278, 1323610764), new E(1426881987, 3590304994), new E(1925078388, 4068182383), new E(2162078206, 991336113), new E(2614888103, 633803317), new E(3248222580, 3479774868), new E(3835390401, 2666613458), new E(4022224774, 944711139), new E(264347078, 2341262773), new E(604807628, 2007800933), new E(770255983, 1495990901), new E(1249150122, 1856431235), new E(1555081692, 3175218132), new E(1996064986, 2198950837), new E(2554220882, 3999719339), new E(2821834349, 766784016), new E(2952996808, 2566594879), new E(3210313671, 3203337956), new E(3336571891, 1034457026), new E(3584528711, 2466948901), new E(113926993, 3758326383), new E(338241895, 168717936), new E(666307205, 1188179964), new E(773529912, 1546045734), new E(1294757372, 1522805485), new E(1396182291, 2643833823), new E(1695183700, 2343527390), new E(1986661051, 1014477480), new E(2177026350, 1206759142), new E(2456956037, 344077627), new E(2730485921, 1290863460), new E(2820302411, 3158454273), new E(3259730800, 3505952657), new E(3345764771, 106217008), new E(3516065817, 3606008344), new E(3600352804, 1432725776), new E(4094571909, 1467031594), new E(275423344, 851169720), new E(430227734, 3100823752), new E(506948616, 1363258195), new E(659060556, 3750685593), new E(883997877, 3785050280), new E(958139571, 3318307427), new E(1322822218, 3812723403), new E(1537002063, 2003034995), new E(1747873779, 3602036899), new E(1955562222, 1575990012), new E(2024104815, 1125592928), new E(2227730452, 2716904306), new E(2361852424, 442776044), new E(2428436474, 593698344), new E(2756734187, 3733110249), new E(3204031479, 2999351573), new E(3329325298, 3815920427), new E(3391569614, 3928383900), new E(3515267271, 566280711), new E(3940187606, 3454069534), new E(4118630271, 4000239992), new E(116418474, 1914138554), new E(174292421, 2731055270), new E(289380356, 3203993006), new E(460393269, 320620315), new E(685471733, 587496836), new E(852142971, 1086792851), new E(1017036298, 365543100), new E(1126000580, 2618297676), new E(1288033470, 3409855158), new E(1501505948, 4234509866), new E(1607167915, 987167468), new E(1816402316, 1246189591)];

        function un(n, e, r) {
            for (var t, o, i = [], a = [], s = [], c = [], u = 0; u < 8; u++) i[u] = s[u] = k(n, 8 * u);
            for (var f, l, h, p, w, d, y, g, v, b, m, x, A, U, _ = 0; 128 <= r;) {
                for (u = 0; u < 16; u++) c[u] = k(e, 8 * u + _);
                for (u = 0; u < 80; u++) {
                    for (o = 0; o < 8; o++) a[o] = s[o];
                    for (t = tn(s[7], an(sn(U = s[4], 14), sn(U, 18), sn(U, 41)), (v = s[4], b = s[5],
                            m = s[6], 0, x = v.hi & b.hi ^ ~v.hi & m.hi, A = v.lo & b.lo ^ ~v.lo & m.lo, new E(x, A)), cn[u], c[u % 16]),
                        a[7] = tn(t, an(sn(g = s[0], 28), sn(g, 34), sn(g, 39)), (h = s[0], p = s[1], w = s[2],
                            0, d = h.hi & p.hi ^ h.hi & w.hi ^ p.hi & w.hi, y = h.lo & p.lo ^ h.lo & w.lo ^ p.lo & w.lo,
                            new E(d, y))), a[3] = tn(a[3], t), o = 0; o < 8; o++) s[(o + 1) % 8] = a[o];
                    if (u % 16 == 15)
                        for (o = 0; o < 16; o++) c[o] = tn(c[o], c[(o + 9) % 16], an(sn(l = c[(o + 1) % 16], 1), sn(l, 8), on(l, 7)), an(sn(f = c[(o + 14) % 16], 19), sn(f, 61), on(f, 6)));
                }
                for (u = 0; u < 8; u++) s[u] = tn(s[u], i[u]), i[u] = s[u];
                _ += 128, r -= 128;
            }
            for (u = 0; u < 8; u++) S(n, 8 * u, i[u]);
            return r;
        }
        var fn = new Uint8Array([106, 9, 230, 103, 243, 188, 201, 8, 187, 103, 174, 133, 132, 202, 167, 59, 60, 110, 243, 114, 254, 148, 248, 43, 165, 79, 245, 58, 95, 29, 54, 241, 81, 14, 82, 127, 173, 230, 130, 209, 155, 5, 104, 140, 43, 62, 108, 31, 31, 131, 217, 171, 251, 65, 189, 107, 91, 224, 205, 25, 19, 126, 33, 121]);

        function ln(n, e, r) {
            for (var t = new Uint8Array(64), o = new Uint8Array(256), i = r, a = 0; a < 64; a++) t[a] = fn[a];
            for (un(t, e, r), r %= 128, a = 0; a < 256; a++) o[a] = 0;
            for (a = 0; a < r; a++) o[a] = e[i - r + a];
            for (o[r] = 128, o[(r = 256 - 128 * (r < 112 ? 1 : 0)) - 9] = 0, S(o, r - 8, new E(i / 536870912 | 0, i << 3)),
                un(t, o, r), a = 0; a < 64; a++) n[a] = t[a];
            return 0;
        }

        function hn(n, e) {
            var r = d(),
                t = d(),
                o = d(),
                i = d(),
                a = d(),
                s = d(),
                c = d(),
                u = d(),
                f = d();
            $(r, n[1], n[0]), $(f, e[1], e[0]), H(r, r, f), G(t, n[0], n[1]), G(f, e[0], e[1]),
                H(t, t, f), H(o, n[3], e[3]), H(o, o, h), H(i, n[2], e[2]), G(i, i, i), $(a, t, r),
                $(s, i, o), G(c, i, o), G(u, t, r), H(n[0], a, s), H(n[1], u, c), H(n[2], c, s),
                H(n[3], a, u);
        }

        function pn(n, e, r) {
            for (var t = 0; t < 4; t++) N(n[t], e[t], r);
        }

        function wn(n, e) {
            var r = d(),
                t = d(),
                o = d();
            D(o, e[2]), H(r, e[0], o), H(t, e[1], o), M(n, t), n[31] ^= V(r) << 7;
        }

        function dn(n, e, r) {
            var t, o;
            for (O(n[0], u), O(n[1], f), O(n[2], f), O(n[3], u), o = 255; 0 <= o; --o) pn(n, e, t = r[o / 8 | 0] >> (7 & o) & 1),
                hn(e, n), hn(n, n), pn(n, e, t);
        }

        function yn(n, e) {
            var r = [d(), d(), d(), d()];
            O(r[0], t), O(r[1], s), O(r[2], f), H(r[3], t, s), dn(n, r, e);
        }

        function gn(n, e, r) {
            var t, o = new Uint8Array(64),
                i = [d(), d(), d(), d()];
            for (r || a(e, 32), ln(o, e, 32), o[0] &= 248, o[31] &= 127, o[31] |= 64, yn(i, o),
                wn(n, i), t = 0; t < 32; t++) e[t + 32] = n[t];
            return 0;
        }
        var vn = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]);

        function bn(n, e) {
            for (var r, t, o, i = 63; 32 <= i; --i) {
                for (r = 0, t = i - 32, o = i - 12; t < o; ++t) e[t] += r - 16 * e[i] * vn[t - (i - 32)],
                    r = Math.floor((e[t] + 128) / 256), e[t] -= 256 * r;
                e[t] += r, e[i] = 0;
            }
            for (t = r = 0; t < 32; t++) e[t] += r - (e[31] >> 4) * vn[t], r = e[t] >> 8, e[t] &= 255;
            for (t = 0; t < 32; t++) e[t] -= r * vn[t];
            for (i = 0; i < 32; i++) e[i + 1] += e[i] >> 8, n[i] = 255 & e[i];
        }

        function mn(n) {
            for (var e = new Float64Array(64), r = 0; r < 64; r++) e[r] = n[r];
            for (r = 0; r < 64; r++) n[r] = 0;
            bn(n, e);
        }

        function xn(n, e, r, t) {
            var o, i = new Uint8Array(64),
                a = new Uint8Array(64),
                s = new Uint8Array(64),
                c = new Float64Array(64),
                u = [d(), d(), d(), d()];
            ln(i, t, 32), i[0] &= 248, i[31] &= 127, i[31] |= 64;
            for (var f = r + 64, l = 0; l < r; l++) n[64 + l] = e[l];
            for (l = 0; l < 32; l++) n[32 + l] = i[32 + l];
            for (ln(s, n.subarray(32), r + 32), mn(s), yn(u, s), wn(n, u), l = 32; l < 64; l++) n[l] = t[l];
            for (ln(a, n, r + 64), mn(a), l = 0; l < 64; l++) c[l] = 0;
            for (l = 0; l < 32; l++) c[l] = s[l];
            for (l = 0; l < 32; l++)
                for (o = 0; o < 32; o++) c[l + o] += a[l] * i[o];
            return bn(n.subarray(32), c), f;
        }

        function An(n, e, r, t) {
            var o, i = new Uint8Array(32),
                a = new Uint8Array(64),
                s = [d(), d(), d(), d()],
                c = [d(), d(), d(), d()];
            if (r < 64) return -1;
            if (function (n, e) {
                    var r = d(),
                        t = d(),
                        o = d(),
                        i = d(),
                        a = d(),
                        s = d(),
                        c = d();
                    if (O(n[2], f), q(n[1], e), Z(o, n[1]), H(i, o, l), $(o, o, n[2]), G(i, n[2], i),
                        Z(a, i), Z(s, a), H(c, s, a), H(r, c, o), H(r, r, i), W(r, r), H(r, r, o), H(r, r, i),
                        H(r, r, i), H(n[0], r, i), Z(t, n[0]), H(t, t, i), I(t, o) && H(n[0], n[0], p),
                        Z(t, n[0]), H(t, t, i), I(t, o)) return 1;
                    V(n[0]) === e[31] >> 7 && $(n[0], u, n[0]), H(n[3], n[0], n[1]);
                }(c, t)) return -1;
            for (o = 0; o < r; o++) n[o] = e[o];
            for (o = 0; o < 32; o++) n[o + 32] = t[o];
            if (ln(a, n, r), mn(a), dn(s, c, a), yn(c, e.subarray(32)), hn(s, c), wn(i, s),
                r -= 64, m(e, 0, i, 0)) {
                for (o = 0; o < r; o++) n[o] = 0;
                return -1;
            }
            for (o = 0; o < r; o++) n[o] = e[o + 64];
            return r;
        }
        var Un;

        function _n(n, e) {
            if (32 !== n.length) throw new Error("bad key size");
            if (24 !== e.length) throw new Error("bad nonce size");
        }

        function En() {
            for (var n = 0; n < arguments.length; n++)
                if (!(arguments[n] instanceof Uint8Array)) throw new TypeError("unexpected type, use Uint8Array");
        }

        function kn(n) {
            for (var e = 0; e < n.length; e++) n[e] = 0;
        }
        i.lowlevel = {
                crypto_core_hsalsa20: U,
                crypto_stream_xor: L,
                crypto_stream: C,
                crypto_stream_salsa20_xor: T,
                crypto_stream_salsa20: B,
                crypto_onetimeauth: Y,
                crypto_onetimeauth_verify: R,
                crypto_verify_16: b,
                crypto_verify_32: m,
                crypto_secretbox: j,
                crypto_secretbox_open: F,
                crypto_scalarmult: X,
                crypto_scalarmult_base: Q,
                crypto_box_beforenm: nn,
                crypto_box_afternm: en,
                crypto_box: function (n, e, r, t, o, i) {
                    var a = new Uint8Array(32);
                    return nn(a, o, i), en(n, e, r, t, a);
                },
                crypto_box_open: function (n, e, r, t, o, i) {
                    var a = new Uint8Array(32);
                    return nn(a, o, i), rn(n, e, r, t, a);
                },
                crypto_box_keypair: J,
                crypto_hash: ln,
                crypto_sign: xn,
                crypto_sign_keypair: gn,
                crypto_sign_open: An,
                crypto_secretbox_KEYBYTES: 32,
                crypto_secretbox_NONCEBYTES: 24,
                crypto_secretbox_ZEROBYTES: 32,
                crypto_secretbox_BOXZEROBYTES: 16,
                crypto_scalarmult_BYTES: 32,
                crypto_scalarmult_SCALARBYTES: 32,
                crypto_box_PUBLICKEYBYTES: 32,
                crypto_box_SECRETKEYBYTES: 32,
                crypto_box_BEFORENMBYTES: 32,
                crypto_box_NONCEBYTES: 24,
                crypto_box_ZEROBYTES: 32,
                crypto_box_BOXZEROBYTES: 16,
                crypto_sign_BYTES: 64,
                crypto_sign_PUBLICKEYBYTES: 32,
                crypto_sign_SECRETKEYBYTES: 64,
                crypto_sign_SEEDBYTES: 32,
                crypto_hash_BYTES: 64,
                gf: d,
                D: l,
                L: vn,
                pack25519: M,
                unpack25519: q,
                M: H,
                A: G,
                S: Z,
                Z: $,
                pow2523: W,
                add: hn,
                set25519: O,
                modL: bn,
                scalarmult: dn,
                scalarbase: yn
            }, i.randomBytes = function (n) {
                var e = new Uint8Array(n);
                return a(e, n), e;
            }, i.secretbox = function (n, e, r) {
                En(n, e, r), _n(r, e);
                for (var t = new Uint8Array(32 + n.length), o = new Uint8Array(t.length), i = 0; i < n.length; i++) t[i + 32] = n[i];
                return j(o, t, t.length, e, r), o.subarray(16);
            }, i.secretbox.open = function (n, e, r) {
                En(n, e, r), _n(r, e);
                for (var t = new Uint8Array(16 + n.length), o = new Uint8Array(t.length), i = 0; i < n.length; i++) t[i + 16] = n[i];
                return t.length < 32 || 0 !== F(o, t, t.length, e, r) ? null : o.subarray(32);
            }, i.secretbox.keyLength = 32, i.secretbox.nonceLength = 24, i.secretbox.overheadLength = 16,
            i.scalarMult = function (n, e) {
                if (En(n, e), 32 !== n.length) throw new Error("bad n size");
                if (32 !== e.length) throw new Error("bad p size");
                var r = new Uint8Array(32);
                return X(r, n, e), r;
            }, i.scalarMult.base = function (n) {
                if (En(n), 32 !== n.length) throw new Error("bad n size");
                var e = new Uint8Array(32);
                return Q(e, n), e;
            }, i.scalarMult.scalarLength = 32, i.scalarMult.groupElementLength = 32, i.box = function (n, e, r, t) {
                var o = i.box.before(r, t);
                return i.secretbox(n, e, o);
            }, i.box.before = function (n, e) {
                En(n, e),
                    function (n, e) {
                        if (32 !== n.length) throw new Error("bad public key size");
                        if (32 !== e.length) throw new Error("bad secret key size");
                    }(n, e);
                var r = new Uint8Array(32);
                return nn(r, n, e), r;
            }, i.box.after = i.secretbox, i.box.open = function (n, e, r, t) {
                var o = i.box.before(r, t);
                return i.secretbox.open(n, e, o);
            }, i.box.open.after = i.secretbox.open, i.box.keyPair = function () {
                var n = new Uint8Array(32),
                    e = new Uint8Array(32);
                return J(n, e), {
                    publicKey: n,
                    secretKey: e
                };
            }, i.box.keyPair.fromSecretKey = function (n) {
                if (En(n), 32 !== n.length) throw new Error("bad secret key size");
                var e = new Uint8Array(32);
                return Q(e, n), {
                    publicKey: e,
                    secretKey: new Uint8Array(n)
                };
            }, i.box.publicKeyLength = 32, i.box.secretKeyLength = 32, i.box.sharedKeyLength = 32,
            i.box.nonceLength = 24, i.box.overheadLength = i.secretbox.overheadLength, i.sign = function (n, e) {
                if (En(n, e), 64 !== e.length) throw new Error("bad secret key size");
                var r = new Uint8Array(64 + n.length);
                return xn(r, n, n.length, e), r;
            }, i.sign.open = function (n, e) {
                if (En(n, e), 32 !== e.length) throw new Error("bad public key size");
                var r = new Uint8Array(n.length),
                    t = An(r, n, n.length, e);
                if (t < 0) return null;
                for (var o = new Uint8Array(t), i = 0; i < o.length; i++) o[i] = r[i];
                return o;
            }, i.sign.detached = function (n, e) {
                for (var r = i.sign(n, e), t = new Uint8Array(64), o = 0; o < t.length; o++) t[o] = r[o];
                return t;
            }, i.sign.detached.verify = function (n, e, r) {
                if (En(n, e, r), 64 !== e.length) throw new Error("bad signature size");
                if (32 !== r.length) throw new Error("bad public key size");
                for (var t = new Uint8Array(64 + n.length), o = new Uint8Array(64 + n.length), i = 0; i < 64; i++) t[i] = e[i];
                for (i = 0; i < n.length; i++) t[i + 64] = n[i];
                return 0 <= An(o, t, t.length, r);
            }, i.sign.keyPair = function () {
                var n = new Uint8Array(32),
                    e = new Uint8Array(64);
                return gn(n, e), {
                    publicKey: n,
                    secretKey: e
                };
            }, i.sign.keyPair.fromSecretKey = function (n) {
                if (En(n), 64 !== n.length) throw new Error("bad secret key size");
                for (var e = new Uint8Array(32), r = 0; r < e.length; r++) e[r] = n[32 + r];
                return {
                    publicKey: e,
                    secretKey: new Uint8Array(n)
                };
            }, i.sign.keyPair.fromSeed = function (n) {
                if (En(n), 32 !== n.length) throw new Error("bad seed size");
                for (var e = new Uint8Array(32), r = new Uint8Array(64), t = 0; t < 32; t++) r[t] = n[t];
                return gn(e, r, !0), {
                    publicKey: e,
                    secretKey: r
                };
            }, i.sign.publicKeyLength = 32, i.sign.secretKeyLength = 64, i.sign.seedLength = 32,
            i.sign.signatureLength = 64, i.hash = function (n) {
                En(n);
                var e = new Uint8Array(64);
                return ln(e, n, n.length), e;
            }, i.hash.hashLength = 64, i.verify = function (n, e) {
                return En(n, e), 0 !== n.length && 0 !== e.length && (n.length === e.length && 0 === c(n, 0, e, 0, n.length));
            }, i.setPRNG = function (n) {
                a = n;
            }, (Un = "undefined" != typeof self ? self.crypto || self.msCrypto : null) && Un.getRandomValues ? i.setPRNG(function (n, e) {
                for (var r = new Uint8Array(e), t = 0; t < e; t += 65536) Un.getRandomValues(r.subarray(t, t + Math.min(e - t, 65536)));
                for (t = 0; t < e; t++) n[t] = r[t];
                kn(r);
            }) : "undefined" != typeof require && (Un = require("crypto")) && Un.randomBytes && i.setPRNG(function (n, e) {
                for (var r = Un.randomBytes(e), t = 0; t < e; t++) n[t] = r[t];
                kn(r);
            });
    }("undefined" != typeof module && module.exports ? module.exports : self.nacl = self.nacl || {}),
    function (n, e) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (n = n || self).Mustache = e();
    }(this, function () {
        "use strict";
        var e = Object.prototype.toString,
            _ = Array.isArray || function (n) {
                return "[object Array]" === e.call(n);
            };

        function f(n) {
            return "function" == typeof n;
        }

        function E(n) {
            return n.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
        }

        function l(n, e) {
            return null != n && "object" == typeof n && e in n;
        }
        var t = RegExp.prototype.test;
        var o = /\S/;

        function k(n) {
            return e = o, r = n, !t.call(e, r);
            var e, r;
        }
        var r = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
            "/": "&#x2F;",
            "`": "&#x60;",
            "=": "&#x3D;"
        };
        var S = /\s*/,
            T = /\s+/,
            B = /\s*=/,
            C = /\s*\}/,
            L = /#|\^|\/|>|\{|&|=|!/;

        function a(n, e) {
            if (!n) return [];
            var r, t, o, i = !1,
                a = [],
                s = [],
                c = [],
                u = !1,
                f = !1,
                l = "",
                h = 0;

            function p() {
                if (u && !f)
                    for (; c.length;) delete s[c.pop()];
                else c = [];
                f = u = !1;
            }

            function w(n) {
                if ("string" == typeof n && (n = n.split(T, 2)), !_(n) || 2 !== n.length) throw new Error("Invalid tags: " + n);
                r = new RegExp(E(n[0]) + "\\s*"), t = new RegExp("\\s*" + E(n[1])), o = new RegExp("\\s*" + E("}" + n[1]));
            }
            w(e || P.tags);
            for (var d, y, g, v, b, m, x = new K(n); !x.eos();) {
                if (d = x.pos, g = x.scanUntil(r))
                    for (var A = 0, U = g.length; A < U; ++A) k(v = g.charAt(A)) ? (c.push(s.length),
                        l += v) : (i = f = !0, l += " "), s.push(["text", v, d, d + 1]), d += 1, "\n" === v && (p(),
                        l = "", h = 0, i = !1);
                if (!x.scan(r)) break;
                if (u = !0, y = x.scan(L) || "name", x.scan(S), "=" === y ? (g = x.scanUntil(B),
                        x.scan(B), x.scanUntil(t)) : "{" === y ? (g = x.scanUntil(o), x.scan(C), x.scanUntil(t),
                        y = "&") : g = x.scanUntil(t), !x.scan(t)) throw new Error("Unclosed tag at " + x.pos);
                if (b = ">" == y ? [y, g, d, x.pos, l, h, i] : [y, g, d, x.pos], h++, s.push(b),
                    "#" === y || "^" === y) a.push(b);
                else if ("/" === y) {
                    if (!(m = a.pop())) throw new Error('Unopened section "' + g + '" at ' + d);
                    if (m[1] !== g) throw new Error('Unclosed section "' + m[1] + '" at ' + d);
                } else "name" === y || "{" === y || "&" === y ? f = !0 : "=" === y && w(g);
            }
            if (p(), m = a.pop()) throw new Error('Unclosed section "' + m[1] + '" at ' + x.pos);
            return function (n) {
                for (var e, r = [], t = r, o = [], i = 0, a = n.length; i < a; ++i) switch ((e = n[i])[0]) {
                case "#":
                case "^":
                    t.push(e), o.push(e), t = e[4] = [];
                    break;

                case "/":
                    o.pop()[5] = e[2], t = 0 < o.length ? o[o.length - 1][4] : r;
                    break;

                default:
                    t.push(e);
                }
                return r;
            }(function (n) {
                for (var e, r, t = [], o = 0, i = n.length; o < i; ++o)(e = n[o]) && ("text" === e[0] && r && "text" === r[0] ? (r[1] += e[1],
                    r[3] = e[3]) : (t.push(e), r = e));
                return t;
            }(s));
        }

        function K(n) {
            this.string = n, this.tail = n, this.pos = 0;
        }

        function s(n, e) {
            this.view = n, this.cache = {
                ".": this.view
            }, this.parent = e;
        }

        function n() {
            this.templateCache = {
                _cache: {},
                set: function (n, e) {
                    this._cache[n] = e;
                },
                get: function (n) {
                    return this._cache[n];
                },
                clear: function () {
                    this._cache = {};
                }
            };
        }
        K.prototype.eos = function () {
            return "" === this.tail;
        }, K.prototype.scan = function (n) {
            var e = this.tail.match(n);
            if (!e || 0 !== e.index) return "";
            var r = e[0];
            return this.tail = this.tail.substring(r.length), this.pos += r.length, r;
        }, K.prototype.scanUntil = function (n) {
            var e, r = this.tail.search(n);
            switch (r) {
            case -1:
                e = this.tail, this.tail = "";
                break;

            case 0:
                e = "";
                break;

            default:
                e = this.tail.substring(0, r), this.tail = this.tail.substring(r);
            }
            return this.pos += e.length, e;
        }, s.prototype.push = function (n) {
            return new s(n, this);
        }, s.prototype.lookup = function (n) {
            var e, r, t, o = this.cache;
            if (o.hasOwnProperty(n)) e = o[n];
            else {
                for (var i, a, s, c = this, u = !1; c;) {
                    if (0 < n.indexOf("."))
                        for (i = c.view, a = n.split("."), s = 0; null != i && s < a.length;) s === a.length - 1 && (u = l(i, a[s]) || (r = i,
                                t = a[s], null != r && "object" != typeof r && r.hasOwnProperty && r.hasOwnProperty(t))),
                            i = i[a[s++]];
                    else i = c.view[n], u = l(c.view, n);
                    if (u) {
                        e = i;
                        break;
                    }
                    c = c.parent;
                }
                o[n] = e;
            }
            return f(e) && (e = e.call(this.view)), e;
        }, n.prototype.clearCache = function () {
            void 0 !== this.templateCache && this.templateCache.clear();
        }, n.prototype.parse = function (n, e) {
            var r = this.templateCache,
                t = n + ":" + (e || P.tags).join(":"),
                o = void 0 !== r,
                i = o ? r.get(t) : void 0;
            return null == i && (i = a(n, e), o && r.set(t, i)), i;
        }, n.prototype.render = function (n, e, r, t) {
            var o = this.parse(n, t),
                i = e instanceof s ? e : new s(e, void 0);
            return this.renderTokens(o, i, r, n, t);
        }, n.prototype.renderTokens = function (n, e, r, t, o) {
            for (var i, a, s, c = "", u = 0, f = n.length; u < f; ++u) s = void 0, "#" === (a = (i = n[u])[0]) ? s = this.renderSection(i, e, r, t) : "^" === a ? s = this.renderInverted(i, e, r, t) : ">" === a ? s = this.renderPartial(i, e, r, o) : "&" === a ? s = this.unescapedValue(i, e) : "name" === a ? s = this.escapedValue(i, e) : "text" === a && (s = this.rawValue(i)),
                void 0 !== s && (c += s);
            return c;
        }, n.prototype.renderSection = function (n, e, r, t) {
            var o = this,
                i = "",
                a = e.lookup(n[1]);
            if (a) {
                if (_(a))
                    for (var s = 0, c = a.length; s < c; ++s) i += this.renderTokens(n[4], e.push(a[s]), r, t);
                else if ("object" == typeof a || "string" == typeof a || "number" == typeof a) i += this.renderTokens(n[4], e.push(a), r, t);
                else if (f(a)) {
                    if ("string" != typeof t) throw new Error("Cannot use higher-order sections without the original template");
                    null != (a = a.call(e.view, t.slice(n[3], n[5]), function (n) {
                        return o.render(n, e, r);
                    })) && (i += a);
                } else i += this.renderTokens(n[4], e, r, t);
                return i;
            }
        }, n.prototype.renderInverted = function (n, e, r, t) {
            var o = e.lookup(n[1]);
            if (!o || _(o) && 0 === o.length) return this.renderTokens(n[4], e, r, t);
        }, n.prototype.indentPartial = function (n, e, r) {
            for (var t = e.replace(/[^ \t]/g, ""), o = n.split("\n"), i = 0; i < o.length; i++) o[i].length && (0 < i || !r) && (o[i] = t + o[i]);
            return o.join("\n");
        }, n.prototype.renderPartial = function (n, e, r, t) {
            if (r) {
                var o = f(r) ? r(n[1]) : r[n[1]];
                if (null != o) {
                    var i = n[6],
                        a = n[5],
                        s = n[4],
                        c = o;
                    return 0 == a && s && (c = this.indentPartial(o, s, i)), this.renderTokens(this.parse(c, t), e, r, c, t);
                }
            }
        }, n.prototype.unescapedValue = function (n, e) {
            var r = e.lookup(n[1]);
            if (null != r) return r;
        }, n.prototype.escapedValue = function (n, e) {
            var r = e.lookup(n[1]);
            if (null != r) return "number" == typeof r ? String(r) : P.escape(r);
        }, n.prototype.rawValue = function (n) {
            return n[1];
        };
        var P = {
                name: "mustache.js",
                version: "4.0.1",
                tags: ["{{", "}}"],
                clearCache: void 0,
                escape: void 0,
                parse: void 0,
                render: void 0,
                Scanner: void 0,
                Context: void 0,
                Writer: void 0,
                set templateCache(n) {
                    i.templateCache = n;
                },
                get templateCache() {
                    return i.templateCache;
                }
            },
            i = new n();
        return P.clearCache = function () {
            return i.clearCache();
        }, P.parse = function (n, e) {
            return i.parse(n, e);
        }, P.render = function (n, e, r, t) {
            if ("string" != typeof n) throw new TypeError('Invalid template! Template should be a "string" but "' + (_(o = n) ? "array" : typeof o) + '" was given as the first argument for mustache#render(template, view, partials)');
            var o;
            return i.render(n, e, r, t);
        }, P.escape = function (n) {
            return String(n).replace(/[&<>"'`=\/]/g, function (n) {
                return r[n];
            });
        }, P.Scanner = K, P.Context = s, P.Writer = n, P;
    });
//# sourceMappingURL=output.big.js.map
