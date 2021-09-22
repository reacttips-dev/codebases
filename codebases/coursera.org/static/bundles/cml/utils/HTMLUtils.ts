/**
 * WARNING: These functions may not be fully HTML compliant and should be
 * verified and/or refactored when used for other purposes.
 *
 * This utility file was created to repair Peer Review rich text html data
 * and to wrap any naked inline text in order to run the wrapped data through
 * HTMLToCMLConverter.  Without first repairing the data, HTMLToCMLConverter
 * will get confused when parsing rich text html data and will fail if it
 * encounters any html that doesn't conform to allowed CML structures.
 */
import { some, without } from 'lodash';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { DOMParser, XMLSerializer } from 'js/lib/dom';
import { SUPPORTED_INLINE_BLOCKS } from 'bundles/cml/models/CMLParser';

const INLINE_TEXT_TAGS = without(SUPPORTED_INLINE_BLOCKS, 'p', 'ul', 'ol', 'li', 'br');
const TABLE_TAGS = ['thead', 'tbody', 'tr', 'th', 'td', 'caption'];
const DISALLOWED_NESTED_TAGS = ['p', 'h1', 'h2', 'h3', 'blockquote', 'table'];
const DISALLOWED_REPEATED_DESCENDANT_TAGS = [...TABLE_TAGS, ...SUPPORTED_INLINE_BLOCKS];

/**
 * Modifies html nodes to conform with CML data conventions for conversion compatibility.
 * @param doc
 * @param node
 * @param nodeLevel
 * @param ancestors
 */
function sanitizeHtmlNodeForCmlConversion(
  doc: Document,
  node: ChildNode,
  nodeLevel = 0,
  ancestors: Array<string> = []
) {
  // note: The checks and mutations are performed on the child nodes while the function is inspecting the parent,
  //       because it seemed more logical to modify the children before recursing into the children.  As opposed to
  //       recursing into a child, detecting the child should be modified, reaching back up to the parent to insert a new
  //       child node or deleting the child node, and updating the parent's recursion loop somehow to recurse into
  //       the new modified list of child nodes without breaking the already executing recursion of non-modified children.
  if (node?.childNodes) {
    let childNode: ChildNode | null = node.childNodes[0];
    while (childNode) {
      const childTag = childNode.constructor.name === 'Element' ? (childNode as Element).tagName : '';
      let nextNode: ChildNode | null = childNode.nextSibling;

      // wrap root-level inline text with <p>
      if (nodeLevel === 0 && (childNode.constructor.name === 'Text' || INLINE_TEXT_TAGS.includes(childTag))) {
        const prevNode: ChildNode | null = childNode.previousSibling;
        if (prevNode && prevNode.constructor.name === 'Element' && (prevNode as Element).tagName === 'p') {
          // add current inline text to previous P node if available
          prevNode.appendChild(childNode);
          nextNode = prevNode;
        } else {
          // create new P node and wrap current inline text
          const pNode = doc.createElement('p');
          node.insertBefore(pNode, childNode);
          pNode.appendChild(childNode);
          nextNode = pNode;
        }
      } else if (
        childNode.constructor.name === 'Element' &&
        // strip non-Coursera image tags
        ((childTag === 'img' &&
          !some((childNode as Element)?.attributes, (attrib) => attrib.name === 'data-asset-id')) ||
          // strip anchor tags without href
          (childTag === 'a' && !some((childNode as Element)?.attributes, (attrib) => attrib.name === 'href')) ||
          // strip nested tags
          (childTag && DISALLOWED_NESTED_TAGS.includes(childTag) && nodeLevel > 0) ||
          // strip repeated descendant tags
          (childTag && DISALLOWED_REPEATED_DESCENDANT_TAGS.includes(childTag) && ancestors.includes(childTag)) ||
          // strip non-table tags nested in tables
          (childTag && !TABLE_TAGS.includes(childTag) && ancestors.includes('table')) ||
          // strip table tags without a table ancestor
          (childTag && TABLE_TAGS.includes(childTag) && !ancestors.includes('table')))
      ) {
        if (childNode.childNodes.length) {
          nextNode = childNode.childNodes[0];
          while (childNode.childNodes.length > 0) {
            node.insertBefore(childNode.childNodes[0], childNode);
          }
        }
        node.removeChild(childNode);
      } else {
        sanitizeHtmlNodeForCmlConversion(
          doc,
          childNode,
          nodeLevel + 1,
          childTag ? [...ancestors, childTag] : [...ancestors]
        );
      }

      childNode = nextNode;
    }
  }
}

export function sanitizeCmlHtml(html: string): string {
  const domParser = new DOMParser();
  const doc: Document = domParser.parseFromString(`<body>${html}</body>`, 'application/xml');

  sanitizeHtmlNodeForCmlConversion(doc, doc.childNodes[0], 0, ['body']);

  const xmlSerializer = new XMLSerializer();
  const docHtml = xmlSerializer.serializeToString(doc);

  // strip "body" tags to only return html content itself
  return docHtml === '<body/>' ? '' : docHtml.slice(6, -7);
}
