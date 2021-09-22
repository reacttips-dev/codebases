import React from 'react';
import PropTypes from 'prop-types';
import { ExpandableText, ExpansionContainer, LinkAlike, StyledIcon } from '../form/form-styles';

const CollapsedField = (props) => {
	return (
		<ExpandableText
			data-test="expandable-link-to-expand"
			onMouseUp={() => props.expand()}
			onMouseDown={(e) => e.preventDefault()}
		>
			<LinkAlike>{props.placeholder}</LinkAlike>
		</ExpandableText>
	);
};

CollapsedField.propTypes = {
	expand: PropTypes.func,
	placeholder: PropTypes.string,
};

const ExpandableField = (props) => {
	const { isExpanded, expand, icon, placeholder, children } = props;

	return (
		<ExpansionContainer hasValue={isExpanded}>
			<StyledIcon
				icon={icon}
				alignStart={['list', 'ac-meeting'].includes(icon)}
				isExpanded={isExpanded}
			/>
			{isExpanded ? children : <CollapsedField expand={expand} placeholder={placeholder} />}
		</ExpansionContainer>
	);
};

ExpandableField.defaultProps = {
	isExpanded: false,
};

ExpandableField.propTypes = {
	icon: PropTypes.string.isRequired,
	isExpanded: PropTypes.bool.isRequired,
	expand: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	children: PropTypes.any.isRequired,
};

export default ExpandableField;
