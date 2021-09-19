/*!
 * Copyright (c) 2017 Benjamin Van Ryseghem<benjamin@vanryseghem.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const globalState = require("./globalState");
const validating = require("./validating");
const parsing = require("./parsing");

const binarySuffixes = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
const decimalSuffixes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
const bytes = {
    general: {scale: 1024, suffixes: decimalSuffixes, marker: "bd"},
    binary: {scale: 1024, suffixes: binarySuffixes, marker: "b"},
    decimal: {scale: 1000, suffixes: decimalSuffixes, marker: "d"}
};

const defaultOptions = {
    totalLength: 0,
    characteristic: 0,
    forceAverage: false,
    average: false,
    mantissa: -1,
    optionalMantissa: true,
    thousandSeparated: false,
    spaceSeparated: false,
    negative: "sign",
    forceSign: false,
    roundingFunction: Math.round
};

/**
 * Entry point. Format the provided INSTANCE according to the PROVIDEDFORMAT.
 * This method ensure the prefix and postfix are added as the last step.
 *
 * @param {Numbro} instance - numbro instance to format
 * @param {NumbroFormat|string} [providedFormat] - specification for formatting
 * @param numbro - the numbro singleton
 * @return {string}
 */
function format(instance, providedFormat = {}, numbro) {
    if (typeof providedFormat === "string") {
        providedFormat = parsing.parseFormat(providedFormat);
    }

    let valid = validating.validateFormat(providedFormat);

    if (!valid) {
        return "ERROR: invalid format";
    }

    let prefix = providedFormat.prefix || "";
    let postfix = providedFormat.postfix || "";

    let output = formatNumbro(instance, providedFormat, numbro);
    output = insertPrefix(output, prefix);
    output = insertPostfix(output, postfix);
    return output;
}

/**
 * Format the provided INSTANCE according to the PROVIDEDFORMAT.
 *
 * @param {Numbro} instance - numbro instance to format
 * @param {{}} providedFormat - specification for formatting
 * @param numbro - the numbro singleton
 * @return {string}
 */
function formatNumbro(instance, providedFormat, numbro) {
    switch (providedFormat.output) {
        case "currency": {
            providedFormat = formatOrDefault(providedFormat, globalState.currentCurrencyDefaultFormat());
            return formatCurrency(instance, providedFormat, globalState, numbro);
        }
        case "percent": {
            providedFormat = formatOrDefault(providedFormat, globalState.currentPercentageDefaultFormat());
            return formatPercentage(instance, providedFormat, globalState, numbro);
        }
        case "byte":
            providedFormat = formatOrDefault(providedFormat, globalState.currentByteDefaultFormat());
            return formatByte(instance, providedFormat, globalState, numbro);
        case "time":
            providedFormat = formatOrDefault(providedFormat, globalState.currentTimeDefaultFormat());
            return formatTime(instance, providedFormat, globalState, numbro);
        case "ordinal":
            providedFormat = formatOrDefault(providedFormat, globalState.currentOrdinalDefaultFormat());
            return formatOrdinal(instance, providedFormat, globalState, numbro);
        case "number":
        default:
            return formatNumber({
                instance,
                providedFormat,
                numbro
            });
    }
}

/**
 * Get the decimal byte unit (MB) for the provided numbro INSTANCE.
 * We go from one unit to another using the decimal system (1000).
 *
 * @param {Numbro} instance - numbro instance to compute
 * @return {String}
 */
function getDecimalByteUnit(instance) {
    let data = bytes.decimal;
    return getFormatByteUnits(instance._value, data.suffixes, data.scale).suffix;
}

/**
 * Get the binary byte unit (MiB) for the provided numbro INSTANCE.
 * We go from one unit to another using the decimal system (1024).
 *
 * @param {Numbro} instance - numbro instance to compute
 * @return {String}
 */
function getBinaryByteUnit(instance) {
    let data = bytes.binary;
    return getFormatByteUnits(instance._value, data.suffixes, data.scale).suffix;
}

