import React from "react";
import { SimilarSiteType } from "../../types/similar-sites";
import { StyledSimilarSitesPanel, StyledSimilarSitesPanelContent } from "./styles";
import { BaseWebsiteType } from "pages/workspace/sales/sub-modules/benchmarks/types/common";
import SimilarSitesPanelContext from "../../contexts/SimilarSitesPanelContext";
import InnerPanelTransitioned from "../InnerPanelTransitioned/InnerPanelTransitioned";
import SimilarSitesPanelHeader from "../SimilarSitesPanelHeader/SimilarSitesPanelHeader";
import SimilarSitesPanelMain from "../SimilarSitesPanelMain/SimilarSitesPanelMain";
import SimilarSitesPanelFooterContainer from "../SimilarSitesPanelFooter/SimilarSitesPanelFooterContainer";
import SimilarSitesPanelCountriesContainer from "../SimilarSitesPanelCountries/SimilarSitesPanelCountriesContainer";

type SimilarSitesPanelProps = {
    applying: boolean;
    isPanelOpen: boolean;
    website: BaseWebsiteType | null;
    similarSites: SimilarSiteType[];
    selectedCountriesIds: number[];
    onApply(): void;
    onCancel(): void;
    onAddWebsite(website: BaseWebsiteType): void;
    onRemoveWebsite(domain: string): void;
};

const SimilarSitesPanel = (props: SimilarSitesPanelProps) => {
    const {
        isPanelOpen,
        website,
        applying,
        similarSites,
        onApply,
        onCancel,
        onAddWebsite,
        onRemoveWebsite,
        selectedCountriesIds,
    } = props;

    return (
        <InnerPanelTransitioned in={isPanelOpen} name="similar-sites-panel">
            <SimilarSitesPanelContext.Provider
                value={{
                    applying,
                    similarSites,
                    selectedCountriesIds,
                    cancel: onCancel,
                    applySelection: onApply,
                    addWebsite: onAddWebsite,
                    removeWebsite: onRemoveWebsite,
                }}
            >
                <StyledSimilarSitesPanel>
                    <SimilarSitesPanelHeader domain={website?.domain} />
                    <StyledSimilarSitesPanelContent>
                        <SimilarSitesPanelCountriesContainer />
                        <SimilarSitesPanelMain similarSites={similarSites} />
                    </StyledSimilarSitesPanelContent>
                    <SimilarSitesPanelFooterContainer />
                </StyledSimilarSitesPanel>
            </SimilarSitesPanelContext.Provider>
        </InnerPanelTransitioned>
    );
};

export default SimilarSitesPanel;
