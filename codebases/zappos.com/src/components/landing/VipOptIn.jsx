import { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { ButtonSpinner } from 'components/Loader';
import useMartyContext from 'hooks/useMartyContext';
import { fetchRewardsInfo, signupForRewards } from 'actions/account/rewards';

import css from 'styles/components/landing/vipOptIn.scss';

const MAX_RETRIES = 10;

export const VipOptIn = props => {
  const { testId } = useMartyContext();
  const {
    fetchRewardsInfo,
    signupForRewards,
    slotDetails
  } = props;

  const [isEnrolling, setEnrolling] = useState(false);

  if (!slotDetails) {
    return null;
  }

  const {
    enrollment = {},
    terms = {},
    supplemental = {},
    bgcolor
  } = slotDetails;

  let numberOfRetries = 0;

  const fetchRewardsPoll = () => {
    fetchRewardsInfo().then(resp => {
      if (numberOfRetries >= MAX_RETRIES) { // maximum number of retries met, just set back to default state
        setEnrolling(false);
      } else if (resp?.consented === true) { // reload the page when enrollment has been dispatched to fetch new Symphony creatives on Dashboard
        window.location.reload();
      } else { // has not come back with `consented: true`, increment number of retries, and make another api call
        numberOfRetries++;
        fetchRewardsPoll();
      }
    });
  };

  const onSignup = e => {
    e.preventDefault();
    setEnrolling(true);
    signupForRewards().then(resp => {
      if (resp?.transaction_type === 'ENROLL') {
        fetchRewardsPoll();
      } else {
        setEnrolling(false);
      }
    });
  };

  const styles = {
    background: bgcolor
  };

  return (
    <div className={css.container} style={styles}>
      <h2>{enrollment.heading}</h2>
      <p>{enrollment.copy}</p>
      <form method="post" onSubmit={onSignup}>
        <div className={css.termsCheckbox}>
          <input type="checkbox" id="rewardsTerms" required/>
          <label htmlFor="rewardsTerms">{terms.label}</label>
        </div>

        <Link to={terms.ctalink} data-test-id={testId('termsConditionsVip')}>{terms.cta}</Link>

        <div className={css.buttonRow}>
          <div className={css.signUpButton}>
            { isEnrolling
              ? <button type="submit" disabled>Enrolling... <ButtonSpinner className={css.enrollingSpinner} /></button>
              : <button type="submit">{enrollment.cta}</button>
            }

          </div>
          <div className={css.learnMoreButton}>
            <Link to={enrollment.secondaryctalink} data-test-id={testId('learnMoreVipButton')}>{enrollment.secondarycta}</Link>
          </div>
        </div>

        <Link
          to={supplemental.ctalink}
          data-track-action="Action"
          data-track-label="Loyalty"
          data-track-value="GotoQuestions"
          data-test-id={testId('vipFaqLink')}>
          {supplemental.cta}
        </Link>
      </form>
    </div>
  );
};

export default connect(null, {
  fetchRewardsInfo,
  signupForRewards
})(VipOptIn);

