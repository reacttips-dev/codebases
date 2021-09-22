import { styled, colors, fonts } from '../../../utils/styles';

export const Title = styled.div`
	font: ${fonts['$font-title-l']};
	color: ${colors['$color-black-hex']};

	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;
