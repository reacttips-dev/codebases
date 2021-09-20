/* eslint-disable
 */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'card_detail',
);
const commentOptions = require('app/scripts/views/templates/comment_options');
const memberAvatarTemplate = require('./member_avatar');
const {
  seesVersionedVariation,
  featureFlagClient,
} = require('@trello/feature-flag-client');
const sidebarAction = require('app/scripts/views/templates/card_detail_sidebar_button');

const sidebarTemplate = t.renderable(function (data) {
  const {
    editable,
    isLoggedIn,
    isOnBoardTemplate,
    isSubscribed,
    isTemplate,
    isMapCore,
    isCustomFieldsCore,
    isCustomFieldsEnabled,
  } = data;

  const seeDateRangePicker = seesVersionedVariation(
    'ecosystem.timeline-version',
    'stable',
  );

  const isSuggestedCustomFieldsEnabled = featureFlagClient.get(
    'ecosystem.suggested-custom-fields',
    false,
  );

  const isCustomFieldsSkuRelcocationEnabled = featureFlagClient.get(
    'ecosystem.custom-fields-sku-relocation', 
    false,
  );

  return t.div('.window-sidebar', function () {
    // add to card section
    if (editable) {
      t.div(
        '.window-module.suggested-actions-module.js-suggested-actions.hide',
        function () {
          t.div(
            '.suggested-actions-settings.js-suggested-actions-settings',
            () => t.icon('gear'),
          );
          t.h3('.mod-no-top-margin', () => t.format('suggested'));
          t.div('.u-clearfix', () =>
            sidebarAction('js-join', 'member', 'join'),
          );
        },
      );

      t.div('.window-module.u-clearfix', function () {
        t.h3('.mod-no-top-margin.js-sidebar-add-heading', function () {
          if (isTemplate) {
            return t.format('add-to-template');
          } else {
            return t.format('add-to-card');
          }
        });
        return t.div('.u-clearfix', function () {
          if (!isOnBoardTemplate) {
            sidebarAction('js-change-card-members', 'member', 'members');
          }
          sidebarAction('js-edit-labels', 'label', 'labels');
          sidebarAction('js-add-checklist-menu', 'checklist', 'checklist');
          if (seeDateRangePicker) {
            // container for the date range picker button
            t.div('.js-date-range-picker');
          } else {
            sidebarAction('js-add-due-date', 'clock', 'due-date');
          }
          sidebarAction('js-attach', 'attachment', 'attachment');
          if (isMapCore) {
            sidebarAction('js-edit-location', 'location', 'location', false);
          }
          sidebarAction('js-card-cover-chooser', 'card-cover', 'cover');
          if (isCustomFieldsSkuRelcocationEnabled) {
            if (isCustomFieldsCore || isCustomFieldsEnabled) {
              (isSuggestedCustomFieldsEnabled && isCustomFieldsCore)
                ? t.div('.js-custom-fields')
                : sidebarAction(
                    'js-edit-fields',
                    'custom-field',
                    'custom-fields',
                    false,
                  );
            }
            else {
              sidebarAction(
                '.js-cf-disabled',
                    'custom-field',
                    'custom-fields',
                    false,
              )
              t.div('.js-card-back-custom-fields-prompt')
            }
          }
          return;
        });
      });
    }

    t.div('.js-plugin-buttons');

    if (editable) {
      t.div('.js-butler-card-buttons');
    }

    // actions section
    return t.div('.window-module.u-clearfix', function () {
      t.h3('.mod-no-top-margin', () => t.format('actions'));

      if (isLoggedIn) {
        t.div('.u-clearfix', function () {
          if (editable) {
            // NOTE vote and subscribe buttons will have their content
            // rendered as siblings. This is so that you can tab through buttons (all must be anchor tags)
            sidebarAction('js-move-card', 'move', 'move');
            sidebarAction('js-copy-card', 'copy', 'copy');
            sidebarAction(
              'js-convert-to-template.hide',
              'template-card',
              'make-template',
            );
            t.span('.js-template-sidebar-button.hide');
            if (!isOnBoardTemplate || isSubscribed) {
              t.span('.js-subscribe-sidebar-button.hide');
            }
            t.span('.js-vote-sidebar-button.hide');
            t.hr();
            sidebarAction('js-archive-card', 'archive', 'archive');
            sidebarAction('js-unarchive-card', 'refresh', 'send-to-board');
            return sidebarAction(
              'js-delete-card.hide.negate',
              'remove',
              'delete',
            );
          } else {
            sidebarAction('js-copy-card', 'card', 'copy');
            if (!isOnBoardTemplate) {
              t.a('.js-subscribe-sidebar-button.hide', { href: '#' });
            }
            return t.a('.js-vote-sidebar-button.hide', { href: '#' });
          }
        });
      }

      return sidebarAction('js-more-menu', 'share', 'share');
    });
  });
});

