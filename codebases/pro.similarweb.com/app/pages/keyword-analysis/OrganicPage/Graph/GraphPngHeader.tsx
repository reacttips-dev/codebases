import React from "react";
import styled from "styled-components";
import CountryService from "services/CountryService";
import DurationService from "services/DurationService";
import { Injector } from "common/ioc/Injector";
import { i18nFilter } from "filters/ngFilters";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

const Container = styled.div`
    padding: 21px 24px;
    margin-bottom: 12px;
    border-bottom: 1px solid #e4e4e4;
    color: #2b3d52;
    font-family: "Roboto", Tahoma, sans-serif;
    display: none;
`;

const Title = styled.span`
    font-size: 35px;
`;

const SubTitle = styled.span`
    font-size: 18px;
    padding-left: 24px;
`;

export const GraphPngHeader = ({ pngHeaderDataTypeKey, params, isKeywordsGroup }) => {
    const countryName = CountryService.getCountryById(params.country).text;
    const durationText = DurationService.getDurationData(params.duration).forWidget;
    const keywordText = isKeywordsGroup
        ? `Group '${keywordsGroupsService.findGroupById(params.keyword).Name}'`
        : `Keyword '${params.keyword}'`;
    const i18n = i18nFilter();
    return (
        <Container>
            <Title>{i18n("keywords.research.common.traffic.chart.header")}</Title>
            <SubTitle>
                {durationText} | {countryName} | {i18n(pngHeaderDataTypeKey)} | {keywordText}
            </SubTitle>
        </Container>
    );
};
