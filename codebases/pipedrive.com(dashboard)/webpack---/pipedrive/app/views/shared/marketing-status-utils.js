const User = require('models/user');
const iamClient = require('utils/support/iam');

const MARKETING_STATUSES = {
	NO_CONSENT: 'no_consent',
	SUBSCRIBED: 'subscribed',
	UNSUBSCRIBED: 'unsubscribed',
	PENDING_UPGRADE: 'pending_upgrade',
	ARCHIVED: 'archived',
	BOUNCED: 'bounced'
};

const COACH_MARKS = {
	PROMOTE_MARKETING_BULK_EDIT: {
		selector: '[data-coachmark="bulk-edit-marketing_status"]'
	},
	PROMOTE_MARKETING_CAMPAIGN: {
		selector: '[data-coachmark="send-campaign-coach-mark"]'
	},
	PROMOTE_MARKETING_COLUMN_EDIT: {
		selector: '[data-sortkey="marketing_status"]',
		parentContainer: '.viewContainer'
	}
};

const checkMarketingStatusChangeRights = function(emails, status) {
	if (!User.companyFeatures.get('marketing_app')) {
		return false;
	}

	const primaryEmail = emails.find((email) => email.primary) || {};

	if (primaryEmail.value) {
		switch (status) {
			case MARKETING_STATUSES.SUBSCRIBED:
			case MARKETING_STATUSES.NO_CONSENT:
			case MARKETING_STATUSES.ARCHIVED:
				return true;
		}
	}

	return false;
};

class MarketingStatusCoachMark {
	show(tag) {
		if (!User.companyFeatures.get('marketing_app')) {
			return false;
		}

		const config = COACH_MARKS[tag];

		const selector = config.selector;
		const target = document.querySelector(selector);

		if (!target || target.disabled) {
			return;
		}

		iamClient.initialize(() => {
			iamClient.addCoachmark(iamClient.coachmarks[tag], target, {
				reset: true,
				parentContainer: config.parentContainer
					? target.closest(config.parentContainer)
					: null,
				onSeen: (tag) => {
					if (tag) {
						this.show(tag);
					}
				}
			});
		});
	}

	close(tag) {
		iamClient.closeCoachmark(tag.toLowerCase());
	}

	hide(tag) {
		iamClient.hideCoachmark(tag.toLowerCase());
	}
}

exports.checkMarketingStatusChangeRights = checkMarketingStatusChangeRights;
exports.marketingStatusCoachMark = new MarketingStatusCoachMark();
exports.MARKETING_STATUSES = MARKETING_STATUSES;
