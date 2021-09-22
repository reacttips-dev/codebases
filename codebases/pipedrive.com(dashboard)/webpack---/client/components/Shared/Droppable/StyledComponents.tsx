import { colors, styled } from '../../../utils/styles';
import { DroppableProps } from '.';

export const Container = styled.div<Partial<DroppableProps>>`
	background: ${(props) => (props.isDraggingOver ? colors['$color-black-hex-24'] : 'initial')};
	opacity: ${(props) => (props.isDraggingOver && props.hasOpacityOnDrop ? 0.64 : 'initial')};
`;
