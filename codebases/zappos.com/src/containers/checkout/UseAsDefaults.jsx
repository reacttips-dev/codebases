import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SectionDivider from 'components/checkout/SectionDivider';
import { onUseAsDefaultsLoad, onUseAsDefaultsToggle } from 'store/ducks/checkout/actions';

import css from 'styles/containers/checkout/useAsDefaults.scss';

export class UseAsDefaults extends Component {
  componentDidMount = () => {
    const { onUseAsDefaultsLoad } = this.props;
    if (this.shouldShowSelection()) {
      onUseAsDefaultsLoad(true);
    }
  };

  onToggleUseAsDefaults = () => {
    const { checkoutData: { useAsDefaults }, onUseAsDefaultsToggle } = this.props;
    onUseAsDefaultsToggle(!useAsDefaults);
  };

  shouldShowSelection = () => {
    const { checkoutData: { purchaseCreditCard, purchase: { shippingAddress } } } = this.props;
    const isPrimaryAddress = !!shippingAddress?.defaultShippingAddress;
    const isPrimaryPayment = !!purchaseCreditCard?.primary;
    return purchaseCreditCard && !(isPrimaryAddress && isPrimaryPayment);
  };

  render() {
    const { checkoutData } = this.props;
    const { isLoading, useAsDefaults } = checkoutData;
    const { testId = f => f } = this.context;

    return (
      this.shouldShowSelection() && <>
      <dl className={css.section}>
        <dt>Always use these settings?</dt>
        <dd>
          <div className={css.fieldWrapper}>
            <div className={css.formField}>
              <input
                disabled={isLoading}
                type="checkbox"
                name="useAsDefault"
                data-test-id={testId('useAsDefault')}
                id="useAsDefault"
                checked={useAsDefaults}
                onChange={this.onToggleUseAsDefaults} />
              <label htmlFor="useAsDefault">Check this box to default to these delivery and payment options in the future.</label>
            </div>
          </div>
        </dd>
      </dl>
      <SectionDivider />
      </>
    );
  }
}

const mapStateToProps = ({ checkoutData }) => ({ checkoutData });

UseAsDefaults.contextTypes = {
  testId: PropTypes.func
};

export default connect(mapStateToProps, {
  onUseAsDefaultsLoad,
  onUseAsDefaultsToggle
})(UseAsDefaults);
