import { colors, styled } from '../../../utils/styles';
import { DealTileSizes } from '../../../utils/constants';

interface StatusIndicatorContainerProps {
	isClickable: boolean;
	dealTileSize: DealTileSizes;
	isActive: boolean;
}

export const StatusIndicatorContainer = styled.div<StatusIndicatorContainerProps>`
	bottom: ${(props) => (props.dealTileSize === DealTileSizes.REGULAR ? '6px' : null)};
	display: flex;
	align-items: center;
	justify-content: center;
	width: 24px;
	height: 24px;
	border-radius: 24px;
	transition: all 0.1s linear;
	cursor: ${(props) => (props.isClickable ? 'pointer' : 'initial')};
	background: ${(props) => (props.isActive ? colors['$color-black-hex-16'] : colors['$color-white-hex'])};

	&:hover {
		background: ${(props) => (props.isClickable ? colors['$color-black-hex-8'] : colors['$color-white-hex'])};
	}

	&:active {
		background: ${(props) => (props.isClickable ? colors['$color-black-hex-16'] : colors['$color-white-hex'])};
	}

	&[data-status='NONE'] {
		path {
			fill: ${(props) => (props.isActive ? colors['$color-yellow-hex'] : null)};
		}
	}

	&[data-status='OVERDUE'] {
		path {
			fill: ${(props) => (props.isActive ? colors['$color-red-hex'] : null)};
		}
	}

	&[data-status='TODAY'] {
		path {
			fill: ${(props) => (props.isActive ? colors['$color-green-hex'] : null)};
		}
	}

	&[data-status='PLANNED'] {
		path {
			fill: ${(props) => (props.isActive ? colors['$color-black-hex-32'] : null)};
		}
	}

	&:hover,
	&:active {
		&[data-status='NONE'] {
			path {
				fill: ${colors['$color-yellow-hex']};
			}
		}

		&[data-status='OVERDUE'] {
			path {
				fill: ${colors['$color-red-hex']};
			}
		}

		&[data-status='TODAY'] {
			path {
				fill: ${colors['$color-green-hex']};
			}
		}

		&[data-status='PLANNED'] {
			path {
				fill: ${colors['$color-black-hex-32']};
			}
		}
	}

	svg {
		text-shadow: 0 0 0 2px white;
	}

	.iamcoachmark-status-indicator-container {
		position: absolute;
		top: 24px;
		word-break: break-word;
	}
`;
