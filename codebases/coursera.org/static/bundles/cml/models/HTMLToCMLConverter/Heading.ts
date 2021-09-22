import _ from 'lodash';
import CMLParser from 'bundles/cml/models/CMLParser';
import Element from './Element';
import InlineElement from './InlineElement';

class Heading extends Element {
  constructor(doc: Document, node: HTMLElement, level: number) {
    super(doc, node, `h${level}`, 'heading', { level });

    _.forEach(this.childNodes, (childNode) => {
      const inlineElement = new InlineElement(this.doc, childNode as HTMLElement);
      this.block.appendChild(inlineElement.block);
    });

    if (CMLParser.hasMath(this.block)) {
      this.setBlockAttribute('hasMath', true);
    }
  }
}

export default Heading;
