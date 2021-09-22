import { useTranslator } from '@pipedrive/react-utils';
import { LimitType, TierCode } from '../types';

interface Props {
	tierCode: TierCode;
	tierLimit: number;
	nextTierLimit: number;
	canBill: boolean;
	numberOfItems: number;
	limitType: LimitType;
	isReseller: boolean;
}

interface Result {
	roundedPercentage: number;
	title: string;
	subTitle: string;
	subText: string;
	buttonTranslator: { translatedUsageButton: string; translatedLearnButton: string; translatedUpgradeButton: string };
}

export function useUpgradeTranslations({
	tierCode,
	tierLimit,
	nextTierLimit,
	canBill,
	numberOfItems,
	limitType,
	isReseller,
}: Props): Result {
	const translator = useTranslator();
	const nextTierLimitFormat = nextTierLimit.toLocaleString();

	const getPlanName = (tierCode: TierCode) => {
		switch (tierCode) {
			case 'silver': {
				return translator.gettext('Advanced');
			}
			case 'gold': {
				return translator.gettext('Professional');
			}

			case 'platinum': {
				return translator.gettext('Enterprise');
			}
		}
	};

	const getLimitType = (limitType: LimitType) => {
		switch (limitType) {
			case 'deals': {
				return translator.gettext('deals');
			}
			case 'reports': {
				return translator.gettext('reports');
			}
			case 'fields': {
				return translator.gettext('custom fields');
			}
			case 'teams': {
				return translator.gettext('teams');
			}
			case 'groups': {
				return translator.gettext('visibility groups');
			}
		}
	};

	const planNameText = getPlanName(tierCode);
	const limitTypeText = getLimitType(limitType);

	const typeMap = {
		deals: {
			platinum: {
				bill: translator.pgettext(
					'Upgrade to the [Plan name] plan to remove the limit of open deals.',
					'Upgrade to the %s plan to remove the limit of open deals.',
					[planNameText],
				),
				resell: translator.gettext('Contact your reseller to remove the limit of open deals.'),
				normal: translator.gettext('Contact an admin user to remove the limit of open deals.'),
			},
			bill: translator.pgettext(
				'Upgrade to the [Plan name] plan to increase the limit to [Limit as number] open deals.',
				'Upgrade to the %s plan to increase the limit to %s open deals.',
				[planNameText, nextTierLimitFormat],
			),
			resell: translator.pgettext(
				'Contact your reseller to increase the limit to [Limit as number] open deals.',
				'Contact your reseller to increase the limit to %s open deals.',
				[nextTierLimitFormat],
			),
			normal: translator.pgettext(
				'Contact an admin user to increase the limit to [Limit as number] open deals.',
				'Contact an admin user to increase the limit to %s open deals.',
				[nextTierLimitFormat],
			),
		},
		reports: {
			platinum: {
				bill: translator.pgettext(
					'Upgrade to the [Plan name] plan to remove the limit of reports per user.',
					'Upgrade to the %s plan to remove the limit of reports per user.',
					[planNameText],
				),
				resell: translator.gettext('Contact your reseller to remove the limit of reports per user.'),
				normal: translator.gettext('Contact an admin user to remove the limit of reports per user.'),
			},
			bill: translator.pgettext(
				'Upgrade to the [Plan name] plan to increase the limit to [Limit as number] reports per user.',
				'Upgrade to the %s plan to increase the limit to %s reports per user.',
				[planNameText, nextTierLimitFormat],
			),
			resell: translator.pgettext(
				'Contact your reseller to increase the limit to [Limit as number] reports per user.',
				'Contact your reseller to increase the limit to %s reports per user.',
				[nextTierLimitFormat],
			),
			normal: translator.pgettext(
				'Contact an admin user to increase the limit to [Limit as number] reports per user.',
				'Contact an admin user to increase the limit to %s reports per user.',
				[nextTierLimitFormat],
			),
		},
		fields: {
			platinum: {
				bill: translator.pgettext(
					'Upgrade to the [Plan name] plan to remove the limit of custom fields.',
					'Upgrade to the %s plan to remove the limit of custom fields.',
					[planNameText],
				),
				resell: translator.gettext('Contact your reseller to remove the limit of custom fields.'),
				normal: translator.gettext('Contact an admin user to remove the limit of custom fields.'),
			},
			bill: translator.pgettext(
				'Upgrade to the [Plan name] plan to increase the limit to [Limit as number] custom fields.',
				'Upgrade to the %s plan to increase the limit to %s custom fields.',
				[planNameText, nextTierLimitFormat],
			),
			resell: translator.pgettext(
				'Contact your reseller to increase the limit to [Limit as number] custom fields.',
				'Contact your reseller to increase the limit to %s custom fields.',
				[nextTierLimitFormat],
			),
			normal: translator.pgettext(
				'Contact an admin user to increase the limit to [Limit as number] custom fields.',
				'Contact an admin user to increase the limit to %s custom fields.',
				[nextTierLimitFormat],
			),
		},
		teams: {
			platinum: {
				bill: translator.pgettext(
					'Upgrade to the [Plan name] plan to remove the limit of teams.',
					'Upgrade to the %s plan to remove the limit of teams.',
					[planNameText],
				),
				resell: translator.gettext('Contact your reseller to remove the limit of teams.'),
				normal: translator.gettext('Contact an admin user to remove the limit of teams.'),
			},
			bill: translator.pgettext(
				'Upgrade to the [Plan name] plan to increase the limit to [Limit as number] teams.',
				'Upgrade to the %s plan to increase the limit to %s teams.',
				[planNameText, nextTierLimitFormat],
			),
			resell: translator.pgettext(
				'Contact your reseller to increase the limit to [Limit as number] teams.',
				'Contact your reseller to increase the limit to %s teams.',
				[nextTierLimitFormat],
			),
			normal: translator.pgettext(
				'Contact an admin user to increase the limit to [Limit as number] teams.',
				'Contact an admin user to increase the limit to %s teams.',
				[nextTierLimitFormat],
			),
		},
		groups: {
			platinum: {
				bill: translator.pgettext(
					'Upgrade to the [Plan name] plan to remove the limit of visibility groups.',
					'Upgrade to the %s plan to remove the limit of visibility groups.',
					[planNameText],
				),
				resell: translator.gettext('Contact your reseller to remove the limit of visibility groups.'),
				normal: translator.gettext('Contact an admin user to remove the limit of visibility groups.'),
			},
			bill: translator.pgettext(
				'Upgrade to the [Plan name] plan to increase the limit to [Limit as number] visibility groups.',
				'Upgrade to the %s plan to increase the limit to %s visibility groups.',
				[planNameText, nextTierLimitFormat],
			),
			resell: translator.pgettext(
				'Contact your reseller to increase the limit to [Limit as number] visibility groups.',
				'Contact your reseller to increase the limit to %s visibility groups.',
				[nextTierLimitFormat],
			),
			normal: translator.pgettext(
				'Contact an admin user to increase the limit to [Limit as number] visibility groups.',
				'Contact an admin user to increase the limit to %s visibility groups.',
				[nextTierLimitFormat],
			),
		},
	};

	const getSubText = () => {
		const isPlatinumTier = tierCode === 'platinum';
		const translations = isPlatinumTier ? typeMap[limitType].platinum : typeMap[limitType];

		if (canBill && !isReseller) {
			return translations.bill;
		}

		return isReseller ? translations.resell : translations.normal;
	};

	const roundedPercentage = Math.round((numberOfItems / tierLimit) * 100);
	const title = translator.pgettext('[Type name] limit', '%s limit', [limitTypeText]);
	const subTitle = translator.pgettext('[Used items number] / [Limit as number] [Type name] used', '%s/%s %s used', [
		numberOfItems,
		tierLimit,
		limitTypeText,
	]);

	const subText = getSubText();

	const buttonTranslator = {
		translatedUsageButton: translator.gettext('View usage details'),
		translatedLearnButton: translator.gettext('Learn more'),
		translatedUpgradeButton: translator.gettext('Upgrade now'),
	};

	return { roundedPercentage, title, subTitle, subText, buttonTranslator };
}
