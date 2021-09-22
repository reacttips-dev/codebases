import { Data } from 'slate';
import _t from 'i18n!nls/authoring';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { isURL } from 'validator';

import { BLOCK_TYPES } from '../../constants';
import { SlateValue, SlateChange, SlateInline } from '../../types';

const MAILTO_REGEX = /^mailto/;

// wrap isURL with custom options
const isValidURL = (url: string): boolean =>
  isURL(url, {
    require_protocol: true,
  });

export const hasLink = (value: SlateValue): boolean =>
  value && value.inlines.some((inline) => inline.type === BLOCK_TYPES.LINK);

export const linkStrategy = (change: SlateChange): SlateChange => {
  let initialLink = 'https://'; // encourage https links
  let initialDescription = '';
  const existingLink = hasLink(change.value);
  const { isCollapsed } = change.value.selection; // no range in selection

  if (existingLink) {
    const node = change.value.inlines.get(0) as SlateInline;
    initialLink = node.data.get('href');
    initialDescription = node.data.get('title') || '';
  }

  let description;
  let link = window.prompt(_t('Enter a link (http, https, or mailto only):'), initialLink);

  if (!link) {
    return change;
  }

  while (!isValidURL(link) && !MAILTO_REGEX.test(link)) {
    link = window.prompt(_t('Please enter a valid url (http, https, or mailto only):'), 'https://');

    if (!link || isValidURL(link) || MAILTO_REGEX.test(link)) {
      break;
    }
  }

  if (!link) {
    return change;
  }

  description = window.prompt(
    _t('Enter a short, accessible description (up to 125 characters, and only if the link name is not descriptive)'),
    initialDescription
  );

  const linkNode = {
    type: 'link',
    data: Data.create({
      href: link,
      title: description,
    }),
  };

  // update existing node
  if (existingLink) {
    // @ts-expect-error setInline not defined in the earliest available slate-react type def, we need to ugrade Slate to a newer version to fix this
    return change.setInline(linkNode).moveToEnd();
  } else if (isCollapsed) {
    // create a new link node with text as the link href
    return change.insertText(link).moveFocusBackward(link.length).wrapInline(linkNode).moveToEnd();
  }

  // convert selected node by wrapping with link
  return change.wrapInline(linkNode).moveToEnd();
};

export const unlinkStrategy = (change: SlateChange): SlateChange => {
  if (window.confirm(_t('Are you sure you want to unlink this content?'))) {
    return change.unwrapInline('link').focus();
  } else {
    return change;
  }
};
