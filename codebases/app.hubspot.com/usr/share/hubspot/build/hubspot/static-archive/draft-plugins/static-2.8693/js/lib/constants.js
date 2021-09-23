'use es6';

import PropTypes from 'prop-types';
import keyMirror from 'react-utils/keyMirror';
import { getFullUrl } from 'hubspot-url-utils';
export var PLAIN_BLOCK = {
  label: 'Plain',
  style: 'unstyled',
  name: 'plain'
};
export var BLOCK_TYPES = [PLAIN_BLOCK, {
  label: 'H1',
  style: 'header-one',
  name: 'h1',
  icon: 'h1'
}, {
  label: 'H2',
  style: 'header-two',
  name: 'h2',
  icon: 'h2'
}, {
  label: 'H3',
  style: 'header-three',
  name: 'h3',
  icon: 'h3'
}, {
  label: 'H4',
  style: 'header-four',
  name: 'h4',
  icon: 'h4'
}, {
  label: 'H5',
  style: 'header-five',
  name: 'h5',
  icon: 'h5'
}, // { label: 'H6', style: 'header-six', name: 'h6' },
{
  label: 'Blockquote',
  style: 'blockquote',
  icon: 'insertQuote' || 'quotes-left',
  name: 'blockquote'
}, {
  label: 'UL',
  style: 'unordered-list-item',
  icon: 'bulletList' || 'list-ul',
  name: 'ul'
}, {
  label: 'OL',
  style: 'ordered-list-item',
  icon: 'numberList' || 'list-ol',
  name: 'ol'
}, {
  label: 'Code Block',
  style: 'code-block',
  icon: 'code',
  name: 'codeblock'
}];
export var MAX_LIST_DEPTH = 5;
export var LIST_TYPES = BLOCK_TYPES.filter(function (_ref) {
  var style = _ref.style;
  return style.indexOf('list-item') > -1;
});
export var HEADER_TYPES = BLOCK_TYPES.filter(function (_ref2) {
  var style = _ref2.style;
  return style.indexOf('header') > -1;
});
export var MISC_TYPES = BLOCK_TYPES.filter(function (type) {
  return LIST_TYPES.indexOf(type) === -1 && HEADER_TYPES.indexOf(type) === -1 && type.style !== 'unstyled';
});
export var INLINE_STYLES = [{
  label: 'Bold',
  style: 'BOLD',
  name: 'bold',
  icon: 'bold'
}, {
  label: 'Italic',
  style: 'ITALIC',
  name: 'italic',
  icon: 'italic'
}, {
  label: 'Underline',
  style: 'UNDERLINE',
  name: 'underline',
  icon: 'underline'
}];
export var decoratorPropTypes = {
  entityKey: PropTypes.string,
  children: PropTypes.node
};
export var replaceSelectionChangeTypes = keyMirror({
  PUSH: null,
  SET: null
});
export var LINK_ENTITY_TYPE = 'LINK';
export var IMAGE_BLOCK_TYPE = 'atomic';
export var IMAGE_ATOMIC_TYPE = 'IMAGE';
export var HIDDEN_FOLDER_PATH = 'rich_text_hidden_files';
export var VIDEO_CONSTANTS = {
  EMBED_SCRIPT_URL: 'https://app.vidyard.com/v1/embed.js',
  DRAFT_ATOMIC_TYPE_VIDEO: 'VIDEO',
  SALES_PROD_CLIENT_ID: 'sales.hubspot.com',
  SALES_QA_CLIENT_ID: 'sales.hubspotqa.com',
  SERVICE_HUB_PROD_CLIENT_ID: 'service.hubspot.com',
  SERVICE_HUB_QA_CLIENT_ID: 'service.hubspotqa.com',
  VIDEO_COMPONENT_PARENT_CLASS: 'video-component-parent',
  VIDEO_INTEGRATION_HAS_CREATED_VIDEO: 'video-integration-has-created-video',
  DEFAULT_VIDEO_WIDTH: 260,
  HAS_VIEWED_VIDEO_INTEGRATION_SHEPHERD: 'has-viewed-video-integration-shepherd'
};
export var INLINE_VIDEO_CONSTANTS = {
  DRAFT_ATOMIC_TYPE_INLINE_VIDEO: 'INLINE_VIDEO'
};
export var DOCUMENT_CONSTANTS = {
  DOCUMENT_LINK_PREVIEW_CLASS: 'document-link-plugin',
  DOCUMENT_LINK_PREVIEW_CONTAINER_CLASS: 'document-link-preview-container',
  DOCUMENT_LINK_PREVIEW_POPOVER_CLASS: 'document-link-preview-popover',
  DOCUMENT_ATOMIC_TYPE: 'DOCUMENT_LINK_PREVIEW',
  DOCUMENTS_LINK_ENTITY_TYPE: 'documentLink'
};
export var HIDE_MEETINGS_PLUGIN_PRO_TIP = 'HideMeetingsPluginProTip';
export var MEETINGS_LINK_TYPES = {
  OWNER: 'ownermeetingslink',
  SENDER: 'sendermeetingslink',
  CUSTOM: 'custommeetingslink'
};
export var MEETING_LINK_DOMAINS = [getFullUrl('app') + "/meetings/", getFullUrl('meetings')];
export var MEETINGS_LINK_ENTITY_TYPE = 'meetingsLink';
export var MEETINGS_PRO_TIP_ENTITY_KEY = 'meetingsLinkProTip';
export var FOCUS_TARGETS = {
  BODY: 'body',
  SUBJECT: 'subject'
};
export var SUGGESTION_ENTITY_TYPE = 'suggestion';