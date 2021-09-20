/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Auth } = require('app/scripts/db/auth');
const AddTagView = require('app/scripts/views/organization/add-tag-view');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const { Controller } = require('app/scripts/controller');
const _ = require('underscore');
const $ = require('jquery');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');

const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_collections',
);

const collectionsListHelper = t.renderable(function (tags, showCheck) {
  if (tags) {
    return t.ul('.select-tags-list', () =>
      Array.from(tags).map((tag) =>
        t.li(
          '.select-tags-list-item.js-tag-item',
          { 'data-id-tag': tag.id },
          () =>
            t.a('.select-tags-list-item-name-link.js-toggle-tag', function () {
              if (showCheck) {
                t.icon('check', {
                  class: 'select-tags-list-item-name-link-check-icon',
                });
              }
              return t.text(tag.get('name'));
            }),
        ),
      ),
    );
  }
});

const collectionsList = t.renderable(function (filteredTags) {
  collectionsListHelper(filteredTags.associated, true);
  return collectionsListHelper(filteredTags.notAssociated, false);
});

const template = t.renderable(function ({
  board,
  collectionsEnabled,
  billingUrl,
  orgUrl,
  hasTags,
  hideExplainer,
}) {
  if (!collectionsEnabled) {
    t.div('.collections-upsell.ads-layouts-experiment', () =>
      t.div('.collections-upsell-body', function () {
        t.h4('.collections-upsell-header', () => t.format('ads-title'));
        t.p(() => t.format('collections-let-you-group-and-filter'));
        t.a(
          '.js-learn-more',
          { href: '/business-class', target: '_blank' },
          () => t.format('ads-learn-more'),
        );
        return t.div('.collections-upgrade-action', function () {
          if (billingUrl) {
            return t.a(
              '.nch-button.nch-button--primary.js-upgrade',
              { href: billingUrl },
              () => t.format('ads-upgrade'),
            );
          } else {
            return t.a(
              '.nch-button.nch-button--primary.js-add-team',
              { href: '#' },
              () => t.format('ads-upgrade'),
            );
          }
        });
      }),
    );
    return;
  } else {
    if (!hideExplainer) {
      t.div('.collections-info', function () {
        t.span('.collections-explainer-close.js-close-explainer', () =>
          t.icon('close'),
        );
        t.img('.collections-image', {
          src: require('resources/images/collections/business-class-feature-roadmap.png'),
        });
        t.p(() => t.format('collections-let-you-group-and-filter'));
        return t.p('.js-learn-more', () =>
          t.format('learn-more-about-collections'),
        );
      });
    }
    return t.div('.collections-select-lists', function () {
      if (hasTags) {
        t.div('.has-collections', function () {
          t.p('.js-team-page', () =>
            t.format('visit-team-page-create-some', { orgUrl }),
          );
          return t.a(
            '.quiet-button.full.create-collection-btn.js-add-tag',
            { href: '#' },
            () => t.format('create-collection'),
          );
        });
        t.input('.js-collections-search', {
          type: 'text',
          placeholder: t.l('search-collections'),
          autocomplete: 'off',
        });
        return t.div('.js-filtered-collections');
      } else {
        return t.div('.no-collections', function () {
          t.p(() => t.format('no-collections'));
          t.p('.js-team-page', () =>
            t.format('visit-team-page-create-some', { orgUrl }),
          );
          return t.a(
            '.quiet-button.full.create-collection-btn.js-add-tag',
            { href: '#' },
            () => t.format('create-collection'),
          );
        });
      }
    });
  }
});

