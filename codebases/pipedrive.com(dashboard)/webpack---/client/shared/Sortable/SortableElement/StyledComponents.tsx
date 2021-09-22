import { styled, colors } from '../../../utils/styles';

type ContainerProps = {
	highlighted?: boolean;
	marginTop: number;
	isDragging: boolean;
};

export const Container = styled.div<ContainerProps>`
	padding: 4px 16px;
	display: flex;
	justify-content: space-between;
	margin-top: ${(props) => `${props.marginTop}px`};
	align-items: center;
	cursor: move;
	border: ${(props) =>
		props.isDragging
			? `1px dashed ${colors['$color-black-hex-32']}`
			: `1px solid ${props.highlighted ? colors['$color-blue-hex'] : colors['$color-black-hex-12']}`};
	color: ${(props) => (props.isDragging ? colors['$color-white-hex'] : 'initial')};

	span {
		padding-right: 4px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	svg {
		fill: ${(props) => (props.isDragging ? colors['$color-white-hex'] : 'initial')};
	}

	&:first-of-type {
		margin-top: 0;
	}
`;
