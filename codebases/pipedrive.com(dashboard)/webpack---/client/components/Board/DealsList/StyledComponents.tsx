import { colors, styled } from '../../../utils/styles';

interface ButtonWrapperProps {
	dealsCount: number;
	allDealsCount: number;
	isDraggingOver: boolean;
}

export const ButtonWrapper = styled.div<ButtonWrapperProps>`
	position: sticky;
	bottom: 0;
	opacity: 0;
	display: flex;
	padding: ${(props) => (props.dealsCount ? '6px 4px' : '0 4px')};
	margin: ${(props) => (props.dealsCount ? '2px -4px 0' : '0 -4px')};
	visibility: ${(props) => (props.isDraggingOver ? 'hidden' : 'visible')};
	background: ${(props) => (props.allDealsCount ? `${colors['$color-black-hex-4']}` : 'none')};

	button {
		width: 100%;
		flex: 1;

		&:hover {
			& > svg {
				fill: ${colors['$color-black-hex-88']};
			}
		}
	}
`;

export const Column = styled.div`
	height: 100%;
`;

export const Container = styled.div`
	padding: 8px;
`;
