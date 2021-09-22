import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import styled from "styled-components";

export const StyledSaveSearchBtnWrapper = styled.div`
    margin-top: 15px;
`;

export const StyledSaveSearchBtnBox = styled.div`
    margin-top: 0px;
`;

export const StyledSaveSearchActionsWrapper = styled.div`
    align-items: center;
    display: flex;
`;

export const StyledSaveSearchLastUpdateWrapper = styled.div`
    ${setFont({ $size: 14, $color: colorsPalettes.carbon[500], $weight: "normal" })};
    line-height: 1.71;
    margin-right: 40px;
`;

export const StyledSaveSearchAutoRerunWrapper = styled.div`
    display: flex;
    flex-direction: row;
    margin: 0px 40px 0px 40px;
`;

export const StyledSaveSearchAutoRerunText = styled.span`
    ${setFont({ $size: 14, $color: colorsPalettes.blue[400], $weight: "normal" })};
    cursor: default;
    line-height: 1.71;
    margin-right: 11px;
`;

export const StyledSaveSearchSettingIconWrapper = styled.div`
    margin-left: 30px;
`;

export const StyledAutoRerunTooltipTitle = styled.div`
    ${setFont({ $size: 16, $weight: 500 })};
    margin-top: 3px;
`;

export const StyledAutoRerunTooltipDescription = styled.div`
    margin-top: 3px;
`;
