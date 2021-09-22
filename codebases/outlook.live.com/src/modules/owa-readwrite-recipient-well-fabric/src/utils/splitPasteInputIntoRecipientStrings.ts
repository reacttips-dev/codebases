// the no-control-regex rule fires inappropriately on a '\uXXXX' included control char
/* tslint:disable-next-line:no-control-regex*/
const SEPARATOR_REGEX = new RegExp(';|,|\\n|\u000A', 'g');
export const splitPasteInputIntoRecipientStrings = (inputText: string) =>
    inputText
        .split(SEPARATOR_REGEX)
        .map((token: string) => token.trim())
        .filter((token: string) => !!token);
