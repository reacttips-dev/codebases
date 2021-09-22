import React from 'react';
import PropTypes from 'prop-types';

import NarrowViewCalendar from './narrow-view-calendar';
import Calendar from './calendar';
import { CalendarContainer } from './styles';
import { withLoadingState } from '../../../../utils/hocs';

const AgendaView = ({ narrowView }) => {
	return narrowView ? (
		<NarrowViewCalendar />
	) : (
		<CalendarContainer>
			<Calendar />
		</CalendarContainer>
	);
};

AgendaView.propTypes = {
	narrowView: PropTypes.bool,
};

const mapStateToIsLoading = (state) => ({
	isLoading: state.getIn(['requestState', 'activityIsLoading']),
});

export default withLoadingState(() => <div />, AgendaView, mapStateToIsLoading);
