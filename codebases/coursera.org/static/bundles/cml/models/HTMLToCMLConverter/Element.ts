import _ from 'lodash';

type BlockAttributes = {
  id?: string;
  name?: string;
  extension?: string;
  assetType?: string;
  level?: number;
  bulletType?: string;
};
/*
  Base class for HTML blocks that represent the corresponding CML block types
  Each type then extends this class for specific cml types like Heading or Table
*/
class Element {
  doc: Document;

  node: HTMLElement;

  childNodes: Array<Node>;

  block: HTMLElement;

  constructor(doc: Document, node: HTMLElement, tagName: string, blockType: string, blockAttributes?: BlockAttributes) {
    this.doc = doc;
    this.node = node;
    this.childNodes = Array.from(node.childNodes);

    if (this.getTag() !== tagName) {
      throw new Error(`Invalid element ${this.getTag()} for ${blockType}`);
    }

    this.block = this.doc.createElement(blockType);

    _.forEach(blockAttributes, (value, name) => {
      this.setBlockAttribute(name as string, value as string);
    });
  }

  getTag() {
    return this.node.tagName && this.node.tagName.toLowerCase();
  }

  setBlockAttribute(name: string, value: number | string | boolean) {
    this.block.setAttribute(name, value as string);
  }
}

export default Element;
