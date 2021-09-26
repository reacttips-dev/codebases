import { getActivityOrganizerDetails, isSyncedActivityType } from '../../utils/activity';

const getDeleteConfirmationDialogTextCalSyncOff = ({ hasAttendees, translator, referenceType }) => {
	const createdFromPipedrive = referenceType !== 'calendar-sync';

	if (hasAttendees && createdFromPipedrive) {
		return {
			title: translator.gettext('Delete activity that has guests?'),
			message: translator.gettext(
				'All guests will receive an email about the canceled activity.',
			),
		};
	}

	return {
		message: translator.gettext('Are you sure you want to delete this activity?'),
	};
};

const getDeleteConfirmationDialogTextCalSyncOn = ({
	hasAttendees,
	isSynced,
	hasAdvancedModalEnabled,
	activityOrganizer,
	isCurrentUserActivityOrganizer,
	translator,
}) => {
	if (!isSynced) {
		return {
			message: translator.gettext('Are you sure you want to delete this activity?'),
		};
	}

	if (!hasAttendees || !hasAdvancedModalEnabled) {
		return {
			title: translator.gettext('Delete synced activity?'),
			message: translator.gettext(
				'Deleting this activity will remove the corresponding event from your synced calendar.',
			),
		};
	}

	if (isCurrentUserActivityOrganizer) {
		return {
			title: translator.gettext('Delete synced activity that has guests?'),
			message: translator.gettext(
				'Deleting this activity will remove the corresponding event from your synced calendar. All guests will receive an email about the canceled activity.', // NOSONAR
			),
		};
	}

	return {
		title: translator.gettext('Delete synced activity that has guests?'),
		message: activityOrganizer.get('email_address')
			? translator.pgettext(
					'[email] is the organizer of this event. Deleting this activity will remove the corresponding event from your synced calendar, but not from organizer’s calendar. The guests will not be notified in any way.', // NOSONAR
					'%s is the organizer of this event. Deleting this activity will remove the corresponding event from your synced calendar, but not from organizer’s calendar. The guests will not be notified in any way.', // NOSONAR
					activityOrganizer.get('email_address'),
			  )
			: translator.gettext(
					'Deleting this activity will remove the corresponding event from your synced calendar, but not from organizer’s calendar. The guests will not be notified in any way.', // NOSONAR
			  ),
	};
};

const getDeleteConfirmationDialogTextCallRecording = (translator) => {
	return {
		title: translator.gettext('Delete activity with call recording?'),
		message: translator.gettext(
			'Deleting this activity will also remove the call recording linked with this activity.',
		),
	};
};

const getDeleteConfirmationDialogText = ({
	webappApi,
	activityType,
	attendees,
	translator,
	hasActiveCalendarSync,
	referenceType,
	recordingUrl,
}) => {
	const {
		userSelf: { companyFeatures, attributes: userAttributes, settings: userSettings },
	} = webappApi;

	const hasAttendees = !!(attendees && attendees.size);

	if (recordingUrl) {
		return getDeleteConfirmationDialogTextCallRecording(translator);
	}

	if (!hasActiveCalendarSync) {
		return getDeleteConfirmationDialogTextCalSyncOff({
			hasAttendees,
			translator,
			referenceType,
		});
	}

	const hasAdvancedModalEnabled = companyFeatures.get('activities_modal_new_advanced');
	const isSynced = isSyncedActivityType(userSettings, activityType);
	const { activityOrganizer, isCurrentUserActivityOrganizer } = getActivityOrganizerDetails(
		attendees,
		userAttributes.id,
	);

	return getDeleteConfirmationDialogTextCalSyncOn({
		hasAttendees,
		isSynced,
		hasAdvancedModalEnabled,
		activityOrganizer,
		isCurrentUserActivityOrganizer,
		translator,
	});
};

export { getDeleteConfirmationDialogText };
