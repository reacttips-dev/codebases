import { useQuery } from '@apollo/react-hooks';
import { GetSearchSuggestionsQuery } from '../../../../../schema/search/server-queries';
export function useSearchSuggestions(searchContext) {
    var query = searchContext.query, pageSize = searchContext.pageSize;
    var _a = useQuery(GetSearchSuggestionsQuery, {
        variables: {
            query: query,
            options: {
                pageSize: pageSize,
            },
        },
        ssr: false,
        skip: !query,
    }), data = _a.data, loading = _a.loading;
    var searchSuggestions = data ? getSuggestionsOrDefaultFrom(data) : DefaultSuggestions;
    return {
        searchSuggestions: searchSuggestions,
        isLoading: loading,
    };
}
var DefaultSuggestions = {
    skills: [],
    teachers: [],
};
function getSuggestionsOrDefaultFrom(data) {
    return {
        skills: (data && data.skills) || [],
        teachers: (data && data.teachers) || [],
    };
}
//# sourceMappingURL=search-suggestions.js.map