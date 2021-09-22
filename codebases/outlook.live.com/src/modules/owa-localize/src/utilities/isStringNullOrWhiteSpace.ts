export const isStringNullOrWhiteSpace = (str: string | null | undefined) =>
    !str || /^\s*$/.test(str);
