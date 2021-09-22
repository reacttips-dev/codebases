import colors from '@pipedrive/convention-ui-css/dist/amd/colors.js';
import styled from 'styled-components';

const white = '$color-white-hex';

export const NavBarItem = styled.a`
	text-decoration: none;
	padding: 16px;
	display: flex;

	position: relative;
	transition: background-color 0.1s;

	.cui4-icon {
		transition: fill 0.1s;
	}

	.cui4-pill {
		cursor: inherit;
	}

	&:hover {
		text-decoration: none;
		background-color: rgba(255, 255, 255, 0.16);

		.cui4-icon {
			fill: ${colors[white]};
		}
	}

	&:active {
		background-color: rgba(255, 255, 255, 0.24);

		.cui4-icon:first-child {
			fill: ${colors[white]};
		}
	}

	&.active {
		background-color: ${colors['$color-black-hex-shade-16']};

		&::before {
			content: '';
			width: 4px;
			border-radius: 0 4px 4px 0;
			background-color: ${colors[white]};
			position: absolute;
			top: 8px;
			bottom: 8px;
			left: 0;
		}
	}
`;
