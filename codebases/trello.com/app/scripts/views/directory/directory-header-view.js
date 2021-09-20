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
const { Auth } = require('app/scripts/db/auth');
const BaseDirectoryView = require('./base-directory-view');
const { dontUpsell } = require('@trello/browser');
const pluginsChangedSignal = require('app/scripts/views/internal/plugins/plugins-changed-signal');
const React = require('react');
const t = require('app/scripts/views/internal/recup-with-helpers')('directory');
const {
  UpgradeSmartComponentConnected: UpgradeSmartComponent,
} = require('app/src/components/UpgradePrompts/UpgradeSmartComponent');
const { Util } = require('app/scripts/lib/util');

class DirectoryBusinessClassBanner extends React.Component {
  static initClass() {
    this.prototype.displayName = 'Directory Business Class Banner';

    this.prototype.render = t.renderable(function () {
      const { onDismissClick, orgId } = this.props;

      return t.div('.directory-business-class-banner', function () {
        t.div('.banner-content', function () {
          t.icon('business-class', { class: 'icon-lg light' });
          return t.format(
            'this-board-has-reached-its-power-up-limit-upgrade-to-business-class-to-enable-additional-power-ups',
          );
        });
        return t.div('.buttons-container', function () {
          t.a('.dismiss-link', { href: '#', onClick: onDismissClick }, () =>
            t.format('dismiss'),
          );
          return t.addElement(
            <UpgradeSmartComponent
              orgId={orgId}
              promptId="pupUpgradeBannerButton"
            />,
          );
        });
      });
    });
  }
}

DirectoryBusinessClassBanner.initClass();

class DirectoryHeader extends React.Component {
  static initClass() {
    this.prototype.displayName = 'Directory Header';

    this.prototype.render = t.renderable(function () {
      const {
        title,
        showBackButton,
        navigateBack,
        toggleNavigationMenu,
      } = this.props;

      return t.div('.directory-header', () =>
        t.div('.directory-header-toolbar', function () {
          t.h2('.directory-header-toolbar-title', () => t.format(title));
          t.div('.directory-header-toolbar-left', function () {
            t.a('.icon-lg.icon-back.dark-hover.directory-back-btn', {
              href: '#',
              onClick: navigateBack,
              class: t.classify({ hide: !showBackButton }),
            });
            return t.a(
              '.directory-hamburger',
              { href: '#', onClick: toggleNavigationMenu },
              () => t.text('☰'),
            );
          });
          return t.div('.directory-header-toolbar-right', () =>
            t.a('.icon-lg.icon-close.dark-hover.js-close-directory', {
              href: '#',
            }),
          );
        }),
      );
    });
  }
}
DirectoryHeader.initClass();

class DirectoryHeaderComponent extends React.Component {
  static initClass() {
    this.prototype.render = t.renderable(function () {
      const {
        title,
        showBackButton,
        navigateBack,
        toggleNavigationMenu,
        upsellEnabled,
        onDismissClick,
        orgId,
      } = this.props;
      return t.div(function () {
        t.tag(DirectoryHeader, {
          title,
          showBackButton,
          navigateBack,
          toggleNavigationMenu,
        });
        if (upsellEnabled) {
          return t.tag(DirectoryBusinessClassBanner, {
            onDismissClick,
            orgId,
          });
        }
      });
    });
  }
}
DirectoryHeaderComponent.initClass();

module.exports = class DirectoryHeaderView extends BaseDirectoryView {
  initialize({ directoryView }) {
    this.directoryView = directoryView;
    super.initialize(...arguments);
    this.listenTo(this.model, { 'change:powerUps': this.render });
    this.listenTo(this.model.boardPluginList, {
      'add remove reset': this.render,
    });
    return this.subscribe(pluginsChangedSignal(this.model), () =>
      this.render(),
    );
  }

  onDismissClick(e) {
    Util.stop(e);

    Auth.me().dismissAd('DirectoryBusinessClassBanner');
    this.manuallyDismissed = true;
    this.render();
    return this.directoryView.setBodyHeight(this.manuallyDismissed);
  }

  renderContent() {
    const { category, section, idPlugin, history, search } = this.directoryView;

    let title = 'power-ups';
    if (search != null && search.length) {
      title = 'power-ups';
    } else if (category != null) {
      title = category;
    } else if (section != null) {
      title = section;
    }

    // Specifically checking for BC2 orgs to not show upsell banner
    const isPremiumOrg = this.model.getOrganization()?.isPremium();

    return (
      <DirectoryHeaderComponent
        title={title}
        upsellEnabled={
          !this.model.canEnableAdditionalPowerUps() &&
          !isPremiumOrg &&
          !(
            this.manuallyDismissed ||
            Auth.me().isAdDismissed('DirectoryBusinessClassBanner')
          ) &&
          !dontUpsell()
        }
        showBackButton={section != null || idPlugin != null || history.length}
        // eslint-disable-next-line react/jsx-no-bind
        navigateBack={() => this.directoryView.navigateBack()}
        // eslint-disable-next-line react/jsx-no-bind
        onDismissClick={(e) => this.onDismissClick(e)}
        // eslint-disable-next-line react/jsx-no-bind
        toggleNavigationMenu={() => this.directoryView.toggleNavigationMenu()}
        orgId={this.model.getOrganization()?.id}
      />
    );
  }
};
