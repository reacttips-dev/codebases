/* eslint-disable @typescript-eslint/camelcase */
import angular from "angular";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import _ from "lodash";
import dayjs from "dayjs";
import numeral from "numeral";
import {
    booleanSearchToString,
    booleanSearchToStringIncludeTerms,
} from "pages/website-analysis/traffic-sources/search/booleanSearchUtility";
import { AssetsService } from "services/AssetsService";
import { ChartMarkerService } from "services/ChartMarkerService";
import CountryService from "services/CountryService";
import { I18NFilter } from "./ngFilters.types";
import { pureNumberFilter, numberFilter as number } from "./numberFilter";

declare const i18n: { t: (key: string, obj?: any) => string };

export const isNumberAndNotNan = (val) => !isNaN(val) && _.isNumber(val);

const injector = Injector;

/** overrides angular.js $filter.number */
export const numberFilter = number;

export const pureNumberFixedZerosFilter = () => {
    return (val) => pureNumberFilterWithZeroCount(val, 2);
};

export const pureNumberFilterWithZeroCount = (num: number, numberTrailingZeros: number): string => {
    if (num === null || num === undefined || !num) {
        return "-";
    }
    let numberTrailingZerosStr = "";
    for (let i = 0; i < numberTrailingZeros; i++) {
        numberTrailingZerosStr += "0";
    }
    if (num < 1000) {
        return numeral(num).format(`0,0a`).toUpperCase();
    }
    return numeral(num).format(`0,0.${numberTrailingZerosStr}a`).toUpperCase();
};

const getChosenSites: () => any = () => injector.get("chosenSites");
const getCountryService: () => any = () => CountryService;

export function i18nFilter(): I18NFilter {
    // local replacements
    const replacements = {
        site: () => getChosenSites().getPrimarySite().name,
    };
    const replacementKeys = Object.keys(replacements);
    return (key: string, obj: any = {}, defaultValue: string = key) => {
        if (!key) {
            return "";
        }
        let res = i18n.t(key, obj);
        // local replacements
        replacementKeys.forEach((replacement) => {
            const searchString = `%${replacement}%`;
            if (res && res.indexOf(searchString) > -1) {
                res = res.replace(searchString, replacements[replacement]());
            }
        });

        return res || defaultValue;
    };
}

const CUSTOM_CATEGORY_INDICATOR_PREFIX = "*";

