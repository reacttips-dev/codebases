import styled from 'styled-components';
import { Icon as CuiIcon, Button as CuiButton, Option } from '@pipedrive/convention-ui-react';
import { colors } from '@pipedrive/convention-ui-css/dist/js/variables';

export const Icon = styled(CuiIcon)<{ $isOpen: boolean }>`
	transform-origin: center;
	transform: ${(props) => (props.$isOpen ? 'rotate(180deg)' : 'none')};
`;

export const Wrapper = styled.div`
	margin-right: 8px;
	box-shadow: 0 1px 2px rgba(38, 41, 44, 0.08);
	display: flex;
	position: relative;
	.cui4-popover {
		transform: none !important;
		top: calc(100% + 8px) !important;
		min-width: 100% !important;
		.cui4-popover__inner {
			min-width: 100% !important;
		}
	}
	.cui4-option {
		white-space: nowrap;
	}
`;

export const DropdownTrigger = styled(CuiButton)`
	border-left: 1px solid ${colors.black16};
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
	margin-left: -2px;
`;

export const StyledOption = styled(Option)`
	text-decoration: none;
	&:hover {
		text-decoration: none;
	}
`;
