import React from "react";
import styled from "styled-components";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { LeadGeneratorSubtitleBoxWrap } from "../../components/LeadGeneratorSubtitleBox";

export const LeadGeneratorExistWrapper = styled.div`
    max-width: 1366px;
    margin: 20px auto;
    padding: 0 43px 50px;
`;
LeadGeneratorExistWrapper.displayName = "LeadGeneratorExistWrapper";

export const LeadGeneratorExistHeader = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: column;
`;
LeadGeneratorExistHeader.displayName = "LeadGeneratorExistHeader";

export const LeadGeneratorExistLoaderWrapper = styled.div`
    svg {
        height: 80px;
    }
`;
LeadGeneratorExistLoaderWrapper.displayName = "LeadGeneratorExistLoaderWrapper";

export const LeadGeneratorExistHeaderWrapper = styled.div`
    padding-bottom: 16px;
`;
LeadGeneratorExistHeaderWrapper.displayName = "LeadGeneratorExistHeaderWrapper";

export const ReportTableTopWrapper = styled.div`
    hr {
        margin: 0;
    }
`;
ReportTableTopWrapper.displayName = "ReportTableTopWrapper";

export const FirstLine = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px 15px;
`;
FirstLine.displayName = "FirstLine";

export const SecondLine = styled.div`
    display: flex;
    padding: 10px 15px;
    align-items: center;

    > div {
        margin: 0 2px 0 16px;
    }

    span {
        font-size: 14px;
    }
`;
SecondLine.displayName = "SecondLine";

export const ReportTableFilters = styled.div`
    display: flex;

    > div {
        margin-right: 16px;
    }

    .input-text-default input {
        width: calc(100% - 20px);
    }
`;
ReportTableFilters.displayName = "ReportTableFilters";

export const ReportTableSettings = styled.div`
    display: flex;
    align-items: center;

    > div {
        margin-left: 8px;
    }
`;
ReportTableSettings.displayName = "ReportTableSettings";

export const LeadGeneratorDownloadIcon = styled.span.attrs(() => ({
    children: <IconButton type="flat" iconName="download" />,
}))`
    line-height: 0;
`;
LeadGeneratorDownloadIcon.displayName = "LeadGeneratorDownloadIcon";

export const RunsDropdownContainer = styled.div`
    float: right;
`;
RunsDropdownContainer.displayName = "RunsDropdownContainer";

export const LeadGeneratorSubtitleWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(42, 62, 82, 0.06);
    border-radius: 4px;
    padding: 8px;
    margin-bottom: 16px;

    ${LeadGeneratorSubtitleBoxWrap} {
        max-width: calc(100% - 160px);
    }
`;
LeadGeneratorSubtitleWrapper.displayName = "LeadGeneratorSubtitleWrapper";
