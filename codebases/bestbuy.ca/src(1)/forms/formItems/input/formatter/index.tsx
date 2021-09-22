const isValidChar = (value, formatChar) => {
    switch (formatChar) {
        case "#":
            return !isNaN(parseInt(value, 10));
        case "@":
            return value.match(/[a-z]/i);
        case "*":
            return value;
    }
};
const getFormatChars = (formatMask, start) => {
    return formatMask.substr(start).split(/[@*#]+/)[0];
};
const getRawValue = (value, formatMask) => {
    return formatMask
        .split("")
        .map((char, i) => (isValidChar(value.charAt(i), formatMask.charAt(i)) ? value.charAt(i) : ""))
        .join("");
};
export default (value = "", formatMask = "") => {
    if (!formatMask) {
        return { formatted: value, raw: value };
    }
    let formatted = "";
    for (let i = 0; i < value.length && i < formatMask.length; i++) {
        const inputVal = value.charAt(i);
        if (inputVal !== formatMask.charAt(formatted.length)) {
            const chars = getFormatChars(formatMask, formatted.length);
            formatted += chars;
        }
        if (isValidChar(inputVal, formatMask.charAt(formatted.length))) {
            formatted += inputVal;
        }
    }
    return { formatted, raw: getRawValue(formatted, formatMask) };
};
//# sourceMappingURL=index.js.map