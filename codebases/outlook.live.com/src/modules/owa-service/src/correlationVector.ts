// Correlation vector implementation - this is a port of the Asimov implementation
// to support distributed tracing.
// The source code of the library is here: https://az725175.vo.msecnd.net/scripts/jsll-4.2.1.debug.js
// More info on this distributed tracing implementation is here: https://osgwiki.com/wiki/Correlated_IFx#How_do_teams_Onboard.3F
export const correlationVectorHeaderName = 'MS-CV';
const base64CharSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const correlationVectorConstants = {
    maxCorrelationVectorLength: 127,
    baseLength: 22,
    validationPattern: new RegExp('^[' + base64CharSet + ']{22}(.[0-9]+)+$'),
};

var base = '';
var currentElement = 0;

function storedValue() {
    return base.concat('.', currentElement.toString());
}

function getValue() {
    var value = storedValue();
    if (isCorrelationVectorValid(value)) {
        return value;
    }
    return '';
}

function canIncrement() {
    let value = storedValue();
    if (isCorrelationVectorValid(value)) {
        return isLeqThanMaxCorrelationVectorLength(
            base.length + 1 + (currentElement + 1 + '').length
        );
    }
    return false;
}

function seed() {
    var result = '';
    for (var i = 0; i < correlationVectorConstants.baseLength; i++) {
        result += base64CharSet.charAt(Math.floor(Math.random() * base64CharSet.length));
    }
    return result;
}

function increment() {
    if (canIncrement()) {
        currentElement = currentElement + 1;
        return storedValue();
    }
    return null;
}

function isLeqThanMaxCorrelationVectorLength(length: Number) {
    return length <= correlationVectorConstants.maxCorrelationVectorLength;
}

export function isCorrelationVectorValid(value: string) {
    return (
        correlationVectorConstants.validationPattern.test(value) &&
        value.length <= correlationVectorConstants.maxCorrelationVectorLength
    );
}

export function getCorrelationVector() {
    if (!isCorrelationVectorValid(storedValue())) {
        base = seed();
        currentElement = 0;
        return getValue();
    }

    return increment();
}
