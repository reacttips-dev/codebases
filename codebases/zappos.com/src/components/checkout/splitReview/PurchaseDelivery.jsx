import cn from 'classnames';

import PrimeLogo from 'components/icons/vipDashboard/PrimeLogo';
import VipOnlyLogo from 'components/icons/vipDashboard/VipOnlyLogo';
import ZapposLogo from 'images/zappos/logo.svg';
import ZapposHolidayLogo from 'images/zappos/holiday-logo.png';
import useMartyContext from 'hooks/useMartyContext';

import css from 'styles/components/checkout/splitReview/purchaseDelivery.scss';

export const PurchaseDelivery = ({ description, isHighlighted, logo, promise }) => {
  const { testId } = useMartyContext();
  const logoImage = getLogoFromText(logo);

  return (
    <div className={cn(css.wrapper, { [css.highlighted]: isHighlighted })} data-test-id={testId('deliveryShipOption')}>
      <div className={css.perkWrapper}>
        { !!logoImage && <div className={css.logo}>{ logoImage }</div> }
        <div className={cn(css.infoWrapper, { [css.noLogo]: !logoImage })}>
          { !!promise && <span className={css.promise}>{ promise }</span> }
          { !!description && <span className={css.description}>{ description }</span> }
        </div>
      </div>
    </div>
  );
};

const getLogoFromText = logo => {
  switch (logo) {
    case 'vip':
      return <VipOnlyLogo />;
    case 'prime':
      return <PrimeLogo fillColor="#000000"/>;
    case 'holiday':
      return <img src={ZapposHolidayLogo} alt="Zappos Holiday Logo" width="50" />;
    case 'zappos':
      return <img src={ZapposLogo} alt="Zappos Logo" width="50" />;
    default:
      return;
  }
};

export default PurchaseDelivery;
