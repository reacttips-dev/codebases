import React from 'react';
import PropTypes from 'prop-types';

import { GUESTS, LOCATION, DESCRIPTION, VIDEO_CALL } from '../../../../config/constants';
import modalContext from '../../../../utils/context';
import CollapsedConferenceLinkField from '../conference-link-field/collapsed-conference-link-field';
import { Expandable, StyledIcon, LinkAlike } from '../form/form-styles';

const CollapsedFields = (props) => {
	const { handleExpansion, translator } = props;

	return (
		<>
			<StyledIcon icon="ellipsis" />
			<Expandable>
				{translator.pgettext('Add guests, location, description', 'Add')}
				<LinkAlike
					data-test="expand-attendees-field"
					onClick={() => handleExpansion(GUESTS)}
				>
					{translator.pgettext('Add guests, location, description', 'guests')}
				</LinkAlike>
				,
				<LinkAlike
					data-test="expand-location-field"
					onClick={() => handleExpansion(LOCATION)}
				>
					{translator.pgettext('Add guests, location, description', 'location')}
				</LinkAlike>
				,
				<CollapsedConferenceLinkField handleExpansion={() => handleExpansion(VIDEO_CALL)} />
				<LinkAlike
					data-test="expand-public_description-field"
					onClick={() => handleExpansion(DESCRIPTION)}
				>
					{translator.pgettext('Add guests, location, description', 'description')}
				</LinkAlike>
			</Expandable>
		</>
	);
};

CollapsedFields.propTypes = {
	handleExpansion: PropTypes.func.isRequired,
	translator: PropTypes.object.isRequired,
};

export default modalContext(CollapsedFields);
