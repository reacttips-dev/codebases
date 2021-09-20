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

const trackingArea = 'orgMemberLimit';
const maybeDisplayOrgMemberLimitsError = function (elem, org, member) {
  const m = (() => {
    if (
      org != null ? org.isOverLimit('orgs', 'totalMembersPerOrg') : undefined
    ) {
      return {
        message: 'members exceeds total per org limit',
        params: { orgName: org.get('name'), orgId: org.get('id') },
      };
    } else if (
      member != null ? member.isOverLimit('orgs', 'totalPerMember') : undefined
    ) {
      if (Auth.isMe(member)) {
        return { message: 'your orgs exceed total per member limit' };
      } else {
        return {
          message: 'orgs exceeds total per member limit',
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

module.exports = { maybeDisplayOrgMemberLimitsError };
