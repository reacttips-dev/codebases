import _ from 'lodash';
import CMLParser from 'bundles/cml/models/CMLParser';
import Element from './Element';
import InlineElement from './InlineElement';

class ListItem extends Element {
  constructor(doc: Document, node: HTMLElement) {
    super(doc, node, 'li', 'li', {});

    const text = this.doc.createElement('text');

    _.forEach(this.childNodes, (childNode) => {
      if (childNode.nodeName === '#text' && childNode.nodeValue?.trim() === '') {
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

class List extends Element {
  constructor(doc: Document, node: HTMLElement, tagName: string, blockType: string, bulletType: string) {
    super(doc, node, tagName, blockType, { bulletType });

    _.forEach(this.childNodes, (childNode) => {
      if (childNode.nodeName === '#text' && childNode.nodeValue?.trim() === '') {
        return;
      }

      const listItem = new ListItem(this.doc, childNode as HTMLElement);
      this.block.appendChild(listItem.block);
    });
  }
}

class OrderedList extends List {
  constructor(doc: Document, node: HTMLElement) {
    super(doc, node, 'ol', 'list', 'numbers');
  }
}

class UnorderedList extends List {
  constructor(doc: Document, node: HTMLElement) {
    super(doc, node, 'ul', 'list', 'bullets');
  }
}

const exported = {
  OrderedList,
  UnorderedList,
};

export default exported;
export { OrderedList, UnorderedList };
