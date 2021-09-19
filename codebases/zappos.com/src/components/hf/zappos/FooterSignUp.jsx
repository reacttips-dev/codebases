import PropTypes from 'prop-types';
import cn from 'classnames';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

import css from 'styles/components/hf/zappos/footerSignUp.scss';

export const FooterSignUp = ({ isFooterSubscribeSubmitted, handleSubscribeSubmit, signUp }, { testId }) => {
  if (!signUp) {
    return null;
  }
  const submit = e => {
    e.preventDefault();
    const email = e.target.email.value;
    handleSubscribeSubmit(email);
  };
  const { heading, cta } = signUp;

  return (
    <div className={css.bgContainer}>
      <form
        method="post"
        onSubmit={submit}
        data-footer-signup
        className={css.container}
        data-test-id={testId('footerNewsletterForm')}
        action="/subscription.do">
        <h3>{heading}</h3>
        <div className={cn({ [css.submitted]: isFooterSubscribeSubmitted })}>
          <div className={css.formContent}>
            <label htmlFor="footerSubEmail">Email</label>
            <input
              data-test-id={testId('footerNewsletterInput')}
              required
              id="footerSubEmail"
              name="email"
              type="email"
              placeholder="Email Address"/>
            <button type="submit" data-test-id={testId('footerNewsletterSubmit')}>{cta}</button>
          </div>
          <div className={css.success}>
            <p aria-hidden={!isFooterSubscribeSubmitted} data-test-id={testId('footerNewsletterSuccess')}>
              Success! Thank you for subscribing!
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

FooterSignUp.contextTypes = {
  testId: PropTypes.func
};

export default withErrorBoundary('FooterSignUp', FooterSignUp);
