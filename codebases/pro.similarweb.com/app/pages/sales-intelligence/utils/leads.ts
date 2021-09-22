import { IColumnsPickerLiteProps } from "@similarweb/ui-components/dist/columns-picker";
import { KeywordType } from "../types";

export const defaultConfig = {
    country: 999,
    duration: "3m",
    webSource: "Total",
    table: "TotalTraffic",
};

export const getColumnsPickerLiteProps = (
    tableColumns,
    onColumnToggle,
): IColumnsPickerLiteProps => {
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
        onColumnToggle,
        onPickerToggle: () => null,
        maxHeight: 264,
        width: "auto",
    };
};

export const paramsFindListGroupKeywords = (
    keyword: KeywordType,
    defaultParams: Record<string, any>,
) => {
    const params = {
        ...defaultConfig,
        ...defaultParams,
        keyword: "",
    };
    if (keyword.Id) {
        params.keyword = `*${keyword.Id}`;
    } else {
        params.keyword = keyword.name;
    }
    return params;
};

export const sortGroupsKeywords = (a, b) => {
    if (a.Name.toLowerCase() < b.Name.toLowerCase()) {
        return -1;
    }
    if (a.Name.toLowerCase() > b.Name.toLowerCase()) {
        return 1;
    }
    return 0;
};

export const convertToKeyword = (keyword: string): string => {
    return keyword.replace("*", "");
};
