var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { utils as adobeLaunch } from "@bbyca/adobe-launch";
import { Clear, Search } from "@bbyca/bbyca-components";
import * as React from "react";
import { injectIntl } from "react-intl";
import { ClickAwayListener } from "../../..";
import { ApiSearchSuggestionsProvider } from "../../../providers/SearchSuggestionsProvider/ApiSearchSuggestionsProvider";
import * as styles from "./style.css";
import messages from "./translations/messages";
import deduplicateSearchSuggestions from "../utils/deduplicateSearchSuggestions";
const SCOPED_AUTOCOMPLETE = "scopedcategories";
const initialState = {
    search: "",
    searchSuggestions: [],
    suggestionHighlightIndex: -1,
    hasFocus: false,
    shouldBlur: true,
};
export class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.minCharacters = 2;
        this.typingDelayMilli = 500;
        this.handleOnFocus = () => {
            this.setState({ hasFocus: true });
        };
        this.setSearchSuggestions = (searchSuggestions) => {
            this.setState({ searchSuggestions, suggestionHighlightIndex: -1 });
        };
        this.setSuggestionHighlightIndex = (index) => {
            this.setState({ suggestionHighlightIndex: index });
        };
        this.submitSearch = (e) => {
            e.preventDefault();
            this.searchInput.blur();
            clearTimeout(this.typingTimer);
            this.props.onSearch(this.state.search);
            this.setSearchSuggestions([]);
        };
        this.onChange = (e) => {
            this.setState({ search: e.target.value }, () => {
                clearTimeout(this.typingTimer);
                this.typingTimer = setTimeout(this.findSearchSuggestions, this.typingDelayMilli);
            });
        };
        this.onKeyDown = (event) => {
            switch (event.key) {
                case "Enter":
                    this.searchOnEnter();
                    break;
                case "Escape":
                    event.preventDefault();
                    this.setSearchSuggestions([]);
                    break;
                case "ArrowUp":
                    event.preventDefault();
                    this.moveSuggestionHighlightUp();
                    break;
                case "ArrowDown":
                    this.moveSuggestionHighlightDown();
                    break;
            }
        };
        this.searchOnEnter = (e) => {
            const index = this.state.suggestionHighlightIndex;
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            if (index >= 0 && index < this.state.searchSuggestions.length && !this.isTouchMoving) {
                const { name, path, categoryName } = this.state.searchSuggestions[index];
                this.setState({ searchSuggestions: initialState.searchSuggestions, search: name }, () => {
                    adobeLaunch.pushEventToDataLayer({
                        event: "analytics-search-autocomplete-select",
                        payload: { search: name, category: categoryName ? categoryName : undefined }
                    });
                    this.props.onSearch(name, path);
                });
            }
        };
        this.moveSuggestionHighlightUp = () => {
            if (this.state.suggestionHighlightIndex > 0) {
                this.setSuggestionHighlightIndex(this.state.suggestionHighlightIndex - 1);
            }
            else if (this.state.suggestionHighlightIndex === 0) {
                this.setSuggestionHighlightIndex(-1);
            }
        };
        this.moveSuggestionHighlightDown = () => {
            if (this.state.suggestionHighlightIndex < this.state.searchSuggestions.length - 1) {
                this.setSuggestionHighlightIndex(this.state.suggestionHighlightIndex + 1);
            }
        };
        this.highlightSuggestionWithIndex = (index) => {
            if (index < 0 || index >= this.state.searchSuggestions.length) {
                return;
            }
            this.setSuggestionHighlightIndex(index);
        };
        this.findSearchSuggestions = () => __awaiter(this, void 0, void 0, function* () {
            if (this.props.enableSearchSuggestions && this.state.search && this.state.search.trimLeft().length >= this.minCharacters) {
                const searchSuggestionsContent = yield new ApiSearchSuggestionsProvider(this.props.searchSuggestionsApiUrl, this.props.locale, SCOPED_AUTOCOMPLETE)
                    .getSearchSuggestions(this.state.search.trimLeft());
                const deduplicated = deduplicateSearchSuggestions(searchSuggestionsContent.suggestions);
                this.setSearchSuggestions(deduplicated);
            }
            else {
                this.setSearchSuggestions([]);
            }
        });
        this.clearSearch = () => {
            this.searchInput.focus();
            this.setState({
                shouldBlur: true,
                search: "",
                searchSuggestions: [],
                suggestionHighlightIndex: -1,
            });
        };
        this.handleOnBlur = () => {
            if (this.state.shouldBlur) {
                this.setState({ hasFocus: false });
            }
        };
        this.cancelSearch = () => {
            this.setState({
                searchSuggestions: [],
                suggestionHighlightIndex: -1,
                hasFocus: false,
            });
        };
        this.renderSearchSuggestions = () => {
            const locale = this.props.locale.toLowerCase();
            return (React.createElement("ul", null, this.state.searchSuggestions.map((searchSuggestion, index) => React.createElement("li", { key: index },
                React.createElement("a", { className: (index === this.state.suggestionHighlightIndex) ?
                        `${styles.autocompleteLink} ${styles.autocompleteListHover}` :
                        styles.autocompleteLink, onClick: this.searchOnEnter, onTouchStart: () => this.highlightSuggestionWithIndex(index), onTouchMove: () => { this.isTouchMoving = true; }, onTouchEnd: () => { setTimeout(() => this.isTouchMoving = false, 0); }, onMouseOver: () => this.highlightSuggestionWithIndex(index), onMouseOut: () => this.setSuggestionHighlightIndex(-1), "data-automation": `autocomplete-entry-${index}`, href: locale + "/search?search=" + searchSuggestion.name }, this.renderSuggestionName(searchSuggestion.name, searchSuggestion.categoryName ? searchSuggestion.categoryName : null, this.state.search.trimLeft().length, index === this.state.suggestionHighlightIndex))))));
        };
        this.renderSuggestionName = (name, category, prefixLength, hover) => {
            if (category && category.length > 0) {
                return (React.createElement("span", { className: hover ? `${styles.scopedCategory} ${styles.scopedCategoryHover}` : styles.scopedCategory },
                    this.props.intl.formatMessage(messages.scopedCategoryPrefix),
                    " ",
                    category));
            }
            else {
                return (React.createElement(React.Fragment, null,
                    React.createElement("strong", null, name.substr(0, prefixLength)),
                    name.substr(prefixLength)));
            }
        };
        this.state = Object.assign(Object.assign({}, initialState), { search: props.search || "" });
        this.isTouchMoving = false;
    }
    render() {
        const hasLoadedSearchSuggestions = this.state.searchSuggestions.length > 0;
        return (React.createElement(ClickAwayListener, { active: hasLoadedSearchSuggestions, onClickAway: () => {
                this.setState({ searchSuggestions: initialState.searchSuggestions });
            } },
            React.createElement("div", null,
                " ",
                React.createElement("div", { className: styles.searchBarContainer },
                    React.createElement("form", { onSubmit: this.submitSearch, action: this.props.searchPath, className: styles.searchForm },
                        React.createElement("div", { className: `${styles.searchField} ${this.state.hasFocus ? styles.active : ""}` },
                            React.createElement("input", { ref: (input) => this.searchInput = input, className: styles.textField, "data-automation": "x-search-input", onChange: this.onChange, onKeyDown: this.onKeyDown, onFocus: this.handleOnFocus, onBlur: this.handleOnBlur, autoComplete: this.props.enableSearchSuggestions ? "off" : "on", type: "search", name: "search", value: this.state.search, placeholder: this.props.intl.formatMessage(messages.searchInputHint), "aria-label": this.props.intl.formatMessage(messages.searchInputHint) }),
                            React.createElement("div", { className: styles.buttonContainer },
                                React.createElement("button", { type: "reset", onMouseDown: () => { this.setState({ shouldBlur: false }); }, onClick: this.clearSearch, className: `${styles.clearButton} ${styles.fitContainer} ${this.state.hasFocus && this.state.search && this.state.search.length > 0 ? styles.active : ""}`, "data-automation": "x-search-clear", "aria-label": this.props.intl.formatMessage(messages.ariaLabelCloseSearch), tabIndex: this.state.search && this.state.search.length > 0 ? 0 : -1 },
                                    React.createElement(Clear, { className: `${styles.closeIcon} ${this.state.search}`, viewBox: "-8 -8 48 48" })),
                                React.createElement("button", { type: "submit", className: `${styles.searchButton} ${styles.fitContainer}`, "data-automation": "x-search-submit", "aria-label": this.props.intl.formatMessage(messages.searchButton) },
                                    React.createElement(Search, { className: styles.searchIcon, color: "blue" })))),
                        React.createElement("button", { type: "button", onClick: this.cancelSearch, "data-automation": "x-search-cancel", className: `${styles.cancelButton} ${this.state.hasFocus ? styles.active : ""}` }, this.props.intl.formatMessage(messages.cancelButton)))),
                hasLoadedSearchSuggestions &&
                    React.createElement("div", { className: styles.autocompleteContainer },
                        React.createElement("div", { className: styles.autocompleteList }, this.renderSearchSuggestions())))));
    }
    componentDidUpdate(prevProps) {
        if (this.props.search !== prevProps.search) {
            this.setState({ search: this.props.search });
        }
    }
}
export default injectIntl(SearchBar);
//# sourceMappingURL=index.js.map