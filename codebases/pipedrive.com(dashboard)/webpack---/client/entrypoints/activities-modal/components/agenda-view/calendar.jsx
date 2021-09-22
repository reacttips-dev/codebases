import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { isMatch, isEmpty } from 'lodash';

import { FORMAT_24H, UTC_DATE_FORMAT, UTC_DATETIME_FORMAT } from '../../../../config/constants';
import {
	updateMultipleFields as updateMultipleFieldsAction,
	updateField as updateFieldAction,
	clearActivityDateErrors,
} from '../../store/actions/form';
import modalContext from '../../../../utils/context';
import CalendarSyncTeaser from './calendar-sync-teaser';
import { calculateLocalStartOfTheDay } from '../../../../utils/date';

const MAIN_TYPE = 'new-activity';

class Calendar extends Component {
	constructor(props) {
		super(props);

		this.getStateFromForm = this.getStateFromForm.bind(this);
		this.updateMultipleFields = this.updateMultipleFields.bind(this);
	}

	updateMultipleFields(fields) {
		const changedFields = Object.keys(fields).reduce((result, field) => {
			const isChanged = this.props[field] !== fields[field];

			return isChanged ? { ...result, [field]: fields[field] } : result;
		}, {});

		if (!isEmpty(changedFields)) {
			this.props.clearActivityDateErrors();
			this.props.updateMultipleFields(changedFields);
		}
	}

	state = {
		CalendarView: null,
		interfaces: [],
	};

	async componentDidMount() {
		const {
			CalendarView,
			CalendarItemInterface,
			extendActivitiesInterface,
			extendTimeslotsInterface,
			extendExistingActivityInterface,
			extendNewActivityInterface,
		} = await this.props.webappApi.componentLoader.load('activities-components:calendar-view');

		const interfaces = [
			new (extendExistingActivityInterface(extendActivitiesInterface(CalendarItemInterface)))(
				{
					getStateFromForm: this.getStateFromForm,
				},
			),
			new (extendTimeslotsInterface(CalendarItemInterface))(),
			new (extendNewActivityInterface(CalendarItemInterface))({
				getStateFromForm: this.getStateFromForm,
				updateMultipleFields: this.updateMultipleFields,
				activityTypes: this.props.webappApi.userSelf.attributes.activity_types,
			}),
		];

		this.setState({
			CalendarView,
			interfaces,
		});
	}

	getStateFromForm() {
		const { subject, type, dueDate, dueTime, duration, userId, activityId } = this.props;

		return {
			subject,
			type,
			due_date: dueDate,
			due_time: dueTime,
			duration,
			assigned_to_user_id: userId,
			id: activityId,
		};
	}

	get startDateTime() {
		const { dueDate, dueTime } = this.props;

		return calculateLocalStartOfTheDay(dueDate, dueTime).format(UTC_DATETIME_FORMAT);
	}

	get selectedUserId() {
		const { userId: assignedToUserId } = this.props;

		return Number(assignedToUserId || this.props.webappApi.userSelf.attributes.id);
	}

	get calendarApiQuery() {
		return { userId: this.selectedUserId, limit: 100 };
	}

	getActivityDataForCalendar() {
		const { subject, type, dueDate, dueTime, duration, activityId } = this.props;

		return {
			id: activityId,
			assigned_to_user_id: this.selectedUserId,
			subject,
			type,
			due_date: dueDate || moment.utc().format(UTC_DATE_FORMAT),
			due_time: dueTime,
			duration,
		};
	}

	componentDidUpdate(prevProps) {
		if (!this.calendarApi || isMatch(prevProps, this.props)) {
			return;
		}

		const { dueDate, dueTime } = this.props;

		if (prevProps.dueDate !== dueDate) {
			this.calendarApi.setCalendarPeriod({
				periodInDays: 1,
				startDate: this.startDateTime,
			});
		}

		const activityDataForCalendar = this.getActivityDataForCalendar();

		this.calendarApi.updateCalendarQuery(this.calendarApiQuery);
		this.calendarApi.updateItemForType(MAIN_TYPE, activityDataForCalendar);

		if (this.shouldScroll()) {
			const scrollTo = dueTime
				? moment.utc(`${dueDate} ${dueTime}`).local().format(FORMAT_24H)
				: null;

			this.calendarApi.scrollTo(scrollTo);
		}
	}

	shouldScroll() {
		const { dueTime } = this.props;
		const item = this.calendarApi.getItems(MAIN_TYPE).get(0);
		const itemDueTime = item.get('data').get('due_time');

		return itemDueTime !== dueTime;
	}

	async onCalendarViewRender(calendarApi) {
		this.calendarApi = calendarApi;

		const data = this.getActivityDataForCalendar();

		await this.calendarApi.updateItem({
			id: `${MAIN_TYPE}.${data.id}`,
			type: MAIN_TYPE,
			data,
		});
	}

	onDayChange(daysToAdd) {
		const dueDate = moment
			.utc(this.props.dueDate)
			.add(daysToAdd, 'days')
			.format(UTC_DATE_FORMAT);

		this.props.clearActivityDateErrors();
		this.props.updateField('dueDate', dueDate);
	}

	render() {
		const { CalendarView } = this.state;

		return (
			<>
				{CalendarView && (
					<CalendarView
						interfaces={this.state.interfaces}
						mainType={MAIN_TYPE}
						periodInDays={1}
						calendarApiRef={(calendarApi) => this.onCalendarViewRender(calendarApi)}
						showAgendaViewHeader={true}
						onDayBack={() => this.onDayChange(-1)}
						onDayForward={() => this.onDayChange(1)}
						startDate={this.startDateTime}
						query={this.calendarApiQuery}
					/>
				)}
				{this.props.shouldShowTeaser && <CalendarSyncTeaser />}
			</>
		);
	}
}

Calendar.propTypes = {
	webappApi: PropTypes.object.isRequired,
	subject: PropTypes.string,
	type: PropTypes.string,
	dueDate: PropTypes.string,
	dueTime: PropTypes.string,
	duration: PropTypes.string,
	userId: PropTypes.number,
	updateMultipleFields: PropTypes.func.isRequired,
	updateField: PropTypes.func.isRequired,
	clearActivityDateErrors: PropTypes.func.isRequired,
	activityId: PropTypes.number,
	shouldShowTeaser: PropTypes.bool,
};

const mapStateToProps = (state) => {
	return {
		subject: state.getIn(['form', 'subject']),
		type: state.getIn(['form', 'type']),
		dueDate: state.getIn(['form', 'dueDate']),
		dueTime: state.getIn(['form', 'dueTime']),
		duration: state.getIn(['form', 'duration']),
		userId: state.getIn(['form', 'userId']),
		activityId: state.getIn(['form', 'activityId']),
		shouldShowTeaser: state.getIn(['calendarSyncTeaser', 'shouldShowCalendarSyncTeaser']),
	};
};

const mapDispatchToProps = (dispatch) => ({
	updateMultipleFields: (fields) => dispatch(updateMultipleFieldsAction(fields, 'agenda')),
	updateField: (field, value) => dispatch(updateFieldAction(field, value, 'agenda')),
	clearActivityDateErrors: () => dispatch(clearActivityDateErrors()),
});

export default connect(mapStateToProps, mapDispatchToProps)(modalContext(Calendar));
