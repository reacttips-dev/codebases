import React from "react";
import { StyledSimilarSitesPanelHeader, StyledSimilarSitesPanelTitle } from "./styles";
import { useTranslation } from "components/WithTranslation/src/I18n";

type SimilarSitesPanelHeaderProps = {
    domain: string;
};

const SimilarSitesPanelHeader = (props: SimilarSitesPanelHeaderProps) => {
    const translate = useTranslation();

    return (
        <StyledSimilarSitesPanelHeader>
            <StyledSimilarSitesPanelTitle>
                {translate("si.sidebar.similar_sites.title", {
                    prospectDomain: props.domain,
                })}
            </StyledSimilarSitesPanelTitle>
        </StyledSimilarSitesPanelHeader>
    );
};

export default SimilarSitesPanelHeader;
