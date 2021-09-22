import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
	updateField as updateFieldAction,
	updateMultipleFields as updateMultipleFieldsAction,
} from '../../../store/actions/form';
import modalContext from '../../../../../utils/context';
import { StyledIcon, Links } from '../form-styles';
import MainEntityField from './main-entity';
import ParticipantsField from './participants';
import OrganizationField from './organization';

const LinkedFields = (props) => {
	const {
		deal,
		lead,
		project,
		participants,
		organization,
		updateField,
		updateMultipleFields,
		translator,
		hasParticipantWithoutEmail,
		sendActivityNotifications,
	} = props;

	return (
		<>
			<StyledIcon icon="link" alignStart />
			<Links>
				<MainEntityField
					translator={translator}
					updateField={updateField}
					updateMultipleFields={updateMultipleFields}
					deal={deal}
					lead={lead}
					project={project}
					participants={participants}
					organization={organization}
				/>
				<ParticipantsField
					updateField={updateField}
					translator={translator}
					participants={participants}
					hasParticipantWithoutEmail={hasParticipantWithoutEmail}
					sendActivityNotifications={sendActivityNotifications}
				/>
				<OrganizationField
					translator={translator}
					updateField={updateField}
					organization={organization}
				/>
			</Links>
		</>
	);
};

LinkedFields.propTypes = {
	updateField: PropTypes.func.isRequired,
	updateMultipleFields: PropTypes.func.isRequired,
	deal: ImmutablePropTypes.map,
	lead: ImmutablePropTypes.map,
	project: ImmutablePropTypes.map,
	organization: ImmutablePropTypes.map,
	participants: ImmutablePropTypes.list,
	translator: PropTypes.object.isRequired,
	sendActivityNotifications: PropTypes.bool,
	hasParticipantWithoutEmail: PropTypes.bool,
};

const mapStateToProps = (state) => ({
	deal: state.getIn(['form', 'deal']),
	lead: state.getIn(['form', 'lead']),
	project: state.getIn(['form', 'project']),
	participants: state.getIn(['form', 'participants']),
	organization: state.getIn(['form', 'organization']),
	sendActivityNotifications: state.getIn(['form', 'sendActivityNotifications']),
	hasParticipantWithoutEmail: state.getIn(['notifications', 'hasParticipantWithoutEmail']),
});

const mapDispatchToProps = (dispatch) => ({
	updateMultipleFields: (fields) => dispatch(updateMultipleFieldsAction(fields, 'agenda')),
	updateField: (field, value) => dispatch(updateFieldAction(field, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(modalContext(LinkedFields));
