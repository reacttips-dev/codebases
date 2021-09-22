import { styled } from '../../../utils/styles';
import Droppable from '../../Shared/Droppable';
import { Container as HeaderContainer, Details as HeaderDetails } from '../StageHeader/StyledComponents';
import { ButtonWrapper } from '../DealsList/StyledComponents';

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	height: auto;
	/* Fixes VERY long strings without spaces */
	word-break: break-all;
	min-width: 0;

	&:first-child {
		& ${HeaderContainer} {
			${HeaderDetails} {
				margin: 0;
				padding: 0 16px;

				.arrow {
					display: none;
				}
			}
		}
	}

	&:hover {
		${ButtonWrapper} {
			opacity: 1;
		}
	}
`;

export const DroppableContainer = styled(Droppable)`
	height: 100%;
	border-radius: 2px;
`;
