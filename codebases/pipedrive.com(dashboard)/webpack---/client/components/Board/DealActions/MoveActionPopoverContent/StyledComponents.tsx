import { colors, fonts, styled } from '../../../../utils/styles';

export const Container = styled.div`
	width: 346px;

	.cui4-select__popup {
		max-height: 200px;
		z-index: 2;
	}
`;

export const TitleBar = styled.div`
	height: 48px;
	display: flex;
	align-items: center;
`;

export const Title = styled.div`
	font: ${fonts['$font-title-l']};
`;

export const SaveLocationOptionsWrapper = styled.div`
	min-height: 144px;
	display: flex;
	flex-direction: column;
`;

export const SelectGroup = styled.div`
	display: flex;
	flex-direction: column;
`;

export const Label = styled.div`
	margin-bottom: 4px;
	color: ${colors['$color-black-hex-88']};
	font: ${fonts['$font-body']};
`;
