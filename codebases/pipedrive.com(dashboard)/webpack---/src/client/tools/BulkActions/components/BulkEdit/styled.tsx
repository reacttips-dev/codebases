import React from 'react';
import { colors } from '@pipedrive/convention-ui-css/dist/js/variables';
import { Select, Text } from '@pipedrive/convention-ui-react';
import styled, { css } from 'styled-components';

const labelActiveStyles = css`
	&::before {
		content: '';
		background-color: ${colors.green};
		border-radius: 50%;
		float: left;
		margin-left: -14px;
		margin-top: 5px;
		width: 10px;
		height: 10px;
	}
`;

const labelRemoveIndicator = css`
	&::before {
		background-color: ${colors.red};
	}
`;

const labelInactiveStyles = css`
	color: ${colors.black64};
`;

// NOTE: With styled-components >5.1.0 this can be replaced with "transient props".
const WrappedText = ({ isEditing, isRemoving, ...rest }) => <Text {...rest} />;

export const StyledLabel = styled(WrappedText)`
	${(p) => (p.isEditing || p.isRemoving ? labelActiveStyles : labelInactiveStyles)}
	${(p) => p.isRemoving && labelRemoveIndicator}
`;

export const StyledItem = styled.div`
	padding: 10px 0;

	.cui4-select {
		width: 100%;
	}
`;

export const StyledSelect = styled(Select)`
	padding-bottom: 6px;
`;

export const GrayText = styled(Text)`
	margin-top: 16px;
	color: ${colors.black64};
`;

export const ButtonContainer = styled.div`
	button + button {
		margin-left: 8px;
	}
`;
