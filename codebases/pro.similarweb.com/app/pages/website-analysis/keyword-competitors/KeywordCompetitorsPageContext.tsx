import React, { useContext } from "react";
import { IChosenItem } from "../../../@types/chosenItems";

export interface IKeywordCompetitorsPageContext {
    // domains filter
    allSites: IChosenItem[];
    selectedSite: string;
    onSelectSite: (site) => void;
    // website type filter
    onSelectWebsiteType: (type) => void;
    selectedWebsiteType: string;
    // "rising competitors" filter
    onSelectRisingCompetitors: () => void;
    risingCompetitors: boolean;
    // "new competitors" filter
    onSelectNewCompetitors: () => void;
    newCompetitors: boolean;
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
}

const context = React.createContext<IKeywordCompetitorsPageContext>(null);

export const KeywordCompetitorsPageContextProvider = context.Provider;
export const useKeywordCompetitorsPageContext = (): IKeywordCompetitorsPageContext => {
    return useContext(context);
};
