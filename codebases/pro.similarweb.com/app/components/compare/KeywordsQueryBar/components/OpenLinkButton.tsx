import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { ButtonLinkContainer } from "../KeywordsQueryBarStyles";
import { KEYWORD_TOOLTIP } from "../constants";

export const OpenLinkButton = ({ googleLink }: { googleLink: string }) => {
    const translate = useTranslation();

    return (
        <PlainTooltip placement="bottom" tooltipContent={translate(KEYWORD_TOOLTIP)}>
            <ButtonLinkContainer href={googleLink} target="_blank">
                <IconButton type="flat" iconName="link-out" />
            </ButtonLinkContainer>
        </PlainTooltip>
    );
};
