import React from "react";
import { StyledRootLoader, StyledBottomSection } from "../RootLoader/styles";
import { AssetsService } from "services/AssetsService";
import { useTranslation } from "components/WithTranslation/src/I18n";
import {
    StyledDescriptionContainer,
    StyledImageContainer,
    StyledTopSection,
} from "pages/sales-intelligence/sub-modules/right-sidebar/components/NoCompetitorsFound/styles";
import { StyledMainMessage, StyledSubMessage } from "./styles";

type EmptyStateProps = {
    mainMessage: string;
    subMessage: string;
};

export const EmptyState = ({ mainMessage = "", subMessage = "" }: EmptyStateProps) => {
    const translate = useTranslation();
    return (
        <StyledRootLoader>
            <StyledTopSection>
                <StyledImageContainer>
                    <img
                        alt="insights-generator"
                        src={AssetsService.assetUrl(
                            "/images/sales-intelligence/insights-generator-illustration.svg",
                        )}
                    />
                </StyledImageContainer>
                <StyledDescriptionContainer>
                    <p
                        dangerouslySetInnerHTML={{
                            __html: translate("si.insights.empty.sentence.0"),
                        }}
                    />
                    <p
                        dangerouslySetInnerHTML={{
                            __html: translate("si.insights.empty.sentence.1"),
                        }}
                    />
                </StyledDescriptionContainer>
            </StyledTopSection>
            <StyledBottomSection>
                <StyledMainMessage>{translate(mainMessage)}</StyledMainMessage>
                <StyledSubMessage>{translate(subMessage)}</StyledSubMessage>
            </StyledBottomSection>
        </StyledRootLoader>
    );
};
