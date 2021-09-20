export const struct = {
    versionNumber: '6.0.0',
    divider: '–',
    nameConcept: 'Concept',
    nameAtomSummary: 'Atom Summary',
    nameAtomType: 'Atom Type',
    nameTableId: 'Table ID',
    nameUUID: 'UUID',
    nameKeyPoints: 'Key Points',
    nameStatus: 'Status',
    nameSlideDeck: 'Slide Deck',
    nameImportIgnore: 'Import – Ignore',
    nameVisualSegmentSlides: 'Slides',
    nameVisualSegmentWalkthru: 'Walkthru',
    exportsFolderName: 'JSON Exports',
    folderNameSlides: 'Lesson Slides',
    lessonSpreadsheetFilename: 'Lesson Plan',
    lessonSheetName: 'Lesson Plan Sheet',
    lessonTableTitle: 'Title',
    lessonTableDescription: 'Description',
    lessonTableSlideDeck: 'Slide Deck',
    lessonTableDuration: 'Duration',
    lessonTableUUID: 'UUID',
    settingStandaloneScriptName: 'standalone-script',
    colorDefaultColor: '#ffffff',
    colorReview: '#fffd35',
    colorApproved: '#50e850',
    colorLocked: '#0acaff',
    colorError: '#d32f2f',
    colorTextNote: '#999999',
    colorEditableArea: '#caffed',
    colorNoneditableArea: '#f7f7f7',
    colorMatchingQuizBackground: '#f7f7f7',
    colorTableBorder: '#dfdfd1',
    lessonSpreadsheetTemplateFileId: '1nimA4KxJN6fyXwHVWimLdZZtzFGe65C47hQ7bGK_4g4',
    slideTemplateId: '1LMs2IJth5A4OfvHA8nXigzk4oHTDxFl3U__ZkrLUe_g',
    imageAtomDefaultImage: '0B5nbIGU1JkWAUHJGWUl1VW1TWVU',
    adminUsers: ['richard@udacity.com'],
    quizPromptCharacterLimit: 400,
    quizOptionCharacterLimit: 200,
    quizCorrectFlag: 'x',
    videoAtoms: ['Headshot', 'Screencast', 'Headshot + Screencast'],
    multiColumnVideoAtoms: ['Screencast', 'Headshot + Screencast'],
    headshotAtoms: ['Headshot', 'Headshot + Screencast'],
    allowedTypes: [
        'Concept',
        'Headshot',
        'Screencast',
        'Headshot + Screencast',
        'Image',
        'Text',
        'Q : TaskList',
        'Q : Checkbox',
        'Q : Radio',
        'Q : Matching',
        'Q : RegEx',
        'Q : Free Response',
        'Workspace',
    ],
};

/**
 * Removes the Atom's status indicators from the text.
 *
 * @param {string} text
 * @returns {string} The text without any status.
 */
function stripStatusFromContent(text) {
    const parts = text.split(struct.divider);

    if (parts.length <= 3) {
        return text;
    }

    return (
        parts[0] +
        struct.divider +
        ' ' +
        parts[1].trim() +
        ' ' +
        struct.divider +
        ' ' +
        parts[2].trim()
    );
}

/**
 * Removes the Atom Number from the provided string.
 *
 * @param text A table's heading.
 * @returns The text without the Atom Number.
 */
function stripOutAtomNumber(text) {
    if (text.indexOf(struct.nameConcept) === 0) {
        return text;
    }

    const dividerPosition = text.indexOf(struct.divider);

    return text.substring(dividerPosition + 1).trim();
}

/**
 * Retrieves the Title object from the provided Table row.
 *
 * @param row A row from a table.
 * @returns {Element} The Element Interface containing the Table title.
 */
function getTitleObjectFromRow(row) {
    return row.getCell(0).getChild(0);
}

/**
 * Retrieves the text of the title of the provided Table row.
 *
 * @param row A row from a table.
 * @returns {string} The text of the Table title.
 */
function getTitleTextFromRow(row) {
    return stripOutAtomNumber(
        stripStatusFromContent(getTitleObjectFromRow(row).getText())
    );
}

/**
 * Retrieves the text of the title of the provided Table.
 *
 * @param table A table.
 * @returns {string} The text of the Table title.
 */
function getTitleTextFromTable(table) {
    const headerRow = table.getRow(0);
    return getTitleTextFromRow(headerRow);
}

/**
 * Gets the type of the provided table.
 *
 * @param {Table} table A table that was created.
 * @returns {string} The type of the table.
 */
export function getTableType(table) {
    var text = stripStatusFromContent(getTitleTextFromTable(table));

    return text.split(struct.divider)[0].trim();
}

/**
 * Gets the heading of the provided table.
 *
 * @param {Table} table A table that was created.
 * @returns {string} The type of the table.
 */
export function getTableHeading(table) {
    var text = stripStatusFromContent(getTitleTextFromTable(table));

    return text.split(struct.divider)[1].trim();
}

// Create a random key
function fakeKey(length = 8) {
    var text = '';
    var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

/**
 * Gets the UUID for the provided table.
 *
 * @param {Table} table A table.
 * @returns {String} The table's UUID.
 */
export function getTableUUID(table, lessonMajorVersion = 8) {
    if (lessonMajorVersion === 7) {
        return getTableUUID_v7(table);
    } else {
        return getTableUUID_v8(table);
    }
}

export function getTableUUID_v7(table) {
    const headerText = table.getRow(0).getCell(0).getText();
    const regex = struct.nameUUID + ' ' + struct.divider + ' (.*)';
    const matches = headerText.match(regex);

    if (matches.length === 2) {
        return matches[1];
    }
    console.warn(`Missing key for ${getTableHeading(table)}`);
    return fakeKey(16);
}

/**
 * Gets the UUID for the provided table.
 *
 * @param {Table} table A table.
 * @returns {String} The table's UUID.
 */
export function getTableUUID_v8(table) {
    try {
        const uuid = table
            .getRow(0)
            .getCell(0)
            .getChild(1)
            .getElement()
            .getRow(1)
            .getCell(1)
            .getText();

        if (!uuid) {
            console.warn(`Missing key for ${getTableHeading(table)}`);
            return fakeKey(16);
        }

        return uuid;
    } catch (error) {
        console.warn(`Missing key for ${getTableHeading(table)}`);
        return fakeKey(16);
    }
}