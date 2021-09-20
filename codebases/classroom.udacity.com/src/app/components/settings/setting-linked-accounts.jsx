import { Heading } from '@udacity/veritas-components';
import LocationService from 'services/location-service';
import PropTypes from 'prop-types';
import SettingsHelper from 'helpers/settings-helper';
import UnlinkAccountModal from './_unlink-account-modal';
import { __ } from 'services/localization-service';
import { actionsBinder } from 'helpers/action-helper';
import { connect } from 'react-redux';
import styles from './setting-linked-accounts.scss';

var mapStateToProps = (state) => ({
  facebookName: SettingsHelper.State.getFacebookName(state),
  googleName: SettingsHelper.State.getGoogleName(state),
});

var mapDispatchToProps = actionsBinder(
  'fetchUserBase',
  'fetchFacebookName',
  'fetchGoogleName'
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  cssModule(
    class extends React.Component {
      static displayName = 'settings/setting-linked-accounts';

      static propTypes = {
        user: PropTypes.object.isRequired,
      };

      static defaultProps = {
        user: {},
      };

      state = {
        showDisconnectModal: null,
      };

      componentWillMount() {
        if (this.props.user.social_logins) {
          this._refreshNamesFromProviders();
        }
      }

      componentWillReceiveProps(newProps) {
        if (
          !_.isEqual(newProps.user.social_logins, this.props.user.social_logins)
        ) {
          this._refreshNamesFromProviders();
        }
      }

      _refreshNamesFromProviders = () => {
        if (this.isConnectedToProvider('Facebook')) {
          this.props.fetchFacebookName();
        }
        if (this.isConnectedToProvider('Google')) {
          this.props.fetchGoogleName();
        }
      };

      isConnectedToProvider = (provider) => {
        var { user } = this.props;
        return !!_.find(user.social_logins, { provider });
      };

      nameWithProvider = (provider) => {
        if (provider === 'Facebook') {
          return this.props.facebookName ? `(${this.props.facebookName})` : '';
        }
        if (provider === 'Google') {
          return this.props.googleName ? `(${this.props.googleName})` : '';
        }
      };

      handleProviderConnect = (provider) => {
        var { location } = window;
        var { location } = window;
        var nextUrl = `${location.protocol}//${location.host}/settings/linked-accounts`;
        // https://user-api-swagger.udacity.com/#/me/get_me_linked_accounts_link
        var url =
          `${CONFIG.userApiUrl}/me/linked_accounts/link` +
          `?provider=${provider.toLowerCase()}` +
          `&next=${encodeURIComponent(nextUrl)}`;

        LocationService.redirectTo(url);
      };

      handleHide = () => {
        this.setState({
          showDisconnectModal: null,
        });
      };

      handleProviderDisconnect = (provider, evt) => {
        evt.preventDefault();

        this.setState({
          showDisconnectModal: provider,
        });
      };

      renderProvider = (provider) => {
        var isConnected = this.isConnectedToProvider(provider);

        return (
          <li key={'provider-' + provider}>
            <dl>
              <dd
                styleName={isConnected ? 'connected' : 'disconnected'}
                title={isConnected ? 'Connected' : 'Not Connected'}
              >
                <span>
                  {isConnected ? __('Connected') : __('Not Connected')}
                </span>
              </dd>
              <dt>{provider}</dt>
              <dd>{this.nameWithProvider(provider)}</dd>
              <dd styleName="status">
                {isConnected ? (
                  <a
                    href="#"
                    onClick={(evt) =>
                      this.handleProviderDisconnect(provider, evt)
                    }
                  >
                    <span>{__('Disconnect')}</span>
                  </a>
                ) : (
                  <a
                    href="#"
                    onClick={(evt) => this.handleProviderConnect(provider, evt)}
                  >
                    <span>{__('Connect')}</span>
                  </a>
                )}
              </dd>
            </dl>
          </li>
        );
      };

      render() {
        var { showDisconnectModal } = this.state;
        var { fetchUserBase } = this.props;

        return (
          <section styleName="content-container">
            <div styleName="main">
              <Heading size="h3" as="h1">
                {__('Linked Accounts')}
              </Heading>
              <ul>
                {this.renderProvider('Facebook')}
                {this.renderProvider('Google')}
              </ul>

              {showDisconnectModal ? (
                <UnlinkAccountModal
                  show={true}
                  onHide={this.handleHide}
                  onDisconnect={fetchUserBase}
                  provider={showDisconnectModal}
                />
              ) : null}
            </div>
          </section>
        );
      }
    },
    styles
  )
);
