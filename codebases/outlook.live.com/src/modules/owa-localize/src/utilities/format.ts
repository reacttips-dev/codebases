import { getCurrentCulture } from '../selectors/getCurrentCulture';

export function format(formatString: string, ...args: any[]): string {
    return (<any>String)._toFormattedString(!1, [formatString, ...args]);
}

/* from MSAjax */
(<any>String)._toFormattedString = function (n: boolean, t: any) {
    const userCulture = getCurrentCulture() || 'en-US';
    for (var u = '', e = t[0], i = 0; ; ) {
        var o = e.indexOf('{', i);
        var f = e.indexOf('}', i);

        if (o < 0 && f < 0) {
            u += e.slice(i);
            break;
        }
        if (f > 0 && (f < o || o < 0)) {
            u += e.slice(i, f + 1);
            i = f + 2;
            continue;
        }
        u += e.slice(i, o);
        i = o + 1;
        if (e.charAt(i) === '{') {
            u += '{';
            i++;
            continue;
        }
        if (f < 0) {
            break;
        }
        var s = e.substring(i, f);
        var h = s.indexOf(':');
        var l = parseInt(h < 0 ? s : s.substring(0, h), 10) + 1;
        var c = h < 0 ? '' : s.substring(h + 1);
        var r = t[l];

        if (typeof r === 'undefined' || r === null) {
            r = '';
        }

        u += r.toFormattedString
            ? r.toFormattedString(c)
            : n && r.localeFormat
            ? r.localeFormat(c)
            : r.format
            ? r.format(c)
            : r.toLocaleString(userCulture);
        i = f + 1;
    }

    return u;
};
