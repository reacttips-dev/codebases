export interface CSSClassMapping {
    [key: string]: boolean | undefined | null | string;
}

export type ClassnamesTypes = string | undefined | null | Array<string | undefined | null | false | CSSClassMapping>;

const normalizeClass = (name: any, defaultVal: string = "") => {
    if (name === undefined || name === "undefined" || name === null || name === "null") {
        return defaultVal;
    }
    return name;
};

const isObjectType = (input: any): boolean =>
    input && typeof input !== "string" && typeof input === "object" && !Array.isArray(input);

/**
 * "classname" is a normalizing method for classNames. It will strip out null & undefined
 * values from your classNames, keeping them clean.
 *
 * @param classNames - A single className or an array of classNames or an object of type { className: boolean }.
 * @param defaultVal - Default value to be used if given className(s) are undefined or null.
 */
export const classname = (classNames: ClassnamesTypes, defaultVal: string = ""): string => {
    if (Array.isArray(classNames)) {
        const test = classNames
            .map((name) => {
                if (isObjectType(name)) {
                    return handleObjectType(name);
                }
                return normalizeClass(name, defaultVal);
            })
            .filter((name) => name)
            .join(" ");
        return test.trim();
    }

    return normalizeClass(classNames, defaultVal);
};

export const handleObjectType = (inputObjt: CSSClassMapping): string => {
    const cssClasses: string[] = [];

    Object.keys(inputObjt).forEach((key) => {
        const value = inputObjt[key];
        if (Boolean(value)) {
            cssClasses.push(key);
        }
    });

    return cssClasses.join(" ").trim();
};

/**
 * "classIf" is a method to safely add className to react components based on conditions.
 *
 * @param names classname to be used when condition is truthy.
 * @param condition boolean/condition to be validated.
 * @param defaultVal default value to be used as a class name when condition is falsey.
 */
export const classIf = (names: string | string[], condition: boolean, defaultVal: string = "") =>
    !!condition ? classname(names) : defaultVal;
