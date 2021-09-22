import { styled, colors, fonts } from '../../utils/styles';

export const ChartDetails = styled.div`
	position: absolute;
	box-sizing: border-box;
	width: calc(100% - 2px);
	transition: opacity 0.2s ease-in-out;
	left: 2px;
	z-index: 99;
	opacity: 0;
	top: -9999px;
`;

export const GoalCaption = styled.p`
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	font: ${fonts['$font-title-l']};
`;

export const GoalDetails = styled.div`
	margin-top: 16px;
	line-height: ${fonts['$line-height-m']};
`;

export const GoalInterval = styled.p`
	font-weight: ${fonts['$font-weight-semi']};
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const GoalData = styled.div`
	display: flex;
	flex-wrap: wrap;
	word-break: break-all;
	justify-content: space-between;
`;

export const GoalProgress = styled.span`
	display: flex;
	flex-wrap: wrap;
	word-break: break-all;
`;

export const GoalDueTime = styled.div`
	color: ${colors['$color-black-hex-64']};
	font-size: ${fonts['$font-size-s']};
`;

export const GoalExpectedValue = styled.span`
	color: ${colors['$color-black-hex-64']};
`;

export const Chart = styled.div`
	padding: 0 0 0 8px;
`;

export const Container = styled.div`
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
