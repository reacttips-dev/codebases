import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ApiButton from 'bundles/coursera-ui/components/basic/ApiButton';
import {
  API_BEFORE_SEND,
  API_IN_PROGRESS,
  API_SUCCESS,
  API_ERROR,
} from 'bundles/coursera-ui/constants/apiNotificationConstants';
import { FormattedHTMLMessage } from 'js/lib/coursera.react-intl';
import OnDemandSpecializationUpgradesV1 from 'bundles/naptimejs/resources/onDemandSpecializationUpgrades.v1';
import _t from 'i18n!nls/ondemand';

const RELOAD_WAIT = 5000; // milliseconds to wait before reloading page

/**
 * Reusable button to upgrade a learner to a new version of a s12n
 */
class S12NUpgradeButton extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    s12nId: PropTypes.string.isRequired,
    onSuccess: PropTypes.func,
    onError: PropTypes.func,
    reloadPageOnSuccess: PropTypes.bool,
    reloadDelay: PropTypes.number,
  };

  static contextTypes = {
    executeMutation: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onSuccess: () => {},
    onError: () => {},
    reloadPageOnSuccess: false,
    reloadDelay: RELOAD_WAIT,
  };

  constructor(props) {
    super(props);
    this.state = {
      apiStatus: API_BEFORE_SEND,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { reloadPageOnSuccess, reloadDelay, onSuccess, onError } = this.props;
    const { apiStatus } = this.state;

    if (prevState.apiStatus === API_IN_PROGRESS && apiStatus === API_SUCCESS) {
      onSuccess();

      if (reloadPageOnSuccess) {
        // reload page to fetch latest enrollment state
        setTimeout(() => window.location.reload(true), reloadDelay);
      }
    }

    if (prevState.apiStatus === API_IN_PROGRESS && apiStatus === API_ERROR) {
      onError();
    }
  }

  handleS12nUpgrade = () => {
    const { userId, s12nId } = this.props;

    this.setState({ apiStatus: API_IN_PROGRESS });

    // create new s12n upgrade
    this.context
      .executeMutation(
        OnDemandSpecializationUpgradesV1.create({
          userId,
          s12nId,
        })
      )
      .then((completed) => {
        if (completed.failure) {
          this.setState({ apiStatus: API_ERROR });
        } else {
          this.setState({ apiStatus: API_SUCCESS });
        }
      })
      .fail((error) => {
        this.setState({ apiStatus: API_ERROR });
      });
  };

  render() {
    const { userId, s12nId } = this.props;
    const { apiStatus } = this.state;

    if (!userId || !s12nId) {
      return null;
    }

    return (
      <div className="rc-S12NUpgradeButton">
        <ApiButton
          type="primary"
          onClick={this.handleS12nUpgrade}
          apiStatus={apiStatus}
          apiStatusAttributesConfig={{
            label: {
              API_BEFORE_SEND: _t('Upgrade'),
              API_IN_PROGRESS: _t('Upgrading...'),
              API_SUCCESS: _t('Upgraded!'),
              API_ERROR: _t('Failed'),
            },
          }}
        />
        {apiStatus === API_ERROR && (
          <p className="font-xs m-y-1 align-horizontal-center">
            <FormattedHTMLMessage
              message={_t(
                `Sorry, we've encountered a problem during the upgrade. Please
                {contactUsLink} for further assistance, we're standing by to help.`
              )}
              contactUsLink={
                <a href="https://learner.coursera.help" target="_blank" rel="noopener noreferrer">
                  {_t('contact us')}
                </a>
              }
            />
          </p>
        )}
      </div>
    );
  }
}

export default S12NUpgradeButton;
