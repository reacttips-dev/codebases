/**
 * @property {Number} startIndex
 * @property {Number} endIndex
 * @property {Object} paragraph
 * @property {Object} sectionBreak
 * @property {Table} table
 * @property {TableOfContents} tableOfContents
 */
export class StructuralElement {
    constructor(content) {
        if (content.paragraph) {
            this._elements = content.paragraph.elements;
            this.type = 'paragraph';
        } else if (content.table) {
            /*eslint-disable no-use-before-define*/
            this._elements = new Table(content.table);
            this.type = 'table';
        }
    }

    /**
     * Retrieves the Title object from the provided Table row.
     * @returns {String} Title
     */
    getText() {
        if (this.type === 'table') {
            return this._elements.getText();
        }
        return this._elements
            .filter((el) => el.textRun && el.textRun.content)
            .map((el) => {
                const content = el.textRun.content;
                return content;
            })
            .join('');
    }

    getElement() {
        return this._elements;
    }
}

export class Cell {
    /**
     * Initial a row with same API for the Google App Scripts
     * @param {StructuralElement} element Row object get from Google Doc API
     */
    constructor(element) {
        this._elements = (element.content || []).map(
            (e) => new StructuralElement(e)
        );
    }

    /**
     * Get a single child by index
     * @param {Number} i The index position for the cell
     * @returns {StructuralElement} Table Cell
     */
    getChild(i) {
        return this._elements[i];
    }

    /**
     * @returns {Array<StructuralElement>} Table contents
     */
    getChildren() {
        return this._elements;
    }

    /**
     * Retrieves the Title object from the provided Table row.
     * @returns {String} Title
     */
    getText() {
        return this._elements.map((el) => el.getText()).join('');
    }

    /**
     * @returns {Table} tables
     */
    findTable(index) {
        const children = this.getChildren().filter((c) => c.type === 'table');
        const useIndex = index || 0;
        if (useIndex < children.length) {
            return children[useIndex].getElement();
        }
    }
}

export class Row {
    /**
     * Initial a row with same API for the Google App Scripts
     * @param {StructuralElement} element Row object get from Google Doc API
     */
    constructor(element) {
        this._cells = (element.tableCells || []).map((c) => new Cell(c));
    }

    /**
     * Get a single cell by index
     * @param {Number} i The index position for the cell
     * @returns {Cell} Table Cell
     */
    getCell(i) {
        return this._cells[i];
    }

    /**
     * Get cells of a row
     * @returns {Array<Cell>} list of cells
     */
    getCells() {
        return this._cells;
    }

    /**
     * Retrieves the Title object from the provided Table row.
     * @returns {String} Title
     */
    getText() {
        return this._cells.map((el) => el.getText()).join('');
    }

    /**
     * @returns {Table} tables
     */
    findTable(index) {
        for (const i of this.getCells()) {
            const children = i.getChildren().filter((c) => c.type === 'table');
            const useIndex = index || 0;
            if (useIndex < children.length) {
                return children[useIndex].getElement();
            }
        }
    }

    /**
     * @returns {Table} table based on title
     */
    findTableByTitlePrefix(title) {
        for (const i of this.getCells()) {
            const children = i.getChildren().filter((c) => c.type === 'table');
            for (const child of children) {
                const table = child.getElement();
                if (_.startsWith(table.getRow(0).getText(), title)) {
                    return table;
                }
            }
        }
    }

    /**
     * @returns {String} cell value (col 1) based on cell title (col 0) in a two-column embedded table
     */
    findCellValueByTitlePrefix(title) {
        for (const i of this.getCells()) {
            const children = i.getChildren().filter((c) => c.type === 'table');
            for (const child of children) {
                const table = child.getElement();
                for (const row of table.getRows()) {
                    const cellTitle = row.getCell(0).getText().trim();
                    if (_.startsWith(cellTitle, title)) {
                        return row.getCell(1).getText().trim();
                    }
                }
            }
        }
    }
}

export class Table {
    /**
     * Initial a table with same API for the Google App Scripts
     * https://developers.google.com/docs/api/reference/rest/v1/documents#structuralelement
     * @param {StructuralElement} table Structural element object get from Google Doc API
     */
    constructor(element) {
        this._rows = (element.tableRows || []).map((r) => new Row(r));
    }

    /**
     * Get a single table row by index
     * @param {Number} i The index position for the table
     * @returns {Row} Table Row
     */
    getRow(i) {
        return this._rows[i];
    }

    /**
     * Get rows of a table
     * @returns {Array<Row>} list of rows
     */
    getRows() {
        return this._rows;
    }

    /**
     * Retrieves the number of {@link TableRows}.
     * @returns {Number} he number of table rows
     */
    getNumRows() {
        return this._rows.length;
    }

    /**
     * Retrieves the TableCell at the specified row and cell indices.
     * @param {number} rowIndex Index of the row
     * @param {number} cellIndex Index of the cell
     * @returns {Cell} The table cell
     */
    getCell(rowIndex, cellIndex) {
        return this.getRow(rowIndex).getCell(cellIndex);
    }

    getText() {
        return this._rows.map((el) => el.getText()).join('');
    }
}

export class Document {
    /**
     * Initial a Google Doc document
     * @param {Object} doc Document bject get from Google Doc API
     */
    constructor(doc) {
        // Filter the `sectionBreak` and `tableOfContents`
        // paragraph: A paragraph is a range of content that is terminated with a newline character.
        // table: Representing a table.
        this._tables = (doc.body.content || [])
            .filter((s) => s.table)
            .map((s) => new Table(s.table));

        let footerElements =
            doc.footers[Object.keys(doc.footers)[0]].content[0].paragraph.elements;
        let versionElement = _.find(footerElements, (element) => {
            return element.textRun.content.includes('version');
        });
        let regex = /version\s([\d\.]+)/i;
        this._lessonTemplateVersion = versionElement.textRun.content.match(
            regex
        )[1];
    }

    /**
     * Get a single table by index
     * @param {Number} i The index position for the table
     * @returns {Table} Table
     */
    getTable(i) {
        return this._tables[i];
    }

    /**
     * Get tables of a document
     * @returns {Array<Table>} list of tables
     */
    getTables() {
        return this._tables;
    }

    /**
     * Get major version of document
     * @returns {Integer} major version
     */
    getMajorVersion() {
        return Number(this._lessonTemplateVersion.charAt(0));
    }
}