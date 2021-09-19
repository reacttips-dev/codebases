import { connect } from 'react-redux';

import useMartyContext from 'hooks/useMartyContext';
import { myAccountLinkMap } from 'constants/amethystEnums';
import MartyLink from 'components/common/MartyLink';
import Info from 'components/icons/Info';
import PrimeLogo from 'components/icons/vipDashboard/PrimeLogo';
import VipLogo from 'components/icons/vipDashboard/VipLogo';
import { toThousandsSeparator, toUSD } from 'helpers/NumberFormats';

import css from 'styles/components/landing/vipDashboardHeader.scss';

export const VipDashboardHeader = props => {
  const { testId, marketplace: { account: { vipDashboardUrl } } } = useMartyContext();

  const {
    slotDetails,
    firstName,
    rewardsInfo,
    isAccountOverview = false
  } = props;

  if (!(rewardsInfo && slotDetails)) {
    return null;
  }

  const {
    spendPoints,
    prime,
    spendPointsDollarValue
  } = rewardsInfo;

  const {
    greeting,
    redemptionCopy,
    dashboardCta,
    info: { title, link } = {}
  } = slotDetails;

  return (
    <div className={css.headerBar} data-test-id={testId('vipDashboardHeaderBar')}>
      <div>
        <VipLogo />
        { !!prime && <PrimeLogo /> }
      </div>

      {
        isAccountOverview
          ? <div className={css.goToDashboard}><MartyLink to={vipDashboardUrl} data-amethyst-account-link={myAccountLinkMap.VIEW_VIP_DASHBOARD_CLICK} data-test-id={testId('viewDashboard')}>{dashboardCta}</MartyLink></div>
          : <div>{greeting} <span>{firstName}!</span></div>
      }

      {
        !!spendPoints && !!spendPointsDollarValue &&
        <div className={css.pointsSection}>
          <div>
            { title && link &&
              <MartyLink to={link} data-test-id={testId('infoLink')}>
                <Info
                  width={20}
                  height={20}
                  opacity={.7}
                  title={title} />
              </MartyLink>
            }
            {toThousandsSeparator(spendPoints)} VIP Points ({toUSD(spendPointsDollarValue)})
          </div>

          <div>{redemptionCopy}</div>
        </div>
      }
    </div>
  );
};

const mapStateToProps = ({ holmes, rewards: { rewardsInfo } }) => ({
  firstName: holmes ? holmes.firstName : '',
  rewardsInfo
});

export default connect(mapStateToProps)(VipDashboardHeader);
