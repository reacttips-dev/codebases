import combineConfigs from "../../../../../.pro-features/components/Chart/src/combineConfigs";
import legendConfig from "./legendConfig";
import tooltipConfig from "./tooltipConfig";

const LEGEND_MALE_BLUE = "#4F8DF9";
const LEGEND_FEMALE_BLUE = "#8CD2FF";

export const getGenderPieChartConfig = ({ type, filter }) => {
    const yAxisFormatter = ({ value }) => (value ? filter()(value, 2) : "0%");
    return combineConfigs({ type, filter, yAxisFormatter }, [
        legendConfig,
        tooltipConfig,
        {
            chart: {
                animation: true,
                type,
                plotBackgroundColor: "transparent",
                height: 180,
                width: 270,
            },
            plotOptions: {
                pie: {
                    innerSize: "55%",
                    animation: true,
                    showInLegend: true,
                    cursor: "pointer",
                    borderWidth: 0,
                    dataLabels: {
                        enabled: false,
                    },
                },
            },
        },
    ]);
};

export const getGenderPieChartStyle = () => {
    return {
        style: {
            height: "auto",
            flexGrow: 1,
            marginTop: "50px",
            display: "flex",
            justifyContent: "center",
        },
    };
};

export const formatGenderPieChartData = (malePercent: number, femalePercent: number) => {
    const chartRecords = [
        {
            color: LEGEND_MALE_BLUE,
            name: "Male",
            seriesName: "Male",
            y: malePercent,
        },
        {
            color: LEGEND_FEMALE_BLUE,
            name: "Female",
            seriesName: "Female",
            y: femalePercent,
        },
    ];

    return [
        {
            data: chartRecords,
        },
    ];
};
