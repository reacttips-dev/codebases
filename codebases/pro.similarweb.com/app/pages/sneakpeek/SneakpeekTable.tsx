import React, { FC, useEffect, useState } from "react";
import SWReactTableWrapper from "components/React/Table/SWReactTableWrapper";
import * as _ from "lodash";
import { IndexCell, WebsiteTooltipTopCell } from "components/React/Table/cells";
import { DefaultCellHeader, DefaultCenteredCellHeader } from "components/React/Table/headerCells";
import { ITableCellProps } from "components/React/Table/interfaces/ITableCellProps";
import { Injector } from "common/ioc/Injector";
import { cellTemplateResolver } from "pages/sneakpeek/constants";
import { getColumnsMetaDataFromDataAndSelection } from "pages/sneakpeek/utilities";
import { ITableColumnsMetadata } from "pages/sneakpeek/types";

export class WebsiteTooltipTopCellWrapper extends React.Component<ITableCellProps, any> {
    sitesResource: any;

    constructor(props) {
        super(props);
        this.state = {
            Icon: null,
        };
        this.sitesResource = Injector.get("sitesResource");
    }

    UNSAFE_componentWillMount() {
        const { value: siteId } = this.props;
        this.sitesResource.GetWebsiteImage({ website: siteId }, ({ image: Icon }) => {
            this.setState({ Icon });
        });
    }

    render() {
        const { row } = this.props;
        const { Icon } = this.state;
        return <WebsiteTooltipTopCell {...this.props} row={{ ...row, Icon }} />;
    }
}

const getColumns = (columnsMetaData: ITableColumnsMetadata[]) => {
    return [
        {
            field: "",
            cellComponent: IndexCell,
            fixed: true,
            cellTemp: "index",
            sortDirection: "desc",
            sortable: false,
            headerComponent: DefaultCenteredCellHeader,
            width: 65,
            visible: true,
            disableHeaderCellHover: true,
        },
        ...columnsMetaData.map(({ field, name, cellTemp }) => {
            return {
                field,
                cellComponent: cellTemplateResolver[cellTemp],
                displayName: name,
                name: field,
                title: name,
                sortable: true,
                visible: true,
                width: 100,
                sortDirection: "asc",
                isResizable: true,
                headerComponent: DefaultCellHeader,
            };
        }),
    ].filter((column) => !!column);
};

const endpoint = "/api/DynamicData/ExecuteQuery";

export const SneakpeekTable: FC<any> = (props) => {
    const { dynamicParams, metaData } = props;
    const [requestBody, setRequestBody] = useState({ dynamicParams });

    const [tableColumns, setTableColumns] = useState([]);

    const { queryId } = props;
    const initialFilters = {
        ...props.navigator.getApiParams(),
        ...props.params,
        queryId,
        includeSubDomains: props.params.isWWW === "*",
        timeGranularity: _.capitalize(props.metaData.granularity),
    };

    useEffect(() => {
        setRequestBody({ dynamicParams });
    }, [dynamicParams]);

    const transformData = (data) => {
        const dataObject = data?.Data;

        const columnsMetaData = getColumnsMetaDataFromDataAndSelection(
            Object.keys(dataObject.Data[0]),
            metaData.rawColumns,
        );

        setTableColumns(getColumns(columnsMetaData));
        const total = dataObject?.Data?.length;
        return { Data: dataObject?.Data, TotalCount: total };
    };

    // since the table wrapper is an uncontrolled component, the only way
    // to cause the table to re-fetch the data when something changes (without
    // using a tabletop component) is to cause the table to unmount and remount
    // (in this case by changing the key when something changes)
    return (
        <SWReactTableWrapper
            key={JSON.stringify(requestBody)}
            serverApi={endpoint}
            tableColumns={tableColumns}
            initialFilters={initialFilters}
            requestBody={requestBody}
            totalRecordsField="TotalCount"
            recordsField="Data"
            transformData={transformData}
            fetchServerPages={Number.MAX_VALUE}
        />
    );
};
