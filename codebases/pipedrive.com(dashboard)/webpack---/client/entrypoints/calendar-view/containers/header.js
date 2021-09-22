import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { range } from 'lodash';
import { dateLabel, monthLabel } from '../utils/formatters';
import classes from '../scss/_header.scss';

class Header extends Component {
	renderDate(dayNr) {
		const { startDate } = this.props;
		const { weekDay, dateOfDay, isToday } = dateLabel(startDate, dayNr);
		const classNames = [classes.day];

		if (isToday) {
			classNames.push(classes.today);
		}

		return (
			<div className={classNames.join(' ')} key={`day-header-${dayNr} `}>
				{weekDay}
				<span className={classes.date}>{dateOfDay}</span>
			</div>
		);
	}

	render() {
		const { daysNumber, startDate, width } = this.props;

		return (
			<div className={classes.header} style={{ width }}>
				<div className={classes.monthLabel}>{monthLabel(startDate)}</div>
				<div className={classes.daysWrapper}>
					{range(daysNumber).map((dayNr) => this.renderDate(dayNr))}
				</div>
			</div>
		);
	}
}

Header.propTypes = {
	width: PropTypes.number.isRequired,
	daysNumber: PropTypes.number.isRequired,
	startDate: PropTypes.string,
};

const mapStateToProps = (state) => ({
	width: state.getIn(['viewport', 'width']),
	startDate: state.getIn(['dates', 'startDate']),
	daysNumber: state.getIn(['dates', 'daysNumber']),
});

export default connect(mapStateToProps)(Header);
