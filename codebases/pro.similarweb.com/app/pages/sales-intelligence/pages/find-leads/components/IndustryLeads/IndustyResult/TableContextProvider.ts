import React, { useContext } from "react";

export interface ITableContext {
    selectedSite: string;
    onSelectSite: (site) => void;
    // website type filter
    onSelectWebsiteType: (type) => void;
    selectedWebsiteType: string;
    // category filter
    allCategories: any[];
    onSelectCategory: (category) => void;
    selectedCategory: string;
    // search type
    searchTypes: any[];
    selectedSearchType: string;
    onSelectSearchType: (type) => void;
    searchTypeFilterPlaceholder: string;
    // search
    search?: string;
    onSearch: (search) => void;
    // search select
    searchSelectOptions: any[];
    onSearchSelect: (search) => void;
    searchSelectValue: string;
    //table type
    setTableType: (tableType) => void;
    selectedTableType: string;
    tableTypes: any[];
    //Traffic type
    trafficTypeValue: string;
    trafficTypes: any[];
    onTrafficTypeSelect: (trafficType) => void;
    isLoading: boolean;
}

const context = React.createContext<ITableContext>(null);

export const TableContextProvider = context.Provider;

export const useTableContext = (): ITableContext => {
    return useContext(context);
};
