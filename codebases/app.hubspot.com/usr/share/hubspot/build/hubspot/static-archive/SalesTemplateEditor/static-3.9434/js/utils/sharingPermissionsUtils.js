'use es6';

import I18n from 'I18n';
import once from 'transmute/once';
import { isSuperAdmin } from 'SalesTemplateEditor/lib/permissions';
export var canEditPermissions = function canEditPermissions(_ref) {
  var template = _ref.template,
      userProfile = _ref.userProfile;
  var userOwnsTemplate = template.get('userId') === userProfile['user_id'];
  var templateIsNew = !template.has('userId');
  return isSuperAdmin() || userOwnsTemplate || templateIsNew;
};
export var sharingOptionValues = {
  private: 'private',
  sharedWithEveryone: 'sharedWithEveryone',
  sharedSpecific: 'sharedSpecific'
};
export var getSharingOptionValue = function getSharingOptionValue(permissions) {
  if (permissions.get('visibleToAll')) {
    return sharingOptionValues.sharedWithEveryone;
  } else if (permissions.get('private')) {
    return sharingOptionValues.private;
  } else {
    return sharingOptionValues.sharedSpecific;
  }
};

var _getTemplateSharingOptions = function _getTemplateSharingOptions() {
  return [{
    text: I18n.text('templateEditor.selectShare.privateText'),
    value: sharingOptionValues.private,
    help: I18n.text('templateEditor.selectShare.privateHelp')
  }, {
    text: I18n.text('templateEditor.selectShare.sharedWithEveryoneText'),
    value: sharingOptionValues.sharedWithEveryone,
    help: I18n.text('templateEditor.selectShare.sharedWithEveryoneHelp')
  }, {
    text: I18n.text('templateEditor.selectShare.sharedSpecificText'),
    value: sharingOptionValues.sharedSpecific,
    help: I18n.text('templateEditor.selectShare.sharedSpecificHelp'),
    disabled: true,
    tooltipProps: {
      title: I18n.text('templateEditor.selectShare.sharedSpecificTooltip'),
      placement: 'left'
    }
  }];
};

export var getTemplateSharingOptions = once(_getTemplateSharingOptions);