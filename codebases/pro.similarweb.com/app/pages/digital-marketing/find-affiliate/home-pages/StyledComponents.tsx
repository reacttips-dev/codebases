import styled from "styled-components";
import { NoBorderTile } from "@similarweb/ui-components/dist/grouped-tiles";
import {
    StartPageAutoCompleteWrap,
    StartPageCountryContainer,
} from "pages/module start page/src/website analysis/StyledComponents";
import { colorsPalettes } from "@similarweb/styles";

export const IllustrationWrapper = styled.section`
    max-width: 1087px;
    margin: 40px auto 0;
`;

export const IllustrationContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 1000px;
    min-height: 280px;
    @media (max-width: 1440px) {
        width: auto;
    }
`;

export const NoBorderTileStyled = styled(NoBorderTile)<{ width?: number }>`
    height: 130px;
    width: ${({ width }) => (width ? width : 281)}px;
`;

export const LinkWrapper = styled.div`
    a {
        color: currentColor;
        text-decoration: underline;
        cursor: pointer;
    }
`;

export const StyledStartPageAutoCompleteWrap = styled(StartPageAutoCompleteWrap)`
    padding: 0 0 16px 0;
`;

export const StyledStartPageCountryContainer = styled(StartPageCountryContainer)`
    background-color: ${colorsPalettes.carbon[0]};
    margin-right: 8px;
    margin-left: 8px;
`;
