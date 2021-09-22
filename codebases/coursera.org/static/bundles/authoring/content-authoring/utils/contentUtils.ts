import _ from 'lodash';
import Immutable from 'immutable';
import { NodeJSON } from 'slate';
import { ElementCompact, xml2js } from 'xml-js';
import { getNodes, SlateElement } from './converters/CMLToSlate';
import { getTextCML } from './converters/SlateToCML';
import { getAttributes } from './slateUtils';
import { BLOCK_TYPES } from '../constants';

import { SlateNode, SlateBlock, SlateInline, SlateText } from '../types';

// converts a list of slate Nodes to cml string content (content string inside <co-content> ... </co-content>)
const slateToCml = (nodes?: Immutable.List<SlateNode>, enableMonospace = false) => {
  const cml: Array<string> = [];

  if (!nodes || nodes.size === 0) {
    return '';
  }

  nodes.forEach((node) => {
    const { textCML, attributes } = getTextCML(node as SlateBlock | SlateInline | SlateText, enableMonospace);

    // `Text` type node is handled in the default case, assume `SlateBlock | SlateInline` otherwise
    switch ((node as SlateBlock | SlateInline).type) {
      case BLOCK_TYPES.HEADING: {
        const { level } = getAttributes(node as SlateBlock);
        cml.push(`<heading level="${level}"${attributes.hasMath ? ' hasMath="true"' : ''}>${textCML}</heading>`);
        break;
      }

      case BLOCK_TYPES.BULLET_LIST:
      case BLOCK_TYPES.NUMBER_LIST: {
        const bulletType = (node as SlateBlock).type === BLOCK_TYPES.NUMBER_LIST ? 'numbers' : 'bullets';
        cml.push(`<list bulletType="${bulletType}">${slateToCml((node as SlateBlock).nodes, enableMonospace)}</list>`);
        break;
      }

      case BLOCK_TYPES.LIST_ITEM: {
        if (
          (node as SlateBlock).nodes.size === 1 &&
          ((node as SlateBlock).nodes.get(0) as SlateBlock)?.type === BLOCK_TYPES.PARAGRAPH
        ) {
          cml.push(`<li>${slateToCml((node as SlateBlock).nodes, enableMonospace)}</li>`);
        } else {
          // This is needed for parsing nested lists that can contain formatted text, i.e `node.nodes.size > 1`
          cml.push(`<li><text${attributes.hasMath ? ' hasMath="true"' : ''}>${textCML}</text></li>`);
        }
        break;
      }

      case BLOCK_TYPES.IMAGE: {
        const nodeAttributes = getAttributes(node as SlateBlock);

        if (!nodeAttributes) {
          break;
        }

        const { assetId, alt, src } = nodeAttributes;
        let imgAttribute = assetId ? `assetId="${assetId}"` : '';

        if (src) {
          // spark images use `src` and don't have `assetId`
          imgAttribute = `src="${src}"`;
        }

        cml.push(`<img ${imgAttribute}${alt ? ` alt="${alt}"` : ''}/>`);
        break;
      }

      case BLOCK_TYPES.ASSET: {
        const nodeAttributes = getAttributes(node as SlateBlock);

        if (!nodeAttributes) {
          break;
        }

        const { id, name, extension, assetType } = nodeAttributes;
        const escapedName = _.escape(_.unescape(name)); // unescape first so we don't doubly escape

        cml.push(`<asset id="${id}" name="${escapedName}" extension="${extension}" assetType="${assetType}"/>`);
        break;
      }

      case BLOCK_TYPES.TABLE: {
        const hasHeader = !(node as SlateBlock | SlateInline).data.get('headless');
        let numRows = 0;
        let numCols = 0;

        const tableNodes = (node as SlateBlock | SlateInline).nodes
          .filter((childNode) => (childNode as SlateBlock | SlateInline).type === 'table-row')
          .map((childNode, idx) => {
            if (hasHeader && idx === 0) {
              numRows += 1;
              return `<thead><tr>${(childNode as SlateBlock).nodes
                .map(
                  (headerCell) =>
                    `<th>${slateToCml((headerCell as SlateBlock | SlateInline).nodes, enableMonospace)}</th>`
                )
                .join('')}</tr></thead>`;
            }

            numRows += 1;
            numCols = (childNode as SlateBlock | SlateInline).nodes.size;
            return `<tr>${slateToCml((childNode as SlateBlock | SlateInline).nodes, enableMonospace)}</tr>`;
          });

        // Copy-pasting tables from currently unsupported sources like Excel sheets can lead
        // to tables with invalid row/col count. e.g. https://sentry.io/organizations/coursera/issues/870202638
        if (numRows > 0 && numCols > 0) {
          cml.push(`<table rows="${numRows}" columns="${numCols}">${tableNodes.join('')}</table>`);
        }

        break;
      }

      case BLOCK_TYPES.TABLE_ROW: {
        cml.push(`<tr>${slateToCml((node as SlateBlock | SlateInline).nodes, enableMonospace)}</tr>`);
        break;
      }

      case BLOCK_TYPES.TABLE_CELL: {
        cml.push(`<td>${slateToCml((node as SlateBlock | SlateInline).nodes, enableMonospace)}</td>`);
        break;
      }

      case BLOCK_TYPES.CODE: {
        const { language, evaluatorId } = getAttributes(node as SlateBlock) || {};
        const codeText = (node as SlateBlock | SlateInline).data.get('codeText') || '';
        const escapedCodeText = _.escape(codeText);
        const languageAttributeString = language ? `language="${language}"` : '';
        const evaluatorIdAttributeString = evaluatorId ? `evaluatorId="${evaluatorId}"` : '';

        cml.push(`<code ${languageAttributeString} ${evaluatorIdAttributeString}>${escapedCodeText}</code>`);
        break;
      }

      case BLOCK_TYPES.PERSONALIZATION_TAG: {
        const tagValue = (node as SlateBlock | SlateInline).data.get('tagValue') || '';
        cml.push(`<ptag>${tagValue}</ptag>`);
        break;
      }

      case BLOCK_TYPES.PARAGRAPH:
      default: {
        // handle as text content
        cml.push(`<text${attributes.hasMath ? ' hasMath="true"' : ''}>${textCML}</text>`);
        break;
      }
    }
  });

  return cml.join('');
};

