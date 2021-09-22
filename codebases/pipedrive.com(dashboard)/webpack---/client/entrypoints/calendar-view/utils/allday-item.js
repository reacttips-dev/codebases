import moment from 'moment';
import * as Immutable from 'immutable';
import { has } from 'lodash';
import { ITEM_TYPE, ITEM_CONTEXT } from '../../../config/constants';

export function calculateAndApplyAlldayPositions(startDate, endDate, alldayItems) {
	const startDateLocal = moment(startDate);
	const endDateLocal = moment(endDate);
	const topPositions = {};

	alldayItems = alldayItems
		.reduce((result, item) => {
			const positions = calculateAlldayIntersections(item, { startDateLocal, endDateLocal });

			return positions.getIn(['position', 'width']) > 0
				? result.push(item.merge(positions))
				: result;
		}, Immutable.List())
		.sortBy((item) => -item.getIn(['position', 'width']))
		.sortBy((item) => item.getIn(['position', 'left']))
		.map((item) => {
			let topPosition = 0;

			if (!item.get('ignoreIntersection')) {
				const left = item.getIn(['position', 'left']);

				if (has(topPositions, left)) {
					++topPositions[left];
				}

				topPosition = topPositions[left] || 0;

				for (let i = 0; i < item.getIn(['position', 'width']); i++) {
					topPositions[left + i] = topPosition;
				}
			}

			return item.setIn(['position', 'top'], topPosition);
		});

	return alldayItems;
}

function calculateAlldayIntersections(item, { startDateLocal, endDateLocal }) {
	const startDateTime = moment(item.get('startDateTime'));
	const endDateTime = moment(item.get('endDateTime'));

	const startDiff = startDateTime.diff(startDateLocal, 'days');
	const endDiff = endDateLocal.diff(endDateTime, 'days');
	const leftOffset = Math.abs(Math.min(startDiff, 0));
	const rightOffset = Math.abs(Math.min(endDiff, 0));

	return Immutable.fromJS({
		isPreviousWeekActivity: startDiff < 0,
		isNextWeekActivity: endDiff < 0,
		position: {
			leftOffset,
			rightOffset,
			left: Math.max(startDiff, 0),
			width: Math.ceil(
				moment.duration(item.get('duration')).asDays() - leftOffset - rightOffset,
			),
		},
	});
}

export function collapseAlldayItems(alldayItems, limit, translator) {
	let hiddenItemsPerDay = Immutable.Map();

	alldayItems.forEach((item) => {
		const isHidden = item.getIn(['position', 'top']) >= limit;
		const days = item.getIn(['position', 'width']);

		if (!isHidden) {
			return;
		}

		for (let i = 0; i < days; i++) {
			const day = item.getIn(['position', 'left']) + i;
			const currentDayHiddenItems = hiddenItemsPerDay.get(day) || Immutable.List();

			hiddenItemsPerDay = hiddenItemsPerDay.set(day, currentDayHiddenItems.push(item));
		}
	});

	hiddenItemsPerDay.forEach((hiddenItems, day) => {
		const hasOneMoreItem = hiddenItems.size === 1;
		const neighboursHaveOneMoreItem =
			hasOneMoreItem &&
			!hiddenItems.find((item) => {
				const days = item.getIn(['position', 'width']);

				if (item.getIn(['position', 'top']) > limit) {
					return;
				}

				for (let i = 0; i < days; i++) {
					const day = item.getIn(['position', 'left']) + i;

					if (hiddenItemsPerDay.get(day).size > 1) {
						return;
					}
				}
			});

		if (hasOneMoreItem && neighboursHaveOneMoreItem) {
			return;
		}

		hiddenItems.forEach((removableItem) => {
			alldayItems = alldayItems.filter((item) => !item.equals(removableItem));
		});

		alldayItems = alldayItems.push(
			Immutable.fromJS({
				id: `${ITEM_TYPE.COLLAPSIBLE}.allday.${day}`,
				type: ITEM_TYPE.COLLAPSIBLE,
				position: {
					top: limit,
					left: day,
					width: 1,
				},
				data: {
					collapsible_label: translator.gettext('%d More', hiddenItems.size),
					isCollapsed: true,
				},
			}),
		);
	});

	return alldayItems;
}

export function addCollapseButtonsToAllday(alldayItems, limit, translator) {
	const itemsPerDays = alldayItems.groupBy((item) => item.getIn(['position', 'left']));

	itemsPerDays.map((itemsPerDay) => {
		const lastItem = itemsPerDay.sortBy((item) => item.getIn(['position', 'top'])).last();
		const topPosition = lastItem.getIn(['position', 'top']);
		const leftPosition = lastItem.getIn(['position', 'left']);

		if (topPosition > limit) {
			alldayItems = alldayItems.push(
				Immutable.fromJS({
					id: `${ITEM_TYPE.COLLAPSIBLE}.allday.${leftPosition}`,
					type: ITEM_TYPE.COLLAPSIBLE,
					position: {
						top: topPosition + 1,
						left: leftPosition,
						width: 1,
					},
					data: {
						collapsible_label: translator.gettext('Show less'),
						isCollapsed: false,
					},
				}),
			);
		}
	});

	return alldayItems;
}

export function filterAlldayItems(items) {
	return items.filter((item) => item.get('context') === ITEM_CONTEXT.ALLDAY);
}

export function getAlldayItems(
	{ startDate, endDate, isAlldayCollapsed, visibleAlldayItems, translator },
	items,
) {
	let alldayItems = calculateAndApplyAlldayPositions(startDate, endDate, items);

	if (isAlldayCollapsed) {
		alldayItems = collapseAlldayItems(alldayItems, visibleAlldayItems, translator);
	} else {
		alldayItems = addCollapseButtonsToAllday(alldayItems, visibleAlldayItems, translator);
	}

	return alldayItems;
}
