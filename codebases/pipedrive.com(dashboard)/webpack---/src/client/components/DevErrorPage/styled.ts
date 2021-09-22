import styled from 'styled-components';
import InlineSVG from 'react-inlinesvg';

import { fonts, colors } from '@pipedrive/convention-ui-css/dist/js/variables';

import errorIcon from '../../tools/ErrorPage/error.svg';

export const Wrapper = styled.div`
	box-sizing: border-box;

	display: flex;
	flex-direction: column;
	align-items: center;

	width: 100%;
	height: 100%;
	padding: 20px 15px 0;

	overflow-y: auto;
`;

export const SVG = styled(InlineSVG).attrs({
	src: errorIcon,
})`
	height: 160px;
	width: 240px;
`;

export const Title = styled.h2`
	font: ${fonts.fontTitleXl};
	margin-top: 24px;
`;

export const Errors = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, max-content));
	grid-gap: 10px;
	justify-content: center;

	width: 100%;
	margin-top: 15px;

	font: ${fonts.fontBody};
	color: ${colors.black64};
`;

export const SingleError = styled.div`
	box-sizing: border-box;

	padding: 5px;

	text-align: center;

	outline: 1px dotted ${colors.black64};
`;

export const GlobalMessage = styled.p`
	margin-top: 10px;

	text-align: center;
`;

export const Message = styled.p`
	text-align: center;
`;

export const Code = styled.p`
	font-style: italic;

	text-transform: uppercase;

	margin-top: 5px;
`;
