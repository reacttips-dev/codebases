/* eslint-disable import/no-default-export */
import { HeaderTestIds } from '@trello/test-ids';
import { dynamicDebounce } from '@trello/time';
import classNames from 'classnames';
import { forTemplate } from '@trello/i18n';
import { ConditionalWrapper } from 'app/src/components/ConditionalWrapper';
import { SearchIcon } from '@trello/nachos/icons/search';
import { ExternalLinkIcon } from '@trello/nachos/icons/external-link';
import { Button } from '@trello/nachos/button';
import { CloseIcon } from '@trello/nachos/icons/close';
import HeaderLink from 'app/gamma/src/components/header/header-link';
import { ScreenBreakpoints } from 'app/src/components/Responsive';
import { getKey, Key, Scope, useShortcut } from '@trello/keybindings';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { ShortcutTooltip } from 'app/src/components/ShortcutTooltip/ShortcutTooltip';
import {
  clearSearchQuery,
  clearSearchSuggestions,
  getSearchSuggestions,
  performSearch,
  setSearchQuery,
  setSelectedSuggestion,
} from 'app/gamma/src/modules/state/models/search';
import { State } from 'app/gamma/src/modules/types';
import React, {
  Suspense,
  FunctionComponent,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import Media from 'react-media';
import { connect } from 'react-redux';
import { Dispatch } from 'app/gamma/src/types';
import { getBoardsByIds } from 'app/gamma/src/selectors/boards';
import { getMembersByIds } from 'app/gamma/src/selectors/members';
import {
  getCurrentSearchQuery,
  getSearchSuggestions as selectSearchSuggestions,
  getSelectedSuggestion,
  getLastSearchQuery,
} from 'app/gamma/src/selectors/search';
import styles from './form.less';
import {
  BoardModel,
  MemberModel,
  SearchSuggestionType as SuggestionType,
} from 'app/gamma/src/types/models';
import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';
import { Popover, usePopover } from '@trello/nachos/popover';
import { useLazyComponent } from '@trello/use-lazy-component';
import { useSharedState } from '@trello/shared-state';
import { headerState } from 'app/gamma/src/components/header/headerState';
import { searchState } from 'app/src/components/SearchResults';
import { SpotlightSearch } from 'app/src/components/SpotlightSearch';

const format = forTemplate('search_instant_results');
const alphabet: string =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const randomString = (length: number): string => {
  const letters: string[] = [];

  while (letters.length < length) {
    letters.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
  }

  return letters.join('');
};

// eslint-disable-next-line @trello/no-module-logic
const inputId = randomString(32);

interface SearchFormProps {
  focusRefOnDismiss: React.RefObject<HTMLElement>;
  redesign?: boolean;
}
interface StateProps {
  currentQuery: string;
  lastQuery: string;
  allSuggestions: (SuggestionType | BoardModel | MemberModel)[];
  keywords: SuggestionType[];
  boards: BoardModel[];
  members: MemberModel[];
  selectedSuggestion: string;
}

interface DispatchProps {
  clearSearchInput: () => void;
  onInputBlur: (hasQuery: boolean) => void;
  onInputClick: () => void;
  onSearch: (query: string) => void;
  onSuggest: (query: string, caretPos: number) => void;
  onSetSearchQuery: (query: string) => void;
  onSearchSuggestion: (query: string) => void;
  onSetSelectedSuggestion: (selected: string | null) => void;
}

interface AllProps extends SearchFormProps, StateProps, DispatchProps {}

function usePrevious<T>(value: T) {
  const ref = useRef<T>();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]);

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

const shortcutTooltipWrapper = (children: React.ReactElement) => (
  <ShortcutTooltip shortcutKey="/" shortcutText={format('open-search')}>
    {children}
  </ShortcutTooltip>
);

