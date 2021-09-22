import { SWReactIcons } from "@similarweb/icons";
import { ProgressBar } from "components/React/ProgressBar";
import { i18nFilter, percentageFilter } from "filters/ngFilters";
import React, { useState } from "react";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import styled from "styled-components";
import {
    ArrowRightIcon,
    CategoriesText,
    CategoriesTableHeaderContainer,
    CategoriesTableRowContainer,
    ProgressContainer,
    ProgressShareContainer,
    Text,
    TrafficShareTopCategoriesContainer,
    CategoriesTableDomainContainer,
} from "../../pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";

const DomainColumnHeaderKey = "keyword.analysis.overview.topCategories.categories.column";
const TrafficShareColumnHeaderKey = "keyword.analysis.overview.topCategories.share.column";
const ColumnHeaderSize = 12;
const NA = "N/A";

const ArrowIcon = styled.div`
    position: absolute;
    right: -12px;
    top: 7px;
`;

export const KeywordAnalysisPageTopCategories = (props) => {
    const [selectedRow, setSelectedRow] = useState(0);
    const TrafficShare = (props) => {
        const { totalShare } = props;
        const isZeroShare = totalShare === 0;
        const width = totalShare ? totalShare * 100 : 0;
        const valuePercents = totalShare ? percentageFilter()(totalShare || 0, 2) + "%" : NA;
        return (
            <ProgressShareContainer>
                {!isZeroShare && (
                    <ProgressContainer>
                        <div className="swTable-progressBar">
                            <span className="min-value">{valuePercents}</span>
                            <div className="u-full-width">
                                {valuePercents !== NA && <ProgressBar width={width} />}
                            </div>
                        </div>
                    </ProgressContainer>
                )}
            </ProgressShareContainer>
        );
    };

    const onClick = (index, category) => {
        props.onClick(index);
        setSelectedRow(index);
        TrackWithGuidService.trackWithGuid("keywords.overview.page.top.categories", "click", {
            category,
        });
    };

    const TableRow = (row, index) => {
        const { Category: category, Share: share } = row;
        const splitCategory = category.split("~");
        const categoryToShow = splitCategory.length > 1 ? splitCategory[1] : splitCategory[0];
        return (
            <CategoriesTableRowContainer
                key={index}
                index={index}
                onClick={() => onClick(index, category)}
                selectedRow={selectedRow}
            >
                <CategoriesText>{categoryToShow.replace(/_/g, " ")}</CategoriesText>
                <TrafficShare totalShare={share} width={4} />
                {index === selectedRow && (
                    <ArrowIcon>
                        <SWReactIcons iconName="leftArrow-withBorder" size={"sm"} />
                    </ArrowIcon>
                )}
                {index !== selectedRow && (
                    <ArrowRightIcon>
                        <SWReactIcons iconName="arrow-right" size={"xs"} />
                    </ArrowRightIcon>
                )}
            </CategoriesTableRowContainer>
        );
    };

    const CategoriesTableInner = (props) => {
        const i18n = i18nFilter();
        const { CategoriesData } = props;
        return (
            <>
                <CategoriesTableHeaderContainer>
                    <CategoriesTableDomainContainer>
                        <Text fontSize={ColumnHeaderSize}>{i18n(DomainColumnHeaderKey)}</Text>
                    </CategoriesTableDomainContainer>
                    <TrafficShareTopCategoriesContainer>
                        <Text fontSize={ColumnHeaderSize}>{i18n(TrafficShareColumnHeaderKey)}</Text>
                    </TrafficShareTopCategoriesContainer>
                </CategoriesTableHeaderContainer>
                {CategoriesData.map(TableRow)}
            </>
        );
    };

    return (
        <div>
            <CategoriesTableInner CategoriesData={props.data} />
        </div>
    );
};
