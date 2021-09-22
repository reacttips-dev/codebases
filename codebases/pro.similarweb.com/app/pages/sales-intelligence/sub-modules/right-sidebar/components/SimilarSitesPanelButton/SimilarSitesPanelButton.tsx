import React from "react";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { StyledToggleButtonContainer, StyledText, StyledButton } from "./styles";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { getSingularOrPluralKey } from "pages/sales-intelligence/helpers/helpers";

type SimilarSitesPanelButtonProps = {
    numberOfSites: number;
    isLoading: boolean;
    onClick(): void;
    domain: string;
};

export const SimilarSitesPanelButton = ({
    isLoading,
    numberOfSites,
    onClick,
    domain,
}: SimilarSitesPanelButtonProps) => {
    const translate = useTranslation();
    const getTranslationKey = getSingularOrPluralKey("si.common.number_of_sites");

    if (isLoading) {
        return <PixelPlaceholderLoader width={70} height={9} />;
    }

    return (
        <StyledToggleButtonContainer>
            <StyledText>{`${translate(
                "workspace.sales.benchmarks.helperText1",
            )} ${domain} ${translate("workspace.sales.benchmarks.helperText2")} `}</StyledText>
            <StyledButton
                onClick={onClick}
                data-automation="si-insights-toolbar-competitors-button"
            >
                &nbsp;
                {translate(getTranslationKey(numberOfSites), {
                    numberOfWebsites: numberOfSites,
                })}
            </StyledButton>
        </StyledToggleButtonContainer>
    );
};
