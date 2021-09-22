import { Panel } from '@pipedrive/convention-ui-react';
import { DealTileSizes } from '../../utils/constants';
import { colors, elevations, fonts, styled } from '../../utils/styles';
import { StatusIndicatorContainer } from './StatusIndicator/StyledComponents';
import filterPropsFromComponent from '../../utils/filterPropsFromComponent';

export const ValueContainer = styled.div<DealPanelProps>`
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	align-items: stretch;
	height: 24px;

	& .cui4-pill {
		display: flex;
	}

	a {
		display: flex;
		flex: 1;
		align-items: center;
		margin-top: ${(props) => (props.size === DealTileSizes.REGULAR ? '4px' : '0')};

		div {
			display: flex;
		}
	}
`;

export const Title = styled.span`
	color: ${colors['$color-black-hex']};
	font: ${fonts['$font-title-m']};
	word-break: break-word;
`;

export const Description = styled.div`
	font: ${fonts['$font-body-s']};
	color: ${colors['$color-black-hex-64']};
	min-height: 16px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

export const Value = styled.div.attrs((props) => {
	return {
		...props,
		'data-test': 'pipeline-deal-value',
	};
})`
	font: ${fonts['$font-caption-s']};
	color: ${colors['$color-black-hex-64']};
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
`;

export const Stage = styled.div`
	flex: 1;
	height: 2px;
	background: green;
`;

export const Left = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	overflow: hidden;
`;

export const LeftTop = styled.a`
	flex-direction: column;
	align-items: flex-start;
	width: 100%;
	overflow: hidden;
`;

export const Right = styled.div`
	display: flex;
	justify-content: center;
	padding-left: 8px;
`;

export const DealLabelHoverArea = styled.div`
	padding-bottom: 2px;
	padding-top: 2px;
	margin-bottom: 6px;
	width: 32px;
`;

const LABEL_COLOR_MAPPING = {
	gray: '$color-black-hex-12',
};

export const DealLabel = styled.div`
	height: 4px;
	border-radius: 4px;
	width: 32px;

	background-color: ${(props) => colors[LABEL_COLOR_MAPPING[props.color] || `$color-${props.color}-hex`]};
`;

export interface DealPanelProps {
	isClickable?: boolean;
	backgroundColor?: null | 'green' | 'red' | 'gray';
	isLocked?: boolean;
	isLast?: boolean;
	isDragging?: boolean;
	size?: DealTileSizes;
}

const COLOR_MAPPING = {
	green: colors['$color-green-hex-8'],
	red: colors['$color-red-hex-8'],
	gray: colors['$color-black-hex-4'],
};

export const DealPanelContent = styled.div`
	display: flex;
`;

export const DealPanel = styled(
	filterPropsFromComponent(Panel, ['backgroundColor', 'isClickable', 'isLocked', 'isLast', 'isDragging', 'size']),
)`
	background: ${(props) => COLOR_MAPPING[props.backgroundColor] || colors['$color-white-hex']};
	display: flex;
	cursor: ${(props) => (props.isClickable ? 'pointer' : 'initial')};
	margin-bottom: ${(props) => (props.isLast ? '0' : '4px')};
	opacity: ${(props) => (props.isDragging ? 0 : props.isLocked ? 0.64 : 'initial')};

	/* Needed to make word breaking work correctly on Firefox. Not sure why ¯\_(ツ)_/¯ */
	word-break: initial;

	${DealPanelContent} {
		flex-direction: ${(props) => (props.size === DealTileSizes.SMALL ? 'column' : 'row')};
	}

	/* This is 6px on purposes, because another 2px is added in the next-activity-icon */
	> .cui4-spacing {
		padding: 6px 8px;
		width: 100%;
		overflow: hidden;
	}

	${Right} {
		margin-bottom: ${(props) => (props.size === DealTileSizes.SMALL ? '6px' : '0')};
		margin-bottom: 0;
		flex-direction: ${(props) => (props.size === DealTileSizes.SMALL ? 'row' : 'column')};
	}

	${LeftTop} {
		flex-direction: ${(props) => (props.size === DealTileSizes.SMALL ? 'row' : 'column')};
	}

	&:hover {
		box-shadow: ${elevations['$elevation-02']};
	}

	&:hover ${StatusIndicatorContainer} {
		box-shadow: ${(props) => (props.isClickable ? `${colors['$color-black-hex-16']} 0 0 0 1px inset` : 'none')};
	}

	${StatusIndicatorContainer} {
		&:hover {
			box-shadow: none;
		}
	}

	a {
		text-decoration: none;
	}

	.cui4-avatar {
		margin-right: 4px;
	}
`;

export const WeightedValueTooltipContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;

	span {
		margin-left: 4px;
	}
`;

export const RowContainer = styled.div`
	&:not(:empty) {
		margin-top: 4px;
	}
`;

export const Bottom = styled.div`
	padding-top: 4px;
`;

interface ProgressProps {
	progress: number;
}

export const Progress = styled.div<ProgressProps>`
	z-index: 50;
	width: ${(props) => `${props.progress}%`};
	height: 2px;
	background-color: ${colors['$color-green-hex']};
	transition: width 1s linear 2s;
`;
