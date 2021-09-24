import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import OnboardingHeader from './onboarding_header.jsx';
import * as C from './constants';
import {SigninDesktopModal} from '../../../../shared/library/modals/signin';
import ErrorBar from '../shared/bars/error.jsx';
import {observer} from 'mobx-react';
import PrivateStackShareCta from '../../../../shared/library/private-stackshare-cta/index.js';
import glamorous from 'glamorous';
import {PHONE} from '../../../../shared/style/breakpoints';

const PrivateCta = glamorous.div({
  width: '100%',
  maxWidth: 1030,
  margin: '0 auto',
  padding: '35px 90px 0 90px',
  [PHONE]: {
    padding: 0
  }
});

export default
@observer
class Onboarding extends Component {
  constructor() {
    super();
    this.state = {
      signIn: false,
      partOfAnyPrivateCompany: true
    };

    this.goBack = this.goBack.bind(this);
    this.closeSignInModal = this.closeSignInModal.bind(this);

    this.bindEvents();
  }

  componentDidMount() {
    $.get('/api/v1/companies/index', response => {
      this.setState({partOfAnyPrivateCompany: response.some(value => value.private_mode)});
    });
  }

  bindEvents() {
    $(document).on('onboarding.sign-in', () => {
      trackEvent('login', {value: 'onboarding'});
      this.setState({signIn: true});
    });

    // for testing
    $(document).on('onboarding.set.stackInfo.image_url', (event, data) => {
      this.context.globalStore.stackInfo.image_url = data;
    });
  }

  goBack() {
    browserHistory.push(this.context.navStore.backRoute);
  }

  closeSignInModal() {
    this.setState({signIn: false});
  }

  render() {
    const {
      location: {pathname}
    } = this.props;
    const {partOfAnyPrivateCompany} = this.state;
    return (
      <div className="onboarding">
        <OnboardingHeader path={pathname} />
        <div className="onboarding__content">
          {!partOfAnyPrivateCompany && (
            <PrivateCta>
              <PrivateStackShareCta
                title="Automatically create and update stack profiles based on your GitHub/Azure repos with Private StackShare"
                pageName="stackCreatePage"
              />
            </PrivateCta>
          )}
          <ErrorBar />
          <div className="fluid-container">{this.props.children}</div>
        </div>
        {this.state.signIn && (
          <SigninDesktopModal
            onDismiss={this.closeSignInModal}
            redirect={`${C.ONBOARDING_BASE_PATH}/stack-type`}
          />
        )}
      </div>
    );
  }
}

Onboarding.contextTypes = {
  routerProps: PropTypes.object,
  globalStore: PropTypes.object,
  navStore: PropTypes.object
};
