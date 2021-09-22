import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Immutable from 'immutable';
import moment from 'moment';

import DatePicker from './datepicker';
import TimePicker from './timepicker';

import { is24HourFormat } from '../../../../utils/date';
import { convertPropsToState, datesModifiers } from './datepicker-utils';
import { clearActivityDateErrors, setError, updateMultipleFields } from '../../store/actions/form';

import { TimeGroup } from './datetimepicker-styles';

class DateTimePickers extends PureComponent {
	constructor(props) {
		super(props);

		this.state = convertPropsToState(props);
	}

	static getDerivedStateFromProps(props, state) {
		if (Object.keys(state).find((field) => props.errors.has(field))) {
			return null;
		}

		const newState = convertPropsToState(props);
		const changes = Object.keys(newState).reduce((changes, stateKey) => {
			if (state[stateKey] !== newState[stateKey]) {
				changes[stateKey] = newState[stateKey];
			}

			return changes;
		}, {});

		return Object.keys(changes).length > 0 ? changes : null;
	}

	hasError(field) {
		return this.props.errors.has(field);
	}

	clearAllErrors() {
		this.props.clearAllErrors();
	}

	addError(field) {
		this.props.setError(field, true);
	}

	updatePickerField(field, value) {
		if (value === this.state[field]) {
			return;
		}

		const { isPossible, clearErrors, errorFields, fields } = datesModifiers[field](
			value,
			this.state,
			this.props.errors.toJS(),
		);

		if (!isPossible) {
			if (clearErrors) {
				this.clearAllErrors();
			}

			if (errorFields) {
				errorFields.forEach((field) => this.addError(field));
			} else {
				this.addError(field);
			}

			this.setState({ [field]: value });

			return;
		}

		this.clearAllErrors();

		this.props.updateMultipleFields(fields);
	}

	render() {
		const { startDate, startTime, endDate, endTime } = this.state;
		const { locale, errors } = this.props;
		const isSameDayEvent = startDate === endDate;

		return (
			<TimeGroup is24HourFormat={is24HourFormat(locale)}>
				<span data-test="activity-due-date">
					<DatePicker
						value={startDate}
						onSelect={(date) => this.updatePickerField('startDate', date)}
						locale={locale}
						error={this.hasError('startDate')}
					/>
				</span>
				<span data-test="activity-due-time">
					<TimePicker
						value={startTime}
						locale={locale}
						fillInputOnFocus={!startTime && !errors.has('startTime')}
						onChange={(time) => this.updatePickerField('startTime', time)}
						onClear={() => this.updatePickerField('startTime', '')}
						error={this.hasError('startTime')}
					/>
				</span>
				&ndash;
				<span data-test="activity-end-time">
					<TimePicker
						value={endTime}
						locale={locale}
						fillInputOnFocus={!errors.has('endTime')}
						onChange={(time) => this.updatePickerField('endTime', time)}
						onClear={() => this.updatePickerField('endTime', '')}
						showSuggestionsBasedOnTime={isSameDayEvent ? startTime : ''}
						error={this.hasError('endTime')}
					/>
				</span>
				<span data-test="activity-end-date">
					<DatePicker
						value={endDate}
						maxDate={moment(startDate).add(1, 'month')}
						onSelect={(date) => this.updatePickerField('endDate', date)}
						locale={locale}
						error={this.hasError('endDate')}
					/>
				</span>
			</TimeGroup>
		);
	}
}

DateTimePickers.propTypes = {
	dueDate: PropTypes.string,
	dueTime: PropTypes.string,
	duration: PropTypes.string,
	errors: ImmutablePropTypes.set,
	updateMultipleFields: PropTypes.func.isRequired,
	locale: PropTypes.string,
	clearAllErrors: PropTypes.func,
	setError: PropTypes.func,
};

const mapStateToProps = (state) => {
	return {
		dueDate: state.getIn(['form', 'dueDate']),
		dueTime: state.getIn(['form', 'dueTime']),
		duration: state.getIn(['form', 'duration']),
		errors: state.getIn(['form', 'errors'], new Immutable.Set()),
	};
};

const mapDispatchToProps = {
	updateMultipleFields,
	setError,
	clearAllErrors: clearActivityDateErrors,
};

export default connect(mapStateToProps, mapDispatchToProps)(DateTimePickers);
