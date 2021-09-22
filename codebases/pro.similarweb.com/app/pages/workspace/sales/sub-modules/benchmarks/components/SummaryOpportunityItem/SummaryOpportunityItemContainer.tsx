import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import BenchmarkItemContext from "../../contexts/BenchmarkItemContext";
import SummaryOpportunityItem from "./SummaryOpportunityItem";

const SummaryOpportunityItemContainer = () => {
    const translate = useTranslation();
    const { isLoading, benchmarkItemService } = React.useContext(BenchmarkItemContext);

    return (
        <SummaryOpportunityItem
            loading={isLoading}
            value={benchmarkItemService.formattedOpportunity}
            valueColor={benchmarkItemService.opportunityColor}
            text={translate(benchmarkItemService.opportunityTitleKey)}
        />
    );
};

export default SummaryOpportunityItemContainer;
