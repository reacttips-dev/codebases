import autobind from "autobind-decorator";
import * as _ from "lodash";
import React, { Component } from "react";
import {
    ColumnGap,
    InnerComponentContainer,
    QueryContainer,
    QueryContentContainer,
    QueryHeaderContainer,
} from "../StyledComponents";
import { QueryHeader } from "./QueryHeader";
import QueryParams from "./QueryParams";
import { innerComponentResolver } from "pages/sneakpeek/utilities";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders/src/PlaceholderLoaders";
import { PdfExportService } from "services/PdfExportService";
import { EDataPresentationTypes } from "pages/sneakpeek/types";
import { stringify } from "querystring";
import { DefaultFetchService } from "services/fetchService";
import { GraphLoader } from "components/Loaders/src/ExpandedTableRowLoader/ExpandedTableRowLoader";
import { NoData } from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";
import queryString from "querystring";
import { SneakpeekApiService } from "pages/sneakpeek/SneakpeekApiService";
import { swSettings } from "common/services/swSettings";

interface ISneakpeekQueryProps {
    params: any;
    queryId: string;
    onRemove: (query: string) => void;
    onEdit: (editedId: string) => void;
    onDelete: (queryId: string) => void;
    ownList: boolean;
    navigator: any;
}

interface ISneakpeekQueryState {
    metaData: any;
    title: string;
    type: string;
    isLoading: boolean;
    dynamicParams: Record<string, any>;
    renderInnerComponent: boolean;
    sql: string;
    queryDataRaw: any;
}

export default class Query extends Component<ISneakpeekQueryProps, ISneakpeekQueryState> {
    public chartRef;
    public fetchService;
    constructor(props) {
        super(props);
        this.state = {
            metaData: null,
            title: "",
            type: "",
            isLoading: true,
            dynamicParams: {},
            renderInnerComponent: false,
            sql: "",
            queryDataRaw: undefined,
        };
        this.chartRef = React.createRef();
        this.fetchService = DefaultFetchService.getInstance();
    }

    public async componentDidMount() {
        let queryDataRaw, metaData, title, type, sql, dynamicParams;
        const { queryId } = this.props;
        const apiParams = this.props.navigator.getApiParams();
        const allParams = {
            ...apiParams,
            ...this.props.params,
            queryId: queryId,
            includeSubDomains: this.props.params.isWWW === "*",
            timeGranularity: undefined,
        };
        try {
            const data = await SneakpeekApiService.getMetadata(queryId);
            if (data) {
                metaData = data.meta;
                title = data.title;
                type = data.type;
                sql = data.sql;
                allParams.timeGranularity = _.capitalize(metaData.granularity);
            }
            dynamicParams = metaData.dynamicParams;
            this.setState({
                title,
                type,
                metaData,
                dynamicParams,
                sql,
            });
        } catch (e) {
            this.setState({
                isLoading: false,
            });
        }
        if (_.isEmpty(dynamicParams) && type !== EDataPresentationTypes.TABLE) {
            try {
                queryDataRaw = await SneakpeekApiService.ExecuteQuery(stringify(allParams), {
                    dynamicParams: {},
                });
                this.setState({
                    isLoading: false,
                    renderInnerComponent: true,
                    queryDataRaw,
                });
            } catch (e) {
                this.setState({
                    isLoading: false,
                });
            }
        } else {
            this.setState({
                isLoading: false,
                renderInnerComponent: _.isEmpty(dynamicParams),
                queryDataRaw: "ignore this state",
            });
        }
    }

    @autobind
    public updateDynamicParams(dynamicParams) {
        this.setState({
            dynamicParams,
            renderInnerComponent: true,
        });
    }

    @autobind
    public getPNG() {
        const offSetX = 20;
        const offSetY = 40;
        const chartOuterHTML = this.chartRef.current.outerHTML;
        const styleHTML = Array.from(document.querySelectorAll("style"))
            .map((stylesheet) => stylesheet.outerHTML)
            .join("");
        PdfExportService.downloadHtmlPngFedService(
            styleHTML + chartOuterHTML,
            this.state.title,
            this.chartRef.current.offsetWidth + offSetX,
            this.chartRef.current.offsetHeight + offSetY,
        ).then();
    }

    @autobind
    public getExcelLink() {
        const queryParams = {
            ...this.props.navigator.getApiParams(),
            ...this.props.params,
            queryId: this.props.queryId,
        };
        const rawDynamicParams = JSON.stringify(this.state.dynamicParams);
        const queryStringParams = queryString.stringify({ ...queryParams, rawDynamicParams });
        return `/api/DynamicData/GetCsv?${queryStringParams}`;
    }

    public render() {
        const {
            isLoading,
            dynamicParams,
            type,
            metaData,
            title,
            renderInnerComponent,
            sql,
            queryDataRaw,
        } = this.state;
        const { params, queryId, onRemove, onEdit, onDelete, ownList, navigator } = this.props;
        const { chartRef, getPNG, getExcelLink } = this;
        const queryWithDynamicParams = !_.isEmpty(dynamicParams);
        const innerComponentProps = {
            params,
            dynamicParams,
            type,
            metaData,
            title,
            queryId,
            navigator,
            chartRef,
            queryDataRaw,
        };
        const excelLink = type === EDataPresentationTypes.TABLE ? getExcelLink() : null;
        if (isLoading) {
            return (
                <QueryContainer>
                    <QueryHeaderContainer style={{ justifyContent: "space-between" }}>
                        <PixelPlaceholderLoader width={140} height={26} />
                        <FlexRow justifyContent={"space-between"}>
                            <PixelPlaceholderLoader width={40} height={26} />
                            <ColumnGap />
                            <PixelPlaceholderLoader width={40} height={26} />
                            <ColumnGap />
                            <PixelPlaceholderLoader width={40} height={26} />
                            <ColumnGap />
                            <PixelPlaceholderLoader width={40} height={26} />
                        </FlexRow>
                    </QueryHeaderContainer>
                    <FlexRow style={{ width: "100%" }} justifyContent={"center"}>
                        <GraphLoader width={"95%"} height={250} />
                    </FlexRow>
                </QueryContainer>
            );
        }

        return (
            <QueryContainer>
                <QueryHeader
                    title={title}
                    feedback={metaData && metaData.feedback}
                    queryId={queryId}
                    sql={sql}
                    ownList={ownList}
                    onRemove={onRemove}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    getPNG={getPNG}
                    hasPNG={type === EDataPresentationTypes.GRAPH}
                    excelLink={excelLink}
                    isExcelEnabled={renderInnerComponent}
                />
                <QueryContentContainer>
                    {queryWithDynamicParams && (
                        <QueryParams
                            dynamicParams={dynamicParams}
                            onSubmit={this.updateDynamicParams}
                        />
                    )}
                    {!queryDataRaw && renderInnerComponent ? (
                        <NoData
                            paddingTop="80px"
                            noDataTitleKey="global.nodata.notavilable"
                            noDataSubTitleKey="workspaces.marketing.nodata.subtitle"
                        />
                    ) : renderInnerComponent ? (
                        <InnerComponentContainer>
                            {innerComponentResolver(type, innerComponentProps)}
                        </InnerComponentContainer>
                    ) : null}
                </QueryContentContainer>
            </QueryContainer>
        );
    }
}
