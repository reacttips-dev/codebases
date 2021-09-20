/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let PluginCardBadgesView;
const pluginChangedSignal = require('app/scripts/views/internal/plugins/plugins-changed-signal');
const pluginValidators = require('app/scripts/lib/plugins/plugin-validators');
const PluginBadgeView = require('app/scripts/views/plugin/plugin-badge-view');
const PluginModelSerializer = require('app/scripts/views/internal/plugins/plugin-model-serializer');
const PluginRunner = require('app/scripts/views/internal/plugins/plugin-runner');
const PluginView = require('app/scripts/views/plugin/plugin-view');
const Promise = require('bluebird');
const {
  DropboxPluginId,
  DropboxClaimedHosts,
} = require('app/scripts/data/dropbox');
const {
  sendPluginViewedComponentEvent,
} = require('app/scripts/lib/plugins/plugin-behavioral-analytics');
const _ = require('underscore');

let dropboxMark = require('resources/images/dropbox-mark.svg');
// plugin validators does not appreciate relative URLs
// this is a bit of a hack for local development
// in production this will be a fully qualified url
if (!dropboxMark.startsWith('https://')) {
  dropboxMark = window.location.origin + dropboxMark;
}

const hostForUrl = function (url) {
  try {
    return new URL(url).host;
  } catch (error) {
    return url;
  }
};

const globalBadgeCache = {};
let lastIdBoard = null;
let trackedFrontBadges = {};

module.exports = PluginCardBadgesView = (function () {
  PluginCardBadgesView = class PluginCardBadgesView extends PluginView {
    static initClass() {
      this.prototype.tagName = 'span';
      this.prototype.badgeView = PluginBadgeView;

      this.prototype.vigor = this.VIGOR.NONE;
    }

    isDetailView() {
      return false;
    }

    runnerOptions() {
      return {
        command: 'card-badges',
        board: this.model.getBoard(),
        card: this.model,
        timeout: 10000,
        options: {
          attachments: PluginModelSerializer.attachments(
            this.model.attachmentList.models,
            ['id', 'name', 'url'],
          ),
        },
      };
    }

    _cacheKey() {
      const { command, board, card } = this.runnerOptions();
      return [command, board?.id, card?.id].join(':');
    }

    requestBadges() {
      // If we're in a background tab it's possible that by the time PluginRunner.all resolves,
      // the model will have been deleted (in which case trying to read this.model.attachmentList
      // would fail).  We wrap the callback with this.callback so it gets cancelled (i.e. becomes
      // a no-op) along with other scheduled events when the view is removed
      const scheduledCallback = this.callback((pluginBadges) => {
        const validBadges = _.filter(
          pluginBadges,
          pluginValidators.isValidBadge,
        );
        // as part of the dropbox partnership, we will render a Dropbox attachment count
        // even when they are not enabled
        if (
          !this.isDetailView() &&
          !this.model.getBoard()?.isPluginEnabled(DropboxPluginId)
        ) {
          const countDropbox = this.model.attachmentList.filter((a) =>
            DropboxClaimedHosts.includes(hostForUrl(a.get('url'))),
          ).length;
          if (countDropbox > 0) {
            validBadges.push({
              icon: dropboxMark,
              text: countDropbox,
              idPlugin: DropboxPluginId,
            });
          }
        }
        const currentRun = (this.latestRun || 0) + 1;
        this.latestRun = currentRun;

        const resolvedBadges = [];
        const isCurrent = () => {
          // avoid race conditions where we could render an old run over newer data
          return this.latestRun === currentRun;
        };
        const rerender = () => {
          if (isCurrent()) {
            this.renderResolvedBadges(resolvedBadges);
            // remove callbacks before caching badges; we can't trust the callbacks
            // to still be retained / available when we use the cached badges
            return (globalBadgeCache[
              this._cacheKey()
            ] = resolvedBadges.map((b) => _.omit(b, 'callback')));
          }
        };

        return this.cancelOnRemove(
          Promise.map(validBadges, (pluginBadge, index) => {
            this.retain(pluginBadge);

            if (pluginBadge.dynamic != null) {
              const update = () => {
                const updater = pluginBadge
                  .dynamic()
                  .cancellable()
                  .then((badge) => {
                    if (!pluginValidators.isValidBadge(badge)) {
                      // you may return null or undefined because you want your badge to go away
                      // this will actually make sure when we re-render it will go away
                      resolvedBadges[index] = undefined;
                      rerender();
                      return;
                    }

                    resolvedBadges[index] = badge;
                    rerender();

                    if (badge.refresh && isCurrent()) {
                      let refresh = Math.max(10, badge.refresh);
                      // Add some noise (+-1sec) to refresh interval to reduce clumping
                      refresh += Math.random() * 2 - 1;
                      return this.setTimeout(update, refresh * 1000);
                    }
                  })
                  .catch(PluginRunner.Error.NotHandled, () => {
                    return null;
                  });

                this.cancelOnRemove(updater);
                return updater;
              };

              return update();
            } else {
              return (resolvedBadges[index] = pluginBadge);
            }
          }),
        )
          .cancellable()
          .then(() => rerender())
          .catch(Promise.CancellationError, function () {});
      });

      return PluginRunner.all(this.runnerOptions()).then(scheduledCallback);
    }
    renderOnce() {
      let cachedBadges;
      if ((cachedBadges = globalBadgeCache[this._cacheKey()]) != null) {
        this.renderResolvedBadges(cachedBadges);
      }

      const idBoard = this.model.getBoard()?.id;
      if (idBoard && idBoard !== lastIdBoard) {
        // when we switch boards we should clear out tracking cache
        // that way if we go back to the old board we will track it
        lastIdBoard = idBoard;
        trackedFrontBadges = {};
      }

      this.whenIdle(`plugin_badges_render_${this.cid}`, () => {
        const options = this.runnerOptions();

        this.latestRun = 0;

        const debouncedRequestBadges = this.debounce(() => {
          return this.requestBadges();
        }, 500);

        this.listenTo(
          this.model,
          'change:dateLastActivity',
          debouncedRequestBadges,
        );
        this.listenTo(
          this.model.attachmentList,
          'add remove reset change',
          debouncedRequestBadges,
        );

        const changeSignal = pluginChangedSignal(options.board, options.card);
        this.subscribe(
          changeSignal,
          _.after(2, (pluginData) => debouncedRequestBadges()),
        );

        return this.waitForId(this.model, () => this.requestBadges());
      });

      return this;
    }

    trackBadges(idPlugin) {
      if (!trackedFrontBadges[idPlugin]) {
        trackedFrontBadges[idPlugin] = true;

        return sendPluginViewedComponentEvent({
          idPlugin,
          idBoard: this.model.getBoard().id,
          idCard: this.model.id,
          event: {
            componentType: 'badge',
            componentName: 'pupCardBadge',
            source: 'boardScreen',
          },
        });
      }
    }

    renderResolvedBadges(pluginBadges) {
      const isCardDetail = this.isDetailView();
      const subviews = _.filter(pluginBadges, (badge) =>
        pluginValidators.isRenderableBadge(badge, isCardDetail),
      ).map((badge, index) => {
        // track badge views
        this.trackBadges(badge.idPlugin);

        const sv = this.subview(
          this.badgeView,
          this.model,
          { pluginBadge: badge },
          index,
        );
        // We may be re-using a badge view, so make sure to use the latest badge values
        sv.updateBadge(badge);
        return sv;
      });

      return this.ensureSubviews(subviews);
    }
  };
  PluginCardBadgesView.initClass();
  return PluginCardBadgesView;
})();
