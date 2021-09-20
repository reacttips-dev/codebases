import React, { useState, useRef, useCallback } from 'react';
import { useShortcut, Scope, Key } from '@trello/keybindings';
import { forTemplate } from '@trello/i18n';
import cx from 'classnames';
import { SuggestedSearches } from './SuggestedSearches';
import { SearchResults } from './SearchResults';
import styles from './UnsplashSearch.less';
import { CloseIcon } from '@trello/nachos/icons/close';
import { track } from '@trello/analytics';
import { TopUnsplashPhotos } from './TopUnsplashPhotos';
import { Analytics } from '@trello/atlassian-analytics';
import { useSelectCoverQuery } from './SelectCoverQuery.generated';

const format = forTemplate('card_cover_chooser');

interface UnsplashSearchProps {
  cardId: string;
  onSetCover: () => void;
}

export const UnsplashSearch: React.FunctionComponent<UnsplashSearchProps> = ({
  cardId,
  onSetCover,
}) => {
  const { data } = useSelectCoverQuery({
    variables: { cardId },
    fetchPolicy: 'cache-only',
  });

  const card = data && data.card;
  const containers = {
    organization: {
      id: card?.board.idOrganization,
    },
    board: {
      id: card?.board.id,
    },
    card: {
      id: card?.id,
    },
  };

  const input = useRef<HTMLInputElement>(null);

  const [searchInputValue, setSearchInputValue] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isHoveringOverClearButton, setIsHoveringOverClearButton] = useState(
    false,
  );

  const clearSearch = useCallback(() => {
    setSearchInputValue('');
    setIsActive(false);
  }, []);

  useShortcut(
    () => {
      clearSearch();
      track('Card Cover Chooser', 'Clear Search', 'Via Escape Key');
    },
    {
      scope: Scope.Popover,
      key: Key.Escape,
      enabled: isActive,
    },
  );

  const onSuggestionSelectionCallback = useCallback((searchText: string) => {
    setSearchInputValue(searchText);

    if (input.current) {
      const searchTextLength = searchText.length;
      input.current.focus();
      input.current.setSelectionRange(searchTextLength, searchTextLength);
      track('Card Cover Chooser', 'Click Suggestion', searchText);
    }
  }, []);

  const hasValidSearchQuery = searchInputValue.trim().length > 0;
  const showSuggestedSearches = !hasValidSearchQuery;
  const showSearchResults = hasValidSearchQuery;
  const showTopPhotos = !hasValidSearchQuery;

  return (
    <div className={styles.unsplashSearch}>
      <div className={styles.unsplashSearchInputSection}>
        <input
          type="text"
          autoFocus={true}
          // eslint-disable-next-line react/jsx-no-bind
          onFocus={() => {
            Analytics.sendUIEvent({
              action: 'focused',
              actionSubject: 'input',
              actionSubjectId: 'cardCoverUnsplashSearchInput',
              source: 'unplashCoverInlineDialog',
              containers,
            });

            setIsActive(true);
          }}
          // eslint-disable-next-line react/jsx-no-bind
          onBlur={() => {
            if (!isHoveringOverClearButton) {
              setIsActive(false);
            }
          }}
          // eslint-disable-next-line react/jsx-no-bind
          onChange={(e) => {
            const query = e.currentTarget.value;
            setSearchInputValue(query);
          }}
          value={searchInputValue}
          placeholder={format('search-unsplash-for-photos')}
          // NOTE: Popovers are rendered before being visible,
          // so autoFocus won't work as expected.  For now use
          // the old autofocus mechanism that Popover knows how
          // to handle for us.
          className={cx(styles.unsplashSearchInput, 'js-autofocus')}
          ref={input}
        />

        {isActive && searchInputValue.length > 0 && (
          <button
            className={cx('button', styles.unsplashSearchClearButton)}
            // eslint-disable-next-line react/jsx-no-bind
            onMouseEnter={() => setIsHoveringOverClearButton(true)}
            // eslint-disable-next-line react/jsx-no-bind
            onMouseLeave={() => setIsHoveringOverClearButton(false)}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => {
              setIsHoveringOverClearButton(false);
              clearSearch();
              track('Card Cover Chooser', 'Clear Search', 'Via Button');
            }}
          >
            <CloseIcon
              size="small"
              dangerous_className={styles.unsplashSearchClearButtonIcon}
            />
          </button>
        )}
      </div>

      {showSuggestedSearches && (
        <SuggestedSearches onSelect={onSuggestionSelectionCallback} />
      )}

      {showTopPhotos && (
        <TopUnsplashPhotos cardId={cardId} onSetCover={onSetCover} />
      )}

      {showSearchResults && (
        <SearchResults
          cardId={cardId}
          query={searchInputValue}
          onSetCover={onSetCover}
        />
      )}
    </div>
  );
};
