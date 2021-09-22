import _ from 'lodash';
import { sanitizeURL } from 'bundles/authoring/common/utils/cmlUtils';
import { MARKS_TO_CML, BLOCK_TYPES } from '../../constants';
import { SlateNode, SlateBlock, SlateInline, SlateTextJSON } from '../../types';

// regex for katex math content
const MATH_REGEX = /\\\((.*?[^\\])\\\)|\\\[(.*?[^\\])\\\]|\$\$(.*?[^\\])\$\$/g;

// returns text cml content for a node
export const getTextContent = (node: SlateTextJSON, enableMonospace: boolean) => {
  const textNodes: Array<string> = [];

  if (!node || !node.leaves) {
    return '';
  }

  node.leaves.forEach((leaf) => {
    let openingTags = '';
    let closingTags = '';
    const textContent = leaf.text;

    // @ts-expect-error incorrectly typed in @types/slate - this will be a Immutable.List<Mark>
    if (leaf.marks && leaf.marks.size > 0) {
      // respective opening/closing cml tags for each mark
      openingTags = leaf.marks
        .map((mark) =>
          MARKS_TO_CML[mark.type as keyof typeof MARKS_TO_CML] === 'var' && !enableMonospace
            ? ''
            : `<${MARKS_TO_CML[mark.type as keyof typeof MARKS_TO_CML]}>`
        )
        .join('');
      closingTags = leaf.marks
        .reverse() // close tags in reverse
        .map((mark) =>
          MARKS_TO_CML[mark.type as keyof typeof MARKS_TO_CML] === 'var' && !enableMonospace
            ? ''
            : `</${MARKS_TO_CML[mark.type as keyof typeof MARKS_TO_CML]}>`
        )
        .join('');
    }

    const escapedTextContent = _.escape(textContent);

    textNodes.push(`${openingTags}${escapedTextContent}${closingTags}`);
  });

  return textNodes.join('');
};

// returns cml text string for a node
export const getTextCML = (node: SlateNode | SlateInline | SlateTextJSON, enableMonospace: boolean) => {
  if (!node || !(node as SlateBlock | SlateInline).nodes || (node as SlateBlock | SlateInline).nodes.size === 0) {
    let textCML = '';
    let hasMath = false;

    if (node && node.object === 'text') {
      textCML = getTextContent(node as SlateTextJSON, enableMonospace);
      hasMath = !!textCML.match(MATH_REGEX);
    }

    return {
      textCML,
      attributes: {
        hasMath,
      },
    };
  }

  const textNodes: Array<string> = [];
  let hasMath = false;

  (node as SlateBlock | SlateInline).nodes.forEach((childNode) => {
    if (childNode.object === 'text') {
      // @ts-expect-error we need to ugrade Slate to a newer version to fix this
      const textContent = getTextContent(childNode as SlateTextJSON, enableMonospace);
      if (!hasMath && textContent.match(MATH_REGEX)) {
        hasMath = true;
      }
      textNodes.push(textContent);
    }

    if (childNode.object === 'inline') {
      if (childNode.type === 'link') {
        const href = sanitizeURL(childNode.data.get('href'));
        const linkTitle = _.escape(childNode.data.get('title')) || '';
        textNodes.push(
          `<a href="${href}" title="${linkTitle}">${childNode.nodes
            .map((n) => getTextCML(n, enableMonospace).textCML)
            .join('')}</a>`
        );
      } else if (childNode.type === 'text') {
        textNodes.push(childNode.nodes.map((n) => getTextCML(n, enableMonospace).textCML).join(''));
      } else if (childNode.type === BLOCK_TYPES.PERSONALIZATION_TAG) {
        if (childNode.nodes.size === 1 && childNode.nodes.get(0)?.object === 'text') {
          // @ts-expect-error we need to ugrade Slate to a newer version to fix this
          const nodeText = getTextContent(childNode.nodes.get(0) as SlateTextJSON, enableMonospace);
          textNodes.push(`<ptag>${nodeText}</ptag>`);
        }
      }
    }
  });

  // TODO: just use xml-js to convert back to cml string?
  return {
    textCML: textNodes.join(''),
    attributes: {
      hasMath,
    },
  };
};
