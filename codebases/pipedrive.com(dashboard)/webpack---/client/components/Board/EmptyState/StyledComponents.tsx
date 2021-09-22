import { fonts, colors, styled } from '../../../utils/styles';

export const Message = styled.div`
	.cui4-text {
		text-align: center;
		font: ${fonts['$font-title-xxl']};

		span {
			display: block;
		}
	}
`;

export const SvgContainer = styled.div`
	padding-bottom: 32px;
	width: 377px;
`;

export const NoDealsContainer = styled.div`
	display: flex;
	height: 100%;
	width: 100%;
	position: relative;
`;

export const NoStagesContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	flex-direction: column;
	height: 100%;
	width: 100%;
`;

export const Middle = styled.div`
	display: flex;
	justify-content: center;
	flex-direction: column;
	position: absolute;
	margin: auto;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	height: 0px;
	align-items: center;
`;

export const Wrap = styled(Middle)`
	width: auto;
`;

export const Title = styled.div`
	text-align: center;
	font: ${fonts['$font-title-xxl']};
`;

export const Content = styled.p`
	margin-top: 12px;
	text-align: center;
	font: ${fonts['$font-body-l']};

	a,
	span {
		color: ${colors['$color-blue-hex']};
		cursor: pointer;
		text-decoration: none;
	}
`;

export const RevokedContent = styled.p`
	width: 560px;
	margin-top: 8px;
	text-align: center;
	font: ${fonts['$font-body-l']};
	color: ${colors['$color-black-rgba-64']};
`;

export const RevokedSvgContainer = styled.div`
	padding-bottom: 24px;
	width: 240px;
`;
