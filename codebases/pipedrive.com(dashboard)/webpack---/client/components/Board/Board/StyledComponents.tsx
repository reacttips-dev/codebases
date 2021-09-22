import { styled } from '../../../utils/styles';
import { DroppableContainer } from '../../Board/Stage/StyledComponents';
import { Panel } from '@pipedrive/convention-ui-react';

export const Loader = styled(Panel)`
	position: absolute;
	left: calc(50% - 16px);
	bottom: 16px;
	z-index: 1;
	height: 32px;
`;

export const Scrollable = styled.div`
	width: 100%;
	height: 100%;
	overflow-y: scroll;

	@media print {
		overflow-y: visible;
	}
`;

export const EmptyContainer = styled.div`
	display: flex;
	height: 100%;
	min-height: 500px;
`;

export const Container = styled.div`
	display: flex;
	height: auto;
	min-height: 100%;

	.cui4-popover {
		z-index: 3;
	}
`;

export const NoDealsContainer = styled(EmptyContainer)`
	${DroppableContainer} {
		&:hover {
			background: linear-gradient(180deg, rgba(238, 238, 238, 0.7), rgba(238, 238, 238, 0));
		}
	}
`;
