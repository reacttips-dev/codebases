import StateHelper from 'helpers/state-helper';
import fuzzy from 'fuzzy';

/* Search will only search these nodes */
var NODE_FETCHERS = [
    StateHelper.getConcepts,
    StateHelper.getLessons,
    StateHelper.getParts,
];

const SearchHelper = {
    /* Returns nodes who's title matches the search term */
    search(state, term) {
        var nodes = [];

        if (term) {
            _.each(NODE_FETCHERS, (fetcher) => {
                nodes = nodes.concat(SearchHelper._searchByType(state, term, fetcher));
            });
        }

        return _.sortBy(nodes, (node) => -node._searchResult.score);
    },

    _searchByType(state, term, fetcher) {
        return SearchHelper._fuzzySearch(term, fetcher(state));
    },

    _fuzzySearch(term, nodes) {
        var results = fuzzy.filter(term, nodes, {
            pre: '<strong>',
            post: '</strong>',
            extract: (node) => node.title || '',
        });

        return _.map(results, (result) =>
            _.extend({}, nodes[result.index], {
                _searchResult: result
            })
        );
    },

    getResultHtml(node) {
        return node._searchResult.string;
    },

    constructRootNodePath(rootNodeRef) {
        let path = '';

        if (rootNodeRef.course_key) {
            path += `/courses/${rootNodeRef.course_key}`;
        }
        if (rootNodeRef.nd_key) {
            path += `/nanodegrees/${rootNodeRef.nd_key}`;
        }
        if (rootNodeRef.part_key) {
            path += `/parts/${rootNodeRef.part_key}`;
        }
        if (rootNodeRef.module_key) {
            path += `/modules/${rootNodeRef.module_key}`;
        }
        if (rootNodeRef.lesson_key) {
            path += `/lessons/${rootNodeRef.lesson_key}`;
        }
        if (rootNodeRef.concept_key) {
            path += `/concepts/${rootNodeRef.concept_key}`;
        }

        return path;
    },
};

export default SearchHelper;