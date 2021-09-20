// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { ApiPromise } = require('app/scripts/network/api-promise');
const React = require('react');
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'manage_members',
);
const { Analytics } = require('@trello/atlassian-analytics');

const { featureFlagClient } = require('@trello/feature-flag-client');
const ReactDOM = require('@trello/react-dom-wrapper');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const {
  QrCodeWrapper,
  QrCodeType,
  QrCodeStyle,
} = require('app/src/components/QrCode');

class InvitationLink extends React.Component {
  static initClass() {
    this.prototype.displayName = 'InvitationLink';

    this.prototype.render = t.renderable(function () {
      const { invitationUrl, linkEnabled } = this.state;

      return t.div('.invitation-link-wrapper', () => {
        t.div('.invitation-link-header', () => {
          t.h4(function () {
            t.img('.icon-share-link', {
              src: require('resources/images/icon-link.svg'),
            });
            return t.format('share-team-invite-link');
          });

          if (!linkEnabled) {
            return t.a(
              '.action-link',
              { href: '#', onClick: this.showLink },
              () => t.format('create-link'),
            );
          }
        });

        if (linkEnabled) {
          return t.div(() => {
            t.div('.invitation-link-actions', () => {
              t.input({
                type: 'text',
                readOnly: true,
                placeholder: t.l('loading'),
                ref: this.inputDidMount,
                value: invitationUrl,
                onClick: this.copyInvitationLinkFromInput,
              });

              return t.button(
                '.nch-button.nch-button--primary',
                {
                  onClick: () =>
                    this.copyInvitationLink({ target: this.invitationInput }),
                },
                () => t.format('copy'),
              );
            });
            t.a(
              '.quiet',
              { href: '#', onClick: this.deactivateInvitationLink },
              () => t.format('disable-this-link'),
            );
            return t.div('.js-qr-code', { ref: this.qrCodeRef });
          });
        }
      });
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      linkEnabled: false,
      invitationUrl: '',
      preventDoubleClick: true,
    };
    this.showLink = this.showLink.bind(this);
    this.inputDidMount = this.inputDidMount.bind(this);
    this.deactivateInvitationLink = this.deactivateInvitationLink.bind(this);
    this.copyInvitationLink = this.copyInvitationLink.bind(this);
    this.copyInvitationLinkFromInput = this.copyInvitationLinkFromInput.bind(
      this,
    );
    this.qrCodeRef = React.createRef();
  }

  remove() {
    this.unmountQrCode();
    super.remove(...arguments);
  }

  showLink() {
    Analytics.sendClickedLinkEvent({
      linkName: 'inviteToWorkspaceCreateLink',
      source: 'inviteToWorkspaceInlineDialog',
      containers: {
        organization: {
          id: this.props.teamId,
        },
      },
    });
    return this.setState({ linkEnabled: true });
  }

  inputDidMount(input) {
    this.invitationInput = input;
    if (input) {
      const { apiUrl, teamUrl } = this.props;

      return ApiPromise({
        method: 'post',
        url: `${apiUrl}/invitationSecret`,
      })
        .get('secret')
        .then((secret) => {
          // Yes, this is gross … but eventually we won't be responsible for
          // forming these URLs anyway, since they should be coming from the server
          const invitationUrl = teamUrl.replace(
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

          this.setState({ invitationUrl });

          if (featureFlagClient.get('aaaa.qr-codes', false)) {
            this.mountQrCode(invitationUrl);
          }

          return input.focus();
        })
        .done();
    }
  }

  deactivateInvitationLink(e) {
    const { apiUrl } = this.props;

    this.unmountQrCode();

    this.setState({
      invitationUrl: '',
      linkEnabled: false,
    });

    Analytics.sendClickedLinkEvent({
      linkName: 'inviteToWorkspaceDisableLink',
      source: 'inviteToWorkspaceInlineDialog',
      containers: {
        organization: {
          id: this.props.teamId,
        },
      },
    });

    return ApiPromise({
      method: 'delete',
      url: `${apiUrl}/invitationSecret`,
    }).done();
  }

  copyInvitationLinkFromInput({ target }) {
    target.select();
    if (this.state.preventDoubleClick) {
      // `preventDoubleClick` state prevents spamming GAS events
      // when the user clicks the input multiple times
      this.setState({
        preventDoubleClick: false,
      });
      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'input',
        actionSubjectId: 'inviteToWorkspaceInput',
        source: 'inviteToWorkspaceInlineDialog',
        containers: {
          organization: {
            id: this.props.teamId,
          },
        },
      });
      // Reset `preventDoubleClick` to track future clicks
      setTimeout(() => {
        this.setState({
          preventDoubleClick: true,
        });
      }, 1000);
    }
  }

  copyInvitationLink({ target }) {
    target.select();

    Analytics.sendClickedButtonEvent({
      buttonName: 'copyWorkspaceInviteLinkButton',
      source: 'inviteToWorkspaceInlineDialog',
      containers: {
        organization: {
          id: this.props.teamId,
        },
      },
    });

    return document.execCommand('copy');
  }

  mountQrCode(url) {
    const qrCodeRoot = this.qrCodeRef.current;
    if (qrCodeRoot) {
      renderComponent(
        <QrCodeWrapper
          url={url}
          type={QrCodeType.teamInvite}
          style={QrCodeStyle.inline}
        />,
        qrCodeRoot,
      );
    }
  }

  unmountQrCode() {
    const qrCodeRoot = this.qrCodeRef.current;
    if (qrCodeRoot) {
      ReactDOM.unmountComponentAtNode(qrCodeRoot);
    }
  }
}

InvitationLink.initClass();
module.exports = InvitationLink;
