'use es6'; // For specific documentation on the Sanitize.js library, config, or transformers, see: https://github.com/gbirke/Sanitize.js

import Sanitize from 'sanitize'; // createHTMLDocument MUST be passed a title or else sanitized content will break in Internet Explorer: https://issues.hubspotcentral.com/browse/CRM-17134

export var secureDocument = document.implementation.createHTMLDocument('sanitize');
export var config = {
  HTML: {
    elements: ['a', 'b', 'blockquote', 'br', 'caption', 'cite', 'code', 'col', 'colgroup', 'dd', 'dl', 'dt', 'em', 'figure', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'i', 'img', 'li', 'ol', 'p', 'pre', 'q', 'small', 'strike', 'strong', 'sub', 'sup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'u', 'ul', 'font', 'div', 'span'],
    dom: secureDocument,
    attributes: {
      __ALL__: ['style', 'align', 'valign', 'color', 'width', 'height'],
      a: ['href', 'title', 'target'],
      blockquote: ['cite'],
      col: ['span'],
      colgroup: ['span'],
      img: ['alt', 'data-original-height', 'data-original-width', 'src', 'title'],
      ol: ['start', 'type'],
      q: ['cite'],
      table: ['summary', 'bgcolor', 'cellpadding', 'cellspacing'],
      td: ['abbr', 'axis', 'bgcolor', 'colspan', 'rowspan'],
      th: ['abbr', 'axis', 'colspan', 'rowspan', 'scope'],
      ul: ['type'],
      font: ['size', 'face'],
      span: ['data-at-mention', 'data-owner-id', 'contenteditable', 'data-email-reply', 'data-timestamp', 'data-value']
    },
    add_attributes: {
      a: {
        rel: 'nofollow noopener noreferrer'
      }
    },
    protocols: {
      a: {
        href: ['ftp', 'http', 'https', 'mailto', 'tel', 'mms', 'sms', Sanitize.RELATIVE]
      },
      blockquote: {
        cite: ['http', 'https', Sanitize.RELATIVE]
      },
      img: {
        src: ['data', 'http', 'https', Sanitize.RELATIVE]
      },
      q: {
        cite: ['http', 'https', Sanitize.RELATIVE]
      }
    },
    // 'title' added below to fix https://issues.hubspotcentral.com/browse/CRMMAIL-5367
    remove_contents: ['script', 'style', 'title']
  },
  TEXTONLY: {
    dom: secureDocument,
    elements: [],
    remove_contents: ['style', 'script']
  }
};