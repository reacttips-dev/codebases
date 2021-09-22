import React from "react";
import { Button } from "@similarweb/ui-components/dist/button";
import { useTranslation } from "components/WithTranslation/src/I18n";
import {
    StyledFooterButton,
    StyledSimilarSitesPanelFooter,
    StyledSimilarSitesPanelFooterInner,
} from "./styles";

type SimilarSitesPanelFooterProps = {
    isLoading: boolean;
    isDisabled: boolean;
    onApply(): void;
    onCancel(): void;
};

const SimilarSitesPanelFooter = (props: SimilarSitesPanelFooterProps) => {
    const translate = useTranslation();
    const { isLoading, isDisabled, onCancel, onApply } = props;

    return (
        <StyledSimilarSitesPanelFooter>
            <StyledSimilarSitesPanelFooterInner>
                <StyledFooterButton>
                    <Button
                        type="flat"
                        onClick={onCancel}
                        dataAutomation="si-similar-sites-panel-button-cancel"
                    >
                        {translate("si.common.button.cancel")}
                    </Button>
                </StyledFooterButton>
                <StyledFooterButton>
                    <Button
                        type="primary"
                        onClick={onApply}
                        isLoading={isLoading}
                        isDisabled={isDisabled}
                        dataAutomation="si-similar-sites-panel-button-apply"
                    >
                        {translate("si.common.button.apply")}
                    </Button>
                </StyledFooterButton>
            </StyledSimilarSitesPanelFooterInner>
        </StyledSimilarSitesPanelFooter>
    );
};

export default SimilarSitesPanelFooter;
