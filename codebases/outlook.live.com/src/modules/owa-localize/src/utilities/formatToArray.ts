/**
 * This function returns formatted string as an array, specifically so React can
 * render it (it can handle a mixed array of strings and JSX). This allows us to
 * format strings with React components, which is the correct thing to do with
 * accessibility (for RTL).
 */
export function formatToArray<T>(
    template: string,
    ...values: Array<string | T>
): Array<string | T> {
    // Regex that finds {#} so it can be replaced by the arguments in string format.
    const FORMAT_REGEX = /\{(\d+)\}/g;

    const parts: Array<string | T> = [];

    let regexResult: RegExpExecArray | null;
    let lastIndex = 0;
    while ((regexResult = FORMAT_REGEX.exec(template))) {
        // The full string of characters matched.
        const match: string = regexResult[0];

        // Get replacement value.
        const valueIndex = parseInt(match.replace(/\{|\}+/g, ''), 10);
        const replacementValue = values[valueIndex];

        // Get text between tokens and add to our array.
        if (regexResult.index > lastIndex) {
            parts.push(template.substring(lastIndex, regexResult.index));
        }

        // Save last index.
        lastIndex = FORMAT_REGEX.lastIndex;

        // Add replacement value to our array.
        parts.push(replacementValue);
    }

    // Grab any remaining text after the last match.
    if (lastIndex !== template.length) {
        parts.push(template.substring(lastIndex, template.length));
    }

    return parts;
}
