'use es6';

export var ALIGNMENTS = {
  left: {
    attachmentHoriz: 'left',
    attachmentVert: 'top'
  },
  middle: {
    attachmentHoriz: 'center',
    attachmentVert: 'top'
  },
  right: {
    attachmentHoriz: 'right',
    attachmentVert: 'top'
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