import React from "react";
import BenchmarkItemContext from "../../contexts/BenchmarkItemContext";
import SummaryProspectItem from "../SummaryProspectItem/SummaryProspectItem";

const SummaryProspectItemContainer = () => {
    const { benchmarkItemService } = React.useContext(BenchmarkItemContext);
    const { color, domain, value } = benchmarkItemService.formattedProspect;
    const isLosing = benchmarkItemService.isProspectLosing;

    return (
        <SummaryProspectItem text={domain} value={value} labelColor={color} isWinner={!isLosing} />
    );
};

export default SummaryProspectItemContainer;
