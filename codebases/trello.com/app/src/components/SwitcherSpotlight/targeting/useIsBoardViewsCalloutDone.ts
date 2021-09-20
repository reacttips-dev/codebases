import { useEffect, useState } from 'react';
import { TrelloStorage } from '@trello/storage';
import { NOT_A_BOARD } from 'app/src/components/SwitcherSpotlight/useCurrentBoardId';

export const useIsBoardViewsCalloutDone = (boardId: string) => {
  const [isBoardViewsCalloutDone, setIsBoardViewsCalloutDone] = useState(false);

  useEffect(() => {
    const touchpointDelayed = setTimeout(() => {
      if (boardId === NOT_A_BOARD) {
        setIsBoardViewsCalloutDone(true);
        return;
      }

      const dayInMS = 1000 * 60 * 60 * 24;
      const VIEWS_SWITCHER_CACHE_KEY = `views-switcher-callout-${boardId}`;
      const boardViewsCalloutTimestamp = TrelloStorage.get(
        VIEWS_SWITCHER_CACHE_KEY,
      );
      const boardViewsCalloutTimePass = Number.isFinite(
        boardViewsCalloutTimestamp,
      )
        ? (new Date().getTime() - boardViewsCalloutTimestamp) / dayInMS
        : 0;

      setIsBoardViewsCalloutDone(boardViewsCalloutTimePass >= 1);
    }, 3000);

    return () => {
      setIsBoardViewsCalloutDone(false);
      clearTimeout(touchpointDelayed);
    };
  }, [boardId]);

  return isBoardViewsCalloutDone;
};
