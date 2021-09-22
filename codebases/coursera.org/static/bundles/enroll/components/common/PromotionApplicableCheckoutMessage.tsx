import React from 'react';
import classnames from 'classnames';

import withPromotionInfo, {
  PropsFromWithPromotionInfo,
  PropsToWithPromotionInfo,
} from 'bundles/promotions/components/withPromotionInfo';

import _t from 'i18n!nls/enroll';

import 'css!./__styles__/PromotionApplicableCheckoutMessage';

type PropsFromCaller = PropsToWithPromotionInfo & {
  extraClassName?: string;
};

type PropsToComponent = PropsFromCaller &
  Pick<PropsFromWithPromotionInfo, 'promotionEligibilities' | 'promotionDetails'>;

export const PromotionApplicableCheckoutMessage: React.FunctionComponent<PropsToComponent> = ({
  promotionEligibilities,
  promotionDetails,
  extraClassName,
}) => {
  if (!promotionEligibilities?.isEligible || promotionDetails?.discountPercent === 0) {
    return null;
  }

  return (
    <div className={classnames('rc-PromotionApplicableCheckoutMessage', extraClassName)}>
      {_t('Your promotion will be applied at checkout')}
    </div>
  );
};

export default withPromotionInfo<PropsToComponent>()(PromotionApplicableCheckoutMessage);