const mapStateToProps = (state: State): StateProps => {
  const { keywords, idMembers, idBoards } = selectSearchSuggestions(state);
  const boards: BoardModel[] = getBoardsByIds(state, idBoards);
  const members: MemberModel[] = getMembersByIds(state, idMembers);
  const selectedSuggestion = getSelectedSuggestion(state);
  const allSuggestions = [...keywords, ...boards, ...members];
  const currentQuery = getCurrentSearchQuery(state);
  const lastQuery = getLastSearchQuery(state);

  return {
    allSuggestions,
    currentQuery,
    lastQuery,
    keywords,
    boards,
    members,
    selectedSuggestion,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  clearSearchInput() {
    dispatch(clearSearchQuery());
  },
  onInputClick() {
    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'input',
      actionSubjectId: 'searchInput',
      source: 'appHeader',
    });
  },

  onSearch(query: string) {
    dispatch(performSearch({}));
  },

  onSuggest(query: string, caretPos: number) {
    dispatch(getSearchSuggestions(caretPos));
  },

  onSetSearchQuery(query: string) {
    dispatch(setSearchQuery({ query }));
  },

  onInputBlur(hasQuery: boolean) {
    Analytics.sendClosedComponentEvent({
      componentType: 'inlineDialog',
      componentName: 'searchInlineDialog',
      source: getScreenFromUrl(),
      attributes: {
        hasQuery,
      },
    });
  },
  onSearchSuggestion(query: string) {
    dispatch(clearSearchSuggestions());
    dispatch(setSearchQuery({ query }));
    dispatch(performSearch({}));
  },
  onSetSelectedSuggestion(selected: string | null) {
    dispatch(setSelectedSuggestion(selected));
  },
});

