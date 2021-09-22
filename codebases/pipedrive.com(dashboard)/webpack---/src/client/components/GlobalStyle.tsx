import reset from 'styled-reset';
import { createGlobalStyle } from 'styled-components';

import colors from '@pipedrive/convention-ui-css/dist/amd/colors.js';
import fonts from '@pipedrive/convention-ui-css/dist/amd/fonts.js';

import { stackOrder } from './menu/stackOrder';

export const GlobalStyle = createGlobalStyle`
	${reset}

	body {
		overflow: hidden;
		font: ${fonts['$font-body']};
		background-color: ${colors['$color-black-hex-4']};
		color: ${colors['$color-black-hex']};
	}

	a {
		color: ${colors['$color-blue-hex']};
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}

	.cui4-popover {
		z-index: ${stackOrder.popover}
	}
`;
