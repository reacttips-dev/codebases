import styled from "styled-components";
import { setFont } from "@similarweb/styles/src/mixins";
import { RuleContainerBase } from "components/Rule/src/styledComponents";
import { colorsPalettes, rgba } from "@similarweb/styles";
import {
    BooleanSearchWrap,
    BooleanSearchInputWrap,
    Input,
} from "@similarweb/ui-components/dist/boolean-search";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import { TabPanel, TabList } from "@similarweb/ui-components/dist/tabs";
import { ButtonBase } from "@similarweb/ui-components/dist/button";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { SWReactIcons } from "@similarweb/icons";
import { SegmentUrlListItemContainer } from "pages/segments/wizard/SegmentRulesStep/SegmentUrlList/SegmentUrlListStyles";

export const DEFAULT_CHIPS_CONTAINER_HEIGHT = 152;

export const EditRuleContainer = styled(RuleContainerBase)`
    padding: 0px;
    box-shadow: 0 3px 6px 0 ${rgba(colorsPalettes.midnight[600], 0.08)};
    & > button {
        margin-left: 16px;
    }
`;

export const EditRuleDivider = styled.div`
    background-color: ${colorsPalettes.midnight["50"]};
    height: 1px;
    width: 100%;
    margin: 0;
`;

export const BooleanSearchContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const RuleTypesDropdownContainer = styled.div`
    display: inline-block;
    margin-left: 16px;
    width: auto;

    & div {
        font-size: 16px;
        color: ${colorsPalettes.carbon["500"]};
    }
`;

export const BooleanSearchWrapStyled = styled(BooleanSearchWrap).attrs((props) => ({
    marginLeft: props.marginLeft ?? "8px",
}))<{ marginLeft: string }>`
    border-bottom: 1px ${colorsPalettes.bluegrey[200]} solid;
    padding: 4px 0;
    min-height: 40px;
    margin-right: 24px;
    flex: auto;

    ${BooleanSearchInputWrap} {
        position: relative;
        margin-left: 8px;
        margin-right: ${({ marginLeft }) => marginLeft};
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        ${Input} {
            box-sizing: border-box;
            flex-grow: 1;
            flex-shrink: 0;
            flex-basis: 280px;
            width: initial;
        }
    }
`;

export const NoDataContainer = styled.div`
    padding: 20px;
    font-size: 16px;
`;

export const TextAlign = styled.div`
    text-align: center;
    margin-bottom: 8px;
`;

export const LockIcon = styled(SWReactIcons)`
    svg path {
        fill: ${(props: any) => (props.selected ? `${colorsPalettes.blue[400]}` : "initial")};
        fill-opacity: ${(props: any) => (props.selected ? 1 : 0.4)};
    }
    margin-right: 10px;
    margin-top: -2px;
`;

export const CheckBoxContainer = styled.div`
    padding: 8px 0px;
    border-top: 1px solid ${colorsPalettes.bluegrey[200]};
    &:first-child {
        border-top: 0px;
    }
    .folders {
        align-items: flex-start;
        label {
            font-size: 12px;
            overflow: hidden;
            word-break: break-all;
            margin: 2px 0;
        }
    }
`;

export const InlineInputSection = styled.div`
    position: absolute;
    top: 0;
    height: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    margin-left: 16px;

    .inlineButton {
        height: 100%;
        min-width: auto;
    }

    ${DotsLoader} {
        margin-left: 40px;
    }
`;

export const InputErrorMessage = styled.div`
    width: 100%;
    margin-left: 34px;
    color: ${colorsPalettes.red[400]};
    font-size: 12px;
    line-height: 16px;
`;

export const ChipPlaceholderLoaderWrapper = styled.span`
    border-radius: 16px;
    border-width: 0;
    padding: 0;
    display: inline-block;
    height: 32px;
    overflow: hidden;
    margin: 0 16px 16px 0;
    z-index: 999999;
    box-sizing: border-box;

    & > svg {
        box-sizing: border-box;
    }
`;

