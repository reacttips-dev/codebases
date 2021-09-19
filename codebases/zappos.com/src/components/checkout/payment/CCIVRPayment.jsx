import cn from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { MartyContext } from 'utils/context';
import { ZPOT_PROD_URI } from 'constants/zpotHosts';
import { configurePurchase } from 'store/ducks/checkout/actions';
import MelodyModal from 'components/common/MelodyModal';
import { onEvent, supportsPassiveEventListener } from 'helpers/EventHelpers';

import css from 'styles/components/checkout/payment/ccivrPayment.scss';

export class CCIVRPayment extends Component {
  componentDidMount = () => {
    const opts = supportsPassiveEventListener() ? { passive: true } : false;
    onEvent(window, 'message', this.receiveMessage, opts, this);
  };

  handleAfterOpenFunc = () => {
    this.ccivrFrameFormRef.submit();
  };

  receiveMessage = event => {
    const { onCloseModalOverlayClick, configurePurchase } = this.props;
    const { origin, data } = event;
    const { marketplace: { checkout: { ivrOriginWhitelist } } } = this.context;
    const isValidData = data === 'resetCheckout' || data?.type === 'resetCheckout';

    if (!ivrOriginWhitelist.includes(origin) || !isValidData) {
      return;
    }

    if (onCloseModalOverlayClick) {
      onCloseModalOverlayClick();
    }

    if (data === 'resetCheckout') {
      configurePurchase({ advanceOnSuccess: true, includePaymentsAndAddresses: true });
    } else {
      const paymentMethods = [
        {
          paymentInstrumentId: data.paymentInstrumentId,
          paymentMethodCode: 'CC'
        }
      ];
      configurePurchase({ advanceOnSuccess: true, includePaymentsAndAddresses: true, paymentMethods });
    }
  };

  render() {
    return (
      <MartyContext.Consumer>
        { context => {
          this.context = context;
          const { testId } = context;
          const {
            checkoutData: { purchase: { shippingAddressId } },
            environmentConfig,
            onCloseModalOverlayClick,
            title = 'Add a debit or credit card',
            endpoint = 'addNewCardForm'
          } = this.props;
          const host = environmentConfig.checkout?.zpotHost || ZPOT_PROD_URI;
          const action = `${host}/payment/${endpoint}`;

          return (
            <MelodyModal
              buttonTestId="closeModal"
              className={cn(css.modalContent, { [css.fade]: true })}
              heading={title}
              isOpen={true}
              onAfterOpen={this.handleAfterOpenFunc}
              onRequestClose={onCloseModalOverlayClick}
            >

              <div className={css.modal} data-test-id={testId('paymentModal')}>
                <div className={css.formWrapper}>
                  <form
                    ref={el => this.ccivrFrameFormRef = el}
                    target="ccivrFrame"
                    action={action}
                    method="post"
                    id="ccivrForm">
                    <input type="hidden" name="addressId" value={shippingAddressId} />
                  </form>
                  <iframe
                    className={css.iframe}
                    frameBorder="0"
                    name="ccivrFrame"
                    title="ccivr payment" />
                </div>

                <div className={css.footer}>
                  <button
                    type="button"
                    onClick={onCloseModalOverlayClick}
                    className={css.cancelBtn}
                    data-test-id={testId('cancelBtn')}>
                    Cancel
                  </button>
                </div>
              </div>
            </MelodyModal>
          );
        }}
      </MartyContext.Consumer>
    );
  }
}

export const mapStateToProps = ({ environmentConfig, checkoutData }) => ({ environmentConfig, checkoutData });

export default connect(mapStateToProps, { configurePurchase })(CCIVRPayment);
