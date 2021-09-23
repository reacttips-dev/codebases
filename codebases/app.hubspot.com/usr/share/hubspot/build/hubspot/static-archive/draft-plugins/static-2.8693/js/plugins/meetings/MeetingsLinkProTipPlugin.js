'use es6';

import { createPlugin, pluginUtils } from 'draft-extend';
import { MEETINGS_PRO_TIP_ENTITY_KEY } from '../../lib/constants';
import MeetingsLinkProTip from './MeetingsLinkProTip';

var entityToHTML = function entityToHTML(entity, originalText) {
  return originalText;
};

export default (function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      onFetchMeetingsError = _ref.onFetchMeetingsError,
      onHideProTip = _ref.onHideProTip;

  return createPlugin({
    decorators: {
      strategy: pluginUtils.entityStrategy(MEETINGS_PRO_TIP_ENTITY_KEY),
      component: MeetingsLinkProTip({
        onFetchMeetingsError: onFetchMeetingsError,
        onHideProTip: onHideProTip
      })
    },
    entityToHTML: entityToHTML
  });
});