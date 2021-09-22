import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { GUESTS, LOCATION, DESCRIPTION } from '../../../../config/constants';
import Attendees from '../attendees';
import ConferenceLinkField from '../conference-link-field';
import Location from '../form/location';
import { PublicDescription } from '../form/form-styles';
import ExpandableField from './expandable-field';
import {
	updateField as updateFieldAction,
	setError as setErrorAction,
} from '../../store/actions/form';
import modalContext from '../../../../utils/context';

const ExpandedFields = ({
	attendees,
	location,
	publicDescription,
	activeField,
	updateField,
	translator,
	isEditing,
	setError,
	participants,
	deal,
	organization,
	hasActiveCalendarSync,
}) => {
	const hasAttendees = !!(attendees && attendees.toJS().length);
	const attendeesExpanded = activeField === GUESTS || hasAttendees;
	const locationExpanded = activeField === LOCATION || !!location;
	const publicDescriptionExpanded = activeField === DESCRIPTION || !!publicDescription;

	const collapseField = () => {
		updateField('activeField', '');
	};

	const expandField = (field) => {
		updateField('activeField', field);
	};

	return (
		<>
			<ExpandableField
				expand={() => expandField(GUESTS)}
				icon="ac-meeting"
				isExpanded={attendeesExpanded}
				placeholder={translator.gettext('Guests')}
			>
				<Attendees
					participants={participants && participants.toJS()}
					deal={deal}
					organization={organization}
					showStatus={isEditing && hasActiveCalendarSync}
					attendees={attendees && attendees.toJS()}
					onChange={(attendees) => updateField('attendees', attendees)}
					onBlur={() => (hasAttendees ? null : collapseField())}
					autoFocus={activeField === GUESTS}
					setError={setError}
				/>
			</ExpandableField>
			<ExpandableField
				expand={() => expandField(LOCATION)}
				icon="address"
				isExpanded={locationExpanded}
				placeholder={translator.gettext('Location')}
			>
				<Location
					handleBlur={() => (location ? null : collapseField())}
					autoFocus={activeField === LOCATION}
				/>
			</ExpandableField>
			<ConferenceLinkField />
			<ExpandableField
				expand={() => expandField(DESCRIPTION)}
				icon="list"
				isExpanded={publicDescriptionExpanded}
				placeholder={translator.gettext('Description')}
			>
				<PublicDescription
					onBlur={() => (publicDescription ? null : collapseField())}
					value={publicDescription}
					translator={translator}
					message={translator.gettext(
						'Description is synced to your calendar and visible to all invitees',
					)}
					onChange={(e) => updateField('publicDescription', e.target.value || null)}
					autoFocus={activeField === DESCRIPTION}
					contentEditableClassName="activityPublicDescription"
					dataTest="activity-modal-public-description"
				/>
			</ExpandableField>
		</>
	);
};

ExpandedFields.propTypes = {
	attendees: ImmutablePropTypes.list,
	publicDescription: PropTypes.string,
	location: PropTypes.string,
	updateField: PropTypes.func,
	activeField: PropTypes.string,
	translator: PropTypes.object.isRequired,
	isEditing: PropTypes.bool,
	setError: PropTypes.func,
	participants: ImmutablePropTypes.list,
	organization: PropTypes.object,
	deal: PropTypes.object,
	hasActiveCalendarSync: PropTypes.bool.isRequired,
};

const mapDispatchToProps = {
	updateField: updateFieldAction,
	setError: setErrorAction,
};

const mapStateToProps = (state) => ({
	activeField: state.getIn(['form', 'activeField']),
	publicDescription: state.getIn(['form', 'publicDescription']),
	attendees: state.getIn(['form', 'attendees']),
	location: state.getIn(['form', 'location']),
	isEditing: !!state.getIn(['form', 'activityId']),
	participants: state.getIn(['form', 'participants']),
	organization: state.getIn(['form', 'organization']),
	deal: state.getIn(['form', 'deal']),
	hasActiveCalendarSync: state.getIn(['modal', 'hasActiveCalendarSync']),
});

export default connect(mapStateToProps, mapDispatchToProps)(modalContext(ExpandedFields));
