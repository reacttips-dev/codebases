import React from 'react';
import { useSelectCoverQuery } from './SelectCoverQuery.generated';
import { useSearchUnsplashQuery } from './SearchUnsplashQuery.generated';
import { forTemplate } from '@trello/i18n';
import { SearchResultImageButton } from './SearchResultImageButton';
import { unsplashClient } from '@trello/unsplash';
import { Analytics } from '@trello/atlassian-analytics';
import styles from './TopUnsplashPhotos.less';
import { noop } from 'app/src/noop';

const format = forTemplate('card_cover_chooser');

interface TopUnsplashPhotosProps {
  cardId: string;
  onSetCover: () => void;
}

export const TopUnsplashPhotos: React.FunctionComponent<TopUnsplashPhotosProps> = ({
  cardId,
  onSetCover,
}) => {
  const { data: topPhotosData } = useSearchUnsplashQuery({
    variables: {
      query: '',
      perPage: 9,
      page: 1,
    },
    fetchPolicy: 'cache-only',
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

  const topPhotos =
    topPhotosData && topPhotosData.unsplashPhotos
      ? topPhotosData.unsplashPhotos
      : [];

  if (!topPhotos.length) {
    return null;
  }

  return (
    <div>
      <h4 className={styles.heading}>{format('top-photos')}</h4>
      <div className={styles.unsplashTiles}>
        {topPhotos.slice(0, 12).map(({ urls, links, user, id }, index) => (
          <SearchResultImageButton
            key={id}
            urls={urls}
            links={links}
            user={user}
            index={index}
            cardId={cardId}
            onSetCover={onSetCover}
            onSetCoverFailed={noop}
            buttonClassName={styles.unsplashTilesItem}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() =>
              Analytics.sendUIEvent({
                action: 'clicked',
                actionSubject: 'tile',
                actionSubjectId: 'cardCoverUnsplashTile',
                source: 'cardCoverInlineDialog',
                attributes: {
                  value: urls.raw,
                },
                containers,
              })
            }
          />
        ))}
      </div>

      <div className={styles.searchResultsFooter}>
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
    </div>
  );
};
