/* eslint-disable import/no-default-export */
import React from 'react';
import { Droppable, DroppableProvided } from 'react-beautiful-dnd';

import {
  BoardsMenuCategoryModel,
  BoardsMenuCategoryType,
} from 'app/gamma/src/types/models';
import BoardTileList from './board-tile-list';

const CategoryContent = (category: BoardsMenuCategoryModel) => {
  return (
    <Droppable
      droppableId={category.id}
      isDropDisabled={category.type !== BoardsMenuCategoryType.Starred}
    >
      {({ droppableProps, innerRef, placeholder }: DroppableProvided) => {
        return (
          <div ref={innerRef} {...droppableProps}>
            <BoardTileList {...category} />
            {placeholder}
          </div>
        );
      }}
    </Droppable>
  );
};

export default CategoryContent;
