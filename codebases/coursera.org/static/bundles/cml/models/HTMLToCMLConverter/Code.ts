import _ from 'lodash';
import Element from './Element';

class Code extends Element {
  constructor(doc: Document, node: HTMLElement) {
    const language = node.getAttribute('data-language');
    const evaluatorId = node.getAttribute('data-evaluator-id');

    let attributes = {};

    if (language) {
      attributes = { language };
    }

    if (evaluatorId) {
      attributes = { ...attributes, evaluatorId };
    }

    super(doc, node, 'pre', 'code', attributes);

    /* TODO: Use a variant of InlineElement here */
    _.forEach(this.childNodes, (childNode) => {
      if (childNode.nodeType !== 3) {
        throw new Error(`Unsupported HTML element "${(childNode as HTMLElement).tagName}" inside "pre"`);
      }

      this.block.appendChild(childNode);
    });
  }
}

export default Code;
