import React from "react";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import LeadGeneratorUtils from "../LeadGeneratorUtils";

export const LeadGeneratorModalTitle = styled.div.attrs(() => ({
    "data-automation": "lead-generator-modal-title",
}))`
    font-size: 16px;
    line-height: 19px;
    font-weight: 500;
    margin-bottom: 16px;
    color: #2a3e52;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
LeadGeneratorModalTitle.displayName = "LeadGeneratorModalTitle";

export const LeadGeneratorModalSubtitle = styled.div.attrs(() => ({
    "data-automation": "lead-generator-modal-subtitle",
}))`
    color: rgba(42, 62, 82, 0.8);
    font-size: 14px;
    line-height: 24px;
    margin-bottom: 12px;
    max-width: 90%;
    color: rgba(42, 62, 82, 0.8);
`;
LeadGeneratorModalSubtitle.displayName = "LeadGeneratorModalSubtitle";

export const LeadGeneratorModalInput = styled.input.attrs(() => ({
    type: "text",
    maxLength: LeadGeneratorUtils.REPORT_NAME_MAX_LENGTH,
}))`
    && {
        height: 40px;
        width: 314px;
        border: 1px solid #eceef0;
        border-radius: 3px;
        background-color: ${colorsPalettes.carbon["0"]};
        box-shadow: 0 2px 4px 0 rgba(202, 202, 202, 0.2);
    }
`;
LeadGeneratorModalInput.displayName = "LeadGeneratorModalInput";

export const RenameReportModalContent = styled.div`
    height: 212px;
`;
RenameReportModalContent.displayName = "RenameReportModalContent";

export const LeadGeneratorModalContent = styled.div`
    margin-bottom: 24px;
    && {
        .MiniFlexTable-container .MiniFlexTable-column .MiniFlexTable-headerCell,
        .MiniFlexTable-container .MiniFlexTable-column .MiniFlexTable-cell {
            height: 40px;
            display: flex;
            align-items: center;
        }
    }
    .MiniFlexTable-container .MiniFlexTable-column .MiniFlexTable-cell {
        font-size: 14px;
        line-height: 16px;
        border-top: 1px solid ${colorsPalettes.carbon["50"]};
        padding-right: 8px;
    }
`;
LeadGeneratorModalContent.displayName = "LeadGeneratorModalContent";

export const PreviewModalNoResultsContent = styled(LeadGeneratorModalContent)`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 0;
    margin-top: 24px;

    ${LeadGeneratorModalTitle} {
        color: rgba(42, 62, 82, 0.8);
        font-size: 20px;
        line-height: 22px;
        margin-top: 24px;
    }

    ${LeadGeneratorModalSubtitle} {
        color: rgba(42, 62, 82, 0.6);
    }
`;
PreviewModalNoResultsContent.displayName = "PreviewModalNoResultsContent";

export const LeadGeneratorModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;

    button {
        margin-left: 8px;
    }
`;
LeadGeneratorModalFooter.displayName = "LeadGeneratorModalFooter";

export const LeadGeneratorPopupWrapper = styled.div`
    hr {
        margin: 8px 0;
    }
`;
LeadGeneratorPopupWrapper.displayName = "LeadGeneratorPopupWrapper";

export const LeadGeneratorPopupContent = styled.div`
    margin-bottom: 16px;
`;
LeadGeneratorPopupContent.displayName = "LeadGeneratorPopupContent";

export const PreviewModalTableHeader = styled.div`
    display: flex;
    align-items: center;
    color: rgba(42, 62, 82, 0.6);
    font-size: 12px;
    line-height: 14px;
    font-weight: 500;
`;
PreviewModalTableHeader.displayName = "PreviewModalTableHeader";

export const PreviewModalTableWebsiteCell = styled.div`
    display: flex;
    align-items: center;
    width: 100%;

    span {
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;
PreviewModalTableWebsiteCell.displayName = "PreviewModalTableWebsiteCell";

export const PreviewModalTableImgWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 24px;
    width: 24px;
    border: 1px solid ${colorsPalettes.midnight["50"]};
    border-radius: 6px;
    background-color: ${colorsPalettes.carbon["0"]};
    box-shadow: 0 2px 4px 0 rgba(202, 202, 202, 0.2);
    margin-right: 8px;
`;
PreviewModalTableImgWrapper.displayName = "PreviewModalTableImgWrapper";
