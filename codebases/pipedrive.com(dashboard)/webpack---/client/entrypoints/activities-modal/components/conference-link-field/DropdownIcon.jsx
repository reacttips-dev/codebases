import React from 'react';
import {
	DropdownAppImg,
	DropdownAppPlaceholderIcon,
	DropdownSpacing,
} from './conference-link-styles';
import PropTypes from 'prop-types';

const DropdownIcon = ({ onIconLoad, iconLoaded, src, translator, spacing = {} }) => {
	return (
		<DropdownSpacing {...spacing}>
			<DropdownAppImg
				imageLoaded={onIconLoad ? iconLoaded : true}
				alt={translator.gettext('Icon for video conferencing integration')}
				src={src}
				onLoad={onIconLoad || null}
			/>
			{!onIconLoad || iconLoaded ? null : <DropdownAppPlaceholderIcon icon="ac-picture" />}
		</DropdownSpacing>
	);
};

DropdownIcon.propTypes = {
	src: PropTypes.string.isRequired,
	translator: PropTypes.object.isRequired,
	iconLoaded: PropTypes.bool,
	onIconLoad: PropTypes.func,
	spacing: PropTypes.object,
};

export default DropdownIcon;
