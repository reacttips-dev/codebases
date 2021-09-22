import { swSettings } from "common/services/swSettings";
import { ISneakpeekGraphProps, SneakpeekGraph } from "pages/sneakpeek/SneakpeekGraph";
import SneakpeekPieChart from "pages/sneakpeek/SneakpeekPieChart";
import { ReactElement } from "react";
import { SneakpeekTable } from "pages/sneakpeek/SneakpeekTable";
import { ITableColumnsMetadata } from "pages/sneakpeek/types";

export function canCreateSneak() {
    return swSettings.components.Home.resources.HasNewSneakPeek;
}

export function setKeyParam(navParams: Record<string, any>): Record<string, any> {
    const keyParams = ["site", "keyword", "keywords", "appId"];
    const retParams = {};
    Object.entries(navParams).forEach(([param, value]) => {
        retParams[keyParams.includes(param) ? "key" : param] = value;
    });

    return retParams;
}

export const innerComponentResolver = (type: string, props: Record<string, any>): ReactElement => {
    switch (type) {
        case "table":
            return <SneakpeekTable {...props} />;
        case "graph":
            return <SneakpeekGraph {...(props as ISneakpeekGraphProps)} />;
        case "piechart":
            return <SneakpeekPieChart {...props} />;
        default:
            return;
    }
};

export function getNewColumn() {
    return {
        field: "",
        name: "",
        cellTemp: "DefaultCell",
    };
}

export function getNewQuestion() {
    return {
        type: "yesNo",
        text: "",
    };
}

export function serializeColumns(columns) {
    return columns.reduce((final, current) => {
        return {
            ...final,
            [current.field]: {
                ...current,
            },
        };
    }, {});
}

export const getColumnsMetaDataFromDataAndSelection = (
    columnNamesFromReturnedData: string[],
    columnsFromSelection: Record<string, ITableColumnsMetadata>,
): ITableColumnsMetadata[] => {
    const columnsFromData = columnNamesFromReturnedData.reduce((acc, name) => {
        return {
            ...acc,
            [name]: {
                field: name,
                name,
                cellTemp: "DefaultCell",
            },
        };
    }, {});
    const aggregatedColumns = { ...columnsFromData, ...columnsFromSelection };

    return Object.values(aggregatedColumns);
};
