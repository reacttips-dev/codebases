/**
 * Gets the order of the date specifiers in the date format. Ex: 'dMy' | 'Mdy' | 'ydM' | 'yMd'.
 * Note: there is no dyM or Myd in the supported date formats.
 */
export function getDateSpecifiersOrder(dateFormat: string) {
    return dateFormat
        .replace(/'[^']*'|[^dMy]/g, '') // extract the day, month and year specifiers
        .replace(/(d|M|y)\1+/g, '$1') // make them all one-letter
        .substr(-3); // sah/sah-RU goes from 'dd yyyy MM d' to 'dyMd' to 'yMd'
}
