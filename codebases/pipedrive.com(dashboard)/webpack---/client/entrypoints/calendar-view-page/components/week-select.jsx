import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonGroup, Icon } from '@pipedrive/convention-ui-react';
import PropTypes from 'prop-types';
import Pikaday from 'pikaday';
import moment from 'moment';
import { getWeekInformation } from '../../../utils/date';
import {
	changeWeek as changeWeekAction,
	shiftWeek as shiftWeekAction,
} from '../actions/week-select';
import withContext from '../../../utils/context';
import { trackCalendarWeekChanged } from '../../../utils/track-usage';
import classes from '../scss/_week-select.scss';

class WeekSelect extends Component {
	constructor(props) {
		super(props);

		this.handleWeekChange = this.handleWeekChange.bind(this);
	}

	componentDidMount() {
		this.datePicker = new Pikaday({
			field: document.getElementById('calendarSelectDate'),
			format: 'YYYY-MM-DD',
			firstDay: moment().startOf('week').isoWeekday(),
			i18n: {
				months: moment.months('MMMM'),
				weekdays: moment.weekdays(),
				weekdaysShort: moment.weekdaysShort(),
			},
			showDaysInNextAndPreviousMonths: true,
			onSelect: this.handleWeekChange,
		});
	}

	handleWeekChange(date) {
		const { changeWeek, webappApi } = this.props;

		changeWeek(date);
		trackCalendarWeekChanged(webappApi, { date });
	}

	handleWeekShift(weeks) {
		const { shiftWeek, webappApi } = this.props;

		shiftWeek(weeks);
		trackCalendarWeekChanged(webappApi, { weeks });
	}

	componentWillUnmount() {
		this.datePicker.destroy();
	}

	render() {
		const { startDate, endDate, translator } = this.props;
		const weekDaysFormatted = getWeekInformation(startDate, endDate);

		return (
			<div
				className={classes.weekSelect}
				ref={(weekSelectRef) => (this.weekSelectRef = weekSelectRef)}
			>
				<Button className={classes.buttonPikaday} id="calendarSelectDate">
					{weekDaysFormatted}
					<Icon icon="triangle-down" size="s" />
				</Button>
				<ButtonGroup className={classes.buttonGroup}>
					<Button data-test="previous-week" onClick={() => this.handleWeekShift(-1)}>
						<Icon icon="arrow-left" size="s" />
					</Button>

					<Button data-test="today" onClick={() => this.handleWeekChange()}>
						{translator.gettext('Today')}
					</Button>

					<Button data-test="next-week" onClick={() => this.handleWeekShift(1)}>
						<Icon icon="arrow-right" size="s" />
					</Button>
				</ButtonGroup>
			</div>
		);
	}
}

WeekSelect.propTypes = {
	webappApi: PropTypes.object.isRequired,
	translator: PropTypes.object.isRequired,
	changeWeek: PropTypes.func.isRequired,
	shiftWeek: PropTypes.func.isRequired,
	startDate: PropTypes.string,
	endDate: PropTypes.string,
};

const mapStateToProps = (state) => ({
	startDate: state.getIn(['weekSelect', 'startDate']),
	endDate: state.getIn(['weekSelect', 'endDate']),
});

const mapDispatchToProps = (dispatch) => ({
	changeWeek: (date) => dispatch(changeWeekAction(date)),
	shiftWeek: (shift) => dispatch(shiftWeekAction(shift)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withContext(WeekSelect));
