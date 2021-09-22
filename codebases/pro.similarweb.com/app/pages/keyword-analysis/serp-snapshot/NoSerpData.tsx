import {
    Box,
    SerpCount,
    SearchSerpContainer,
    Grid,
    SerpWidgetTitleText,
} from "pages/keyword-analysis/serp-snapshot/StyledComponents";
import { SWReactIcons } from "@similarweb/icons";
import { SERP_MAP } from "pages/website-analysis/traffic-sources/search/components/serp/SerpTypes";
import React from "react";
import styled from "styled-components";
import { i18nFilter } from "filters/ngFilters";

const NoDataGrid = styled(Grid)`
    opacity: 0.2;
`;
const NoDataSearchSerpContainer = styled(SearchSerpContainer)``;
const NoDataSerpName = styled(SerpCount)``;
const Text = styled(SerpCount)`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 271px;
    height: 20px;
`;
const GridWrapper = styled.div`
    position: relative;
`;
const NoDataBox = styled(Box)`
    cursor: default;
    &:hover {
        box-shadow: none;
    }
    @media (max-width: 1540px) {
        :nth-last-child(1) {
            display: none;
        }
    }
`;
const SerpFerNoData = [
    {
        serpFeature: "featured",
        records: [],
    },
    {
        serpFeature: "paid",
        records: [],
    },
    {
        serpFeature: "news",
        records: [],
    },
    {
        serpFeature: "video",
        records: [],
    },
    {
        serpFeature: "images",
        records: [],
    },
];
export const NoSerpData = () => {
    const SerpBox = (serpFeature) => {
        const serpName = serpFeature.serpFeature;
        return (
            <NoDataBox>
                <SWReactIcons iconName={SERP_MAP[serpName].icon} size={"xs"} />
                <div style={{ paddingLeft: "24px" }}>
                    <div>{SERP_MAP[serpName].name}</div>
                    <div>{serpFeature.records.length} websites</div>
                </div>
            </NoDataBox>
        );
    };
    return (
        <NoDataSearchSerpContainer>
            <SerpWidgetTitleText>
                {i18nFilter()("serp.top.table.widgets.title")}
            </SerpWidgetTitleText>
            <GridWrapper>
                <NoDataGrid>{SerpFerNoData.map((serp) => SerpBox(serp))}</NoDataGrid>
                <Text>No SERP features detected for this keyword</Text>
            </GridWrapper>
        </NoDataSearchSerpContainer>
    );
};
