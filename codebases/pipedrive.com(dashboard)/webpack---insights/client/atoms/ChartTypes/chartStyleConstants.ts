import colors from '@pipedrive/convention-ui-css/dist/json/colors.json';

export const FunnelChartItemColor = {
	STAGE_BAR: colors['$color-yellow-hex-64'],
	CONVERSION_ARROW: colors['$color-black-hex-64'],
	WON_BAR: colors['$color-lime-hex'],
};

export enum ChartElementColor {
	AXIS_TICK = colors['$color-black-hex-64'] as any,
	TOOLTIP_CURSOR = colors['$color-black-rgba-5'] as any,
}

export const CONTAINER_HEIGHT = 320;

export const AXIS_DECIMAL_PLACES = 2;
