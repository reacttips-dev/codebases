import { colors, fonts, styled } from '../../../../utils/styles';

interface ActionProps {
	isDraggingOver: boolean;
	backgroundDraggingColor: string;
	textDraggingColor: string;
	textColor: string;
}

export const Container = styled.div`
	height: 100%;
	flex-basis: 100%;
	flex-grow: 0;
	font: ${fonts['$font-caption']};
	text-transform: uppercase;

	& > div {
		height: inherit;
	}

	&:not(:last-child) {
		margin-right: 8px;
	}
`;

export const Action = styled.div<ActionProps>`
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 2px;
	box-sizing: border-box;

	border: ${(props) => (props.isDraggingOver ? 'none' : `2px dashed ${colors['$color-black-hex-16']}`)};
	background: ${(props) => (props.isDraggingOver ? props.backgroundDraggingColor : 'initial')};
	color: ${(props) => (props.isDraggingOver ? props.textDraggingColor : props.textColor)};
`;
