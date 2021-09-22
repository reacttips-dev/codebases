import * as React from "react";
import styled from "styled-components";
import { FlexColumn, FlexRow } from "../../../../../../styled components/StyledFlex/src/StyledFlex";
import DailyActiveUsers from "./DailyActiveUsers";
import { Box } from "@similarweb/ui-components/dist/box";
import { StyledHeader, StyledHeaderTitle } from "../../StyledComponents";
import StyledBoxSubtitle from "../../../../../../styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import BoxSubtitle from "../../../../../../components/BoxSubtitle/src/BoxSubtitle";
import WithAllContexts from "../../../common components/WithAllContexts";
import BoxTitle from "../../../../../../components/BoxTitle/src/BoxTitle";
import Footer from "../../../common components/Footer";
import { SectionLoader } from "./components";
import { isSalesIntelligenceAppsState } from "pages/sales-intelligence/helpers/helpers";

export const UsageSectionWrapper = styled(Box)`
    width: 100%;
    height: auto;
    margin-top: 24px;
    font-family: Roboto;
    display: flex;
    flex-direction: column;
`;
const ChartsContainer = styled(FlexRow)`
    display: flex;
    flex-wrap: wrap;
    margin-right: 0;
    box-sizing: border-box;
    margin-top: 19px;
`;

const Header = styled(StyledHeader)`
    height: auto;
    border: 0;
`;
Header.displayName = "Header";

UsageSectionWrapper.displayName = "UsageSectionWrapper";
const getUsageData = (data) => data.map(({ key, value }) => ({ date: key, value }));
const UsageSection = ({ data, loading: isLoading }) => (
    <WithAllContexts>
        {({ translate, filters, track, getLink, swNavigator }) => {
            const { dailyActiveUsers } = (data.usage || {}) as any;
            const trackLearnMore = () =>
                track("internal link", "click", `usage/app engagement overview/learn more`);
            const store = filters.store.toLowerCase();
            const subtitleFilters = [
                {
                    filter: "date",
                    value: {
                        from: filters.from,
                        to: filters.to,
                    },
                },
                {
                    filter: "country",
                    countryCode: filters.country,
                    value: filters.countryName,
                },
            ];
            if (store !== "google") {
                return null;
            } else if (isLoading) {
                return <SectionLoader />;
            }

            const state = isSalesIntelligenceAppsState(swNavigator)
                ? "salesIntelligence-apps-engagementoverview"
                : "apps-engagementoverview";

            return (
                <UsageSectionWrapper data-automation-usage-wrapper={true}>
                    <Header>
                        <StyledHeaderTitle>
                            <BoxTitle tooltip={translate("app.performance.usage.dau.tooltip")}>
                                {translate("app.performance.usage.dau.title")}
                            </BoxTitle>
                        </StyledHeaderTitle>
                        <StyledBoxSubtitle>
                            <BoxSubtitle filters={subtitleFilters} />
                        </StyledBoxSubtitle>
                    </Header>
                    <ChartsContainer data-automation-usage-container={true}>
                        <DailyActiveUsers data={getUsageData(dailyActiveUsers || [])} />
                    </ChartsContainer>
                    <Footer
                        text={translate("app.performance.usagesection.learnmore")}
                        href={getLink(state, {
                            appId: `${store === "google" ? "0" : "1"}_${filters.appsInfo[0].id}`,
                            country: filters.country,
                            duration: "3m",
                            granularity: "Daily",
                        })}
                        onClick={trackLearnMore}
                    />
                </UsageSectionWrapper>
            );
        }}
    </WithAllContexts>
);

export default UsageSection;
