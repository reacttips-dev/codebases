import { fromJS, List } from 'immutable';
import { cloneDeep } from 'lodash';
import { deleteActivity, deleteCallLog, getCallLogForActivity, updateActivity } from '../../../api';
import {
	prepareNextActivityData,
	shouldScheduleNextActivityForDeal,
} from '../../../utils/activity';
import { hideActivityCard, hideDeleteConfirmation } from './overlays';
import { activitySaveResult, startActivitySave } from './request-state';
import {
	DELETE_RESULT_SUCCESS,
	SAVE_RESULT_ERROR,
	SAVE_RESULT_SUCCESS,
} from '../../../config/constants';

export function trackInteraction(interaction) {
	return {
		type: 'ACTIVITY_CARD_INTERACTION',
		interaction,
	};
}

export function updateField(field, value) {
	return {
		type: 'FIELD_UPDATE',
		field,
		value,
	};
}

function useRelatedObjects(activity, relatedObjects) {
	if (!activity || !relatedObjects) {
		return activity;
	}

	const participants = activity.get('participants');
	const persons = relatedObjects.get('person');

	if (!participants || participants.isEmpty() || !persons) {
		return activity;
	}

	const participantsWithNames = participants.map((participant) => {
		const person = persons.get(`${participant.get('person_id')}`);

		return participant.set('name', person ? person.get('name') : '');
	});

	return activity.set('participants', participantsWithNames);
}

export function setActivity(activity, relatedObjects) {
	if (!activity) {
		return clearState();
	}

	return {
		type: 'SET_ACTIVITY',
		activity: useRelatedObjects(activity, relatedObjects),
	};
}

export function clearState() {
	return { type: 'CLEAR_STATE' };
}

export function deleteActivityAction() {
	return async (dispatch, getState, { notifyChangesExternally }) => {
		const activityId = getState().getIn(['activity', 'id']);
		const attendees = getState().getIn(['activity', 'attendees'], new List()) || new List();
		const hasAttendees = !attendees.isEmpty();
		const callLogId = getState().getIn(['activity', 'callLogId']);

		dispatch(hideDeleteConfirmation());
		dispatch(hideActivityCard());
		dispatch(startActivitySave());

		try {
			const response = await deleteActivity(
				activityId,
				hasAttendees ? { _meta: { notify_attendees: true } } : {},
			);

			dispatch(activitySaveResult(DELETE_RESULT_SUCCESS));

			notifyChangesExternally('activity', 'deleted', {
				meta: cloneDeep(response.additional_data),
				related_objects: cloneDeep(response.related_objects),
				current: cloneDeep(response.data),
				previous: getState().get('activity').toJS(),
			});

			if (callLogId) {
				await deleteCallLog(callLogId);
			}
		} catch (e) {
			dispatch(activitySaveResult(SAVE_RESULT_ERROR));

			throw e;
		}
	};
}

export function toggleActivityDone() {
	return async (dispatch, getState, { webappApi, notifyChangesExternally }) => {
		const state = getState();
		const isActivityDone = state.getIn(['activity', 'done']);

		dispatch(updateField('done', !isActivityDone));
		dispatch(startActivitySave());

		const activityId = state.getIn(['activity', 'id']);

		try {
			const newDoneValue = !isActivityDone;
			const saveResponse = await updateActivity(activityId, { done: newDoneValue });

			dispatch(activitySaveResult(SAVE_RESULT_SUCCESS));

			notifyChangesExternally('activity', 'updated', {
				related_objects: cloneDeep(saveResponse.related_objects),
				meta: cloneDeep(saveResponse.additional_data),
				current: cloneDeep(saveResponse.data),
				previous: state.get('activity').toJS(),
			});

			const updatedItem = fromJS({ data: { ...saveResponse, ...saveResponse.data } });

			if (shouldScheduleNextActivityForDeal(updatedItem)) {
				webappApi.router.go(
					null,
					'#dialog/activity/add',
					false,
					false,
					prepareNextActivityData(updatedItem),
				);
			}
		} catch (error) {
			dispatch(activitySaveResult(SAVE_RESULT_ERROR));
			dispatch(updateField('done', isActivityDone));

			throw error;
		}
	};
}

function updateAttendee(email, personId) {
	return {
		type: 'UPDATE_ATTENDEE',
		email,
		personId,
	};
}

export function assignAttendeeToPerson(email, personId) {
	return async (dispatch, getState, { notifyChangesExternally }) => {
		dispatch(updateAttendee(email, personId));

		const state = getState();
		const attendees = state.getIn(['activity', 'attendees']).toJS();
		const activityId = state.getIn(['activity', 'id']);

		const saveResponse = await updateActivity(activityId, { attendees });

		notifyChangesExternally('activity', 'updated', {
			related_objects: cloneDeep(saveResponse.related_objects),
			meta: cloneDeep(saveResponse.additional_data),
			current: cloneDeep(saveResponse.data),
			previous: state.get('activity').toJS(),
		});
	};
}

export function setHasActiveCalendarSync(hasActiveCalendarSync) {
	return {
		type: 'SET_HAS_ACTIVE_CALENDAR_SYNC',
		hasActiveCalendarSync,
	};
}

export function setCallLogId(callLogId) {
	return {
		type: 'SET_CALL_LOG_ID',
		callLogId,
	};
}

export function setRecordingUrl(recordingUrl) {
	return {
		type: 'SET_RECORDING_URL',
		recordingUrl,
	};
}

export async function getCallLog(activityId) {
	return await getCallLogForActivity(activityId);
}
