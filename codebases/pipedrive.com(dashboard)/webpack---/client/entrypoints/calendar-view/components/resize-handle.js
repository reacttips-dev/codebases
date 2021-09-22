import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import Dragster from '../utils/dragster';
import { isEqual } from 'lodash';
import moment from 'moment';
import { HEIGHT_OF_HOUR, ITEM_CONTEXT, GRID_OFFSET } from '../../../config/constants';
import { formatDuration, formatUTCDate, formatTime24H } from '../../../utils/date';
import {
	updateCalendarItem,
	removeCalendarItem,
	setCurrentResizingItem,
} from '../actions/calendar';
import { trackCalendarItemResized, trackCalendarItemUpdated } from '../actions/tracking';
import {
	snapYAxis,
	getDropAreaFromCoordinates,
	calculateDateTimeFromCoordinates,
} from '../utils/grid';
import { calculateDurationFromDateTimeRange, getItemContext } from '../../../utils/activity';
import context from '../../../utils/context';
import { supportedPointerEvents } from '../utils/browser';

class ResizeHandle extends PureComponent {
	constructor(props) {
		super(props);

		this.dragster = null;
		this.element = null;
		this.previewOptions = null;

		this.stopPropagation = this.stopPropagation.bind(this);
		this.pointerEvents = supportedPointerEvents();
	}

	async onMoveStart(event) {
		const { item, setCurrentResizingItem, updateCalendarItem, calendarApi } = this.props;
		const resolvedItem = typeof item === 'function' ? await item(event) : item;

		if (!calendarApi.isResizable(resolvedItem)) {
			return;
		}

		updateCalendarItem({
			id: resolvedItem.get('id'),
			isHidden: true,
			ignoreIntersection: true,
		});
		setCurrentResizingItem(resolvedItem);
	}

	getPreviewOptions({ dateTime }) {
		const { currentResizingItem } = this.props;
		const duration = calculateDurationFromDateTimeRange(
			currentResizingItem.get('startDateTime'),
			dateTime,
			true,
		);
		const isAllDay =
			getItemContext({
				due_time: currentResizingItem.getIn(['data', 'due_time']),
				duration,
			}) === ITEM_CONTEXT.ALLDAY;

		if (isAllDay) {
			const startDate = currentResizingItem.get('startDateTime').clone().startOf('day').utc();
			const duration = moment.duration(
				dateTime.clone().startOf('day').add(1, 'day').diff(startDate),
			);

			return {
				duration: formatDuration(duration),
				due_date: formatUTCDate(startDate),
				due_time: formatTime24H(startDate),
			};
		}

		return {
			duration,
			due_date: currentResizingItem.getIn(['data', 'due_date']),
			due_time: currentResizingItem.getIn(['data', 'due_time']),
		};
	}

	onMove(event) {
		const { currentResizingItem, startDate, daysNumber, updateCalendarItem } = this.props;
		const dropArea = getDropAreaFromCoordinates(event.clientX, event.clientY);

		if (!(currentResizingItem && dropArea)) {
			return null;
		}

		const dateTime = calculateDateTimeFromCoordinates(
			moment(startDate),
			daysNumber,
			dropArea.width,
			dropArea.height,
			{
				x: dropArea.cursor.x,
				y: snapYAxis(dropArea.cursor.y - GRID_OFFSET.TOP),
			},
		);

		const previewOptions = this.getPreviewOptions({ dateTime });

		if (isEqual(this.previewOptions, previewOptions)) {
			return null;
		}

		this.previewOptions = previewOptions;

		return updateCalendarItem(
			currentResizingItem.mergeDeep({
				id: `${currentResizingItem.get('type')}.${currentResizingItem.get('id')}.preview`,
				isDragging: true,
				ignoreIntersection: true,
				data: this.previewOptions,
			}),
		);
	}

	async onMoveEnd() {
		const {
			currentResizingItem,
			updateCalendarItem,
			removeCalendarItem,
			setCurrentResizingItem,
			trackCalendarItemResized,
			trackCalendarItemUpdated,
			calendarApi,
			webappApi,
		} = this.props;
		const previewOptions = this.previewOptions;

		if (!(currentResizingItem && previewOptions)) {
			return;
		}

		this.previewOptions = null;

		setCurrentResizingItem();
		removeCalendarItem(
			`${currentResizingItem.get('type')}.${currentResizingItem.get('id')}.preview`,
		);
		updateCalendarItem({
			id: currentResizingItem.get('id'),
			isHidden: false,
			ignoreIntersection: currentResizingItem.get('ignoreIntersection'),
		});

		const updatedItem = await calendarApi.updateItem({
			id: currentResizingItem.get('id'),
			data: previewOptions,
		});

		trackCalendarItemResized(webappApi, currentResizingItem);
		trackCalendarItemUpdated(webappApi, updatedItem, currentResizingItem);
	}

	stopPropagation(event) {
		event.stopPropagation();
	}

	componentDidMount() {
		this.dragster = new Dragster(this.element, {
			scrollableRegion: this.props.containerRef,
			threshold: HEIGHT_OF_HOUR / 4,
			onClick: this.props.onClick,
			onMoveStart: this.onMoveStart.bind(this),
			onMove: this.onMove.bind(this),
			onMoveEnd: this.onMoveEnd.bind(this),
		});

		this.element.addEventListener(this.pointerEvents.pointerDown, this.stopPropagation);
	}

	async componentWillUnmount() {
		await this.onMoveEnd();

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
			<div
				ref={(element) => (this.element = element)}
				onClick={this.stopPropagation}
				style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
			></div>
		);
	}
}

ResizeHandle.propTypes = {
	calendarApi: PropTypes.object.isRequired,
	webappApi: PropTypes.object.isRequired,
	item: PropTypes.oneOfType([ImmutablePropTypes.map, PropTypes.func]).isRequired,
	updateCalendarItem: PropTypes.func.isRequired,
	removeCalendarItem: PropTypes.func.isRequired,
	setCurrentResizingItem: PropTypes.func.isRequired,
	currentResizingItem: ImmutablePropTypes.map,
	startDate: PropTypes.string.isRequired,
	daysNumber: PropTypes.number.isRequired,
	containerRef: PropTypes.oneOfType([PropTypes.instanceOf(Element), PropTypes.func]),
	onClick: PropTypes.func,
	trackCalendarItemResized: PropTypes.func,
	trackCalendarItemUpdated: PropTypes.func,
};

const mapStateToProps = (state) => ({
	daysNumber: state.getIn(['dates', 'daysNumber']),
	startDate: state.getIn(['dates', 'startDate']),
	currentResizingItem: state.getIn(['calendar', 'currentResizingItem']),
});
const mapDispatchToProps = {
	trackCalendarItemResized,
	trackCalendarItemUpdated,
	updateCalendarItem,
	removeCalendarItem,
	setCurrentResizingItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(context(ResizeHandle));
