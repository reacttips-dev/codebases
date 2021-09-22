import { styled, colors } from '../../../utils/styles';

interface ContainerProps {
	isClickable: boolean;
}

export const Container = styled.div<ContainerProps>`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 16px;
	/* Needed for truncation to work with flexbox */
	min-width: 0;
	cursor: ${(props) => (props.isClickable ? 'pointer' : 'initial')};

	svg {
		margin-right: 4px;
	}

	&:hover {
		background-color: ${(props) => (props.isClickable ? colors['$color-black-hex-8'] : 'initial')};
	}
`;

export const TruncateContainer = styled.div`
	display: flex;
	align-items: center;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
`;

export const SummarySeparator = styled.span`
	margin: 0 8px;
`;
