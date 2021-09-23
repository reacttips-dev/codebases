import { injectStripe } from 'react-stripe-elements';
import PaymentForm from './PaymentForm';

// note - injectStripe component must be a child of a component using <Elements />
export default injectStripe(PaymentForm);
