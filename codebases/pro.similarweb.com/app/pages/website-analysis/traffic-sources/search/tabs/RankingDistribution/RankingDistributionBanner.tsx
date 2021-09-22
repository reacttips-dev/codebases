import React from "react";
import styled from "styled-components";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { Pill } from "components/Pill/Pill";
import { useTranslation } from "components/WithTranslation/src/I18n";

const Container = styled(FlexRow)`
    background-color: ${colorsPalettes.yellow[100]};
    height: 44px;
    border-radius: 4px;
    align-items: center;
    padding: 0 12px;
    ${setFont({ $size: 14, $color: colorsPalettes.carbon[500] })};
    margin-bottom: 24px;
`;

const StyledPill = styled(Pill)`
    margin-right: 16px;
`;

export const RankingDistributionBanner: React.FC = (props) => {
    const translate = useTranslation();
    return (
        <Container>
            <StyledPill text="BETA" backgroundColor={colorsPalettes.mint[400]} />
            {translate("ranking.distribution.banner")}
        </Container>
    );
};
