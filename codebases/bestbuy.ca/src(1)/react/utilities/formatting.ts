export const formatPrice = (val, locale = "en") => {
    if (global.isNaN(val)) {
        return "-";
    }
    const returnVal = Number(val).toFixed(2);
    if (locale.substring(0, 2) === "fr") {
        return returnVal.replace(".", ",") + " $";
    }
    return "$" + returnVal;
};
export const formatDistance = (val, locale = "en") => {
    const strVal = String(val);
    if (locale.substring(0, 2) === "fr") {
        return strVal.replace(".", ",");
    }
    return strVal;
};
/*---Field Formatting---*/
/*---------------------------------------------------------*/
export var FormatTypes;
(function (FormatTypes) {
    FormatTypes["card"] = "#### #### #### ####";
    FormatTypes["amex"] = "#### ###### #####";
    FormatTypes["postalcode"] = "### ###";
    FormatTypes["phone"] = "(###) ###\u2013####";
    FormatTypes["zipcode"] = "#####";
})(FormatTypes || (FormatTypes = {}));
export const setFormat = (value, pattern) => {
    let i = 0;
    value = value.split(" ").join("");
    switch (pattern) {
        case FormatTypes.postalcode:
            value = value.toUpperCase();
            break;
    }
    return pattern.replace(/#/g, () => value[i++] || "");
};
const regionCodeToNameMap = new Map();
regionCodeToNameMap.set("ab", "Alberta");
regionCodeToNameMap.set("bc", "British Columbia");
regionCodeToNameMap.set("mb", "Manitoba");
regionCodeToNameMap.set("nb", "New Brunswick");
regionCodeToNameMap.set("nl", "Newfoundland and Labrador");
regionCodeToNameMap.set("ns", "Nova Scotia");
regionCodeToNameMap.set("on", "Ontario");
regionCodeToNameMap.set("pe", "Prince Edward Island");
regionCodeToNameMap.set("qc", "Quebec");
regionCodeToNameMap.set("sk", "Saskatchewan");
export const getEnRegionName = (regionCode) => {
    if (regionCode && regionCodeToNameMap.has(regionCode.toLowerCase())) {
        return regionCodeToNameMap.get(regionCode.toLowerCase());
    }
    return "";
};
//# sourceMappingURL=formatting.js.map