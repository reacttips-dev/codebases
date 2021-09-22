import { FC } from "react";
import { IPublishersFilter } from "pages/website-analysis/traffic-sources/display-ads/common/displayAdsTypes";
import MultiChipDown from "components/MultiChipDown/src/MultiChipDown";
import { i18nFilter } from "filters/ngFilters";
import { getInitialSelectedItemsIds } from "pages/website-analysis/traffic-sources/display-ads/common/filters/FiltersHelper";

export const PublishersFilter: FC<IPublishersFilter> = (props) => {
    const { selectedPublishers, publishers, onPublishersFilterChange } = props;

    return (
        <MultiChipDown
            initialSelectedItems={getInitialSelectedItemsIds(selectedPublishers, publishers)}
            options={publishers}
            onDone={onPublishersFilterChange}
            buttonText={i18nFilter()("traffic.sources.display.ads.publishers.chipdown.text")}
            searchPlaceHolder={i18nFilter()(
                "traffic.sources.display.ads.campaigns.publishers.placeholder",
            )}
            hasSearch={true}
            dropdownWidth={320}
            isDisabled={!publishers || publishers.length === 0}
            virtualize={publishers?.length > 999 ? { itemBuffer: 50 } : null}
            maxVirtualItemsToRender={publishers?.length > 999 ? 1000 : null}
            clearSelectionWhenOneOption={false}
        />
    );
};
