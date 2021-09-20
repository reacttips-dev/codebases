import React from 'react';

import styles from './board.less';
import { SectionHeader } from './section-header';
import { Tile, TileIcon, TileLink, TileLinkText, TileText } from './tile';
import { TestId } from '@trello/test-ids';

import { forTemplate } from '@trello/i18n';
const l = forTemplate('home');

interface BoardListProps {
  boardIds: string[];
  boardsType: string;
  isDraggable: boolean;
  numBoardsVisible: number;
  orgId: string;
  renderBoardTile: (
    boardId: string,
    boardsType: string,
    isDraggable: boolean,
    orgId: string,
  ) => JSX.Element;
  showAll: boolean;
}
export const BoardList: React.FunctionComponent<BoardListProps> = ({
  boardIds,
  boardsType,
  isDraggable,
  numBoardsVisible,
  orgId,
  renderBoardTile,
  showAll,
}) => (
  <>
    {boardIds.map((boardId, index) => {
      if (index < numBoardsVisible || showAll) {
        return renderBoardTile(boardId, boardsType, isDraggable, orgId);
      }
    })}
  </>
);

interface BoardSectionProps {
  boardIds: string[];
  boardsType: string;
  isDraggable: boolean;
  numBoardsVisible: number;
  onShowFewerClick: () => void;
  onShowMoreClick: () => void;
  orgId: string;
  renderBoardTile: (
    boardId: string,
    boardsType: string,
    isDraggable: boolean,
    organizationId: string,
  ) => JSX.Element;
  sectionHeaderTitle: string;
  sectionHeaderIcon: JSX.Element;
  showAll: boolean;
  testId?: TestId;
}
export const BoardSection: React.FunctionComponent<BoardSectionProps> = ({
  boardIds,
  boardsType,
  isDraggable,
  numBoardsVisible,
  onShowFewerClick,
  onShowMoreClick,
  orgId,
  renderBoardTile,
  sectionHeaderTitle,
  sectionHeaderIcon,
  showAll,
  testId,
}) => (
  <div className={styles.boardSection} data-test-id={testId}>
    <SectionHeader icon={sectionHeaderIcon}>{sectionHeaderTitle}</SectionHeader>
    <BoardList
      boardIds={boardIds}
      boardsType={boardsType}
      isDraggable={isDraggable}
      numBoardsVisible={numBoardsVisible}
      orgId={orgId}
      renderBoardTile={renderBoardTile}
      showAll={showAll}
    />
    {boardIds.length > numBoardsVisible && (
      <Tile>
        {!showAll ? (
          <TileLink onClick={onShowMoreClick} isButton>
            <TileIcon name="down" />
            <TileText>
              <TileLinkText>{l('show-more')}</TileLinkText>
            </TileText>
          </TileLink>
        ) : (
          <TileLink onClick={onShowFewerClick} isButton>
            <TileIcon name="up" />
            <TileText>
              <TileLinkText>{l('show-fewer')}</TileLinkText>
            </TileText>
          </TileLink>
        )}
      </Tile>
    )}
  </div>
);