/**
 * Get the decimal byte unit (MB) for the provided numbro INSTANCE.
 * We go from one unit to another using the decimal system (1024).
 *
 * @param {Numbro} instance - numbro instance to compute
 * @return {String}
 */
function getByteUnit(instance) {
    let data = bytes.general;
    return getFormatByteUnits(instance._value, data.suffixes, data.scale).suffix;
}

/**
 * Return the value and the suffix computed in byte.
 * It uses the SUFFIXES and the SCALE provided.
 *
 * @param {number} value - Number to format
 * @param {[String]} suffixes - List of suffixes
 * @param {number} scale - Number in-between two units
 * @return {{value: Number, suffix: String}}
 */
function getFormatByteUnits(value, suffixes, scale) {
    let suffix = suffixes[0];
    let abs = Math.abs(value);

    if (abs >= scale) {
        for (let power = 1; power < suffixes.length; ++power) {
            let min = Math.pow(scale, power);
            let max = Math.pow(scale, power + 1);

            if (abs >= min && abs < max) {
                suffix = suffixes[power];
                value = value / min;
                break;
            }
        }

        // values greater than or equal to [scale] YB never set the suffix
        if (suffix === suffixes[0]) {
            value = value / Math.pow(scale, suffixes.length - 1);
            suffix = suffixes[suffixes.length - 1];
        }
    }

    return {value, suffix};
}

/**
 * Format the provided INSTANCE as bytes using the PROVIDEDFORMAT, and STATE.
 *
 * @param {Numbro} instance - numbro instance to format
 * @param {{}} providedFormat - specification for formatting
 * @param {globalState} state - shared state of the library
 * @param numbro - the numbro singleton
 * @return {string}
 */
function formatByte(instance, providedFormat, state, numbro) {
    let base = providedFormat.base || "binary";
    let baseInfo = bytes[base];

    let {value, suffix} = getFormatByteUnits(instance._value, baseInfo.suffixes, baseInfo.scale);
    let output = formatNumber({
        instance: numbro(value),
        providedFormat,
        state,
        defaults: state.currentByteDefaultFormat()
    });
    let abbreviations = state.currentAbbreviations();
    return `${output}${abbreviations.spaced ? " " : ""}${suffix}`;
}

/**
 * Format the provided INSTANCE as an ordinal using the PROVIDEDFORMAT,
 * and the STATE.
 *
 * @param {Numbro} instance - numbro instance to format
 * @param {{}} providedFormat - specification for formatting
 * @param {globalState} state - shared state of the library
 * @return {string}
 */
function formatOrdinal(instance, providedFormat, state) {
    let ordinalFn = state.currentOrdinal();
    let options = Object.assign({}, defaultOptions, providedFormat);

    let output = formatNumber({
        instance,
        providedFormat,
        state
    });
    let ordinal = ordinalFn(instance._value);

    return `${output}${options.spaceSeparated ? " " : ""}${ordinal}`;
}

/**
 * Format the provided INSTANCE as a time HH:MM:SS.
 *
 * @param {Numbro} instance - numbro instance to format
 * @return {string}
 */
function formatTime(instance) {
    let hours = Math.floor(instance._value / 60 / 60);
    let minutes = Math.floor((instance._value - (hours * 60 * 60)) / 60);
    let seconds = Math.round(instance._value - (hours * 60 * 60) - (minutes * 60));
    return `${hours}:${(minutes < 10) ? "0" : ""}${minutes}:${(seconds < 10) ? "0" : ""}${seconds}`;
}

/**
 * Format the provided INSTANCE as a percentage using the PROVIDEDFORMAT,
 * and the STATE.
 *
 * @param {Numbro} instance - numbro instance to format
 * @param {{}} providedFormat - specification for formatting
 * @param {globalState} state - shared state of the library
 * @param numbro - the numbro singleton
 * @return {string}
 */
function formatPercentage(instance, providedFormat, state, numbro) {
    let prefixSymbol = providedFormat.prefixSymbol;

    let output = formatNumber({
        instance: numbro(instance._value * 100),
        providedFormat,
        state
    });
    let options = Object.assign({}, defaultOptions, providedFormat);

    if (prefixSymbol) {
        return `%${options.spaceSeparated ? " " : ""}${output}`;
    }

    return `${output}${options.spaceSeparated ? " " : ""}%`;
}

