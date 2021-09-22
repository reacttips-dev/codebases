export const mapToSalesforceValues = (data: {}, acc: {}, fieldName: string) => {
    if (fieldName === "emailOptOut") {
        acc[fieldName] = data[fieldName].value === "checked" ? 0 : 1;
    } else if (fieldName === "00Nf400000KIAcP") {
        acc[fieldName] = data[fieldName].value === "checked" ? 1 : 0;
    } else {
        acc[fieldName] = data[fieldName].value;
    }
    return acc;
};
