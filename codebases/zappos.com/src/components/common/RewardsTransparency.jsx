import cn from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import useMartyContext from 'hooks/useMartyContext';
import { evOnShowRewardsTransparencyClick } from 'events/global';
import HtmlToReact from 'components/common/HtmlToReact';
import VipOnlyLogo from 'components/icons/vipDashboard/VipOnlyLogo';
import MartyLink from 'components/common/MartyLink';
import ProductUtils from 'helpers/ProductUtils';
import { replaceTemplateVariable } from 'helpers/LandingPageUtils';
import { toUSD } from 'helpers/NumberFormats';
import { track } from 'apis/amethyst';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

import css from 'styles/components/common/rewardsTransparency.scss';

const pointsToPageMap = {
  'cart': 'transparencyPointsForCart',
  'checkout': 'transparencyPointsForCart',
  'homepage': 'transparencyPointsForBrand',
  'landing': 'transparencyPointsForBrand',
  'product': 'transparencyPointsForItem'
};

export const makeCopy = str => <HtmlToReact noContainer={true}>{str}</HtmlToReact>;

export const RewardsTransparency = props => {
  const { testId, marketplace: { hasRewardsTransparency } } = useMartyContext();
  const {
    isForCartModal,
    pageType,
    isGiftCard,
    pointsForCurrentPage,
    slotContent,
    isRecognizedCustomer,
    rewardsForCurrentPage,
    accountRewards = {},
    rewards
  } = props;

  if (!slotContent) {
    return null;
  }

  const {
    account: { cta: accountCta, copy: accountCopy },
    enrollCopy,
    signinCopy,
    dashboardUrl,
    cartCopy,
    cartModalCopy,
    pdpCopy
  } = slotContent;

  const { isEnrolled, transparencyPointsForCart } = rewards;

  const handleCtaClick = () => {
    track(() => ([
      evOnShowRewardsTransparencyClick, { isForCartModal, pageType, rewards, isRecognizedCustomer, rewardsForCurrentPage }
    ]));
  };

  const makeRecognizedStatusText = () => {
    if (isRecognizedCustomer && isEnrolled) {
      return '';
    }

    if (isRecognizedCustomer && !isEnrolled) {
      return <Link onClick={handleCtaClick} to={dashboardUrl}>{ makeCopy(enrollCopy) }</Link>;
    }

    return <Link onClick={handleCtaClick} to={dashboardUrl} data-test-id={testId('vipDashboardLink')}>{ makeCopy(signinCopy) }</Link>;
  };

  const makeText = () => {
    const cartPoints = transparencyPointsForCart?.totalPoints?.dollarValue;
    if (isForCartModal) {
      return !!cartPoints && (
        <p data-test-id={testId('pointsForModal')}>{ makeCopy(replaceTemplateVariable(cartModalCopy, toUSD(cartPoints, false))) }</p>
      );
    }

    if (pageType === 'cart' && pointsForCurrentPage) {
      return (
        <p data-test-id={testId('pointsForCurrentPage')}>{ makeCopy(replaceTemplateVariable(cartCopy, pointsForCurrentPage)) } {makeRecognizedStatusText()}</p>
      );
    }

    if (pageType === 'product' && pointsForCurrentPage) {
      return (
        <p>{ makeCopy(replaceTemplateVariable(pdpCopy, pointsForCurrentPage)) } {makeRecognizedStatusText()}</p>
      );
    }

    return null;
  };

  if (!hasRewardsTransparency || (pageType === 'product' && isGiftCard && !isForCartModal)) {
    return null;
  }

  if (pageType === 'account') {
    const { rewardsInfo } = accountRewards;
    return rewardsInfo && !rewardsInfo.consented && rewardsInfo.canEnroll && <div
      className={cn(css.page, { [css.account]: pageType === 'account' && !isForCartModal })}
      data-test-id={testId('rewardsTransparencyContainer')}>
      <VipOnlyLogo />
      <p><MartyLink data-test-id={testId('viewDashboard')} to={dashboardUrl}>{ makeCopy(accountCta) }</MartyLink> { makeCopy(accountCopy) }</p>
    </div>;
  }

  const rewardsText = makeText();

  if (!rewardsText && pageType === 'product') {
    return <div className={css.placeholder} />;
  }

  return !!rewardsText && (
    <div
      className={cn(css.page, {
        [css.checkout]: pageType === 'checkout' && !isForCartModal,
        [css.cartModal]: !!isForCartModal
      })}
      data-test-id={testId('rewardsTransparencyContainer')}>
      {rewardsText}
    </div>
  );
};

const mapStateToProps = state => {
  const {
    headerFooter,
    product,
    rewards: accountRewards,
    sharedRewards: rewards,
    cookies: { 'x-main': xMain },
    pageView: { pageType }
  } = state;

  const isRecognizedCustomer = !!xMain;
  const rewardsForCurrentPage = rewards[pointsToPageMap[pageType]];
  const pointsForCurrentPage = toUSD(rewardsForCurrentPage?.totalPoints?.dollarValue, false);

  return {
    accountRewards,
    rewards,
    pageType,
    rewardsForCurrentPage,
    pointsForCurrentPage,
    isRecognizedCustomer,
    slotContent: headerFooter.content.Header.slotData['header-5'],
    isGiftCard: ProductUtils.isGiftCard(product?.detail?.defaultProductType)
  };
};

RewardsTransparency.displayName = 'RewardsTransparency';

export default withErrorBoundary('RewardsTransparency', connect(mapStateToProps)(RewardsTransparency));
