/* maintains schema rules for data validation */

import Immutable from 'immutable';
import _t from 'i18n!nls/authoring';
import { BLOCK_TYPES, MARKS } from 'bundles/authoring/content-authoring/constants';
import {
  isGoogleDocsContent,
  isBold as isBoldGoogleDocs,
  isItalic as isItalicGoogleDocs,
  isUnderline as isUnderlineGoogleDocs,
} from 'bundles/authoring/content-authoring/utils/googleDocsUtils';
import {
  isMsWordContent,
  isBold as isBoldMsWord,
  isItalic as isItalicMsWord,
  isUnderline as isUnderlineMsWord,
} from 'bundles/authoring/content-authoring/utils/msWordUtils';
import { HTMLAttributes } from 'enzyme';

const {
  PARAGRAPH,
  BULLET_LIST,
  NUMBER_LIST,
  LIST_ITEM,
  HEADING,
  TEXT,
  LINK,
  TABLE,
  TABLE_ROW,
  TABLE_CELL,
} = BLOCK_TYPES;

// supported blocks for html paste
const BLOCK_TAGS_HTML = {
  p: PARAGRAPH,
  ul: BULLET_LIST,
  ol: NUMBER_LIST,
  li: LIST_ITEM,
  h1: HEADING,
  h2: HEADING,
  h3: HEADING,
  table: TABLE,
  tr: TABLE_ROW,
  td: TABLE_CELL,
  th: TABLE_CELL,
};

const INLINE_TAGS_HTML = {
  a: LINK,
  span: TEXT,
};

// supported marks for html paste
const MARK_TAGS_HTML = {
  strong: 'bold',
  em: 'italic',
  u: 'underline',
  var: 'variable',

  // semantically incorrect tags that we still need to handle
  b: 'bold',
  i: 'italic',
  code: 'variable',

  // TODO: support `strikethrough`
};

// these tags will be ignored when pasted in.
const BLACKLIST_TAGS = ['g-emoji'];

// chars with these codes will be ignored when pasted in.
const BLACKLIST_CHARCODES = [
  8, // backspace char, see PARTNER-18163
];

// attributes to retain from an html paste
const ATTRIBUTES_WHITELIST = ['href', 'title', 'src', 'aria-label'];

// returns the slate 'data' attributes object given an html element
const getDataAttributes = (el: HTMLElement): {} | HTMLAttributes => {
  const data: HTMLAttributes = {};

  ATTRIBUTES_WHITELIST.forEach((attr) => {
    // retain attributes from paste if whitelisted
    if (el.hasAttribute(attr)) {
      data[attr as keyof HTMLAttributes] = el.getAttribute(attr);
    }
  });

  return data;
};

// determines bullet type from html element
const getListAttributes = (el: HTMLElement): {} => {
  return {
    attributes: {
      bulletType: el.tagName.toLowerCase() === 'ol' ? 'numbers' : 'bullets',
    },
  };
};

// determines heading level from html element
const getHeadingAttributes = (el: HTMLElement, isWord: boolean): {} => {
  let level = '';

  if (isWord) {
    level = el.getAttribute('aria-level') ?? '1';
  } else {
    const tagName = el.tagName.toLowerCase();
    level = tagName.split('h')[1].toString(); // get the number part of the tag h1/h2/h3
  }

  return {
    attributes: {
      level,
    },
  };
};

const getInvalidImageMessage = () =>
  _t(
    'Sorry, we do not support pasting external images. We recommend downloading the external image to your computer, then uploading it via the Upload Image option.'
  );

/*
 * Rules for deserializing pasted html into valid Slate content.
 * Note: each deserialize rule is executed in the order of the array.
 * Returning `null` will halt the rule chain and add nothing. To delegate to the next rule, the return value must be `undefined`.
 * doc: https://docs.slatejs.org/other-packages/index#rule-deserialize
 */
