import PropTypes from 'prop-types';
import cn from 'classnames';

import useMartyContext from 'hooks/useMartyContext';
import MelodyModal from 'components/common/MelodyModal';
import Link from 'components/hf/HFLink';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

import css from 'styles/components/hf/signUpModal.scss';

const rewardsheadingFallback = 'Give me FREE Expedited Shipping on every order and more!';
const rewardscopyFallback = 'Sign me up for Zappos VIP. It’s FREE!';
const emailheadingFallback = 'Be the first to know about exclusive offers and new arrivals!';
const emailcopyFallback = 'Sign me up for Zappos emails.';
const headingFallback = 'Thanks for coming to our party!';

export const SignUpModal = ({ data, isVip, setSignUpModal, isSignUpModalOpen, handleSignUpModalSubmit }) => {
  const { testId, marketplace: { features: { showAccountRewards } } } = useMartyContext();

  if (data?.componentName === 'melodySignUpModal') {
    const { rewardsheading, cta, emailheading, heading, emailcopy, rewardscopy } = data;

    return (
      <MelodyModal
        buttonTestId="closeModal"
        className={cn(css.modalContent, { [css.fade]: true })}
        heading={heading || headingFallback}
        isOpen={isSignUpModalOpen}
        onRequestClose={() => setSignUpModal(false)}
        wrapperTestId={testId('headerFooterSignUpModal')}
      >
        <form method="post" className={css.mSignUpModal} onSubmit={handleSignUpModalSubmit}>
          <div className={css.content}>
            {(showAccountRewards && !isVip) &&
              <div className={css.selectionBlock}>
                <input
                  defaultChecked={true}
                  type="checkbox"
                  name="rewards"
                  id="signupModalRewards" />
                <label htmlFor="signupModalRewards">
                  <div>
                    <p className={css.contentHeading}>{rewardsheading || rewardsheadingFallback}</p>
                    <p className={css.contentCopy}>{rewardscopy || rewardscopyFallback} I agree to the <Link to="/c/vip-terms-and-conditions" target="_blank">terms and conditions</Link></p>
                  </div>
                </label>
              </div>
            }
            {
              <div className={css.selectionBlock}>
                <input
                  defaultChecked={true}
                  id="signupModalEmail"
                  name="email"
                  type="checkbox" />
                <label htmlFor="signupModalEmail">
                  <div>
                    <p className={css.contentHeading}>{emailheading || emailheadingFallback}</p>
                    <p className={css.contentCopy}>{emailcopy || emailcopyFallback}</p>
                  </div>
                </label>
              </div>
            }
          </div>
          <div className={css.footer}>
            <button
              className={css.btn}
              type="submit"
              data-test-id={testId('signupBtn')}>{cta || 'Submit'}</button>
          </div>
        </form>
      </MelodyModal>
    );
  }
  return null;
};

SignUpModal.propTypes = {
  data: PropTypes.object,
  setSignUpModal: PropTypes.func.isRequired,
  isSignUpModalOpen: PropTypes.bool.isRequired,
  handleSignUpModalSubmit: PropTypes.func.isRequired
};

export default withErrorBoundary('SignUpModal', SignUpModal);
