import React from "react";
import useSummaryTextService from "../../hooks/useSummaryTextService";
import BenchmarkItemContext from "../../contexts/BenchmarkItemContext";
import SummaryText from "./SummaryText";

const SummaryTextContainer = () => {
    const summaryTextService = useSummaryTextService();
    const { isLoading } = React.useContext(BenchmarkItemContext);
    const { text, tooltip } = summaryTextService.getTexts();

    return <SummaryText text={text} tooltipText={tooltip} isLoading={isLoading} />;
};

export default SummaryTextContainer;
