import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { ErrorBoundary } from '@pipedrive/react-utils';
import ErrorCard from '../../common-components/ErrorCard';

import reducers, { getInitialState } from './reducers';
import composeMiddleware from '../../compose-middleware';
import { initActiveFilter } from './actions/filter';
import { initActivityTypeFilter } from './actions/activity-type-filter';
import { selectSchedulerEvent } from './actions/scheduler';
import { getHasActiveCalendarSync } from './actions/calendar-sync';
import {
	loadConferenceMeetingIntegrationsState,
	setConferenceMeetingIntegrationAndJoinTitle,
} from './actions/conference-meeting-integration';
import customTimeslotsInterface from './custom-timeslots-interface';
import classes from './scss/_activities-calendar.scss';
import { calendarItemClicked } from '../../utils/track-usage';
import { withWebApiAndTranslatorLoader } from '../../utils/hocs';
import { Provider as ContextProvider } from '../../utils/context';

class ActivitiesCalendar extends Component {
	constructor(props) {
		super(props);

		this.store = createStore(
			reducers,
			getInitialState(),
			composeMiddleware(props.logger, {
				webappApi: props.webappApi,
			}),
		);
		this.state = {
			startDate: null,
			periodInDays: 7,
			query: null,
			CalendarView: false,
			ActivityCard: null,
			selectedActivity: null,
			selectedActivityElement: null,
			relatedObjects: null,
			isConferenceMeetingIntegrationInstalled: false,
			hasActiveCalendarSync: false,
			joinTitle: null,
			conferenceMeetingIntegration: null,
		};

		this.interfaces = [];
		this.resetSelectedActivity = this.resetSelectedActivity.bind(this);
	}

	// eslint-disable-next-line camelcase
	async UNSAFE_componentWillMount() {
		this.store.subscribe(() => {
			const state = this.store.getState();
			const activityTypeFilterItems = state.getIn(['activityTypeFilter', 'items']);

			this.setState({
				startDate: state.getIn(['weekSelect', 'startDate']),
				query: {
					userId: state.getIn(['filter', 'activeFilter', 'value']),
					type: this.getIncludedActivityTypeNames(activityTypeFilterItems),
				},
				isConferenceMeetingIntegrationInstalled: state.getIn([
					'conferenceMeetingIntegration',
					'isInstalled',
				]),
				joinTitle: state.getIn(['conferenceMeetingIntegration', 'joinTitle']),
				conferenceMeetingIntegration: state.getIn([
					'conferenceMeetingIntegration',
					'integration',
				]),
				conferenceMeetingIntegrations: state.getIn([
					'conferenceMeetingIntegration',
					'conferenceMeetingIntegrations',
				]),
				hasActiveCalendarSync: state.getIn(['calendarSync', 'hasActiveCalendarSync']),
			});
		});

		const { webappApi, calendarViewUrl } = this.props;

		this.store.dispatch(await initActiveFilter(webappApi, calendarViewUrl));
		this.store.dispatch(initActivityTypeFilter(webappApi));

		const {
			CalendarView,
			CalendarItemInterface,
			extendActivitiesInterface,
			extendTimeslotsInterface,
		} = await webappApi.componentLoader.load('activities-components:calendar-view');

		const calendarInterface = new (extendActivitiesInterface(CalendarItemInterface))();

		const timeSlotInterface = new (customTimeslotsInterface(
			extendTimeslotsInterface(CalendarItemInterface),
		))({
			onTimeslotClick: (eventId) => {
				this.store.dispatch(selectSchedulerEvent(eventId));
			},
		});

		const activitiesCardEnabled = webappApi.userSelf.companyFeatures.get('activities_card');

		if (activitiesCardEnabled) {
			this.store.dispatch(loadConferenceMeetingIntegrationsState());
			this.store.dispatch(getHasActiveCalendarSync());

			calendarInterface.onItemClick = async ({ event, item }) => {
				event.stopPropagation();

				if (
					item.get('isAdding') ||
					item.get('masterActivityId') ||
					item.get('data').get('rec_master_activity_id')
				) {
					return;
				}

				calendarInterface.removeItem('newActivity');
				const relatedObjects = calendarInterface.getRelatedObjects();

				this.setState(
					{
						selectedActivity: item.get('data'),
						selectedActivityElement: event.target,
						relatedObjects,
					},
					() => {
						this.store.dispatch(
							setConferenceMeetingIntegrationAndJoinTitle(
								this.state.selectedActivity.get('conference_meeting_client'),
								this.state.conferenceMeetingIntegrations,
							),
						);
					},
				);

				calendarItemClicked(webappApi, item);
			};

			const { default: ActivityCard } = await webappApi.componentLoader.load(
				'activities-components:activity-card',
				{
					webappApi,
					logger: this.props.logger,
				},
			);

			this.setState({ ActivityCard });
		}

		this.interfaces = [calendarInterface, timeSlotInterface];

		this.setState({ CalendarView });
	}

