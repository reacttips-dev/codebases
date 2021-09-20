// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'search_help_popover',
);

module.exports = t.renderable(function () {
  const formatWithArgs = (text) =>
    t.format(text, {
      archived: 'archived',
      attachments: 'attachments',
      board: 'board',
      checklist: 'checklist',
      comment: 'comment',
      cover: 'cover',
      created: 'created',
      day: 'day',
      description: 'description',
      due: 'due',
      edited: 'edited',
      has: 'has',
      id: 'id',
      is: 'is',
      label: 'label',
      list: 'list',
      member: 'member',
      members: 'members',
      month: 'month',
      name: 'name',
      open: 'open',
      overdue: 'overdue',
      sort: 'sort',
      starred: 'starred',
      stickers: 'stickers',
      week: 'week',
    });

  return t.div('.search-tips.js-no-input', () =>
    t.div('.search-tips-list.js-search-tips-list', function () {
      t.p('.quiet', () => formatWithArgs('intro-text'));

      return t.dl(function () {
        t.dt(() => t.format('at-name'));
        t.dd(() =>
          formatWithArgs(
            'returns-cards-assigned-to-a-member-member-also-works-me-will-include-only-your-cards',
          ),
        );

        t.dt(() => t.format('label'));
        t.dd(() =>
          formatWithArgs(
            'returns-labeled-cards-trello-will-suggest-labels-for-you-if-you-start-typing-and-the-label-you-are-looking-for-label-also-works',
          ),
        );

        t.dt(() => formatWithArgs('list-name'));
        t.dd(() =>
          formatWithArgs(
            'returns-cards-within-the-list-named-name-or-whatever-you-type-besides-name',
          ),
        );

        t.dt(() => formatWithArgs('has-attachments'));
        t.dd(() =>
          formatWithArgs(
            'returns-cards-with-attachments-has-description-has-cover-has-members-and-has-stickers-also-work-as-you-would-expect',
          ),
        );

        t.dt(() => formatWithArgs('due-day'));
        t.dd(() =>
          formatWithArgs(
            'returns-cards-due-within-24-hours-due-week-due-month-and-due-overdue-also-work-as-expected-you-can-search-for-a-specific-day-range-for-example-adding-due-14-to-search-will-include-cards-due-in-the-next-14-days',
          ),
        );

        t.dt(() => formatWithArgs('created-day'));
        t.dd(() =>
          formatWithArgs(
            'returns-cards-created-in-the-last-24-hours-created-week-and-created-month-also-work-as-expected-you-can-search-for-a-specific-day-range-for-example-adding-created-14-to-the-search-will-include-cards-created-in-the-last-14-days',
          ),
        );

        t.dt(() => formatWithArgs('edited-day'));
        t.dd(() =>
          formatWithArgs(
            'returns-cards-edited-in-the-last-24-hours-edited-week-and-edited-month-also-work-as-expected-you-can-search-for-a-specific-day-range-for-example-adding-edited-21-to-the-search-will-include-cards-edited-in-the-last-21-days',
          ),
        );

        t.dt(() => formatWithArgs('description-checklist-comment-and-name'));
        t.dd(() =>
          formatWithArgs(
            'returns-cards-matching-the-text-of-card-descriptions-checklists-comments-or-names-for-example-comment-fix-it-will-return-cards-with-fix-it-in-a-comment',
          ),
        );

        t.dt(() => formatWithArgs('sort-created'));
        return t.dd(() =>
          formatWithArgs(
            'sorts-cards-by-date-created-sort-edited-and-sort-due-also-work-as-expected',
          ),
        );
      });
    }),
  );
});
