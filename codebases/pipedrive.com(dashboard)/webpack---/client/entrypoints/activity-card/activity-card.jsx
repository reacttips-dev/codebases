import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { ErrorBoundary } from '@pipedrive/react-utils';
import ErrorCard from '../../common-components/ErrorCard';

import { withWebApiAndTranslatorLoader } from '../../utils/hocs';
import composeMiddleware from '../../compose-middleware';
import { Provider as ContextProvider } from '../../utils/context';

import ActivityPopover from './components/activity-popover';

import { withTracking } from './tracking/middleware';
import reducers, { getInitialState } from './reducers';
import {
	setActivity,
	setHasActiveCalendarSync,
	getCallLog,
	setCallLogId,
	setRecordingUrl,
} from './actions/activity';
import { showActivityCard } from './actions/overlays';
import {
	setConferenceMeetingIntegrationInstalled,
	setConferenceMeetingIntegration,
} from './actions/conference-meeting';

class ActivityCard extends Component {
	constructor(props) {
		super(props);

		const webappApi = props.webappApi;
		const logger = props.logger;

		this.notifyChangesExternally = (...rest) => {
			if (!webappApi.socketHandler || !webappApi.socketHandler.notify) {
				return;
			}

			try {
				webappApi.socketHandler.notify(...rest);
			} catch (e) {
				logger.remote('error', 'Error when calling webappApi.socketHandler.notify', e);
			}
		};

		this.store = createStore(
			reducers,
			getInitialState(),
			composeMiddleware(
				logger,
				{
					webappApi,
					translator: props.translator,
					logger,
					onClose: props.onClose,
					notifyChangesExternally: this.notifyChangesExternally,
				},
				withTracking(webappApi),
			),
		);

		if (module.hot) {
			module.hot.accept(
				[
					'./components/activity-popover',
					'./components/card-footer',
					'./components/card-row',
					'./components/card-snackbar',
					'./components/link-card-row',
					'./components/participants-row',
					'./components/popover-content',
					'./components/guests/guests-header',
					'./components/guests/guests-expanded',
					'./components/guests/guests-header',
					'./components/guests/guests',
					'./components/lib/click-outside',
					'./components/lib/variables.scss',
				],
				() => {
					this.forceUpdate();
				},
			);
		}

		this.loadActivityCardFromProps = this.loadActivityCardFromProps.bind(this);
	}

	async loadActivityCardFromProps() {
		const {
			activity,
			relatedObjects,
			isConferenceMeetingIntegrationInstalled,
			conferenceMeetingIntegration,
			hasActiveCalendarSync,
		} = this.props;

		this.store.dispatch(setActivity(activity, relatedObjects));
		this.store.dispatch(
			setConferenceMeetingIntegrationInstalled(!!isConferenceMeetingIntegrationInstalled),
		);
		this.store.dispatch(setConferenceMeetingIntegration(conferenceMeetingIntegration));
		this.store.dispatch(setHasActiveCalendarSync(!!hasActiveCalendarSync));

		if (this.props.activity) {
			this.store.dispatch(showActivityCard());
		}

		if (activity?.toJSON().id) {
			const { id: activityId } = activity.toJSON();
			const call = await getCallLog(activityId);
			const { id: callLogId, recording_url: recordingUrl = '' } = call ? call : {};

			if (callLogId) {
				this.store.dispatch(setCallLogId(callLogId));
			}

			if (recordingUrl) {
				this.store.dispatch(setRecordingUrl(recordingUrl));
			}
		}
	}

	componentDidMount() {
		this.loadActivityCardFromProps();
	}

	componentDidUpdate() {
		this.loadActivityCardFromProps();
	}

	render() {
		const { logger, translator, refElement, webappApi } = this.props;

		return (
			<ErrorBoundary
				error={<ErrorCard component="activity-card" />}
				logger={logger}
				loggingData={{ facility: 'activity-card' }}
			>
				<ContextProvider value={{ translator, logger, webappApi }}>
					<Provider store={this.store}>
						<ActivityPopover refElement={refElement} />
					</Provider>
				</ContextProvider>
			</ErrorBoundary>
		);
	}
}

ActivityCard.propTypes = {
	webappApi: PropTypes.object.isRequired,
	logger: PropTypes.object.isRequired,
	translator: PropTypes.object.isRequired,
	refElement: PropTypes.element,
	activity: ImmutablePropTypes.map,
	onClose: PropTypes.func,
	relatedObjects: PropTypes.object,
	isConferenceMeetingIntegrationInstalled: PropTypes.bool,
	conferenceMeetingIntegration: PropTypes.object,
	hasActiveCalendarSync: PropTypes.bool,
};

export default withWebApiAndTranslatorLoader(ActivityCard, {
	componentName: 'activity-card',
	logStateOnError: true,
});
