import React from "react";
import { Button } from "@similarweb/ui-components/dist/button";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { BENCHMARKS_PROSPECT_QUOTA_THRESHOLD } from "../../constants";
import { AssetsService } from "services/AssetsService";
import {
    StyledGeneratorQuota,
    StyledGeneratorQuotaTitle,
    StyledGeneratorQuotaText,
    StyledGeneratorQuotaContent,
    StyledGeneratorQuotaRemainingText,
    StyledGeneratorQuotaImageContainer,
    StyledGeneratorQuotaTextContainer,
    StyledQuotaButtonContainer,
} from "./styles";

type GeneratorQuotaProps = {
    text?: string;
    title?: string;
    imagePath?: string;
    remainingViews?: number;
    onContinueClick?(): void;
    renderImage?(): React.ReactNode;
};

const GeneratorQuota = (props: GeneratorQuotaProps) => {
    const translate = useTranslation();
    const {
        title = translate("si.insights.quota.title"),
        text = translate("si.insights.quota.prospect.text"),
        imagePath = "/images/sales-intelligence/insights-generator-illustration.svg",
        remainingViews,
        onContinueClick,
        renderImage,
    } = props;

    const renderQuotaImage = () => {
        if (typeof renderImage === "function") {
            return renderImage();
        }

        return <img src={AssetsService.assetUrl(imagePath)} alt="quota-illustration" />;
    };

    return (
        <StyledGeneratorQuota>
            <StyledGeneratorQuotaTitle>{title}</StyledGeneratorQuotaTitle>
            <StyledGeneratorQuotaContent>
                <StyledGeneratorQuotaImageContainer>
                    {renderQuotaImage()}
                </StyledGeneratorQuotaImageContainer>
                <StyledGeneratorQuotaTextContainer>
                    <StyledGeneratorQuotaText>{text}</StyledGeneratorQuotaText>
                    {typeof onContinueClick === "function" && (
                        <StyledQuotaButtonContainer>
                            <Button
                                type="primary"
                                onClick={onContinueClick}
                                dataAutomation="insights-generator-quota-show-button"
                            >
                                {translate("si.insights.quota.button.show")}
                            </Button>
                            {typeof remainingViews === "number" && (
                                <StyledGeneratorQuotaRemainingText
                                    isBold={remainingViews <= BENCHMARKS_PROSPECT_QUOTA_THRESHOLD}
                                >
                                    {translate("si.insights.quota.prospect.remaining.text", {
                                        numberOfViews: remainingViews,
                                    })}
                                </StyledGeneratorQuotaRemainingText>
                            )}
                        </StyledQuotaButtonContainer>
                    )}
                </StyledGeneratorQuotaTextContainer>
            </StyledGeneratorQuotaContent>
        </StyledGeneratorQuota>
    );
};

export default GeneratorQuota;
