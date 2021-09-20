/* eslint-disable */

/*! modernizr 3.7.1 (Custom Build) | MIT *
 * https://modernizr.com/download/?-cookies-cors-es6object-fetch-history-json-localstorage-video-websockets-setclasses !*/
!(function(e, n, o) {
    function t(e, n) {
        return typeof e === n;
    }

    function a() {
        return typeof n.createElement !== 'function' ?
            n.createElement(arguments[0]) :
            l ?
            n.createElementNS.call(n, 'http://www.w3.org/2000/svg', arguments[0]) :
            n.createElement.apply(n, arguments);
    }
    var s = [],
        i = {
            _version: '3.7.1',
            _config: {
                classPrefix: '',
                enableClasses: !0,
                enableJSClass: !0,
                usePrefixes: !0,
            },
            _q: [],
            on: function(e, n) {
                var o = this;
                setTimeout(function() {
                    n(o[e]);
                }, 0);
            },
            addTest: function(e, n, o) {
                s.push({
                    name: e,
                    fn: n,
                    options: o
                });
            },
            addAsyncTest: function(e) {
                s.push({
                    name: null,
                    fn: e
                });
            },
        },
        Modernizr = function() {};
    (Modernizr.prototype = i), (Modernizr = new Modernizr());
    var c = [],
        r = n.documentElement,
        l = r.nodeName.toLowerCase() === 'svg';
    Modernizr.addTest('cookies', function() {
            try {
                n.cookie = 'cookietest=1';
                var e = n.cookie.indexOf('cookietest=') !== -1;
                return (
                    (n.cookie = 'cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT'), e
                );
            } catch (e) {
                return !1;
            }
        }),
        Modernizr.addTest(
            'cors',
            'XMLHttpRequest' in e && 'withCredentials' in new XMLHttpRequest()
        ),
        Modernizr.addTest('history', function() {
            var n = navigator.userAgent;
            return (
                ((n.indexOf('Android 2.') === -1 && n.indexOf('Android 4.0') === -1) ||
                    n.indexOf('Mobile Safari') === -1 ||
                    n.indexOf('Chrome') !== -1 ||
                    n.indexOf('Windows Phone') !== -1 ||
                    location.protocol === 'file:') &&
                e.history &&
                'pushState' in e.history
            );
        }),
        Modernizr.addTest(
            'json',
            'JSON' in e && 'parse' in JSON && 'stringify' in JSON
        ),
        Modernizr.addTest('video', function() {
            var e = a('video'),
                n = !1;
            try {
                (n = !!e.canPlayType),
                n &&
                    ((n = new Boolean(n)),
                        (n.ogg = e
                            .canPlayType('video/ogg; codecs="theora"')
                            .replace(/^no$/, '')),
                        (n.h264 = e
                            .canPlayType('video/mp4; codecs="avc1.42E01E"')
                            .replace(/^no$/, '')),
                        (n.webm = e
                            .canPlayType('video/webm; codecs="vp8, vorbis"')
                            .replace(/^no$/, '')),
                        (n.vp9 = e
                            .canPlayType('video/webm; codecs="vp9"')
                            .replace(/^no$/, '')),
                        (n.hls = e
                            .canPlayType('application/x-mpegURL; codecs="avc1.42E01E"')
                            .replace(/^no$/, '')));
            } catch (e) {}
            return n;
        });
    var d = !1;
    try {
        d = 'WebSocket' in e && e.WebSocket.CLOSING === 2;
    } catch (e) {}
    Modernizr.addTest('websockets', d),
        Modernizr.addTest(
            'es6object', !!(Object.assign && Object.is && Object.setPrototypeOf)
        ),
        Modernizr.addTest('fetch', 'fetch' in e),
        Modernizr.addTest('localstorage', function() {
            var e = 'modernizr';
            try {
                return localStorage.setItem(e, e), localStorage.removeItem(e), !0;
            } catch (e) {
                return !1;
            }
        }),
        (function() {
            var e, n, o, a, i, r, l;
            for (var d in s)
                if (s.hasOwnProperty(d)) {
                    if (
                        ((e = []),
                            (n = s[d]),
                            n.name &&
                            (e.push(n.name.toLowerCase()),
                                n.options && n.options.aliases && n.options.aliases.length))
                    )
                        for (o = 0; o < n.options.aliases.length; o++)
                            e.push(n.options.aliases[o].toLowerCase());
                    for (
                        a = t(n.fn, 'function') ? n.fn() : n.fn, i = 0; i < e.length; i++
                    )
                        (r = e[i]),
                        (l = r.split('.')),
                        l.length === 1 ?
                        (Modernizr[l[0]] = a) :
                        (!Modernizr[l[0]] ||
                            Modernizr[l[0]] instanceof Boolean ||
                            (Modernizr[l[0]] = new Boolean(Modernizr[l[0]])),
                            (Modernizr[l[0]][l[1]] = a)),
                        c.push((a ? '' : 'no-') + l.join('-'));
                }
        })(),
        (function(e) {
            var n = r.className,
                o = Modernizr._config.classPrefix || '';
            if ((l && (n = n.baseVal), Modernizr._config.enableJSClass)) {
                var t = new RegExp('(^|\\s)' + o + 'no-js(\\s|$)');
                n = n.replace(t, '$1' + o + 'js$2');
            }
            Modernizr._config.enableClasses &&
                (e.length > 0 && (n += ' ' + o + e.join(' ' + o)),
                    l ? (r.className.baseVal = n) : (r.className = n));
        })(c),
        delete i.addTest,
        delete i.addAsyncTest;
    for (var f = 0; f < Modernizr._q.length; f++) Modernizr._q[f]();
    e.Modernizr = Modernizr;
})(window, document);