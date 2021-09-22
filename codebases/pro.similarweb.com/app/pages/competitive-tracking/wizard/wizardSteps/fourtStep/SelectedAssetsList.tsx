import React, { FC, useMemo } from "react";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { ICountry } from "components/filters-bar/country-filter/CountryFilterTypes";
import { ICategory } from "common/services/categoryService.types";
import { SelectedAssetItem } from "./selectedAssets/SelectedAssetItem";
import { SelectedCountryItem } from "./selectedAssets/SelectedCountryItem";
import { SelectedIndustryItem } from "./selectedAssets/SelectedIndustryItem";
import { ITrackerAsset } from "components/SecondaryBar/NavBars/MarketResearch/NavBarSections/CompetitiveTracking/CompetitiveTrackingTypes";

interface ISelectedAssetsListProps {
    selectedMainAsset: ITrackerAsset;
    selectedCompetitors: ITrackerAsset[];
    amountOfCompetitorsToShow: number;

    selectedCountry: ICountry;
    selectedIndustry?: ICategory;
}

const ListContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
`;

const LineContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    max-width: 560px;
    flex-wrap: wrap;
`;

const SeparatorText = styled.span`
    color: ${colorsPalettes.carbon[400]};
    font-size: 13px;
    font-weight: 700;
    margin-right: 16px;
    margin-bottom: 16px;
`;

export const SelectedAssetsList: FC<ISelectedAssetsListProps> = (props) => {
    const {
        selectedMainAsset,
        selectedCompetitors,
        amountOfCompetitorsToShow,
        selectedCountry,
        selectedIndustry,
    } = props;

    const CompetitorsList = useMemo(() => {
        const competitorsToRender = selectedCompetitors.slice(0, amountOfCompetitorsToShow);
        return competitorsToRender.map((competitorAsset) => {
            return <SelectedAssetItem selectedAsset={competitorAsset} key={competitorAsset.id} />;
        });
    }, [selectedCompetitors]);

    const MoreCompetitorsText = useMemo(() => {
        const shouldRenderExtraCompetitors = selectedCompetitors.length > amountOfCompetitorsToShow;
        if (!shouldRenderExtraCompetitors) return null;

        const numberOfExtraCompetitors = selectedCompetitors.length - amountOfCompetitorsToShow;
        return <SeparatorText>{`+${numberOfExtraCompetitors} More`}</SeparatorText>;
    }, [selectedCompetitors]);

    return (
        <ListContainer>
            <LineContainer>
                <SelectedAssetItem selectedAsset={selectedMainAsset} />
                <SeparatorText>{"vs"}</SeparatorText>
                {CompetitorsList}
                {MoreCompetitorsText}
            </LineContainer>

            <LineContainer>
                <SelectedCountryItem selectedCountry={selectedCountry} />
                {selectedIndustry && <SelectedIndustryItem selectedIndustry={selectedIndustry} />}
            </LineContainer>
        </ListContainer>
    );
};