const getIdTag = (e) =>
  $(e.target).closest('.js-tag-item')[0].getAttribute('data-id-tag');

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class BoardCollectionsView extends View {
  static initClass() {
    this.prototype.className = 'board-menu-collections-select';

    this.prototype.noPadding = true;

    this.prototype.events = {
      'click .js-add-tag': 'addTag',
      'keyup .js-collections-search': 'renderFilteredCollections',
      'click .js-toggle-tag'(e) {
        return this.toggleTag(getIdTag(e));
      },
      'click .js-add-team': 'addTeam',
      'click .js-close-explainer': 'closeExplainer',
      'click .js-learn-more a'(e) {
        return Analytics.sendClickedLinkEvent({
          linkName: 'learnMoreLink',
          source: 'boardMenuDrawerCollectionsScreen',
        });
      },
      'click .js-team-page a'(e) {
        return Analytics.sendClickedLinkEvent({
          linkName: 'orgPageLink',
          source: 'boardMenuDrawerCollectionsScreen',
        });
      },
      'click .js-upgrade'(e) {
        return Analytics.sendClickedButtonEvent({
          buttonName: 'upgradeButton',
          source: 'boardMenuDrawerCollectionsScreen',
          containers: {
            board: {
              id: this.model.id,
            },
            organization: {
              id: this.model.getOrganization().id,
            },
          },
        });
      },
    };

    this.prototype.viewTitleKey = 'pick tags';
  }

  initialize() {
    this.sidebarView = this.options.sidebarView;
    this.organization =
      (this.options != null ? this.options.org : undefined) ||
      this.model.getOrganization();
    this.collectionsEnabled =
      this.organization != null && this.organization.isFeatureEnabled('tags');

    this.listenTo(
      this.model,
      'change:idOrganization',
      this.refereshOrganization,
    );
    this.listenTo(this.model, 'change:idTags', this.render);
    this.listenTo(Auth.me(), 'change:oneTimeMessagesDismissed', this.render);

    if (this.collectionsEnabled) {
      this.listenTo(
        this.organization.tagList,
        'add remove reset change',
        this.render,
      );
    }

    return super.initialize(...arguments);
  }

  addTag(e) {
    Util.stop(e);
    Analytics.sendClickedLinkEvent({
      linkName: 'createCollectionLink',
      source: 'boardMenuDrawerCollectionsScreen',
      containers: {
        board: {
          id: this.model.id,
        },
        organization: {
          id: this.model.getOrganization().id,
        },
      },
    });

    return PopOver.toggle({
      elem: e.target,
      view: AddTagView,
      options: {
        model: this.organization,
        modelCache: this.modelCache,
        boardView: true,
      },
    });
  }

  toggleTag(idTag) {
    const isEnabled = this.model.getIdTags().includes(idTag);
    const traceId = Analytics.startTask({
      taskName: 'edit-board/idTags',
      source: 'boardMenuDrawerCollectionsScreen',
    });

    return this.model.toggleTag(
      idTag,
      traceId,
      tracingCallback(
        {
          taskName: 'edit-board/idTags',
          traceId,
          source: 'boardMenuDrawerCollectionsScreen',
        },
        (err) => {
          const boardId = this.model.get('id');
          const orgId = this.model.get('idOrganization');

          if (!err) {
            Analytics.sendTrackEvent({
              action: 'toggled',
              actionSubject: 'collection',
              source: 'boardMenuDrawerCollectionsScreen',
              attributes: {
                taskId: traceId,
                idCollection: idTag,
                toggleOff: isEnabled,
              },
              containers: {
                board: { id: boardId },
                organization: { id: orgId },
              },
            });
          }
        },
      ),
    );
  }

  addTeam(e) {
    // This doesn't get called unless an organization doesn't have a billing URL
    Util.stop(e);
    Analytics.sendClickedButtonEvent({
      buttonName: 'addTeamFromCollectionsButton',
      source: 'boardMenuDrawerCollectionsScreen',
      containers: {
        board: {
          id: this.model.id,
        },
        organization: {
          id: this.model.getOrganization().id,
        },
      },
    });

    return this.model.trigger('add-to-team');
  }

  closeExplainer() {
    Auth.me().dismiss('CollectionsExplainer');
    return Analytics.sendDismissedComponentEvent({
      componentType: 'overlay',
      componentName: 'collectionsExplainerOverlay',
      source: 'boardMenuDrawerCollectionsScreen',
    });
  }

  filterTagsBySearch(tags) {
    const searchVal = this._searchVal().toLowerCase();
    if (_.isEmpty(searchVal)) {
      return tags;
    }

    return _.filter(
      tags,
      (tag) =>
        __guard__(tag.get('name'), (x) => x.toLowerCase().indexOf(searchVal)) >
        -1,
    );
  }

  filterTagsByAssociation(tags, boardTags) {
    return _.groupBy(tags, (tag) =>
      Array.from(boardTags).includes(tag.id) ? 'associated' : 'notAssociated',
    );
  }

  _searchVal() {
    let left;
    return (left = __guard__(this.$('.js-collections-search').val(), (x) =>
      x.trim(),
    )) != null
      ? left
      : '';
  }

  renderFilteredCollections() {
    if (
      !(this.organization != null
        ? this.organization.tagList.models.length
        : undefined)
    ) {
      return;
    }

    const filteredTags = this.filterTagsByAssociation(
      this.filterTagsBySearch(this.organization.tagList.models),
      this.model.getIdTags(),
    );
    return this.$('.js-filtered-collections')
      .empty()
      .append(collectionsList(filteredTags));
  }

  refereshOrganization() {
    const oldOrganization = this.modelCache.get(
      'Organization',
      this.model.previous('idOrganization'),
    );
    const organization = this.model.getOrganization();

    if (oldOrganization != null) {
      this.stopListening(oldOrganization.tagList);
    }

    this.organization = organization;
    this.collectionsEnabled =
      this.organization != null && this.organization.isFeatureEnabled('tags');

    if (this.collectionsEnabled) {
      this.listenTo(
        this.organization.tagList,
        'add remove reset change',
        this.render,
      );
    }

    return this.render();
  }

  render() {
    let billingUrl, orgUrl;
    const me = Auth.me();
    const hideExplainer = me.isDismissed('CollectionsExplainer');

    const hasTags =
      this.organization != null
        ? this.organization.tagList.models.length
        : undefined;

    if (this.organization) {
      orgUrl = Controller.getOrganizationUrl(this.organization);
      billingUrl = Controller.getOrganizationBillingUrl(this.organization);
    }

    this.$el.html(
      template({
        board: this.model,
        collectionsEnabled: this.collectionsEnabled,
        billingUrl,
        orgUrl,
        hasTags,
        hideExplainer,
      }),
    );

    this.renderFilteredCollections();

    return this;
  }
}

BoardCollectionsView.initClass();
module.exports = BoardCollectionsView;
