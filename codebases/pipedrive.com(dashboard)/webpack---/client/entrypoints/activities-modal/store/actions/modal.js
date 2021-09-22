import { batch } from 'react-redux';
import { hasHadCalendarSync, hasActiveCalendarSync } from '../../../../api';
import {
	getIntegrations,
	getInstalledIntegration,
} from '../../../../utils/conference-meeting-integration';

export function setLanguages(webappLanguagesCollection) {
	const languages = webappLanguagesCollection.map(({ attributes }) => ({
		id: attributes.id,
		name: attributes.name_translated,
	}));

	return {
		type: 'SET_LANGUAGES',
		languages,
	};
}

export function enableFlowView() {
	return {
		type: 'SET_IS_FLOW_VIEW',
		isFlowView: true,
	};
}

export function showModal() {
	return (dispatch, _, { webappApi, closeModal }) => {
		dispatch({ type: 'SHOW_MODAL' });
		webappApi.router.on('route', closeModal);
	};
}

export function hideModal() {
	return (dispatch, getStore, { webappApi, closeModal }) => {
		batch(() => {
			dispatch({ type: 'MODAL_CLOSED' });

			if (!getStore().getIn(['modal', 'isFlowView'])) {
				dispatch({ type: 'HIDE_MODAL' });
			}
		});

		webappApi.router.off('route', closeModal);
	};
}

export function unMountModal() {
	return (dispatch, _, { afterCloseModal }) => {
		dispatch({ type: 'UNMOUNT_MODAL' });
		afterCloseModal();
	};
}

export function clickOnCalendarSyncTeaser() {
	return { type: 'CALENDAR_SYNC_TEASER_CLICKED' };
}

export function closeCalendarSyncTeaser() {
	return { type: 'CALENDAR_SYNC_TEASER_CLOSED' };
}

export function setCalendarSyncTeaserVisibility() {
	return async (dispatch, _, { webappApi }) => {
		const newCalendarSync =
			webappApi.userSelf.companyFeatures.get('nylas_calendar_sync') ||
			webappApi.userSelf.companyFeatures.get('fastis');

		if (!newCalendarSync) {
			return dispatch({ type: 'SHOW_CALENDAR_SYNC_TEASER', value: false });
		}

		// not showing on error (!true)
		const showTeaser = !(await hasHadCalendarSync().catch(() => true));

		return dispatch({ type: 'SHOW_CALENDAR_SYNC_TEASER', value: showTeaser });
	};
}

export function clickOnInstallIntegrationLink(integration) {
	return {
		type: 'INSTALL_INTEGRATION_CLICKED',
		integration,
	};
}

export function copyConferenceMeetingUrl(integration) {
	return {
		type: 'COPY_CONFERENCE_MEETING_URL',
		integration,
	};
}

export function deleteConferenceMeetingUrl(integration) {
	return {
		type: 'DELETE_CONFERENCE_MEETING_URL',
		integration,
	};
}

export function joinConferenceMeetingUrl(integration) {
	return {
		type: 'JOIN_CONFERENCE_MEETING_URL',
		integration,
	};
}

function setConferenceMeetingIntegrationInstalled(value) {
	return {
		type: 'SET_CONFERENCE_MEETING_INTEGRATION_INSTALLED',
		value,
	};
}

function setConferenceMeetingIntegrations(integrations) {
	return {
		type: 'SET_INTEGRATIONS',
		integrations,
	};
}

export function getConferenceMeetingIntegrationInstalled(useCache = true) {
	return async (dispatch, _, { webappApi }) => {
		const conferenceMeetingIntegrations = await getIntegrations(webappApi, useCache);
		const installedIntegration = getInstalledIntegration(conferenceMeetingIntegrations);

		dispatch(setConferenceMeetingIntegrationInstalled(!!installedIntegration));
		dispatch(setConferenceMeetingIntegrations(conferenceMeetingIntegrations));
	};
}

export function getHasActiveCalendarSync() {
	return async (dispatch) => {
		const userHasActiveCalendarSync = await hasActiveCalendarSync();

		dispatch({
			type: 'SET_HAS_ACTIVE_CALENDAR_SYNC',
			hasActiveCalendarSync: userHasActiveCalendarSync,
		});
	};
}

export function expandModal(expandedFromField) {
	return { type: 'EXPAND_MODAL', field: expandedFromField };
}