	resetSelectedActivity() {
		this.setState({ selectedActivity: null, selectedActivityElement: null });
	}

	componentWillUnmount() {
		for (let index = 0; index < this.interfaces.length; index++) {
			this.interfaces[index].destroy();
		}
	}

	getIncludedActivityTypeNames(items) {
		let includedActivityTypes = items.filter((item) => !item.get('excluded'));

		// Deactivated activity types should be shown in the calendar only if all types of activities are
		// selected (nothing is excluded) or all types are unselected, in which case we also show everything.
		if (includedActivityTypes.size > 0 && includedActivityTypes.size < items.size) {
			includedActivityTypes = includedActivityTypes.filter((item) => item.get('active_flag'));
		}

		return includedActivityTypes.map((item) => item.get('key_string')).join(',');
	}

	render() {
		const {
			CalendarView,
			ActivityCard,
			selectedActivity,
			selectedActivityElement,
			relatedObjects,
			isConferenceMeetingIntegrationInstalled,
			joinTitle,
			conferenceMeetingIntegration,
			hasActiveCalendarSync,
		} = this.state;
		const { webappApi, translator, logger, calendarViewUrl } = this.props;
		const Actions = require('./components/actions').default;

		return (
			<ContextProvider value={{ webappApi, translator, logger, calendarViewUrl }}>
				<ErrorBoundary error={<ErrorCard component="calendar-view-page" />} logger={logger}>
					<div className={classes.container}>
						{ActivityCard && (
							<ActivityCard
								webappApi={webappApi}
								activity={selectedActivity}
								refElement={selectedActivityElement}
								onClose={this.resetSelectedActivity}
								relatedObjects={relatedObjects}
								isConferenceMeetingIntegrationInstalled={
									isConferenceMeetingIntegrationInstalled
								}
								joinTitle={joinTitle}
								conferenceMeetingIntegration={conferenceMeetingIntegration}
								hasActiveCalendarSync={hasActiveCalendarSync}
							/>
						)}
						<Provider store={this.store}>
							<Actions />
						</Provider>
						<div className={classes.calendarContainer}>
							{CalendarView && (
								<CalendarView
									interfaces={this.interfaces}
									mainType="activity"
									startDate={this.state.startDate}
									periodInDays={this.state.periodInDays}
									query={this.state.query}
									trackEventsContext="activities-calendar"
									trackOpenedEvent
									loadRelatedObjects
								/>
							)}
						</div>
					</div>
				</ErrorBoundary>
			</ContextProvider>
		);
	}
}

ActivitiesCalendar.propTypes = {
	logger: PropTypes.object.isRequired,
	webappApi: PropTypes.object.isRequired,
	translator: PropTypes.object.isRequired,
	calendarViewUrl: PropTypes.string.isRequired,
};

export default withWebApiAndTranslatorLoader(ActivitiesCalendar, {
	componentName: 'activities-calendar',
	logStateOnError: true,
});
