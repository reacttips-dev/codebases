/**
 * Returns true if the format specifier s1 exists and
 * comes before an optional format specifier s2 in the given format string.
 */
export default function isOneSpecifierBeforeTheOther(
    format: string,
    s1: string,
    s2: string
): boolean {
    let index1 = format.indexOf(s1);
    let index2 = format.indexOf(s2);
    return index1 != -1 && (index2 == -1 || index1 < index2);
}
