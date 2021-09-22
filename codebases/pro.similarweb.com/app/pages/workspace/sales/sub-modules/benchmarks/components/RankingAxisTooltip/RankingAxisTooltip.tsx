import React from "react";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";
import { AxisWebsiteType } from "../../types/chart";
import { StyledRankingAxisTooltipContent } from "./styles";

export type RankingAxisTooltipProps = {
    website: AxisWebsiteType;
    children: React.ReactNode;
};

const RankingAxisTooltip = (props: RankingAxisTooltipProps) => {
    const { children, website } = props;

    return (
        <PopupHoverContainer
            config={{
                enabled: true,
                placement: "top",
                cssClass: "benchmarks-ranking-axis-tooltip-container",
                cssClassContent: "benchmarks-ranking-axis-tooltip-content",
            }}
            content={() => (
                <StyledRankingAxisTooltipContent>
                    <span>{website.domain}</span>
                    <span>{website.value}</span>
                </StyledRankingAxisTooltipContent>
            )}
        >
            {children}
        </PopupHoverContainer>
    );
};

export default RankingAxisTooltip;
