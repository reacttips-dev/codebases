import _ from 'lodash';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { DOMParser } from 'js/lib/dom';
import CMLParser from 'bundles/cml/models/CMLParser';
import Text from 'bundles/cml/models/HTMLToCMLConverter/Text';
import Code from 'bundles/cml/models/HTMLToCMLConverter/Code';
import Image from 'bundles/cml/models/HTMLToCMLConverter/Image';
import Table from 'bundles/cml/models/HTMLToCMLConverter/Table';
import Asset from 'bundles/cml/models/HTMLToCMLConverter/Asset';
import Heading from 'bundles/cml/models/HTMLToCMLConverter/Heading';
import { OrderedList, UnorderedList } from 'bundles/cml/models/HTMLToCMLConverter/List';
import type CMLElement from 'bundles/cml/models/HTMLToCMLConverter/Element';
import { sanitizeCmlHtml as repairHtml } from 'bundles/cml/utils/HTMLUtils';

const getBlock = (doc: XMLDocument, node: HTMLElement) => {
  let block = null as CMLElement | null;
  const tagName = node.tagName && node.tagName.toLowerCase();

  // Ignore whitespace-only nodes.
  if (node.nodeName === '#text' && node.nodeValue && node.nodeValue.trim() === '') {
    return undefined;
  }

  switch (tagName) {
    case 'p':
      block = new Text(doc, node);
      break;

    case 'h1':
      block = new Heading(doc, node, 1);
      break;

    case 'h2':
      block = new Heading(doc, node, 2);
      break;

    case 'h3':
      block = new Heading(doc, node, 3);
      break;

    case 'pre':
      block = new Code(doc, node);
      break;

    case 'ol':
      block = new OrderedList(doc, node);
      break;

    case 'ul':
      block = new UnorderedList(doc, node);
      break;

    case 'figure':
      block = new Image(doc, node);
      break;

    case 'table':
      block = new Table(doc, node);
      break;

    case 'div': {
      const classes = node.getAttribute('class') || '';

      if (classes.indexOf('cml-asset') !== -1) {
        block = new Asset(doc, node);
      } else {
        throw new Error(`Unsupported HTML element "${node}, ${tagName}"`);
      }

      break;
    }

    case 'parsererror':
      throw new Error(`Unable to parse HTML: ${node.innerHTML}`);

    default:
      throw new Error(`Unsupported HTML element "${node}, ${tagName}"`);
  }

  return block;
};

class HTMLToCMLConverter {
  toCML(html: string, shouldWrap: boolean, shouldRepair?: boolean) {
    const domParser = new DOMParser();
    // note: Please refer to the repairHtml implementation for details before using the
    //       "shouldRepair" flag.  repairHtml wraps naked text strings with element tags
    //       to avoid fatal errors when toCML attempts to construct a valid DOM. But, repairHtml
    //       also incorporates additional data transformations that are desired when dealing
    //       with legacy "html" data in the database, so it should be used cautiously.
    const repairedHTML = shouldRepair ? repairHtml(html) : html;
    const sanitizedHTML = HTMLToCMLConverter.sanitizeHTML(repairedHTML);
    const doc = domParser.parseFromString(`<body>${sanitizedHTML}</body>`, 'application/xml');
    const childNodes = doc.childNodes[0].childNodes;
    const wrapper = doc.createElement('wrapper');

    _.forEach(childNodes, (node) => {
      const element = getBlock(doc, node) as CMLElement;

      if (element) {
        wrapper.appendChild(element.block);
      }
    });

    return HTMLToCMLConverter.getStringifiedCML(wrapper, shouldWrap);
  }

  static sanitizeHTML(html: string) {
    // Note: Do not strip newlines or other whitespace here. The incoming html includes the raw data inside code
    // blocks, so anything you do here will be applied to the code block content.
    return (
      html
        .replace(/&nbsp;/gi, ' ')
        // remove target="_blank" attribute
        .replace(/[\s]*target="_blank"/g, '')
        // remove rel="noopener nofollow" attribute
        .replace(/[\s]*rel="noopener"/g, '')
        .replace(/[\s]*rel="noopener nofollow"/g, '')
        // close <img /> tags
        .replace(/(<img("[^"]*"|[^/">])*)>/g, '$1/>')
        // close <source /> tags
        .replace(/(<source("[^"]*"|[^/">])*)>/g, '$1/>')
        // remove empty text formatting tags as they introduce self-closing tags after xml-parse
        // and do not contribute to visual or structural meaning
        .replace(/(<(strong|em|u)><\/(strong|em|u)>)/g, '')
        // replace <br/> tags within code blocks with newline
        .replace(/(<pre(?:(?!<pre)[\s\S])*?<br[\s]*[/]*>[\s\S]*?<\/pre>)/g, (match) =>
          match.replace(/<br[\s]*[/]*>/g, '\n')
        )
        // remove <br/> tags
        .replace(/<br[/]*>/g, '')
        // remove html comments <!-- -->
        .replace(/<!--.*?-->/gs, '')
    );
  }

  static getStringifiedCML(node: CMLElement, shouldWrap: boolean) {
    const content = CMLParser.getInnerContent(node);

    if (shouldWrap) {
      return `<co-content>${content}</co-content>`;
    }

    return content;
  }
}

export default HTMLToCMLConverter;
