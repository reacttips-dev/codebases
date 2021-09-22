import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import {
	HEIGHT_OF_HOUR,
	GRID_OFFSET,
	DURATIONS,
	ITEM_CONTEXT,
	FORMAT_24H,
} from '../../../config/constants';
import { formatDuration, formatDateToUTC, formatTime24H, formatUTCDate } from '../../../utils/date';
import {
	setCurrentDraggableItem,
	updateCalendarItem,
	removeCalendarItem,
} from '../actions/calendar';
import { trackCalendarItemDragged, trackCalendarItemUpdated } from '../actions/tracking';
import {
	snapYAxis,
	calculateDateTimeFromCoordinates,
	getDropAreaFromCoordinates,
} from '../utils/grid';
import Dragster from '../utils/dragster';
import context from '../../../utils/context';
import { supportedPointerEvents } from '../utils/browser';
import classes from '../scss/_draggable-item.scss';

class DraggableItem extends PureComponent {
	constructor(props) {
		super(props);

		this.dragster = null;
		this.element = null;
		this.state = {
			dragOffset: {
				x: 0,
				y: 0,
			},
		};
		this.pointerEvents = supportedPointerEvents();
		this.previewData = null;
		this.dropAreaHandlers = {
			allday: this.calculateAllDayDueDateTime.bind(this),
			grid: this.calculateGridDueDateTime.bind(this),
		};
	}

	calculateGridDueDateTime(width, height, x, y) {
		const { item, startDate, daysNumber } = this.props;
		const isGridItem = item.get('context') === ITEM_CONTEXT.GRID;
		const snappedY = snapYAxis(
			Math.max(y, GRID_OFFSET.TOP) - this.state.dragOffset.y - GRID_OFFSET.TOP,
		);
		const date = calculateDateTimeFromCoordinates(startDate, daysNumber, width, height, {
			x,
			y: snappedY,
		}).utc();

		return {
			due_date: formatUTCDate(date),
			due_time: formatTime24H(date),
			duration: formatDuration(
				isGridItem ? item.getIn(['data', 'duration']) : DURATIONS.GRID_DEFAULT_DURATION,
			),
		};
	}

	calculateAllDayDueDateTime(width, height, x) {
		const { item, startDate, daysNumber } = this.props;

		const isAlldayItem = item.get('context') === ITEM_CONTEXT.ALLDAY;
		const date = calculateDateTimeFromCoordinates(startDate, daysNumber, width, height, {
			x: isAlldayItem ? x - this.state.dragOffset.x : x,
			y: 0,
		});

		const dueTime =
			isAlldayItem && item.getIn(['data', 'due_time']) ? date.utc().format(FORMAT_24H) : null;

		return {
			due_date: dueTime ? formatDateToUTC(date) : formatUTCDate(date),
			due_time: dueTime,
			duration: isAlldayItem ? item.getIn(['data', 'duration']) : null,
		};
	}

	onMove(event) {
		const { item, currentDraggableItem, updateCalendarItem } = this.props;
		const dropArea = getDropAreaFromCoordinates(event.clientX, event.clientY);

		if (!dropArea) {
			return null;
		}

		const calculateDueDateTime = this.dropAreaHandlers[dropArea.name];

		if (!calculateDueDateTime) {
			return null;
		}

		const data = {
			subject: item.getIn(['data', 'subject']),
			...calculateDueDateTime(
				dropArea.width,
				dropArea.height,
				dropArea.cursor.x,
				dropArea.cursor.y,
			),
		};

		if (isEqual(this.previewData, data)) {
			return null;
		}

		this.previewData = data;

		return updateCalendarItem(
			currentDraggableItem.mergeDeep({
				id: `${currentDraggableItem.get('type')}.${currentDraggableItem.get('id')}.preview`,
				ignoreIntersection: true,
				isDragging: true,
				data: this.previewData,
			}),
		);
	}

