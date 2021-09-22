import React from "react";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { IconButton } from "@similarweb/ui-components/dist/button";
import {
    LeadGeneratorBox,
    LeadGeneratorBoxTitle,
    LeadGeneratorTooltipWrapper,
} from "../../components/elements";
import { LeadGeneratorSubtitleBoxWrap } from "../../components/LeadGeneratorSubtitleBox";
import { LeadGeneratorDownloadIcon } from "../../lead-generator-exist/components/elements";

interface ILeadGeneratorAllWrapperProps {
    isEmptyState: boolean;
}

export const LeadGeneratorAllWrapper = styled.div<ILeadGeneratorAllWrapperProps>`
    width: ${({ isEmptyState }) => (isEmptyState ? "100%" : "840px")};
    max-width: 1390px;
`;
LeadGeneratorAllWrapper.displayName = "LeadGeneratorAllWrapper";

export const LeadGeneratorAllHeader = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 56px 0.7em 0;
`;
LeadGeneratorAllHeader.displayName = "LeadGeneratorAllHeader";

export const LeadGeneratorAllBox = styled(LeadGeneratorBox)`
    padding: 0;
    margin: 24px 0;
`;
LeadGeneratorAllBox.displayName = "LeadGeneratorAllBox";

interface IToggleBoxContainerProps {
    isOpen: boolean;
}

export const ToggleBoxContainer = styled.span<IToggleBoxContainerProps>`
    float: left;
    margin-left: -8px;
    transition: all 0.2s ease-out;
    transform: ${({ isOpen }) => (isOpen ? "rotate(90deg)" : "rotate(0deg)")};

    .SWReactIcons svg {
        width: 24px;
        height: 24px;
    }
`;
ToggleBoxContainer.displayName = "ToggleBoxContainer";

export interface ITitleContainerProps {
    newDataAvailable: boolean;
}

export const TitleContainer = styled.div<ITitleContainerProps>`
    display: flex;
    align-items: center;
    flex-grow: 1;
    max-width: 75%;
    margin-right: 16px;

    svg {
        height: 29px;
    }

    ${LeadGeneratorTooltipWrapper} {
        margin: 0;
        width: ${({ newDataAvailable }) => (newDataAvailable ? "85%" : "100%")};
    }

    ${LeadGeneratorBoxTitle} {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        display: inline-block;
        vertical-align: bottom;
        margin-bottom: 0;
    }
`;
TitleContainer.displayName = "TitleContainer";

export const NewDataLabel = styled.span.attrs(() => ({
    "data-automation": "new-data-label",
}))`
    letter-spacing: 0.6px;
    font-weight: 500;
    font-size: 9px;
    line-height: 10px;
    border-radius: 10px;
    text-transform: uppercase;
    color: #ffffff;
    background-color: #f58512;
    padding: 4px 6px;
    align-items: center;
    display: flex;
    height: fit-content;
    margin: 0 0 4px 12px;
`;
NewDataLabel.displayName = "NewDataLabel";

export const RunsBoxHeader = styled.div`
    display: flex;
    flex-direction: column;
    padding: 30px 30px 10px;

    ${LeadGeneratorSubtitleBoxWrap} {
        margin-left: 4px;
        width: 95%;
    }
`;
RunsBoxHeader.displayName = "RunsBoxHeader";

export const RunsBoxHeaderTitle = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    padding-bottom: 12px;
    align-items: center;
`;
RunsBoxHeaderTitle.displayName = "RunsBoxHeaderTitle";

export const RunsBoxHeaderSubtitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 4px;
    padding: 4px 20px 4px 0;
    margin-left: 20px;
    transition: all 0.25s ease-out;

    .SWReactIcons {
        transition: all 0.25s ease-out;
        opacity: 0;
        margin-bottom: -4px;
        svg {
            width: 24px;
            height: 24px;
        }
    }

    :hover {
        background-color: rgba(42, 62, 82, 0.08);
        .SWReactIcons {
            opacity: 1;
            cursor: pointer;
        }
    }
