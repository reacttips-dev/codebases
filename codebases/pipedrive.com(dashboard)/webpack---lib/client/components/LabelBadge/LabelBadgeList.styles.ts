import styled from 'styled-components';
import { Badge } from '@pipedrive/convention-ui-react';

export const LabelBadge = styled(Badge)`
	max-width: 135px;
`;

export const LabelsList = styled.div<{ shouldWrap?: boolean }>`
	display: flex;
	width: 100%;
	flex-wrap: ${({ shouldWrap }) => (shouldWrap ? 'wrap' : 'nowrap')};
	margin-top: 4px;

	> ${LabelBadge} {
		margin-right: 4px;
		margin-bottom: 4px;
		overflow: hidden;
		text-overflow: ellipsis;
	}
`;

export const OverLimitBadge = styled(Badge)`
	.cui4-badge__label {
		overflow: visible;
	}
`;
