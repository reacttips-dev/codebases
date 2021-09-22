import { styled, colors } from '../../utils/styles';

export const Container = styled.div`
	display: flex;
	padding: 16px;
	border-bottom: 1px solid ${colors['$color-black-hex-16']};

	.cui4-popover,
	.cui4-tooltip {
		z-index: 9;
	}
`;

export const Left = styled.div`
	display: flex;
`;

export const Right = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	width: 100%;
`;

export const Loader = styled.div`
	display: flex;
	align-items: center;
	margin-right: 8px;
`;
