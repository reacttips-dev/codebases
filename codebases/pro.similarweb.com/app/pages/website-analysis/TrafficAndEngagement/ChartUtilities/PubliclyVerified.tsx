import { colorsPalettes } from "@similarweb/styles";
import {
    StyledFlexRow,
    StyledSWReactIcons,
} from "pages/website-analysis/TrafficAndEngagement/Components/StyledComponents";
import { Text } from "pages/website-analysis/TrafficAndEngagement/Components/StyledComponents";
import { i18nFilter } from "filters/ngFilters";
import React from "react";

export const PubliclyVerified = () => {
    const i18n = i18nFilter();
    const publiclyVerifiedColor = colorsPalettes.green.s100;
    return (
        <StyledFlexRow>
            <StyledSWReactIcons size={"xs"} iconName={"checked"} color={publiclyVerifiedColor} />
            <Text color={publiclyVerifiedColor} size={16}>
                {i18n("analysis.ga.badge.verified.publicly")}
            </Text>
        </StyledFlexRow>
    );
};
