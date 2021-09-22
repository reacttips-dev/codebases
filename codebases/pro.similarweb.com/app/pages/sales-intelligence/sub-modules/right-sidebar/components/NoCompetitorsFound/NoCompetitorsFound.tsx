import React from "react";
import { Button } from "@similarweb/ui-components/dist/button";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { AssetsService } from "services/AssetsService";
import {
    StyledTipText,
    StyledTopSection,
    StyledBottomSection,
    StyledImageContainer,
    StyledButtonContainer,
    StyledButtonDescription,
    StyledDescriptionContainer,
    StyledNoCompetitorsContainer,
} from "./styles";

type NoCompetitorsFoundProps = {
    domain: string;
    onDefineCompetitorsClick(): void;
};

const NoCompetitorsFound = (props: NoCompetitorsFoundProps) => {
    const translate = useTranslation();
    const { domain, onDefineCompetitorsClick } = props;

    return (
        <StyledNoCompetitorsContainer>
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
                <StyledButtonDescription>
                    {translate("si.insights.empty.description", {
                        prospectDomain: domain,
                    })}
                </StyledButtonDescription>
                <StyledButtonContainer>
                    <Button
                        type="primary"
                        onClick={onDefineCompetitorsClick}
                        data-automation="si-insights-empty-state-button"
                    >
                        {translate("si.insights.empty.button.text")}
                    </Button>
                </StyledButtonContainer>
                <StyledTipText>{translate("si.insights.empty.tip")}</StyledTipText>
            </StyledBottomSection>
        </StyledNoCompetitorsContainer>
    );
};

export default NoCompetitorsFound;
