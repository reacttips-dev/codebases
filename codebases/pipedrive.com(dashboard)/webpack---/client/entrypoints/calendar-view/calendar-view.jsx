import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { isEqual } from 'lodash';
import { ErrorBoundary } from '@pipedrive/react-utils';

import ErrorCard from '../../common-components/ErrorCard';
import { withWebApiAndTranslatorLoader } from '../../utils/hocs';
import reducers, { getInitialState } from './reducers';
import composeMiddleware from '../../compose-middleware';
import { setCalendarPeriod } from './actions/calendar';
import { Provider as ContextProvider } from '../../utils/context';
import { changeTracking } from './actions/tracking';
import { trackCalendarViewOpened } from '../../utils/track-usage';
import { CalendarItemInterface } from './interface/calendar-item-interface';

class CalendarView extends Component {
	constructor(props) {
		super(props);

		this.store = createStore(reducers, getInitialState(), composeMiddleware(props.logger));
		this.store.dispatch(
			changeTracking({
				context: props.trackEventsContext,
			}),
		);

		if (module.hot) {
			module.hot.accept(
				[
					'./reducers',
					'./containers/calendar',
					'./interface/calendar-api',
					'./interface/activities-interface',
					'./interface/timeslots-interface',
				],
				() => {
					this.store.replaceReducer(require('./reducers').default);
					this.forceUpdate();
				},
			);
		}

		if (this.props.trackOpenedEvent) {
			trackCalendarViewOpened(this.props.webappApi, this.store.getState);
		}
	}

	// eslint-disable-next-line react/no-deprecated
	componentWillMount() {
		const { CalendarApi } = require('./interface/calendar-api');
		const { interfaces, mainType, webappApi, translator } = this.props;

		this.syncStore();

		this.calendarApi = new CalendarApi(interfaces, mainType, this.store, webappApi, translator);

		this.props.calendarApiRef && this.props.calendarApiRef(this.calendarApi);
	}

	componentWillUnmount() {
		this.calendarApi.destroy();
		this.calendarApi = null;
	}

	shouldComponentUpdate(nextProps) {
		this.syncStore(nextProps);

		return !isEqual(this.props.query, nextProps.query);
	}

	syncStore(props = this.props) {
		this.store.dispatch(setCalendarPeriod(props.periodInDays, props.startDate));
	}

	render() {
		const Calendar = require('./containers/calendar').default;
		const { interfaces, logger, translator, webappApi } = this.props;

		return (
			<ErrorBoundary error={<ErrorCard component="calendar-view" />} logger={logger}>
				<ContextProvider
					value={{ calendarApi: this.calendarApi, interfaces, translator, webappApi }}
				>
					<Provider store={this.store}>
						<Calendar
							hideAllDayEvents={this.props.hideAllDayEvents}
							hideDayName={this.props.hideDayName}
							showAgendaViewHeader={this.props.showAgendaViewHeader}
							onDayBack={this.props.onDayBack}
							onDayForward={this.props.onDayForward}
							hideCurrentTimeIndicator={this.props.hideCurrentTimeIndicator}
							scrollToTime={this.props.scrollToTime}
							query={this.props.query}
							loadRelatedObjects={this.props.loadRelatedObjects}
						/>
					</Provider>
				</ContextProvider>
			</ErrorBoundary>
		);
	}
}

CalendarView.propTypes = {
	interfaces: PropTypes.arrayOf(PropTypes.instanceOf(CalendarItemInterface)).isRequired,
	startDate: PropTypes.string,
	periodInDays: PropTypes.number.isRequired,
	mainType: PropTypes.string.isRequired,
	query: PropTypes.object,
	webappApi: PropTypes.object.isRequired,
	translator: PropTypes.object.isRequired,
	logger: PropTypes.object.isRequired,
	hideDayName: PropTypes.bool,
	showAgendaViewHeader: PropTypes.bool,
	onDayBack: PropTypes.func,
	onDayForward: PropTypes.func,
	hideAllDayEvents: PropTypes.bool,
	hideCurrentTimeIndicator: PropTypes.bool,
	trackOpenedEvent: PropTypes.bool,
	scrollToTime: PropTypes.string,
	calendarApiRef: PropTypes.func,
	trackEventsContext: PropTypes.string,
	loadRelatedObjects: PropTypes.bool,
};

const CalendarViewWithLoadedTranslations = withWebApiAndTranslatorLoader(CalendarView, {
	componentName: 'calendar-view',
});

export default CalendarViewWithLoadedTranslations;
