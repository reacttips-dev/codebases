import React, { useState, useEffect } from 'react';
import { UnsplashSearch } from './UnsplashSearch';
import { useSelectCoverQuery } from './SelectCoverQuery.generated';
import { Analytics } from '@trello/atlassian-analytics';

interface AddCoverProps {
  cardId: string;
  navigateToSelectCover: () => void;
}

export const AddCover: React.FunctionComponent<AddCoverProps> = ({
  cardId,
  navigateToSelectCover,
}) => {
  const { data } = useSelectCoverQuery({
    variables: { cardId },
    fetchPolicy: 'cache-only',
  });

  const [hasSentScreenEvent, setHasSentScreenEvent] = useState(false);

  const card = data?.card;

  useEffect(() => {
    if (card && !hasSentScreenEvent) {
      Analytics.sendScreenEvent({
        name: 'unplashCoverInlineDialog',
        containers: {
          organization: {
            id: card.board.idOrganization,
          },
          board: {
            id: card.board.id,
          },
          card: {
            id: card.id,
          },
        },
      });
      setHasSentScreenEvent(true);
    }
  }, [card, hasSentScreenEvent]);

  return <UnsplashSearch cardId={cardId} onSetCover={navigateToSelectCover} />;
};
