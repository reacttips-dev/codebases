import styled, { css } from 'styled-components';
import { ButtonGroup, Button } from '@pipedrive/convention-ui-react';
import { colors } from '@pipedrive/convention-ui-css/dist/js/variables';

export const Section = styled.div<{ hasMarginsOnFilters?: boolean }>`
	display: flex;
	align-items: center;

	.cui4-spinner {
		margin-right: 8px;
	}

	& + & {
		margin-left: 16px;
	}
	${(props) =>
		props.hasMarginsOnFilters &&
		css`
			& > div {
				margin-right: 8px;
				&:last-child {
					margin-right: 0;
				}
			}
		`}
`;

export const Buttons = styled(ButtonGroup)<{
	$displayBorderSeparator?: boolean;
}>`
	padding: 12px 0 12px 16px;

	${(props) =>
		props.$displayBorderSeparator &&
		css`
			&:after {
				display: flex;
				content: '';
				height: 24px;
				margin-left: 16px;
				border: 1px solid ${colors.black12Opaque};
				border-width: 0 0 0 1px;
				align-self: center;
			}
		`}
`;

export const Wrapper = styled.div<{
	isLastInRow: boolean;
}>`
	display: flex;
	padding: ${(props) => (props.isLastInRow ? '12px 16px' : '12px 8px 12px 16px')};
	justify-content: space-between;
	width: 100%;
`;

export const ActionBarWrapper = styled.div`
	display: flex;
	align-items: center;
`;

export const IconButton = styled(Button)`
	width: 48px;
	border-radius: 0 !important;
	margin-left: -1px;

	&.cui4-button--active {
		z-index: 1;
	}

	a:nth-of-type(1) & {
		border-radius: 2px 0 0 2px !important;
	}

	a:last-child & {
		border-radius: 0 2px 2px 0 !important;
	}
`;

export const ToggleBulkSidebarButton = styled(Button)`
	margin-right: 8px;
`;
