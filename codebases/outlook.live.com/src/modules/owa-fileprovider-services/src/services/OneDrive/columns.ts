export const COLUMN_NAMES = Object.freeze({
    name: 'name',
    size: 'size',
    lastModifiedBy: 'lastModifiedBy',
    lastModifiedDateTime: 'lastModifiedDateTime',
    file: 'file',
    folder: 'folder',
    id: 'id',
    webDavUrl: 'webDavUrl',
    package: 'package',
    shared: 'shared',
});

/**
 * Return all the column names joined by ',' e.g. name,size,id...
 */
export function getAllColumnNames(): string {
    return Object.keys(COLUMN_NAMES)
        .map(k => COLUMN_NAMES[k])
        .join(',');
}
