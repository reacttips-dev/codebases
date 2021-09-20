/* eslint-disable
    eqeqeq,
    no-cond-assign,
    no-prototype-builtins,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const _ = require('underscore');
const f = require('effing');
const React = require('react');
const Promise = require('bluebird');
const { Util } = require('app/scripts/lib/util');
const Layout = require('app/scripts/views/lib/layout');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const AttachmentTypePickerView = require('app/scripts/views/card/attachment-type-picker-view');
const { Analytics } = require('@trello/atlassian-analytics');
const TrelloCompleterView = require('app/scripts/views/internal/autocomplete/trello-completer-view');
const UploadingLinkView = require('app/scripts/views/card/uploading-link-view');
const LimitExceeded = require('app/scripts/views/attachment/attachment-limit-exceeded-error');
const Alerts = require('app/scripts/views/lib/alerts');
const AttachmentHelpers = require('app/scripts/views/attachment/helpers');
const PluginRunner = require('app/scripts/views/internal/plugins/plugin-runner');
const PluginModelSerializer = require('app/scripts/views/internal/plugins/plugin-model-serializer');
const {
  PowerUpSuggestionContainer,
  getClaimedSecondLevelDomainsToPluginMapForOrg,
  doesMatchClaimedDomain,
  getSecondLevelDomain,
} = require('app/src/components/PowerUpAttachmentSectionSuggestion');
const pluginValidators = require('app/scripts/lib/plugins/plugin-validators');
const PluginSectionView = require('app/scripts/views/plugin/plugin-section-view');
const {
  sendPluginViewedComponentEvent,
} = require('app/scripts/lib/plugins/plugin-behavioral-analytics');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const InProgressAttachmentView = require('app/scripts/views/attachment/in-progress-attachment');
const { l } = require('app/scripts/lib/localize');
const TrelloBoardAttachment = require('app/scripts/views/attachment/trello-board-attachment');
const TrelloCardAttachment = require('app/scripts/views/attachment/trello-card-attachment');
const AttachmentThumbView = require('app/scripts/views/attachment/attachment-thumb-view');
const pastedFileName = require('app/scripts/views/internal/pasted-file-name');
const warnIfFileTooLarge = require('app/scripts/views/internal/warn-if-file-too-large');
const { ninvoke } = require('app/scripts/lib/util/ninvoke');
const { parseTrelloUrl } = require('app/scripts/lib/util/url/parse-trello-url');
const DragSort = require('app/scripts/views/lib/drag-sort');
const { featureFlagClient } = require('@trello/feature-flag-client');

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

module.exports.incrementNumAttachmentsProcessing = function (count) {
  if (count == null) {
    count = 1;
  }
  return this.numAttachmentsProcessing.update(f.add(count));
};

module.exports.decrementNumAttachmentsProcessing = function (count) {
  // The number of attachments decrements in a callback after a promise. If the user has moved to another route in
  // the meantime, then this callback will be fired when the attachment has finished uploading and throw exceptions.
  if (count == null) {
    count = 1;
  }
  if (this.rendered === true) {
    return this.numAttachmentsProcessing.update(f.sub(count));
  }
};

module.exports.incrementNumTrelloAttachmentsProcessing = function (count) {
  if (count == null) {
    count = 1;
  }
  return this.numTrelloAttachmentsProcessing.update(f.add(count));
};

module.exports.decrementNumTrelloAttachmentsProcessing = function (count) {
  if (count == null) {
    count = 1;
  }
  return this.numTrelloAttachmentsProcessing.update(f.sub(count));
};

module.exports.attachComment = function (e) {
  const file = new Blob([this.$('.js-new-comment-input').val()], {
    type: 'text/plain',
  });
  this.incrementNumAttachmentsProcessing();
  this.model.upload(
    file,
    'comment.txt',
    {},
    this.callback(() => this.decrementNumAttachmentsProcessing()),
  );

  this.clearComment();
  Layout.cancelEdits();
  return this.collapseComment();
};

module.exports.openAttachPicker = function (e) {
  Util.stop(e);

  Analytics.sendClickedButtonEvent({
    buttonName: 'attachmentButton',
    source: 'cardDetailScreen',
    containers: this.model.getAnalyticsContainers(),
  });

  const elem = $(e.target).closest('.js-attach');

  PopOver.toggle({
    elem,
    view: AttachmentTypePickerView,
    options: {
      model: this.model,
      modelCache: this.modelCache,
      onStartUpload: (card, type) => {
        if (type === 'card' || type === 'board') {
          return this.incrementNumTrelloAttachmentsProcessing();
        } else {
          return this.incrementNumAttachmentsProcessing();
        }
      },
      onFinishUpload: (card, type) => {
        if (type === 'card' || type === 'board') {
          return this.decrementNumTrelloAttachmentsProcessing();
        } else {
          return this.decrementNumAttachmentsProcessing();
        }
      },
    },
  });

  const type = $(elem).hasClass('inline')
    ? 'Inline'
    : $(elem).hasClass('quiet-button')
    ? 'Quiet'
    : 'Sidebar';
  Analytics.sendScreenEvent({
    name: 'cardAttachmentPickerInlineDialog',
    attributes: {
      type,
      cardIsTemplate: this.model.get('isTemplate'),
      cardIsClosed: this.model.get('closed'),
    },
    containers: this.model.getAnalyticsContainers(),
  });

  return false;
};

module.exports.openAttachTrelloPicker = function (e) {
  Util.stop(e);

  const elem = $(e.target).closest('.js-attach-trello-attachment');

  Analytics.sendClickedButtonEvent({
    buttonName: 'trelloAttachmentButton',
    source: 'cardDetailScreen',
    containers: this.model.getAnalyticsContainers(),
  });

  PopOver.toggle({
    elem,
    view: TrelloCompleterView,
    options: {
      model: this.model,
      modelCache: this.modelCache,
      card: this.model,
      button: true,
      onStartUpload: (card) => {
        this.incrementNumTrelloAttachmentsProcessing();

        PopOver.pushView({
          view: UploadingLinkView,
        });

        const url = card.get('url');
        return Promise.fromNode((next) => this.model.uploadUrl(url, next))
          .catch(LimitExceeded, () => {
            return Alerts.show(
              'unable to attach card or board',
              'error',
              'trelloattachment',
              5000,
            );
          })
          .then(() => PopOver.popView())
          .finally(() => {
            return this.decrementNumTrelloAttachmentsProcessing();
          });
      },
    },
  });

  Analytics.sendScreenEvent({
    name: 'trelloAddCardInlineDialog',
    attributes: {
      cardIsTemplate: this.model.get('isTemplate'),
      cardIsClosed: this.model.get('closed'),
    },
    containers: this.model.getAnalyticsContainers(),
  });

  return false;
};

module.exports.renderAddAttachments = function () {
  const disabled = !this.model.canAttach();
  this.$('.js-attach,.js-attach-trello-attachment,.js-attach-link').toggleClass(
    'disabled',
    disabled,
  );

  return this;
};

module.exports.showFewerAttachments = function (e) {
  Util.stop(e);
  this.fShowAllAttachments = false;
  this.renderAttachments();
};

module.exports.showMoreAttachments = function (e) {
  Util.stop(e);
  this.fShowAllAttachments = true;
  this.renderAttachments();
};

module.exports.showFewerTrelloAttachments = function (e) {
  Util.stop(e);
  this.fShowAllTrelloAttachments = false;
  this.renderAttachments();
};

module.exports.showMoreTrelloAttachments = function (e) {
  Util.stop(e);
  this.fShowAllTrelloAttachments = true;
  this.renderAttachments();
};

function oldRenderAttachments() {
  if (this._renderAttachmentsPromise != null) {
    this._renderAttachmentsPromise.cancel();
  }

  const initialAttachments = _.clone(
    this.model.attachmentList.models,
  ).reverse();

  const board = this.model.getBoard();

  // Immediately remove any attachment thumbnails that have been deleted
  // without waiting for power-ups
  _.chain([AttachmentThumbView, TrelloCardAttachment, TrelloBoardAttachment])
    .map((Type) => this.subviewsOfType(Type))
    .flatten()
    .filter((subview) => !initialAttachments.includes(subview.model))
    .each((subview) => this.deleteSubview(subview));

  // Render a loading state for each attachment that will appear in the Attachments section
  const $attachmentsSection = this.$('.js-attachments-section');
  const $attachmentsList = $attachmentsSection.find('.js-attachment-list');
  const nonTrelloAttachments = initialAttachments.filter((attachment) => {
    const trelloAttachmentTypes = ['card', 'board'];
    return !trelloAttachmentTypes.includes(
      parseTrelloUrl(attachment.get('url')).type,
    );
  });
  const loadedAttachments = this.subviewsOfType(AttachmentThumbView);
  // only for initial load
  if (!loadedAttachments.length) {
    const loadingCount = nonTrelloAttachments.length;
    const loadingSubviews = loadingCount
      ? _.times(Math.min(3, loadingCount), (index) => {
          return this.subview(
            InProgressAttachmentView,
            this.model,
            { isLoadingVersion: true },
            `loading-${index}`,
          );
        })
      : [];
    if (loadingSubviews.length > 0) {
      $attachmentsSection.toggleClass('hide', _.isEmpty(nonTrelloAttachments));
      this.ensureSubviews(loadingSubviews, $attachmentsList);
    }
  }

  this._renderAttachmentsPromise = Promise.all([
    Promise.all(initialAttachments.map(AttachmentHelpers.getAttachmentData)),

    Promise.try(() => {
      if (initialAttachments.length > 0) {
        return PluginRunner.all({
          timeout: 5000,
          command: 'attachment-sections',
          card: this.model,
          board: this.model.getBoard(),
          options: {
            entries: PluginModelSerializer.attachments(initialAttachments),
          },
        });
      } else {
        return [];
      }
    }).cancellable(),

    Promise.try(() => {
      if (initialAttachments.length > 0) {
        return getClaimedSecondLevelDomainsToPluginMapForOrg(
          board.get('idOrganization'),
          board.id,
        );
      }
    }),
  ])
    .spread((retrievedAttachmentData, pluginAttachmentSections, domainsMap) => {
      // Between the time we started rendering and now, attachments may have been
      // removed
      const filterRemoved = featureFlagClient.get(
        'fep.filter-removed-attachments',
        false,
      );
      const remainingAttachmentIds = new Set(
        this.model.attachmentList.pluck('id'),
      );
      const allAttachments = filterRemoved
        ? initialAttachments.filter((attachment) =>
            remainingAttachmentIds.has(attachment.id),
          )
        : initialAttachments;
      const allAttachmentData = filterRemoved
        ? retrievedAttachmentData.filter((data) =>
            remainingAttachmentIds.has(data.id),
          )
        : retrievedAttachmentData;

      let processingCount, processingTrelloAttachmentsCount;
      const displayedInSection = {};
      const usedSubviewIds = {};

      let subviews = _.chain(pluginAttachmentSections)
        .filter((section) =>
          pluginValidators.isValidAttachmentSections(
            section,
            this.model.attachmentList,
          ),
        )
        .map((section) => {
          _.forEach(
            section.claimed,
            (entry) => (displayedInSection[entry.id] = true),
          );

          let subviewId = section.id || section.title;
          if (_.isFunction(subviewId) || usedSubviewIds[subviewId]) {
            subviewId = _.uniqueId('attachment-section_');
          }
          usedSubviewIds[subviewId] = true;
          const subview = this.subview(
            PluginSectionView,
            this.model,
            {},
            subviewId,
          );
          subview.updateSection(section);
          return subview;
        })
        .value();

      let trelloAttachments = this.getTrelloAttachments(
        allAttachments,
        allAttachmentData,
        displayedInSection,
      );
      trelloAttachments.forEach(
        ({ attachment }) => (displayedInSection[attachment.id] = true),
      );

      _.chain(pluginAttachmentSections)
        .pluck('idPlugin')
        .uniq()
        .each((idPlugin) => {
          sendPluginViewedComponentEvent({
            idPlugin: idPlugin,
            idBoard: board.id,
            idCard: this.model.id,
            event: {
              componentType: 'section',
              componentName: 'pupAttachmentSection',
              source: 'cardDetailScreen',
            },
          });
        });

      const $pluginSections = this.$('.js-plugin-sections');
      this.ensureSubviews(subviews, $pluginSections);

      // render the PASS views
      const suggestionSectionsToRender = {};
      // for each attachment that's not been claimed by another attachment section
      // see if attachment's url's second level domain matches any in domain map
      // if so, check the attachment's url against that plugin's claimedDomains
      // then add this attachment to that plugin's PASS section on the card back
      allAttachmentData.forEach((attachment) => {
        if (displayedInSection[attachment.id]) {
          return;
        }

        // grab second-level domain, e.g 'https://na36.salesforce.com/008' to 'salesforce.com'
        const attachmentDomain = getSecondLevelDomain(attachment.url);

        const possiblePlugins = domainsMap[attachmentDomain];
        if (!possiblePlugins || possiblePlugins.length === 0) {
          return;
        }

        // which of the possible plugins actually matches, if any
        const plugin = possiblePlugins.find((testPlugin) =>
          testPlugin
            .get('claimedDomains')
            .some((domain) => doesMatchClaimedDomain(attachment.url, domain)),
        );

        if (!plugin || !board.shouldRenderPluginSuggestionSection(plugin.id)) {
          return;
        }

        displayedInSection[attachment.id] = true;
        const pluginName = plugin.get('name');
        if (suggestionSectionsToRender[plugin.id]) {
          return suggestionSectionsToRender[plugin.id].attachments.push(
            attachment,
          );
        } else {
          return (suggestionSectionsToRender[plugin.id] = {
            attachments: [attachment],
            name: pluginName,
            overview: plugin.get('listing').overview,
            mark: plugin.get('icon').url,
            onRemoveAttachment(idAttachment) {
              return __guard__(
                allAttachments.find((a) => a.id === idAttachment),
                (x) => x.destroy(),
              );
            },
            onDismissBtn: (target) =>
              this.dismissPluginSuggestionSection(
                target.closest('button'),
                plugin.id,
              ),
            onEnableBtn: (target) =>
              this.enableSuggestedPluginPrompt(
                target.closest('button'),
                plugin,
              ),
          });
        }
      });

      if (!this.trackedSuggestionSections) {
        this.trackedSuggestionSections = {};
      }
      Object.keys(suggestionSectionsToRender).forEach((idSuggestedPlugin) => {
        // prevent double tracking on re-renders of attachments
        if (!this.trackedSuggestionSections[idSuggestedPlugin]) {
          this.trackedSuggestionSections[idSuggestedPlugin] = true;
          return sendPluginViewedComponentEvent({
            idPlugin: idSuggestedPlugin,
            idBoard: board.id,
            idCard: this.model.id,
            event: {
              componentType: 'section',
              componentName: 'pupAttachmentSuggestionSection',
              source: 'cardDetailScreen',
            },
          });
        }
      });

      renderComponent(
        <PowerUpSuggestionContainer
          suggestionProps={Object.values(suggestionSectionsToRender)}
        />,
        this.$('.js-plugin-suggestion-sections')[0],
      );

      const initialNumToShow = 4;
      let numShown = 0;
      const remainingAttachments = [];

      for (const i in allAttachments) {
        const attachment = allAttachments[i];
        if (
          numShown === initialNumToShow ||
          numShown === allAttachments.length
        ) {
          break;
        }

        remainingAttachments.push(attachment);

        if (!displayedInSection.hasOwnProperty(attachment.id)) {
          numShown++;
        }
      }

      const nonPluginAttachments = _.reject(
        allAttachments,
        (attachment) => displayedInSection[attachment.id],
      );

      const hasAttachments = numShown > 0;
      const hasOverflow = numShown < nonPluginAttachments.length;

      const $trelloAttachmentsSection = this.$(
        '.js-trello-attachments-section',
      );

      let trelloAttachmentSubviews = (processingTrelloAttachmentsCount = this.numTrelloAttachmentsProcessing.get())
        ? _.times(Math.min(3, processingTrelloAttachmentsCount), (index) => {
            return this.subview(
              InProgressAttachmentView,
              this.model,
              null,
              `processing-trello-attachment-${index}`,
            );
          })
        : [];

      if (trelloAttachments.length > 0) {
        const numHiddenTrelloAttachments = (
          trelloAttachments.length - initialNumToShow
        ).toString();

        if (numHiddenTrelloAttachments > 0) {
          if (!this.fShowAllTrelloAttachments) {
            trelloAttachments = trelloAttachments.splice(0, initialNumToShow);

            $trelloAttachmentsSection
              .find('.js-show-more-trello-attachments')
              .removeClass('hide');
            $trelloAttachmentsSection
              .find('.js-show-fewer-trello-attachments')
              .addClass('hide');
            $trelloAttachmentsSection
              .find('.js-view-all-trello-attachments')
              .text(
                l('view all trello attachments', {
                  hiddenCount: numHiddenTrelloAttachments,
                }),
              );
          } else {
            $trelloAttachmentsSection
              .find('.js-show-more-trello-attachments')
              .addClass('hide');
            $trelloAttachmentsSection
              .find('.js-show-fewer-trello-attachments')
              .removeClass('hide');
          }
        } else {
          $trelloAttachmentsSection
            .find('.js-show-more-trello-attachments')
            .addClass('hide');
          $trelloAttachmentsSection
            .find('.js-show-fewer-trello-attachments')
            .addClass('hide');
        }

        trelloAttachmentSubviews = trelloAttachmentSubviews.concat(
          trelloAttachments.map(({ attachment, attachmentData }) => {
            if (attachmentData.type === 'trello card') {
              return this.subview(TrelloCardAttachment, attachment, {
                cardUrl: attachmentData.url,
              });
            } else {
              return this.subview(TrelloBoardAttachment, attachment, {
                boardUrl: attachmentData.url,
              });
            }
          }),
        );
      }

      this.ensureSubviews(
        trelloAttachmentSubviews,
        this.$('.js-trello-attachments-list'),
      );
      $trelloAttachmentsSection.toggleClass(
        'hide',
        _.isEmpty(trelloAttachmentSubviews),
      );

      this.$('.js-show-with-attachments').toggleClass('hide', !hasAttachments);

      this.enableAttachmentSorting($attachmentsList);

      const hiddenCount = (
        nonPluginAttachments.length - initialNumToShow
      ).toString();
      $attachmentsSection
        .find('.js-view-all-attachments')
        .text(l('view all attachments', { hiddenCount }));
      const $attachmentsShowFewer = $attachmentsSection
        .find('.js-show-fewer-attachments')
        .addClass('hide');
      const $attachmentsShowMore = $attachmentsSection
        .find('.js-show-more-attachments')
        .addClass('hide');

      const processingSubviews = (processingCount = this.numAttachmentsProcessing.get())
        ? _.times(Math.min(3, processingCount), (index) => {
            return this.subview(
              InProgressAttachmentView,
              this.model,
              null,
              `processing-${index}`,
            );
          })
        : [];

      const attachmentSubviews = (() => {
        if (hasAttachments) {
          let attachmentModels = allAttachments;

          if (hasOverflow) {
            if (!this.fShowAllAttachments) {
              $attachmentsShowMore.removeClass('hide');
              attachmentModels = remainingAttachments;
            } else {
              $attachmentsShowFewer.removeClass('hide');
            }
          }

          return attachmentModels.map((attachment) => {
            if (displayedInSection.hasOwnProperty(attachment.id)) {
              return;
            }

            return this.subview(AttachmentThumbView, attachment, {
              onReply: () => this.replyToAttachment(attachment),
              onPluginThumbnail: (idPlugin) => {
                if (!this.pluginThumbTrackCache[idPlugin]) {
                  this.pluginThumbTrackCache[idPlugin] = true;
                  return sendPluginViewedComponentEvent({
                    idPlugin: idPlugin,
                    idBoard: board.id,
                    idCard: this.model.id,
                    event: {
                      componentType: 'section',
                      componentName: 'pupAttachmentSection',
                      source: 'cardDetailScreen',
                    },
                  });
                }
              },
            });
          });
        } else {
          return [];
        }
      })();

      subviews = _.compact([
        ...Array.from(processingSubviews),
        ...Array.from(attachmentSubviews),
      ]);
      this.ensureSubviews(subviews, $attachmentsList);

      return $attachmentsSection.toggleClass('hide', _.isEmpty(subviews));
    })
    .catch(Promise.CancellationError, function () {});

  this._renderAttachmentsPromise.done();
  return this;
}

function currentUrlOrFallback(currentUrl, expectedType, fallback) {
  // This accounts for a situation that can happen when testing locally,
  // where the URLs the API gives are on a different domain than the
  // one being used
  return currentUrl && parseTrelloUrl(currentUrl).type === expectedType
    ? currentUrl
    : fallback;
}

function renderTrelloAttachments(trelloAttachments, initialNumToShow) {
  const $trelloAttachmentsSection = this.$('.js-trello-attachments-section');
  const processingTrelloAttachmentsCount = this.numTrelloAttachmentsProcessing.get();

  let trelloAttachmentSubviews = processingTrelloAttachmentsCount
    ? _.times(Math.min(3, processingTrelloAttachmentsCount), (index) => {
        return this.subview(
          InProgressAttachmentView,
          this.model,
          null,
          `processing-trello-attachment-${index}`,
        );
      })
    : [];

  if (trelloAttachments.length > 0) {
    const numHiddenTrelloAttachments = (
      trelloAttachments.length - initialNumToShow
    ).toString();

    if (numHiddenTrelloAttachments > 0) {
      if (!this.fShowAllTrelloAttachments) {
        trelloAttachments = trelloAttachments.slice(0, initialNumToShow);

        $trelloAttachmentsSection
          .find('.js-show-more-trello-attachments')
          .removeClass('hide');
        $trelloAttachmentsSection
          .find('.js-show-fewer-trello-attachments')
          .addClass('hide');
        $trelloAttachmentsSection.find('.js-view-all-trello-attachments').text(
          l('view all trello attachments', {
            hiddenCount: numHiddenTrelloAttachments,
          }),
        );
      } else {
        $trelloAttachmentsSection
          .find('.js-show-more-trello-attachments')
          .addClass('hide');
        $trelloAttachmentsSection
          .find('.js-show-fewer-trello-attachments')
          .removeClass('hide');
      }
    } else {
      $trelloAttachmentsSection
        .find('.js-show-more-trello-attachments')
        .addClass('hide');
      $trelloAttachmentsSection
        .find('.js-show-fewer-trello-attachments')
        .addClass('hide');
    }

    trelloAttachmentSubviews = trelloAttachmentSubviews.concat(
      trelloAttachments
        .map((attachment) => {
          const url = attachment.get('url');
          const { type, shortLink } = parseTrelloUrl(url);

          switch (type) {
            case 'card':
              return this.subview(TrelloCardAttachment, attachment, {
                cardUrl: currentUrlOrFallback(
                  this.modelCache.get('Card', shortLink)?.get('url'),
                  'card',
                  url,
                ),
              });

            case 'board':
              return this.subview(TrelloBoardAttachment, attachment, {
                boardUrl: currentUrlOrFallback(
                  this.modelCache.get('Board', shortLink)?.get('url'),
                  'board',
                  url,
                ),
              });

            default:
              return undefined;
          }
        })
        .filter((entry) => entry !== undefined),
    );
  }

  this.ensureSubviews(
    trelloAttachmentSubviews,
    this.$('.js-trello-attachments-list'),
  );
  $trelloAttachmentsSection.toggleClass(
    'hide',
    _.isEmpty(trelloAttachmentSubviews),
  );
}

module.exports.renderAttachments = function () {
  if (!featureFlagClient.get('remarkable.faster-trello-attachments', false)) {
    return oldRenderAttachments.apply(this);
  }

  if (this._renderAttachmentsPromise != null) {
    this._renderAttachmentsPromise.cancel();
  }

  const initialAttachments = _.clone(
    this.model.attachmentList.models,
  ).reverse();

  const board = this.model.getBoard();

  // Immediately remove any attachment thumbnails that have been deleted
  // without waiting for power-ups
  _.chain([AttachmentThumbView, TrelloCardAttachment, TrelloBoardAttachment])
    .map((Type) => this.subviewsOfType(Type))
    .flatten()
    .filter((subview) => !initialAttachments.includes(subview.model))
    .each((subview) => this.deleteSubview(subview));

  const attachments = {
    trelloAttachments: [],
    otherAttachments: [],
    ..._.groupBy(initialAttachments, (attachment) => {
      const { type } = parseTrelloUrl(attachment.get('url'));
      return type === 'card' || type === 'board'
        ? 'trelloAttachments'
        : 'otherAttachments';
    }),
  };
  let { trelloAttachments } = attachments;
  const { otherAttachments } = attachments;

  const initialNumToShow = 4;

  this._renderAttachmentsPromise = Promise.all(
    Promise.map(board.boardPluginList.models, (boardPlugin) => {
      return PluginRunner.getOrLoadPlugin(board, boardPlugin.get('idPlugin'));
    }),
  )
    .then((enabledPlugins) =>
      enabledPlugins.some((plugin) =>
        plugin.get('capabilitiesOptions').includes('claims-trello'),
      ),
    )
    .then((foundClaimsTrello) => {
      if (!foundClaimsTrello) {
        // Render Trello attachments as quickly as possible - no plugins need them
        renderTrelloAttachments.call(this, trelloAttachments, initialNumToShow);
      }

      // Render a loading state for each attachment that will appear in the Attachments section
      const $attachmentsSection = this.$('.js-attachments-section');
      const $attachmentsList = $attachmentsSection.find('.js-attachment-list');
      const loadedAttachments = this.subviewsOfType(AttachmentThumbView);
      // only for initial load
      if (!loadedAttachments.length) {
        const loadingCount = Math.min(
          otherAttachments.length,
          initialNumToShow,
        );
        const loadingSubviews = loadingCount
          ? _.times(Math.min(3, loadingCount), (index) => {
              return this.subview(
                InProgressAttachmentView,
                this.model,
                { isLoadingVersion: true },
                `loading-${index}`,
              );
            })
          : [];
        if (loadingSubviews.length > 0) {
          $attachmentsSection.toggleClass('hide', _.isEmpty(otherAttachments));
          this.ensureSubviews(loadingSubviews, $attachmentsList);
        }
      }

      return Promise.all([
        // Only do this for non-trello attachments; getAttachmentData is expensive
        // otherwise (we make API requests), and for trello attachments the data wouldn't
        // get used anyway
        Promise.all(otherAttachments.map(AttachmentHelpers.getAttachmentData)),
        Promise.try(() => {
          if (initialAttachments.length > 0) {
            return PluginRunner.all({
              timeout: 5000,
              command: 'attachment-sections',
              card: this.model,
              board: this.model.getBoard(),
              options: {
                // Let power-ups run on all attachments, including Trello URLs
                // that may also be rendered in the trello attachment section
                entries: PluginModelSerializer.attachments(
                  foundClaimsTrello ? initialAttachments : otherAttachments,
                ),
              },
            });
          } else {
            return [];
          }
        }).cancellable(),

        Promise.try(() => {
          if (initialAttachments.length > 0) {
            return getClaimedSecondLevelDomainsToPluginMapForOrg(
              board.get('idOrganization'),
              board.id,
            );
          }
        }),
      ])
        .spread(
          (
            retrievedOtherAttachmentData,
            pluginAttachmentSections,
            domainsMap,
          ) => {
            // Between the time we started rendering and now, attachments may have been
            // removed
            const filterRemoved = featureFlagClient.get(
              'fep.filter-removed-attachments',
              false,
            );
            const remainingAttachmentIds = new Set(
              this.model.attachmentList.pluck('id'),
            );
            const allAttachments = filterRemoved
              ? initialAttachments.filter((attachment) =>
                  remainingAttachmentIds.has(attachment.id),
                )
              : initialAttachments;
            const otherAttachmentData = filterRemoved
              ? retrievedOtherAttachmentData.filter((data) =>
                  remainingAttachmentIds.has(data.id),
                )
              : retrievedOtherAttachmentData;

            let processingCount;
            const displayedInSection = {};
            const usedSubviewIds = {};

            const claimedTrelloAttachments = _.flatten(
              _.map(_.pluck(pluginAttachmentSections, 'claimed'), (cta) =>
                _.pluck(cta, 'id'),
              ),
            );

            // Remove the Trello attachments that the plugin has claimed.
            trelloAttachments = _.reject(
              trelloAttachments,
              (attachment) =>
                claimedTrelloAttachments.indexOf(attachment.get('id')) > -1,
            );
            renderTrelloAttachments.call(
              this,
              trelloAttachments,
              initialNumToShow,
            );

            let subviews = _.chain(pluginAttachmentSections)
              .filter((section) =>
                pluginValidators.isValidAttachmentSections(
                  section,
                  this.model.attachmentList,
                ),
              )
              .map((section) => {
                _.forEach(
                  section.claimed,
                  (entry) => (displayedInSection[entry.id] = true),
                );

                let subviewId = section.id || section.title;
                if (_.isFunction(subviewId) || usedSubviewIds[subviewId]) {
                  subviewId = _.uniqueId('attachment-section_');
                }
                usedSubviewIds[subviewId] = true;
                const subview = this.subview(
                  PluginSectionView,
                  this.model,
                  {},
                  subviewId,
                );
                subview.updateSection(section);
                return subview;
              })
              .value();

            trelloAttachments.forEach(
              (attachment) => (displayedInSection[attachment.id] = true),
            );

            _.chain(pluginAttachmentSections)
              .pluck('idPlugin')
              .uniq()
              .each((idPlugin) => {
                sendPluginViewedComponentEvent({
                  idPlugin: idPlugin,
                  idBoard: board.id,
                  idCard: this.model.id,
                  event: {
                    componentType: 'section',
                    componentName: 'pupAttachmentSection',
                    source: 'cardDetailScreen',
                  },
                });
              });

            const $pluginSections = this.$('.js-plugin-sections');
            this.ensureSubviews(subviews, $pluginSections);

            // render the PASS views
            const suggestionSectionsToRender = {};
            // for each attachment that's not been claimed by another attachment section
            // see if attachment's url's second level domain matches any in domain map
            // if so, check the attachment's url against that plugin's claimedDomains
            // then add this attachment to that plugin's PASS section on the card back
            otherAttachmentData.forEach((attachment) => {
              if (displayedInSection[attachment.id]) {
                return;
              }

              // grab second-level domain, e.g 'https://na36.salesforce.com/008' to 'salesforce.com'
              const attachmentDomain = getSecondLevelDomain(attachment.url);

              const possiblePlugins = domainsMap[attachmentDomain];
              if (!possiblePlugins || possiblePlugins.length === 0) {
                return;
              }

              // which of the possible plugins actually matches, if any
              const plugin = possiblePlugins.find((testPlugin) =>
                testPlugin
                  .get('claimedDomains')
                  .some((domain) =>
                    doesMatchClaimedDomain(attachment.url, domain),
                  ),
              );

              if (
                !plugin ||
                !board.shouldRenderPluginSuggestionSection(plugin.id)
              ) {
                return;
              }

              displayedInSection[attachment.id] = true;
              const pluginName = plugin.get('name');
              if (suggestionSectionsToRender[plugin.id]) {
                return suggestionSectionsToRender[plugin.id].attachments.push(
                  attachment,
                );
              } else {
                return (suggestionSectionsToRender[plugin.id] = {
                  attachments: [attachment],
                  name: pluginName,
                  overview: plugin.get('listing').overview,
                  mark: plugin.get('icon').url,
                  onRemoveAttachment(idAttachment) {
                    return __guard__(
                      allAttachments.find((a) => a.id === idAttachment),
                      (x) => x.destroy(),
                    );
                  },
                  onDismissBtn: (target) =>
                    this.dismissPluginSuggestionSection(
                      target.closest('button'),
                      plugin.id,
                    ),
                  onEnableBtn: (target) =>
                    this.enableSuggestedPluginPrompt(
                      target.closest('button'),
                      plugin,
                    ),
                });
              }
            });

            if (!this.trackedSuggestionSections) {
              this.trackedSuggestionSections = {};
            }
            Object.keys(suggestionSectionsToRender).forEach(
              (idSuggestedPlugin) => {
                // prevent double tracking on re-renders of attachments
                if (!this.trackedSuggestionSections[idSuggestedPlugin]) {
                  this.trackedSuggestionSections[idSuggestedPlugin] = true;
                  return sendPluginViewedComponentEvent({
                    idPlugin: idSuggestedPlugin,
                    idBoard: board.id,
                    idCard: this.model.id,
                    event: {
                      componentType: 'section',
                      componentName: 'pupAttachmentSuggestionSection',
                      source: 'cardDetailScreen',
                    },
                  });
                }
              },
            );

            renderComponent(
              <PowerUpSuggestionContainer
                suggestionProps={Object.values(suggestionSectionsToRender)}
              />,
              this.$('.js-plugin-suggestion-sections')[0],
            );

            let numShown = 0;
            const remainingAttachments = [];

            for (const i in allAttachments) {
              const attachment = allAttachments[i];
              if (
                numShown === initialNumToShow ||
                numShown === allAttachments.length
              ) {
                break;
              }

              remainingAttachments.push(attachment);

              if (!displayedInSection.hasOwnProperty(attachment.id)) {
                numShown++;
              }
            }

            const nonPluginAttachments = _.reject(
              allAttachments,
              (attachment) => displayedInSection[attachment.id],
            );

            const hasAttachments = numShown > 0;
            const hasOverflow = numShown < nonPluginAttachments.length;

            this.$('.js-show-with-attachments').toggleClass(
              'hide',
              !hasAttachments,
            );

            this.enableAttachmentSorting($attachmentsList);

            const hiddenCount = (
              nonPluginAttachments.length - initialNumToShow
            ).toString();
            $attachmentsSection
              .find('.js-view-all-attachments')
              .text(l('view all attachments', { hiddenCount }));
            const $attachmentsShowFewer = $attachmentsSection
              .find('.js-show-fewer-attachments')
              .addClass('hide');
            const $attachmentsShowMore = $attachmentsSection
              .find('.js-show-more-attachments')
              .addClass('hide');

            const processingSubviews = (processingCount = this.numAttachmentsProcessing.get())
              ? _.times(Math.min(3, processingCount), (index) => {
                  return this.subview(
                    InProgressAttachmentView,
                    this.model,
                    null,
                    `processing-${index}`,
                  );
                })
              : [];

            const attachmentSubviews = (() => {
              if (hasAttachments) {
                let attachmentModels = allAttachments;

                if (hasOverflow) {
                  if (!this.fShowAllAttachments) {
                    $attachmentsShowMore.removeClass('hide');
                    attachmentModels = remainingAttachments;
                  } else {
                    $attachmentsShowFewer.removeClass('hide');
                  }
                }

                return attachmentModels.map((attachment) => {
                  if (displayedInSection.hasOwnProperty(attachment.id)) {
                    return;
                  }

                  return this.subview(AttachmentThumbView, attachment, {
                    onReply: () => this.replyToAttachment(attachment),
                    onPluginThumbnail: (idPlugin) => {
                      if (!this.pluginThumbTrackCache[idPlugin]) {
                        this.pluginThumbTrackCache[idPlugin] = true;
                        return sendPluginViewedComponentEvent({
                          idPlugin: idPlugin,
                          idBoard: board.id,
                          idCard: this.model.id,
                          event: {
                            componentType: 'section',
                            componentName: 'pupAttachmentSection',
                            source: 'cardDetailScreen',
                          },
                        });
                      }
                    },
                  });
                });
              } else {
                return [];
              }
            })();

            subviews = _.compact([
              ...Array.from(processingSubviews),
              ...Array.from(attachmentSubviews),
            ]);
            this.ensureSubviews(subviews, $attachmentsList);

            return $attachmentsSection.toggleClass('hide', _.isEmpty(subviews));
          },
        )
        .catch(Promise.CancellationError, function () {});
    });

  this._renderAttachmentsPromise.done();

  return this;
};

module.exports.dragenter = function (e) {
  let className;
  if (!this.model.editable()) {
    return;
  }

  let limited = false;
  const restricted = !this.model.canDropAttachment(e.type);

  if (restricted) {
    className = '.attachments-restricted';
  } else if (this.model.isOverLimit('attachments', 'perCard')) {
    className = '.attachments-per-card';
    limited = true;
  } else if (this.model.getBoard().isOverLimit('attachments', 'perBoard')) {
    className = '.attachments-per-board';
    limited = true;
  } else {
    className = '.dropzone';
  }

  const _scrollTop = $('.window-overlay').scrollTop() + 200;

  this.$(className).css({
    paddingTop: `${_scrollTop}px`,
  });
  return this.$el
    .addClass('is-drophover')
    .toggleClass('is-limited', limited)
    .toggleClass('is-restricted', restricted);
};

module.exports.dragleave = function (e) {
  return this.$el.removeClass('is-drophover');
};

module.exports.dropFiles = function (e) {
  if (
    !this.model.canAttach() ||
    this.model.attachmentTypeRestricted('computer')
  ) {
    return;
  }

  Analytics.sendTrackEvent({
    action: 'dragged',
    actionSubject: 'attachment',
    actionSubjectId: 'fileAttachment',
    source: 'cardDetailScreen',
    attributes: {
      cardIsTemplate: this.model.get('isTemplate'),
      cardIsClosed: this.model.get('closed'),
    },
    containers: this.model.getAnalyticsContainers(),
  });
  const files = e.detail;

  if (warnIfFileTooLarge(this.model.getBoard(), files)) {
    return;
  }

  this.incrementNumAttachmentsProcessing(files.length);

  let processed = 0;
  Promise.resolve(files)
    .each((file) => {
      const name = file.name || pastedFileName();

      const source = 'cardDetailViewAttachment';

      const analyticsPayload = {
        source,
        taskName: 'create-attachment/file',
      };

      const traceId = Analytics.startTask(analyticsPayload);
      analyticsPayload.traceId = traceId;

      return ninvoke(this.model, 'upload', file, name, { traceId })
        .then(
          (result) => {
            if (traceId) {
              Analytics.sendTrackEvent({
                source,
                action: 'uploaded',
                actionSubject: 'attachment',
                actionSubjectId: 'fileAttachment',
                attributes: {
                  taskId: traceId,
                },
              });

              Analytics.taskSucceeded(analyticsPayload);
            }

            return result;
          },
          (err) => {
            if (traceId) {
              analyticsPayload.error = err;
              throw Analytics.taskFailed(analyticsPayload);
            }
          },
        )
        .finally(
          this.callback(() => {
            processed++;
            return this.decrementNumAttachmentsProcessing();
          }),
        );
    })
    .catch(() => Alerts.show('unable to upload file', 'error', 'upload', 5000))
    .finally(() => {
      if (processed !== files.length) {
        return this.decrementNumAttachmentsProcessing(files.length - processed);
      }
    })
    .done();

  return e.stopPropagation();
};

module.exports.dropUrl = function (e) {
  let needle;
  if (!this.model.canAttach()) {
    return;
  }

  Analytics.sendTrackEvent({
    action: 'dragged',
    actionSubject: 'attachment',
    actionSubjectId: 'urlAttachment',
    source: 'cardDetailScreen',
    attributes: {
      cardIsTemplate: this.model.get('isTemplate'),
      cardIsClosed: this.model.get('closed'),
    },
    containers: this.model.getAnalyticsContainers(),
  });
  const url = e.detail;

  const board = this.model.getBoard();
  if (board.attachmentUrlRestricted(url)) {
    return;
  }

  const isTrelloAttachment =
    ((needle = parseTrelloUrl(url).type), ['board', 'card'].includes(needle));

  if (isTrelloAttachment) {
    this.incrementNumTrelloAttachmentsProcessing();
  } else {
    this.incrementNumAttachmentsProcessing();
  }

  this.model.uploadUrl(
    url,
    this.callback(() => {
      if (isTrelloAttachment) {
        return this.decrementNumTrelloAttachmentsProcessing();
      } else {
        return this.decrementNumAttachmentsProcessing();
      }
    }),
  );

  return e.stopPropagation();
};

module.exports.enableAttachmentSorting = function ($attachmentsList) {
  if (this.model != null ? this.model.editable() : undefined) {
    return DragSort.refreshCardSortable($attachmentsList, {
      axis: 'y',
      handle: [
        '.attachment-thumbnail-details',
        '.attachment-thumbnail-preview',
      ].join(','),
      delay: 75,
      distance: 7,
      tolerance: 'pointer',
      helper: 'clone',
      placeholder: 'attachment-thumbnail placeholder',
      items: '.attachment-thumbnail',
      start(event, ui) {
        const _height = $(ui.helper).outerHeight();
        return $(ui.placeholder).height(_height);
      },
    });
  }
};

module.exports.getTrelloAttachments = function (
  attachments,
  allAttachmentData,
  claimedAttachments,
) {
  const attachmentTypes = ['trello board', 'trello card'];

  return attachments
    .map((attachment, i) => {
      const attachmentData = allAttachmentData[i];
      if (
        attachmentData.isKnownService &&
        Array.from(attachmentTypes).includes(attachmentData.type) &&
        !claimedAttachments[attachment.id]
      ) {
        return { attachment, attachmentData };
      } else {
        return null;
      }
    })
    .filter((a) => a !== null);
};

module.exports.sortStopAttachments = function (e, ui) {
  Util.stopPropagation(e);
  return ui.item.trigger('moveattachment', [ui]);
};
