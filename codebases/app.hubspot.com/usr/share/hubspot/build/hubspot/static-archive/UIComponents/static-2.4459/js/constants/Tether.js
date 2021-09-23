'use es6';

export var ALIGNMENTS = {
  left: {
    attachmentHoriz: 'left',
    attachmentVert: 'top',
    targetAttachmentHoriz: 'left',
    targetAttachmentVert: 'bottom'
  },
  middle: {
    attachmentHoriz: 'center',
    attachmentVert: 'top',
    targetAttachmentHoriz: 'center',
    targetAttachmentVert: 'bottom'
  },
  right: {
    attachmentHoriz: 'right',
    attachmentVert: 'top',
    targetAttachmentHoriz: 'right',
    targetAttachmentVert: 'bottom'
  }
};
export var CONSTRAIN = {
  both: [{
    attachment: 'together none',
    pin: ['left', 'right'],
    to: 'window'
  }],
  none: [],
  horizontal: [{
    attachment: 'none',
    pin: ['left', 'right'],
    to: 'window'
  }],
  vertical: [{
    attachment: 'together none',
    to: 'window'
  }]
};
export var MIN_MENU_WIDTH = 144;