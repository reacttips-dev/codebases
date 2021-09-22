import moment from 'moment';
import { HEIGHT_OF_HOUR } from '../../../config/constants';
import { formatTime24H } from '../../../utils/date';

export function snapYAxis(y) {
	const yAxisSnap = HEIGHT_OF_HOUR / 4;

	return Math.round(y / yAxisSnap) * yAxisSnap;
}

export function getDayFromWidth(daysNumber, width, x) {
	const dayWidth = width / daysNumber;

	return Math.floor(x / dayWidth);
}

export function calculateDateTimeFromCoordinates(
	startDate,
	daysNumber,
	width,
	height,
	coordinates,
) {
	const day = getDayFromWidth(daysNumber, width, coordinates.x);
	const minutes = Math.floor((coordinates.y / HEIGHT_OF_HOUR) * 60);

	const startOfDay = moment(startDate).add(day, 'days');
	const dueDate = startOfDay.clone().add(minutes, 'minutes');

	const utcOffsetDiff = startOfDay.utcOffset() - dueDate.utcOffset();

	const isTransitioningToDST =
		!startOfDay.isDST() &&
		dueDate.isDST() &&
		dueDate.clone().add(utcOffsetDiff, 'minutes').isDST();
	const isTransitioningFromDST = startOfDay.isDST() && !dueDate.isDST();

	if (isTransitioningToDST || isTransitioningFromDST) {
		dueDate.add(utcOffsetDiff, 'minutes');
	}

	return dueDate;
}

export function getDropAreaFromCoordinates(x, y) {
	const hoveredElement = document.elementFromPoint(x, y);

	if (!hoveredElement) {
		return null;
	}

	const dropArea = hoveredElement.closest('[data-calendar-item-drop-area]');

	if (!dropArea) {
		return null;
	}

	const dropAreaBounds = dropArea.getBoundingClientRect();
	const windowTop = window.pageYOffset || document.documentElement.scrollTop;
	const windowLeft = window.pageXOffset || document.documentElement.scrollLeft;

	return {
		name: dropArea.dataset.calendarItemDropArea,
		element: dropArea,
		width: dropArea.clientWidth,
		height: dropArea.clientHeight,
		cursor: {
			x: x - dropAreaBounds.left + dropArea.scrollLeft + windowLeft,
			y: y - dropAreaBounds.top + dropArea.scrollTop + windowTop,
		},
	};
}

export function calculateTimeTopOffset(time) {
	if (!time) {
		time = formatTime24H(moment());
	}

	return (Math.floor(moment.duration(time).asMinutes()) / 60) * HEIGHT_OF_HOUR;
}
