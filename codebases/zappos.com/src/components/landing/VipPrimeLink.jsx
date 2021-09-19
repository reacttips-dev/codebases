import { useCallback, useEffect, useReducer, useRef } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Link } from 'react-router';
import cn from 'classnames';
import { stringify } from 'query-string';

import { titaniteView, track } from 'apis/amethyst';
import { evVipLwaPromoReturnImpression } from 'events/landing';
import { isDesktop as isDesktopHelper } from 'helpers/ClientUtils';
import useMartyContext from 'hooks/useMartyContext';
import { EASYFLOW_ENROLLMENT_URL, EASYFLOW_LANDING_PAGES } from 'constants/rewardsInfo';
import { SmallLoader } from 'components/Loader';
import MelodyModal from 'components/common/MelodyModal';
import HtmlToReact from 'components/common/HtmlToReact';
import PrimeLogo from 'components/icons/vipDashboard/PrimeLogo';
import VipLogo from 'components/icons/vipDashboard/VipLogo';
import { toggleEasyFlowModal } from 'actions/landing/landingPageInfo';
import { fetchEasyFlowContent, fetchPrimeStatus, fetchRewardsInfo, signupForRewards } from 'actions/account/rewards';

import css from 'styles/components/landing/vipPrimeLink.scss';

export const makeCopy = str => <HtmlToReact containerEl="p">{str}</HtmlToReact>;

export const fallbackSlotDetails = {
  'introNotVipNotLinked': [{
    'heading': 'Do you have Amazon Prime?',
    'copy': 'You can link your Prime membership to get FREE upgraded shipping on all Zappos orders. For even more perks as a Prime member, join Zappos VIP, too!'
  }, {
    'heading': 'Sign me up for Zappos VIP! (It’s FREE!)',
    'copy': 'Prime-linked VIPs get faster shipping and 2 points for every $1 spent on Zappos. Plus, VIPs can redeem their points for VIP Codes!'
  }],
  'returnNotVipLinked': [{
    'copy': 'Congrats! You’ve successfully linked your Prime membership. Amazon Prime members can join Zappos VIP to get faster shipping and 2 points for every $1 spent on Zappos. Plus, VIPs can redeem their points for VIP Codes!'
  }],
  'introVipNotLinked': [{
    'copy': 'Amazon Prime members can link their Prime memberships to get 2 points for every $1 spent on Zappos. That’s twice the value for VIPs! Don’t forget…as a VIP, you can redeem your points for VIP Codes!'
  }],
  'introNotVipLinked': [{
    'copy': 'Amazon Prime members can join Zappos VIP to get faster shipping and 2 points for every $1 spent on Zappos. Plus, VIPs can redeem their points for VIP Codes!'
  }],
  'returnVipLinked': [{
    'copy': 'Way to go! As a Prime-linked VIP, you’re now earning 2 points for every $1 spent on Zappos. That’s twice the value for VIPs! Don’t forget…as a VIP, you can redeem your points for VIP Codes!'
  }],
  'ineligible': {
    'cta': 'Got it',
    'heading': 'Prime benefits eligibility'
  },
  'returnVipIneligible': [{
    'copy': 'We’re so sorry. Your account does not currently qualify for Prime benefits on Zappos, but you’re still a Zappos VIP and will continue to get FREE Expedited shipping, 1 point for every $1 spent on Zappos, plus points for logging and leaving reviews! To find out how to qualify for Prime benefits, visit our Zappos FAQ page.'
  }],
  'background': 'https://m.media-amazon.com/images/G/01/zappos/landing/pages/primelink/Hero1_v4_nocopy._CB1584562899_SX1024_.jpg',
  'lwa': {
    'cta': 'Link my Amazon Prime',
    'heading': 'Upgrade your Zappos account!'
  },
  'introVipLinked': [{
    'copy': 'Way to go! As a Prime-linked VIP, you’re now earning 2 points for every $1 spent on Zappos. That’s twice the value for VIPs! Don’t forget…as a VIP, you can redeem your points for VIP Codes!'
  }],
  'complete': {
    'cta': 'Start earning rewards',
    'heading': 'You\'re all set!'
  },
  'vip': {
    'cta': 'Sign up for VIP',
    'heading': 'Upgrade your VIP status!'
  },
  'returnNotVipIneligible': [{
    'copy': 'We’re so sorry. Your account does not currently qualify for Prime benefits on Zappos. To find out how to qualify for Prime benefits, visit our Zappos FAQ page.'
  }, {
    'heading': 'Still want perks? Become a VIP! (It’s FREE.)',
    'copy': 'Zappos VIPs get FREE Expedited shipping, 1 point for every $1 spent on Zappos, plus points for logging and leaving reviews.'
  }]
};

