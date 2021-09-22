import * as React from "react";
import { i18nFilter } from "../../../filters/ngFilters";
import {
    BooleanSearchUtilityContainer,
    KeywordGeneratorToolPageTableHeaderStyled,
    TableHeaderItemContainer,
    TableHeaderText,
} from "pages/keyword-analysis/keyword-generator-tool/styledComponents";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { DownloadExcelContainer } from "pages/workspace/StyledComponent";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import {
    ColumnsPickerLite,
    IColumnsPickerLiteProps,
} from "@similarweb/ui-components/dist/columns-picker";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { swSettings } from "common/services/swSettings";
import { BooleanSearchUtilityWrapper } from "pages/website-analysis/traffic-sources/search/BooleanSearchUtilityWrapper";
import { useDidMountEffect } from "custom-hooks/useDidMountEffect";

interface IAmazonKeywordGeneratorTableTopProps {
    onFilterChange: (items: { ExcludeTerms: string; IncludeTerms: string }) => void;
    excelDownloadUrl: string;
    booleanSearchTerms;
    columns: any;
    onClickToggleColumns: (col: number) => void;
    totalRecords: number;
}

const TableHeaderItem = ({ title, subtitle }) => {
    return (
        <TableHeaderItemContainer>
            <TableHeaderText weight={500} size={18}>
                {title}
            </TableHeaderText>
            <TableHeaderText>{subtitle}</TableHeaderText>
        </TableHeaderItemContainer>
    );
};

export const AmazonKeywordGeneratorTableTop: React.FC<IAmazonKeywordGeneratorTableTopProps> = (
    props,
) => {
    // see SIM-35237:
    // Additional fetches were being sent from SWReactTableWrapper.getData(), unnecessarily, as a result
    // of props.onFilterChange being called, in this component, on mounting (with useEffect).
    // With this hook the effect will only run when the dependency actually changes and not on mounting.
    useDidMountEffect(() => {
        const split = props.booleanSearchTerms.split(",");
        const IncludeTerms = split
            .filter((item) => item[0] === "|")
            .map((item) => item.slice(1))
            .join(",");
        const ExcludeTerms = split
            .filter((item) => item[0] === "-")
            .map((item) => item.slice(1))
            .join(",");

        props.onFilterChange({ ExcludeTerms, IncludeTerms });
    }, [props.booleanSearchTerms]);
    const { columns, excelDownloadUrl, onClickToggleColumns, totalRecords } = props;

    const excelAllowed = swSettings.current.resources.IsExcelAllowed;
    const trackExcelDownload = () => {
        TrackWithGuidService.trackWithGuid(
            "amazon.keyword.generator.table.excel.download",
            "click",
        );
    };
    const getColumnsPickerLiteProps = (tableColumns): IColumnsPickerLiteProps => {
        const onColumnToggle = (key) => {
            TrackWithGuidService.trackWithGuid(
                "amazon.keyword.generator.table.columns.picker",
                "switch",
            );
            onClickToggleColumns(parseInt(key, 10));
        };

        const columns = tableColumns.reduce((res, col, index) => {
            if (!col.fixed) {
                return [
                    ...res,
                    {
                        key: index.toString(),
                        displayName: col.displayName,
                        visible: col.visible,
                    },
                ];
            }
            return res;
        }, []);
        return {
            columns,
            onColumnToggle: onColumnToggle,
            onPickerToggle: () => null,
            maxHeight: 264,
            width: "auto",
        };
    };
    const downloadTooltipText =
        totalRecords > 10000
            ? i18nFilter()("amazon.keyword.generator.table.excel.download.text")
            : undefined;
    return (
        <>
            <KeywordGeneratorToolPageTableHeaderStyled>
                <BooleanSearchUtilityContainer>
                    <BooleanSearchUtilityWrapper shouldEncodeSearchString={false} />
                </BooleanSearchUtilityContainer>
                <FlexRow>
                    <DownloadExcelContainer href={excelDownloadUrl}>
                        <DownloadButtonMenu
                            Excel={true}
                            downloadUrl={excelDownloadUrl}
                            exportFunction={trackExcelDownload}
                            excelLocked={!excelAllowed}
                            downloadTooltipText={downloadTooltipText}
                        />
                    </DownloadExcelContainer>
                    <ColumnsPickerLite {...getColumnsPickerLiteProps(columns)} withTooltip />
                </FlexRow>
            </KeywordGeneratorToolPageTableHeaderStyled>
        </>
    );
};
AmazonKeywordGeneratorTableTop.defaultProps = {
    booleanSearchTerms: "",
};
