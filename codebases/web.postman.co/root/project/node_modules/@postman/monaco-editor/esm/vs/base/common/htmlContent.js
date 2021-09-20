/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { equals } from './arrays.js';
import { escapeCodicons } from './codicons.js';
var MarkdownString = /** @class */ (function () {
    function MarkdownString(_value, isTrustedOrOptions) {
        if (_value === void 0) { _value = ''; }
        if (isTrustedOrOptions === void 0) { isTrustedOrOptions = false; }
        var _a, _b;
        this._value = _value;
        if (typeof isTrustedOrOptions === 'boolean') {
            this._isTrusted = isTrustedOrOptions;
            this._supportThemeIcons = false;
        }
        else {
            this._isTrusted = (_a = isTrustedOrOptions.isTrusted) !== null && _a !== void 0 ? _a : false;
            this._supportThemeIcons = (_b = isTrustedOrOptions.supportThemeIcons) !== null && _b !== void 0 ? _b : false;
        }
    }
    Object.defineProperty(MarkdownString.prototype, "value", {
        get: function () { return this._value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkdownString.prototype, "isTrusted", {
        get: function () { return this._isTrusted; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkdownString.prototype, "supportThemeIcons", {
        get: function () { return this._supportThemeIcons; },
        enumerable: true,
        configurable: true
    });
    MarkdownString.prototype.appendText = function (value) {
        // escape markdown syntax tokens: http://daringfireball.net/projects/markdown/syntax#backslash
        this._value += (this._supportThemeIcons ? escapeCodicons(value) : value)
            .replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&')
            .replace('\n', '\n\n');
        return this;
    };
    MarkdownString.prototype.appendMarkdown = function (value) {
        this._value += value;
        return this;
    };
    MarkdownString.prototype.appendCodeblock = function (langId, code) {
        this._value += '\n```';
        this._value += langId;
        this._value += '\n';
        this._value += code;
        this._value += '\n```\n';
        return this;
    };
    return MarkdownString;
}());
export { MarkdownString };
export function isEmptyMarkdownString(oneOrMany) {
    if (isMarkdownString(oneOrMany)) {
        return !oneOrMany.value;
    }
    else if (Array.isArray(oneOrMany)) {
        return oneOrMany.every(isEmptyMarkdownString);
    }
    else {
        return true;
    }
}
export function isMarkdownString(thing) {
    if (thing instanceof MarkdownString) {
        return true;
    }
    else if (thing && typeof thing === 'object') {
        return typeof thing.value === 'string'
            && (typeof thing.isTrusted === 'boolean' || thing.isTrusted === undefined)
            && (typeof thing.supportThemeIcons === 'boolean' || thing.supportThemeIcons === undefined);
    }
    return false;
}
export function markedStringsEquals(a, b) {
    if (!a && !b) {
        return true;
    }
    else if (!a || !b) {
        return false;
    }
    else if (Array.isArray(a) && Array.isArray(b)) {
        return equals(a, b, markdownStringEqual);
    }
    else if (isMarkdownString(a) && isMarkdownString(b)) {
        return markdownStringEqual(a, b);
    }
    else {
        return false;
    }
}
function markdownStringEqual(a, b) {
    if (a === b) {
        return true;
    }
    else if (!a || !b) {
        return false;
    }
    else {
        return a.value === b.value && a.isTrusted === b.isTrusted && a.supportThemeIcons === b.supportThemeIcons;
    }
}
export function removeMarkdownEscapes(text) {
    if (!text) {
        return text;
    }
    return text.replace(/\\([\\`*_{}[\]()#+\-.!])/g, '$1');
}
export function parseHrefAndDimensions(href) {
    var dimensions = [];
    var splitted = href.split('|').map(function (s) { return s.trim(); });
    href = splitted[0];
    var parameters = splitted[1];
    if (parameters) {
        var heightFromParams = /height=(\d+)/.exec(parameters);
        var widthFromParams = /width=(\d+)/.exec(parameters);
        var height = heightFromParams ? heightFromParams[1] : '';
        var width = widthFromParams ? widthFromParams[1] : '';
        var widthIsFinite = isFinite(parseInt(width));
        var heightIsFinite = isFinite(parseInt(height));
        if (widthIsFinite) {
            dimensions.push("width=\"" + width + "\"");
        }
        if (heightIsFinite) {
            dimensions.push("height=\"" + height + "\"");
        }
    }
    return { href: href, dimensions: dimensions };
}
