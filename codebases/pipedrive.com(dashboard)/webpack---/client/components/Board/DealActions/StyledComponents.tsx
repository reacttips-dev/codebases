import { colors, styled } from '../../../utils/styles';

export const Container = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: center;
	background: ${colors['$color-black-hex-4']};
	box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.1), 0 3px 3px -2px rgba(0, 0, 0, 0.06), 0 3px 4px 0 rgba(0, 0, 0, 0.05),
		0 0 2px 0 rgba(0, 0, 0, 0.16);
	height: 64px;
	width: 100%;
	padding: 8px 16px;
	box-sizing: border-box;
`;
