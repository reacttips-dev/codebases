/**
 * Creates a regular expression from the parameters
 * @param regExValue The regular expression value
 * @param ignoreCase Whether or not to ignore case
 * @returns a regular expression evaluator
 */
function createRegularExpression(regExValue: string, ignoreCase: boolean): RegExp {
    let options = 'g';
    let regex: RegExp;

    if (ignoreCase) {
        options = 'ig';
    }

    try {
        regex = new RegExp(regExValue, options);
    } catch (e) {
        // The regular expression was invalid
        return null;
    }

    return regex;
}

/**
 * Creates a regular expression evaluator and evaluates the string provided
 * @param body the string to evaluate
 * @param regExValue the regex evaluator in string representation
 * @param ignoreCase whether or not to ignore case
 */
export default function evaluateRegularExpression(
    body: string,
    regExValue: string,
    ignoreCase: boolean
): RegExpMatchArray {
    return body && body.match(createRegularExpression(regExValue, ignoreCase));
}