// returns Slate nodes given a cml string content (i.e. content string inside <co-content> ... </co-content>)
const cmlToSlate = (cmlString: string): { slateNodes: Array<NodeJSON>; assetIds: Array<string> } => {
  // placeholder slate content for empty CML. See https://github.com/ianstormtaylor/slate/issues/1161#issuecomment-382332651
  let slateNodes: Array<NodeJSON> = [
    {
      object: 'block',
      type: 'paragraph',
      nodes: [
        {
          object: 'text',
          leaves: [
            {
              marks: [],
              // @ts-expect-error we need to ugrade Slate to a newer version to fix this
              object: 'leaf',
              text: '',
            },
          ],
        },
      ],
    },
  ];
  // list of assetIds to fetch data for
  const assetIds: Array<string> = [];

  if (!cmlString || cmlString === '') {
    return { slateNodes, assetIds };
  }

  let jsDoc: Element | ElementCompact;

  try {
    jsDoc = xml2js(cmlString, {
      compact: false,
      captureSpacesBetweenElements: true, // preserve whitespaces between cml tags
    });
  } catch (e) {
    console.error('[CMLEditorV2] xml2js parse exception: ', e, cmlString); // eslint-disable-line no-console
    return { slateNodes, assetIds };
  }

  const jsNodes = jsDoc.elements[0].elements || [{ name: 'placeholder' }]; // placeholder for empty content

  // convert to slate-compatible nodes
  slateNodes = jsNodes
    .filter((node: SlateElement) => !!node.name)
    .map((node: SlateElement) => {
      switch (node.name) {
        case 'text':
        case 'placeholder': {
          return {
            object: 'block',
            type: BLOCK_TYPES.PARAGRAPH,
            nodes: node.elements ? getNodes(node) : [],
            data: Immutable.fromJS({
              attributes: node.attributes,
            }),
          };
        }

        case 'heading': {
          return {
            object: 'block',
            type: BLOCK_TYPES.HEADING,
            nodes: node.elements ? getNodes(node) : [],
            data: Immutable.fromJS({
              attributes: node.attributes,
            }),
          };
        }

        case 'list': {
          const nodes = getNodes(node);
          return {
            object: 'block',
            type: node.attributes?.bulletType === 'bullets' ? BLOCK_TYPES.BULLET_LIST : BLOCK_TYPES.NUMBER_LIST,
            nodes: node.elements ? nodes : [],
            data: Immutable.fromJS({
              attributes: node.attributes,
            }),
          };
        }

        case 'img': {
          if (!node.attributes) {
            return {
              object: 'block',
              type: BLOCK_TYPES.PARAGRAPH,
              nodes: [],
              data: Immutable.fromJS({}),
            };
          }

          const nodes = getNodes(node);

          if (node.attributes.assetId) {
            assetIds.push(node.attributes.assetId);
          }

          return {
            object: 'block',
            type: BLOCK_TYPES.IMAGE,
            nodes: node.elements ? nodes : [],
            isVoid: true,
            data: Immutable.fromJS({
              attributes: node.attributes,
            }),
          };
        }

        case 'asset': {
          if (!node.attributes) {
            return {
              object: 'block',
              type: BLOCK_TYPES.PARAGRAPH,
              nodes: [],
              data: Immutable.fromJS({}),
            };
          }

          const nodes = getNodes(node);

          if (node.attributes.id) {
            assetIds.push(node.attributes.id);
          }

          return {
            object: 'block',
            type: BLOCK_TYPES.ASSET,
            nodes: node.elements ? nodes : [],
            isVoid: true,
            data: Immutable.fromJS({
              attributes: node.attributes,
            }),
          };
        }

        case 'table': {
          const tableNodes = getNodes(node);
          const firstElement = node.elements[0];
          const hasCaption = firstElement ? firstElement.name === 'caption' : false;
          const hasHeader = hasCaption ? node.elements[1].name === 'thead' : firstElement.name === 'thead';

          return {
            object: 'block',
            type: BLOCK_TYPES.TABLE,
            nodes: node.elements ? tableNodes : [],
            data: Immutable.fromJS({
              attributes: node.attributes,
              headless: !hasHeader, // EditTable plugin needs this attribute to render correctly
            }),
          };
        }

        case 'code': {
          return {
            object: 'block',
            type: BLOCK_TYPES.CODE,
            nodes: [], // todo: confirm that we just want nodes empty  node.elements ? nodes : [],
            data: Immutable.fromJS({
              codeText: node.elements ? node.elements[0].text : '',
              attributes: node.attributes,
            }),
            isVoid: true,
          };
        }

        default:
          return null;
      }
    });

  return {
    slateNodes,
    assetIds,
  };
};

export default {
  slateToCml,
  cmlToSlate,
};

export { slateToCml, cmlToSlate };
