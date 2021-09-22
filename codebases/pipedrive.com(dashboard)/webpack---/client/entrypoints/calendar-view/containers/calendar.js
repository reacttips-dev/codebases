import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { isEqual } from 'lodash';
import { formatDateTime } from '../../../utils/date';
import Header from './header';
import AgendaViewHeader from './agenda-view-header';
import Grid from './grid';
import Allday from './allday';
import { updateViewport as updateViewportAction } from '../actions/viewport';
import context from '../../../utils/context';
import classes from '../scss/_calendar.scss';

class Calendar extends Component {
	constructor(props) {
		super(props);

		this.updateViewport = this.updateViewport.bind(this);
	}

	componentDidMount() {
		this.updateViewport();
		this.getItems(this.composeQuery());

		window.addEventListener('resize', this.updateViewport);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateViewport);
	}

	composeQuery(props = this.props) {
		return {
			...props.query,
			startDate: formatDateTime(props.startDate),
			endDate: formatDateTime(moment(props.endDate)),
			periodInDays: props.periodInDays,
		};
	}

	componentDidUpdate(prevProps) {
		const props = this.composeQuery();

		if (!isEqual(props, this.composeQuery(prevProps))) {
			this.getItems(props);
		}
	}

	getItems(props) {
		const { calendarApi, interfaces } = this.props;

		if (interfaces) {
			Promise.all(
				interfaces.map(async (calendarInterface) => {
					const items = await calendarInterface.getItems(props, true);

					if (!items) {
						return;
					}

					const { data, relatedObjects } = items;

					calendarApi.setItemsForType(calendarInterface.getType(), data);
					calendarApi.updateRelatedObjects(relatedObjects);
				}),
			);
		}
	}

	updateViewport() {
		const { updateViewport } = this.props;

		return updateViewport({
			height: this.calendarContainer.offsetHeight,
		});
	}

	renderCalendarHeader() {
		return this.props.hideDayName ? null : <Header />;
	}

	renderHeader() {
		const { showAgendaViewHeader, onDayBack, onDayForward } = this.props;

		return showAgendaViewHeader ? (
			<AgendaViewHeader onDayBack={onDayBack} onDayForward={onDayForward} />
		) : (
			this.renderCalendarHeader()
		);
	}

	render() {
		const { currentDraggableItem, currentResizingItem } = this.props;
		const calendarClass = [classes.calendar];

		if (currentDraggableItem) {
			calendarClass.push(classes.dragging);
		} else if (currentResizingItem) {
			calendarClass.push(classes.resizing);
		}

		return (
			<div className={calendarClass.join(' ')} ref={(el) => (this.calendarContainer = el)}>
				{this.renderHeader()}
				{this.props.hideAllDayEvents ? null : <Allday />}
				<Grid
					hideCurrentTimeIndicator={this.props.hideCurrentTimeIndicator}
					scrollToTime={this.props.scrollToTime}
				/>
			</div>
		);
	}
}

Calendar.propTypes = {
	calendarApi: PropTypes.object.isRequired,
	query: PropTypes.object,
	interfaces: PropTypes.array.isRequired,

	startDate: PropTypes.string,
	endDate: PropTypes.string,
	periodInDays: PropTypes.number,
	currentDraggableItem: PropTypes.object,
	currentResizingItem: PropTypes.object,

	updateViewport: PropTypes.func.isRequired,

	hideDayName: PropTypes.bool,
	hideAllDayEvents: PropTypes.bool,
	hideCurrentTimeIndicator: PropTypes.bool,
	scrollToTime: PropTypes.string,
	showAgendaViewHeader: PropTypes.bool,
	onDayBack: PropTypes.func,
	onDayForward: PropTypes.func,
	loadRelatedObjects: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
	currentDraggableItem: state.getIn(['calendar', 'currentDraggableItem']),
	currentResizingItem: state.getIn(['calendar', 'currentResizingItem']),
	startDate: state.getIn(['dates', 'startDate']),
	endDate: state.getIn(['dates', 'endDate']),
	periodInDays: state.getIn(['dates', 'daysNumber']),
	query: state.get('query') || ownProps.query,
});

const mapDispatchToProps = {
	updateViewport: updateViewportAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(context(Calendar));
