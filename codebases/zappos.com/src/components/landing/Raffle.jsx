import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import throttle from 'lodash.throttle';

import { LIST_OF_STATES } from 'constants/appConstants';
import { submitRaffleData } from 'actions/landing/raffle';
import { useCountdownTimer } from 'hooks/useCountdownTimer';
import LandingPageImage from 'components/landing/LandingPageImage';
import CountdownTimer from 'components/common/CountdownTimer';
import { Loader } from 'components/Loader';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

import css from 'styles/components/landing/raffle.scss';

const invalidScrollListener = ({ target }) => {
  const headerHeight = document.querySelector('header')?.offsetHeight;
  const invalidInputTop = target?.offsetTop;
  if (headerHeight && invalidInputTop) {
    window.scrollTo(0, invalidInputTop - headerHeight - 50);
  }
};
const throttledScrollListener = throttle(invalidScrollListener, 100, { leading: true, trailing: false });

export const Raffle = props => {
  const {
    slotName,
    slotIndex,
    onComponentClick,
    useCountdownTimer,
    raffleUrl,
    submitRaffleData,
    raffle: { error, success, inProgress },
    ipStatus: { valid, callCompleted } = {},
    slotDetails: {
      copy, heading, termsheading, termscopy, time, src, retina, mobilesrc, mobileretina,
      tabletsrc, tabletretina, alt = '', iprestricted, showinstagram, showstates, showheight, sizeoptions, monetateId,
      copytimepassed = 'Giveaway has expired.',
      copysubmitsuccess = 'Submission successful!',
      copysubmiterror = 'An error has occurred with your submission. Please try again.',
      copynotavailable = 'This giveaway is not available in your area.'
    }
  } = props;

  const parsedTime = new Date(time);
  const releaseTime = useCountdownTimer(time);

  const scrollAfterSubmitCallback = () => {
    const el = document.querySelector('[data-scroll-target]');
    if (el) {
      el.scrollIntoView();
    }
  };

  // Is IP restricted and inside fence OR no fence
  const ipRestricted = iprestricted === 'true';
  const ipValid = (ipRestricted && valid && callCompleted) || !ipRestricted;
  const ipInvalid = ipRestricted && !valid && callCompleted;
  const showForm = ipValid && releaseTime?.timePassed === false;
  const showTimePassed = ipValid && releaseTime?.timePassed === true;

  const makeFormSection = () => {
    if (success) {
      return <p className={css.copy}>{copysubmitsuccess}</p>;
    } else if (error) {
      return <p className={css.copy}>{copysubmiterror}</p>;
    } else if (ipInvalid) {
      return <p className={css.copy}>{copynotavailable}</p>;
    } else if (showTimePassed) {
      return <p className={css.copy}>{copytimepassed}</p>;
    } else if (showForm) {
      return (
        <form
          onInvalid={throttledScrollListener}
          onSubmit={e => submitRaffleData(e, scrollAfterSubmitCallback)}
          method="POST"
          action={raffleUrl}
          disabled={inProgress}>
          {copy && <p className={css.copy}>{copy}</p>}
          <div className={css.field}>
            <label htmlFor="firstName">First name:</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="First name"
              required={true}/>
          </div>
          <div className={css.field}>
            <label htmlFor="lastName">Last name:</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Last name"
              required={true}/>
          </div>
          <div className={css.field}>
            <label htmlFor="emailAddress">Email:</label>
            <input
              type="email"
              name="emailAddress"
              id="emailAddress"
              placeholder="Email Address"
              required={true}/>
          </div>
          {!!sizeoptions?.length && <div className={css.field}>
            <label htmlFor="shoeSize">Size</label>
            <select
              required={true}
              name="shoeSize"
              id="shoeSize"
              defaultValue="">
              <option value="">Size</option>
              {sizeoptions.map(size =>
                <option value={size} key={size}>{size}</option>
              )}
            </select>
          </div>}
          {showheight === 'true' && <div className={css.field}>
            <label htmlFor="height">Height:</label>
            <input
              type="text"
              name="height"
              id="height"
              placeholder="Height"
              required={true}/>
          </div>}
          {showstates === 'true' && <div className={css.field}>
            <label htmlFor="state">State:</label>
            <select
              name="state"
              id="state"
              required={true}
              defaultValue="">
              <option value="">Select your state</option>
              {LIST_OF_STATES.map(state =>
                <option value={state} key={state}>{state}</option>
              )}
            </select>
          </div>}
          {showinstagram === 'true' && <div className={css.field}>
            <label htmlFor="instagramHandle">Social:</label>
            <input
              type="text"
              name="instagramHandle"
              id="instagramHandle"
              required={true}
              placeholder="@instagramprofile"/>
          </div>}
          <div className={css.termsContainer}>
            {termsheading && <p className={css.termsHeading}>{termsheading}</p>}
            {termscopy && <p className={css.termsCopy} dangerouslySetInnerHTML={{ __html: termscopy }}/>}
            <input
              required={true}
              type="checkbox"
              name="tos"
              id="tos"/>
            <label htmlFor="tos">Do you agree<span className={css.srOnly}> to the terms and conditions</span>?</label>
          </div>
          <button
            onClick={onComponentClick}
            data-eventlabel="Raffle"
            data-eventvalue="RaffleSubmit"
            data-slotindex={slotIndex}
            className={css.submit}
            disabled={inProgress}
            type="submit">{inProgress ? 'Submitting...' : 'Enter'}</button>
        </form>
      );
    } else {
      return <Loader/>;
    }
  };

  return (
    <div className={css.container} data-slot-id={slotName} data-monetate-id={monetateId}>
      <div>
        {releaseTime && <time dateTime={parsedTime.toISOString()}>{parsedTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</time>}
        {!!heading && <h1>{heading}</h1>}
        <CountdownTimer releaseTime={releaseTime}/>
        {makeFormSection()}
      </div>
      <figure>
        <LandingPageImage
          src={src}
          retina={retina}
          mobilesrc={mobilesrc}
          mobileretina={mobileretina}
          tabletsrc={tabletsrc}
          tabletretina={tabletretina}
          alt={alt}
        />
      </figure>
    </div>
  );
};

function mapStateToProps(state) {
  const raffleUrl = `${state.environmentConfig.api.mafia.url}/email/subscriptions/zen/v1/raffle`;
  return {
    raffle: state.raffle,
    raffleUrl
  };
}

Raffle.defaultProps = {
  useCountdownTimer
};

Raffle.contextTypes = {
  testId: PropTypes.func
};

const ConnectedRaffle = connect(mapStateToProps, { submitRaffleData })(Raffle);
export default withErrorBoundary('Raffle', ConnectedRaffle);
