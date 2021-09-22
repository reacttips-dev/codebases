import { IPptPieChartOptions } from "services/PptExportService/PptExportServiceTypes";

export const getPieChartWidgetPptOptions = (): IPptPieChartOptions => {
    return {
        showLegend: true,
        showValuesOnChart: false,
    };
};
