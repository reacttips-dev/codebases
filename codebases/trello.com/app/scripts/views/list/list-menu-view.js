/* eslint-disable
    @typescript-eslint/no-this-alias,
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let ListMenuView;
const React = require('react');
const Confirm = require('app/scripts/views/lib/confirm');
const ListBulkMoveCardsView = require('app/scripts/views/list/list-bulk-move-cards-view');
const ListCopyView = require('app/scripts/views/list/list-copy-view');
const ListMoveView = require('app/scripts/views/list/list-move-view');
const ListSetLimitView = require('app/scripts/views/list/list-set-limit-view');
const ListSortView = require('app/scripts/views/list/list-sort-view');
const PluginIOCache = require('app/scripts/views/internal/plugins/plugin-io-cache');
const PluginRunner = require('app/scripts/views/internal/plugins/plugin-runner');
const PluginView = require('app/scripts/views/plugin/plugin-view');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const Promise = require('bluebird');
const { ButlerListMenuSection } = require('app/src/components/Butler');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const { Util } = require('app/scripts/lib/util');
const template = require('app/scripts/views/templates/list_menu');
const ReactDOM = require('@trello/react-dom-wrapper');
const _ = require('underscore');
const {
  sendPluginUIEvent,
} = require('app/scripts/lib/plugins/plugin-behavioral-analytics');
const { Analytics } = require('@trello/atlassian-analytics');

const LIST_LIMITS_POWER_UP_ID = require('@trello/config').listLimitsPowerUpId;

module.exports = ListMenuView = (function () {
  ListMenuView = class ListMenuView extends PluginView {
    static initClass() {
      this.prototype.viewTitleKey = 'list actions';

      this.prototype.events = {
        'click .js-add-card': 'addCard',
        'click .js-move-list': 'moveList',
        'click .js-copy-list': 'copyList',
        'click .js-list-subscribe': 'toggleSubscribe',

        'click .js-move-cards': 'moveCards',
        'click .js-archive-cards': 'archiveCards',

        'mouseenter .js-sort-cards': 'preloadSortBy',
        'click .js-sort-cards': 'sortBy',

        'click .js-close-list': 'closeList',

        'click .js-plugin-list-action': 'runPluginAction',

        'click .js-set-list-limit': 'setListLimit',
      };
    }

    initialize() {
      this.makeDebouncedMethods('render');

      Analytics.sendScreenEvent({
        name: 'listMenuInlineDialog',
        containers: {
          list: {
            id: this.model.id,
          },
          board: {
            id: this.model.getBoard()?.id,
          },
          organization: {
            id: this.model.getBoard()?.getOrganization()?.id,
          },
        },
      });

      this.listenTo(this.model, 'change:subscribed', this.renderDebounced);
      return this.retain(this.options.pluginActions);
    }

    remove() {
      this.removeButlerSection();
      super.remove(...arguments);
    }

    render() {
      this.pluginActions = _.chain(this.options.pluginActions)
        .filter(
          (a) =>
            _.isString(a.text) && a.text.length && _.isFunction(a.callback),
        )
        .map((a) =>
          _.extend(a, {
            icon: PluginIOCache.fromId(a.idPlugin).getIconUrl(),
            name: PluginIOCache.fromId(a.idPlugin).getName(),
          }),
        )
        .sortBy('text')
        .value();

      this.$el.html(
        template({
          editable: this.model.editable(),
          hasSortableCards: this.model.cardList.length > 1,
          subscribed: this.model.get('subscribed'),
          canCopyList:
            !this.model.isOverLimit('lists', 'totalPerBoard') &&
            !this.model.isOverLimit('lists', 'openPerBoard'),
          pluginActions: this.pluginActions,
          listLimitsEnabled: this.model.getBoard().isListLimitsPowerUpEnabled(),
          isTemplate: this.model.getBoard().isTemplate(),
        }),
      );

      this.renderButlerSection();

      return this;
    }

    addCard(e) {
      Util.stop(e);

      PopOver.hide();

      this.model.getBoard().composer.save({
        list: this.model,
        index: 0,
        vis: true,
      });

      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'menuItem',
        actionSubjectId: 'addCardMenuItem',
        source: 'listMenuInlineDialog',
        containers: {
          list: {
            id: this.model.id,
          },
          board: {
            id: this.model.getBoard()?.id,
          },
          organization: {
            id: this.model.getBoard()?.getOrganization()?.id,
          },
        },
      });
    }

    moveList(e) {
      Util.stop(e);

      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'menuItem',
        actionSubjectId: 'moveListMenuItem',
        source: 'listMenuInlineDialog',
        containers: {
          list: {
            id: this.model.id || '',
          },
          board: {
            id: this.model.getBoard()?.id || '',
          },
          organization: {
            id: this.model.getBoard()?.getOrganization()?.id || '',
          },
        },
      });

      PopOver.pushView({
        view: new ListMoveView({
          model: this.model,
          modelCache: this.modelCache,
        }),
      });
    }

    copyList(e) {
      Util.stop(e);

      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'menuItem',
        actionSubjectId: 'copyListMenuItem',
        source: 'listMenuInlineDialog',
        containers: {
          list: {
            id: this.model.id || '',
          },
          board: {
            id: this.model.getBoard()?.id || '',
          },
          organization: {
            id: this.model.getBoard()?.getOrganization()?.id || '',
          },
        },
      });

      PopOver.pushView({
        view: new ListCopyView({
          model: this.model,
          modelCache: this.modelCache,
        }),
      });
    }

    toggleSubscribe(e) {
      Util.preventDefault(e);
      if (this.model.get('subscribed')) {
        this.model.subscribe(false);

        Analytics.sendTrackEvent({
          action: 'unsubscribed',
          actionSubject: 'list',
          source: 'listMenuInlineDialog',
          containers: {
            list: {
              id: this.model.id || '',
            },
            board: {
              id: this.model.getBoard()?.id || '',
            },
            organization: {
              id: this.model.getBoard()?.getOrganization()?.id || '',
            },
          },
        });
      } else {
        this.model.subscribe(true);

        Analytics.sendTrackEvent({
          action: 'subscribed',
          actionSubject: 'list',
          source: 'listMenuInlineDialog',
          containers: {
            list: {
              id: this.model.id || '',
            },
            board: {
              id: this.model.getBoard()?.id || '',
            },
            organization: {
              id: this.model.getBoard()?.getOrganization()?.id || '',
            },
          },
        });
      }
    }

    moveCards(e) {
      Util.stop(e);

      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'menuItem',
        actionSubjectId: 'moveAllCardsMenuItem',
        source: 'listMenuInlineDialog',
        containers: {
          list: {
            id: this.model.id || '',
          },
          board: {
            id: this.model.getBoard()?.id || '',
          },
          organization: {
            id: this.model.getBoard()?.getOrganization()?.id || '',
          },
        },
      });

      PopOver.pushView({
        view: new ListBulkMoveCardsView({
          model: this.model,
          modelCache: this.modelCache,
        }),
      });
    }

    archiveCards(e) {
      Util.stop(e);

      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'menuItem',
        actionSubjectId: 'archiveAllCardsMenuItem',
        source: 'listMenuInlineDialog',
        containers: {
          list: {
            id: this.model.id || '',
          },
          board: {
            id: this.model.getBoard()?.id || '',
          },
          organization: {
            id: this.model.getBoard()?.getOrganization()?.id || '',
          },
        },
      });

      Confirm.pushView('archive all cards', {
        model: this.model,
        confirmBtnClass: 'nch-button nch-button--danger',
        fxConfirm: () => {
          PopOver.hide();

          const openCards = _.clone(this.model.cardList.models);
          for (const card of Array.from(openCards)) {
            card.set({ closed: true });
          }

          return this.model.run('archiveAllCards', {}, this.listViewListen);
        },
      });
    }

    loadPluginSorters(timeout) {
      return PluginRunner.all({
        command: 'list-sorters',
        board: this.model.getBoard(),
        list: this.model,
        timeout,
      })
        .catch(() => [])
        .then((pluginListSorters) => {
          // limit to 5 sorts per plugin
          return _.chain(pluginListSorters)
            .groupBy('idPlugin')
            .map((val, idPlugin) => val.slice(0, 5))
            .flatten()
            .value();
        });
    }

    preloadSortBy(e) {
      if (this.pluginSortersPromise == null) {
        return (this.pluginSortersPromise = this.loadPluginSorters(500).then(
          (pluginListSorters) => {
            this.pluginSortersPromise = null;
            this.pluginListSorters = pluginListSorters;
            this.pluginListSortersExpiry = Date.now() + 5000;
            return pluginListSorters;
          },
        ));
      }
    }

    sortBy(e) {
      Util.stop(e);

      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'menuItem',
        actionSubjectId: 'sortListMenuItem',
        source: 'listMenuInlineDialog',
        containers: {
          list: {
            id: this.model.id || '',
          },
          board: {
            id: this.model.getBoard()?.id || '',
          },
          organization: {
            id: this.model.getBoard()?.getOrganization()?.id || '',
          },
        },
      });

      let pluginListSorters = [];

      if (
        this.pluginListSorters != null &&
        this.pluginListSortersExpiry > Date.now()
      ) {
        ({ pluginListSorters } = this);
      } else if (this.pluginSortersPromise != null) {
        pluginListSorters = this.pluginSortersPromise;
      } else {
        pluginListSorters = this.loadPluginSorters(150);
      }

      return Promise.resolve(pluginListSorters).then((pluginListSorters) => {
        PopOver.pushView({
          view: new ListSortView({
            model: this.model,
            modelCache: this.modelCache,
            pluginListSorters,
          }),
        });
        return (this.pluginListSorters = null);
      });
    }

    renderButlerSection() {
      const reactRoot = this.$('.js-list-menu-butler-section')[0];
      if (reactRoot) {
        renderComponent(
          <ButlerListMenuSection
            listName={this.model.get('name')}
            idList={this.model.id}
            idBoard={this.model.getBoard()?.id}
            idOrganization={this.model.getBoard()?.getOrganization()?.id}
          />,
          reactRoot,
        );
      }
    }

    removeButlerSection() {
      const reactRoot = this.$('.js-list-menu-butler-section')[0];
      if (reactRoot) {
        ReactDOM.unmountComponentAtNode(reactRoot);
      }
    }

    setListLimit(e) {
      Util.stop(e);

      sendPluginUIEvent({
        idPlugin: LIST_LIMITS_POWER_UP_ID,
        idBoard: this.model.getBoard().id,
        event: {
          action: 'clicked',
          actionSubject: 'option',
          actionSubjectId: 'powerUpListAction',
          source: 'listMenuInlineDialog',
        },
      });
      return PopOver.pushView({
        view: new ListSetLimitView({
          model: this.model,
          modelCache: this.modelCache,
        }),
      });
    }

    runPluginAction(e) {
      Util.stop(e);

      const target = this.pluginActions[
        this.$(e.target).closest('.js-plugin-list-action').data('index')
      ];

      const { idPlugin } = target;

      sendPluginUIEvent({
        idPlugin,
        idBoard: this.model.getBoard().id,
        event: {
          action: 'clicked',
          actionSubject: 'option',
          actionSubjectId: 'powerUpListAction',
          source: 'listMenuInlineDialog',
        },
      });

      return typeof target.callback === 'function'
        ? target.callback({ el: this.el, list: this.model })
        : undefined;
    }

    closeList(e) {
      Util.stop(e);

      const { model } = this;

      Analytics.sendTrackEvent({
        action: 'archived',
        actionSubject: 'list',
        source: 'listMenuInlineDialog',
        containers: {
          list: {
            id: this.model.id || '',
          },
          board: {
            id: this.model.getBoard()?.id || '',
          },
          organization: {
            id: this.model.getBoard()?.getOrganization()?.id || '',
          },
        },
      });

      PopOver.hide();
      model.close();

      return false;
    }
  };
  ListMenuView.initClass();
  return ListMenuView;
})();
