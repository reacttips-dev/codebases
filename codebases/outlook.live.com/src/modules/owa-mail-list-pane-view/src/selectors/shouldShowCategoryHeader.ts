import { TableQueryType, TableView, getUserCategoryName } from 'owa-mail-list-store';
import {
    SuggestionKind,
    CategorySearchSuggestion,
} from 'owa-search-service/lib/data/schema/SuggestionSet';
import type { SearchTableQuery } from 'owa-mail-list-search';
import type { CategoryHeaderData } from '../types/CategoryHeaderData';

export default function shouldShowCategoryHeader(
    tableView: TableView,
    categoryHeaderData: CategoryHeaderData
) {
    /**
     * If this is folder table then try to use the category name on the MailFolderTableQuery
     * If this is a category search then use the category name from the pill suggestions in the SearchTableQuery
     */
    if (tableView.tableQuery.type === TableQueryType.Folder) {
        const categoryName = getUserCategoryName(tableView);
        if (categoryName) {
            // Show category header if the view filter is user category
            categoryHeaderData.categoryName = categoryName;
        }
    } else if (tableView.tableQuery.type === TableQueryType.Search) {
        // Show the category header if it's a category search
        const searchTableQuery = tableView.tableQuery as SearchTableQuery;
        const categorySuggestions = searchTableQuery.pillSuggestions.filter(suggestion => {
            return suggestion.kind === SuggestionKind.Category;
        });

        // Render category header only if we have one pill of type category suggestion
        if (searchTableQuery.pillSuggestions.length === 1 && categorySuggestions.length === 1) {
            categoryHeaderData.categoryName = (categorySuggestions[0] as CategorySearchSuggestion).Name;
        }
    }

    return categoryHeaderData.categoryName !== null;
}
