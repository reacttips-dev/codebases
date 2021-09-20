// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Confirm = require('app/scripts/views/lib/confirm');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const { l } = require('app/scripts/lib/localize');
const { Analytics, getScreenFromUrl } = require('@trello/atlassian-analytics');

module.exports = function ({ trackingArea, elem, message, params }) {
  const { boardId, orgId } = params;
  Analytics.sendTrackEvent({
    action: 'exceeded',
    actionSubject: trackingArea,
    source: getScreenFromUrl(),
    attributes: {
      message,
    },
    containers: {
      board: {
        id: boardId,
      },
      organization: {
        id: orgId,
      },
    },
  });
  return Confirm.toggle(message, {
    elem,
    html: l(`confirm.${message}.text`, params),
    fxConfirm: () => PopOver.hide(),
  });
};
