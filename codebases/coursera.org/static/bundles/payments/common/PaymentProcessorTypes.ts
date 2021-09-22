import keysToConstants from 'js/lib/keysToConstants';

// REF https://github.com/webedx-spark/infra-services/blob/main/libs/models/src/main/scala/org/coursera/payment/package.scala#L119-L131
const exported = keysToConstants([
  'appleInapp',
  'appleInappSandbox',
  'braintree',
  'braintreeSandbox',
  'ebanx',
  'ebanxSandbox',
  'razorpay',
  'razorpaySandbox',
  'coursera',
  'financialAid',
  'paypal',
  'zeroDollar',
  'mockPaymentProcessor',
]);

export const {
  appleInapp,
  appleInappSandbox,
  braintree,
  braintreeSandbox,
  ebanx,
  ebanxSandbox,
  razorpay,
  razorpaySandbox,
  coursera,
  financialAid,
  paypal,
  zeroDollar,
  mockPaymentProcessor,
} = exported;

export default exported;
