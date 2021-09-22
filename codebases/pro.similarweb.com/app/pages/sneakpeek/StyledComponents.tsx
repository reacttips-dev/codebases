import { colorsPalettes, rgba } from "@similarweb/styles";
import { Box } from "@similarweb/ui-components/dist/box";
import { Switcher, TextSwitcherItem } from "@similarweb/ui-components/dist/switcher";
import { default as React, ReactElement } from "react";
import { StyledPrimaryTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import styled, { css } from "styled-components";
import {
    FlexColumn,
    FlexRow,
} from "../../../.pro-features/styled components/StyledFlex/src/StyledFlex";
import InfoTip from "../../components/React/Tooltip/PlainTooltip/InfoTip";
import { setFont } from "@similarweb/styles/src/mixins";

const TitleStyle = `${setFont({
    $color: colorsPalettes.carbon[500],
    $size: 20,
    $weight: 500,
    $family: "DM Sans",
})}`;
const SectionTitleStyle = `${setFont({
    $color: colorsPalettes.carbon[500],
    $size: 16,
    $weight: 500,
    $family: "DM Sans",
})}`;

export const BoxHeader = styled.div`
    height: 40px;
    margin-bottom: 24px;
    &:after {
        height: 1px;
        width: 100%;
        background: ${colorsPalettes.carbon[100]};
        position: absolute;
        top: 64px;
        left: 0;
        content: "";
    }
`;

export const BoxTitle = styled.div`
    ${TitleStyle};
`;

export const QueryFieldTitle = styled.div`
    ${SectionTitleStyle};
    margin-bottom: 8px;
`;

export const GranularitySwitcher: any = styled(Switcher)`
    align-items: flex-end;
    margin-right: 8px;
`;

export const FeedbackBox = styled(Box)`
    flex-grow: 1;
    min-width: 335px;
    position: relative;
    height: fit-content;
    border-radius: 6px;
    background-color: ${colorsPalettes.carbon[0]};
    box-shadow: 0 3px 6px 0 rgba(14, 30, 62, 0.08);
    padding: 24px;
    box-sizing: border-box;
    margin-bottom: 16px;
    margin-left: 16px;
`;

export const VisualizationBox = styled.div`
    display: flex;
    margin-bottom: 32px;
    flex-direction: column;
    ${TextSwitcherItem} {
        background: black;
    }
`;

export const VisualizationContent = styled.div`
    margin-top: 16px;
`;
export const TableMetaDataContainer = styled(FlexRow)`
    margin-bottom: 8px;
`;

export const QueryBox = styled(Box)`
    position: relative;
    flex-grow: 2;
    height: auto;
    width: 100%;
    border-radius: 4px;
    background-color: ${colorsPalettes.carbon[0]};
    box-shadow: 0 3px 6px 0 rgba(14, 30, 62, 0.08);
    padding: 24px;
    box-sizing: border-box;

    textarea {
        resize: none;
        height: 143px;
        width: 100%; //calc(100% - 45px);
        box-sizing: border-box;
        padding: 5px 16px;
        background-color: ${colorsPalettes.carbon[0]};
        font-size: 14px;
        color: ${colorsPalettes.carbon[400]};
        border: 1px solid ${colorsPalettes.midnight[50]};
        border-radius: 3px;
        letter-spacing: 0.2px;
        text-align: left;
        outline: 0;
        transition: background-color ease 300ms, border ease 300ms, box-shadow ease 300ms;
        &::placeholder {
            color: ${colorsPalettes.carbon[200]};
            font-size: 14px;
        }
        &:focus {
            box-shadow: 0 3px 5px 0 rgba(42, 62, 82, 0.12) !important;
            border: solid 1px ${colorsPalettes.carbon[100]};
        }
        &:disabled {
            background-color: rgba(234, 237, 240, 0.8);
            border: solid 1px rgba(209, 214, 221, 0.8);
            color: rgba(42, 62, 82, 0.35);
            &::placeholder {
                color: rgba(42, 62, 82, 0.35);
            }
        }
        &.SearchInput--error {
            background-color: ${colorsPalettes.carbon[0]};
            box-shadow: 0 3px 5px 0 rgba(152, 43, 43, 0.12) !important;
            border: solid 2px ${colorsPalettes.red[300]};
        }
    }
`;

export const Label = styled.div`
    font-size: 12px;
    height: auto;
    color: ${colorsPalettes.carbon[300]};
    letter-spacing: 0.2px;
    text-align: left;
    margin-bottom: 4px;
`;

export const GraphMetaContainer = styled.div`
    margin-top: 8px;
`;

export const Title = styled.div`
    height: 24px;
    font-size: 20px;
    font-weight: 500;
    text-align: left;
    display: flex;
    color: ${colorsPalettes.carbon["500"]};
    margin-bottom: 8px;
`;

export const QuerySqlWrapper = styled.div`
    padding: 5px 16px;
    background-color: ${colorsPalettes.bluegrey[100]};
    font-size: 14px;
    color: ${colorsPalettes.carbon[400]};
    border: 1px solid rgba(197, 204, 212, 0.6);
    letter-spacing: 0.2px;
    margin-top: -20px;
`;

export const editParamsCommon = css`
    font-weight: normal;
    color: #2b3d52;
`;

export const EditParamsTitle = styled.div`
    font-weight: 500;
    text-align: left;
    display: flex;
    color: ${colorsPalettes.carbon["500"]};
    margin: 8px 0;
    font-size: 18px;
    ${editParamsCommon}
`;

export const ParamLabel: any = styled.span.attrs<{ name: string }>(({ name }) => ({
    children: name.replace(/^@/, ""),
}))`
    ${editParamsCommon};
    font-size: 16px;
    display: inline-block;
    max-width: 130px;
    min-width: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
`;

export const ParamTypeLabel: any = styled.span.attrs<{ type: ReactElement }>(({ type }) => ({
    children: `(${type})`,
}))`
    ${editParamsCommon};
    font-size: 12px;
`;

export const ConfigureParamType = styled.div`
    margin: 0 8px 8px 0;
`;

export const DropdownWrapper = styled.div`
    width: 180px;
    .DropdownButton {
        height: 38px;
    }
`;

export const ParamsLabelContainer = styled.div<{ withMaxWidth?: boolean }>`
    flex-grow: 1;
    ${({ withMaxWidth }) =>
        withMaxWidth &&
        css`
            max-width: 130px;
        `}
    display: flex;
    align-items: center;
    transform: translateY(8px);
    margin-right: 8px;
`;

export const ParamDescription: any = styled.span.attrs<{ description: string }>(
    ({ description }) => ({
        children: description && <InfoTip text={description} />,
    }),
)`
    position: relative;
    left: 2px;
    top: 2px;
`;

export const RowsSection = styled(FlexColumn)`
    width: fit-content;
`;
export const RowContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const QueryContainer = styled.div`
    min-height: 388px;
    display: flex;
    flex-direction: column;
    background: ${colorsPalettes.carbon["0"]};
    margin-bottom: 32px;
    box-shadow: 0 3px 6px 0 rgba(14, 30, 62, 0.08);
    border-radius: 4px;
`;

export const QueryHeaderContainer = styled.div`
    height: 64px;
    border-bottom: 1px solid ${colorsPalettes.carbon[100]};
    align-items: center;
    padding: 0 24px;
    margin: 0;
    margin-bottom: 15px;
    display: flex;
`;

export const QueryTitle = styled.div`
    ${setFont({ $color: colorsPalettes.carbon[500], $size: 20, $weight: 500 })};
`;

export const QueryTitleActions = styled.div`
    margin-left: auto;
    display: flex;
    align-items: center;
    .SWReactIcons svg path {
        fill-opacity: 1;
    }
    > div {
        margin-left: 8px;
    }
`;

export const QueryContentContainer = styled.div`
    padding: 24px;
`;

export const InnerComponentContainer = styled.div`
    margin: 48px 0 16px;
`;

export const Separator = styled.div`
    height: 1px;
    width: 100%;
    background-color: ${colorsPalettes.blue[100]};
    margin: 8px auto 8px auto;
`;

export const ColumnGap = styled.div`
    margin-right: 8px;
`;

export const RowGap = styled.div`
    margin-bottom: 8px;
`;

export const Bullet = styled.div<{ color: string }>`
    background-color: ${({ color }) => color};
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 8px;
`;

export const GraphHeaderContainer = styled(FlexRow)`
    margin-bottom: 32px;
    padding-left: 24px;
`;

export const GraphTitle = styled.div<{ hasChildren: boolean }>`
    font-size: 16px;
    color: ${colorsPalettes.carbon[400]};
    height: 32px;
    ${({ hasChildren }) =>
        hasChildren &&
        css`
            box-shadow: 2px 2px 3px 3px ${rgba(colorsPalettes.carbon[400], 0.24)};
        `}
    border-radius: 16px;
    display: flex;
    align-items: center;
    padding: 8px;
`;

export const GraphTooltipTitle = styled.span`
    font-size: 14px;
`;

export const GraphTooltipSeriesName = styled.span`
    font-size: 12px;
    margin-right: 8px;
`;

export const GraphTooltipSeriesValue = styled.span`
    font-size: 12px;
`;

export const NoSelectedQueriesContainer = styled(FlexColumn)`
    height: 320px;
    background: ${colorsPalettes.bluegrey[200]};
    padding: 44px 0;
    border-radius: 6px;
    .SWReactIcons {
        width: 144px;
        height: 108px;
    }
`;
export const NoSelectedQueriesTitle = styled.div`
    ${setFont({ $size: 16, $color: colorsPalettes.carbon[500], $weight: 500 })};
`;

export const NoSelectedQueriesSubtitle = styled.div`
    ${setFont({ $size: 12, $color: colorsPalettes.carbon[300], $weight: 400 })};
`;

export const QueryBoxAndButtonsContainer = styled(FlexColumn)`
    flex-grow: 2;
    width: 100%;
`;

// feedback styles (query and results page)

export const Loader = styled.div`
    height: 20px;
    padding: 10px 40px;
`;

export const QuestionWrapper = styled.div`
     {
        margin-top: 24px;
    }
`;

export const QuestionLabel = styled.div`
    font-size: 16px;
    margin-bottom: 8px;
    height: auto;
    color: rgba(52, 70, 90, 0.6);
    letter-spacing: 0.2px;
    text-align: left;
`;

export const QuestionTextarea = styled.textarea`
    width: 100%;
    height: 100px;
`;

export const ModalTitle = styled.div`
    font-size: 17px;
    font-weight: 400;
    text-align: left;
    display: flex;
    color: ${colorsPalettes.carbon["500"]};
    margin-bottom: 5px;
`;

export const ModalHeader = styled.div`
    height: 24px;
    font-family: Roboto;
    font-size: 20px;
    text-align: left;
    background-color: ${colorsPalettes.blue["400"]};
    color: white;
    font-weight: lighter;
    letter-spacing: 0.03em;
    padding: 20px;
`;

export const ModalContainer = styled.div`
    padding: 20px;
`;

export const NoQuestionsAddedText = styled.span`
    font-size: 16px;
    text-align: center;
`;

export const FeedbackItemContainer = styled(FlexColumn)`
    width: 100%;
    border: 1px solid ${colorsPalettes.carbon[50]};
    box-sizing: border-box;
    border-radius: 6px;
    box-shadow: 0 3px 5px rgba(42, 62, 82, 0.12);
    padding: 8px 16px 24px;
    margin-bottom: 16px;
`;

export const FeedbackItemTitle = styled.span`
    font-size: 16px;
    font-weight: 500;
`;

export const TypeDropdownContainer = styled.div`
    width: 100%;
`;

// save query modal styles

export const SaveQueryModalContainer = styled.div`
    height: 100%;
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-template-rows: repeat(3, 33%);
    grid-template-areas: "title ." "input input" ". buttons";
`;

export const SaveQueryModalHeader = styled.div`
    grid-area: title;
`;
export const SaveQueryModalTitle = styled.div`
    ${TitleStyle};
`;
export const SaveQueryModalSubtitle = styled.div`
    ${setFont({ $color: colorsPalettes.carbon[400], $size: 13, $weight: 400, $family: "Roboto" })};
`;

export const SaveQueryModalInput = styled.div`
    grid-area: input;
`;

export const SaveQueryModalButtonsContainer = styled.div`
    grid-area: buttons;
    align-self: end;
    justify-self: end;
`;
