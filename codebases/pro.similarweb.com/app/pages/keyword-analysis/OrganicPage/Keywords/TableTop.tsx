import {
    ColumnsPickerLite,
    IColumnsPickerLiteProps,
} from "@similarweb/ui-components/dist/columns-picker";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { i18nFilter } from "filters/ngFilters";
import { addToDashboard } from "UtilitiesAndConstants/UtilityFunctions/addToDashboard";
import { SearchContainer } from "pages/workspace/StyledComponent";
import * as queryString from "querystring";
import React, { useCallback, useMemo, useState } from "react";
import { allTrackers } from "services/track/track";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";

const i18n = i18nFilter();

const Right = styled.div`
    flex-grow: 0;
    display: flex;
    align-items: center;
    margin-left: 10px;
`;

const DownloadExcelContainer = styled.a`
    margin: 0 8px 0 16px;
`;

export const TableTop: React.FC<any> = (props) => {
    const [search, setSearch] = useState<string>();

    const a2d = useCallback(() => {
        addToDashboard({
            modelType: "fromKeyword",
            metric: "KeywordAnalysisGroupOrganic",
            type: "KeywordsDashboardTable",
            webSource: "Desktop",
            overrideAddToDashboardParams: {
                orderBy: "TotalShare desc",
                timeGranularity: "Monthly",
                filter: props.filtersStateObject.filter,
                category: props.filtersStateObject.category,
                FuncFlag: props.filtersStateObject.FuncFlag,
            },
        });
    }, [props.filtersStateObject]);

    const getColumnsPickerLiteProps = (): IColumnsPickerLiteProps => {
        const columns = props.tableColumns.reduce((res, col, index) => {
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
            onColumnToggle: (key) => {
                // tslint:disable-next-line:radix
                props.onClickToggleColumns(parseInt(key));
            },
            onPickerToggle: () => null,
        };
    };
    const trackExcelDownload = () => {
        allTrackers.trackEvent("Download", "submit-ok", "KeywordsTable/Excel");
    };
    const createFilterString = useCallback(
        (filter) => {
            return [
                ...(props.filtersStateObject.filter || "").split(",").filter((x) => x),
                filter,
            ].join(",");
        },
        [props.filtersStateObject],
    );
    const removeFromFilterString = useCallback(
        (filterName) => {
            return (props.filtersStateObject.filter || "")
                .split(",")
                .filter((filterStr) => {
                    return filterStr.split(";")[0] !== filterName;
                })
                .join(",");
        },
        [props.filtersStateObject],
    );
    const onSearch = useCallback(
        (search) => {
            setSearch(search);
            if (search) {
                props.onFilterChange(
                    { filter: createFilterString(`Keyword;contains;"${search}"`) },
                    false,
                );
            } else {
                // remove from filter
                props.onFilterChange({ filter: removeFromFilterString("Keyword") }, false);
            }
        },
        [createFilterString, removeFromFilterString],
    );
    const excelLink = useMemo(() => {
        const queryStringParams = queryString.stringify(props.filtersStateObject);
        return `/widgetApi/KeywordAnalysisOP/${props.excelMetric}/Excel?${queryStringParams}`;
    }, [props.filtersStateObject]);
    const excelAllowed = swSettings.current.resources.IsExcelAllowed;
    return (
        <div>
            <SearchContainer>
                <SearchInput
                    clearValue={false}
                    defaultValue={search}
                    debounce={400}
                    onChange={onSearch}
                    placeholder={i18n("forms.search.placeholder")}
                />
                <Right>
                    <FlexRow>
                        <DownloadExcelContainer href={excelLink}>
                            <DownloadButtonMenu
                                Excel={true}
                                downloadUrl={excelLink}
                                exportFunction={trackExcelDownload}
                                excelLocked={!excelAllowed}
                            />
                        </DownloadExcelContainer>
                        <div>
                            <ColumnsPickerLite
                                {...getColumnsPickerLiteProps()}
                                withTooltip={true}
                            />
                        </div>
                        <div>
                            <AddToDashboardButton onClick={a2d} />
                        </div>
                    </FlexRow>
                </Right>
            </SearchContainer>
        </div>
    );
};

TableTop.defaultProps = {
    families: [],
    sources: [],
    categories: [],
    excelMetric: "KeywordAnalysisGroupOrganic",
};
