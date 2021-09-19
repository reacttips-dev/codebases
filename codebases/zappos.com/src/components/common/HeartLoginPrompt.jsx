import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { stringify } from 'query-string';

import { setFederatedLoginModalVisibility } from 'actions/headerfooter';
import MelodyModal from 'components/common/MelodyModal';
import { trackEvent } from 'helpers/analytics';
import { getType } from 'history/historyFactory';
import { MartyContext } from 'utils/context';

import css from 'styles/components/common/heartLoginPrompt.scss';

const LOGIN_PROMPT_TE_BY_PAGETYPE = {
  'brand': 'TE_BRAND_PAGE_HEART_LOGIN_PROMPT',
  'homepage': 'TE_LANDING_HEART_LOGIN_PROMPT',
  'landing': 'TE_LANDING_HEART_LOGIN_PROMPT',
  'pdp': 'TE_PDP_HEART_LOGIN_PROMPT',
  'search': 'TE_SEARCH_HEART_LOGIN_PROMPT'
};

export class HeartLoginPrompt extends Component {
  trackHeartLoginPrompt = () => {
    trackEvent(LOGIN_PROMPT_TE_BY_PAGETYPE[getType(window.location.pathname)] || 'TE_FOOTER_HEART_LOGIN_PROMPT');
  };

  handleFederatedSignInClick = returnTo => {
    const { toggleModal, setFederatedLoginModalVisibility } = this.props;
    this.trackHeartLoginPrompt();
    setFederatedLoginModalVisibility(true, { returnTo });
    toggleModal(false);
  };

  handleSignInClick = () => {
    const { toggleModal } = this.props;
    this.trackHeartLoginPrompt();
    toggleModal(false);
  };

  render() {
    return (
      <MartyContext.Consumer>
        {({ testId, marketplace: { hasFederatedLogin } }) => {
          const { isOpen, toggleModal, routing: { pathname, query }, id } = this.props;
          const modalData = { 'test-id': testId('heartLoginModal') };
          const returnTo = encodeURIComponent(`${pathname}?${stringify({ ...query, heartOnLoad: id })}`);
          const url = `/zap/preAuth/signin?openid.return_to=${returnTo}`;
          return (
            <MelodyModal
              data={modalData}
              isOpen={isOpen}
              onRequestClose={() => toggleModal(false)}
              className={css.container}
              heading="Sign In to Save Items to Favorites"
              headingTestId="heading"
              wrapperTestId="heartLoginModal"
              buttonTestId="close">
              <p className={css.copy} data-test-id={testId('modalText')}>In order to <span>heart</span> something, you must be signed in. If you don’t have an account, you will have to register to create one.</p>
              <div className={css.bottomSection}>
                {
                  hasFederatedLogin
                    ?
                    <button
                      className={css.signInButton}
                      type="button"
                      onClick={() => this.handleFederatedSignInClick(returnTo)}
                      data-test-id={testId('heartSignIn')}
                    >
                      Sign in / Register
                    </button>
                    :
                    <a
                      className={css.signInButton}
                      href={url}
                      onClick={this.handleSignInClick}
                      data-test-id={testId('heartSignIn')}
                    >
                      Sign in / Register
                    </a>
                }
              </div>
            </MelodyModal>
          )
          ;
        }}
      </MartyContext.Consumer>
    );
  }
}

HeartLoginPrompt.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  routing: PropTypes.object.isRequired,
  id: PropTypes.string
};

const mapDispatchToProps = {
  setFederatedLoginModalVisibility
};

export default connect(null, mapDispatchToProps)(HeartLoginPrompt);
