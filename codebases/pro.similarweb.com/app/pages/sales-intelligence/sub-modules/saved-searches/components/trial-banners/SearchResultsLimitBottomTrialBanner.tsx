import React from "react";
import { AssetsService } from "services/AssetsService";
import { Button } from "@similarweb/ui-components/dist/button";
import { useTranslation } from "components/WithTranslation/src/I18n";
import useUnlockModal from "custom-hooks/useUnlockModal";
import {
    StyledBottomTrialBanner,
    StyledBottomTrialBannerImage,
    StyledTopTrialBannerInfo,
    StyledBottomTrialBannerTitle,
    StyledTopTrialBannerSubtitle,
    StyledTopTrialBannerButton,
} from "./styles";

type SearchResultsLimitBottomTrialBannerProps = {
    resultsLimit: number;
};

const SearchResultsLimitBottomTrialBanner = (props: SearchResultsLimitBottomTrialBannerProps) => {
    const translate = useTranslation();
    const { resultsLimit } = props;
    const openModal = useUnlockModal("SourceLeads", "SourceLeads", "TrialBanner");

    return (
        <StyledBottomTrialBanner data-automation="search-results-trial-banner-bottom">
            <StyledBottomTrialBannerImage>
                <img
                    alt="trial-banner-image"
                    src={AssetsService.assetUrl("/images/lead-generator-hook-bottom.svg")}
                />
            </StyledBottomTrialBannerImage>
            <StyledTopTrialBannerInfo>
                <StyledBottomTrialBannerTitle>
                    {translate("grow.lead_generator.wizard.step2.hook_bottom.title")}
                </StyledBottomTrialBannerTitle>
                <StyledTopTrialBannerSubtitle>
                    {translate("si.components.search_results_trial_banner.message", {
                        numberOfLeads: resultsLimit,
                    })}
                    <br />
                    {translate("si.components.search_results_trial_banner.bottom.subtitle_upgrade")}
                </StyledTopTrialBannerSubtitle>
            </StyledTopTrialBannerInfo>
            <StyledTopTrialBannerButton>
                <Button type="trial" onClick={openModal}>
                    {translate("grow.lead_generator.wizard.step2.hook_bottom.button")}
                </Button>
            </StyledTopTrialBannerButton>
        </StyledBottomTrialBanner>
    );
};

export default React.memo(SearchResultsLimitBottomTrialBanner);
