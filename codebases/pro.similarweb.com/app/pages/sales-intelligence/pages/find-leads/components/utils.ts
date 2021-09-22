import { IColumnsPickerLiteProps } from "@similarweb/ui-components/dist/columns-picker";
import { defaultConfig } from "pages/sales-intelligence/pages/find-leads/components/KeywordLeads/configs/allConfigs";

export const dataParamsAdapter = (params) => {
    const transformedParams = { ...params };
    const filter = [];
    if (params.selectedSourceType) {
        filter.push(`family;==;"${params.selectedSourceType}"`);
        delete transformedParams.selectedSourceType;
    }
    // category
    if (params.categoryItem) {
        filter.push(`category;category;"${transformedParams.categoryItem}"`);
    }
    // search
    if (transformedParams.search) {
        filter.push(`domain;contains;"${transformedParams.search}"`);
        delete transformedParams.search;
    }

    // website type
    if (transformedParams.websiteType) {
        filter.push(`SiteFunctionality;==;"${transformedParams.websiteType}"`);
        delete transformedParams.websiteType;
    }

    // search type
    if (transformedParams.searchType) {
        filter.push(`${transformedParams.searchType};==;true`);
        delete transformedParams.searchType;
    }
    if (params.keywordSearchType) {
        filter.push(`Source;==;${transformedParams.keywordSearchType}`);
        delete transformedParams.searchType;
    }

    // new
    if (transformedParams.newCompetitors) {
        filter.push(`isnew;==;true`);
    }
    delete transformedParams.newCompetitors;

    // rising
    if (transformedParams.risingCompetitors) {
        filter.push(`isrise;==;true`);
        delete transformedParams.risingCompetitors;
    }

    if (params.table === "IncomingTraffic") {
        const { searchTypeParam = `Referral"[comma]"Display Ad` } = params;
        filter.push(`sourceType;==;"${searchTypeParam}"`);
    }
    if (params.table === "SearchLeaders" && params.trafficType) {
        const types = { Organic: 0, Paid: 1 };
        filter.push(`OP;==;${types[params.trafficType]}`);
    }

    if (filter.length > 0) {
        transformedParams.filter = filter.join(",");
    }
    // selected domain
    if (transformedParams.selectedSite) {
        transformedParams.keys = transformedParams.selectedSite;
        delete transformedParams.selectedSite;
    }

    // orderby
    transformedParams.orderby = `${transformedParams.sort} ${
        transformedParams.asc ? "asc" : "desc"
    }`;
    delete transformedParams.sort;
    delete transformedParams.asc;
    delete transformedParams.orderBy;
    delete transformedParams.sourceType;
    delete transformedParams.table;

    return transformedParams;
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

export const paramsFindListGroupKeywords = (keyword) => {
    return {
        groupId: keyword.Id ? `${keyword.Id}` : `${keyword?.name}`,
        keyword: keyword.Id ? `${keyword.Name}` : `${keyword?.name}`,
        ...defaultConfig,
    };
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
