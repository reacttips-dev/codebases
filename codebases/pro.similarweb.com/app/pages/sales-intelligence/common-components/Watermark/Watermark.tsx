import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import * as s from "./styles";
import { IconSidebarLogoItem } from "@similarweb/ui-components/dist/icon-sidebar";

const Watermark = () => {
    const translate = useTranslation();

    return (
        <s.StyledWatermark>
            <s.StyledTitle>{translate("si.common.logo.prefix")}</s.StyledTitle>
            <s.StyledWatermarkIcons>
                <IconSidebarLogoItem />
            </s.StyledWatermarkIcons>
        </s.StyledWatermark>
    );
};

export default Watermark;
