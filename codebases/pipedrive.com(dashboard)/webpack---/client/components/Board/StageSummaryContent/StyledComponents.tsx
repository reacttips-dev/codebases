import { styled } from '../../../utils/styles';

export const Container = styled.span`
	display: flex;
	width: 100%;
`;

export const TruncateContent = styled.div`
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	flex: 1;
`;

export const WeightedIcon = styled.span`
	display: flex;
	margin-right: 4px;
`;

export const SummarySeparator = styled.span`
	margin: 0 4px;
`;
