import styled from 'styled-components';

import { Option, Dropmenu, Button, Popover } from '@pipedrive/convention-ui-react';
import colors from '../../colors.scss';

export const TimeGroup = styled.div`
	display: grid;
	grid-gap: 8px;
	grid-template-columns: ${(props) =>
		props.is24HourFormat ? 'auto 88px 8px 88px auto' : 'auto 104px 8px 104px auto'};
	align-items: center;
`;

export const TimePickerPopover = styled(Dropmenu)`
	height: ${(props) => (props.long ? `340px` : `${7.5 * 32}px`)};
	width: 168px;
`;

export const TimePickerOption = styled(Option)`
	display: flex;
	align-items: center;

	span {
		white-space: nowrap !important;
	}

	&:hover {
		span {
			color: #fff !important;
		}
	}

	&.cui4-option--highlighted {
		span {
			color: #fff !important;
		}
	}
`;

export const DurationLabel = styled.span`
	color: ${colors.durationColor} !important;
	margin-left: 5px;
`;

export const DatepickerPopover = styled(Popover)`
	z-index: 6000;
`;

export const TodayButton = styled(Button)`
	display: flex;
	margin: 4px 8px 8px auto;

	span {
		color: ${colors.datepickerTodayButtonColor};
	}
`;
