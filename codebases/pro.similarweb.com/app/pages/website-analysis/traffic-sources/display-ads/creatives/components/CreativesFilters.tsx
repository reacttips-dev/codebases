import {
    Filter,
    Filters,
    FiltersGrow,
    InnerFilters,
    Separator,
} from "pages/website-analysis/traffic-sources/display-ads/common/StyledComponents";
import React, { FC } from "react";
import { IDisplayAdsProps } from "pages/website-analysis/traffic-sources/display-ads/common/displayAdsTypes";
import { CampaignsFilter } from "pages/website-analysis/traffic-sources/display-ads/common/filters/CampaignsFilter";
import { AdNetworksFilter } from "../../common/filters/AdNetworksFilter";
import { PublishersFilter } from "../../common/filters/PublishersFilter";
import { Button } from "@similarweb/ui-components/dist/button";
import { i18nFilter } from "filters/ngFilters";
import { DomainsFilter } from "pages/website-analysis/traffic-sources/display-ads/common/filters/DomainFilter";

export const CreativesFilters: FC<Partial<IDisplayAdsProps>> = (props) => {
    const {
        isClearAllDisabled,
        onClearAll,
        selectedCampaigns,
        campaigns,
        onCampaignsFilterChange,
        publishers,
        onPublishersFilterChange,
        adNetworks,
        onAdNetworksFilterChange,
        selectedAdNetworks,
        selectedPublishers,
        isCompare,
        selectedDomain,
        domains,
        onDomainFilterChange,
    } = props;

    return (
        <Filters data-automation="creatives-filters">
            <FiltersGrow>
                {isCompare && domains && (
                    <>
                        <Filter>
                            <DomainsFilter
                                selectedDomain={selectedDomain}
                                domains={domains}
                                onDomainFilterChange={onDomainFilterChange}
                            />
                        </Filter>
                        <Separator />
                    </>
                )}
                <InnerFilters>
                    <Filter>
                        <CampaignsFilter
                            selectedCampaigns={selectedCampaigns}
                            campaigns={campaigns}
                            onCampaignsFilterChange={onCampaignsFilterChange}
                        />
                    </Filter>
                    <Filter>
                        <PublishersFilter
                            publishers={publishers}
                            selectedPublishers={selectedPublishers}
                            onPublishersFilterChange={onPublishersFilterChange}
                        />
                    </Filter>
                    <Filter>
                        <AdNetworksFilter
                            onAdNetworksFilterChange={onAdNetworksFilterChange}
                            adNetworks={adNetworks}
                            selectedAdNetworks={selectedAdNetworks}
                        />
                    </Filter>
                </InnerFilters>
            </FiltersGrow>
            <Button type="flat" isDisabled={isClearAllDisabled} onClick={onClearAll}>
                {i18nFilter()("forms.buttons.clearall.text")}
            </Button>
        </Filters>
    );
};
