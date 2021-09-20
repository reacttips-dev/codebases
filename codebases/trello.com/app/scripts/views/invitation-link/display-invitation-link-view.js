// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { ApiPromise } = require('app/scripts/network/api-promise');
const { Analytics } = require('@trello/atlassian-analytics');

const { featureFlagClient } = require('@trello/feature-flag-client');
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const {
  QrCodeWrapper,
  QrCodeType,
  QrCodeStyle,
} = require('app/src/components/QrCode');

// Mixin for views that have the option to display an invitation link
const DisplayInvitationLinkView = {
  _secretUrl() {
    return `${this.model.url()}/invitationSecret`;
  },

  showInvitationLink(e) {
    this.$('.js-show-invitation-link').addClass('hide');
    this.$('.js-invitation-link-container').removeClass('hide');

    return ApiPromise({
      method: 'post',
      url: this._secretUrl(),
    })
      .get('secret')
      .then((secret) => {
        // Yes, this is gross … but eventually we won't be responsible for
        // forming these URLs anyway, since they should be coming from the server
        const invitationUrl = this.model.get('url').replace(
          new RegExp(`\
(\
/b/[^/]+\
|\
/[^/]+$\
)\
(.*)$\
`),
          `/invite$1/${secret}$2`,
        );

        if (featureFlagClient.get('aaaa.qr-codes', false)) {
          this.mountQrCode(invitationUrl);
        }

        return this.$('.js-invitation-link')
          .val(invitationUrl)
          .focus()
          .select();
      })
      .then(() => {
        return Analytics.sendClickedLinkEvent({
          linkName: 'inviteToBoardCreateLink',
          source: 'inviteToBoardInlineDialog',
          containers: {
            board: {
              id: this.model.id,
            },
          },
        });
      })
      .done();
  },

  clickInvitationLink(e) {
    Analytics.sendClickedLinkEvent({
      linkName: 'inviteToBoardLink',
      source: 'inviteToBoardInlineDialog',
      containers: {
        board: {
          id: this.model.id,
        },
      },
    });

    return $('.js-invitation-link').select();
  },

  deactivateInvitationLink(e) {
    this.$('.js-show-invitation-link').removeClass('hide');
    this.$('.js-invitation-link-container').addClass('hide');
    this.$('.js-invitation-link').val('');

    Analytics.sendClickedLinkEvent({
      linkName: 'inviteToBoardDisableLink',
      source: 'inviteToBoardInlineDialog',
      containers: {
        board: {
          id: this.model.id,
        },
      },
    });

    this.unmountQrCode();

    return ApiPromise({
      method: 'delete',
      url: this._secretUrl(),
    }).done();
  },

  copyInvitationLink(e) {
    $('.js-invitation-link').select();
    Analytics.sendClickedButtonEvent({
      buttonName: 'inviteToBoardLinkCopyButton',
      source: 'inviteToBoardInlineDialog',
      containers: {
        board: {
          id: this.model.id,
        },
      },
    });

    document.execCommand('copy');

    clearTimeout(this.hideTimeout);
    $('.js-hide-on-copy').hide();
    $('.js-show-on-copy').show();
    return (this.hideTimeout = setTimeout(() => {
      $('.js-hide-on-copy').show();
      return $('.js-show-on-copy').hide();
    }, 2000));
  },

  mountQrCode(url) {
    const qrCodeRoot = this.$el.find('.js-qr-code')[0];
    if (qrCodeRoot) {
      renderComponent(
        <QrCodeWrapper
          url={url}
          type={QrCodeType.boardInvite}
          style={QrCodeStyle.inline}
        />,
        qrCodeRoot,
      );
    }
  },

  unmountQrCode() {
    const qrCodeRoot = this.$el.find('.js-qr-code')[0];
    if (qrCodeRoot) {
      ReactDOM.unmountComponentAtNode(qrCodeRoot);
    }
  },
};

module.exports = DisplayInvitationLinkView;
