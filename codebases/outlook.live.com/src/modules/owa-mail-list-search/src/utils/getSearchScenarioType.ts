import type {
    default as SearchTableQuery,
    SearchTableScenarioType,
} from '../store/schema/SearchTableQuery';
import { TableQuery, TableQueryType } from 'owa-mail-list-store';

/**
 * @return Scenario type of the search table query (undefined if the table query
 * is not of search type)
 */
export default function getSearchScenarioType(tableQuery: TableQuery): SearchTableScenarioType {
    const searchTableQuery = tableQuery as SearchTableQuery;
    return tableQuery.type == TableQueryType.Search ? searchTableQuery.scenarioType : undefined;
}
