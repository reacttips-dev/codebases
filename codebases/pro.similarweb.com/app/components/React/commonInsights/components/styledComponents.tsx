import styled from "styled-components";
import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import I18n from "components/WithTranslation/src/I18n";

export const InsightContainer = styled.a`
    height: 110px;
    min-width: 277px;
    border: 1px solid ${colorsPalettes.blue[400]};
    border-radius: 6px;
    padding: 14px 14px 9px 14px;
    background-color: ${colorsPalettes.sky[100]};
    display: flex;
    cursor: pointer;
`;

export const Icon = styled(SWReactIcons)`
    width: 22px;
    height: 21px;
    svg {
        path {
            fill: ${colorsPalettes.navigation.ICON_DARK};
        }
    }
`;

export const AnchorContainer = styled.div`
    align-self: flex-end;
`;

export const MainContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
`;

export const MainTextContainer = styled.div`
    ${setFont({ $size: 16, $color: colorsPalettes.carbon[500] })};
    padding-left: 12px;
    height: 70px;
`;

export const I18nStyled = styled(I18n)``;

export const SearchOverviewInsightsHeader = styled.h1`
    margin: 24px 0px 10px 0px;
    ${setFont({ $size: 24, $color: colorsPalettes.carbon[500] })};
`;