`;

export interface IRunsTableContentProps {
    length: number;
}

export const RunsTableContent = styled.div<IRunsTableContentProps>`
    height: ${({ length }) => `${50 * (length + 1)}px`};

    .MiniFlexTable {
        padding-bottom: 0;
    }
`;
RunsTableContent.displayName = "RunsTableContent";

export const RunsTableFooter = styled.div.attrs(() => ({
    "data-automation": "runs-table-footer",
}))`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 50px;
    margin-right: 4px;

    span {
        margin-right: 8px;
        font-size: 12px;
        color: rgba(42, 62, 82, 0.6);
    }

    .SWReactIcons svg {
        width: 24px;
        height: 24px;
    }
`;
RunsTableFooter.displayName = "RunsTableFooter";

export const RunsTableCell = styled.div`
    display: flex;
    align-items: center;
    height: 50px;
    border-bottom: 1px solid ${colorsPalettes.carbon["50"]};
    padding: 0 30px;
    font-size: 14px;
    font-weight: 400;
`;
RunsTableCell.displayName = "RunsTableCell";

export const ChangeTableCell = styled(RunsTableCell)`
    padding-right: 0;

    span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;
ChangeTableCell.displayName = "ChangeTableCell";

export const FirstRunsTableCell = styled(RunsTableCell)`
    padding: 0 30px 0 60px;
`;
FirstRunsTableCell.displayName = "FirstRunsTableCell";

export const RunsTableCellButton = styled(RunsTableCell)`
    justify-content: center;
    padding: 0;

    button {
        margin-right: 8px;
    }
`;
RunsTableCellButton.displayName = "RunsTableCellButton";

interface IRunsTableHeaderProps {
    first: boolean;
}

export const RunsTableHeader = styled(RunsTableCell)<IRunsTableHeaderProps>`
    height: 40px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(42, 62, 82, 0.6);
    padding: ${({ first }) => (first ? "0 30px 0 60px" : "0 30px")};
`;
RunsTableHeader.displayName = "RunsTableHeader";

export const DropdownContainer = styled.div`
    margin-left: 8px;
    height: 33px;
    width: 37px;
`;
DropdownContainer.displayName = "DropdownContainer";

export const EmptyStateWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100px;

    img {
        margin-bottom: 32px;
    }
`;
EmptyStateWrapper.displayName = "EmptyStateWrapper";

export const LeadGeneratorEllipsisButton = styled.div.attrs(() => ({
    children: <IconButton type="flat" iconName="dots-more" />,
}))`
    .SWReactIcons svg {
        width: 24px;
        height: 24px;
    }
`;
LeadGeneratorEllipsisButton.displayName = "LeadGeneratorEllipsisButton";

export const LeadGeneratorAllDownloadIcon = styled(LeadGeneratorDownloadIcon)`
    .reactIcon {
        fill: #4f8df9;
        fill-opacity: 1;
    }

    &:hover {
        .reactIcon {
            fill: #3f70c7;
        }
    }
`;
LeadGeneratorAllDownloadIcon.displayName = "LeadGeneratorAllDownloadIcon";

export const LeadGeneratorAllLoader = styled.div`
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;

    div {
        margin: 0;
    }
`;
LeadGeneratorAllLoader.displayName = "LeadGeneratorAllLoader";

interface ILeadGeneratorAllSectionProps {
    noReports: boolean;
}

export const LeadGeneratorAllSection = styled.div<ILeadGeneratorAllSectionProps>`
    margin: ${({ noReports }) => (noReports ? "40px 0" : "40px 0 20px")};
`;

export const LeadGeneratorAllSectionHeader = styled.div`
    display: flex;
    align-items: center;
    margin: 16px 0 -8px;

    p {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
    }
`;

export const UnarchiveButton = styled.div`
    margin-left: 40px;
`;
