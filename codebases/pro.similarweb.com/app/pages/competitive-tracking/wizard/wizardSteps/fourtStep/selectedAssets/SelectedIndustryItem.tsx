import React, { FC } from "react";
import { ICategory } from "common/services/categoryService.types";
import { AssetIconWrapper, AssetTextWrapper, SelectedAssetContainer } from "./SelectedAssetStyles";
import { SWReactIcons } from "@similarweb/icons";

interface ISelectedIndustryItemProps {
    selectedIndustry: ICategory;
}

export const SelectedIndustryItem: FC<ISelectedIndustryItemProps> = ({ selectedIndustry }) => {
    return (
        <SelectedAssetContainer>
            <AssetIconWrapper>
                <SWReactIcons iconName={"market"} size={"xs"} />
            </AssetIconWrapper>
            <AssetTextWrapper>{selectedIndustry.text}</AssetTextWrapper>
        </SelectedAssetContainer>
    );
};
