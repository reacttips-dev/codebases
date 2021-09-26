import React, { useState } from 'react';
import { List, fromJS } from 'immutable';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { ErrorBoundary } from '@pipedrive/react-utils';
import { Dialog, Button } from '@pipedrive/convention-ui-react';

import ErrorCard from '../../common-components/ErrorCard';
import RequestStateSnackbar from '../../common-components/RequestStateSnackbar';
import { getDeleteConfirmationDialogText } from './helpers';
import { withWebApiAndTranslatorLoader } from '../../utils/hocs';

const ActivityDeleteConfirmationDialog = (props) => {
	const [visible, setVisible] = useState(true);
	const [hasDeletedSuccessfully, setHasDeletedSuccessfully] = useState(false);
	const [hasError, setHasError] = useState(false);

	const {
		translator,
		webappApi,
		hasActiveCalendarSync,
		logger,
		onConfirm,
		onClose,
		attendees,
		activityType,
		useSnackbar,
		referenceType,
		recordingUrl,
	} = props;
	const activityAttendees = List.isList(attendees) ? attendees : fromJS(attendees || []);
	const { title, message } = getDeleteConfirmationDialogText({
		hasActiveCalendarSync,
		translator,
		activityType,
		attendees: activityAttendees,
		webappApi,
		referenceType,
		recordingUrl,
	});

	const handleClose = () => {
		setVisible(false);

		onClose();
	};

	const deleteActivity = async () => {
		setVisible(false);

		try {
			await onConfirm();

			setHasError(false);
			setHasDeletedSuccessfully(true);
		} catch (err) {
			setHasError(true);
			setHasDeletedSuccessfully(false);
		}
	};

	return (
		<ErrorBoundary
			error={<ErrorCard component="activity-delete-confirmation-dialog" />}
			logger={logger}
			loggingData={{ facility: 'activity-delete-confirmation-dialog' }}
		>
			<>
				<Dialog
					visible={visible}
					title={title}
					onClose={handleClose}
					closeOnEsc
					actions={
						<>
							<Button onClick={handleClose}>{translator.gettext('Cancel')}</Button>
							<Button
								data-test="activity-confirm-deletion"
								onClick={deleteActivity}
								color="red"
							>
								{translator.gettext('Delete')}
							</Button>
						</>
					}
				>
					{message}
				</Dialog>
				{useSnackbar && (
					<RequestStateSnackbar
						hasError={hasError}
						onError={deleteActivity}
						hasDeletedSuccessfully={hasDeletedSuccessfully}
						translator={translator}
					/>
				)}
			</>
		</ErrorBoundary>
	);
};

ActivityDeleteConfirmationDialog.propTypes = {
	attendees: PropTypes.oneOfType([PropTypes.array, ImmutablePropTypes.List]),
	activityType: PropTypes.string.isRequired,
	webappApi: PropTypes.object.isRequired,
	logger: PropTypes.object.isRequired,
	translator: PropTypes.object.isRequired,
	hasActiveCalendarSync: PropTypes.bool.isRequired,
	onConfirm: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
	useSnackbar: PropTypes.bool,
	referenceType: PropTypes.string,
	recordingUrl: PropTypes.string,
};

ActivityDeleteConfirmationDialog.defaultProps = {
	attendees: new List(),
};

export default withWebApiAndTranslatorLoader(ActivityDeleteConfirmationDialog, {
	componentName: 'activity-delete-confirmation-dialog',
	logStateOnError: true,
});
