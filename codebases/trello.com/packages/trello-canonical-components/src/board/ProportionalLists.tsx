import React from 'react';
import { range, sortBy } from 'underscore';
import { BoardLists } from './Board';
import { List } from './List';
import styles from './Board.less';

interface ListItem {
  id: string;
  size: number;
}

export const Card: React.FC = ({ children }) => (
  <div className={styles.card}>{children}</div>
);

const getProportionalSizes = (lists: ListItem[], numLists: number) => {
  if (!lists || lists.length === 0) {
    return [];
  } else if (lists.length === 1) {
    return [lists[0].size];
  } else {
    const sortedLists = sortBy(lists, 'size');
    const biggest = sortedLists[sortedLists.length - 1];
    const smallest = sortedLists[0];
    const disparity = (smallest.size / biggest.size) * 100;

    if (disparity < 80) {
      return lists.slice(0, numLists).map((list) => {
        if (list.size === 0) {
          return 0;
        }
        const sortedIndex = sortedLists.findIndex(
          (item) => item.id === list.id,
        );
        if (sortedIndex < sortedLists.length / 3) {
          return 1;
        } else if (sortedIndex < (sortedLists.length / 3) * 2) {
          return 2;
        } else {
          return 3;
        }
      });
    } else if (disparity < 90) {
      let smallSize = 1;
      let largeSize = 2;
      if (smallest.size > 8) {
        smallSize = 2;
        largeSize = 3;
      }

      return lists.slice(0, numLists).map((list) => {
        if (list.size === 0) {
          return 0;
        }
        const sortedIndex = sortedLists.findIndex(
          (item) => item.id === list.id,
        );
        if (sortedIndex < sortedLists.length / 2) {
          return smallSize;
        }

        return largeSize;
      });
    } else {
      return lists.slice(0, numLists).map((list) => {
        const size = list.size;
        if (!size) {
          return 0;
        } else if (size < 9) {
          return 1;
        } else if (size < 17) {
          return 2;
        } else {
          return 3;
        }
      });
    }
  }
};

export const ListOfCards = ({ size, id }: ListItem) => {
  const numCards = Math.min(size || 0, 3);

  return (
    <List key={id}>
      {range(numCards).map((c, i) => (
        <Card key={i} />
      ))}
    </List>
  );
};

export const ProportionalBoardLists = ({
  lists,
  numLists,
}: {
  lists: ListItem[];
  numLists: number;
}) => {
  const listSizes = getProportionalSizes(lists, numLists);

  return (
    <BoardLists>
      {listSizes.map((size, i) => (
        <ListOfCards size={size} id={lists[i].id} key={lists[i].id} />
      ))}
    </BoardLists>
  );
};