export const LoadersWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    height: 144px;
`; // The specific height is so we always show three rows of loaders

export const CloseIconWrapper = styled.span`
    cursor: pointer;
`;

export const PromptWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 16px 10px;
`;

export const ContentContainer = styled.div`
    flex-grow: 1;
    display: flex;
    padding: 0px;
    justify-content: center;
    ${TabPanel} {
        margin: 0 auto;
    }
    .react-tabs {
        width: 100%;
    }
`;

export const CompareContentContainer = styled.div`
    height: 430px;
    flex-grow: 1;
    display: flex;
    padding: 0px;
    justify-content: center;
    ${TabPanel} {
        margin: 0 auto;
    }
    .react-tabs {
        width: 100%;
    }
`;

export const TabsContainer = styled.div`
    background-color: ${colorsPalettes.carbon[0]};
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
    border-radius: 5px 5px 0px 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const TabListStyled = styled(TabList)`
    border-bottom: 0;
    z-index: 1;
    .firstTab,
    .secondTab {
        padding: 18px 24px;
    }
`;

export const TabUrlListContainer = styled.div`
    flex: auto;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: ${DEFAULT_CHIPS_CONTAINER_HEIGHT}px;

    .ScrollArea {
        padding: 0 !important;
    }

    ${SegmentUrlListItemContainer} {
        padding: 8px 16px;
        font-size: 12px;
        line-height: 14px;
        border-top: 1px solid ${colorsPalettes.bluegrey[200]};
    }
`;

export const TabMessageContainer = styled.div`
    font-size: 16px;
    color: ${colorsPalettes.carbon["500"]};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

export const DoneButtonContainer = styled.div`
    margin-left: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    & > ${ButtonBase} {
        margin: 4px;
        height: 36px !important;
    }
`;

export const RuleFooterDescription = styled.div`
    flex: auto;
    display: flex;
    align-items: center;
    padding: 0 8px;
    font-size: 14px;
    line-height: 18px;
    color: ${colorsPalettes.carbon["500"]};
`;

export const EditRuleFooter = styled(FlexRow)`
    padding: 8px 12px;
`;

export const TabInnerContentContainer = styled.div`
    padding: 0px 10px 0px 10px;
    position: relative;
`;

export const GradientWhiteTransparentCover = styled.div`
    height: 100%;
    position: absolute;
    z-index: 999;
    width: calc(100% - 20px);
    top: 0;
    background-image: linear-gradient(transparent, white);
`;

export const ImportFileBanner = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    margin-left: -10px;
    margin-right: -10px;
    border-left: 1px solid ${colorsPalettes.carbon[50]};
    border-right: 1px solid ${colorsPalettes.carbon[50]};
    background: ${colorsPalettes.bluegrey[100]};
`;

export const ImportFileBannerText = styled.div`
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
`;

export const ImportFileLink = styled.a`
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    line-height: 18px;
    font-weight: 700;

    .SWReactIcons {
        width: 1.2em;
        height: 1.2em;
        margin-right: 0.5em;
        transform: rotate(180deg);

        svg {
            &,
            & path {
                fill: ${colorsPalettes.blue[400]};
            }
        }
    }
`;

export const CustomStringsChipsRowContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    border-top: 1px solid ${colorsPalettes.midnight[50]};
    margin-left: -10px;
    margin-right: -10px;
    padding: 0 16px;
    height: 60px;
`;

export const CustomStringsChipsRowTitle = styled.div`
    flex: none;
    margin-right: 10px;
    font-size: 14px;
    line-height: 18px;
`;

export const CustomStringsChipsContainer = styled.div`
    flex: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    height: 40px;
    overflow: hidden;
`;

export const CustomStringsViewAllChipsLink = styled.a`
    cursor: pointer;
    font-size: 14px;
    line-height: 18px;
    font-weight: 700;
    white-space: nowrap;
`;

export const SpanInputMeasure = styled.span`
    ${setFont({ $size: 14 })};
    visibility: hidden;
    position: absolute;
    white-space: pre;
`;
