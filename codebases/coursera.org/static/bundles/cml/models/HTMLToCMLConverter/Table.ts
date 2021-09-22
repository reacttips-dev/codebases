import _ from 'lodash';
import CMLParser from 'bundles/cml/models/CMLParser';
import Element from './Element';
import InlineElement from './InlineElement';

class TableHeader extends Element {
  constructor(doc: Document, node: HTMLElement) {
    super(doc, node, 'thead', 'thead');
  }
}

class TableCellHeader extends Element {
  constructor(doc: Document, node: HTMLElement) {
    super(doc, node, 'th', 'th');

    const text = this.doc.createElement('text');

    _.forEach(this.childNodes, (childNode) => {
      if (childNode.nodeName === '#text' && childNode.textContent?.trim() === '') {
        return;
      }

      const inlineElement = new InlineElement(this.doc, childNode as HTMLElement);
      text.appendChild(inlineElement.block);
    });

    this.block.appendChild(text);
  }
}

class TableCaption extends Element {
  constructor(doc: Document, node: HTMLElement) {
    super(doc, node, 'caption', 'caption');

    if (this.childNodes.length > 0) {
      const text = this.doc.createElement('text');
      text.appendChild(this.childNodes[0]);
      this.block.appendChild(text);
    }
  }
}

class TableCell extends Element {
  constructor(doc: Document, node: HTMLElement) {
    super(doc, node, 'td', 'td');

    const text = this.doc.createElement('text');

    _.forEach(this.childNodes, (childNode) => {
      if (childNode.nodeName === '#text' && childNode.textContent?.trim() === '') {
        return;
      }

      const inlineElement = new InlineElement(this.doc, childNode as HTMLElement);
      text.appendChild(inlineElement.block);
    });

    if (CMLParser.hasMath(text)) {
      text.setAttribute('hasMath', 'true');
    }

    this.block.appendChild(text);
  }
}

class TableRow extends Element {
  constructor(doc: Document, node: HTMLElement) {
    super(doc, node, 'tr', 'tr');

    _.forEach(this.childNodes, (childNode) => {
      if (childNode.nodeName === '#text' && childNode.textContent?.trim() === '') {
        return;
      }

      const tagName = (childNode as HTMLElement).tagName.toLowerCase();
      let tableCell;

      if (tagName === 'th') {
        tableCell = new TableCellHeader(this.doc, childNode as HTMLElement);
      } else {
        tableCell = new TableCell(this.doc, childNode as HTMLElement);
      }

      this.block.appendChild(tableCell.block);
    });
  }
}

class Table extends Element {
  constructor(doc: Document, node: HTMLElement) {
    super(doc, node, 'table', 'table');
    let tableHeaderChildNodes: ArrayLike<ChildNode> = [];
    let tableBodyChildNodes: ArrayLike<ChildNode> = [];
    let tableHeader: TableHeader;
    let tableHeaderNodes: ArrayLike<ChildNode> = [];

    const hasCaption = (this.childNodes[0] as HTMLElement).tagName.toLowerCase() === 'caption';
    const headIndex = hasCaption ? 1 : 0; // caption is always the first tag
    const hasHeader = (this.childNodes[headIndex] as HTMLElement).tagName === 'thead';
    const bodyIndex = hasHeader ? headIndex + 1 : 0; // body always follows head

    if (this.childNodes.length > 1) {
      tableHeaderChildNodes = this.childNodes[headIndex].childNodes;
      tableBodyChildNodes = this.childNodes[bodyIndex].childNodes;
    } else {
      // A single <tbody> element is expected to be the immediate child of the <table>, if there is no header
      if (
        this.childNodes.length === 1 &&
        (this.childNodes[bodyIndex] as HTMLElement).tagName.toLowerCase() !== 'tbody'
      ) {
        throw new Error('Missing or invalid <tbody> for table');
      }

      tableBodyChildNodes = this.childNodes[bodyIndex].childNodes;
    }

    if (!hasHeader) {
      console.info('Missing or invalid <thead> for table'); // eslint-disable-line no-console
    }

    if (hasCaption) {
      const tableCaption = new TableCaption(this.doc, this.childNodes[0] as HTMLElement);
      this.block.appendChild(tableCaption.block);
    } else {
      console.info('Missing <caption> for table'); // eslint-disable-line no-console
    }

    if (hasHeader) {
      tableHeader = new TableHeader(this.doc, this.childNodes[headIndex] as HTMLElement);

      tableHeaderNodes = _.filter(tableHeaderChildNodes, (childNode) => {
        return !(childNode.nodeName === '#text' && childNode.textContent?.trim() === '');
      });

      _.forEach(tableHeaderNodes, (childNode) => {
        if (childNode.nodeName === '#text' && childNode.textContent?.trim() === '') {
          return;
        }

        const tableRow = new TableRow(this.doc, childNode as HTMLElement);
        tableHeader.block.appendChild(tableRow.block);
      });

      this.block.appendChild(tableHeader.block);
    }

    const tableBodyNodes = _.filter(tableBodyChildNodes, (childNode) => {
      return !(childNode.nodeName === '#text' && childNode.textContent?.trim() === '');
    });

    _.forEach(tableBodyNodes, (childNode) => {
      if (childNode.nodeName === '#text' && childNode.textContent?.trim() === '') {
        return;
      }

      const tableRow = new TableRow(this.doc, childNode as HTMLElement);
      this.block.appendChild(tableRow.block);
    });

    const rowCount = tableBodyNodes.length + tableHeaderNodes.length;
    let columnCount = 0;

    if (tableBodyNodes[0]) {
      columnCount = tableBodyNodes[0].childNodes.length;
    }

    this.setBlockAttribute('rows', rowCount);
    this.setBlockAttribute('columns', columnCount);
  }
}

export default Table;
