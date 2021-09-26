import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button, Icon } from '@pipedrive/convention-ui-react';

import { deleteActivityAction } from '../actions/activity';
import { hideDeleteConfirmation, showDeleteConfirmation } from '../actions/overlays';
import activityCardContext from '../../../utils/context';

class DeleteButton extends Component {
	constructor(props) {
		super(props);

		this.state = {
			ActivityDeleteConfirmationDialog: null,
		};
	}

	async componentDidMount() {
		const ActivityDeleteConfirmationDialog = await this.props.webappApi.componentLoader.load(
			'activities-components:activity-delete-confirmation-dialog',
		);

		this.setState({ ActivityDeleteConfirmationDialog });
	}

	render() {
		const {
			deleteActivity,
			showConfirmation,
			hideConfirmation,
			isConfirmationVisible,
			translator,
			attendees,
			webappApi,
			activityType,
			hasActiveCalendarSync,
			referenceType,
			recordingUrl,
		} = this.props;
		const {
			userSelf: { settings: userSettings },
		} = webappApi;
		const hasPermissionToDelete = userSettings.get('can_delete_activities');

		if (!hasPermissionToDelete) {
			return <div data-test="activity-card-delete-button-placeholder" />;
		}

		const { ActivityDeleteConfirmationDialog } = this.state;

		return (
			<>
				<Button data-test="activity-card-remove-activity" onClick={showConfirmation}>
					<Icon icon="trash" />
				</Button>
				{isConfirmationVisible && ActivityDeleteConfirmationDialog && (
					<ActivityDeleteConfirmationDialog
						onClose={hideConfirmation}
						onConfirm={deleteActivity}
						translator={translator}
						hasActiveCalendarSync={hasActiveCalendarSync}
						attendees={attendees}
						activityType={activityType}
						referenceType={referenceType}
						recordingUrl={recordingUrl}
					/>
				)}
			</>
		);
	}
}

DeleteButton.propTypes = {
	showConfirmation: PropTypes.func.isRequired,
	hideConfirmation: PropTypes.func.isRequired,
	isConfirmationVisible: PropTypes.bool,
	deleteActivity: PropTypes.func.isRequired,
	translator: PropTypes.object.isRequired,
	webappApi: PropTypes.object.isRequired,
	attendees: PropTypes.object.isRequired,
	activityType: PropTypes.string.isRequired,
	hasActiveCalendarSync: PropTypes.bool.isRequired,
	recordingUrl: PropTypes.string,
	referenceType: PropTypes.string,
};

const mapStateToProps = (state) => ({
	attendees: state.getIn(['activity', 'attendees']),
	activityType: state.getIn(['activity', 'type']),
	isConfirmationVisible: state.getIn(['overlays', 'deleteConfirmationVisible']),
	hasActiveCalendarSync: state.getIn(['activity', 'hasActiveCalendarSync']),
	referenceType: state.getIn(['activity', 'referenceType']),
	recordingUrl: state.getIn(['activity', 'recordingUrl']),
});

const mapDispatchToProps = {
	showConfirmation: showDeleteConfirmation,
	hideConfirmation: hideDeleteConfirmation,
	deleteActivity: deleteActivityAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(activityCardContext(DeleteButton));
