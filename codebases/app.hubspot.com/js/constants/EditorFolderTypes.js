'use es6';

import I18n from 'I18n';
export var CREATED_BY_ME = {
  value: 'CREATED_BY_ME',
  text: function text() {
    return I18n.text('editorFolderTypes.createdByMe');
  }
};
export var CREATED_BY_MY_TEAM = {
  value: 'CREATED_BY_MY_TEAM',
  text: function text() {
    return I18n.text('editorFolderTypes.createdByMyTeam');
  }
};
export var ALL_TEMPLATES = {
  value: 'ALL_TEMPLATES',
  text: function text() {
    return I18n.text('editorFolderTypes.allTemplates');
  }
};
export var OTHER_TEMPLATES = {
  value: 'OTHER_TEMPLATES',
  text: function text() {
    return I18n.text('editorFolderTypes.otherTemplates');
  }
};