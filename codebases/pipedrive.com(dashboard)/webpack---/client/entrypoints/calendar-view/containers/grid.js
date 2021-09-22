import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import { range } from 'lodash';
import {
	HOURS_IN_DAY,
	ITEM_CONTEXT,
	GRID_OFFSET,
	UTC_DATE_FORMAT,
} from '../../../config/constants';
import { roundTimeToPreviousHalfHour } from '../../../utils/date';
import HourLabel from '../components/hour-label';
import { updateViewport } from '../actions/viewport';
import GridColumn from './grid-column';
import CurrentTimeIndicator from '../components/current-time-indicator';
import ResizeHandle from '../components/resize-handle';
import { calculateAndApplyPositions } from '../utils/grid-items';
import { calculateDateTimeFromCoordinates, calculateTimeTopOffset } from '../utils/grid';
import context from '../../../utils/context';
import classes from '../scss/_calendar.scss';

class Grid extends Component {
	constructor(props) {
		super(props);

		this.gridItems = Immutable.List(this.filterGridItems(props.items));
		this.updateViewport = this.updateViewport.bind(this);
		this.addNewItem = this.addNewItem.bind(this);
	}

	shouldComponentUpdate(nextProps) {
		const keysToComapre = ['startDate', 'endDate', 'daysNumber', 'scrollToTime'];
		const gridItems = this.filterGridItems(nextProps.items);

		if (
			!gridItems.equals(this.gridItems) ||
			keysToComapre.find((key) => this.props[key] !== nextProps[key])
		) {
			this.gridItems = gridItems;

			return true;
		}

		return false;
	}

	componentDidUpdate(prevProps) {
		const { scrollToTime } = this.props;

		if (scrollToTime !== prevProps.scrollToTime) {
			const timeToTopOffset = calculateTimeTopOffset(scrollToTime);

			this.scrollToTime(timeToTopOffset);
		}
	}

	componentDidMount() {
		const { scrollToTime } = this.props;
		const timeToTopOffset = calculateTimeTopOffset(scrollToTime);

		this.updateViewport();
		this.scrollToTime(timeToTopOffset, scrollToTime);

		window.addEventListener('resize', this.updateViewport);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateViewport);
	}

	updateViewport() {
		const { updateViewport } = this.props;

		return updateViewport({
			width: this.hourLabelsContainer.offsetWidth + this.gridContainer.offsetWidth,
		});
	}

	filterGridItems(items) {
		return items.filter((item) => item.get('context') === ITEM_CONTEXT.GRID);
	}

	getGridItems() {
		const { startDate, daysNumber } = this.props;

		return calculateAndApplyPositions(startDate, daysNumber, this.gridItems);
	}

	async addNewItem(event) {
		const { daysNumber, startDate, calendarApi } = this.props;
		const gridRect = this.gridContainer.getBoundingClientRect();
		const coordinates = {
			x: event.pageX - gridRect.left,
			y: event.pageY - gridRect.top - GRID_OFFSET.TOP,
		};
		const date = calculateDateTimeFromCoordinates(
			startDate,
			daysNumber,
			gridRect.width,
			gridRect.height,
			coordinates,
		);

		return await calendarApi.onGridClick({
			event,
			context: ITEM_CONTEXT.GRID,
			date: date.utc().format(UTC_DATE_FORMAT),
			time: roundTimeToPreviousHalfHour(date),
		});
	}

	scrollToTime(timeTopOffset, exact) {
		if (exact) {
			this.calendarGrid.scrollTop = timeTopOffset;

			return;
		}

		const gridHeight = this.calendarGrid.clientHeight;
		const scrollPosition = timeTopOffset - gridHeight / 3;

		this.calendarGrid.scrollTop = scrollPosition;
	}

	render() {
		const { startDate } = this.props;
		const date = moment(startDate);
		const gridItems = this.getGridItems();

		return (
			<div className={classes.grid} ref={(el) => (this.calendarGrid = el)}>
				<div
					className={classes.hourLabelsWrapper}
					ref={(el) => (this.hourLabelsContainer = el)}
				>
					{range(HOURS_IN_DAY).map((hour) => (
						<HourLabel key={`hour-label-${hour}`} hour={hour} />
					))}
				</div>

				{!this.props.hideCurrentTimeIndicator && <CurrentTimeIndicator />}

				<div
					ref={(el) => (this.gridContainer = el)}
					className={classes.daysWrapper}
					data-calendar-item-drop-area="grid"
				>
					<div
						ref={(el) => (this.gridMouseEvents = el)}
						key="mouse-event-capture"
						className={classes.mouseEvents}
					>
						<ResizeHandle
							containerRef={() => this.calendarGrid}
							item={(event) => this.addNewItem(event)}
							onClick={(event) => this.addNewItem(event)}
						/>
					</div>
					{gridItems.map((items, index) => (
						<GridColumn
							gridEl={this.calendarGrid}
							key={`column-${index}`}
							items={items}
							date={date.clone().add(index, 'days').toISOString()}
						/>
					))}
				</div>
			</div>
		);
	}
}

Grid.propTypes = {
	calendarApi: PropTypes.object.isRequired,
	startDate: PropTypes.string,
	daysNumber: PropTypes.number,
	updateViewport: PropTypes.func.isRequired,
	items: ImmutablePropTypes.list,
	hideCurrentTimeIndicator: PropTypes.bool,
	scrollToTime: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
	startDate: state.getIn(['dates', 'startDate']),
	daysNumber: state.getIn(['dates', 'daysNumber']),
	items: state.getIn(['calendar', 'items']),
	scrollToTime: state.get('scrollToTime') || ownProps.scrollToTime,
});
const mapDispatchToProps = (dispatch) => ({
	updateViewport: (viewport) => dispatch(updateViewport(viewport)),
});

export default connect(mapStateToProps, mapDispatchToProps)(context(Grid));
