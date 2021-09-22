import React, { FunctionComponent } from "react";
import {
    SectionWrapper,
    StyledBox,
} from "pages/website-analysis/traffic-sources/display-ads/overview/common/StyledComponents";
import { TopPublishers } from "pages/website-analysis/traffic-sources/display-ads/overview/common/TopPublishers";
import { TopAdNetworks } from "pages/website-analysis/traffic-sources/display-ads/overview/common/TopAdNetworks";
import { DisplayAdsSingleTopContainer } from "pages/website-analysis/traffic-sources/display-ads/overview/single/DisplayAdsSingleTopContainer";
import { RecentlySpottedCreatives } from "pages/website-analysis/traffic-sources/display-ads/overview/single/RecentlySpottedCreatives";
import { DisplayAdsGraph } from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/DisplayAdsGraph";

export const DisplayAdsSingleContainer: FunctionComponent<any> = () => {
    const StyledBoxWrapper = ({ children, width = "100%", height }) => (
        <StyledBox width={width} height={height}>
            {children}
        </StyledBox>
    );

    return (
        <>
            <SectionWrapper justifyContent={"space-between"}>
                <DisplayAdsSingleTopContainer />
            </SectionWrapper>
            <SectionWrapper>
                <StyledBoxWrapper height={"389px"}>
                    <RecentlySpottedCreatives />
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
