import styled from 'styled-components';

import { Tooltip } from '@pipedrive/convention-ui-react';
import { elevations, colors } from '@pipedrive/convention-ui-css/dist/js/variables';

import { stackOrder } from '../menu/stackOrder';

export const HeaderWrapper = styled.div`
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	width: 100%;
	z-index: ${stackOrder.header};
	background-color: ${colors.white};
	box-shadow: ${elevations.elevation01};

	@media print {
		display: none;
	}
`;

export const HeaderLeft = styled.div`
	display: flex;
	flex: 1;
	margin-right: 16px;
	overflow: hidden;
`;

export const HeaderCenter = styled.div`
	display: flex;
	flex: none;
	align-items: center;
	user-select: none;
	width: 408px;
	justify-content: center;
`;

export const HeaderRight = styled.div`
	display: flex;
	flex: 1;
	align-items: center;
	user-select: none;
	justify-content: flex-end;
	margin-left: 16px;
	padding-right: 12px;
	overflow: hidden;
`;

export const HeaderItem = styled.button<{ lastItem: boolean; active: boolean; yellow: boolean }>`
	padding: 0;
	border: 0;
	outline: none;

	margin-right: ${(props) => (props.lastItem ? 0 : '2px')};
	border-radius: 20px;

	background-color: ${(props) => (props.active ? colors.blue16 : props.yellow ? colors.yellow16 : 'transparent')};

	transition: background-color 0.1s;

	cursor: pointer;

	.cui4-icon {
		fill: ${(props) => colors[props.active ? 'blue' : props.yellow ? 'yellowShade16' : 'black64']};
		transition: fill 0.1s;
	}

	&:hover {
		background-color: ${(props) =>
			props.active ? colors.blue24 : props.yellow ? 'rgba(255, 204, 0, 0.4)' : colors.black8};
	}

	&:active {
		background-color: ${(props) =>
			props.active ? colors.blue32 : props.yellow ? 'rgba(255, 204, 0, 0.56)' : colors.black16};
	}

	&:active,
	&:hover {
		.cui4-icon {
			fill: ${(props) => colors[props.active ? 'blue' : props.yellow ? 'yellowShade16' : 'black88']};
		}
	}
`;

export const HeaderIcon = styled(HeaderItem)`
	display: flex;
	min-width: 40px;
	height: 40px;
	justify-content: center;
	align-items: center;
`;

export const RaisedTooltip = styled(Tooltip)`
	z-index: ${stackOrder.headerTooltip};
`;
