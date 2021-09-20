/* eslint-disable import/no-default-export */
import { forTemplate } from '@trello/i18n';
import React from 'react';
import { BoardModel } from 'app/gamma/src/types/models';
import preventDefault from 'app/gamma/src/util/prevent-default';
import styles from './search-results.less';
import { Button } from '@trello/nachos/button';

const formatBoardResult = forTemplate('search_suggetion_board');

interface BoardSuggestionProps {
  board: BoardModel;
  onClick: (board: BoardModel) => void;
  setSelectedSuggestion: (selected: string | null) => void;
}

class BoardSuggestion extends React.Component<BoardSuggestionProps> {
  highlightSuggestion = () => {
    this.props.setSelectedSuggestion(this.props.board.id);
  };

  unhighlightSuggestion = () => {
    this.props.setSelectedSuggestion(null);
  };

  onClick = preventDefault(() => {
    this.props.onClick(this.props.board);
  });

  render() {
    const { board } = this.props;

    return (
      <Button
        appearance="subtle"
        size="fullwidth"
        className={styles.suggestionBtn}
        onClick={this.onClick}
        onMouseEnter={this.highlightSuggestion}
        onMouseLeave={this.unhighlightSuggestion}
        onFocus={this.highlightSuggestion}
      >
        <span>
          {formatBoardResult('cards-on-the-board-name', {
            name: (
              <strong key={`strong-suggestion-${board.id}`}>
                {board.name}
              </strong>
            ),
          })}
        </span>
      </Button>
    );
  }
}

export default BoardSuggestion;
