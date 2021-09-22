// If we are logging 50 properties with the same name, then it is probably a bug
// and we want to avoid getting stuck in an infinite loop
const SanityCheck = 50;

export function getUniquePropertyString(obj: any, propertyName: string): string | undefined {
    if (propertyName == null || propertyName == undefined) {
        return undefined;
    }

    let [propertyNamekey, num] = parsePropertyName(propertyName);
    for (var ii = 0; obj[propertyName] != undefined; ii++) {
        propertyName = propertyNamekey + '_' + (<number>num)++;
        if (ii >= SanityCheck) {
            throw new Error('GUP:' + propertyName);
        }
    }

    return propertyName;
}

export function parsePropertyName(propertyName: string) {
    let lastIndex = propertyName.lastIndexOf('_');
    if (lastIndex > -1) {
        let propertyNameKey = propertyName.slice(0, lastIndex);
        let num = parseInt(propertyName.slice(lastIndex + 1));
        if (!isNaN(num)) {
            return [propertyNameKey, num];
        }
    }
    return [propertyName, 1];
}
