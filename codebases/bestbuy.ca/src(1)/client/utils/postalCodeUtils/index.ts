export function stripWhiteSpaceFromPostalCode(postalCode: string = ""): string {
    return postalCode.replace(/\s+/g, "");
}

export function isEmptyPostalCode(postalCode: string): boolean {
    const formatedPostalCode = stripWhiteSpaceFromPostalCode(postalCode);
    return formatedPostalCode.length === 0;
}

export function isCanadianPostalCode(postalCode: string): boolean {
    const regex = /(^([a-z]\d[a-z]))\s?(\d[a-z]\d)?/;
    const formatedPostalCode = postalCode.toLocaleLowerCase();

    return formatedPostalCode.match(regex) !== null;
}
