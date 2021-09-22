import _ from 'underscore';
import { MARKS, CML_MARKS, BLOCK_TYPES } from '../../constants';
import { SlateBlockJSON, SlateInlineJSON, SlateTextJSON, CustomAttributes } from '../../types';

export type SlateElement = {
  name: string;
  type: string;
  text?: string;
  elements: Array<SlateElement>;
  attributes?: React.HTMLAttributes<HTMLElement> & CustomAttributes;
};

type Mark = { type: string; object: string };

// returns text for an element recursively
export const getText = (element: SlateElement): string => {
  if (!element) {
    return '';
  }

  if (element.type === 'text') {
    return element.text || '';
  }

  return element.elements ? [...element.elements.map((e) => getText(e))].join('') : '';
};

// returns all the marks for an element recursively
export const getMarks = (element: SlateElement, tagName: string): Array<Mark> => {
  let marks: Array<Mark> = [];

  if (!element) {
    return [];
  }

  if (element.type === 'text') {
    // single-level marked text
    marks.push({
      type: MARKS[CML_MARKS[tagName as keyof typeof CML_MARKS]],
      object: 'mark',
    });
  } else if (element.elements) {
    // for nested marks, add current level mark
    marks.push({
      type: MARKS[CML_MARKS[element.name as keyof typeof CML_MARKS]],
      object: 'mark',
    });

    // traverse and recursively add nested marks
    element.elements.forEach((e) => {
      if (e.name) {
        marks = ([] as Array<Mark>).concat(marks, getMarks(e, element.name));
      }
    });
  }

  return marks;
};

// recursively traverses the node and gets all child nodes
export const getNodes = (
  node: SlateElement,
  previousMarks: Array<string> = []
): Array<SlateBlockJSON | SlateInlineJSON | SlateTextJSON> => {
  let content: Array<SlateBlockJSON | SlateInlineJSON | SlateTextJSON> = [];
  let marks: Array<Mark> = [];
  let text = '';

  if (!node || !node.elements) {
    return [];
  }

  node.elements.forEach((childNode) => {
    if (childNode.type === 'text') {
      marks = [...previousMarks.map((mark) => ({ type: mark, object: 'mark' }))];
      text = childNode.text || getText(childNode);

      // add marks to text if exist
      if (_(CML_MARKS).keys().includes(childNode.name)) {
        marks = getMarks(childNode, childNode.name);
      }

      content.push({
        object: 'text',
        leaves: [
          {
            // @ts-expect-error we need to ugrade Slate to a newer version to fix this
            marks,
            object: 'leaf',
            text,
          },
        ],
      });
    } else if (childNode.type === 'element') {
      const nodeName = childNode.name;

      if (_(CML_MARKS).keys().includes(nodeName)) {
        const markName = MARKS[CML_MARKS[nodeName as keyof typeof CML_MARKS]];

        // convert text nodes passing down its own mark and maintaining previousMarks from parents
        content = content.concat(getNodes(childNode, [...previousMarks, markName]));
      }

      switch (childNode.name) {
        case 'a':
          content.push({
            object: 'inline',
            type: BLOCK_TYPES.LINK,
            nodes: getNodes(childNode, [...previousMarks]),
            data: childNode.attributes,
          });
          break;

        case 'li':
          content.push({
            object: 'block',
            type: BLOCK_TYPES.LIST_ITEM,
            nodes: getNodes(childNode, [...previousMarks]),
            data: childNode.attributes,
          });
          break;

        case 'tr':
          content.push({
            object: 'block',
            type: BLOCK_TYPES.TABLE_ROW,
            nodes: getNodes(childNode, [...previousMarks]),
            data: childNode.attributes,
          });
          break;

        case 'td':
          content.push({
            object: 'block',
            type: BLOCK_TYPES.TABLE_CELL,
            nodes: getNodes(childNode, [...previousMarks]),
            data: childNode.attributes,
          });
          break;

        case 'thead':
          content.push({
            object: 'block',
            type: BLOCK_TYPES.TABLE_ROW,
            nodes: getNodes(childNode.elements[0], [...previousMarks]),
            data: childNode.attributes,
          });
          break;

        case 'th':
          content.push({
            object: 'block',
            type: BLOCK_TYPES.TABLE_CELL,
            nodes: getNodes(childNode, [...previousMarks]),
            data: childNode.attributes,
          });
          break;

        /* TODO: support captions
         case 'caption':
           content.push({
             object: 'block',
             type: 'table-caption',
             nodes: getNodes(childNode, [...previousMarks]),
             data: childNode.attributes,
           });
           break;
        */

        // This is a special case where we want to render a personalization tag into the editor.
        // <tag> is not a supported tag in the CML dtd, it is just used for initial CML -> slate conversions to make rendering a tag object easier
        // For reference on usage, please see bundles/enterprise-admin-messages/constants.ts
        // End goal is to send these tags as <text> with % wrapping around it so it can be handled by variable substitution
        case 'ptag':
          content.push({
            object: 'inline',
            type: BLOCK_TYPES.PERSONALIZATION_TAG,
            nodes: getNodes(childNode, [...previousMarks]),
            isVoid: true,
            data: {
              tagValue: childNode.elements && childNode.elements[0] && childNode.elements[0].text,
              ...childNode.attributes,
            },
          } as SlateInlineJSON);
          break;

        case 'text':
          content.push({
            object: 'block',
            type: BLOCK_TYPES.PARAGRAPH,
            nodes: getNodes(childNode, [...previousMarks]),
            data: childNode.attributes,
          });
          break;

        default:
          break;
      }
    } else {
      console.error('> Unsupported type: ', childNode.name); // eslint-disable-line no-console
    }
  });

  return content;
};
