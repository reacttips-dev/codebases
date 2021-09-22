import Element from './Element';

class Image extends Element {
  constructor(doc: Document, node: HTMLElement) {
    if (node.childNodes.length === 0) {
      throw new Error('Invalid image');
    }

    const img = node.childNodes[0] as HTMLElement;
    const src = img.getAttribute('src') || '';
    const alt = img.getAttribute('alt') || '';
    const assetId = img.getAttribute('data-asset-id');

    let attributes = {};

    if (assetId) {
      attributes = { assetId, alt };
    } else {
      attributes = { src, alt };
    }

    super(doc, img, 'img', 'img', attributes);
  }
}

export default Image;
