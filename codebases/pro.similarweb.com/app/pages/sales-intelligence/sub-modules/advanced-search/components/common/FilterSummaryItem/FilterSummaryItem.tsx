import React from "react";
import { AdvancedSearchFilterSummary } from "../../../types/filters";
import { StyledSummaryName, StyledSummaryValue, StyledFilterSummaryItem } from "./styles";

type FilterSummaryItemProps = {
    summary: AdvancedSearchFilterSummary;
};

const FilterSummaryItem = (props: FilterSummaryItemProps) => {
    const summaryNameDivRef = React.useRef<HTMLDivElement>(null);
    const [valueDivMaxWidth, setValueDivMaxWidth] = React.useState<string>(undefined);
    const { summary } = props;

    // TODO: Think of removing this in favor of "nameRenderer" and "valueRenderer" from summary object
    const renderName = (summary: AdvancedSearchFilterSummary) => {
        if (!summary.name) {
            return null;
        }

        return (
            <StyledSummaryName ref={summaryNameDivRef}>
                <span>{summary.name}</span>
                <span>:&nbsp;</span>
            </StyledSummaryName>
        );
    };

    React.useLayoutEffect(() => {
        if (summaryNameDivRef.current === null) {
            return setValueDivMaxWidth(undefined);
        }

        setValueDivMaxWidth(`calc(100% - ${summaryNameDivRef.current.clientWidth}px)`);
    }, [summary.value]);

    return (
        <StyledFilterSummaryItem>
            {renderName(summary)}
            <StyledSummaryValue maxWidth={valueDivMaxWidth}>
                <span>{summary.value}</span>
            </StyledSummaryValue>
        </StyledFilterSummaryItem>
    );
};

export default FilterSummaryItem;
