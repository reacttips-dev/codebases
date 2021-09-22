import React from 'react';
import PropTypes from 'prop-types';
import * as actions from 'bundles/authentication/shared/actions';

import epic from 'bundles/epic/client';
import thirdPartyAuth from 'bundles/third-party-auth/lib';
import Instrumentation from 'bundles/userModal/lib/instrumentation';

const BLOCKLIST = ['/degrees', '/coronavirus', '/government', '/for-university-and-college-students', '/business'];
const ONE_SECOND = 1000;

class GoogleOneTap extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    const { router } = this.context;
    const isBlocked = BLOCKLIST.filter((item) => router.location.pathname.startsWith(item)).length > 0;

    if (epic.get('GrowthAcquisition', 'showGoogleOneTapId') && !isBlocked) {
      setTimeout(this.show, ONE_SECOND);
    }
  }

  show = () => {
    const { router } = this.context;

    thirdPartyAuth
      .connect('googleOneTap')
      .then((response) => {
        Instrumentation.thirdPartyAuth('googleOneTap', response);

        // @ts-ignore ts-migrate(2339) FIXME: Property 'isRegistration' does not exist on type '... Remove this comment to see the full error message
        const { isRegistration = false } = response ?? {};

        if (isRegistration) {
          this.onSignup();
        } else {
          this.onLogin();
        }
      })
      .fail((error) => {
        Instrumentation.thirdPartyError('googleOneTap', error);
        const code = error?.code;
        let query = { ...router.location.query };

        switch (code) {
          // We need to support old cases so I'll be supporting accountLinkedToSocialAccount and
          // existingCourseraAccountNoPasswordSet until we fully deploy this
          case 'accountLinkedToSocialAccount':
          case 'existingCourseraAccountNoPasswordSet':
            query = { ...query, authMode: 'linked', authType: 'google', serviceCode: error?.existingAccountType };
            break;

          case 'unknownStatus':
            // authMode is coming from router.location.query
            query = { ...query, authType: 'google', errorCode: code };
            break;

          default:
            query = { ...query, authMode: 'complete', authType: 'google', completeMode: code };
            break;
        }

        const targetUrl = {
          pathname: router.location.pathname,
          params: router.params,
          query,
        };

        router.push(targetUrl, { ...targetUrl, pathname: router.asPath.split('?')[0] });
      });
  };

  onLogin = () => {
    localStorage.setItem('has_previously_logged_in', 'true');

    actions.onLogin();
  };

  onSignup = () => {
    actions.onSignup();
  };

  render() {
    return null;
  }
}

export default GoogleOneTap;
