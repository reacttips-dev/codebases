import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Option } from '@pipedrive/convention-ui-react';

import modalContext from '../../../../utils/context';
import { removeActivity } from '../../store/actions/request-state';

class DeleteActivityOption extends Component {
	constructor(props) {
		super(props);

		this.state = {
			ActivityDeleteConfirmationDialog: null,
			confirmationVisible: false,
		};

		this.showRemoveConfirmation = this.showRemoveConfirmation.bind(this);
		this.removeActivityOnceConfirmed = this.removeActivityOnceConfirmed.bind(this);
	}

	async componentDidMount() {
		const ActivityDeleteConfirmationDialog = await this.props.webappApi.componentLoader.load(
			'activities-components:activity-delete-confirmation-dialog',
		);

		this.setState({ ActivityDeleteConfirmationDialog });
	}

	showRemoveConfirmation(e) {
		e && e.preventDefault();

		this.setState({ confirmationVisible: true });
	}

	removeActivityOnceConfirmed() {
		const { onClose, dispatchRemoveActivity } = this.props;

		this.setState({ confirmationVisible: false });
		dispatchRemoveActivity();
		onClose();
	}

	render() {
		const {
			translator,
			webappApi,
			attendees,
			activityType,
			hasActiveCalendarSync,
			referenceType,
			recordingUrl,
		} = this.props;
		const {
			userSelf: { settings: userSettings },
		} = webappApi;

		if (!userSettings.get('can_delete_activities')) {
			return null;
		}

		const { ActivityDeleteConfirmationDialog } = this.state;

		return (
			<>
				<Option data-test="activity-dropmenu-delete" onClick={this.showRemoveConfirmation}>
					{translator.gettext('Delete')}
				</Option>
				{this.state.confirmationVisible && ActivityDeleteConfirmationDialog && (
					<ActivityDeleteConfirmationDialog
						onClose={() => this.setState({ confirmationVisible: false })}
						onConfirm={this.removeActivityOnceConfirmed}
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

DeleteActivityOption.propTypes = {
	onClose: PropTypes.func.isRequired,
	attendees: PropTypes.object,
	activityType: PropTypes.string,
	translator: PropTypes.object.isRequired,
	dispatchRemoveActivity: PropTypes.func.isRequired,
	webappApi: PropTypes.object.isRequired,
	hasActiveCalendarSync: PropTypes.bool.isRequired,
	referenceType: PropTypes.string,
	recordingUrl: PropTypes.string,
};

export default connect(
	(state) => ({
		attendees: state.getIn(['form', 'attendees']),
		activityType: state.getIn(['form', 'type']),
		hasActiveCalendarSync: state.getIn(['modal', 'hasActiveCalendarSync']),
		referenceType: state.getIn(['form', 'referenceType']),
		recordingUrl: state.getIn(['form', 'recordingUrl']),
	}),
	{
		dispatchRemoveActivity: removeActivity,
	},
)(modalContext(DeleteActivityOption));
