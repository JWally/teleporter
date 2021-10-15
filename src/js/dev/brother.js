var templates = {};
/* global Hogan */
/* jshint ignore:start */
templates['herp'] = new Hogan.Template({
    code: function (c, p, i) {
        var t = this;
        t.b(i = i || "");
        t.b("<div>\r");
        t.b("\n" + i);
        t.b("    <p>Hello Twitter World!</p>\r");
        t.b("\n" + i);
        t.b("</div>");
        return t.fl();
    },
    partials: {},
    subs: {}
});
/* jshint ignore:end */
