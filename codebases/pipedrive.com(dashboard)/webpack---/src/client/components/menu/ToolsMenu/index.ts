import { colors, elevations } from '@pipedrive/convention-ui-css/dist/js/variables';
import styled from 'styled-components';

import config from '../../../config/styles';

export const ToolsMenu = styled.div`
	background: ${colors.white};
	padding: 16px 8px;
	height: 100%;
	flex-shrink: 0;
	box-sizing: border-box;

	@media only screen and (min-width: ${config.breakpoints.m}px) {
		max-width: 144px;
		min-width: 120px;
		box-shadow: ${elevations.elevation01};
	}
`;
