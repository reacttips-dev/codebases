import { requireFields } from 'bundles/naptimejs/util/requireFieldsDecorator';
import PaymentProcessorTypes from 'bundles/payments/common/PaymentProcessorTypes';
import NaptimeResource from './NaptimeResource';

class ValidPaymentProcessors extends NaptimeResource {
  static RESOURCE_NAME = 'validPaymentProcessors.v1';

  // These properties are always included.
  id!: string;

  processors!: Array<keyof typeof PaymentProcessorTypes>;

  @requireFields('processors')
  get isBraintreeEnabled(): boolean {
    return (
      this.processors.includes(PaymentProcessorTypes.braintree) ||
      this.processors.includes(PaymentProcessorTypes.braintreeSandbox)
    );
  }

  @requireFields('processors')
  get isRazorpayEnabled(): boolean {
    return (
      this.processors.includes(PaymentProcessorTypes.razorpay) ||
      this.processors.includes(PaymentProcessorTypes.razorpaySandbox)
    );
  }

  @requireFields('processors')
  get isStripeEnabled(): boolean {
    // @ts-expect-error Property 'stripe' does not exist on type '{ appleInapp: "appleInapp"; appleInappSandbox: "ap...
    return this.processors.includes(PaymentProcessorTypes.stripe);
  }

  @requireFields('processors')
  get isPaypalEnabled(): boolean {
    return this.processors.includes(PaymentProcessorTypes.paypal);
  }

  @requireFields('processors')
  get isZeroDollar(): boolean {
    return this.processors.includes(PaymentProcessorTypes.zeroDollar);
  }
}

export default ValidPaymentProcessors;
