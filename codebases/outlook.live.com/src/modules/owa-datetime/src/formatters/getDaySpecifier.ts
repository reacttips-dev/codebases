/** Gets the day specifier found in the date format. Ex: d or dd. */
export function getDaySpecifier(dateFormat: string) {
    const match = dateFormat.match(/d{1,2}/);
    return match ? match[0] : 'd';
}
