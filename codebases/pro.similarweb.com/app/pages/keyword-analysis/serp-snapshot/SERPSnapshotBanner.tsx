import React from "react";
import { colorsPalettes } from "@similarweb/styles";

import { useTranslation } from "components/WithTranslation/src/I18n";
import { BannerContainer, StyledPill } from "pages/keyword-analysis/serp-snapshot/StyledComponents";

export const SERPSnapshotBanner: React.FC = (props) => {
    const translate = useTranslation();
    return (
        <BannerContainer>
            <StyledPill text="BETA" backgroundColor={colorsPalettes.mint[400]} />
            {translate("keywords.serp.banner")}
        </BannerContainer>
    );
};
