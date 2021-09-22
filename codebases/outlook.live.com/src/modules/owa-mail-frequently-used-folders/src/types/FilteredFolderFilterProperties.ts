import type ViewFilter from 'owa-service/lib/contract/ViewFilter';

export interface FilteredFolderFilterProperties {
    filterType: ViewFilter;
    filterValue: string;
}

export const FILTER_FOLDER_ID_BUILDER = '#';
