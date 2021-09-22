import { fonts, colors, styled } from '../../utils/styles';

export const SvgContainer = styled.div`
	padding-bottom: 25px;
	width: auto;

	svg {
		width: 289px;
		height: 188px;
	}
`;

export const Title = styled.h3`
	text-align: center;
	font: ${fonts['$font-title-l']};
`;

export const Content = styled.p`
	margin-top: 16px;
	text-align: center;
	font: ${fonts['$font-body-m']};

	strong {
		font-weight: ${fonts['$font-weight-bold']};
	}
`;

export const ContentGray = styled(Content)`
	margin-top: 12px;
	color: ${colors['$color-black-rgba-64']};
`;

export const Container = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
`;

export const Buttons = styled.div`
	display: flex;
	flex-wrap: wrap;
	width: 100%;

	button {
		width: 100%;
		margin-bottom: 8px;
	}
`;
