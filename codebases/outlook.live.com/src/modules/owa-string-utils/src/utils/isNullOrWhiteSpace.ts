/**
 * Checks if a given string is null, empty, or consists only of white-space characters.
 * @param text: the string to check
 */
export function isNullOrWhiteSpace(text: string): boolean {
    return text == null || text.trim().length == 0;
}
