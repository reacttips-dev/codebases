/* eslint-disable
    eqeqeq,
    @trello/disallow-filenames,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const {
  useNonPublicIfAvailable,
} = require('app/common/lib/util/non-public-fields-filter');

const {
  GOLD_RECOMMENDATION,
  GOLD_UPGRADE,
} = require('app/scripts/data/gold-banners');

const getNonZeroCredits = (member) =>
  _.filter(
    member.get('credits'),
    (c) =>
      !c.applied && c.count > 0 && ['invitation', 'promoCode'].includes(c.type),
  );
module.exports.getGoldBanner = function (member) {
  if (member.isInAnyBCOrganization()) {
    return null;
  }

  const hasGold = member.isGold();

  if (hasGold && !member.isDismissed(GOLD_UPGRADE)) {
    return {
      type: GOLD_UPGRADE,
    };
  }

  if (member.isDismissed(GOLD_RECOMMENDATION)) {
    return null;
  }

  const credits = getNonZeroCredits(member);

  let numCreditMonths = _.reduce(
    credits,
    (memo, credit) => memo + credit.count,
    0,
  );

  if (!numCreditMonths) {
    return null;
  }

  if (numCreditMonths > 12) {
    numCreditMonths = 12;
  }

  const invitedMemberNames = _.chain(credits)
    .filter((c) => c.type === 'invitation' && c.memberInvited != null)
    .pluck('memberInvited')
    .map((member) => useNonPublicIfAvailable(member, 'fullName'))
    .value();

  return {
    invitedMemberNames,
    numCreditMonths,
    type: GOLD_RECOMMENDATION,
  };
};
