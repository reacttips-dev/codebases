import { periods } from '@pipedrive/insights-core';
import { Translator } from '@pipedrive/react-utils';

export interface PeriodTranslations {
	relativeDates: {
		[date in periods.RelativeDate]: string;
	};
	relativePeriods: {
		[period in periods.RelativePeriod]: string;
	};
	rollingPeriods: {
		[period in periods.RollingPeriod]: string;
	};
}

let labelTranslations: any;
let operandsTranslations: any;
let periodTranslations: any;

const getStaticLabelTranslations = (translator: Translator) => {
	if (labelTranslations) {
		return labelTranslations;
	}

	labelTranslations = {
		add_time: translator.gettext('Deal created'),
		close_time: translator.gettext('Deal closed on'),
		creator_user_id: translator.gettext('Creator'),
		creator_user: translator.gettext('Creator'),
		currency: translator.gettext('Currency'),
		lost_reason: translator.gettext('Lost reason'),
		pipeline: translator.gettext('Pipeline'),
		pipeline_id: translator.gettext('Pipeline'),
		stage: translator.gettext('Stage'),
		stage_id: translator.gettext('Stage'),
		status: translator.gettext('Status'),
		user_id: translator.gettext('Owner'),
		user: translator.gettext('Owner'),
		won_time: translator.gettext('Won time'),
		value: translator.gettext('Value'),
		weighted_value: translator.gettext('Weighted value'),
		avg: translator.gettext('Average deal value'),
		sum: translator.gettext('Total value of deals'),
		count: translator.gettext('Total count of deals'),
		lost_time: translator.gettext('Lost time'),
		average: translator.gettext('Average deal value'),
		total: translator.gettext('Total'),
		expected_close_date: translator.gettext('Expected close date'),
		stage_change_time: translator.gettext('Last stage change'),
		update_time: translator.gettext('Update time'),
		org_id: translator.gettext('Organization'),
		'payments.due_at': translator.gettext('Payment date'),
		'payments.payment_type': translator.gettext('Revenue type'),
		'deal_products.product_id': translator.gettext('Product'),
		'deal_products.sum': translator.gettext('Product value'),
		'deal_products.amount': translator.gettext('Number of products'),
		person_id: translator.gettext('Contact person'),
		team_id: translator.gettext('Team'),
		last_incoming_email_time: translator.gettext(
			'Last incoming email time',
		),
		last_outgoing_email_time: translator.gettext(
			'Last outgoing email time',
		),
		next_activity_date: translator.gettext('Next activity date'),
		last_activity_date: translator.gettext('Last activity date'),
		activities_count: translator.gettext('Total activities'),
		active: translator.gettext('Active'),
		done_activities_count: translator.gettext('Done activities'),
		undone_activities_count: translator.gettext('Activities to do'),
		email_messages_count: translator.gettext('Email messages count'),
		probability: translator.gettext('Probability'),
		title: translator.gettext('Title'),
		open: translator.gettext('Open'),
		lost: translator.gettext('Lost'),
		won: translator.gettext('Won'),
		id: 'ID',
	};

	return labelTranslations;
};

export const getOperandsTranslations = (translator: Translator) => {
	if (operandsTranslations) {
		return operandsTranslations;
	}

	operandsTranslations = {
		isExactly: translator.gettext('is'),
		isAnyOf: translator.gettext('is any of'),
		isMoreThan: translator.gettext('is more than'),
		isLessThan: translator.gettext('is less than'),
		isNotAnyOf: translator.gettext('is not'),
	};

	return operandsTranslations;
};

export const getPeriodTranslations = (
	translator: Translator,
): PeriodTranslations => {
	if (periodTranslations) {
		return periodTranslations;
	}

	periodTranslations = {
		relativeDates: {
			[periods.RelativeDate.YESTERDAY]: translator.gettext('Yesterday'),
			[periods.RelativeDate.TODAY]: translator.gettext('Today'),
			[periods.RelativeDate.TOMORROW]: translator.gettext('Tomorrow'),
		},
		relativePeriods: {
			[periods.RelativePeriod.WEEK]: translator.gettext('This week'),
			[periods.RelativePeriod.LAST_WEEK]: translator.gettext('Last week'),
			[periods.RelativePeriod.NEXT_WEEK]: translator.gettext('Next week'),
			[periods.RelativePeriod.LAST_TWO_WEEKS]:
				translator.gettext('Last two weeks'),
			[periods.RelativePeriod.MONTH]: translator.gettext('This month'),
			[periods.RelativePeriod.LAST_MONTH]:
				translator.gettext('Last month'),
			[periods.RelativePeriod.NEXT_MONTH]:
				translator.gettext('Next month'),
			[periods.RelativePeriod.QUARTER]:
				translator.gettext('This quarter'),
			[periods.RelativePeriod.LAST_QUARTER]:
				translator.gettext('Last quarter'),
			[periods.RelativePeriod.YEAR]: translator.gettext('This year'),
			[periods.RelativePeriod.LAST_YEAR]: translator.gettext('Last year'),
			[periods.RelativePeriod.NEXT_YEAR]: translator.gettext('Next year'),
		},
		rollingPeriods: {
			[periods.RollingPeriod.PAST_7_DAYS]:
				translator.gettext('Past 7 days'),
			[periods.RollingPeriod.PAST_2_WEEKS]:
				translator.gettext('Past 2 weeks'),
			[periods.RollingPeriod.NEXT_7_DAYS]:
				translator.gettext('Next 7 days'),
			[periods.RollingPeriod.NEXT_2_WEEKS]:
				translator.gettext('Next 2 weeks'),
			[periods.RollingPeriod.PAST_1_MONTH]:
				translator.gettext('Past 1 month'),
			[periods.RollingPeriod.PAST_3_MONTHS]:
				translator.gettext('Past 3 months'),
			[periods.RollingPeriod.PAST_6_MONTHS]:
				translator.gettext('Past 6 months'),
			[periods.RollingPeriod.PAST_12_MONTHS]:
				translator.gettext('Past 12 months'),
			[periods.RollingPeriod.NEXT_MONTH]:
				translator.gettext('Next month'),
			[periods.RollingPeriod.NEXT_3_MONTHS]:
				translator.gettext('Next 3 months'),
			[periods.RollingPeriod.NEXT_6_MONTHS]:
				translator.gettext('Next 6 months'),
			[periods.RollingPeriod.NEXT_12_MONTHS]:
				translator.gettext('Next 12 months'),
		},
	};

	return periodTranslations;
};

export const getFlatPeriodTranslations = (translator: Translator) => {
	const translatedPeriods = getPeriodTranslations(translator);

	return {
		...translatedPeriods.relativeDates,
		...translatedPeriods.relativePeriods,
		...translatedPeriods.rollingPeriods,
		custom: translator.gettext('Custom period'),
	};
};

export const getStaticFieldLabel = (
	translator: Translator,
	fieldKey: string,
) => {
	const fieldLabelsTypeMap = getStaticLabelTranslations(translator);

	return fieldLabelsTypeMap[fieldKey];
};