/**
 * Format the provided INSTANCE as a percentage using the PROVIDEDFORMAT,
 * and the STATE.
 *
 * @param {Numbro} instance - numbro instance to format
 * @param {{}} providedFormat - specification for formatting
 * @param {globalState} state - shared state of the library
 * @return {string}
 */
function formatCurrency(instance, providedFormat, state) {
    const currentCurrency = state.currentCurrency();
    let options = Object.assign({}, defaultOptions, providedFormat);
    let decimalSeparator = undefined;
    let space = "";
    let average = !!options.totalLength || !!options.forceAverage || options.average;
    let position = providedFormat.currencyPosition || currentCurrency.position;
    let symbol = providedFormat.currencySymbol || currentCurrency.symbol;
    const spaceSeparatedCurrency = options.spaceSeparatedCurrency !== void 0
        ? options.spaceSeparatedCurrency : options.spaceSeparated;

    if (spaceSeparatedCurrency) {
        space = " ";
    }

    if (position === "infix") {
        decimalSeparator = space + symbol + space;
    }

    let output = formatNumber({
        instance,
        providedFormat,
        state,
        decimalSeparator
    });

    if (position === "prefix") {
        if (instance._value < 0 && options.negative === "sign") {
            output = `-${space}${symbol}${output.slice(1)}`;
        } else if (instance._value > 0 && options.forceSign) {
            output = `+${space}${symbol}${output.slice(1)}`;
        } else {
            output = symbol + space + output;
        }
    }

    if (!position || position === "postfix") {
        space = average ? "" : space;
        output = output + space + symbol;
    }

    return output;
}

/**
 * Compute the average value out of VALUE.
 * The other parameters are computation options.
 *
 * @param {number} value - value to compute
 * @param {string} [forceAverage] - forced unit used to compute
 * @param {{}} abbreviations - part of the language specification
 * @param {boolean} spaceSeparated - `true` if a space must be inserted between the value and the abbreviation
 * @param {number} [totalLength] - total length of the output including the characteristic and the mantissa
 * @return {{value: number, abbreviation: string, mantissaPrecision: number}}
 */
function computeAverage({value, forceAverage, abbreviations, spaceSeparated = false, totalLength = 0}) {
    let abbreviation = "";
    let abs = Math.abs(value);
    let mantissaPrecision = -1;

    if ((abs >= Math.pow(10, 12) && !forceAverage) || (forceAverage === "trillion")) {
        // trillion
        abbreviation = abbreviations.trillion;
        value = value / Math.pow(10, 12);
    } else if ((abs < Math.pow(10, 12) && abs >= Math.pow(10, 9) && !forceAverage) || (forceAverage === "billion")) {
        // billion
        abbreviation = abbreviations.billion;
        value = value / Math.pow(10, 9);
    } else if ((abs < Math.pow(10, 9) && abs >= Math.pow(10, 6) && !forceAverage) || (forceAverage === "million")) {
        // million
        abbreviation = abbreviations.million;
        value = value / Math.pow(10, 6);
    } else if ((abs < Math.pow(10, 6) && abs >= Math.pow(10, 3) && !forceAverage) || (forceAverage === "thousand")) {
        // thousand
        abbreviation = abbreviations.thousand;
        value = value / Math.pow(10, 3);
    }

    let optionalSpace = spaceSeparated ? " " : "";

    if (abbreviation) {
        abbreviation = optionalSpace + abbreviation;
    }

    if (totalLength) {
        let characteristic = value.toString().split(".")[0];
        mantissaPrecision = Math.max(totalLength - characteristic.length, 0);
    }

    return {value, abbreviation, mantissaPrecision};
}

/**
 * Compute an exponential form for VALUE, taking into account CHARACTERISTIC
 * if provided.
 * @param {number} value - value to compute
 * @param {number} [characteristicPrecision] - optional characteristic length
 * @return {{value: number, abbreviation: string}}
 */
