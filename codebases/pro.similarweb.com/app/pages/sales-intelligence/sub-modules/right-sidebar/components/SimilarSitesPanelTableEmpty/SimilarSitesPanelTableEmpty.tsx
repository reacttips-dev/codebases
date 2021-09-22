import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { capitalize } from "pages/sales-intelligence/sub-modules/keyword-leads/utils";
import {
    StyledEmptyStateContainer,
    StyledImageContainer,
    StyledTitle,
    StyledDescription,
} from "./styles";

const SimilarSitesPanelTableEmpty = () => {
    const translate = useTranslation();
    const capitalizedButtonName = translate("si.sidebar.similar_sites.button.add")
        .split(" ")
        .map(capitalize)
        .join(" ");

    return (
        <StyledEmptyStateContainer>
            <StyledImageContainer>
                <SWReactIcons iconName="no-data-lab" />
            </StyledImageContainer>
            <StyledTitle>{translate("si.sidebar.similar_sites.empty.title")}</StyledTitle>
            <StyledDescription
                dangerouslySetInnerHTML={{
                    __html: translate("si.sidebar.similar_sites.empty.description", {
                        buttonName: `+ ${capitalizedButtonName}`,
                    }),
                }}
            />
        </StyledEmptyStateContainer>
    );
};

export default SimilarSitesPanelTableEmpty;
