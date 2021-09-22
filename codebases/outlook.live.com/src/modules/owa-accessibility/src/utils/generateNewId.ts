let id = 0;

export function generateNewId(prefix: string = 'id') {
    return `${prefix}${id++}`;
}
