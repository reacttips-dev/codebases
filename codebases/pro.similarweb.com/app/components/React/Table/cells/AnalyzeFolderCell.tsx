import { Button, ButtonLabel, IButtonProps } from "@similarweb/ui-components/dist/button";
import I18n from "components/React/Filters/I18n";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import * as React from "react";
import styled from "styled-components";

const AnalyzeButton = styled(Button).attrs({
    type: "flat",
})`
    margin-top: -10px;
`;
AnalyzeButton.displayName = "AnalyzeButton";

const DisabledButton = styled(AnalyzeButton).attrs<IButtonProps>({
    isDisabled: true,
})<IButtonProps>`
    cursor: default;
`;
DisabledButton.displayName = "DisabledButton";

export const AnalyzeFolderCell = (props) => {
    const { tableMetadata, row, tableOptions } = props;
    const { Header } = tableMetadata;
    const isWebsiteSupported =
        Header &&
        Header.IsFolderAnalysisSupported &&
        Header.IsFolderAnalysisSupported[Header.MainSite];
    const isRowSupported = row.IsFolderAnalysisSupported;
    const analyzeTxtBtn = (
        <ButtonLabel>
            <I18n>folderanalysis.table.analyze.button</I18n>
        </ButtonLabel>
    );
    let tooltip;
    if (!isWebsiteSupported) {
        tooltip = "folderanalysis.table.analyze.button.disabled.site.tooltip";
    } else if (!tableOptions.isFiltersSupported) {
        tooltip = "folderanalysis.table.analyze.button.disabled.filters.tooltip";
    } else if (isWebsiteSupported && !isRowSupported) {
        tooltip = "folderanalysis.table.analyze.button.disabled.folder.tooltip";
    } else {
        tooltip = "folderanalysis.table.analyze.button.enabled.tooltip";
    }

    return (
        <PlainTooltip placement="left" text={tooltip}>
            <div>
                {isRowSupported && tableOptions.isFiltersSupported ? (
                    <AnalyzeButton>{analyzeTxtBtn}</AnalyzeButton>
                ) : (
                    <DisabledButton>{analyzeTxtBtn}</DisabledButton>
                )}
            </div>
        </PlainTooltip>
    );
};
