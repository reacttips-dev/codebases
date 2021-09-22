import { Pagination } from "@similarweb/ui-components/dist/pagination";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import * as _ from "lodash";
import { DownloadExcelContainer } from "pages/workspace/StyledComponent";
import * as React from "react";
import { PureComponent } from "react";
import { allTrackers } from "services/track/track";
import TrialService from "services/TrialService";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import { SWReactTableOptimized } from "../../../components/React/Table/SWReactTableOptimized";
import { getColumns } from "./columns";
import {
    OutgoingLinksContainer,
    PaginationContainer,
    StyledBox,
    StyledFlexRow,
    UtilsContainer,
} from "./StyledComponents";

export interface IIndustryAnalysisOutgoingLinksProps {
    loading: boolean;
    data?: any;
    getLink: (a, b?, c?) => string;
    metric: string;
    excelLink: string;
    onFilter: (filters?) => void;
    sortedColumn: { field: string; sortDirection: string };
}

interface IIndustryAnalysisOutgoingLinksState {
    sortedColumn: { field: string; sortDirection: string };
    searchString: string;
    page: number;
}

class IndustryAnalysisOutgoingLinks extends PureComponent<
    IIndustryAnalysisOutgoingLinksProps,
    IIndustryAnalysisOutgoingLinksState
> {
    private swNavigator: any;
    private trialService: any;
    private isTrial: boolean;

    private onSort = (sortedColumn) => {
        this.setState({ sortedColumn }, () => {
            this.updateParams(true);
        });
    };

    private onSearch = (searchString) => {
        this.setState({ searchString, page: 1 }, () => {
            this.updateParams(false);
        });
    };

    private onPaging = (page) => {
        this.setState({ page }, () => this.updateParams(true));
    };

    private formatFilter = (key, value) => {
        if (key === "filter") {
            return `domain;contains;"${value}"`;
        }
        if (key === "orderby") {
            return `${value.field} ${value.sortDirection}`;
        }
    };

    private updateParams = (savePage?: boolean) => {
        const { searchString, sortedColumn, page } = this.state;
        const filters: any = {
            page,
        };
        const params: any = {
            outgoing_filters: "",
            orderby: "",
            page,
        };

        if (searchString) {
            filters.filter = this.formatFilter("filter", searchString);
            params.outgoing_filters = `domain;contains;${searchString}`;
        }

        if (sortedColumn) {
            filters.orderby = this.formatFilter("orderby", sortedColumn);
            params.orderby = this.formatFilter("orderby", sortedColumn);
        }

        if (!savePage) {
            params.page = undefined;
            delete filters.page;
        }

        if (!_.isEmpty(params)) {
            this.swNavigator.applyUpdateParams(params);
        }

        this.props.onFilter(filters);
    };

    private parseFilter = (filters, key) => {
        const filtersParted = filters.split(";");

        if (filtersParted[0] === key) {
            return filtersParted[2];
        }

        return null;
    };

    private trackExcelDownload = () => {
        allTrackers.trackEvent("Download", "submit-ok", "Table/Download Excel");
    };

    constructor(props) {
        super(props);

        this.trialService = new TrialService();
        this.isTrial = this.trialService.isTrial();
        this.swNavigator = Injector.get("swNavigator") as any;
        this.state = {
            searchString: undefined,
            sortedColumn: props.sortedColumn,
            page: this.swNavigator.getParams().page || 1,
        };
    }

    public render() {
        const { loading, data, metric, excelLink } = this.props;
        const { searchString, sortedColumn, page } = this.state;
        const excelDownloadUrl = !this.isTrial ? excelLink : "";
        let excelLinkHref = {};
        if (excelDownloadUrl !== "") {
            excelLinkHref = { href: excelDownloadUrl };
        }
        const tableOptions = {
            showCompanySidebar: true,
            customTableClass: "industry-outgoing-table",
            metric,
        };
        const filters = this.swNavigator.getApiParams().outgoing_filters;
        const searchValue = searchString || (filters && this.parseFilter(filters, "domain"));
        const isNoData = data && data.Data && data.Data.length === 0;
        const totalCount = _.get(data, "TotalCount", null);
        const tableData = data && {
            ...data,
            page,
            totalCount,
        };

        return (
            <OutgoingLinksContainer>
                <StyledBox>
                    <StyledFlexRow>
                        <SearchInput
                            debounce={1000}
                            onChange={this.onSearch}
                            placeholder={"search..."}
                            isLoading={loading}
                            defaultValue={searchValue}
                        />
                        <UtilsContainer>
                            {!loading && !isNoData && (
                                <DownloadExcelContainer {...excelLinkHref}>
                                    <DownloadButtonMenu
                                        Excel={true}
                                        downloadUrl={excelDownloadUrl}
                                        exportFunction={this.trackExcelDownload}
                                        excelLocked={this.isTrial}
                                    />
                                </DownloadExcelContainer>
                            )}
                        </UtilsContainer>
                    </StyledFlexRow>
                    <SWReactTableOptimized
                        isLoading={loading}
                        tableData={tableData}
                        tableColumns={getColumns(sortedColumn)}
                        onSort={this.onSort}
                        tableOptions={tableOptions}
                    />
                    <PaginationContainer>
                        {!loading && !isNoData && (
                            <Pagination
                                handlePageChange={this.onPaging}
                                captionPosition={"center"}
                                page={+page}
                                itemsCount={totalCount}
                                itemsPerPage={100}
                                hasItemsPerPageSelect={false}
                            />
                        )}
                    </PaginationContainer>
                </StyledBox>
            </OutgoingLinksContainer>
        );
    }
}

export default IndustryAnalysisOutgoingLinks;
