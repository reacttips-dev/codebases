import React, { FC } from "react";
import { AssetIconWrapper, AssetTextWrapper, SelectedAssetContainer } from "./SelectedAssetStyles";
import { ICountry } from "components/filters-bar/country-filter/CountryFilterTypes";
import { SWReactCountryIcons } from "@similarweb/icons";

interface ISelectedCountryItemProps {
    selectedCountry: ICountry;
}

export const SelectedCountryItem: FC<ISelectedCountryItemProps> = ({ selectedCountry }) => {
    return (
        <SelectedAssetContainer>
            <AssetIconWrapper>
                <SWReactCountryIcons countryCode={selectedCountry.id} size={"xs"} />
            </AssetIconWrapper>
            <AssetTextWrapper>{selectedCountry.text}</AssetTextWrapper>
        </SelectedAssetContainer>
    );
};