	onPress(event) {
		const { item } = this.props;
		const topOffset = item.getIn(['position', 'topOffset']) || 0;
		const dropArea = getDropAreaFromCoordinates(event.clientX, event.clientY);

		if (!(dropArea && this.element.firstChild)) {
			return;
		}

		this.setState({
			dragOffset: {
				x: event.layerX,
				y: dropArea.cursor.y - this.element.firstChild.offsetTop + topOffset,
			},
		});
	}

	onMoveStart() {
		const { setCurrentDraggableItem, item, updateCalendarItem } = this.props;

		updateCalendarItem({
			id: item.get('id'),
			isHidden: true,
			ignoreIntersection: true,
		});

		return setCurrentDraggableItem(item);
	}

	async onMoveEnd() {
		const {
			item,
			currentDraggableItem,
			removeCalendarItem,
			setCurrentDraggableItem,
			updateCalendarItem,
			trackCalendarItemDragged,
			trackCalendarItemUpdated,
			calendarApi,
			webappApi,
		} = this.props;
		const id = item.get('id');
		const data = this.previewData;

		if (!data) {
			return;
		}

		this.previewData = null;

		setCurrentDraggableItem();
		removeCalendarItem(`${item.get('type')}.${id}.preview`);
		updateCalendarItem({
			id,
			isHidden: false,
			ignoreIntersection: currentDraggableItem.get('ignoreIntersection'),
		});

		const updatedItem = await calendarApi.updateItem({ id, data });

		trackCalendarItemDragged(webappApi, updatedItem, item);
		trackCalendarItemUpdated(webappApi, updatedItem, item);
	}

	stopPropagation(event) {
		event.stopPropagation();
	}

	componentDidMount() {
		this.dragster = new Dragster(this.element, {
			scrollableRegion: this.props.gridEl,
			threshold: HEIGHT_OF_HOUR / 4,
			onPress: this.onPress.bind(this),
			onMoveStart: this.onMoveStart.bind(this),
			onMove: this.onMove.bind(this),
			onMoveEnd: this.onMoveEnd.bind(this),
		});

		this.element.addEventListener(this.pointerEvents.pointerDown, this.stopPropagation);
	}

	componentWillUnmount() {
		this.onMoveEnd();

		if (this.dragster) {
			this.dragster.destroy();
		}

		this.dragster = null;

		if (this.element) {
			this.element.removeEventListener(
				this.pointerEvents.pointerDown,
				this.stopPropagation,
				false,
			);
		}
	}

	render() {
		return (
			<div ref={(element) => (this.element = element)} className={classes.draggableItem}>
				{this.props.children}
			</div>
		);
	}
}

DraggableItem.propTypes = {
	children: PropTypes.node.isRequired,
	calendarApi: PropTypes.object.isRequired,
	webappApi: PropTypes.object.isRequired,
	item: ImmutablePropTypes.map.isRequired,
	currentDraggableItem: ImmutablePropTypes.map,
	updateCalendarItem: PropTypes.func.isRequired,
	removeCalendarItem: PropTypes.func.isRequired,
	setCurrentDraggableItem: PropTypes.func.isRequired,
	startDate: PropTypes.string.isRequired,
	daysNumber: PropTypes.number.isRequired,
	gridEl: PropTypes.object,
	trackCalendarItemDragged: PropTypes.func,
	trackCalendarItemUpdated: PropTypes.func,
};

const mapStateToProps = (state) => ({
	daysNumber: state.getIn(['dates', 'daysNumber']),
	startDate: state.getIn(['dates', 'startDate']),
	currentDraggableItem: state.getIn(['calendar', 'currentDraggableItem']),
});
const mapDispatchToProps = {
	trackCalendarItemDragged,
	trackCalendarItemUpdated,
	updateCalendarItem,
	removeCalendarItem,
	setCurrentDraggableItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(context(DraggableItem));
