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
import { DomainsFilter } from "pages/website-analysis/traffic-sources/display-ads/common/filters/DomainFilter";

export const VideosFilters: FC<Partial<IDisplayAdsProps>> = (props) => {
    const {
        selectedCampaigns,
        campaigns,
        onCampaignsFilterChange,
        isCompare,
        selectedDomain,
        domains,
        onDomainFilterChange,
    } = props;

    return (
        <Filters data-automation="videos-filters">
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
                </InnerFilters>
            </FiltersGrow>
        </Filters>
    );
};