function computeExponential({value, characteristicPrecision = 0}) {
    let [numberString, exponential] = value.toExponential().split("e");
    let number = +numberString;

    if (!characteristicPrecision) {
        return {
            value: number,
            abbreviation: `e${exponential}`
        };
    }

    let characteristicLength = 1; // see `toExponential`

    if (characteristicLength < characteristicPrecision) {
        number = number * Math.pow(10, characteristicPrecision - characteristicLength);
        exponential = +exponential - (characteristicPrecision - characteristicLength);
        exponential = exponential >= 0 ? `+${exponential}` : exponential;
    }

    return {
        value: number,
        abbreviation: `e${exponential}`
    };
}

/**
 * Return a string of NUMBER zero.
 *
 * @param {number} number - Length of the output
 * @return {string}
 */
function zeroes(number) {
    let result = "";
    for (let i = 0; i < number; i++) {
        result += "0";
    }

    return result;
}

/**
 * Return a string representing VALUE with a PRECISION-long mantissa.
 * This method is for large/small numbers only (a.k.a. including a "e").
 *
 * @param {number} value - number to precise
 * @param {number} precision - desired length for the mantissa
 * @return {string}
 */
function toFixedLarge(value, precision) {
    let result = value.toString();

    let [base, exp] = result.split("e");

    let [characteristic, mantissa = ""] = base.split(".");

    if (+exp > 0) {
        result = characteristic + mantissa + zeroes(exp - mantissa.length);
    } else {
        let prefix = ".";

        if (+characteristic < 0) {
            prefix = `-0${prefix}`;
        } else {
            prefix = `0${prefix}`;
        }

        let suffix = (zeroes(-exp - 1) + Math.abs(characteristic) + mantissa).substr(0, precision);
        if (suffix.length < precision) {
            suffix += zeroes(precision - suffix.length);
        }
        result = prefix + suffix;
    }

    if (+exp > 0 && precision > 0) {
        result += `.${zeroes(precision)}`;
    }

    return result;
}

/**
 * Return a string representing VALUE with a PRECISION-long mantissa.
 *
 * @param {number} value - number to precise
 * @param {number} precision - desired length for the mantissa
 * @param {function} roundingFunction - rounding function to be used
 * @return {string}
 */
function toFixed(value, precision, roundingFunction = Math.round) {
    if (value.toString().indexOf("e") !== -1) {
        return toFixedLarge(value, precision);
    }

    return (roundingFunction(+`${value}e+${precision}`) / (Math.pow(10, precision))).toFixed(precision);
}

/**
 * Return the current OUTPUT with a mantissa precision of PRECISION.
 *
 * @param {string} output - output being build in the process of formatting
 * @param {number} value - number being currently formatted
 * @param {boolean} optionalMantissa - if `true`, the mantissa is omitted when it's only zeroes
 * @param {number} precision - desired precision of the mantissa
 * @param {boolean} trim - if `true`, trailing zeroes are removed from the mantissa
 * @return {string}
 */
function setMantissaPrecision(output, value, optionalMantissa, precision, trim, roundingFunction) {
    if (precision === -1) {
        return output;
    }

    let result = toFixed(value, precision, roundingFunction);
    let [currentCharacteristic, currentMantissa = ""] = result.toString().split(".");

    if (currentMantissa.match(/^0+$/) && (optionalMantissa || trim)) {
        return currentCharacteristic;
    }

    let hasTrailingZeroes = currentMantissa.match(/0+$/);
    if (trim && hasTrailingZeroes) {
        return `${currentCharacteristic}.${currentMantissa.toString().slice(0, hasTrailingZeroes.index)}`;
    }

    return result.toString();
}

/**
 * Return the current OUTPUT with a characteristic precision of PRECISION.
 *
 * @param {string} output - output being build in the process of formatting
 * @param {number} value - number being currently formatted
 * @param {boolean} optionalCharacteristic - `true` if the characteristic is omitted when it's only zeroes
 * @param {number} precision - desired precision of the characteristic
 * @return {string}
 */
