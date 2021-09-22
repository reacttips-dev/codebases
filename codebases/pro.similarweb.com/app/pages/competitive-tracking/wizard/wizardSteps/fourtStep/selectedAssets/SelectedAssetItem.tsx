import React, { FC, useMemo } from "react";
import { assetsIcon } from "pages/competitive-tracking/wizard/CompetitiveTrackingWizardTypes";
import { SWReactIcons } from "@similarweb/icons";
import { AssetIconWrapper, AssetTextWrapper, SelectedAssetContainer } from "./SelectedAssetStyles";
import { ITrackerAsset } from "components/SecondaryBar/NavBars/MarketResearch/NavBarSections/CompetitiveTracking/CompetitiveTrackingTypes";

interface ISelectedAssetItemProps {
    selectedAsset: Pick<ITrackerAsset, "type" | "displayText">;
}

export const SelectedAssetItem: FC<ISelectedAssetItemProps> = ({ selectedAsset }) => {
    const iconName = useMemo(() => {
        return assetsIcon[selectedAsset.type] ?? "alert-circle";
    }, [selectedAsset]);
    return <SelectedAssetItemView displayText={selectedAsset.displayText} iconName={iconName} />;
};

export const SelectedAssetItemView = ({
    iconName,
    displayText,
}: {
    iconName: string;
    displayText: string | number;
}) => {
    return (
        <SelectedAssetContainer>
            <AssetIconWrapper>
                <SWReactIcons iconName={iconName} size={"xs"} />
            </AssetIconWrapper>
            <AssetTextWrapper>{displayText}</AssetTextWrapper>
        </SelectedAssetContainer>
    );
};
