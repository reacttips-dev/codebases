import _ from 'lodash';
import CMLParser from 'bundles/cml/models/CMLParser';
import InlineElement from './InlineElement';
import Element from './Element';

class Text extends Element {
  constructor(doc: Document, node: HTMLElement) {
    super(doc, node, 'p', 'text', {});

    _.forEach(this.childNodes, (childNode) => {
      const inlineElement = new InlineElement(this.doc, childNode as HTMLElement);
      this.block.appendChild(inlineElement.block);
    });

    if (CMLParser.hasMath(this.block)) {
      this.setBlockAttribute('hasMath', true);
    }
  }
}

export default Text;