function setCharacteristicPrecision(output, value, optionalCharacteristic, precision) {
    let result = output;
    let [currentCharacteristic, currentMantissa] = result.toString().split(".");

    if (currentCharacteristic.match(/^-?0$/) && optionalCharacteristic) {
        if (!currentMantissa) {
            return currentCharacteristic.replace("0", "");
        }

        return `${currentCharacteristic.replace("0", "")}.${currentMantissa}`;
    }

    if (currentCharacteristic.length < precision) {
        let missingZeros = precision - currentCharacteristic.length;
        for (let i = 0; i < missingZeros; i++) {
            result = `0${result}`;
        }
    }

    return result.toString();
}

/**
 * Return the indexes where are the group separations after splitting
 * `totalLength` in group of `groupSize` size.
 * Important: we start grouping from the right hand side.
 *
 * @param {number} totalLength - total length of the characteristic to split
 * @param {number} groupSize - length of each group
 * @return {[number]}
 */
function indexesOfGroupSpaces(totalLength, groupSize) {
    let result = [];
    let counter = 0;
    for (let i = totalLength; i > 0; i--) {
        if (counter === groupSize) {
            result.unshift(i);
            counter = 0;
        }
        counter++;
    }

    return result;
}

/**
 * Replace the decimal separator with DECIMALSEPARATOR and insert thousand
 * separators.
 *
 * @param {string} output - output being build in the process of formatting
 * @param {number} value - number being currently formatted
 * @param {boolean} thousandSeparated - `true` if the characteristic must be separated
 * @param {globalState} state - shared state of the library
 * @param {string} decimalSeparator - string to use as decimal separator
 * @return {string}
 */
function replaceDelimiters(output, value, thousandSeparated, state, decimalSeparator) {
    let delimiters = state.currentDelimiters();
    let thousandSeparator = delimiters.thousands;
    decimalSeparator = decimalSeparator || delimiters.decimal;
    let thousandsSize = delimiters.thousandsSize || 3;

    let result = output.toString();
    let characteristic = result.split(".")[0];
    let mantissa = result.split(".")[1];
    const hasNegativeSign = value < 0 && characteristic.indexOf("-") === 0;

    if (thousandSeparated) {
        if (hasNegativeSign) {
            // Remove the negative sign
            characteristic = characteristic.slice(1);
        }

        let indexesToInsertThousandDelimiters = indexesOfGroupSpaces(characteristic.length, thousandsSize);
        indexesToInsertThousandDelimiters.forEach((position, index) => {
            characteristic = characteristic.slice(0, position + index) + thousandSeparator + characteristic.slice(position + index);
        });

        if (hasNegativeSign) {
            // Add back the negative sign
            characteristic = `-${characteristic}`;
        }
    }

    if (!mantissa) {
        result = characteristic;
    } else {
        result = characteristic + decimalSeparator + mantissa;
    }
    return result;
}

/**
 * Insert the provided ABBREVIATION at the end of OUTPUT.
 *
 * @param {string} output - output being build in the process of formatting
 * @param {string} abbreviation - abbreviation to append
 * @return {*}
 */
function insertAbbreviation(output, abbreviation) {
    return output + abbreviation;
}

/**
 * Insert the positive/negative sign according to the NEGATIVE flag.
 * If the value is negative but still output as 0, the negative sign is removed.
 *
 * @param {string} output - output being build in the process of formatting
 * @param {number} value - number being currently formatted
 * @param {string} negative - flag for the negative form ("sign" or "parenthesis")
 * @return {*}
 */
function insertSign(output, value, negative) {
    if (value === 0) {
        return output;
    }

    if (+output === 0) {
        return output.replace("-", "");
    }

    if (value > 0) {
        return `+${output}`;
    }

    if (negative === "sign") {
        return output;
    }

    return `(${output.replace("-", "")})`;
}

/**
 * Insert the provided PREFIX at the start of OUTPUT.
 *
 * @param {string} output - output being build in the process of formatting
 * @param {string} prefix - abbreviation to prepend
 * @return {*}
 */
