import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';

import ExpandableFields from '../expandable-fields';
import Location from './location';

import modalContext from '../../../../utils/context';
import { expandModal as expandModalAction } from '../../store/actions/modal';
import { updateField as updateFieldAction } from '../../store/actions/form';
import { Row, FlexRow, StyledIcon } from './form-styles';

const isExpandedSection = ({ attendees, location, publicDescription, conferenceMeetingUrl }) => {
	const hasAttendees = attendees && attendees.toJS().length;

	return !!(hasAttendees || location || publicDescription || conferenceMeetingUrl);
};

const FeatureFields = ({
	webappApi,
	attendees,
	location,
	publicDescription,
	conferenceMeetingUrl,
	updateField,
	expandModal,
}) => {
	const [expanded, setExpanded] = useState(
		isExpandedSection({
			attendees,
			location,
			publicDescription,
			conferenceMeetingUrl,
		}),
	);

	const {
		userSelf: { companyFeatures },
	} = webappApi;
	const advancedModalEnabled = companyFeatures.get('activities_modal_new_advanced');
	const handleExpansion = (field) => {
		setExpanded(true);
		updateField('activeField', field);
		expandModal(field);
	};

	if (!advancedModalEnabled) {
		return (
			<Row>
				<StyledIcon icon="address" />
				<Location />
			</Row>
		);
	}

	return (
		<FlexRow expanded={expanded}>
			<ExpandableFields expanded={expanded} handleExpansion={handleExpansion} />
		</FlexRow>
	);
};

FeatureFields.propTypes = {
	webappApi: PropTypes.object.isRequired,
	publicDescription: PropTypes.string,
	updateField: PropTypes.func.isRequired,
	expandModal: PropTypes.func.isRequired,
	attendees: ImmutablePropTypes.list,
	location: PropTypes.string,
	conferenceMeetingUrl: PropTypes.string,
};

const mapStateToProps = (state) => {
	return {
		publicDescription: state.getIn(['form', 'publicDescription']),
		attendees: state.getIn(['form', 'attendees']),
		location: state.getIn(['form', 'location']),
		conferenceMeetingUrl: state.getIn(['form', 'conferenceMeetingUrl']),
	};
};

const mapDispatchToProps = (dispatch) => ({
	updateField: (field, value) => dispatch(updateFieldAction(field, value)),
	expandModal: (expandedFromField) => dispatch(expandModalAction(expandedFromField)),
});

export default connect(mapStateToProps, mapDispatchToProps)(modalContext(FeatureFields));
