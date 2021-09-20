/* eslint-disable import/no-default-export */
import React from 'react';
import { N40A } from '@trello/colors';
import { Board } from './Board';
import { ProportionalBoardLists } from './ProportionalLists';
import styles from './Board.less';

export const PlaceholderBoardTile = ({
  numLists,
  className,
}: {
  className?: string;
  numLists: number;
}) => (
  <Board className={className} bgColor={N40A} loading numLists={numLists}>
    <span className={styles.placeholderTopBar} />

    <ProportionalBoardLists
      lists={[
        { id: '1', size: 2 },
        { id: '2', size: 3 },
        { id: '3', size: 1 },
        { id: '4', size: 2 },
        { id: '5', size: 2 },
        { id: '6', size: 1 },
      ]}
      numLists={numLists}
    />
  </Board>
);

export default PlaceholderBoardTile;
