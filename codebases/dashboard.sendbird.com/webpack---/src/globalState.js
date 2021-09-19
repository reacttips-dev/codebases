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

const enUS = require("./en-US");
const validating = require("./validating");
const parsing = require("./parsing");

let state = {};

let currentLanguageTag = undefined;
let languages = {};

let zeroFormat = null;

let globalDefaults = {};

function chooseLanguage(tag) { currentLanguageTag = tag; }

function currentLanguageData() { return languages[currentLanguageTag]; }

/**
 * Return all the register languages
 *
 * @return {{}}
 */
state.languages = () => Object.assign({}, languages);

//
// Current language accessors
//

/**
 * Return the current language tag
 *
 * @return {string}
 */
state.currentLanguage = () => currentLanguageTag;

/**
 * Return the current language currency data
 *
 * @return {{}}
 */
state.currentCurrency = () => currentLanguageData().currency;

/**
 * Return the current language abbreviations data
 *
 * @return {{}}
 */
state.currentAbbreviations = () => currentLanguageData().abbreviations;

/**
 * Return the current language delimiters data
 *
 * @return {{}}
 */
state.currentDelimiters = () => currentLanguageData().delimiters;

/**
 * Return the current language ordinal function
 *
 * @return {function}
 */
state.currentOrdinal = () => currentLanguageData().ordinal;

//
// Defaults
//

/**
 * Return the current formatting defaults.
 * Use first uses the current language default, then fallback to the globally defined defaults.
 *
 * @return {{}}
 */
state.currentDefaults = () => Object.assign({}, currentLanguageData().defaults, globalDefaults);

/**
 * Return the ordinal default-format.
 * Use first uses the current language ordinal default, then fallback to the regular defaults.
 *
 * @return {{}}
 */
state.currentOrdinalDefaultFormat = () => Object.assign({}, state.currentDefaults(), currentLanguageData().ordinalFormat);

/**
 * Return the byte default-format.
 * Use first uses the current language byte default, then fallback to the regular defaults.
 *
 * @return {{}}
 */
state.currentByteDefaultFormat = () => Object.assign({}, state.currentDefaults(), currentLanguageData().byteFormat);

/**
 * Return the percentage default-format.
 * Use first uses the current language percentage default, then fallback to the regular defaults.
 *
 * @return {{}}
 */
state.currentPercentageDefaultFormat = () => Object.assign({}, state.currentDefaults(), currentLanguageData().percentageFormat);

/**
 * Return the currency default-format.
 * Use first uses the current language currency default, then fallback to the regular defaults.
 *
 * @return {{}}
 */
state.currentCurrencyDefaultFormat = () => Object.assign({}, state.currentDefaults(), currentLanguageData().currencyFormat);

/**
 * Return the time default-format.
 * Use first uses the current language currency default, then fallback to the regular defaults.
 *
 * @return {{}}
 */
state.currentTimeDefaultFormat = () => Object.assign({}, state.currentDefaults(), currentLanguageData().timeFormat);

/**
 * Set the global formatting defaults.
 *
 * @param {{}|string} format - formatting options to use as defaults
 */
state.setDefaults = (format) => {
    format = parsing.parseFormat(format);
    if (validating.validateFormat(format)) {
        globalDefaults = format;
    }
};

//
// Zero format
//

/**
 * Return the format string for 0.
 *
 * @return {string}
 */
state.getZeroFormat = () => zeroFormat;

/**
 * Set a STRING to output when the value is 0.
 *
 * @param {{}|string} string - string to set
 */
state.setZeroFormat = (string) => zeroFormat = typeof(string) === "string" ? string : null;

/**
 * Return true if a format for 0 has been set already.
 *
 * @return {boolean}
 */
state.hasZeroFormat = () => zeroFormat !== null;

//
// Getters/Setters
//

/**
 * Return the language data for the provided TAG.
 * Return the current language data if no tag is provided.
 *
 * Throw an error if the tag doesn't match any registered language.
 *
 * @param {string} [tag] - language tag of a registered language
 * @return {{}}
 */
state.languageData = (tag) => {
    if (tag) {
        if (languages[tag]) {
            return languages[tag];
        }
        throw new Error(`Unknown tag "${tag}"`);
    }

    return currentLanguageData();
};

/**
 * Register the provided DATA as a language if and only if the data is valid.
 * If the data is not valid, an error is thrown.
 *
 * When USELANGUAGE is true, the registered language is then used.
 *
 * @param {{}} data - language data to register
 * @param {boolean} [useLanguage] - `true` if the provided data should become the current language
 */
state.registerLanguage = (data, useLanguage = false) => {
    if (!validating.validateLanguage(data)) {
        throw new Error("Invalid language data");
    }

    languages[data.languageTag] = data;

    if (useLanguage) {
        chooseLanguage(data.languageTag);
    }
};

/**
 * Set the current language according to TAG.
 * If TAG doesn't match a registered language, another language matching
 * the "language" part of the tag (according to BCP47: https://tools.ietf.org/rfc/bcp/bcp47.txt).
 * If none, the FALLBACKTAG is used. If the FALLBACKTAG doesn't match a register language,
 * `en-US` is finally used.
 *
 * @param tag
 * @param fallbackTag
 */
state.setLanguage = (tag, fallbackTag = enUS.languageTag) => {
    if (!languages[tag]) {
        let suffix = tag.split("-")[0];

        let matchingLanguageTag = Object.keys(languages).find(each => {
            return each.split("-")[0] === suffix;
        });

        if (!languages[matchingLanguageTag]) {
            chooseLanguage(fallbackTag);
            return;
        }

        chooseLanguage(matchingLanguageTag);
        return;
    }

    chooseLanguage(tag);
};

state.registerLanguage(enUS);
currentLanguageTag = enUS.languageTag;

module.exports = state;
