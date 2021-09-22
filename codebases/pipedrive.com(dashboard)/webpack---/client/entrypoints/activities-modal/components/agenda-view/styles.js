import styled from 'styled-components';
import colors from '../../colors.scss';

export const CalendarContainer = styled.div`
	width: 35%;
	border-left: 1px solid ${colors.calendarBorder};
	border-top: none;
	position: relative;
`;

const narrowViewCalendarWidth = '320px';
const toggleOverflowWidth = '12px';
const toggleOnTopWidth = '24px';
const toggleAreaWidth = '36px';

export const NarrowViewCalendarContainer = styled.div`
	position: absolute;
	top: 0;
	height: 100%;
	width: ${narrowViewCalendarWidth};
	transition: right 250ms cubic-bezier(0, 0, 0.2, 1);

	${(props) =>
		props.expanded
			? `
		right: 0;
		box-shadow: -2px 0 4px 0 ${colors.calendarShadow};
	`
			: `
		right: calc(${toggleOnTopWidth} - ${narrowViewCalendarWidth});
		border-left: 1px solid ${colors.calendarBorder};
	`}
`;

export const ToggleButton = styled.div`
	position: absolute;
	top: 42px;
	left: 0;
	width: 24px;
	height: 24px;
	border: ${(props) => (props.expanded ? 'none' : `1px solid ${colors.toggleButtonBorder}`)};
	border-radius: 24px;
	box-shadow: ${colors.toggleButtonShadow};
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	background: ${(props) => (props.expanded ? colors.toggleButtonHover : '#fff')};

	.cui4-icon {
		${(props) => (props.expanded ? 'fill: #fff;' : '')}
	}
`;

export const ToggleOverflow = styled.div`
	width: ${toggleOverflowWidth};
	height: 100%;
`;

export const Toggle = styled.div`
	width: ${toggleOnTopWidth};
	height: 100%;
	${(props) => (props.expanded ? `` : `background: #fff;`)}
`;

export const ToggleArea = styled.div`
	position: absolute;
	top: 0;
	left: -${toggleOverflowWidth};
	height: 100%;
	width: ${toggleAreaWidth};
	display: flex;
	z-index: 2;

	&:hover {
		${(props) => (props.expanded ? '' : 'cursor: pointer;')}

		${Toggle} {
			${(props) => (props.expanded ? '' : `background: ${colors.toggleHoverBackground};`)}
		}

		${ToggleButton} {
			background: ${colors.toggleButtonHover};
			border: none;

			.cui4-icon {
				fill: #fff;
			}

			&:hover {
				background: #528fe7;
			}

			&:active {
				background: #2966be;
				box-shadow: inset 0 1px 2px ${colors.toggleButtonActiveShadow};
			}
		}
	}
`;
