import { styled, colors } from '../../../utils/styles';
import { ChartDetails } from '../../Goals';

export const Container = styled.div`
	background: ${colors['$color-black-hex-16']};
	height: 55px;
	position: sticky;
	top: 0;
	z-index: 1;

	&:after {
		content: '';
		height: 1px;
		background: ${colors['$color-black-hex-8']};
		width: 100%;
		position: absolute;
		bottom: -1px;
		z-index: 1;
	}
`;

export const StageOverview = styled.div`
	width: 100%;
	overflow: hidden;
`;

export const StageGoals = styled.div`
	height: 55px;
	justify-content: center;
	align-items: center;
	display: flex;

	&:hover {
		${ChartDetails} {
			top: 47px;
			opacity: 1;
		}
	}
`;

export const Details = styled.div`
	display: flex;
	align-items: center;
	flex-direction: row;
	background: ${colors['$color-black-hex-4']};
	height: 55px;
	padding-left: 8px;
	padding-right: 16px;
	margin: 0 0 0 9px;

	& > svg {
		position: absolute;
		left: 0;
		width: 9px;
		height: 55px;
	}
`;
