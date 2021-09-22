import { colors, fonts, styled } from '../../../../utils/styles';

export const Container = styled.div`
	width: 346px;

	.cui4-select__popup {
		max-height: 200px;
		z-index: 2;
	}
`;

export const Title = styled.div`
	font: ${fonts['$font-title-l']};
	margin-bottom: 16px;
`;

export const SelectGroup = styled.div`
	margin-top: 16px;
	display: flex;
	flex-direction: column;
`;

export const Label = styled.div`
	margin-bottom: 4px;
	color: ${colors['$color-black-hex-88']};
	font: ${fonts['$font-body']};

	a {
		color: ${colors['$color-blue-hex']};
		cursor: pointer;
		text-decoration: none;
	}
`;

export const Footer = styled.div`
	display: flex;
	justify-content: flex-end;
	border-top: 1px solid ${colors['$color-black-hex-16']};

	.cui4-button {
		margin-left: 8px;
	}
`;
