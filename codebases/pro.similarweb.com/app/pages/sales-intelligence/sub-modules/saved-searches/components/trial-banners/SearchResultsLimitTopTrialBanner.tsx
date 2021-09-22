import React from "react";
import { AssetsService } from "services/AssetsService";
import { Button } from "@similarweb/ui-components/dist/button";
import { useTranslation } from "components/WithTranslation/src/I18n";
import useUnlockModal from "custom-hooks/useUnlockModal";
import {
    StyledTopTrialBanner,
    StyledTopTrialBannerImage,
    StyledTopTrialBannerInfo,
    StyledTopTrialBannerTitle,
    StyledTopTrialBannerSubtitle,
    StyledTopTrialBannerButton,
} from "./styles";

type SearchResultsLimitTopTrialBannerProps = {
    resultsLimit: number;
};

const SearchResultsLimitTopTrialBanner = (props: SearchResultsLimitTopTrialBannerProps) => {
    const translate = useTranslation();
    const { resultsLimit } = props;
    const openModal = useUnlockModal("SourceLeads", "SourceLeads", "TrialBanner");

    return (
        <StyledTopTrialBanner data-automation="search-results-trial-banner-top">
            <StyledTopTrialBannerImage>
                <img
                    alt="trial-banner-image"
                    src={AssetsService.assetUrl("/images/lead-generator-hook-top.svg")}
                />
            </StyledTopTrialBannerImage>
            <StyledTopTrialBannerInfo>
                <StyledTopTrialBannerTitle>
                    {translate("si.components.search_results_trial_banner.message", {
                        numberOfLeads: resultsLimit,
                    })}
                </StyledTopTrialBannerTitle>
                <StyledTopTrialBannerSubtitle>
                    {translate("grow.lead_generator.wizard.step2.hook_top.text")}
                </StyledTopTrialBannerSubtitle>
            </StyledTopTrialBannerInfo>
            <StyledTopTrialBannerButton>
                <Button type="trial" onClick={openModal}>
                    {translate("grow.lead_generator.wizard.step2.hook_top.button")}
                </Button>
            </StyledTopTrialBannerButton>
        </StyledTopTrialBanner>
    );
};

export default React.memo(SearchResultsLimitTopTrialBanner);
