import { colorsPalettes, rgba } from "@similarweb/styles";
import { respondTo } from "@similarweb/styles/src/mixins";
import { Button, IconButton } from "@similarweb/ui-components/dist/button";
import styled, { css } from "styled-components";
import { LeadGeneratorSubtitleWrapper } from "../../lead-generator-exist/components/elements";

export const ReportResultsWrapper = styled.div`
    max-width: calc(100% - 96px);
    flex-grow: 1;
    ${respondTo(
        "mediumScreen",
        css`
            width: 1027px;
        `,
    )};
    ${respondTo(
        "desktop",
        css`
            width: 932px;
        `,
    )};
    margin: 0 48px 80px;
    ${LeadGeneratorSubtitleWrapper} {
        margin-bottom: 8px;
    }
`;

export const ReportResultsTitle = styled.div`
    font-size: 24px;
    margin: 24px 0 24px;
`;

export const HeaderContainer = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
`;

export const ReportResultsWarning = styled(LeadGeneratorSubtitleWrapper)`
    color: ${colorsPalettes.carbon[500]};
    font-size: 14px;
    font-weight: 500;
    justify-content: flex-start;
    .SWReactIcons {
        margin-right: 4px;
        svg path {
            fill: ${colorsPalettes.carbon[500]};
        }
    }
`;

export const ReportTableTopWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 64px;
    margin: 0 8px;
    .SearchInput-container {
        flex-grow: 1;
        > input {
            background-color: transparent;
            border: 1px solid transparent;
            box-shadow: none;
            margin-bottom: 0;
            font-size: 16px;
        }
    }
`;

export const NewResultsWrapper = styled.div`
    margin: 0 10px 0 10px;
`;

export const ExcludeResultsWrapper = styled.div`
    margin: 0 10px 0 10px;
`;
export const AddButton = styled(IconButton)`
    background-color: ${colorsPalettes.carbon[0]};
`;

export const StyledTopHook = styled.div`
    display: flex;
    align-items: center;
    padding: 24px 28px;
    background: #e9eef4;
    border-radius: 6px;
`;

export const StyledTopHookImageWrapper = styled.div`
    margin-right: 16px;
`;

export const StyledTopHookInfo = styled.div`
    color: ${colorsPalettes.carbon[500]};
    font-size: 1rem;
    line-height: 24px;
    margin-right: 16px;
`;

export const StyledTopHookTitle = styled.strong`
    display: block;
    font-weight: 700;
`;

export const StyledTopHookButton = styled(Button)`
    padding-right: 24px;
    padding-left: 24px;
    margin-left: auto;
    margin-right: 12px;
`;

export const StyledBottomHook = styled.div`
    display: flex;
    align-items: center;
    padding: 24px 6.9% 32px;
    background: ${colorsPalettes.carbon[0]};
    border-radius: 0 0 6px 6px;
    box-shadow: 0 3px 6px 0 rgba(14, 30, 62, 0.08);
`;

export const StyledBottomHookImageWrapper = styled.div`
    margin-right: 6.6%;
`;

export const StyledBottomHookInfo = styled.div`
    max-width: 464px;
    margin-top: -20px;
    font-size: 0.875rem;
    color: ${colorsPalettes.carbon[500]};
`;

export const StyledBottomHookTitle = styled.h3`
    font-size: 1.875rem;
    font-weight: 700;
    margin-top: 0;
    margin-bottom: 0;
`;

export const StyledBottomHookText = styled.div`
    line-height: 1.57;
`;

export const StyledBottomHookButton = styled(Button)`
    padding-right: 24px;
    padding-left: 24px;
    margin-left: auto;
    margin-right: 2.1%;
`;

export const QuotaWrapper = styled.div`
    margin-top: 15px;
`;

export const StyledCellContainer = styled.div`
    &:hover {
        cursor: pointer;
    }
`;
