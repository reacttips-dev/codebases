import { styled } from '../../../utils/styles';

export const Container = styled.span`
	display: flex;
	width: 100%;
`;

export const TruncateContent = styled.span`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;