const SearchForm: FunctionComponent<AllProps> = ({
  currentQuery,
  lastQuery,
  allSuggestions,
  keywords,
  boards,
  members,
  selectedSuggestion,
  redesign,
  clearSearchInput,
  onInputBlur,
  onInputClick,
  onSearch,
  onSuggest,
  onSetSearchQuery,
  onSearchSuggestion,
  onSetSelectedSuggestion,
  focusRefOnDismiss,
}) => {
  const SearchResultsPopover = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "search-results-popover" */ 'app/gamma/src/components/search-results'
      ),
  );

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const searchResultsPopoverRef = useRef<HTMLDivElement>(null);

  const {
    triggerRef,
    show,
    popoverProps,
    hide,
  } = usePopover<HTMLInputElement>();
  const { isVisible, triggerElement } = popoverProps;

  const debouncedSearch = useMemo(() => {
    return dynamicDebounce(onSearch, 500);
  }, [onSearch]);

  const debouncedSuggest = useMemo(() => dynamicDebounce(onSuggest, 100), [
    onSuggest,
  ]);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  /**
   * Because the search results popover is shown/hidden in response to the
   * focus and blur events and because those events are dispatched before
   * click events, we need to call preventDefault() to keep the popover from
   * closing itself when the input is clicked.
   */
  const stopClickPropagation = useCallback(
    (e: MouseEvent) => {
      // The searchContainerRef condition is necessary to catch click events
      // that return the incorrect event target. This only happens in Chrome and
      // leads to the popover showing then immediately closing. This would happen
      // on clicks on the input element, specifically clicking on the right side
      // where the active state renders two buttons.
      if (
        e.target === triggerElement ||
        e.target === searchContainerRef?.current
      ) {
        e.preventDefault();
      }
    },
    [triggerElement],
  );
  useEffect(() => {
    document.addEventListener('click', stopClickPropagation, true);
    return () => {
      document.removeEventListener('click', stopClickPropagation, true);
    };
  }, [stopClickPropagation]);

  const onShortcut = useCallback(() => {
    show();
    Analytics.sendPressedShortcutEvent({
      shortcutName: 'searchShortcut',
      source: getScreenFromUrl(),
      keyValue: '/',
    });
  }, [show]);
  useShortcut(onShortcut, {
    scope: Scope.Global,
    key: Key.ForwardSlash,
  });

  const [{ brandingName, brandingLogo }] = useSharedState(headerState);

  // This is for when `onInputBlur` gets called without a MouseEvent
  // (namely when the user presses `Esc`). Without this, the popover closes,
  // but the input remains in the active state
  const prevIsVisible = usePrevious(isVisible);
  const prevCurrentQuery = usePrevious(currentQuery);
  useEffect(() => {
    if (triggerElement && !isVisible && prevIsVisible) {
      triggerElement.blur();
      clearSearchInput();
      searchState.setValue({
        displaySavedSearchPromo: false,
        displayAddSavedSearchForm: false,
      });
    }

    // Also needed for focus without mouse event
    if (
      triggerElement &&
      isVisible &&
      (!prevIsVisible ||
        currentQuery === '' ||
        currentQuery !== prevCurrentQuery)
    ) {
      triggerElement.focus();
    }
  }, [
    clearSearchInput,
    currentQuery,
    isVisible,
    prevCurrentQuery,
    prevIsVisible,
    triggerElement,
  ]);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.currentTarget.value;
      onSetSearchQuery(query);
      if (query.length) {
        debouncedSearch(query);
        debouncedSuggest(
          query,
          triggerElement && triggerElement.selectionStart
            ? triggerElement.selectionStart
            : 0,
        );
      }
    },
    [debouncedSearch, debouncedSuggest, onSetSearchQuery, triggerElement],
  );

  const onBlur = useCallback(() => {
    const hasQuery = !!currentQuery;
    clearSearchInput();
    hide();

    // prevents calling this twice when pressing escape
    if (isVisible) {
      searchState.setValue({
        displaySavedSearchPromo: false,
        displayAddSavedSearchForm: false,
      });
      onInputBlur(hasQuery);
    }
  }, [clearSearchInput, currentQuery, hide, onInputBlur, isVisible]);

  const onMouseDown = useCallback(() => {
    if (!isVisible) {
      onInputClick();
    }
  }, [onInputClick, isVisible]);

  const getSelectedIndex = useCallback(() => {
    let index = -1;
    if (keywords.length) {
      index = keywords.findIndex((keyword) => keyword === selectedSuggestion);
    }
    if (index === -1 && (boards.length || members.length)) {
      index = [...boards, ...members].findIndex(
        (suggestion) => suggestion.id === selectedSuggestion,
      );
    }

    return index;
  }, [boards, keywords, members, selectedSuggestion]);

  const getInitalQuery = useCallback(() => {
    return currentQuery.substring(0, currentQuery.lastIndexOf(' ') + 1);
  }, [currentQuery]);

  const onBoardSuggestion = useCallback(
    (board: BoardModel) => {
      onSearchSuggestion(`${getInitalQuery()}board:"${board.name}" `);
    },
    [getInitalQuery, onSearchSuggestion],
  );

  const onMemberSuggestion = useCallback(
    (member: MemberModel) => {
      onSearchSuggestion(`${getInitalQuery()}@${member.username} `);
    },
    [getInitalQuery, onSearchSuggestion],
  );

  const onKeywordSuggestion = useCallback(
    (keyword: string) => {
      onSearchSuggestion(`${getInitalQuery()}${keyword} `);
    },
    [getInitalQuery, onSearchSuggestion],
  );

  const onUpArrow = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (!allSuggestions.length) {
        return;
      }
      e.preventDefault();
      const index = getSelectedIndex();
      const next: number = index > 0 ? index - 1 : allSuggestions.length - 1;
      const nextSuggestion = allSuggestions[next];
      onSetSelectedSuggestion(
        // @ts-expect-error
        nextSuggestion.id ? nextSuggestion.id : nextSuggestion,
      );
    },
    [allSuggestions, getSelectedIndex, onSetSelectedSuggestion],
  );

  const onDownArrow = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (!allSuggestions.length) {
        return;
      }
      e.preventDefault();
      const index = getSelectedIndex();
      const length: number = allSuggestions.length - 1;
      const next: number = index === length ? 0 : index + 1;
      const nextSuggestion = allSuggestions[next];
      onSetSelectedSuggestion(
        // @ts-expect-error
        nextSuggestion.id ? nextSuggestion.id : nextSuggestion,
      );
    },
    [allSuggestions, getSelectedIndex, onSetSelectedSuggestion],
  );

  const onEnter = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (!allSuggestions.length) {
        return;
      }
      e.preventDefault();
      const index = getSelectedIndex();
      if (index < keywords.length) {
        onKeywordSuggestion(keywords[index]);
      } else if (
        index >= keywords.length &&
        index < keywords.length + boards.length
      ) {
        onBoardSuggestion(boards[index - keywords.length]);
      } else {
        onMemberSuggestion(members[index - (keywords.length + boards.length)]);
      }
    },
    [
      allSuggestions.length,
      boards,
      getSelectedIndex,
      keywords,
      members,
      onBoardSuggestion,
      onKeywordSuggestion,
      onMemberSuggestion,
    ],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      switch (getKey(e)) {
        case Key.Escape:
          onBlur();
          e.preventDefault();
          e.stopPropagation();
          break;

        case Key.ArrowUp:
          onUpArrow(e);
          break;

        case Key.ArrowDown:
          onDownArrow(e);
          break;

        case Key.Enter:
        case Key.Tab:
          onEnter(e);
          break;

        default:
      }
    },
    [onBlur, onDownArrow, onEnter, onUpArrow],
  );

  const onKeyDownCloseButton = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (!e.shiftKey && getKey(e) === Key.Tab) {
        e.preventDefault();
        searchResultsPopoverRef?.current?.focus({
          preventScroll: true,
        });
      }
    },
    [],
  );

  const onKeyDownSearchResultsPopover = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.shiftKey && getKey(e) === Key.Tab) {
        if (e.target === searchResultsPopoverRef.current) {
          e.preventDefault();
          closeButtonRef?.current?.focus({
            preventScroll: true,
          });
        }
      }

      if (getKey(e) === Key.Escape) {
        // set focus on logo if escape pressed from within the search results popover
        focusRefOnDismiss?.current?.focus({
          preventScroll: true,
        });
      }
    },
    [focusRefOnDismiss],
  );

  const onFocusSearchResultsPopover = useCallback(
    (e: React.FocusEvent<HTMLElement>) => {
      const searchResultsPopoverScrollableArea = e.target
        .parentNode as HTMLDivElement;
      e.preventDefault();
      // ensure search results popover doesn't scroll when reverse tabbing
      searchResultsPopoverScrollableArea.scrollTop = 0;
    },
    [],
  );

  const SearchIconWithLabel = ({ redesign }: { redesign?: boolean }) => (
    <span className={redesign ? styles.searchIconContainer : styles.buttons}>
      <label htmlFor={inputId}>
        <SearchIcon
          dangerous_className={styles.searchIcon}
          size="medium"
          color={isVisible ? 'quiet' : 'light'}
        />
      </label>
    </span>
  );

  return (
    <>
      <Popover
        {...popoverProps}
        testId={HeaderTestIds.SearchPopover}
        dangerous_disableFocusManagement
        dangerous_className={styles.popoverContent}
        dangerous_width={600}
      >
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          ref={searchResultsPopoverRef}
          /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
          tabIndex={0}
          onKeyDown={onKeyDownSearchResultsPopover}
          onFocus={onFocusSearchResultsPopover}
          className={styles.searchResultsPopover}
        >
          <Suspense fallback={null}>
            <SearchResultsPopover inputElement={triggerElement} />
          </Suspense>
        </div>
      </Popover>
      <Media
        queries={{
          small: ScreenBreakpoints.Small,
          medium: ScreenBreakpoints.Medium,
        }}
      >
        {(matches: { small: boolean; medium: boolean }) =>
          matches.small || (redesign && matches.medium && brandingName) ? (
            <span
              className={redesign ? styles.searchButtonRedesign : undefined}
            >
              <HeaderLink href="/search" buttonStyle="button">
                <SearchIcon
                  color="light"
                  size="medium"
                  dangerous_className={styles.searchIcon}
                />
              </HeaderLink>
            </span>
          ) : (
            <SpotlightSearch>
              <div
                ref={searchContainerRef}
                className={classNames(
                  styles.search,
                  isVisible && styles.active,
                  brandingLogo && styles.branded,
                  redesign && styles.searchRedesign,
                )}
              >
                <label className={styles.searchLabelText} htmlFor={inputId}>
                  {format('jump-to-verbose')}
                </label>
                <ConditionalWrapper
                  condition={!isVisible}
                  wrapper={shortcutTooltipWrapper}
                  children={
                    <input
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      className={classNames(
                        styles.searchInput,
                        isVisible && styles.searchInputActive,
                      )}
                      data-test-id={HeaderTestIds.SearchInput}
                      id={inputId}
                      onMouseDown={onMouseDown}
                      onFocus={show}
                      onKeyDown={onKeyDown}
                      onChange={onChange}
                      ref={triggerRef}
                      type="search"
                      value={currentQuery}
                      placeholder={
                        isVisible
                          ? format('search-ellipsis')
                          : redesign
                          ? format('search')
                          : format('jump-to')
                      }
                    />
                  }
                ></ConditionalWrapper>
                {redesign && <SearchIconWithLabel redesign />}
                {isVisible ? (
                  <span className={styles.buttons}>
                    <RouterLink
                      href={`/search?q=${encodeURIComponent(lastQuery)}`}
                      aria-label={format('jump-to-search-page')}
                    >
                      <ExternalLinkIcon
                        dangerous_className={classNames([
                          styles.searchIconButtons,
                          styles.externalIconButton,
                        ])}
                        size="medium"
                      />
                    </RouterLink>
                    <Button
                      className={classNames([
                        styles.searchIconButtons,
                        styles.closeIconButton,
                      ])}
                      appearance="icon"
                      type="button"
                      iconBefore={<CloseIcon size="small" />}
                      onKeyDown={onKeyDownCloseButton}
                      testId={HeaderTestIds.SearchClose}
                      ref={closeButtonRef}
                    />
                  </span>
                ) : (
                  !redesign && <SearchIconWithLabel />
                )}
              </div>
            </SpotlightSearch>
          )
        }
      </Media>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);