module.exports = t.renderable(function (data) {
  const {
    editable,
    canComment,
    me,
    loading,
    canToggleDetails,
    subscribeOnComment,
    isOnBoardTemplate,
    isSubscribed,
    cardCoverIsAttachment,
    fullCoverCardBackEnabled,
    canRecordVideo,
    isCustomFieldsCore,
    isCustomFieldsEnabled,
  } = data;

  const seeNewDateBadges = seesVersionedVariation(
    'ecosystem.timeline-version',
    'stable',
  );
  const isSuggestedCustomFieldsEnabled = featureFlagClient.get('ecosystem.suggested-custom-fields', false);

  t.div(
    '.window-cover.hide.js-card-cover-box.js-stickers-area',
    {
      class: t.classify({
        'js-open-card-cover-in-viewer': cardCoverIsAttachment,
      }),
    },
    function () {
      t.div('.window-cover-stickers.js-display-stickers');

      return t.div('.window-cover-menu.hide', function () {
        if (fullCoverCardBackEnabled) {
          return t.div('.full-cover-card-title-and-button', function () {
            t.div(
              '.window-title.js-full-cover-card-detail-title.hide',
              function () {
                t.h2('.card-detail-title-assist.js-title-helper', {
                  dir: 'auto',
                });

                const inputClasses = {
                  'mod-card-back-title': true,
                  'js-card-detail-title-input': true,
                  'full-cover-card-detail-title': true,
                };

                return t.textarea({
                  class: t.classify(inputClasses),
                  disabled: !editable,
                  dir: 'auto',
                });
              },
            );
            return t.a(
              '.window-cover-menu-button.js-card-cover-chooser',
              { href: '#' },
              function () {
                t.icon('card-cover');
                t.text(' ');
                return t.format('cover');
              },
            );
          });
        } else {
          return t.a(
            '.window-cover-menu-button.js-card-cover-chooser',
            { href: '#' },
            function () {
              t.icon('card-cover');
              t.text(' ');
              return t.format('cover');
            },
          );
        }
      });
    },
  );

  t.div('.js-card-banner');

  t.div('.window-header.js-card-detail-header', function () {
    t.span('.window-header-icon.icon-lg.icon-card.js-card-header-icon');

    const titleClasses = { 'window-title': true };

    t.div({ class: t.classify(titleClasses) }, function () {
      t.h2('.card-detail-title-assist.js-title-helper', { dir: 'auto' });

      const inputClasses = {
        'mod-card-back-title': true,
        'js-card-detail-title-input': true,
      };

      return t.textarea({
        class: t.classify(inputClasses),
        disabled: !editable,
        dir: 'auto',
      });
    });

    t.div('.window-header-inline-content.quiet.js-current-list');
    if (!isOnBoardTemplate || isSubscribed) {
      return t.div(
        '.window-header-inline-content.hide.js-subscribed-indicator-header',
        () => t.icon('subscribe'),
      );
    }
  });

  t.div('.window-main-col', function () {
    t.div('.card-detail-data.u-gutter', function () {
      t.div('.card-detail-item.js-card-detail-list.hide', function () {
        t.h3('.card-detail-item-header', () => t.format('list'));

        return t.div('.card-detail-list-badge', () =>
          t.button(
            '.button-link.card-detail-badge-list-button.js-card-detail-list-badge-button',
            () => t.span('.js-list-text'),
          ),
        );
      });

      t.div(
        '.card-detail-item.u-clearfix.hide.js-card-detail-members',
        function () {
          t.h3('.card-detail-item-header.mod-no-top-margin', () =>
            t.format('members'),
          );

          return t.div('.js-card-detail-members-list');
        },
      );

      t.div(
        '.card-detail-item.card-detail-item-labels.u-clearfix.hide.js-card-detail-labels',
        function () {
          t.h3('.card-detail-item-header', () => t.format('labels'));

          return t.div('.u-clearfix.js-card-detail-labels-list');
        },
      );

      if (seeNewDateBadges) {
        t.div('.card-detail-item.hide.js-card-detail-start-date', function () {
          t.h3('.card-detail-item-header', function () {
            t.format('start-date');
          });

          t.div(
            '.card-detail-start-date-badge.js-card-detail-start-date-badge',
            function () {
              return t.div('.card-detail-badge-start-date-react-container');
            },
          );
        });
      }

      t.div('.card-detail-item.hide.js-card-detail-due-date', function () {
        t.h3('.card-detail-item-header', () => t.format('due-date'));

        return t.div(
          '.card-detail-due-date-badge.js-card-detail-due-date-badge',
          function () {
            t.a(
              '.card-detail-badge-due-date-complete-box.js-card-detail-due-date-badge-complete',
              {
                href: '#',
                role: 'button',
              },
              () => t.span('.card-detail-badge-due-date-complete-icon'),
            );
            if (seeNewDateBadges) {
              return t.div('.card-detail-badge-due-date-react-container');
            } else {
              return t.button(
                '.button-link.card-detail-badge-due-date-button',
                function () {
                  t.span('.js-date-text.card-detail-due-date-text');
                  return t.span(
                    '.js-due-status.card-detail-due-status-lozenge',
                  );
                },
              );
            }
          },
        );
      });
      if (isCustomFieldsCore && isSuggestedCustomFieldsEnabled) {
        // move custom field here
        t.div(
          '.card-detail-item.js-custom-fields-section.hide',
          function () {
            return t.div('.custom-fields-badges-react-container');
          },          
        );
      }
      t.div('.card-detail-item.hide.js-card-detail-votes', function () {
        t.h3('.card-detail-item-header', () => t.format('votes'));

        return t.a(
          '.card-detail-badge.is-clickable.js-card-detail-votes-badge.js-show-votes',
          { href: '#' },
        );
      });

      t.div('.card-detail-item.hide.js-card-detail-age', function () {
        t.h3('.card-detail-item-header', () => t.format('last-updated'));

        return t.div(
          '.card-detail-badge.date.mod-last-updated.js-card-detail-age-badge.past',
        );
      });

      t.div('.plugin-detail-badges.js-plugin-badges');
      return t.div('.u-clearfix');
    });

    t.div('.js-fill-card-detail-desc');

    t.div('.window-module.u-clearfix.js-location-section.hide', function () {
      t.div('.window-module-title.window-module-title-no-divider', function () {
        t.span('.window-module-title-icon.icon-lg.icon-location');
        return t.h3('.u-inline-block', () => t.format('location'));
      });

      return t.div('.u-gutter', () => t.div('.u-clearfix.js-card-location'));
    });

    if (!isSuggestedCustomFieldsEnabled || !isCustomFieldsCore) {
      t.div(
        '.window-module.u-clearfix.js-custom-fields-section.hide',
        function () {
          t.div(
            '.window-module-title.window-module-title-no-divider',
            function () {
              t.span('.window-module-title-icon.icon-lg.icon-custom-field');
              return t.h3('.u-inline-block', () => t.format('custom-fields'));
            },
          );

          return t.div('.u-gutter', () =>
            t.div(
              '.u-clearfix.js-custom-field-detail-badges.custom-field-detail-badges',
            ),
          );
        },
      );
    }
    t.div('.js-plugin-card-back-sections');

    t.div('.js-plugin-sections');

    t.div('.js-plugin-suggestion-sections');

    t.div(
      '.window-module.js-trello-attachments-section.trello-attachments-section.u-clearfix.hide',
      function () {
        t.div(
          '.window-module-title.window-module-title-no-divider',
          function () {
            t.span('.window-module-title-icon.icon-lg.icon-board');
            return t.h3('.u-inline-block', () =>
              t.format('trello attachments'),
            );
          },
        );

        return t.div('.u-gutter', function () {
          t.div('.u-clearfix.js-trello-attachments-list');

          t.p('.js-show-fewer-trello-attachments.hide', () =>
            t.a(
              '.quiet-button.js-view-some-trello-attachments',
              { href: '#' },
              () => t.format('show-fewer-trello-attachments'),
            ),
          );

          t.p('.js-show-more-trello-attachments.hide', () =>
            t.a('.quiet-button.js-view-all-trello-attachments', { href: '#' }),
          );

          if (editable) {
            return t.p(() =>
              t.a(
                '.nch-button.mt-4.mb-4.js-attach-trello-attachment',
                { href: '#' },
                () => t.format('add-trello-attachment'),
              ),
            );
          }
        });
      },
    );

    t.div('.window-module.js-attachments-section.u-clearfix.hide', function () {
      t.div('.window-module-title.window-module-title-no-divider', function () {
        t.span('.window-module-title-icon.icon-lg.icon-attachment');
        return t.h3('.u-inline-block', () => t.format('attachments'));
      });

      return t.div('.u-gutter', function () {
        t.div('.u-clearfix.js-attachment-list');

        t.p('.js-show-fewer-attachments.hide', () =>
          t.a('.quiet-button.js-view-some-attachments', { href: '#' }, () =>
            t.format('show-fewer-attachments'),
          ),
        );

        t.p('.js-show-more-attachments.hide', () =>
          t.a('.quiet-button.js-view-all-attachments', { href: '#' }),
        );

        if (editable) {
          return t.p('.js-show-with-attachments.hide', () =>
            t.a('.nch-button.mt-4.mb-4.js-attach', { href: '#' }, () =>
              t.format('add-an-attachment'),
            ),
          );
        }
      });
    });

    t.div('.checklist-list.window-module.js-checklist-list.js-no-higher-edits');

    if (!isOnBoardTemplate) {
      return t.div('.window-module', function () {
        t.div(
          '.window-module-title.window-module-title-no-divider.card-detail-activity',
          function () {
            t.span('.window-module-title-icon.icon-lg.icon-activity');
            t.h3(() => t.format('activity'));
            if (canToggleDetails) {
              return t.div('.window-module-title-options', function () {
                t.span(
                  '.editing-members-comments.js-editing-members-comments.hide',
                );
                t.a('.subtle.button.hide.js-show-details', { href: '#' }, () =>
                  t.format('show-details'),
                );
                return t.a(
                  '.subtle.button.hide.js-hide-details',
                  { href: '#' },
                  () => t.format('hide-details'),
                );
              });
            }
          },
        );

        if (canComment) {
          t.div('.new-comment.js-new-comment.mod-card-back', function () {
            if (me) {
              t.div('.member.member-no-menu', () => memberAvatarTemplate(me));
            }

            t.form(() =>
              t.div('.comment-frame', () =>
                t.div('.comment-box', function () {
                  t.textarea('.comment-box-input.js-new-comment-input', {
                    'aria-label': t.l('comment-box-label'),
                    placeholder: t.l('write-a-comment-ellipsis'),
                    dir: 'auto',
                  });

                  t.div('.comment-controls.u-clearfix', function () {
                    t.input(
                      '.nch-button.nch-button--primary.confirm.mod-no-top-bottom-margin.js-add-comment',
                      {
                        disabled: 'disabled',
                        type: 'submit',
                        value: t.l('save'),
                      },
                    );
                    return t.span(
                      {
                        class: t.classify({
                          'comment-subscribe': true,
                          'is-clickable': true,
                          'is-subscribed': subscribeOnComment,
                          'js-comment-subscribe': true,
                        }),
                        'aria-label': t.l('watch-card-for-updates'),
                      },
                      function () {
                        t.span('.comment-subscribe-box', () =>
                          t.span('.comment-subscribe-icon'),
                        );
                        return t.div('.comment-subscribe-description', () =>
                          t.format('watch'),
                        );
                      },
                    );
                  });

                  return commentOptions(editable, canRecordVideo);
                }),
              ),
            );

            return t.div('.comment-too-long-warning', function () {
              t.p(() =>
                t.format(
                  'your-comment-is-too-long-you-can-add-it-as-a-text-attachment-or-truncate-it',
                ),
              );
              t.input('.nch-button.nch-button--primary.js-attach-comment', {
                type: 'submit',
                value: t.l('add-as-an-attachment'),
              });
              return t.input('.js-truncate-comment', {
                type: 'submit',
                value: t.l('truncate'),
              });
            });
          });
        }

        t.div('.js-list-actions.mod-card-back');

        if (loading) {
          t.div('.spinner.loading.js-loading-card-actions');
        }

        return t.p('.u-bottom', () =>
          t.a('.show-more.hide.js-show-all-actions', { href: '#' }, () =>
            t.format('show-all-actions-ellipsis'),
          ),
        );
      });
    }
  });

  sidebarTemplate(data);

  t.p('.dropzone', () => t.format('drop-files-to-upload'));

  t.p('.dropzone-limited.attachments-per-card', () =>
    t.format('too-many-attachments-on-card'),
  );

  t.p('.dropzone-limited.attachments-per-board', () =>
    t.format('too-many-attachments-on-board'),
  );

  return t.p('.dropzone-restricted.attachments-restricted', () =>
    t.format('attachments-restricted'),
  );
});
