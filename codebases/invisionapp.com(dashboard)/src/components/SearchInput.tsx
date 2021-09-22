import React, {
  useRef,
  KeyboardEvent,
  useEffect,
  RefObject,
  ChangeEvent,
} from "react";
import styled from "styled-components";
import { Text } from "@invisionapp/helios";

import AutosizeInput from "react-input-autosize";

import { useGlobalSearchUiContext } from "./GlobalSearchUiProvider";
import SearchInputPlaceHolder from "./SearchInputPlaceHolder";
import SearchInputHint from "./SearchInputHint";
import AutoSearchResults from "./SearchResults/AutoSearchResults";
import navigate from "../utils/navigate";
import trackEvent from "../utils/analytics";

interface ISearchInputContainerProps {
  onSubmitSearch?: (keywords: string, method?: string) => void;
}

interface ISearchInputProps {
  caretHidden?: boolean;
}

const StyledSearchInputContainer = styled(Text)`
  align-self: flex-start;
  display: flex;
  margin-left: 6px;
  align-items: center;
  height: 100%;
`;

const StyledInput = styled(AutosizeInput)<ISearchInputProps>`
  min-width: 4px;
  outline: none;
  z-index: 1;
  white-space: nowrap;
  overflow: hidden;
  font-size: 16px;
  border: none;
  caret-color: ${(props) => (props.caretHidden ? "transparent" : "inherit")};

  &:empty:before {
    content: "\n";
    white-space: pre;
    outline: none;
  }

  &:focus {
    outline: none;
    border: none;
  }
`;