export const createPreservedStateQuerystring = ({ isModal, amazonAuthUrl }, { locationBeforeTransitions }) => {
  const pathName = isModal ? locationBeforeTransitions.pathname : EASYFLOW_ENROLLMENT_URL;
  const search = isModal ? locationBeforeTransitions.search?.substring(1) : '';
  const returnTo = encodeURIComponent(`${pathName}?${search}${search === '' ? '' : '&'}${stringify({ isModal, isComplete: true, isPromo: false })}`);
  return `${amazonAuthUrl}${returnTo}`;
};

export const VipPrimeLink = ({
  states = {},
  isCustomer,
  isEasyFlowShowing = false,
  isPageModal,
  rewards,
  pageName,
  easyFlowContent,
  fetchEasyFlowContent,
  fetchRewardsInfo,
  fetchPrimeStatus,
  signupForRewards,
  toggleEasyFlowModal,
  push,
  routing
}) => {
  const { rewardsInfo, primeStatus } = rewards || {};
  const { locationBeforeTransitions: { query = {} } } = routing;
  const { enrolled: vipEnrolled, canEnroll } = rewardsInfo || {};
  const primeLinked = primeStatus === 'PRIME';

  const slotDetails = easyFlowContent || fallbackSlotDetails;

  const {
    marketplace: { features: { federatedLogin: { amazonAuthUrl } } }
  } = useMartyContext();

  const initialState = {
    isPromo: true, // should show initial promo
    isIneligible: false,
    isComplete: false,
    shouldUpsell: false,
    isModal: false, // the modal is displayed on a modal or a page, dictactes the way it should be rendered
    isEnrolling: false,
    showPage: false,
    isLoading: true,
    builtAmazonAuthUrl: amazonAuthUrl,
    ...states
  };

  const reducer = (state, action) => ({ ...state, ...action });
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    isEnrolling,
    isIneligible,
    showPage,
    isModal,
    isComplete,
    isLoading,
    builtAmazonAuthUrl
  } = state;

  const firePageView = useCallback(rewardsInfo => {
    const { enrolled } = rewardsInfo || {};

    if (primeStatus) {
      track(() => [
        evVipLwaPromoReturnImpression, {
          isVipEnrolled: !!enrolled,
          isLwaLinked: primeStatus === 'PRIME'
        }
      ]);
    }
  }, [primeStatus]);

  useEffect(() => {
    dispatch({ showPage: true });
    dispatch({ builtAmazonAuthUrl:createPreservedStateQuerystring({ isModal, amazonAuthUrl }, routing) });
    if (isModal) {
      titaniteView(); // standalone page dispatches it's own titaniteView
    }
  }, [amazonAuthUrl, isModal, routing]);

  // for eligible landing pages, on Prime linking return, display the modal
  useEffect(() => {
    if (EASYFLOW_LANDING_PAGES.includes(pageName) && isComplete) {
      toggleEasyFlowModal(true);
    }
  }, [isComplete, pageName, toggleEasyFlowModal]);

  useEffect(() => {
    // only fetch data when the modal is opened, or fetch it immediately if its the standalone page.
    if (isEasyFlowShowing || !isPageModal) {
      if (isCustomer) {
        fetchPrimeStatus();
      }

      // fetch symphony content if it hasn't already
      if (!easyFlowContent) {
        fetchEasyFlowContent();
      }

      fetchRewardsInfo().then(resp => {
        if (isComplete) {
          firePageView(resp);

          // if you started the EasyFlow path in a modal, open the modal on return.
          if (isModal) {
            toggleEasyFlowModal(true);
          }
        }
      });
    }
  }, [easyFlowContent, fetchEasyFlowContent, fetchPrimeStatus, fetchRewardsInfo, firePageView, isComplete, isCustomer, isEasyFlowShowing, isModal, isPageModal, toggleEasyFlowModal]);

  useEffect(() => { // Update status with preserved params
    if (showPage) {
      const { isComplete, isPromo, isModal } = query;

      if (isComplete) {
        dispatch({ isComplete: isComplete === 'true' });
      }

      if (isPromo) {
        dispatch({ isPromo: isPromo === 'true' });
      }

      if (isModal) {
        dispatch({ isModal: isModal === 'true' });
      }

      if (isPageModal) {
        dispatch({ isModal: true });
      }

      dispatch({
        isIneligible: primeStatus === 'NOT_PRIME'
      });
    }
  }, [isPageModal, primeStatus, query, showPage]);

  useEffect(() => {
    // cannot fetch status or enrollment,
    // or customer has never enrolled in VIP
    if (!isCustomer || canEnroll) {
      dispatch({ isLoading: false });
      return;
    }

    // if API comes back with enrollment/linked statuses
    if (primeStatus !== undefined && vipEnrolled !== undefined) {
      dispatch({ isLoading: false });
    }
  }, [canEnroll, isCustomer, primeStatus, vipEnrolled]);

  const enrollmentCheck = useRef();

  if (!showPage || !slotDetails) {
    return null;
  }

  const {
    ineligible,
    complete,
    vip,
    lwa,
    background
  } = slotDetails;

  const isDesktop = isDesktopHelper();

  const onClose = () => {
    if (isModal) {
      toggleEasyFlowModal(false);
    } else {
      push('/');
    }
  };

  const onVipLwaLink = e => {
    if (!enrollmentCheck.current?.checked) {
      return true; // do the default action, which is navigate to LWA
    }

    e.preventDefault();

    // sign up before fwding them to lwa
    if (enrollmentCheck.current?.checked) {
      dispatch({ isEnrolling: true });
      signupForRewards(EASYFLOW_ENROLLMENT_URL).then(() => {
        window.location.href = amazonAuthUrl;
      });
    }
  };

  const onVipLink = () => {
    signupForRewards(EASYFLOW_ENROLLMENT_URL);
  };

  const makeHeading = () => {
    if (isLoading) {
      return null;
    }

    if (isEnrolling) {
      return 'Enrolling...';
    }

    if (vipEnrolled && primeLinked) {
      return complete.heading;
    }

    if (isIneligible) {
      return ineligible.heading;
    }

    if (!vipEnrolled) {
      return lwa.heading;
    }

    // not enrolled, eligible, upsell VIP again
    return vip.heading;
  };

  const makeActions = () => {
    const cancelButton = <button className={css.cancel} type="button" onClick={onClose}>Cancel</button>;

    switch (true) {
      case vipEnrolled && primeLinked: // if enrolled, linked
        return complete.cta &&
          <button
            className={css.primary}
            type="button"
            onClick={onClose}>{complete.cta}</button>;

      case primeStatus === 'UNKNOWN': // if we dont know if you're linked
      case primeStatus === undefined:
        return lwa.cta && (
          <>
            { cancelButton }
            <Link
              className={css.primary}
              to={builtAmazonAuthUrl}
              onClick={onVipLwaLink}>{lwa.cta}</Link>
          </>
        );

      case isIneligible && vipEnrolled: // if you're prime ineligible and you've already signed up for VIP
        return ineligible.cta &&
          <button
            className={css.primary}
            type="button"
            onClick={onClose}>{ineligible.cta}</button>;

      default: // if nothing else, show the "Sign up for VIP" button
        return vip.cta && (
          <>
            { cancelButton }
            <button
              className={css.primary}
              type="button"
              onClick={onVipLink}>{vip.cta}</button>
          </>
        );
    }
  };

  const primeVipLogos = (
    <>
      <div className={css.logos}>
        <div className={css.primeLogo}>
          <PrimeLogo />
        </div>

        { !isIneligible &&
          <>
            <span className={css.plus} aria-label="Plus">+</span>
            <div className={css.vipLogo}>
              <VipLogo />
            </div>
          </>
        }
      </div>
    </>
  );

  const {
    introNotVipNotLinked,
    introNotVipLinked,
    introVipNotLinked,
    introVipLinked,
    returnNotVipLinked,
    returnVipLinked,
    returnNotVipIneligible,
    returnVipIneligible
  } = slotDetails;

  // intro, enrolled, linked
  const [ introComplete ] = introVipLinked;
  const introVipLinkedContent = (
    <div className={css.step}>
      { makeCopy(introComplete.copy) }
    </div>
  );

  // return, enrolled, linked
  const [ returnComplete ] = returnVipLinked;
  const returnVipLinkedContent = (
    <div className={css.step}>
      { makeCopy(returnComplete.copy) }
    </div>
  );

  // intro, not enrolled, not linked
  const [ introPrime, introVIP ] = introNotVipNotLinked;
  const introNotVipNotLinkedContent = (
    <div className={css.step}>
      <h3>{ introPrime.heading }</h3>
      { makeCopy(introPrime.copy) }

      {
        (isCustomer && !vipEnrolled) && // if they're a recognized customer, and they're not already part of VIP
          <>
            <input
              ref={enrollmentCheck}
              defaultChecked={true}
              id="signUpVIP"
              type="checkbox" />
            <label htmlFor="signUpVIP">{introVIP.heading}</label>
            { makeCopy(introVIP.copy) }
          </>
      }
    </div>
  );

  const introNotVipNotLinkedEnrollingContent = (
    <div className={css.step}>
      <SmallLoader />
    </div>
  );

  // intro, enrolled, not linked
  const [ introNotLinked ] = introVipNotLinked;
  const introVipNotLinkedContent = (
    <div className={css.step}>
      { makeCopy(introNotLinked.copy) }
    </div>
  );

  // intro, not enrolled, linked
  const [ introNotVip ] = introNotVipLinked;
  const introNotVipContent = (
    <div className={css.step}>
      { makeCopy(introNotVip.copy) }
    </div>
  );

  // return, not enrolled, linked
  const [ returnNotVip ] = returnNotVipLinked;
  const returnNotVipLinkedContent = (
    <div className={css.step}>
      { makeCopy(returnNotVip.copy) }
    </div>
  );

  // return, enrolled, ineligible
  const [ vipIneligible ] = returnVipIneligible;
  const vipIneligibleContent = (
    <div className={css.step}>
      { makeCopy(vipIneligible.copy) }
    </div>
  );

  // return, not enrolled, ineligible
  const [ notVipIneligible, ineligibleVipUpsell ] = returnNotVipIneligible;
  const notVipIneligibleContent = (
    <div className={css.step}>
      { makeCopy(notVipIneligible.copy) }

      <h3>{ ineligibleVipUpsell.heading }</h3>
      { makeCopy(ineligibleVipUpsell.copy) }
    </div>
  );

  const makeSteps = () => {
    // check for eligibility first
    if (isIneligible) {
      // not enroll into VIP
      if (!vipEnrolled) {
        return notVipIneligibleContent;
      }

      // enrolled into VIP
      return vipIneligibleContent;
    }

    // promo ingress
    if (!isComplete) {
      if (isEnrolling) {
        return introNotVipNotLinkedEnrollingContent;
      }

      if (!vipEnrolled && primeLinked) {
        return introNotVipContent;
      }

      if (!vipEnrolled && !primeLinked) {
        return introNotVipNotLinkedContent;
      }

      if (vipEnrolled && !primeLinked) {
        return introVipNotLinkedContent;
      }

      return introVipLinkedContent;
    }

    if (!vipEnrolled && primeLinked) {
      return returnNotVipLinkedContent;
    }

    return returnVipLinkedContent;
  };

  const makeContent = () => {
    // dont render any content until prime status and vip enrollment have come back
    if (isLoading) {
      return <SmallLoader />;
    }

    return (
      <>
        { primeVipLogos }
        { makeSteps() }
        <div className={css.actions}>
          { makeActions() }
        </div>
      </>
    );
  };

  if (isModal) {
    return (
      <MelodyModal
        buttonTestId="close"
        className={cn({ [css.modal]: isModal })}
        contentLabel="VIP Prime Linking"
        heading={makeHeading()}
        bodyOpenClassName={css.bodyOpen}
        onRequestClose={onClose}
        isOpen={isEasyFlowShowing}>
        { makeContent() }
      </MelodyModal>
    );
  }

  return (
    <div className={css.page} style={{ backgroundImage: !isDesktop ? `url('${background}')` : 'none' }}>
      <h2>{ makeHeading() }</h2>
      { makeContent() }
    </div>
  );
};

export const mapStateToProps = state => {
  const { cookies, rewards, landingPage, routing } = state;
  const isCustomer = 'x-main' in cookies;
  const { isEasyFlowShowing, pageName } = landingPage || {};
  const { easyFlowContent } = rewards || {};

  return {
    isCustomer,
    isEasyFlowShowing,
    pageName,
    routing,
    rewards,
    easyFlowContent
  };
};

export default connect(mapStateToProps, {
  fetchRewardsInfo,
  fetchEasyFlowContent,
  fetchPrimeStatus,
  signupForRewards,
  toggleEasyFlowModal,
  push
})(VipPrimeLink);
