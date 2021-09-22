import {
    IPptBarChartOptions,
    PptMetricDataFormat,
} from "services/PptExportService/PptExportServiceTypes";
import { resolveYAxisFormat } from "./PptWidgetUtils";

export const getBarChartWidgetPptOptions = (): IPptBarChartOptions => {
    return {
        showLegend: true,
        showValuesOnChart: false,
    };
};
