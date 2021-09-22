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
import React, { createRef } from 'react';
import { merge } from 'lodash';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { CloseIcon, SearchIcon } from '../../../Icons';
import { SearchBoxResultsMenu } from './results-menu';
import { SearchBoxStyleBrand2020 } from './styles';
export var SearchBox = function (props) {
    var SearchBoxStyle = SearchBoxStyleBrand2020;
    var activeSuggestionIndex = props.activeSuggestionIndex, inputFocused = props.inputFocused, isBackspace = props.isBackspace, query = props.query;
    var isLoading = !!props.isLoading;
    var onSearch = props.onSearch || (function () { return undefined; });
    var onCancel = props.onCancel || (function () { return undefined; });
    var onFocusChange = props.onFocusChange || (function () { return undefined; });
    var onBackspace = props.onBackspace || (function () { return undefined; });
    var keyCodes;
    (function (keyCodes) {
        keyCodes[keyCodes["Enter"] = 13] = "Enter";
        keyCodes[keyCodes["UpArrow"] = 38] = "UpArrow";
        keyCodes[keyCodes["RightArrow"] = 39] = "RightArrow";
        keyCodes[keyCodes["DownArrow"] = 40] = "DownArrow";
        keyCodes[keyCodes["Tab"] = 9] = "Tab";
        keyCodes[keyCodes["Backspace"] = 8] = "Backspace";
    })(keyCodes || (keyCodes = {}));
    var shouldSearchDefaultValue = !!props.defaultValue;
    var typeaheadRef = createRef();
    var topSuggestion = {
        mainRef: createRef(),
        substringRef: createRef(),
        remainderRef: createRef(),
        text: '',
    };
    var placeholder = inputFocused ? '' : 'What do you want to learn today?';
    var searchIconFillColor = inputFocused ? 'charcoal' : 'heather';
    searchIconFillColor = 'white';
    var data = merge(props.data, {
        skills: [],
        teachers: [],
    });
    var skills = data.skills, teachers = data.teachers;
    var suggestionsLength = skills.length + teachers.length;
    var suggestionLimit = suggestionsLength >= 1 ? suggestionsLength : 1;
    var prevQuery = '';
    var showCloseIcon = !inputFocused && query && query.length > 0;
    var getTopSuggestion = function (data) {
        if (data.skills[0]) {
            if (data.skills[0].name) {
                return data.skills[0].name;
            }
        }
        else if (data.teachers[0]) {
            if (data.teachers[0].name) {
                return data.teachers[0].name;
            }
        }
        return '';
    };
    topSuggestion.text = getTopSuggestion(data);
    var updateActiveSuggestionIndex = function (keyCode) {
        var suggestion = activeSuggestionIndex ? activeSuggestionIndex : 0;
        if (suggestion > 0 && keyCode === keyCodes.UpArrow) {
            props.onSuggestionSelect(suggestion - 1);
        }
        else if (suggestion < suggestionLimit && keyCode === keyCodes.DownArrow) {
            props.onSuggestionSelect(suggestion + 1);
        }
    };
    var inputHasEmptyValue = function () {
        return typeaheadRef.current ? typeaheadRef.current.getInstance().getInput().value.length === 0 : true;
    };
    var isQuerySubstringOfSuggestion = function (query) {
        if (query && topSuggestion.text) {
            var topSuggestionLowerCase = topSuggestion.text.toLowerCase();
            var queryLowerCase = query.toLowerCase();
            return topSuggestionLowerCase.indexOf(queryLowerCase) === 0;
        }
        return false;
    };
    var getSuggestionParts = function (query) {
        if (!isBackspace) {
            if (isQuerySubstringOfSuggestion(query)) {
                return [query, topSuggestion.text.substring(query.length, topSuggestion.text.length)];
            }
        }
        return ['', ''];
    };
    var updateTopSuggestion = function (text) {
        if (topSuggestion.substringRef.current &&
            topSuggestion.remainderRef.current &&
            !isBackspace &&
            topSuggestion.text &&
            text) {
            var topSuggestionLowerCase = topSuggestion.text.toLowerCase();
            var queryLowerCase = text.toLowerCase();
            if (topSuggestionLowerCase.indexOf(queryLowerCase) === 0 && text.length >= 3) {
                var suggestionParts_1 = getSuggestionParts(text);
                topSuggestion.substringRef.current.textContent = suggestionParts_1[0];
                topSuggestion.remainderRef.current.textContent = suggestionParts_1[1];
                props.onSuggestionSelect(1);
            }
            else {
                clearTopSuggestion();
            }
        }
    };
    var clearTopSuggestion = function () {
        if (topSuggestion.substringRef.current && topSuggestion.remainderRef.current) {
            topSuggestion.substringRef.current.textContent = '';
            topSuggestion.remainderRef.current.textContent = '';
        }
    };
    var getQueryToSubmit = function () {
        var queryToSubmit = prevQuery.length === 0 ? props.query : prevQuery;
        if (topSuggestion.mainRef.current) {
            var suggestion = topSuggestion.mainRef.current.textContent;
            if (suggestion && suggestion.length > 0 && isQuerySubstringOfSuggestion(queryToSubmit)) {
                queryToSubmit = suggestion;
            }
        }
        return queryToSubmit;
    };
    var handleEnterPress = function () {
        if (activeSuggestionIndex !== undefined) {
            if (activeSuggestionIndex > skills.length) {
                var teacher = teachers[activeSuggestionIndex - skills.length - 1];
                window.location.assign(teacher.url);
            }
            else {
                var nextQuery = getQueryToSubmit();
                var skill = skills[activeSuggestionIndex - 1];
                window.location.assign("/search?query=" + (activeSuggestionIndex === 0 ? nextQuery : skill.name));
            }
        }
    };
    var handleTabPress = function () {
        if (topSuggestion.mainRef.current && typeaheadRef.current) {
            var text = topSuggestion.mainRef.current.textContent;
            if (text && text.length > 0) {
                typeaheadRef.current.getInstance().setState({ text: text });
                onBackspace(true);
                onSearch(text);
                clearTopSuggestion();
            }
        }
    };
    var handleInitialBackspacePress = function (event) {
        var cursorPosition = 0;
        var valueLength = 0;
        if (typeaheadRef.current && typeaheadRef.current.getInstance().getInput().selectionStart) {
            cursorPosition = typeaheadRef.current.getInstance().getInput().selectionStart;
            valueLength = typeaheadRef.current.getInstance().getInput().value.length;
        }
        if (topSuggestion.substringRef.current &&
            topSuggestion.substringRef.current.textContent &&
            topSuggestion.substringRef.current.textContent.length > 0 &&
            !isBackspace &&
            cursorPosition == valueLength) {
            event.preventDefault();
            clearTopSuggestion();
            onBackspace(true);
            props.onSuggestionSelect(0);
        }
    };
    var onSearchKeyDown = function (event) {
        if (event.keyCode === keyCodes.UpArrow || event.keyCode === keyCodes.DownArrow) {
            updateActiveSuggestionIndex(event.keyCode);
        }
        else if (event.keyCode === keyCodes.Enter) {
            handleEnterPress();
        }
        else if (event.keyCode === keyCodes.Tab || event.keyCode === keyCodes.RightArrow) {
            handleTabPress();
        }
        else if (event.keyCode === keyCodes.Backspace &&
            topSuggestion.mainRef.current &&
            topSuggestion.mainRef.current.textContent) {
            handleInitialBackspacePress(event);
        }
        else if (event.keyCode > 46 && event.keyCode !== 91 && event.keyCode !== 92 && isBackspace) {
            onBackspace(false);
        }
    };
    var onMenuToggle = function (isOpen) {
        if (typeaheadRef.current) {
            var inputValue = typeaheadRef.current.getInstance().getInput().value;
            var shouldClearQuery = !isOpen && inputValue.length <= 3 && query && query.length > 0;
            if (isOpen && shouldSearchDefaultValue) {
                onSearch(inputValue);
                shouldSearchDefaultValue = false;
            }
            else if (shouldClearQuery) {
                onSearch('');
            }
        }
    };
    var onInputChange = function (text) {
        prevQuery = text;
        if (prevQuery.length === 0 && !inputFocused) {
            onFocusChange(true);
        }
        else if (prevQuery.length > 0 && inputFocused) {
            onFocusChange(false);
        }
        updateTopSuggestion(prevQuery);
    };
    var onFocus = function () {
        if (!inputFocused && inputHasEmptyValue()) {
            onFocusChange(true);
        }
    };
    var onBlur = function () {
        if (inputFocused) {
            onFocusChange(false);
        }
        if (inputHasEmptyValue()) {
            onSearch('');
        }
    };
    var onClearSearch = function () {
        if (typeaheadRef.current) {
            typeaheadRef.current.getInstance().clear();
            clearTopSuggestion();
            onSearch('');
            typeaheadRef.current.getInstance().focus();
            onFocusChange(true);
        }
    };
    var renderMenu = function () {
        return React.createElement(SearchBoxResultsMenu, __assign({}, props, { topSuggestion: topSuggestion.text }));
    };
    var suggestionParts = getSuggestionParts(query);
    if (suggestionParts[0].length > 0 && activeSuggestionIndex === 0) {
        props.onSuggestionSelect(1);
    }
    var typeaheadProps = {
        delay: 0,
        minLength: 3,
        allowNew: false,
        multiple: false,
        defaultInputValue: props.defaultValue,
        placeholder: placeholder,
        options: [],
        isLoading: isLoading,
        id: 'search-box',
        onFocus: onFocus,
        onBlur: onBlur,
        onKeyDown: onSearchKeyDown,
        onSearch: onSearch,
        onMenuToggle: onMenuToggle,
        onInputChange: onInputChange,
        renderMenu: renderMenu,
        inputProps: {
            id: 'search-box',
            'aria-label': 'Search box',
            autoComplete: 'off',
            name: Date.now().toString(),
        },
    };
    return (React.createElement(SearchBoxStyle, null,
        React.createElement("div", { className: "search-box" },
            React.createElement("div", { className: "search-box-wrapper" },
                React.createElement(SearchIcon, { className: "search-icon", width: 24, fillColor: searchIconFillColor }),
                React.createElement(AsyncTypeahead, __assign({ ref: typeaheadRef }, typeaheadProps)),
                showCloseIcon && (React.createElement(CloseIcon, { htmlColor: searchIconFillColor, className: "clear-search", onClick: onClearSearch })),
                React.createElement("div", { className: "cancel-search-overlay", onClick: onCancel }, "Cancel")),
            React.createElement("div", { className: "top-suggestion", ref: topSuggestion.mainRef },
                React.createElement("span", { className: "substring", ref: topSuggestion.substringRef }, suggestionParts[0]),
                React.createElement("span", { className: "remainder", ref: topSuggestion.remainderRef }, suggestionParts[1])),
            inputFocused && (React.createElement("div", { className: "hints" },
                "Search for ",
                React.createElement("span", null, "classes, skills, teachers"))))));
};
//# sourceMappingURL=search-box.js.map