const SearchInput: React.FunctionComponent<ISearchInputContainerProps> = ({
  onSubmitSearch,
}) => {
  const MIN_SEARCH_KEYWORDS_LENGTH = 1;
  const MAX_SEARCH_TERM_LENGTH = 100;

  const {
    keywords,
    setKeywords,
    hasFocus,
    viewType,
    isLastTagActive,
    setIsLastTagActive,
    setTags,
    setSelectedSearchOption,
    selectedSearchOption,
    setSelectedOptionText,
    selectedOptionText,
    setCloseAutoSearchModal,
    closeAutoSearchModal,
    searchResults,
    enableAutoSearch,
    setHasFocus,
  } = useGlobalSearchUiContext();

  const isAllowedKeyCode = (event: KeyboardEvent) => {
    return (
      event.keyCode === 8 || // Backspace/Delete
      event.keyCode === 13 || // Enter
      event.keyCode === 38 || // Up key
      event.keyCode === 39 || // Right key
      event.keyCode === 37 || // Left Key
      event.keyCode === 40 || // Down Key
      event.keyCode === 32 || // Space key
      event.ctrlKey || // Ctrl key
      event.metaKey // Windows or Cmd key
    );
  };

  const domNodeRef: RefObject<AutosizeInput> = useRef() as React.MutableRefObject<
    AutosizeInput
  >;

  useEffect(() => {
    if (!domNodeRef || !domNodeRef.current) {
      return;
    }

    if (hasFocus) {
      //@ts-ignore: Property 'focus' does not exist on type 'AutosizeInput'.
      domNodeRef.current.focus();
    } else {
      //@ts-ignore: Property 'focus' does not exist on type 'AutosizeInput'.
      domNodeRef.current.blur();
    }
  }, [hasFocus, domNodeRef]);

  useEffect(() => {
    if (viewType !== "search" && domNodeRef.current) {
      setKeywords("");
    }
  }, [viewType, domNodeRef, setKeywords]);

  const handleKeyDown = (e: KeyboardEvent): any => {
    if (!e.target) {
      return;
    }

    const inputText = keywords;

    if (
      !isAllowedKeyCode(e) &&
      inputText.length + e.key.length > MAX_SEARCH_TERM_LENGTH
    ) {
      e.preventDefault();
      return;
    }

    switch (e.key) {
      case "ArrowUp":
        if (!closeAutoSearchModal && selectedSearchOption >= 0) {
          const totalOptions = (searchResults && searchResults.length) || 0;
          trackEvent("App.Search.QuickList.Navigated", {
            key: "up",
            currentSearchOption:
              selectedSearchOption < totalOptions
                ? selectedSearchOption
                : "show all results",
            selectedSearchOption: selectedSearchOption - 1,
          });

          setSelectedSearchOption(selectedSearchOption - 1);
        }
        break;

      case "ArrowDown":
        if (
          !closeAutoSearchModal &&
          searchResults &&
          searchResults.length > 0 &&
          selectedSearchOption < searchResults.length // account for the "show all" menu option at the end
        ) {
          const totalOptions = (searchResults && searchResults.length) || 0;
          trackEvent("App.Search.QuickList.Navigated", {
            key: "down",
            currentSearchOption: selectedSearchOption,
            selectedSearchOption:
              selectedSearchOption + 1 < totalOptions
                ? selectedSearchOption + 1
                : "show all results",
          });

          setSelectedSearchOption(selectedSearchOption + 1);
        }
        break;

      case "Escape":
        setSelectedSearchOption(-1);
        setSelectedOptionText("");
        setCloseAutoSearchModal(true);
        setHasFocus(false);
        setIsLastTagActive(false);
        break;

      case "Enter":
        e.preventDefault();

        // Navigate the user to the selected search document/space
        if (
          searchResults &&
          selectedSearchOption !== -1 &&
          selectedSearchOption < searchResults.length
        ) {
          const searchResult = searchResults[selectedSearchOption];
          const path = searchResult?.path;

          trackEvent("App.Search.QuickList.Result.Opened", {
            resultNumber: selectedSearchOption,
            resourceType: searchResult?.resourceType,
          });

          if (path && path.length > 0) {
            navigate(path);
            return;
          }
        }

        // Otherwise trigger a search the provided keywords
        const method =
          !selectedSearchOption || selectedSearchOption === -1
            ? "search-bar"
            : "quickList-show-all-results";
        triggerSearch(inputText.substring(0, MAX_SEARCH_TERM_LENGTH), method);
        break;

      case "Delete":
      case "Backspace":
        // When keywords is empty and the user hits delete, highlight the last filter, or remove it if already highlighted (see engage-4288)
        if (inputText.length === 0) {
          if (!isLastTagActive) {
            setIsLastTagActive(true);
          } else {
            setTags([]);
            setIsLastTagActive(false);
          }
        }

        setSelectedSearchOption(-1);
        break;

      case "Control":
        break;

      case "Meta":
        break;

      default:
        setIsLastTagActive(false);
        setSelectedSearchOption(-1);
        setCloseAutoSearchModal(false);
    }
  };

  const triggerSearch = (keywords?: string | null, method?: string) => {
    if (
      onSubmitSearch &&
      keywords &&
      keywords.length >= MIN_SEARCH_KEYWORDS_LENGTH
    ) {
      onSubmitSearch(keywords, method);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target?.value) {
      setKeywords(e.target.value);
    } else {
      setKeywords("");
    }
  };

  const inputText =
    selectedSearchOption !== -1 && selectedOptionText.length > 0
      ? selectedOptionText
      : keywords;

  const PLACEHOLDER_THRESHOLD = 1; // show placeholder for under 0 char
  const showHintText =
    inputText.length >= PLACEHOLDER_THRESHOLD &&
    hasFocus &&
    ((!selectedSearchOption && selectedSearchOption !== 0) ||
      selectedSearchOption === -1);
  const showPlaceholder = inputText.length < PLACEHOLDER_THRESHOLD;

  const caretHidden = selectedSearchOption !== -1 || isLastTagActive;

  return (
    <StyledSearchInputContainer
      data-testid="search-input"
      order="body"
      size="larger"
      color="text"
    >
      <StyledInput
        autoComplete="off"
        data-testid="search-input-field"
        name="search-input"
        value={keywords}
        onKeyDown={handleKeyDown}
        onChange={handleInputChange}
        type="text"
        ref={domNodeRef}
        inputStyle={{
          border: "none",
          outline: "none",
          fontSize: "16px",
          background: "transparent",
          caretColor: caretHidden ? "transparent" : "inherit",
          fontFamily: "inherit",
          lineHeight: "24px",
          letterSpacing: "0.125px",
          fontWeight: 400,
        }}
        spellCheck={false}
      />

      {showPlaceholder && <SearchInputPlaceHolder />}
      {showHintText && <SearchInputHint hintText="- Press enter to search" />}
      {enableAutoSearch && hasFocus && (
        <AutoSearchResults onSubmitSearch={onSubmitSearch} />
      )}
    </StyledSearchInputContainer>
  );
};

export default SearchInput;
