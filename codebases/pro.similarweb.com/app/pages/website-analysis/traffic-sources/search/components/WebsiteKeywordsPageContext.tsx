import { IWidgetTableResult } from "components/widget/widget-types/TableWidget";
import React, { useContext } from "react";
import { IWebsiteKeywordsPageFilters } from "./WebsiteKeywordsPageTypes";
import { IChosenItem } from "../../../../../../app/@types/chosenItems";
import { IChipItem } from "@similarweb/ui-components/dist/chip/src/ChipContainer";

export interface IWebsiteKeywordsPageTableTopContext {
    chosenItems: IChosenItem[];
    tableFilters: IWebsiteKeywordsPageFilters;
    searchEngines: Array<{ count?: number; id: string; text: string }>;
    searchTypes: Array<{ count?: number; id: string; text: string }>;
    onOrganicPaidChange: (value) => void;
    onBrandedNonBrandedChange: (value) => void;
    onSearchChannelChange: (value: IChipItem[]) => void;
    onSearchTypeChange: (value: IChipItem[]) => void;
    onPhraseChange: (value) => void;
    onChangeNewlyDiscovered: (value) => void;
    onChangeTrending: (value) => void;
    onChangeQuestions: (value) => void;
    onVolumeChange: (value) => void;
    onCpcChange: (value) => void;
    onAdvancedFilterToggle: (value) => void;
    onAdvancedFilterDone: (ranges) => void;
    onAdvancedFilterClose: VoidFunction;
    onSerpFilterApply: (features) => void;
    serpDataLoading: boolean;
    isCompare: boolean;
    resetEnabled: boolean;
    onReset: VoidFunction;
    applyEnabled: boolean;
    onApply: VoidFunction;
    isLast28Days: boolean;
    tableData: IWidgetTableResult;
}

const WebsiteKeywordsPageTableTopContext = React.createContext<IWebsiteKeywordsPageTableTopContext>(
    null,
);
export const WebsiteKeywordsPageTableTopContextProvider =
    WebsiteKeywordsPageTableTopContext.Provider;
export const useWebsiteKeywordsPageTableTopContext = () =>
    useContext<IWebsiteKeywordsPageTableTopContext>(WebsiteKeywordsPageTableTopContext);
