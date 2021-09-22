import { useTranslator } from '@pipedrive/react-utils';
import { LimitType, TierCode } from '../types';

export function useTranslations(
	tierCode: TierCode,
	tierLimits: any,
	canBill: boolean,
	limitType: LimitType,
	isReseller: boolean,
) {
	const translator = useTranslator();
	Object.keys(tierLimits).forEach((tier) => {
		tierLimits[tier].deals = tierLimits[tier].deals.toLocaleString();
		tierLimits[tier].reports = tierLimits[tier].reports.toLocaleString();
		tierLimits[tier].custom_fields = tierLimits[tier].custom_fields.toLocaleString();
		tierLimits[tier].teams = tierLimits[tier].teams.toLocaleString();
		tierLimits[tier].visibility_groups = tierLimits[tier].visibility_groups.toLocaleString();
	});

	const typeMap = {
		deals: {
			increase: 'Increase your open deals limit from %1$s to %2$s',
			footer: {
				bill: translator.gettext(
					'You can close all your above-limit open deals to add more without upgrading your plan.',
				),
				noBill: translator.gettext('Above-limit open deals can be closed to add more.'),
			},
		},
		reports: {
			increase: 'Increase your reports limit from %1$s per user to %2$s per user',
			footer: {
				bill: translator.gettext(
					'You can remove all your above-limit reports to add more without upgrading your plan.',
				),
				noBill: translator.gettext('Unused reports can be removed to add more.'),
			},
		},
		fields: {
			increase: 'Increase your custom fields limit from %1$s to %2$s',
			footer: {
				bill: translator.gettext(
					'You can remove all your above-limit custom fields to add more without upgrading your plan.',
				),
				noBill: translator.gettext('Unused custom fields can be removed to add more.'),
			},
		},
		teams: {
			increase: 'Increase your teams limit from %1$s to %2$s',
			footer: {
				bill: translator.gettext(
					'You can remove all your above-limit teams to add more without upgrading your plan.',
				),
				noBill: translator.gettext('Above-limit teams can be removed to add more.'),
			},
		},
		groups: {
			increase: 'Increase your visibility groups limit from %1$s to %2$s',
			footer: {
				bill: translator.gettext(
					'You can remove all your above-limit visibility groups to add more without upgrading your plan.',
				),
				noBill: translator.gettext('Above-limit visibility groups can be removed to add more.'),
			},
		},
	};

	const planMap = {
		silver: {
			name: translator.gettext('Essential'),
			subTitle: translator.gettext('You need to upgrade to the Advanced plan or higher to increase the limit.'),
			resellerSubTitle: translator.gettext(
				'Contact your reseller to upgrade to the Advanced plan or higher to increase the limit.',
			),
			growingPerk1: translator.pgettext(
				'Increase your open deals limit from 3,000 to 10,000',
				`${typeMap.deals.increase}`,
				[`<strong>${tierLimits.silver.deals}</strong>`, `<strong>${tierLimits.gold.deals}</strong>`],
			),
			growingPerk2: translator.pgettext(
				'Increase your custom fields limit from 30 to 100',
				`${typeMap.fields.increase}`,
				[
					`<strong>${tierLimits.silver.custom_fields}</strong>`,
					`<strong>${tierLimits.gold.custom_fields}</strong>`,
				],
			),
			growingPerk3: translator.pgettext(
				'Increase your reports limit from 10 per user to 30 per user',
				`${typeMap.reports.increase}`,
				[`<strong>${tierLimits.silver.reports}</strong>`, `<strong>${tierLimits.gold.reports}</strong>`],
			),
			upgradeTitle: translator.gettext('Our Advanced plan gives you effortless automation'),
			upgradePerk1: translator.gettext('Full email sync with templates and scheduling'),
			upgradePerk2: translator.gettext('Group emailing plus open and click tracking'),
			upgradePerk3: translator.gettext('Workflow builder with triggered automations'),
		},
		gold: {
			name: translator.gettext('Advanced'),
			subTitle: translator.gettext(
				'You need to upgrade to the Professional plan or higher to increase the limit.',
			),
			resellerSubTitle: translator.gettext(
				'Contact your reseller to upgrade to the Professional plan or higher to increase the limit.',
			),
			growingPerk1: translator.pgettext(
				'Increase your open deals limit from 10,000 to 100,000',
				typeMap.deals.increase,
				[`<strong>${tierLimits.gold.deals}</strong>`, `<strong>${tierLimits.platinum.deals}</strong>`],
			),
			growingPerk2: translator.pgettext(
				'Increase your custom fields limit from 100 to 1,000',
				typeMap.fields.increase,
				[
					`<strong>${tierLimits.gold.custom_fields}</strong>`,
					`<strong>${tierLimits.platinum.custom_fields}</strong>`,
				],
			),
			growingPerk3: translator.pgettext(
				'Increase your reports limit from 30 per user to 150 per user',
				typeMap.reports.increase,
				[`<strong>${tierLimits.gold.reports}</strong>`, `<strong>${tierLimits.platinum.reports}</strong>`],
			),
			upgradeTitle: translator.gettext('Our Professional plan gives you enhanced analytics'),
			upgradePerk1: translator.gettext('Upgraded reports and visual dashboards'),
			upgradePerk2: translator.gettext('Revenue forecasts and win projections'),
			upgradePerk3: translator.gettext('Document and contract management'),
		},

		platinum: {
			name: translator.gettext('Professional'),
			subTitle: translator.gettext('You need to upgrade to the Enterprise plan to increase the limit.'),
			resellerSubTitle: translator.gettext(
				'Contact your reseller to upgrade to the Enterprise plan to increase the limit.',
			),
			growingPerk1: translator.pgettext(
				'Increase your open deals limit from 10,000 to unlimited',
				'Increase your open deals limit from %1$s to %2$sunlimited%3$s',
				[`<strong>${tierLimits.platinum.deals}</strong>`, '<strong>', '</strong>'],
			),
			growingPerk2: translator.pgettext(
				'Increase your custom fields limit from 100 to unlimited',
				'Increase your custom fields limit from %1$s to %2$sunlimited%3$s',
				[`<strong>${tierLimits.platinum.custom_fields}</strong>`, '<strong>', '</strong>'],
			),
			growingPerk3: translator.pgettext(
				'Increase your reports limit from 150 per user to unlimited',
				'Increase your reports limit from %1$s per user to %2$sunlimited%3$s',
				[`<strong>${tierLimits.platinum.reports}</strong>`, '<strong>', '</strong>'],
			),
			upgradeTitle: translator.gettext('Our Enterprise plan provides unlimited customization'),
			upgradePerk1: translator.gettext('Unlimited user permissions and teams'),
			upgradePerk2: translator.gettext('Tailored security settings and preferences'),
			upgradePerk3: translator.gettext('Implementation program and phone support'),
		},
	};

	const generateFooterString = () => {
		const limitTypeTranslations = typeMap[limitType].footer;
		if (canBill && !isReseller) {
			return translator.gettext(
				'%s Upgrading now will direct you to subscription management. You won’t be charged immediately.',
				[limitTypeTranslations.bill],
			);
		}

		return isReseller
			? translator.gettext('%s Contact your reseller to request a subscription plan upgrade.', [
					limitTypeTranslations.noBill,
			  ])
			: translator.gettext('%s Contact an admin user to request a subscription plan upgrade.', [
					limitTypeTranslations.noBill,
			  ]);
	};

	return {
		reports: {
			title: translator.gettext('You’ve reached the %s reports limit on your %s plan', [
				tierLimits[tierCode].reports,
				planMap[tierCode].name,
			]),
		},
		deals: {
			title: translator.gettext('You’ve reached the %s open deals limit on your %s plan', [
				tierLimits[tierCode].deals,
				planMap[tierCode].name,
			]),
		},
		fields: {
			title: translator.gettext('You’ve reached the %s custom fields limit on your %s plan', [
				tierLimits[tierCode].custom_fields,
				planMap[tierCode].name,
			]),
		},
		teams: {
			title: translator.gettext('You’ve reached the %s teams limit on your %s plan', [
				tierLimits[tierCode].teams,
				planMap[tierCode].name,
			]),
		},
		groups: {
			title: translator.gettext('You’ve reached the %s visibility groups limit on your %s plan', [
				tierLimits[tierCode].groups,
				planMap[tierCode].name,
			]),
		},
		subTitle: isReseller ? planMap[tierCode].resellerSubTitle : planMap[tierCode].subTitle,
		footer: generateFooterString(),
		growingPerk1: planMap[tierCode].growingPerk1,
		growingPerk2: planMap[tierCode].growingPerk2,
		growingPerk3: planMap[tierCode].growingPerk3,
		upgradeTitle: planMap[tierCode].upgradeTitle,
		upgradePerk1: planMap[tierCode].upgradePerk1,
		upgradePerk2: planMap[tierCode].upgradePerk2,
		upgradePerk3: planMap[tierCode].upgradePerk3,
	};
}
