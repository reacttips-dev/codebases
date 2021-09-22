import { styled } from '../../../utils/styles';

export const Column = styled.td`
	padding-right: 16px;
	margin-top: 4px;
	margin-bottom: 4px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	max-width: 145px;

	svg {
		vertical-align: middle;
		margin-right: 4px;
	}

	&:last-of-type {
		padding-right: 0;
	}
`;
