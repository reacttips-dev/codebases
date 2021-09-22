import { colors, fonts } from '@pipedrive/convention-ui-css/dist/js/variables';
import { Badge, Icon } from '@pipedrive/convention-ui-react';
import styled from 'styled-components';

import config from '../../../config/styles';

export const StyledIcon = styled(Icon)`
	fill: ${colors.black64Opaque};
`;

export const StyledLink = styled.a`
	display: flex;
	transition: all 0.1s;

	flex-direction: column;
	margin-bottom: 16px;
	align-items: center;
	padding: 12px;
	border-radius: 50%;
	color: ${colors.black};

	@media only screen and (min-width: ${config.breakpoints.m}px) {
		padding: 8px 4px;
		border-radius: 4px;
	}

	&:hover:not(.active) {
		background-color: ${colors.black8};
		color: ${colors.black};

		${StyledIcon} {
			fill: ${colors.black};
		}
	}

	&:active:not(.active) {
		background-color: ${colors.black16};
	}

	&,
	&:active,
	&:hover,
	&:visited {
		text-decoration: none;
	}

	&.active {
		font: ${fonts.fontButton};
		color: ${colors.blue};
		text-decoration: none;
		background-color: ${colors.blue16};

		&:active {
			background-color: ${colors.blue24};
			color: ${colors.blue};
		}

		${StyledIcon} {
			fill: ${colors.blue};
		}
	}
`;

export const StyledLabel = styled.span`
	display: flex;
	align-items: center;
	max-width: 100%;

	text-align: center;
	display: none;
	margin-top: 4px;

	@media only screen and (min-width: ${config.breakpoints.m}px) {
		display: flex;
	}
`;

export const StyledBadge = styled(Badge)`
	margin-left: 4px;
	flex-shrink: 0;
`;
