export const replaceAllSpacesBy = (str: string, by: string): string => {
    if (str) {
        return str.replace(/ /g, by);
    }

    return "";
};
