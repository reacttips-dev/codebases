import { styled, colors, fonts } from '../../utils/styles';

interface MessageProps {
	hasFixedWidth: boolean;
}

export const Message = styled.div<MessageProps>`
	width: ${(props) => (props.hasFixedWidth ? '320px' : 'auto')};
	text-align: center;
	word-break: break-word;
	padding: 48px 0;
`;

export const Title = styled.p`
	padding: 0 24px;
	font: ${fonts['$font-title-m']};
	color: ${colors['$color-black-hex']};
`;

export const Content = styled.p`
	padding: 0 24px;
	font: ${fonts['$font-body-s']};
	color: ${colors['$color-black-hex-64']};
	margin-top: 8px;

	a {
		color: ${colors['$color-blue-hex']};
		cursor: pointer;
		text-decoration: none;
	}
`;
