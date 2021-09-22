import React from 'react';
import classNames from 'classnames';
import { PatchedFormattedNumberProps, FormattedNumber, FormattedHTMLMessage } from 'js/lib/coursera.react-intl';
import cartUtils from 'bundles/payments/lib/cartUtils';
import _t from 'i18n!nls/payments-common';

type Props = PatchedFormattedNumberProps & {
  hideCurrencyCode?: boolean;
  withAsterisk?: boolean;
  extraClassName?: string;
};

/**
 * ReactPriceDisplay
 *
 * Created so we can use React.Intl FormattedNumber to inject into backbone views / jade templates.
 */
class ReactPriceDisplay extends React.Component<Props> {
  /**
   * Please refer to documentation on FormattedNumber for a complete list of available
   * http://formatjs.io/react/#formatted-number, which wraps:
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
   */
  static defaultProps = {
    style: 'currency',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  };

  render() {
    const { currency, hideCurrencyCode, value, withAsterisk, extraClassName } = this.props;
    const digitConfigProps = cartUtils.amountToDigitsProps(value);

    return (
      <span className={classNames('rc-ReactPriceDisplay', extraClassName)}>
        <FormattedNumber {...this.props} {...digitConfigProps} />
        {withAsterisk && <span className="asterisk">{_t('*')}</span>}
        {currency === 'USD' && !hideCurrencyCode && (
          <FormattedHTMLMessage message={' {currencyCode}'} currencyCode={currency} />
        )}
      </span>
    );
  }
}

export default ReactPriceDisplay;
