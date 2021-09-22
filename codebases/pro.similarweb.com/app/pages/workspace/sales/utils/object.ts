export const isNotEmptyObject = (object: Record<string, any>): boolean =>
    !!Object.keys(object).length;

export const mapOnObjectKeys = (
    object: Record<string, any>,
    mapFunction: (value: string, index: number, array: string[]) => unknown,
): any[] => Object.keys(object).map(mapFunction);

export const mapOnObjectValues = (
    object: Record<string, any>,
    mapFunction: (value: string, index: number, array: string[]) => unknown,
): any[] => Object.values(object).map(mapFunction);
