import { createMeetingLinkFromMeetingApi, deleteMeetingLinkFromMeetingApi } from '../../../../api';
import { getDescriptionWithMeetingInvitation } from '../../../../utils/meeting';
import { updateMultipleFields, updateField } from './form';
import {
	getConferenceLinkOptions,
	getConferenceLinkErrorType,
} from '../../../../utils/conference-meeting-integration';

function setConferenceMeetingUrlError(error) {
	return {
		type: 'SET_CONFERENCE_MEETING_URL_ERROR',
		error,
	};
}

export function setActiveConferenceMeetingIntegration(integration) {
	return {
		type: 'SET_ACTIVE_CONFERENCE_MEETING_INTEGRATION',
		integration,
	};
}

export function setActiveConferenceMeeting() {
	return (dispatch, getState) => {
		const state = getState();
		const integrations = state.getIn(['conferenceMeeting', 'conferenceMeetingIntegrations']);
		const clientId = state.getIn(['form', 'conferenceMeetingClient']);

		if (!clientId || !integrations) {
			return;
		}

		const integration = integrations.find(
			(integration) => integration.get('client_id') === clientId,
		);

		if (integration && integration.get('join_title')) {
			const joinTitle = integration.get('join_title');

			dispatch({
				type: 'SET_CONFERENCE_MEETING_JOIN_TITLE',
				joinTitle,
			});

			dispatch({
				type: 'SET_ACTIVE_CONFERENCE_MEETING_INTEGRATION',
				integration,
			});
		}
	};
}

export function createConferenceMeetingUrl(integration) {
	return async (dispatch, getState) => {
		dispatch({ type: 'CONFERENCE_MEETING_URL_REQUEST_START' });
		dispatch(setConferenceMeetingUrlError(null));

		const state = getState();

		dispatch(setActiveConferenceMeetingIntegration(integration));
		const clientId = integration.get('client_id');
		const topic =
			state.getIn(['form', 'subject']) ||
			state.getIn(['defaults', 'activitySubjectPlaceholder']);
		const dueDate = state.getIn(['form', 'dueDate']);
		const dueTime = state.getIn(['form', 'dueTime']);
		const duration = state.getIn(['form', 'duration']);
		const conferenceLinkOptions = getConferenceLinkOptions({
			topic,
			dueDate,
			dueTime,
			duration,
			clientId,
		});
		const publicDescription = state.getIn(['form', 'publicDescription']);
		const location = state.getIn(['form', 'location']);

		try {
			const response = await createMeetingLinkFromMeetingApi(conferenceLinkOptions);

			if (response.errorCode) {
				dispatch(setConferenceMeetingUrlError(getConferenceLinkErrorType(response)));
				dispatch({ type: 'CONFERENCE_MEETING_URL_REQUEST_END' });

				return;
			}

			const {
				data: {
					join_url: conferenceMeetingUrl,
					meeting_id: conferenceMeetingId,
					conference_meeting_client: conferenceMeetingClient,
					invitation,
				},
			} = response;

			const publicDescriptionWithConferenceLink = getDescriptionWithMeetingInvitation({
				publicDescription,
				invitation,
			});

			dispatch(
				updateMultipleFields({
					conferenceMeetingUrl,
					conferenceMeetingClient,
					conferenceMeetingId,
					location: location || conferenceMeetingUrl,
					publicDescription: publicDescriptionWithConferenceLink,
				}),
			);
		} catch (err) {
			dispatch(setConferenceMeetingUrlError(getConferenceLinkErrorType(err)));
		}

		dispatch({ type: 'CONFERENCE_MEETING_URL_REQUEST_END', integration });
	};
}

export function deleteConferenceMeetingUrl() {
	return async (dispatch, getState) => {
		const state = getState().toJS();

		const { location, conferenceMeetingUrl, conferenceMeetingId } = state.form;

		if (conferenceMeetingUrl === location) {
			dispatch(updateField('location', null));
		}

		dispatch(
			updateMultipleFields({
				conferenceMeetingUrl: null,
				conferenceMeetingClient: null,
				conferenceMeetingId: null,
			}),
		);

		await deleteMeetingLinkFromMeetingApi(conferenceMeetingId);
	};
}

export function cancelCheckingIntegrations() {
	return {
		type: 'CANCEL_CHECKING_INTEGRATIONS',
	};
}
