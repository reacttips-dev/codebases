import React from "react";
import { BENCHMARK_ITEM_KEY } from "../../constants";
import { useTranslation } from "components/WithTranslation/src/I18n";
import BenchmarkItemContext from "../../contexts/BenchmarkItemContext";
import SummaryAvgItem from "./SummaryAvgItem";

const SummaryAvgItemContainer = () => {
    const translate = useTranslation();
    const { isLoading, benchmarkItemService } = React.useContext(BenchmarkItemContext);
    const competitors = benchmarkItemService.currentCompetitors;
    const text = translate(benchmarkItemService.competitorsAverageTitleKey, {
        comparedCompetitors: competitors.length,
    });

    const getItemTooltipText = () => {
        if (competitors.length > 1) {
            return translate(`${BENCHMARK_ITEM_KEY}.average.tooltip`, {
                country: benchmarkItemService.countryName,
            });
        }
    };

    return (
        <SummaryAvgItem
            text={text}
            loading={isLoading}
            infoTooltipText={getItemTooltipText()}
            value={benchmarkItemService.formattedAverage}
            isWinner={benchmarkItemService.isProspectLosing}
            labelColor={benchmarkItemService.competitorsAverageColor}
        />
    );
};

export default SummaryAvgItemContainer;