const HTML_PASTE_RULES = [
  {
    // handle blocks as described in BLOCK_TAGS_HTML
    deserialize(el: HTMLElement, next: (x0: NodeListOf<ChildNode>) => {}): {} | undefined {
      const block = BLOCK_TAGS_HTML[el.tagName.toLowerCase() as keyof typeof BLOCK_TAGS_HTML];

      if (block) {
        let blockType = block;
        const isWord = isMsWordContent(el.parentElement);
        const isWordHeading = isWord ? el.getAttribute('role') === 'heading' : false;

        if (isWordHeading) {
          blockType = HEADING;
        }

        return {
          object: 'block',
          type: blockType,
          nodes: next(el.childNodes),
          data: Immutable.fromJS({
            ...getDataAttributes(el),
            ...(blockType === BULLET_LIST || blockType === NUMBER_LIST ? getListAttributes(el) : {}),
            ...(blockType === HEADING ? getHeadingAttributes(el, isWord) : {}),
          }),
        };
      }

      // returning `undefined` delegates to next rule
      return undefined;
    },
  },
  {
    // handle inlines as described in INLINE_TAGS_HTML
    deserialize(el: HTMLElement, next: (x0: NodeListOf<ChildNode>) => {}): {} | undefined {
      const inline = INLINE_TAGS_HTML[el.tagName.toLowerCase() as keyof typeof INLINE_TAGS_HTML];

      if (inline) {
        return {
          object: 'inline',
          type: inline,
          nodes: next(el.childNodes),
          data: Immutable.fromJS(getDataAttributes(el)),
        };
      }

      return undefined;
    },
  },
  {
    // handle marks as described in MARK_TAGS_HTML
    deserialize(el: HTMLElement, next: (x0: NodeListOf<ChildNode>) => {}): {} | undefined | null {
      const tagName = el.tagName.toLowerCase();
      const mark = MARK_TAGS_HTML[tagName as keyof typeof MARK_TAGS_HTML];

      /*
        Ignore the 'b' tag because Google Docs incorrectly wraps their content in <b> which would
        then be marked as bold here, thus making the entire pasted content bolded :/
        Fortunately, they use a unique id `docs-internal-guid-{someId}` for the wrapper so we can
        use that to differentiate from other external content. This does mean we are coupling with Docs
        and we need to update if they change their implmentation, but there isn't any other way to do
        this right now.

        More reading on this issue:
        - https://dev.ckeditor.com/ticket/13877
        - https://github.com/ProseMirror/prosemirror-schema-basic/commit/cbbdc1a6915047bc169d8fca7821fc07a31c0e35
      */
      if (tagName === 'b' && isGoogleDocsContent(el)) {
        return undefined;
      }

      if (mark) {
        // convert to marks for supported content
        return {
          object: 'mark',
          type: mark,
          nodes: next(el.childNodes),
        };
      } else if (el.nodeName === '#text') {
        const marks = [] as Array<{ type: string; object: string }>;

        // handle formatted content from MS Word
        if (isMsWordContent(el.parentElement)) {
          const parentTag = el.parentElement?.closest('span.TextRun');
          const parentTagStyle = parentTag ? parentTag.getAttribute('style') || '' : '';

          if (isBoldMsWord(parentTagStyle)) {
            marks.push({ type: MARKS.BOLD, object: 'mark' });
          }

          if (isItalicMsWord(parentTagStyle)) {
            marks.push({ type: MARKS.ITALIC, object: 'mark' });
          }

          if (isUnderlineMsWord(parentTagStyle)) {
            marks.push({ type: MARKS.UNDERLINE, object: 'mark' });
          }
        }

        // handle formatted content from Google Docs
        if (isGoogleDocsContent(el.parentElement)) {
          /*
            Parse `style` attribute for information on text formatting because for some
            reason, Google Docs uses a <span> with `style` attributes to represent text formatting :/
          */
          const style = el.parentElement?.getAttribute('style') || '';

          if (isBoldGoogleDocs(style)) {
            marks.push({ type: MARKS.BOLD, object: 'mark' });
          }

          if (isItalicGoogleDocs(style)) {
            marks.push({ type: MARKS.ITALIC, object: 'mark' });
          }

          if (isUnderlineGoogleDocs(style)) {
            marks.push({ type: MARKS.UNDERLINE, object: 'mark' });
          }
        }

        const textContent = (el.textContent || '').replace(String.fromCharCode(...BLACKLIST_CHARCODES), ''); // ignore invalid chars

        return {
          object: 'text',
          leaves: [
            {
              marks,
              object: 'leaf',
              text: textContent,
            },
          ],
        };
      } else {
        if (BLACKLIST_TAGS.includes(el.tagName.toLowerCase())) {
          // returning `null` will ignore this tag
          return null;
        }

        console.error(`[CMLEditorV2] Unable to parse pasted html for node: `, el); // eslint-disable-line no-console

        // specific helpful error messages by content type
        switch (el.tagName.toLowerCase()) {
          case 'img':
            // this customEvent has a listener in `CMLEditorV2` to render a notification
            document.dispatchEvent(
              new CustomEvent('onInvalidCml', {
                detail: {
                  tag: el.tagName,
                  message: getInvalidImageMessage(),
                },
              })
            );
            break;

          default:
            console.error(`[CMLEditorV2] Invalid tag pasted in: ${el.tagName}`); // eslint-disable-line no-console
            break;
        }
      }

      return undefined;
    },
  },
];

export default HTML_PASTE_RULES;
