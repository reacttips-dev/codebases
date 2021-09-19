import React from 'react';
import { Link } from 'react-router';
import HtmlToReact from 'html-to-react';
import ExecutionEnvironment from 'exenv';

import { checkIfRelativeUrl, cleanUp } from './index';

const isValidNode = () => true;
const reactParser = new HtmlToReact.Parser();
const { processDefaultNode } = new HtmlToReact.ProcessNodeDefinitions(React);

const parseInstructions = [
  // convert 'a' tags to Link
  {
    shouldProcessNode(node) {
      return node.name && node.name === 'a' && checkIfRelativeUrl(node.attribs['href']);
    },

    processNode(node, children, index) {
      const { href } = node.attribs;
      // Let processDefaultNode do all the heavy lifting and then we'll steal
      // its props for our Link
      const reactComponent = processDefaultNode(node, children, index);
      return (<Link {...reactComponent.props} href={null} key={index} to={href}>{children}</Link>);
    }
  },
  // all other nodes
  {
    shouldProcessNode() {
      return true;
    },
    processNode: processDefaultNode
  }
];

// Consider using HtmlToReact.jsx that leverages this
export const parseHtmlToReact = html => (
  // convert gateway html to a react component, so that <a> tags become
  // react-router Links which we can navigate on the client
  reactParser.parseWithInstructions(cleanUp(html), isValidNode, parseInstructions)
);

// Get psuedo element content with JS
export const getContent = (element, pseudo) => (
  window.getComputedStyle(element, pseudo).getPropertyValue('content').replace(/['"]|(none)/gi, '')
);

/**
 * Leverages `getContent` to return a string of the current screen size.
 * @returns {String} 'mobile'|'tablet'|'desktop'
 */
export const getScreenSize = () => getContent(document.documentElement, ':before');

// Get css breakpoint with JS
export const isMobileContentBreakpoint = el => (
  ExecutionEnvironment.canUseDOM && getContent(el, ':after') === 'mobile'
);

/**
 * Plain parsing of nodes to react. This is best used when receiving text from an API that contains escaped html.
 * Using this will allow the display of the true text from the API without react double-encoding the output for display.
 * @param text
 * @returns React friendly content.
 */
export const parseTextToReact = text => reactParser.parse(text);

// Check for details/summary support https://caniuse.com/details
// Code borrowed from here https://github.com/mathiasbynens/jquery-details/blob/master/jquery.details.js#L9
export const isDetailsSupported = (doc = document) => {
  const el = doc.createElement('details');
  let fake;

  if (!('open' in el)) {
    return false;
  }

  const root = doc.body || (function() {
    const de = doc.documentElement;
    fake = true;
    return de.insertBefore(doc.createElement('body'), de.firstElementChild || de.firstChild);
  }());

  el.innerHTML = '<summary>a</summary>b';
  el.style.display = 'block';
  root.appendChild(el);
  const heightInitial = el.offsetHeight;
  el.open = true;
  const diff = heightInitial !== el.offsetHeight;
  root.removeChild(el);

  if (fake) {
    root.parentNode.removeChild(root);
  }

  return diff;
};

/*
  Take form element. Returns inner inputs in an object like: {name: value}.
  WARNING: this has some limitations and assumptions.
  - Checkboxes are bools.
  - Radios will be converted to bools if value is true/false.
  - Multi-selects are probably not supported in the way you would need.
  - File inputs won't work. You'll likely need FormData for that
  Whatever you're doing, be sure to always test before using. Custom solutions may be necessary
  depending on the needs of the endpoint.
  Related GH convo: https://github01.zappos.net/mweb/marty/pull/13336#discussion_r58339
*/
export function formInputsToObject(formEl) {
  const formObj = {};
  Array.from(formEl.elements).forEach(el => {
    const { tagName, type, name, value, checked, disabled } = el;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tagName) && type !== 'submit' && !disabled) {
      if (type === 'checkbox') {
        formObj[name] = checked;
      } else if (type === 'radio') {
        if (checked) {
          formObj[name] = value === 'true' ? true : value === 'false' ? false : value;
        }
      } else {
        formObj[name] = value;
      }
    }
  });
  return formObj;
}

const LI_RE = /^\s*-(.*)|\n\s*-(.*)/g;
const NEWLINE_RE = /\n/g;
const BOLD_RE = /\*\*(.+?)\*\*/g;
const ITALICS_RE = /\*(.+?)\*/g;
const STRIKETHROUGH_RE = /~~(.+?)~~/g;
const FOOTNOTE_RE = /__(.+?)__/g;
const ASTERISK_RE = /\\\*/g;
export function parseMarkdown(text) {
  return text
    .replace(FOOTNOTE_RE, '<cite>$1</cite>')
    .replace(LI_RE, '<p style="margin: 0.5em 0 0.5em 1em">$1$2</p>') // Why no <li>? We'd need to enclose them with '<ul>', adding complexity to this code.
    .replace(NEWLINE_RE, '<br />')
    .replace(BOLD_RE, '<strong>$1</strong>')
    .replace(ITALICS_RE, '<em>$1</em>')
    .replace(STRIKETHROUGH_RE, '<del>$1</del>')
    .replace(ASTERISK_RE, '*');
}

export function markdownToHtml(htmlText) {
  const html = parseMarkdown(htmlText);
  const htmlSanitized = cleanUp(html);
  // wrap in <p> to preserve whitespace when rendered to html
  return `<p>${htmlSanitized}</p>`;
}

export function injectScriptToHead(props) {
  if (!ExecutionEnvironment.canUseDOM) {
    return null;
  }

  const script = document.createElement('script');

  script.async = true;

  for (const [key, value] of Object.entries(props)) {
    script[key] = value;
  }

  document.head.appendChild(script);
}
