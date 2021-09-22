import { Box } from "@similarweb/ui-components/dist/box";
import { MiniFlexTable } from "@similarweb/ui-components/dist/mini-flex-table";
import { Title } from "@similarweb/ui-components/dist/title";
import * as React from "react";
import styled, { css } from "styled-components";
import { FlexColumn } from "../../../styled components/StyledFlex/src/StyledFlex";
import { Autocomplete } from "@similarweb/ui-components/dist/autocomplete";

const br0 = "620px";

export const AutocompleteStyled = styled(Autocomplete)<any>`
    height: 56px;
    & > div {
        background-color: white; //todo
    }
    .input-container {
        height: 56px;
    }

    width: 600px;
`;

export const ModuleStartPageContainer: any = styled(FlexColumn)`
    align-items: center;
    font-family: Roboto;
`;
ModuleStartPageContainer.displayName = "ModuleStartPageContainer";

export const StartPageTitle: any = styled(Title)`
    font-size: 30px;
    font-weight: 500;
    line-height: 34px;
    margin-top: 43px;
    margin-bottom: 40px;
`;
StartPageTitle.displayName = "StartPageTitle";

export const StyledInput: any = styled.input`
    height: 56px;
    width: 600px;
    box-sizing: border-box;
    border-radius: 3px;
    background-color: #ffffff;
    padding: 0 24px;
    font-size: 13px;
    border: solid 1px #eceef0;
    font-family: Roboto;
    :focus {
        border: 1px solid #4f8df9;
        box-shadow: 0 3px 4px 0 rgb(202, 202, 202);
        outline: none;
    }
    @media (max-width: ${br0}) {
        width: calc(100% - 20px);
    }
`;
StyledInput.displayName = "StyledInput";

export const StartPageBox: any = styled(Box)`
    width: 600px;
    height: auto;
    margin-top: 24px;
    min-height: 530px;
    @media (max-width: ${br0}) {
        width: calc(100% - 20px);
    }
`;

export const StyledStartPageBox = styled(StartPageBox)`
    position: relative;
`;
StartPageTitle.displayName = "StartPageTitle";

export const StartPageCell: any = styled.div`
    height: 71px;
    margin: 0 55px 0 47px;
    padding: 14px 0 14px 16px;
    box-sizing: border-box;
    border-bottom: 1px solid #e5e7ea;
    .MiniFlexTable-cell:last-child & {
        padding: 14px 0 14px 63px;
        margin: 0;
    }
    ${(props: any) =>
        props.isLast &&
        css`
            padding: 14px 0 14px 63px;
            margin: 0;
        `}
    .CoreAppCell-link {
        color: #2a3e52;
        font-family: Roboto;
        font-size: 14px;
        letter-spacing: 0.2px;
        text-decoration: none;
        font-weight: normal;
    }
`;

export const StyledMiniFlexTable: any = styled(MiniFlexTable)`
    position: static;
    .recent-analysis-col {
        width: 100%;
    }
`;

export const StartPageFlexTableContainer = styled.div`
    padding-top: 30px;
`;
