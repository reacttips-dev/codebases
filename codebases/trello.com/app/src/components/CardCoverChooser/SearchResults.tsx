import React, { useState, useEffect, useCallback } from 'react';
import cx from 'classnames';
import { useSelectCoverQuery } from './SelectCoverQuery.generated';
import { useSearchUnsplashQuery } from './SearchUnsplashQuery.generated';
import { debounce } from 'underscore';
import { Spinner } from '@trello/nachos/spinner';
import { forTemplate } from '@trello/i18n';
import { InfiniteList, IterableType } from 'app/src/components/InfiniteList';
import { SearchResultImageButton } from './SearchResultImageButton';
import { Transition } from 'react-transition-group';
import styles from './SearchResults.less';
import { unsplashClient } from '@trello/unsplash';
import { Analytics } from '@trello/atlassian-analytics';

const format = forTemplate('card_cover_chooser');

interface SearchResultsProps {
  cardId: string;
  query: string;
  onSetCover: () => void;
}

export const SearchResults: React.FunctionComponent<SearchResultsProps> = ({
  cardId,
  query,
  onSetCover,
}) => {
  const PER_PAGE = 24;

  const [searchQuery, setSearchQuery] = useState(query);
  const [page, setPage] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [coverFailed, setCoverFailed] = useState(false);

  const { data, error, loading, fetchMore } = useSearchUnsplashQuery({
    skip: !searchQuery.trim().length,
    variables: {
      query: searchQuery,
      perPage: PER_PAGE,
      page: 1,
    },
    notifyOnNetworkStatusChange: true,
  });

  const { data: cardData } = useSelectCoverQuery({
    variables: { cardId },
    fetchPolicy: 'cache-only',
  });

  const card = cardData?.card;
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnSearchChange = useCallback(
    debounce((value: string) => {
      setPage(1);
      setCanLoadMore(true);
      setSearchQuery(value);
      setIsTyping(false);
    }, 500),
    [setSearchQuery, setIsTyping],
  );

  useEffect(() => {
    setIsTyping(true);
    debouncedOnSearchChange(query);
  }, [query, debouncedOnSearchChange, setIsTyping]);

  const searchResults = data && data.unsplashPhotos ? data.unsplashPhotos : [];

  const loadMore = useCallback(() => {
    if (!canLoadMore || loading) {
      return;
    }

    setPage((prevPage) => prevPage + 1);

    fetchMore({
      variables: {
        page: page + 1,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setCanLoadMore(
          !!fetchMoreResult &&
            fetchMoreResult.unsplashPhotos.length === PER_PAGE,
        );

        if (!fetchMoreResult) {
          return prev;
        }

        const existing = new Set(prev.unsplashPhotos.map((photo) => photo.id));
        const result = {
          ...prev,
          unsplashPhotos: [
            ...prev.unsplashPhotos,
            ...fetchMoreResult.unsplashPhotos.filter(
              (photo) => !existing.has(photo.id),
            ),
          ],
        };

        return result;
      },
    });
  }, [
    fetchMore,
    page,
    setPage,
    canLoadMore,
    setCanLoadMore,
    loading,
    PER_PAGE,
  ]);

  if (error || coverFailed) {
    return <div>{format('something-went-wrong')}</div>;
  }

  if (!loading && searchQuery.trim().length && !searchResults.length) {
    return <div className="quiet">{format('no-search-results')}</div>;
  }

  const showSpinner = isTyping || loading;
  const showResults =
    !!searchResults.length && !isTyping && (!loading || page > 1);

  return (
    <>
      <h4 className={styles.heading}>{format('search-results')}</h4>
      {showResults && (
        <InfiniteList
          axis="y"
          threshold="30%"
          spinnerClassName={styles.hideInfiniteListSpinner}
          itemCount={searchResults.length}
          pageSize={PER_PAGE}
          awaitMore={!loading && canLoadMore}
          loadMore={loadMore}
          isLoading={loading}
          // eslint-disable-next-line react/jsx-no-bind
          itemsRenderer={(
            items: IterableType,
            ref: (instance: React.ReactInstance) => void,
          ) => (
            <div
              className={cx(styles.searchResultTiles, styles.modFixedHeight)}
              // eslint-disable-next-line react/jsx-no-bind
              ref={(div: HTMLDivElement) => ref(div)}
            >
              {items}
            </div>
          )}
          // eslint-disable-next-line react/jsx-no-bind
          renderItem={(index: number, key: number) => {
            const { urls, links, user } = searchResults[index];
            return (
              <SearchResultImageButton
                key={key}
                urls={urls}
                links={links}
                user={user}
                index={index}
                cardId={cardId}
                onSetCover={onSetCover}
                // eslint-disable-next-line react/jsx-no-bind
                onSetCoverFailed={() => setCoverFailed(true)}
                buttonClassName={styles.searchResultTilesItem}
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() =>
                  Analytics.sendUIEvent({
                    action: 'clicked',
                    actionSubject: 'tile',
                    actionSubjectId: 'cardCoverUnsplashTile',
                    source: 'unplashCoverInlineDialog',
                    attributes: {
                      value: urls.raw,
                    },
                    containers,
                  })
                }
              />
            );
          }}
        />
      )}
      <div className={styles.searchResultsFooter}>
        <Transition in={showSpinner} timeout={85}>
          {(state) => (
            <div
              className={cx(styles.loadingColumn, {
                [styles.isExiting]: state === 'exiting',
              })}
            >
              {state !== 'exited' && (
                <Spinner inline modLeft small text={format('loading')} />
              )}
            </div>
          )}
        </Transition>
        <div className={styles.unsplashColumn}>
          {format('photos-from-unsplash', {
            unsplashLink: (
              <a
                key="a"
                className={styles.unsplashLink}
                href={unsplashClient.attributionUrl}
                rel="noreferrer noopener"
                target="_blank"
              >
                Unsplash
              </a>
            ),
          })}
        </div>
      </div>
    </>
  );
};
