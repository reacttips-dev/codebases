import * as React from "react";
import AudienceInterestsSection from "./audience interests section/AudienceInterestsSection";
import DownloadsSection from "./downloads section/DownloadsSection";
import HeaderSection from "./header section/HeaderSection";
import StoreIntellegenceSection from "./store intellegence section/StoreIntellegenceSection";
import UsageSection from "./usage section/UsageSection";

const SingleMode: any = ({
    loading,
    data,
    isPropertyTracked,
    onAppTrack,
    websiteTooltipComponent,
    hideStoreSection,
    showStoreSearchLink,
}) => {
    const { header, downloads, audienceInterests } = data;
    return [
        <HeaderSection
            key="hs"
            loading={loading}
            data={header}
            isPropertyTracked={isPropertyTracked}
            onAppTrack={onAppTrack}
            websiteTooltipComponent={websiteTooltipComponent}
        />,
        hideStoreSection ? null : (
            <StoreIntellegenceSection
                key="sis"
                loading={loading}
                data={data}
                showStoreSearchLink={showStoreSearchLink}
            />
        ),
        <DownloadsSection key="ds" loading={loading} data={downloads} />,
        <UsageSection key="us" loading={loading} data={data} />,
        <AudienceInterestsSection key="ais" loading={loading} data={audienceInterests} />,
    ];
};
SingleMode.displayName = "SingleMode";
export default SingleMode;
