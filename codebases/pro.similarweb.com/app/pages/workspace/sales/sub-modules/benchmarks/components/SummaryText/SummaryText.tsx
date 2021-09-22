import React from "react";
import * as s from "../BenchmarkSummary/styles";
import { SWReactIcons } from "@similarweb/icons";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import BenchmarkSummaryTextLoader from "../BenchmarkSummary/BenchmarkSummaryTextLoader";

type SummaryTextProps = {
    text: string;
    isLoading: boolean;
    tooltipText?: string;
};

const SummaryText = (props: SummaryTextProps) => {
    const { isLoading, text, tooltipText } = props;

    function renderSummaryText() {
        if (isLoading) {
            return <BenchmarkSummaryTextLoader />;
        }

        return (
            <s.StyledBenchmarkSummaryText>
                <span>{text}</span>
                {tooltipText && (
                    <PlainTooltip maxWidth={200} tooltipContent={tooltipText}>
                        <s.StyledBenchmarkSummaryTextIcon>
                            <SWReactIcons iconName="info" size="xs" />
                        </s.StyledBenchmarkSummaryTextIcon>
                    </PlainTooltip>
                )}
            </s.StyledBenchmarkSummaryText>
        );
    }

    return (
        <s.StyledBenchmarkSummaryTextContainer>
            {renderSummaryText()}
        </s.StyledBenchmarkSummaryTextContainer>
    );
};

export default SummaryText;
