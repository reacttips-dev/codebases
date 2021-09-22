export var displayPrice = function (price, trailingZeros) {
    var formattedNumber = price.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (!trailingZeros && Number.isInteger(price.value)) {
        formattedNumber = formattedNumber.substring(0, formattedNumber.length - 3);
    }
    if (price.commasForDecimals) {
        formattedNumber = formattedNumber.replace('.', ',');
    }
    return price.symbolAfterValue ? formattedNumber + price.symbol : price.symbol + formattedNumber;
};
//# sourceMappingURL=price-formatter.js.map