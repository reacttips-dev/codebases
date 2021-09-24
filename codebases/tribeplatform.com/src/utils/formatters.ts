const COUNT_ABBRS = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
export const formatCount = (count, withAbbr = true, decimals = 1) => {
    const i = count === 0 ? count : Math.floor(Math.log(count) / Math.log(1000));
    let result = `${parseFloat((count / 1000 ** i).toFixed(decimals))}`;
    if (withAbbr) {
        result += `${COUNT_ABBRS[i]}`;
    }
    return result;
};
export const formatNumberWithCommas = (value) => {
    const valueAsNumber = Number(value);
    return Number.isNaN(valueAsNumber)
        ? String(value)
        : valueAsNumber.toLocaleString('en-US');
};
//# sourceMappingURL=formatters.js.map