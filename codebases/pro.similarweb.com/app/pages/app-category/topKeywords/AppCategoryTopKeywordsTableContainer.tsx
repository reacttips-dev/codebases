import { colorsPalettes } from "@similarweb/styles";
import queryString from "query-string";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import * as React from "react";
import { FunctionComponent, useState } from "react";
import DurationService from "services/DurationService";
import styled from "styled-components";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import { SwNavigator } from "../../../../scripts/common/services/swNavigator";
import SWReactTableWrapper from "../../../components/React/Table/SWReactTableWrapper";
import SWReactRootComponent from "../../../decorators/SWReactRootComponent";
import { i18nFilter } from "../../../filters/ngFilters";
import { appCategoryTopKeywordsTableColumnsConfigGen } from "./AppCategoryTopKeywordsTableColumns";
import { DownloadExcelContainer } from "../../workspace/StyledComponent";
import { allTrackers } from "../../../services/track/track";

const Search: FunctionComponent<any> = ({ props }) => {
    const [search, setSearchTerm] = useState("");
    const onSearch = (search) => {
        props.onFilterChange(
            search ? { filter: `Term;contains;"${search}"` } : { filter: undefined },
            false,
        );
        setSearchTerm(search);
    };

    return (
        <SearchContainer>
            <SearchInput
                defaultValue={search}
                debounce={400}
                onChange={onSearch}
                placeholder={i18nFilter()("table.search.placeholder.keywords")}
            />
        </SearchContainer>
    );
};

export const AppCategoryTopKeywordsTableContainer: FunctionComponent<any> = () => {
    const serverApi = "/api/GooglePlayKeywords/TopKeywords";
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const apiParams = swNavigator.getApiParams(swNavigator.getParams());
    const { orderby } = apiParams;
    const durationData = DurationService.getDurationData(swNavigator.getParams().duration);
    const excelUrl = `/export/GooglePlayKeywords/GetTopKeywordsTsv?${queryString.stringify(
        apiParams,
    )}`;
    const [sort, setSort] = useState(() => {
        const orderbyArr = orderby ? orderby.split(" ") : ["", "desc"];
        return { field: orderbyArr[0], sortDirection: orderbyArr[1] };
    });
    const i18nReplacements = {
        currentMonth: durationData.raw.to.format("MMMM"),
        lastMonth: durationData.raw.to.subtract(1, "month").format("MMMM"),
    };
    const transformData = (data) => {
        if (!(data && data.Records)) {
            return data;
        }
        const params = swNavigator.getParams();
        data.Records = data.Records.map((record: any) => {
            return {
                ...record,
                href: swNavigator.getStateUrl("keywords-analysis", {
                    params,
                    keyword: record.Term,
                }),
            };
        });
        return data;
    };

    const onSort = ({ field, sortDirection }) => {
        swNavigator.updateParams({ orderby: `${field} ${sortDirection}` });
        setSort({ field, sortDirection });
    };

    const trackExcelDownload = () => {
        allTrackers.trackEvent("Download", "submit-ok", "Table/Download Excel");
    };

    const render = () => {
        return (
            <SWReactTableWrapper
                onSort={onSort}
                serverApi={serverApi}
                tableOptions={{
                    metric: "AppCategoryTopKeywordsTable",
                }}
                tableColumns={appCategoryTopKeywordsTableColumnsConfigGen(
                    sort.field,
                    sort.sortDirection,
                    i18nReplacements,
                )}
                initialFilters={apiParams}
                recordsField={"Records"}
                totalRecordsField={"FilteredCount"}
                pageIndent={1}
                transformData={transformData}
            >
                {(topComponentProps) => (
                    <TopBar>
                        <Search props={topComponentProps} />
                        <DownloadExcelContainer href={excelUrl} onClick={trackExcelDownload}>
                            <IconButton
                                iconName="excel"
                                type="flat"
                                dataAutomation="list-header-download-excel-button"
                            />
                        </DownloadExcelContainer>
                    </TopBar>
                )}
            </SWReactTableWrapper>
        );
    };
    return render();
};

SWReactRootComponent(AppCategoryTopKeywordsTableContainer, "AppCategoryTopKeywordsTableContainer");

const SearchContainer = styled.div`
    width: calc(100% - 40px);
    .SearchInput {
        height: 34px;
        background-color: ${colorsPalettes.carbon[0]};
        border: none;
        width: 100%;
        box-sizing: border-box;
        padding: 9px 2px 5px 50px;
        box-shadow: none;
        margin-bottom: 0px;
        :focus {
            box-shadow: none !important;
            border: none;
        }
    }
`;
SearchContainer.displayName = "SearchContainer";

const TopBar = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 5px;
`;
TopBar.displayName = "TopBar";