export function i18nCategoryFilter() {
    return (key, isChildReq = false) => {
        // handle custom category
        if (typeof key === "string" && key.startsWith(CUSTOM_CATEGORY_INDICATOR_PREFIX)) {
            return key.substring(1);
        }

        if (typeof key === "string" && key.indexOf("~") !== -1) {
            key = key.replace("~", "/");
        }

        if (typeof key === "string" && key.indexOf("$") !== -1) {
            key = key.replace("$", "");
        }

        if (typeof key === "string") {
            let parsedKey = i18nFilter()("common.category." + key.toLowerCase());
            parsedKey = isChildReq
                ? parsedKey.substring(parsedKey.indexOf("/") + 1)
                : parsedKey.replace(/\//g, " > ");

            if (parsedKey.indexOf("common.category.") !== -1) {
                parsedKey = key.replace(/_/g, " ");
            }

            return parsedKey;
        }

        return "N/A";
    };
}

export const categoryTextToIconFilter = () => (text) =>
    text.replace(/~.+/g, "").replace(/\s+/g, "-").toLowerCase();

export function swNumberFilter() {
    return (val, decimal?, na?) => {
        na = na || "N/A";
        decimal = decimal || 0;
        return val ? numberFilter()(val, decimal) : na;
    };
}

export function swRankNumberFilter() {
    return (val, decimal, na) => {
        na = "-";
        return val && val > -1
            ? "#" + numberFilter()(val, decimal)
            : '<span class="u-gray-medium">' + na + "</span>";
    };
}

export function decimalNumberFilter() {
    return (val, removeTrailingZeros) => {
        const result =
            angular.isNumber(val) || angular.isString(val)
                ? numberFilter()(parseFloat(val as string), 2)
                : null;

        if (removeTrailingZeros) {
            return parseFloat(result).toString();
        } else {
            return result;
        }
    };
}

export function swPositionFilter() {
    return (val) => (val ? numberFilter()(val) : "-");
}

export function swRankFilter() {
    return (val) => (val && val > -1 ? numberFilter()(val) : "-");
}

export function changeFilter() {
    return (val, precision = 2) => {
        if (val > 50) {
            return " > 5,000%";
        } else {
            return isNumberAndNotNan(val)
                ? val === 0
                    ? "-"
                    : numberFilter()(simplePercentageFilter()(val, precision), precision) + "%"
                : "-";
        }
    };
}

export function yAxisChangeFilter() {
    return (val, precision = 0, threshold = 50) => {
        if (val >= threshold) {
            return " > 5000%";
        } else {
            return percentageSignFilter()(val, precision);
        }
    };
}

export function NoneFilter() {
    return (val) => val;
}

export function percentageSignFilter() {
    return (val, decimal?) =>
        isNumberAndNotNan(val) ? simplePercentageFilter()(val, decimal) + "%" : "N/A";
}

export function percentageSignOnlyFilter() {
    return (val, decimal) => (val && !isNaN(val) ? `${(+val).toFixed(+decimal)}%` : "N/A");
}

export const percentagesignFilter = percentageSignFilter;

export function tinyFractionApproximationFilter() {
    return (targetTemplate, minNumber) => {
        const innerNumberString = /(-?\d*\.?\d*)/.exec(targetTemplate);
        const innerNumber =
            innerNumberString && innerNumberString[1] && parseFloat(innerNumberString[1]);

        if (innerNumber < minNumber) {
            return targetTemplate.toString().replace(innerNumberString[1], "< " + minNumber);
        } else {
            return targetTemplate;
        }
    };
}

export function smallNumbersPercentageFilter() {
    return (val, fraction?) => {
        const float = parseFloat(val);
        if (!fraction) {
            if (float > 0) {
                if (float < 0.001) {
                    fraction = 5;
                } else if (float < 0.01) {
                    fraction = 4;
                } else if (float < 0.1) {
                    fraction = 3;
                } else {
                    fraction = 0;
                }
            } else {
                fraction = 0;
            }
        }
        return percentageFilter()(val, fraction) + "%";
    };
}

export function simplePercentageFilter() {
    return (val, fraction?, na?) => {
        val = Number(val);

        if (isNaN(val)) {
            if (na) {
                return na;
            }

            return 0;
        }

        val *= 100;
        let zeros = "";

        for (let k = 0; k < fraction; k++) {
            zeros += "0";
        }

        const round = Number("1" + zeros);
        const valBefore = _.clone(val);
        val = Math.round(val * round) / round;
        // zero check is for a small value like 0.04 which can be rounded to 0
        val =
            val === 0 && valBefore !== 0 ? valBefore.toFixed(fraction || 2) : val.toFixed(fraction);
        return val;
    };
}

export function percentageFilter() {
    return (val, fraction, unavailable = "0") => {
        val = Number(val);

        if (isNaN(val)) {
            return unavailable ? unavailable : "0";
        }

        if (!val && unavailable) {
            return unavailable;
        }
        const _val = val * 100;
        if (_val === 100) {
            return _val.toString();
        }

        if (100 > _val && _val > 99.95) {
            return "99.9";
        }

        let zeros = "";

        for (let k = 0; k < fraction - 1; k++) {
            zeros += "0";
        }

        const round = Number("1" + zeros + "0");

        if (0 < _val && _val < 1 / round && val !== 0) {
            let ret = " < 0.";
            ret += zeros;
            ret += "1";
            return ret;
        }

        val = Math.round(_val * round) / round;
        val = val.toFixed(fraction);
        return val;
    };
}

export function letterizeFilter() {
    return (val, index) => val + String.fromCharCode(97 + index);
}

export function absFilter() {
    return (val) => Math.abs(val);
}

export function prefixNumberFilter() {
    return (val, sign) => {
        const numVal =
            typeof val === "string" ? numberFilter()(Number(val.replace(/,/g, ""))) : val;
        if (!val || _.isNaN(numVal) || numVal < 1 || numVal >= 9223372036854775807) {
            if (val === "-1") {
                return "-";
            }
            return val || "-";
        }

        return sign + val;
    };
}

export function suffixFilter() {
    return (val, sign) => {
        if (val === "0") {
            return "0";
        }

        if (typeof val === "string" && !_.isNaN(Number(val))) {
            return val + sign;
        }

        return val;
    };
}

export function sqrtFilter() {
    return (val) => Math.sqrt(val || 0);
}

export function plusSignFilter() {
    return (val) => {
        if (isNaN(Number(val))) {
            return val;
        }

        if (val > 0) {
            return "+" + val;
        }

        return val;
    };
}

export function pctSignFilter() {
    return (val) => val + "%";
}

export function countryTextByIdFilter() {
    return (val, na = "") => {
        if (val == -1) {
            return i18nFilter()("grid.upgrade");
        }

        const countryService = getCountryService();
        const country = countryService.countriesById[val];
        return country ? country.text || na : "";
    };
}

export function encodeCommasFilter() {
    return (val) => val.replace(/,/gi, "&#44;");
}

export function encodeQuoteFilter() {
    return (val) => (val ? val.replace("\\'", "'").replace(/'/gi, "\\'") : "");
}

export function countryCodeByIdFilter() {
    return (val) => {
        if (val == 999) {
            return "ww";
        }
        if (val == -1) {
            return "hidden";
        }
        const countriesById = getCountryService().countriesById;
        const country = countriesById[val] || countriesById[0];
        return country.code;
    };
}

export function countryByIdFilter() {
    return (val, attr) => {
        const countriesById = getCountryService().countriesById;
        const country = countriesById[val] || countriesById[0];
        return attr ? country[attr] : country;
    };
}

export function encodeURIFilter($window) {
    return $window.encodeURI;
}

export function toLowerCaseFilter() {
    return (val) => val.toLowerCase();
}

export function prettifyCategoryTextFilter() {
    return (name: string, na = "N/A"): string => {
        return (
            name
                ?.replace(new RegExp("_", "gm"), " ")
                ?.replace(new RegExp("~", "gm"), " > ")
                ?.replace("$", "") ?? na
        );
    };
}

export function prettifyCategoryFilter() {
    const prettify = (val) => {
        val = val.replace(new RegExp("_", "gm"), " ");
        val = val.replace(new RegExp("~", "gm"), " > ");
        return val;
    };
    return (name, specials = null, na = null) => {
        if (name && specials) {
            const className = specials[name.toString().toLowerCase()];

            if (className) {
                return (
                    '<span class="' +
                    (className === true
                        ? "cat-" + name.toLowerCase().replace(/\s/gi, "_")
                        : className) +
                    '">' +
                    prettify(name) +
                    "</span>"
                );
            }
        }

        return name ? prettify(name) : na;
    };
}

export function categoryIconFilter() {
    return (val) => {
        if (!val) {
            return "";
        }
        return val.split(">")[0].split("/")[0].trim().replace(/\s/g, "_").toLowerCase();
    };
}

export function categoryClassIconFilter() {
    return (val) => {
        if (!val || !(typeof val === "string")) {
            return "";
        }

        if (val[0] === "*") {
            return "sprite-category custom-category";
        }

        if (val === "All") {
            return "sprite-category all-categories";
        }

        const category = val.split("~");
        return "sprite-category " + category[0];
    };
}

export function categoryLinkFilter(swNavigator) {
    return (cat, parentCat, ignoreCustomCat = false) => {
        let _cat = cat ? cat.replace("$", "") : "";

        const _parentCat = parentCat ? parentCat.replace("$", "") : "";

        const _params = swNavigator.getParams();

        const _inputParams: { country?: number; category?: string; duration?: string } = {};

        if (!_.isEmpty(_params.country)) {
            _inputParams.country = _params.country;
        }

        if (_params.category && !ignoreCustomCat) {
            const currentCatIsCustom = _params.category[0] == "*";

            if (currentCatIsCustom) {
                _cat = "*" + _cat;
            }
        }

        _inputParams.category = _parentCat && _parentCat != "All" ? _parentCat + "~" + _cat : _cat;

        if (_params.duration) {
            if (_params.duration === "1m" || _params.duration.indexOf("d") !== -1) {
                _inputParams.duration = "3m";
            } else {
                _inputParams.duration = _params.duration;
            }
        }

        return swNavigator.href("industryAnalysis-overview", _inputParams);
    };
}

export function categoryPrettyFilter() {
    return (cat, parentCat) => {
        const _cat = cat ? cat.replace("$", "") : "";

        const _parentCat = parentCat ? parentCat.replace("$", "") : "";

        return _parentCat && _parentCat != "All" ? _parentCat + "~" + _cat : _cat;
    };
}

export function subCategoryFilter() {
    return (val) => {
        if (!val) {
            return "-";
        }
        const splitted = val.replace("$", "").split("~");
        return i18nCategoryFilter()(splitted[1] || splitted[0]);
    };
}

export function parentCategoryFilter() {
    return (val) => {
        if (!val) {
            return "-";
        }
        const splitted = val.replace("$", "").split("~");
        return splitted[0];
    };
}

export function rankFilter() {
    return (val) => {
        if (val === 0 || val === -1 || val >= 9223372036854775807) {
            return "-";
        }

        return numberFilter()(val);
    };
}

export function bigNumberFilter() {
    return (val) => {
        if (val < 250) {
            return val;
        }
        /*
         Round the value to make it look more aesthetic
         The chooses what to round(hundreds/thousands etc) based on the number of digits of the number
         */

        const p = Math.floor(Math.log(val) / Math.log(10));
        const r = p % 2 === 1 ? Math.pow(10, (p + 3) / 2) : 5 * Math.pow(10, (p + 2) / 2);
        return Math.round(val / r) * r;
    };
}

export function bigNumberCommaFilter() {
    return (val) => {
        const total = bigNumberFilter()(val);
        return swNumberFilter()(total);
    };
}

export function roundNumberFilter() {
    return (val, digits = 0) => {
        if (!val) {
            return "N/A";
        }
        const roundCount = Math.pow(10, digits);
        return numberFilter()(Math.round(val / roundCount) * roundCount);
    };
}

export function localeStringFilter() {
    return (val) => val && val.toLocaleString && val.toLocaleString().split(".")[0];
}

export function minVisits(val, threshold, alternative) {
    if (val === undefined || val === null) {
        return "N/A";
    }
    if (!val) {
        return 0;
    }

    return val < threshold ? `< ${alternative(threshold)}` : alternative(val);
}

export function minVisitsFilter() {
    return (val) => minVisits(val, 5000, numberFilter());
}

export function minVisitsAbbrFilter() {
    return (val, threshold = 5000) => minVisits(val, Number(threshold), abbrNumberVisitsFilter());
}

export function minAbbrNumberFilter() {
    return (val) => minVisits(val, 5000, abbrNumberFilter());
}

export function minVisitsTooltipFilter() {
    return (val) => {
        return minVisits(val, 5000, (v) => {
            return roundNumberFilter()(v, 2);
        });
    };
}

export function minDownloadsFilter() {
    return (val) => {
        if (!val) {
            return 0;
        } else if (val < 100) {
            return "< 100";
        } else if (val < 1000) {
            return Math.round(val);
        } else {
            return abbrNumberFilter()(val);
        }
    };
}

export function siteFilter() {
    return (val) => (val ? val.charAt(0).toUpperCase() + val.slice(1) : "");
}

export function timeFilter() {
    return (val, unavailable) => {
        if (!val && unavailable) {
            return unavailable;
        }

        if (val === 0) {
            return "00:00:00";
        }
        if (val === null || val === "NA" || !val) {
            return "N/A";
        }

        const isNegative = val < 0;

        if (isNegative) {
            val *= -1;
        }

        const duration = dayjs.duration(val * 1000);
        const calcHours =
            duration.days() > 0 ? duration.days() * 24 + duration.hours() : duration.hours();
        const h = calcHours > 9 ? calcHours : "0" + calcHours;
        const m = duration.minutes() > 9 ? duration.minutes() : "0" + duration.minutes();
        const s = duration.seconds() > 9 ? duration.seconds() : "0" + duration.seconds();
        let result = h + ":" + m + ":" + s;

        if (isNegative) {
            result = "-" + result;
        }

        return result;
    };
}

export function utcFormatFilter() {
    return (val) => dayjs(val + "Z").format("MMMM Do YYYY, h:mm:ss a");
}

export function utcCalFilter() {
    return (val) => {
        const dayjs_obj = dayjs(val + "Z"); // check if the entry is today or yesterday

        const today = dayjs().startOf("day");
        const yesterday = dayjs().subtract(1, "days").startOf("day");

        if (dayjs_obj.isAfter(today)) {
            return dayjs_obj.format("[Today ] hh:mm A");
        }

        if (dayjs_obj.isAfter(yesterday)) {
            return dayjs_obj.format("[Yesterday ] hh:mm A");
        }

        return dayjs_obj.format("MMMM Do YYYY");
    };
}

export function utcSinceFilter() {
    return (val) => dayjs(val + "Z").fromNow();
}

export function CapitalizeFirstLetterFilter() {
    return (val) => {
        if (val && val.indexOf("www") === 0) {
            return val;
        }

        return val && val.charAt(0).toUpperCase() + val.slice(1);
    };
}

export function minusNAFilter() {
    return (val) => (val ? val : "-");
}

export function storePageUrlFilter() {
    return (appStore, appId) => {
        if (appStore.toLowerCase() === "apple") {
            return "https://itunes.apple.com/app/id" + appId;
        }

        return "https://play.google.com/store/apps/details?id=" + appId;
    };
}

export function appStoreLinkFilter() {
    return (val, appStore) =>
        appStore === "Apple"
            ? "https://itunes.apple.com/app/id" + val
            : "https://play.google.com/store/apps/details?id=" + val;
}

export function secondsToTimeFilter() {
    return (seconds) => {
        const days = Math.floor(seconds / (60 * 60 * 24));
        const rest = dayjs().startOf("day").second(seconds).format("HH:mm:ss");
        const hours = Number(rest.substr(0, 2)) + 24 * days;
        return (hours < 10 ? "0" + hours : hours) + rest.substr(2);
    };
}

export function domain_outFilter() {
    return (val, append, overrideLinkText) => {
        let href = val;
        append = append || "";

        if (val && val.indexOf("http://") !== 0 && val.indexOf("https://") !== 0) {
            href = "http://" + val;
        }

        const decodedVal = overrideLinkText || val;

        if (val && val !== -1 && !/^n\/a$/i.test(val)) {
            return [
                '<span class="sw-domain-column-name" title="' +
                    val +
                    '">' +
                    decodedVal +
                    "</span>" +
                    append,
                '<a class="sw-link-out" href="' + href + '" target="_blank"></a>',
            ].join("");
        } else {
            return "<span>-</span>";
        }
    };
}

export function domain_out_googleFilter() {
    return (val) => {
        const decodedVal = val;
        val = val.replace(/\"/g, "&quot;");
        return [
            '<span class="sw-domain-column-name" title="' + val + '">' + decodedVal + "</span>",
            '<a class="sw-btn-search-press" href="//google.com/search?q=' +
                val +
                '" target="_blank"></a>',
        ].join("");
    };
}

export function domain_out_googlePlayStoreFilter() {
    return (val) => {
        const decodedVal = val;
        return [
            '<a class="sw-domain-column-name" title="' +
                val +
                '" href="/appstorekeywords/#/keywordanalysis/' +
                val +
                '/999/1m">' +
                decodedVal +
                "</a>",
            '<a class="sw-btn-search-press" href="https://play.google.com/store/search?q=' +
                val +
                '&c=apps" target="_blank"></a>',
        ].join("");
    };
}

export function domain_out_appleAppStoreFilter() {
    return (val) => {
        const decodedVal = val;
        return [
            '<span class="sw-domain-column-name" title="' + val + '">' + decodedVal + "</span>",
            '<a class="sw-btn-search-press" href="https://ssl.apple.com/search/?q=' +
                val +
                '&section=ipoditunes" target="_blank"></a>',
        ].join("");
    };
}

export function domain_iconifyFilter() {
    return function (val) {
        val = _.escape(val);
        return [
            '<img class="favicon" src="' +
                ((this.row && this.row.Favicon) ||
                    (this.row && this.row.favicon) ||
                    this.favicon ||
                    this.Favicon) +
                '" alt="" />',
            '<span class="sw-domain-column-name">' + val + "</span>",
        ].join("");
    };
}

export function orderListFilter() {
    return (list: Array<{ Name: string; Visits: number }>, desc, last) => {
        last = last || "others";
        const orderFactor = desc ? -1 : 1;

        _.sortBy(list, (item) => item.Name);

        return list.sort((a, b) => {
            if (a.Name === last) {
                return 1;
            } else if (b.Name === last) {
                return -1;
            } else {
                return (a.Visits - b.Visits) * orderFactor;
            }
        });
    };
}

export function htmlEncodeFilter() {
    return (val) => decodeURIComponent(val);
}

export function busterFilter() {
    return (val) => val + "?v=" + swSettings.version;
}

export function ellipsisFilter() {
    return (val, size) => {
        if (size && val.length > size) {
            return val.substring(0, size - 3) + "...";
        }

        return val;
    };
}

export function floorFilter() {
    return (val) => Math.floor(val);
}

export function abbrNumberSupportNegativeFilter() {
    return (num, removeTrailingZeros?) => {
        let changeSign = false;
        if (num < 0) {
            changeSign = true;
        }
        return changeSign
            ? `-${abbrNumberFilter()(Math.abs(num))}`
            : abbrNumberFilter()(Math.abs(num));
    };
}

export function abbrNumberFilter() {
    return (num, removeTrailingZeros?) => {
        if (num == undefined) {
            return 0;
        } else if (typeof num === "string") {
            num = parseFloat(num);

            if (isNaN(num)) {
                return (num = "N/A");
            }
        }

        let digits,
            suffix = "";

        if (num >= 1000000000) {
            // Billions
            num = num / 1000000000; // Transform 12345678 to 12.3

            digits = 1;
            suffix = "B";
        } else if (num >= 1000000) {
            // Millions
            num = num / 1000000; // Transform 12345678 to 12.3

            digits = 1;
            suffix = "M";
        } else if (num >= 1000) {
            // Thousands
            num = num / 1000; // Transform 12345 to 12.3

            digits = 1;
            suffix = "K";
        } else {
            digits = 2;
            num = Math.round(num); // fixes #SIM-16442
        }

        num = Math.round(num * Math.pow(10, digits)) / Math.pow(10, digits); //num = numberFilter()(num,digits);

        if (removeTrailingZeros) {
            return parseFloat(num).toString() + suffix;
        }

        num += suffix;
        return num;
    };
}

export function abbrNumberWithPrefixFilter() {
    return (num, prefix) => {
        if (typeof num === "string") {
            num = parseFloat(num);
        }
        return isNaN(num) ? abbrNumberFilter()(num) : `${prefix}${abbrNumberFilter()(num)}`;
    };
}

export function abbrNumberVisitsWithNullFilter() {
    return (num) => {
        if (num === null) {
            return "N/A";
        }
        return abbrNumberVisitsFilter()(num);
    };
}

export function abbrNumberWithNASupportVisitsFilter() {
    return (val) => {
        if (typeof val !== "number" || val === 0) {
            return "N/A";
        }
        return abbrNumberVisitsFilter()(val);
    };
}

export function abbrNumberVisitsFilter() {
    return (num) => {
        if (typeof num !== "number") {
            return 0;
        }

        if (typeof num === "string") {
            num = parseFloat(num);

            if (isNaN(num)) {
                return 0;
            }
        }

        num = Math.round(num);

        if (String(num).length < 7) {
            return numberFilter()(num);
        }

        let res;

        function getSubstrDigitsToShow(num: string, divider: number, letter: string) {
            const digitsToShow = 4;
            num = String(parseFloat(num) / divider).substring(0, digitsToShow + 1); // correct string to show 4 digits always

            let difference = num.length - (digitsToShow + 1);

            if (difference < 0) {
                difference = difference * -1 - 1;
                num += num.indexOf(".") != -1 ? "0" : ".";

                for (let i = 0; i < difference; i++) {
                    num += "0";
                }
            }

            return num + letter;
        }

        if (num >= 1000000000000) {
            // Trillions
            res = getSubstrDigitsToShow(num, 1000000000000, "T");
        } else if (num >= 1000000000) {
            // Billions
            res = getSubstrDigitsToShow(num, 1000000000, "B");
        } else if (num >= 1000000) {
            // Millions
            res = getSubstrDigitsToShow(num, 1000000, "M");
        }

        return res;
    };
}

export function reverseFilter() {
    return (items) => {
        if (angular.isArray(items)) {
            items = items.slice();
        } else {
            items = _.map(items, (v) => v);
        }

        return items.reverse();
    };
}

export function escapeFilter() {
    // @ts-ignore
    return window.escape;
}

export function rowIndexFilter() {
    return (val, rowCoefficient) => val + rowCoefficient;
}

export function appRankChangeFilter() {
    return (value, prefix) => {
        prefix = prefix || "";
        return _.isNull(value) || _.isUndefined(value)
            ? prefix + "-"
            : value === 0
            ? prefix + "="
            : Math.abs(value);
    };
}

export function appTooltipFilter() {
    return (val) => {
        if (!val) {
            return "";
        }
        const store = (val.AppStore || val.appStore || "").toLowerCase(),
            icon = val.Icon128 || val.Icon || val.icon || "",
            title = val.Title || val.title || "",
            author = val.Author || val.author || "";
        let price = val.Price || val.price || "";
        price = price.indexOf("0.0") != -1 ? "Free" : price;
        return (
            '<div class="tooltip-app-info"><img class="app-thumb" src="' +
            icon +
            '"/>' +
            '<div class="app-info">' +
            '<div class="app-name">' +
            title +
            "</div>" +
            '<div class="app-author">' +
            author +
            "</div>" +
            '<div class="app-price">' +
            price +
            "</div>" +
            '<div class="app-store ' +
            store +
            '-store-logo"></div>' +
            "</div></div>"
        );
    };
}

export function categoryFilterFilter() {
    return (val, appTitleFilter) => {
        const filterObj: { Category?: string; AppTitle?: string } = {};
        filterObj.Category = val.replace("/", ">");
        if (appTitleFilter) {
            filterObj.AppTitle = appTitleFilter;
        }
        return angular.toJson(filterObj);
    };
}

export function tableFilterFilter(swNavigator) {
    return (val, field) => {
        const filterObj = {};
        filterObj[field] = val;
        return swNavigator.href(swNavigator.current(), {
            filter: angular.toJson(filterObj),
            page: null,
        });
    };
}

export function adsFilterFilter(swNavigator) {
    return (val) => {
        const currentState = swNavigator.current();
        delete currentState.Keywords_filters;
        return swNavigator.href(currentState, {
            ...swNavigator.getParams(),
            selectedTab: "ads",
            Ads_filters: "Keyword;contains;" + val,
            search: val,
        });
    };
}

export function searchAdsFilterFilter(swNavigator, state = "websites-trafficSearch-ads") {
    return (val) => {
        const params = swNavigator.getParams();
        return swNavigator.href(
            state,
            _.merge(params, {
                Ads_filters: "Keyword;contains;" + val,
                search: val,
                Ads_page: 1,
                webSource:
                    params.webSource === "Total" || params.webSource === "Desktop"
                        ? "Desktop"
                        : "Mobile",
            }),
        );
    };
}

export function timeFrameTextFilter() {
    return (val) => {
        switch (val) {
            case 7:
                return "1 Week";
            case 30:
                return "1 Month";
            default:
                return val / 30 + " Months";
        }
    };
}

export function timeFrameProFilterFilter(swNavigator) {
    return (val) => {
        val = !val ? swNavigator.getParams().duration : val;

        switch (val) {
            case "1m":
                return "1 Month";
            case "3m":
                return "3 Months";
            case "6m":
                return "6 Months";
            case "12m":
                return "12 Months";
            case "18m":
                return "18 Months";
            case "24m":
                return "24 Months";
            case "28d":
                return "Last 28 days";
            default:
                return val;
        }
    };
}

export function appTitleFilter(chosenItems) {
    return (val) => chosenItems.getById(val).Title;
}

export function appColorFilter(chosenItems) {
    return (val) => (val ? chosenItems.getById(val).Color : "");
}

export function appIconFilter(chosenItems) {
    return (val) =>
        val
            ? chosenItems.getById(val).Icon
            : AssetsService.assetUrl("/Images/autocomplete-default.png");
}

export function siteColorFilter(chosenSites) {
    return (val) => (val ? chosenSites.getSiteColor(val) : "");
}

export function appAnalysisUrlFilter(swNavigator) {
    return (val, storeId, stateName) => {
        stateName = stateName || "apps-performance";
        const params = Object.assign({}, swNavigator.getParams(), {
            appId: /[01]_/.test(val) ? val : storeId + "_" + val,
        }); //adding default duration from the state user navigates to.

        if (!params.duration) {
            const state = swNavigator.getState(stateName),
                componentConfigId = swNavigator.getConfigId(state),
                componentConfig = componentConfigId
                    ? swSettings.components[componentConfigId]
                    : false,
                defaultDuration = componentConfig ? componentConfig.defaultParams.duration : false;
            if (defaultDuration) {
                params.duration = defaultDuration;
            }
        }

        return swNavigator.href(stateName, params);
    };
}

export function escapeHTMLFilter() {
    const escapeChars = {
        "¢": "cent",
        "£": "pound",
        "¥": "yen",
        "€": "euro",
        "©": "copy",
        "®": "reg",
        "<": "lt",
        ">": "gt",
        '"': "quot",
        "&": "amp",
        "'": "#39",
    };

    function makeString(object) {
        if (object == null) {
            return "";
        }
        return "" + object;
    }

    let regexString = "[";

    for (const key in escapeChars) {
        regexString += key;
    }

    regexString += "]";
    const regex = new RegExp(regexString, "g");
    return (str) => makeString(str).replace(regex, (m) => "&" + escapeChars[m] + ";");
}

export function toUtcFilter() {
    return (dateString) => {
        const date = dateString.split("-");
        return Date.UTC(parseInt(date[0]), parseInt(date[1]) - 1, parseInt(date[2]));
    };
}

/**
 * @deprecated import it instead from "filters/dynamicFilters"
 */
export function dynamicFilterFilter() {
    return (val, filter, undefinedSign = "N/A") => {
        if (!val) {
            return undefinedSign;
        }

        if (angular.isUndefined(filter)) {
            return val;
        }

        const filterSplitted = filter.split(":");
        const filterName = filterSplitted.shift();
        const filterArgs = filterSplitted;

        if (injector.has(filterName + "Filter")) {
            // check if the filter exists before using it
            const filterFn = injector.get<any>("$filter")(filterName);
            // eslint-disable-next-line prefer-spread
            return filterFn.apply(null, Array.prototype.concat([val], filterArgs));
        } else {
            return val;
        }
    };
}

export function capitalizeFilter() {
    return (input) => {
        if (input != null) {
            input = input.toLowerCase();
        }
        return input.substring(0, 1).toUpperCase() + input.substring(1);
    };
}

export function activityStreamPercentageFilter() {
    return (val) => {
        const percentageFilter = simplePercentageFilter();
        if (val < 10) {
            return numberFilter()(percentageFilter(val / 100, 2)) + "%";
        } else if (val >= 10 && val < 100) {
            return numberFilter()(percentageFilter(val / 100, 1)) + "%";
        } else if (val >= 100) {
            return numberFilter()(percentageFilter(val / 100)) + "%";
        }
    };
}

export function activityStreamDateFilter() {
    return (val) => dayjs(val).fromNow();
}

export function activityStreamPlacesChangeFilter() {
    return (val) => {
        const absChange = Math.abs(val);
        const suffix = absChange == 1 ? " place" : " places";
        return numberFilter()(absChange) + suffix;
    };
}

export function CPCFilter() {
    return (val) => {
        if (val == 0) {
            return "-";
        }

        return "$" + pureNumberFilter(val, "0,0.00[0]");
    };
}

export function CPCGroupFilter() {
    return (val) => {
        if (val === 0 || !val) {
            return "-";
        }
        const cpcFilter = (value) => "$" + pureNumberFilter(value, "0,0.00[0]");
        if (val?.includes("-")) {
            const cpcValues = val.split("-");
            const cpcMin = cpcFilter(cpcValues[0]);
            const cpcMax = cpcFilter(cpcValues[1]);
            if (cpcMin === "-" || cpcMax === "-") {
                return cpcMax === "-" ? cpcMin : cpcMax;
            }
            return `${cpcMin} - ${cpcMax}`;
        }
        return cpcFilter(val);
    };
}

export function avgKeywordPositionFilter() {
    return (value) => {
        if (value == 0 || value == 999) {
            return "N/A";
        }

        return numberFilter()(value, 0);
    };
}

export function keywordDestUrlFilter() {
    return (value) => {
        if (!value) {
            return "N/A";
        }

        return domain_outFilter()(value, null, value);
    };
}

export function swIconFilter() {
    return (val) => {
        if (!val) {
            return "";
        }
        return "sw-icon-" + val.toLowerCase().replace(" ", "-");
    };
}

export function rawHtmlFilter($sce) {
    return (val) => $sce.trustAsHtml(val);
}

export function verifyProtocolExistenceFilter() {
    return (url) => {
        if (_.startsWith(url, "//")) {
            url = location.protocol + url;
        } else if (_.startsWith(url, "/")) {
            url = location.origin + url;
        } else if (!_.startsWith(url, "http://") && !_.startsWith(url, "https://")) {
            url = "http://" + url;
        }

        return url;
    };
}

export function extractDomainNameFilter() {
    return (url) => {
        let isFullUrl = false;
        url = $.trim(url)
            .replace(/^https?:\/\//, "")
            .replace(/^www\./, "");
        const idx = url.indexOf("/");

        if (~idx) {
            isFullUrl = idx < url.length - 1;
            url = url.substring(0, idx);
        }

        url.replace(/\/\//g, "/");

        if (~url.indexOf(".")) {
            return url;
        }

        return null;
    };
}

export function socialHandleFilter() {
    return (socialUrl, companyName) => {
        const label = $.trim((socialUrl || "").split("/").pop().split("?").shift());

        if (companyName && label.toLowerCase() === companyName.toLowerCase()) {
            return companyName;
        }

        return label;
    };
}

export function noDataFilter() {
    return (value, noDataString, noDataReplacementSymbol) => {
        const notDataRegexp = new RegExp(noDataString, "ig");

        if (notDataRegexp.test(value) && value.toString) {
            return value.toString().replace(notDataRegexp, noDataReplacementSymbol);
        } else {
            return value;
        }
    };
}

export function keywordAnalysisHrefFilter(swNavigator) {
    return (domain, params) => {
        const currentParams = swNavigator.getParams();
        const keywordsParams: any = _.pick(currentParams, ["country", "duration"]);
        const isPaid = _.endsWith(currentParams.Keywords_filters, "1") || (params && params.isPaid);

        keywordsParams.keyword = domain;

        if (isPaid) {
            return swNavigator.href("keywordAnalysis-paid", keywordsParams);
        } else {
            return swNavigator.href("keywordAnalysis-organic", keywordsParams);
        }
    };
}

export function TrafficSourcesSearchHrefFilter(swNavigator) {
    return (domain, webSource, booleanSearchTerms = []) => {
        webSource = webSource || "Desktop";
        const currentParams = swNavigator.getParams();
        const tsPageParams = _.pick(currentParams, ["country", "duration"]) as any;
        const isPaid = _.endsWith(swNavigator.current().name, "paid");
        const isOrganic = _.endsWith(swNavigator.current().name, "organic");
        const BooleanSearchTerms = booleanSearchToString(booleanSearchTerms);
        const IncludeTerms = booleanSearchToStringIncludeTerms(booleanSearchTerms);

        Object.assign(tsPageParams, {
            key: domain || currentParams.key,
            isWWW: "*",
            Keywords_page: 1,
            webSource,
            IncludeOrganic: isOrganic,
            IncludePaid: isPaid,
            BooleanSearchTerms,
            IncludeTerms, //Hotfix: SIM-31477
        });

        if (isPaid) {
            tsPageParams.Keywords_filters = "OP;==;1";
        } else {
            tsPageParams.Keywords_filters = "OP;==;0";
        }

        return swNavigator.href("websites-trafficSearch-keywords", tsPageParams);
    };
}

export function abbrNumberInfoSideBarFilter() {
    return (num, ceilSmallNum, toFixed) => {
        if (typeof num !== "number") {
            num = 0;
        }

        if (num === Infinity) {
            return "&infin;";
        }

        if (num === -Infinity) {
            return "-&infin;";
        }

        let digits,
            suffix = "";

        if (ceilSmallNum && num < 5000) {
            return "< 5K";
        }

        if (num >= 1000000000) {
            // Billions
            num = num / 1000000000; // Transform 12345678 to 12.3

            digits = 2;
            suffix = "B";
        } else if (num >= 1000000) {
            // Millions
            num = num / 1000000; // Transform 12345678 to 12.3

            digits = 2;
            suffix = "M";
        } else if (num >= 1000) {
            // Thousands
            num = num / 1000; // Transform 12345 to 12.3

            digits = 1;
            suffix = "K";
        } else {
            digits = 3;
        }

        if (toFixed) {
            num = num.toFixed(digits);
        } else {
            num = numberFilter()(num, digits);
        }

        num += suffix;
        return num;
    };
}

export function noFractionNumberFilter() {
    return (val) => numberFilter()(val, 0);
}

export function deviceTrafficShareFilter() {
    return (data, key) => {
        if (!data) {
            return "";
        }

        const total = _.sum(_.values(data));

        return percentageSignFilter()(data[key] / total, 2);
    };
}

export function i18nTemplateFilter() {
    return (templateStr, params) => {
        // replace text inside %%
        try {
            return _.template(i18nFilter()(templateStr), {
                interpolate: /%([\s\S]+?)%/g,
            })(params);
        } catch (e) {
            return i18nFilter()(templateStr);
        }
    };
}

export function adUnitFilter() {
    return (value) => {
        let targetUrl = value.Page || value.URL;
        const ellipsis = ellipsisFilter();

        if (!/^http/i.test(targetUrl)) {
            targetUrl = "http://" + targetUrl;
        }

        return [
            '<div class="ad-unit">' +
                '<h3 sw-titelize="' +
                value.Title +
                '" sw-titelize-tooltip-only>' +
                ellipsis(value.Title, 40) +
                "</h3>" +
                '<a href="' +
                targetUrl +
                '" target="_blank">' +
                ellipsis(value.URL, 40) +
                "</a>" +
                "<p>" +
                ellipsis(value.Description, 200) +
                "</p>" +
                "</div>",
        ].join("");
    };
}

export function keywordsListFilter() {
    return (value) => {
        let result = '<div class="keywords">';

        for (let i = 0; i < value.length; i++) {
            result += "<div class='keyword'>" + value[i] + "</div>";
        }

        result += "</div>";
        return result;
    };
}

export function webSourceTextFilter(swNavigator) {
    return (value) => {
        const SOURCES_TEXT = {
            websites: {
                Total: "All Traffic",
                Combined: "All Traffic",
                MobileWeb: "Mobile Web Only",
                "Mobile Web": "Mobile Web Only",
                Desktop: "Desktop Only",
            },
            accountreview_website_overview_websiteperformance: {
                ...this.websites,
            },
            competitiveanalysis_website_overview_websiteperformance: {
                ...this.websites,
            },
            companyresearch_websiteperformance: {
                ...this.websites,
            },
            affiliateanalysis_performanceoverview: {
                ...this.websites,
            },
            companyresearch_website_websiteperformance: {
                ...this.websites,
            },
            findaffiliates_bycompetition: {
                ...this.websites,
            },
            industryAnalysis: {
                Desktop: "Desktop Only",
            },
            apps: {
                Google: "Google Play",
                Apple: "Apple Store",
                google: "Google Play",
                apple: "Apple Store",
            },
            keywords: {
                Google: "Google Play",
            },
            keywordAnalysis: {
                Desktop: "Desktop Only",
            },
        };
        return SOURCES_TEXT[swNavigator.getCurrentModule()][value] || "";
    };
}

export function webSourceTextSlimFilter() {
    return (value) => {
        const SOURCES_TEXT = {
            Total: "All Traffic",
            Combined: "All Traffic",
            MobileWeb: "Mobile Web",
            "Mobile Web": "Mobile Web",
            Desktop: "Desktop",
        };
        return SOURCES_TEXT[value] || "";
    };
}

export function industryKeyToTitleFilter() {
    const customPrefix = "*";
    const keyPrefix = "$";
    const spaceDelimeter = "_";
    const arrowDelim = "~";

    function removePrefix(value, keyPrefix) {
        if (value && value.length > 0 && value.indexOf(keyPrefix) == 0) {
            return value.substring(1, value.length);
        }

        return value;
    }

    return (value) => {
        if (value && value.length > 0) {
            if (value === "$All" || value === "All") {
                return "All categories";
            }
            return removePrefix(
                removePrefix(value, keyPrefix)
                    .replace(new RegExp(spaceDelimeter, "g"), " ")
                    .replace(arrowDelim, " > "),
                customPrefix,
            );
        }

        return value;
    };
}

export function industryKeyToIconFilter() {
    return (value) => {
        if (value === "$All" || value === "All") {
            return "sw-icon-categories";
        } else if (value.substring(0, 1) == "*" || value.substring(0, 2) == "$*") {
            return "sw-icon-custom-categories";
        } else {
            return "sprite-category " + value.split("~")[0].replace("$", "");
        }
    };
}

export function geoHrefFilter(swNavigator) {
    return (domain) => {
        const params = swNavigator.getParams();

        if (!_.isEmpty(domain)) {
            params.key = domain;
        }

        return swNavigator.href("websites-audienceGeography", params);
    };
}

export function sourceStrength() {
    return (strengthNum) => {
        const strengths = {
            3: i18nFilter()("apps.storeanalysis.instore.keywords.table.sourcestrength.high"),
            2: i18nFilter()("apps.storeanalysis.instore.keywords.table.sourcestrength.medium"),
            1: i18nFilter()("apps.storeanalysis.instore.keywords.table.sourcestrength.low"),
        };
        return strengths[strengthNum] || "-";
    };
}

export const sourceStrengthFilter = sourceStrength;

export function adsTargetURL() {
    return function (args) {
        const { FullPage, Page, DestUrl } = args;
        let targetURL = FullPage || Page || DestUrl;
        if (targetURL.startsWith("/")) {
            return;
        }
        if (!targetURL.startsWith("http")) {
            targetURL = `http://${targetURL}`;
        }
        return targetURL;
    };
}

export const adsTargetURLFilter = adsTargetURL;

export function markerFilter() {
    return (val) => ChartMarkerService.createMarkerStyle(val);
}

export function prettifyConversionCategory(item1, item2?) {
    return item2 ? _.startCase(item1) + " > " + _.startCase(item2) : _.startCase(item1);
}
