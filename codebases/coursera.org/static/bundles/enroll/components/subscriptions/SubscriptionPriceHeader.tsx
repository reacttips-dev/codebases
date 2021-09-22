import Naptime from 'bundles/naptimejs';

import React from 'react';
import ReactPriceDisplay from 'bundles/payments-common/components/ReactPriceDisplay';
import S12nDerivativesV1 from 'bundles/naptimejs/resources/s12nDerivatives.v1';
import _t from 'i18n!nls/enroll';
import cartUtils from 'bundles/payments/lib/cartUtils';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import 'css!./__styles__/SubscriptionPriceHeader';

type Props = {
  s12nId: string;
  s12nDerivatives?: S12nDerivativesV1;
};

class SubscriptionPriceHeader extends React.Component<Props> {
  render() {
    const { s12nDerivatives } = this.props;

    if (!s12nDerivatives) {
      return null;
    }

    const { catalogPrice } = s12nDerivatives;

    if (!catalogPrice) {
      return null;
    }

    return (
      <div className="price-header headline-5-text">
        <FormattedMessage
          message={_t('{price} {perMonth}')}
          price={
            <ReactPriceDisplay
              currency={catalogPrice?.currencyCode}
              value={catalogPrice?.amount}
              hideCurrencyCode={true}
              {...cartUtils.amountToDigitsProps(catalogPrice?.amount)}
            />
          }
          perMonth={<span className="per-month">{_t('per month')}</span>}
        />
      </div>
    );
  }
}

export default Naptime.createContainer(SubscriptionPriceHeader, ({ s12nId }) => ({
  s12nDerivatives: S12nDerivativesV1.get(s12nId, {
    fields: ['catalogPrice'],
  }),
}));