function insertPrefix(output, prefix) {
    return prefix + output;
}

/**
 * Insert the provided POSTFIX at the end of OUTPUT.
 *
 * @param {string} output - output being build in the process of formatting
 * @param {string} postfix - abbreviation to append
 * @return {*}
 */
function insertPostfix(output, postfix) {
    return output + postfix;
}

/**
 * Format the provided INSTANCE as a number using the PROVIDEDFORMAT,
 * and the STATE.
 * This is the key method of the framework!
 *
 * @param {Numbro} instance - numbro instance to format
 * @param {{}} [providedFormat] - specification for formatting
 * @param {globalState} state - shared state of the library
 * @param {string} decimalSeparator - string to use as decimal separator
 * @param {{}} defaults - Set of default values used for formatting
 * @return {string}
 */
function formatNumber({instance, providedFormat, state = globalState, decimalSeparator, defaults = state.currentDefaults()}) {
    let value = instance._value;

    if (value === 0 && state.hasZeroFormat()) {
        return state.getZeroFormat();
    }

    if (!isFinite(value)) {
        return value.toString();
    }

    let options = Object.assign({}, defaultOptions, defaults, providedFormat);

    let totalLength = options.totalLength;
    let characteristicPrecision = totalLength ? 0 : options.characteristic;
    let optionalCharacteristic = options.optionalCharacteristic;
    let forceAverage = options.forceAverage;
    let average = !!totalLength || !!forceAverage || options.average;

    // default when averaging is to chop off decimals
    let mantissaPrecision = totalLength ? -1 : (average && providedFormat.mantissa === undefined ? 0 : options.mantissa);
    let optionalMantissa = totalLength ? false : (providedFormat.optionalMantissa === undefined ? mantissaPrecision === -1 : options.optionalMantissa);
    let trimMantissa = options.trimMantissa;
    let thousandSeparated = options.thousandSeparated;
    let spaceSeparated = options.spaceSeparated;
    let negative = options.negative;
    let forceSign = options.forceSign;
    let exponential = options.exponential;
    let roundingFunction = options.roundingFunction;

    let abbreviation = "";

    if (average) {
        let data = computeAverage({
            value,
            forceAverage,
            abbreviations: state.currentAbbreviations(),
            spaceSeparated: spaceSeparated,
            totalLength
        });

        value = data.value;
        abbreviation += data.abbreviation;

        if (totalLength) {
            mantissaPrecision = data.mantissaPrecision;
        }
    }

    if (exponential) {
        let data = computeExponential({
            value,
            characteristicPrecision
        });

        value = data.value;
        abbreviation = data.abbreviation + abbreviation;
    }

    let output = setMantissaPrecision(value.toString(), value, optionalMantissa, mantissaPrecision, trimMantissa, roundingFunction);
    output = setCharacteristicPrecision(output, value, optionalCharacteristic, characteristicPrecision);
    output = replaceDelimiters(output, value, thousandSeparated, state, decimalSeparator);

    if (average || exponential) {
        output = insertAbbreviation(output, abbreviation);
    }

    if (forceSign || value < 0) {
        output = insertSign(output, value, negative);
    }

    return output;
}

/**
 * If FORMAT is non-null and not just an output, return FORMAT.
 * Return DEFAULTFORMAT otherwise.
 *
 * @param providedFormat
 * @param defaultFormat
 */
function formatOrDefault(providedFormat, defaultFormat) {
    if (!providedFormat) {
        return defaultFormat;
    }

    let keys = Object.keys(providedFormat);
    if (keys.length === 1 && keys[0] === "output") {
        return defaultFormat;
    }

    return providedFormat;
}

module.exports = (numbro) => ({
    format: (...args) => format(...args, numbro),
    getByteUnit: (...args) => getByteUnit(...args, numbro),
    getBinaryByteUnit: (...args) => getBinaryByteUnit(...args, numbro),
    getDecimalByteUnit: (...args) => getDecimalByteUnit(...args, numbro),
    formatOrDefault
});
