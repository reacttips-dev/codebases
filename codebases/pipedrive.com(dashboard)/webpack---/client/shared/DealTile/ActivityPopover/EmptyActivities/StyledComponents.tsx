import { styled, colors, fonts } from '../../../../utils/styles';

interface EmptyStateContainerProps {
	strong?: boolean;
}

export const EmptyStateContainer = styled.div<EmptyStateContainerProps>`
	width: 320px;
	text-align: center;
	word-break: break-word;

	svg {
		margin-bottom: 32px;
	}

	.cui4-text {
		font: ${(props) => (props.strong ? fonts['$font-caption'] : null)};
		color: ${(props) => (props.strong ? colors['$color-black'] : colors['$color-black-hex-64'])};
	}
`;
