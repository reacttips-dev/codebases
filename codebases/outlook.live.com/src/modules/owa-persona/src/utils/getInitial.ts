const charsWithinParenthesisRegex = /\(([^)]*)\)/gi;
const excludedCharactersRegex = /\([^)]*\)|[\0-\u001F\!-/:-@\[-`\{-\u00BF\u0250-\u036F\uD800-\uFFFF]/gi;
const multipleSpacesRegex = /\s+/gi;
export default function getInitial(name: string): string {
    let initials = '';
    if (!name) {
        return initials;
    }
    name = name.replace(charsWithinParenthesisRegex, ''); // remove chars inside paranthesis
    name = name.replace(excludedCharactersRegex, ''); // remove non-alphanumeric chars
    name = name.replace(multipleSpacesRegex, ' '); // replace multiple spaces with single
    name = name.trim();
    let splits = name.split(' ');
    if (splits.length >= 2) {
        initials += splits[0].charAt(0).toUpperCase();
        initials += splits[splits.length - 1].charAt(0).toUpperCase();
    } else if (splits.length != 0) {
        initials += splits[0].charAt(0).toUpperCase();
    }
    return initials;
}
