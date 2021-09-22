import styled from 'styled-components';
import { Popover, Spacing } from '@pipedrive/convention-ui-react';

export const PopoverRoot = styled(Popover)`
	width: 100%;
	align-items: start;
	opacity: 1 !important;
	pointer-events: auto !important;
	transform: none !important;
	> .cui4-popover__inner {
		display: flex;
		flex-direction: column;
		max-height: 100%;
		height: 100%;
		> .cui4-spacing {
			padding: 0;
			height: 100%;
		}
	}
`;

export const PopoverContent = styled(Spacing)`
	width: 370px;
	display: flex;
	flex-flow: column;
	height: 100%;
	max-height: 70vh;
`;
