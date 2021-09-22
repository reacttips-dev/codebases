import { i18nFilter } from "filters/ngFilters";
import React, { FC } from "react";
import MultiChipDown from "components/MultiChipDown/src/MultiChipDown";
import { IAdNetworksFilter } from "pages/website-analysis/traffic-sources/display-ads/common/displayAdsTypes";
import { getInitialSelectedItemsIds } from "./FiltersHelper";

export const AdNetworksFilter: FC<IAdNetworksFilter> = (props) => {
    const { selectedAdNetworks, adNetworks, onAdNetworksFilterChange } = props;

    return (
        <MultiChipDown
            initialSelectedItems={getInitialSelectedItemsIds(selectedAdNetworks, adNetworks)}
            options={adNetworks}
            onDone={onAdNetworksFilterChange}
            buttonText={i18nFilter()("traffic.sources.display.ads.adnetworks.chipdown.text")}
            searchPlaceHolder={i18nFilter()(
                "traffic.sources.display.ads.adnetworks.chipdown.placeholder",
            )}
            hasSearch={true}
            dropdownWidth={320}
            isDisabled={!adNetworks || adNetworks.length === 0}
            clearSelectionWhenOneOption={false}
            virtualize={adNetworks?.length > 999 ? { itemBuffer: 50 } : null}
            maxVirtualItemsToRender={adNetworks?.length > 999 ? 1000 : null}
        />
    );
};
