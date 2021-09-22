import { styled, colors, fonts } from '../../../utils/styles';

export const Container = styled.div`
	align-items: center;
	display: flex;
	color: ${colors['$color-black-hex-64']};
	font: ${fonts['$font-body-s']};
	margin: 4px 0 1px;

	svg {
		fill: ${colors['$color-black-hex-64']};
	}
`;
