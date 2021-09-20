import React from 'react';

export function isDOMTypeElement(element) {
    return React.isValidElement(element) && typeof element.type === 'string';
}

var marginRE = /^-?\d*\.?\d+(px|%)$/;

export function parseRootMargin(rootMargin) {
    var marginString = rootMargin ? rootMargin.trim() : '0px';

    var _marginString$split$m = marginString.split(/\s+/).map(function (margin) {
        if (!marginRE.test(margin)) {
            throw new Error('rootMargin must be a string literal containing pixels and/or percent values');
        }
        return margin;
    }),
        _marginString$split$m2 = _marginString$split$m[0],
        m0 = _marginString$split$m2 === undefined ? '0px' : _marginString$split$m2,
        _marginString$split$m3 = _marginString$split$m[1],
        m1 = _marginString$split$m3 === undefined ? m0 : _marginString$split$m3,
        _marginString$split$m4 = _marginString$split$m[2],
        m2 = _marginString$split$m4 === undefined ? m0 : _marginString$split$m4,
        _marginString$split$m5 = _marginString$split$m[3],
        m3 = _marginString$split$m5 === undefined ? m1 : _marginString$split$m5;

    return m0 + ' ' + m1 + ' ' + m2 + ' ' + m3;
}

export function shallowCompare(next, prev) {
    if (Array.isArray(next) && Array.isArray(prev)) {
        if (next.length === prev.length) {
            return next.some(function (_, index) {
                return shallowCompare(next[index], prev[index]);
            });
        }
    }
    return next !== prev;
}