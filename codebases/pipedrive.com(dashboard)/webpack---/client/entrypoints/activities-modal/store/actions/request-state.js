import { fromJS } from 'immutable';
import { cloneDeep, get } from 'lodash';

import {
	getActivityById,
	deleteActivity as removeActivityById,
	deleteCallLog,
	getCallLogForActivity,
} from '../../../../api';
import {
	prepareNextActivityData,
	shouldScheduleNextActivityForDeal,
} from '../../../../utils/activity';
import {
	getActivityData,
	extractActivityDataToFields,
	fetchActivityRelatedObjects,
} from './utils/activity';
import {
	SAVE_RESULT_ERROR,
	SAVE_RESULT_SUCCESS,
	DELETE_RESULT_SUCCESS,
} from '../../../../config/constants';
import { getSaveActivityHandler, prepareNewActivityFields } from './utils/form';
import { activityToEditLoaded, updateMultipleFields } from './form';

export function startLoadingActivity(activityId) {
	return { type: 'ACTIVITY_LOAD_START', activityId };
}

export function stopLoadingActivity() {
	return { type: 'ACTIVITY_LOAD_END' };
}

export function startActivitySave() {
	return { type: 'ACTIVITY_SAVE_START' };
}

export function stopActivitySave() {
	return { type: 'ACTIVITY_SAVE_END' };
}

export function startActivityRemove() {
	return { type: 'ACTIVITY_REMOVE_START' };
}

export function stopActivityRemove() {
	return { type: 'ACTIVITY_REMOVE_END' };
}

export function activitySaveResult(result, response) {
	return { type: 'ACTIVITY_SAVE_RESULT', result, response };
}

export function activityRemoveResult(result, response) {
	return { type: 'ACTIVITY_REMOVE_RESULT', result, response };
}

export function clearAll() {
	return { type: 'CLEAR_ALL' };
}

export function saveActivity(doClose, isContextualView) {
	return async (dispatch, getState, { webappApi, onSave, notifyChangesExternally }) => {
		dispatch(startActivitySave());

		if (!isContextualView) {
			doClose && doClose();
		}

		const state = getState().toJS();
		const activityId = get(state, 'form.activityId', null);

		try {
			const activity = await getActivityData(state, { webappApi, notifyChangesExternally });
			const saveActivityHandler = getSaveActivityHandler({
				isUpdate: !!activityId,
			});
			const saveResponse = await saveActivityHandler(activityId, activity);

			dispatch(activitySaveResult(SAVE_RESULT_SUCCESS, saveResponse));

			notifyChangesExternally('activity', activityId ? 'updated' : 'added', {
				related_objects: cloneDeep(saveResponse.related_objects),
				meta: cloneDeep(saveResponse.additional_data),
				current: cloneDeep({
					...saveResponse.data,
					related_objects: saveResponse.related_objects,
				}),
				previous: cloneDeep(get(state, 'form.previousShape', null)),
			});

			onSave && onSave(saveResponse);

			const currentItem = fromJS({ data: { ...saveResponse, ...saveResponse.data } });

			if (shouldScheduleNextActivityForDeal(currentItem)) {
				const nextActivityData = prepareNextActivityData(currentItem);
				const frootModals = await webappApi.componentLoader.load('froot:modals');

				frootModals.open('webapp:modal', {
					modal: 'activity/add',
					params: nextActivityData,
				});
			}
		} catch (e) {
			dispatch(activitySaveResult(SAVE_RESULT_ERROR));

			throw e;
		} finally {
			dispatch(stopActivitySave());
		}
	};
}

export function loadActivityById(activityId) {
	return async (dispatch, _, { translator, webappApi }) => {
		activityId = activityId ? parseInt(activityId, 10) : null;

		dispatch(clearAll());

		if (!activityId) {
			dispatch(updateMultipleFields(prepareNewActivityFields(webappApi)));

			return dispatch(stopLoadingActivity());
		}

		dispatch(startLoadingActivity(activityId));

		const activityResponse = await getActivityById(activityId);

		const callLog = await getCallLogForActivity(activityId);

		if (!activityResponse || !activityResponse.data) {
			dispatch(clearAll());

			return dispatch(stopLoadingActivity());
		}

		const activityFields = extractActivityDataToFields(activityResponse, translator, callLog);

		if (activityResponse.data.project_id) {
			const { project: relatedProject } = await fetchActivityRelatedObjects(
				{ project: { id: activityResponse.data.project_id } },
				translator,
			);

			activityFields.project = relatedProject;
		}

		dispatch(activityToEditLoaded(activityFields, activityResponse));

		return dispatch(stopLoadingActivity());
	};
}

export function removeActivity() {
	return async (dispatch, getState, { notifyChangesExternally }) => {
		dispatch(startActivityRemove());

		const state = getState().toJS();
		const activityId = get(state, 'form.activityId');
		const attendees = get(state, 'form.attendees', []) || [];
		const hasAttendees = attendees && attendees.length > 0;
		const callLogId = get(state, 'form.callLogId');

		try {
			const response = await removeActivityById(
				activityId,
				hasAttendees ? { _meta: { notify_attendees: true } } : {},
			);

			dispatch(activityRemoveResult(DELETE_RESULT_SUCCESS, response));

			notifyChangesExternally('activity', 'deleted', {
				meta: cloneDeep(response.additional_data),
				related_objects: cloneDeep(response.related_objects),
				current: cloneDeep(response.data),
				previous: cloneDeep(get(state, 'form.previousShape', null)),
			});

			if (callLogId) {
				deleteCallLog(callLogId);
			}
		} catch (e) {
			dispatch(activityRemoveResult(SAVE_RESULT_ERROR));

			throw e;
		} finally {
			dispatch(stopActivityRemove());
		}
	};
}
