/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const { Auth } = require('app/scripts/db/auth');
const limitErrorPopover = require('app/scripts/views/lib/limit-error-popover');

const trackingArea = 'boardMemberLimit';
const maybeDisplayMemberLimitsError = function (elem, board, member) {
  const m = (() => {
    if (
      board != null
        ? board.isOverLimit('boards', 'totalMembersPerBoard')
        : undefined
    ) {
      return {
        message: 'members exceeds total per board limit',
        params: { boardName: board.get('name'), boardId: board.get('id') },
      };
    } else if (
      member != null
        ? member.isOverLimit('boards', 'totalPerMember')
        : undefined
    ) {
      if (Auth.isMe(member)) {
        return { message: 'your boards exceed total per member limit' };
      } else {
        return {
          message: 'boards exceeds total per member limit',
          params: { memberName: member.get('name') },
        };
      }
    }
  })();

  if (m != null) {
    limitErrorPopover(_.extend({ trackingArea, elem }, m));
    return true;
  }
  return false;
};

module.exports = { maybeDisplayMemberLimitsError };
