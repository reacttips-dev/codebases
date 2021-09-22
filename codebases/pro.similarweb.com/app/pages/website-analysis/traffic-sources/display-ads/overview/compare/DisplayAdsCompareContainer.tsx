import React, { FunctionComponent } from "react";
import {
    SectionWrapper,
    StyledBox,
} from "pages/website-analysis/traffic-sources/display-ads/overview/common/StyledComponents";
import { AdsVisitsDistribution } from "pages/website-analysis/traffic-sources/display-ads/overview/compare/AdsVisitsDistribution";
import { TopPublishers } from "pages/website-analysis/traffic-sources/display-ads/overview/common/TopPublishers";
import { TopAdNetworks } from "pages/website-analysis/traffic-sources/display-ads/overview/common/TopAdNetworks";
import { DisplayAdsGraph } from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/DisplayAdsGraph";
import { AdsTotalVisitsCompare } from "pages/website-analysis/traffic-sources/display-ads/overview/compare/AdsTotalVisitsCompare";

export const DisplayAdsCompareContainer: FunctionComponent<any> = () => {
    const StyledBoxWrapper = ({ children, width, height }) => (
        <StyledBox width={width} height={height}>
            {children}
        </StyledBox>
    );

    return (
        <>
            <SectionWrapper justifyContent={"space-between"}>
                <StyledBoxWrapper width={"32.5%"} height={"325px"}>
                    <AdsTotalVisitsCompare />
                </StyledBoxWrapper>
                <StyledBoxWrapper width={"65.5%"} height={"325px"}>
                    <AdsVisitsDistribution />
                </StyledBoxWrapper>
            </SectionWrapper>
            <SectionWrapper>
                <DisplayAdsGraph />
            </SectionWrapper>
            <SectionWrapper justifyContent={"space-between"}>
                <StyledBoxWrapper width={"49%"} height={"366px"}>
                    <TopPublishers />
                </StyledBoxWrapper>
                <StyledBoxWrapper width={"49%"} height={"366px"}>
                    <TopAdNetworks />
                </StyledBoxWrapper>
            </SectionWrapper>
        </>
    );
};
