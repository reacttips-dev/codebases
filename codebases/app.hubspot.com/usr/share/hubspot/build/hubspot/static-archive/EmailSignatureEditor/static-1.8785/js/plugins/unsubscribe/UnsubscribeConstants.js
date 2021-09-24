'use es6';

import keyMirror from 'react-utils/keyMirror';
export var BLOCK_TYPE = 'atomic';
export var ATOMIC_TYPE = 'unsubscribe';
export var DATA_ATTRIBUTE = 'data-hs-unsubscribe';
export var LOCALE_DATA_ATTRIBUTE = 'data-hs-unsubscribe-locale';
export var LINK_TYPE_ATTRIBUTE = 'data-hs-linktype';
export var LINK_TOKEN = '{{ unsubscribe_link }}';
export var LINK_TYPES = keyMirror({
  RELEVANT: null,
  STOP_GETTING_MESSAGES: null,
  PREFER_LESS: null
});
export var NO_UNSUBSCRIBE_LINK = 'NO_UNSUBSCRIBE_LINK';