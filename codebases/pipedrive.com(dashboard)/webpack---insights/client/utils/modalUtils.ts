import { Translator } from '@pipedrive/react-utils';
import { types } from '@pipedrive/insights-core';

import { Entity, SubEntity } from '../types/modal';
import localState from '../utils/localState';

export const getModalData = (translator: Translator) => {
	const { getReportTypes } = localState();
	const { reportTypes } = getReportTypes();

	const getReportSubTypeData = (type: SubEntity) => {
		const subType = reportTypes.find(
			(reportType: { type: SubEntity }) => reportType.type === type,
		);

		return {
			dataType: subType.dataType,
			isAvailable: subType.isAvailable,
		};
	};

	return {
		reports: {
			title: translator.gettext('Add new report'),
			subTitle: translator.gettext('Choose report type'),
			entities: {
				[Entity.ACTIVITY]: {
					entityType: Entity.ACTIVITY,
					title: translator.gettext('Activity'),
					icon: 'calendar',
					subTypes: {
						[SubEntity.ACTIVITY]: {
							...getReportSubTypeData(SubEntity.ACTIVITY),
							title: translator.gettext('Activities performance'),
							subtitle: translator.gettext(
								'How many activities were added, completed or planned?',
							),
						},
						[SubEntity.EMAIL]: {
							...getReportSubTypeData(SubEntity.EMAIL),
							title: translator.gettext('Emails performance'),
							subtitle: translator.gettext(
								'How many emails were sent, received or opened?',
							),
						},
					},
				},
				[Entity.DEAL]: {
					entityType: Entity.DEAL,
					title: translator.gettext('Deal'),
					icon: 'deal',
					subTypes: {
						[SubEntity.STATS]: {
							...getReportSubTypeData(SubEntity.STATS),
							title: translator.gettext('Performance'),
							subtitle: translator.gettext(
								'How much did you start, win, or lose?',
							),
						},
						[SubEntity.CONVERSION]: {
							...getReportSubTypeData(SubEntity.CONVERSION),
							title: translator.gettext('Conversion'),
							subtitle: translator.gettext(
								'What is your win or loss rate?',
							),
						},
						[SubEntity.DURATION]: {
							...getReportSubTypeData(SubEntity.DURATION),
							title: translator.gettext('Duration'),
							subtitle: translator.gettext(
								'How long is your sales cycle?',
							),
						},
						[SubEntity.PROGRESS]: {
							...getReportSubTypeData(SubEntity.PROGRESS),
							title: translator.gettext('Progress'),
							subtitle: translator.gettext(
								'Are your deals moving forward in pipeline?',
							),
						},
					},
				},
				[Entity.REVENUE]: {
					entityType: Entity.REVENUE,
					title: translator.gettext('Forecast and subscription'),
					icon: 'forecast',
					subTypes: {
						[SubEntity.REVENUE_FORECAST]: {
							...getReportSubTypeData(SubEntity.REVENUE_FORECAST),
							title: translator.gettext('Revenue forecast'),
							subtitle: translator.gettext(
								'What is your expected revenue?',
							),
							plan: 'professional',
						},
						[SubEntity.RECURRING_REVENUE]: {
							...getReportSubTypeData(
								SubEntity.RECURRING_REVENUE,
							),
							title: translator.gettext('Subscription revenue'),
							subtitle: translator.gettext(
								'What is your subscription revenue?',
							),
							plan: 'advanced',
						},
					},
				},
			},
		},
		goals: {
			title: `${translator.gettext('Add goal')} 1/2`,
			subTitle: translator.gettext('Choose goal type'),
			entities: {
				[Entity.DEAL]: {
					entityType: Entity.DEAL,
					title: translator.gettext('Deal'),
					icon: 'deal',
					subTypes: {
						[SubEntity.STARTED]: {
							title: translator.gettext('Added'),
							subtitle: translator.gettext(
								'Based on the number or value of new deals',
							),
							dataType: types.DataType.DEALS,
							isAvailable: true,
						},
						[SubEntity.PROGRESSED]: {
							title: translator.gettext('Progressed'),
							subtitle: translator.gettext(
								'Based on the number or value of deals entering a certain stage',
							),
							dataType: types.DataType.DEALS,
							isAvailable: true,
						},
						[SubEntity.WON]: {
							title: translator.gettext('Won'),
							subtitle: translator.gettext(
								'Based on the number or value of won deals',
							),
							dataType: types.DataType.DEALS,
							isAvailable: true,
						},
					},
				},
				[Entity.ACTIVITY]: {
					entityType: Entity.ACTIVITY,
					title: translator.gettext('Activity'),
					icon: 'calendar',
					subTypes: {
						[SubEntity.ADDED]: {
							title: translator.gettext('Added'),
							subtitle: translator.gettext(
								'Based on the number of new activities',
							),
							dataType: types.DataType.ACTIVITIES,
							isAvailable: true,
						},
						[SubEntity.COMPLETED]: {
							title: translator.gettext('Completed'),
							subtitle: translator.gettext(
								'Based on the number of activities marked as done',
							),
							dataType: types.DataType.ACTIVITIES,
							isAvailable: true,
						},
					},
				},
				[Entity.REVENUE]: {
					entityType: Entity.REVENUE,
					title: translator.gettext('Forecast'),
					icon: 'forecast',
					subTypes: {
						[SubEntity.REVENUE_FORECAST]: {
							title: translator.gettext('Revenue forecast'),
							plan: 'professional',
							subtitle: translator.gettext(
								'Based on weighted value of open and won deals',
							),
							...getReportSubTypeData(SubEntity.REVENUE_FORECAST),
						},
					},
				},
			},
		},
	};
};
