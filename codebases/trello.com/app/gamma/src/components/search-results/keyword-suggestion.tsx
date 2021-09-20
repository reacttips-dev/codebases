/* eslint-disable import/no-default-export */
import { forNamespace } from '@trello/i18n';
import React from 'react';
import { SearchSuggestionType as SuggestionType } from 'app/gamma/src/types/models';
import preventDefault from 'app/gamma/src/util/prevent-default';
import styles from './search-results.less';
import { Button } from '@trello/nachos/button';

const format = forNamespace('search');
const StringMap = new Map([
  [SuggestionType.IsArchived, format('only include archived cards')],
  [SuggestionType.IsOpen, format('only include open cards')],
  [SuggestionType.IsStarred, format('only include cards on starred boards')],
  [
    SuggestionType.HasAttachments,
    format('only include cards with attachments'),
  ],
  [SuggestionType.HasCover, format('only include cards with a cover')],
  [
    SuggestionType.HasDescription,
    format('only include cards that have a description'),
  ],
  [SuggestionType.HasStickers, format('only include cards that have stickers')],
  [
    SuggestionType.HasMembers,
    format('only include cards that have members assigned'),
  ],
  [SuggestionType.List, format('cards in the list with matching text')],
  [SuggestionType.Member, format('cards assigned to a member')],
  [SuggestionType.At, format('cards assigned to a member')],
  [SuggestionType.Me, format('only include cards assigned to me')],
  [SuggestionType.Label, format('cards with this label')],
  [SuggestionType.Hash, format('cards with this label')],
  [SuggestionType.Board, format('only cards on a particular board')],
  [SuggestionType.Name, format('cards that match text in the name')],
  [SuggestionType.Comment, format('cards that match text in the comment')],
  [SuggestionType.Checklist, format('cards that match text in a checklist')],
  [
    SuggestionType.Description,
    format('cards that match text in the description'),
  ],
  [SuggestionType.DueDay, format('cards due in the next 24 hours')],
  [SuggestionType.DueWeek, format('cards due in the next 7 days')],
  [SuggestionType.DueMonth, format('cards due in the next 28 days')],
  [SuggestionType.Overdue, format('cards that are past due')],
  [SuggestionType.Incomplete, format('cards that are incomplete')],
  [
    SuggestionType.Complete,
    format('cards that have due dates marked complete'),
  ],
  [SuggestionType.CreatedDay, format('cards created in the last 24 hours')],
  [SuggestionType.CreatedWeek, format('cards created in the last 7 days')],
  [SuggestionType.CreatedMonth, format('cards created in the last 28 days')],
  [SuggestionType.EditedDay, format('cards edited in the last 24 hours')],
  [SuggestionType.EditedWeek, format('cards edited in the last 7 days')],
  [SuggestionType.EditedMonth, format('cards edited in the last 28 days')],
  [SuggestionType.SortCreated, format('sort cards by date created')],
  [SuggestionType.SortEdited, format('sort cards by date edited')],
  [SuggestionType.SortDue, format('sort cards by due date')],
]);

interface KeywordSuggestionProps {
  keyword: SuggestionType;
  onClick: (query: string) => void;
  setSelectedSuggestion: (selected: string | null) => void;
}

class KeywordSuggestion extends React.Component<KeywordSuggestionProps> {
  highlightSuggestion = () => {
    this.props.setSelectedSuggestion(this.props.keyword);
  };

  unhighlightSuggestion = () => {
    this.props.setSelectedSuggestion(null);
  };

  onClick = preventDefault(() => {
    this.props.onClick(this.props.keyword);
  });

  render() {
    const { keyword } = this.props;

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
          {keyword}
          <span className={styles.keywordDescription}>
            {` ${StringMap.get(keyword)}`}
          </span>
        </span>
      </Button>
    );
  }
}

export default KeywordSuggestion;
