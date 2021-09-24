import React, { useCallback, useEffect, useState } from 'react';
import { Box, InputRightElement, useToken, VStack } from '@chakra-ui/react';
import CloseLineIcon from 'remixicon-react/CloseLineIcon';
import SearchLineIcon from 'remixicon-react/SearchLineIcon';
import { Trans } from 'tribe-translation';
import { useDebounce } from '../hooks/useDebounce';
import { Input, InputGroup, InputLeftElement } from '../Input';
import { Text } from '../Text';
import { Table } from './Table';
export const TableSearchHeader = ({ placeholder, onSearch, }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchText = useDebounce(searchTerm, 500);
    useEffect(() => {
        onSearch === null || onSearch === void 0 ? void 0 : onSearch(debouncedSearchText);
    }, [onSearch, debouncedSearchText]);
    const handleSearchInputChange = useCallback(({ target }) => {
        const newSearchTerm = target.value;
        setSearchTerm(newSearchTerm);
    }, [setSearchTerm]);
    const resetSearch = useCallback(() => {
        setSearchTerm('');
        onSearch === null || onSearch === void 0 ? void 0 : onSearch('');
    }, [onSearch]);
    const [regularMediumTextStyle] = useToken('textStyles', ['regular/medium']);
    const [labelSecondary, labelButton] = useToken('colors', [
        'label.secondary',
        'label.button',
    ]);
    return (React.createElement(InputGroup, { py: 4, pl: "56px", borderRadius: "none", textStyle: "regular/medium", style: regularMediumTextStyle },
        React.createElement(InputLeftElement, { ml: 3, h: "full", pointerEvents: "none" },
            React.createElement(SearchLineIcon, { color: labelSecondary, size: "20px" })),
        React.createElement(Input, { value: searchTerm, onChange: handleSearchInputChange, "data-testid": "search-input", placeholder: placeholder, variant: "unstyled", textStyle: "regular/medium", sx: {
                borderRadius: 'none',
            } }),
        searchTerm && (React.createElement(InputRightElement, { h: "full", mr: 3 },
            React.createElement(Box, { bgColor: "label.secondary", borderRadius: "full", cursor: "pointer", onClick: resetSearch },
                React.createElement(CloseLineIcon, { "data-testid": "clear-search-button", color: labelButton, size: "16px" }))))));
};
export const TableEmptyState = () => {
    return (React.createElement(VStack, null,
        React.createElement(Text, { color: "label.primary", textStyle: "medium/medium" },
            React.createElement(Trans, { key: "common:table.empty.title", defaults: "No results" })),
        React.createElement(Text, { color: "label.secondary", textStyle: "medium/small" },
            React.createElement(Trans, { key: "common:table.empty.description", defaults: "" }))));
};
export const TableSearchEmptyState = () => (React.createElement(VStack, null,
    React.createElement(Text, { color: "label.primary", textStyle: "medium/medium" },
        React.createElement(Trans, { key: "member:list.no_result.title", defaults: "No results" })),
    React.createElement(Text, { color: "label.secondary", textStyle: "medium/small" },
        React.createElement(Trans, { key: "member:list.no_result.description", defaults: "You may want to try searching for something else." }))));
export const TableLoading = ({ columns, }) => (React.createElement(Table, { data: [{}, {}, {}], total: 0, hasMore: false, showColumnsFilter: false, showHeaders: false, loading: true, columns: columns }));
//# sourceMappingURL=TableSearchHeader.js.map