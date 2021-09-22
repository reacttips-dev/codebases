var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React from 'react';
import { SearchBox as PureSearchBox } from '../search-box';
import { useSearchContext, useSearchSuggestions } from './hooks';
export var SearchBox = function (props) {
    var _a = useSearchContext(), searchContext = _a.searchContext, onSearch = _a.onSearch, onSuggestionSelect = _a.onSuggestionSelect, onFocusChange = _a.onFocusChange, onBackspace = _a.onBackspace;
    var searchSuggestions = useSearchSuggestions(searchContext).searchSuggestions;
    var nextProps = __assign(__assign(__assign({}, props), searchContext), { onSearch: onSearch,
        onSuggestionSelect: onSuggestionSelect,
        onFocusChange: onFocusChange,
        onBackspace: onBackspace, data: searchSuggestions });
    return React.createElement(PureSearchBox, __assign({}, nextProps));
};
//# sourceMappingURL=search-box.js.map