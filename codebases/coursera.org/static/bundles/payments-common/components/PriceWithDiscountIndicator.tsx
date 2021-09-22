import React from 'react';
import classNames from 'classnames';
import ReactPriceDisplay from 'bundles/payments-common/components/ReactPriceDisplay';
import _t from 'i18n!nls/payments-common';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import 'css!./__styles__/PriceWithDiscountIndicator';

type Props = {
  amount: number;
  finalAmount: number;
  currencyCode: string;
  discountColorType?: string;
  withAsterisk: boolean;
  hideCurrencyCode: boolean;
  showDiscountPrice: boolean;
  showDiscountPercent: boolean;
};

class PriceWithDiscountIndicator extends React.Component<Props> {
  static defaultProps = {
    discountColorType: 'red',
    withAsterisk: false,
    hideCurrencyCode: false,
    showDiscountPrice: true,
    showDiscountPercent: true,
  };

  render() {
    const {
      amount,
      finalAmount,
      currencyCode,
      discountColorType,
      withAsterisk,
      hideCurrencyCode,
      showDiscountPrice,
      showDiscountPercent,
    } = this.props;

    if (!(amount && currencyCode)) {
      return false;
    }

    const hasDiscount = amount > finalAmount;
    const className = 'rc-PriceWithDiscountIndicator';

    if (hasDiscount) {
      const discountPercent = Math.round((100 * (amount - finalAmount)) / amount);
      return (
        <span className={classNames(className, `discount-color-${discountColorType}`)}>
          <s className="price-original" aria-hidden="true">
            <ReactPriceDisplay currency={currencyCode} value={amount} />
          </s>
          {showDiscountPrice && (
            <span className="price-with-discount" aria-hidden="true">
              <ReactPriceDisplay currency={currencyCode} value={finalAmount} withAsterisk={withAsterisk} />
            </span>
          )}
          {showDiscountPercent && (
            <span className="discount-indicator" aria-hidden="true">
              {_t(`${discountPercent}% off`)}
            </span>
          )}
          <span className="sr-only" id="choice-title-label">
            <FormattedMessage
              message={_t(
                'Original price: {originalPrice}, Sale price: {salePrice} with {discountPercent} percent off'
              )}
              originalPrice={<ReactPriceDisplay value={amount} currency={currencyCode} />}
              salePrice={<ReactPriceDisplay value={finalAmount} currency={currencyCode} />}
              discountPercent={discountPercent}
            />
          </span>
        </span>
      );
    } else {
      return (
        <span className={className}>
          <ReactPriceDisplay
            currency={currencyCode}
            value={amount}
            withAsterisk={withAsterisk}
            hideCurrencyCode={hideCurrencyCode}
          />
        </span>
      );
    }
  }
}

export default PriceWithDiscountIndicator;
