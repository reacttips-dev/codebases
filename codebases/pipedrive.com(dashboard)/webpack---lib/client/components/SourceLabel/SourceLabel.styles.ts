import styled from 'styled-components';
import { ellipsisOverflow } from 'Utils/styles/utils';

export const Wrapper = styled.div`
	display: flex;
	align-items: center;
	position: relative;
`;

export const IconWrapper = styled.span`
	position: absolute;
	display: flex;
	align-items: center;
	svg {
		width: 16px;
		height: 16px;
	}
`;

export const LabelWrapper = styled.span<{ isInsideSidebar: boolean }>`
	margin-left: ${({ isInsideSidebar }) => (isInsideSidebar ? '36px' : '24px')};
	${ellipsisOverflow};
`;
