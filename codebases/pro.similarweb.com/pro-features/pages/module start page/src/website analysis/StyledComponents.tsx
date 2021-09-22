import * as React from "react";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import styled, { css } from "styled-components";
import { StartPageCell } from "../StyledComponents";
import { colorsPalettes } from "@similarweb/styles";
import { $robotoFontFamily } from "@similarweb/styles/src/fonts";
import { setFont } from "@similarweb/styles/src/mixins";

export const Example: any = styled.div`
    justify-content: center;
    align-items: center;
    font-family: Roboto;
`;
Example.displayName = "Example";

export const RecentStartPage = styled(StartPageCell)`
    padding: 14px 0 14px 16px;
    ${(props: any) =>
        props.isLast &&
        css`
            padding: 14px 0 14px 63px;
            margin: 0;
        `}
    .MiniFlexTable-cell:last-child & {
        padding: 14px 0 14px 63px;
    }
`;

export const RecentAppsStartPage = styled(RecentStartPage as any)`
    padding: 14px 0 14px 16px;
    .MiniFlexTable-cell:last-child & {
        padding: 14px 0 14px 63px;
    }
`;

export const StartPageCountryContainer = styled.div`
    height: 40px;
    & > div {
        border: 1px #eceef0 solid;
        border-radius: 3px;
    }
    margin-left: 5px;
    .CountryFilter-dropdownButton {
        ${setFont({ $size: 14, weight: 400, $color: colorsPalettes.midnight["500"] })};
    }
`;

export const StartPageWrapper = styled.div`
    background-color: ${colorsPalettes.carbon["0"]};
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    box-shadow: 0 3px 6px 0 rgba(14, 30, 62, 0.08);
    display: flex;
    flex-direction: column;
`;

export const StartPageAutoCompleteWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px 16px;
`;
export const StartPageInfoWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 16px;
    padding: 16px 16px 0;
`;

export const StartPageInfoText = styled.span`
    font-family: ${$robotoFontFamily};
    font-size: 12px;
    color: ${colorsPalettes.carbon["300"]};
    margin-left: 8px;
`;

export const StartPageFooter = styled.div`
    border-top: ${colorsPalettes.carbon["50"]} solid 1px;
    padding: 16px;
    justify-content: flex-end;
    display: flex;
`;
