import Element from './Element';

class Asset extends Element {
  constructor(doc: Document, node: HTMLElement) {
    if (node.childNodes.length === 0) {
      throw new Error('Invalid asset');
    }

    const id = node.getAttribute('data-id') || '';
    const name = node.getAttribute('data-name') || '';
    const assetType = node.getAttribute('data-type') || '';
    const extension = node.getAttribute('data-extension') || '';

    super(doc, node, 'div', 'asset', { id, name, extension, assetType });
  }
}

export default Asset;
