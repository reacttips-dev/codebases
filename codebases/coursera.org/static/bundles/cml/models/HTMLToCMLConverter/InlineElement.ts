import _ from 'lodash';
import { SUPPORTED_INLINE_BLOCKS } from 'bundles/cml/models/CMLParser';

// TODO: Move to CMLParser
const ATTRIBUTES: Record<string, Array<{ name: string; required?: boolean }>> = {
  a: [
    {
      name: 'href',
      required: true,
    },

    {
      name: 'title',
    },
    // TODO: add aria-label once DTD support is added
  ],
};

class InlineElement {
  doc: Document;

  node: HTMLElement;

  tagName: string;

  childNodes: Array<Node> | undefined;

  block: HTMLElement;

  constructor(doc: Document, node: HTMLElement) {
    this.doc = doc;
    this.node = node;
    this.tagName = this.getTagName(node);

    if (_.includes(SUPPORTED_INLINE_BLOCKS, this.tagName)) {
      this.childNodes = Array.from(this.node.childNodes);
      this.block = this.doc.createElement(this.tagName);

      this.setBlockAttributes();

      _.forEach(this.childNodes, (childNode) => {
        const childTagName = this.getTagName(childNode as HTMLElement);

        // Do not allow nesting of similar inline elements
        if (childTagName === this.tagName) {
          throw new Error(`Invalid nested inline element ${childTagName}`);
        }

        const inlineElement = new InlineElement(this.doc, childNode as HTMLElement);
        this.block.appendChild(inlineElement.block);
      });
    } else if (node.nodeType === 3) {
      // Text node
      this.block = this.node;
    } else {
      throw new Error(`Invalid inline element ${this.tagName}`);
    }
  }

  getTagName(node: HTMLElement) {
    return node.tagName && node.tagName.toLowerCase();
  }

  setBlockAttributes() {
    const attributes = ATTRIBUTES[this.tagName];

    if (attributes) {
      _.forEach(attributes, (attribute) => {
        const { name, required } = attribute;
        const value = this.node.getAttribute(name);

        if (value) {
          this.block.setAttribute(name, value);
        } else if (required) {
          throw new Error(`Missing attribute ${name} for ${this.tagName}`);
        }
      });
    }
  }
}

export default InlineElement;
