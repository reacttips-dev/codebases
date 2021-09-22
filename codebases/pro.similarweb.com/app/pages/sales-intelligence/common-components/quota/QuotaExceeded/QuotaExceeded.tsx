import React from "react";
import { AssetsService } from "services/AssetsService";
import {
    StyledQuotaExceededContainer,
    StyledQuotaExceededTitle,
    StyledQuotaExceededSubtitle,
    StyledQuotaExceededImageContainer,
} from "./styles";

type QuotaExceededProps = {
    title: string;
    subtitle: string;
    imagePath?: string;
    className?: string;
};

const QuotaExceeded = (props: QuotaExceededProps) => {
    const {
        title,
        subtitle,
        className,
        imagePath = "/images/sales-intelligence/insights-generator-unlock.svg",
    } = props;

    return (
        <StyledQuotaExceededContainer className={className}>
            <StyledQuotaExceededImageContainer>
                <img src={AssetsService.assetUrl(imagePath)} alt="unlock-insights-generator" />
            </StyledQuotaExceededImageContainer>
            <StyledQuotaExceededTitle>{title}</StyledQuotaExceededTitle>
            <StyledQuotaExceededSubtitle>{subtitle}</StyledQuotaExceededSubtitle>
        </StyledQuotaExceededContainer>
    );
};

export default QuotaExceeded;
