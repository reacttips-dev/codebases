/* eslint-disable react/no-danger */
import React from 'react';

import { OPERATORS } from './constants';

import { forTemplate } from '@trello/i18n';
const format = forTemplate('search_instant_results');

const OPERATOR_DEFINITION_PAIRS = [
  [
    'at-name',
    'returns-cards-assigned-to-a-member-if-you-start-typing-at-trello-will-suggest-members-for-you-member-also-works-at-me-will-include-only-your-cards',
  ],
  [
    'label',
    'returns-labeled-cards-trello-will-suggest-labels-for-you-if-you-start-typing-and-the-label-you-are-looking-for-label-also-works',
  ],
  [
    'board-id',
    'returns-cards-within-a-specific-board-if-you-start-typing-board-trello-will-suggest-boards-for-you-you-can-search-by-board-name-too-such-as-board-trello-to-search-only-cards-on-boards-with-trello-in-the-board-name',
  ],
  [
    'list-name',
    'returns-cards-within-the-list-named-name-or-whatever-you-type-besides-name',
  ],
  [
    'has-attachments',
    'returns-cards-with-attachments-has-description-has-cover-has-members-and-has-stickers-also-work-as-you-would-expect',
  ],
  [
    'due-day',
    'returns-cards-due-within-24-hours-due-week-due-month-and-due-overdue-also-work-as-expected-you-can-search-for-a-specific-day-range-for-example-adding-due-14-to-search-will-include-cards-due-in-the-next-14-days',
  ],
  [
    'created-day',
    'returns-cards-created-in-the-last-24-hours-created-week-and-created-month-also-work-as-expected-you-can-search-for-a-specific-day-range-for-example-adding-created-14-to-the-search-will-include-cards-created-in-the-last-14-days',
  ],
  [
    'edited-day',
    'returns-cards-edited-in-the-last-24-hours-edited-week-and-edited-month-also-work-as-expected-you-can-search-for-a-specific-day-range-for-example-adding-edited-21-to-the-search-will-include-cards-edited-in-the-last-21-days',
  ],
  [
    'description-checklist-comment-and-name',
    'returns-cards-matching-the-text-of-card-descriptions-checklists-comments-or-names-for-example-comment-fix-it-will-return-cards-with-fix-it-in-a-comment',
  ],
  [
    'is-open-and-is-archived',
    'returns-cards-that-are-either-open-or-archived-trello-returns-both-types-by-default',
  ],
  ['is-starred', 'only-include-cards-on-starred-boards'],
  [
    'sort-created',
    'sorts-cards-by-date-created-sort-edited-and-sort-due-also-work-as-expected',
  ],
];

export const OperatorDefinitions = () => (
  <dl>
    {OPERATOR_DEFINITION_PAIRS.map(([operator, definition]) => (
      <div key={`search-tip-${operator}`}>
        <dt>{format(operator, OPERATORS)}</dt>
        <dd
          dangerouslySetInnerHTML={{ __html: format(definition, OPERATORS) }}
        />
      </div>
    ))}
  </dl>
);
