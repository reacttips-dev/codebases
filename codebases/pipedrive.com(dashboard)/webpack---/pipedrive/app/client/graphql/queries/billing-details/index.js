export { billingDetailsFragment, getBillingDetails } from './query.gql';

export const toOldBillingDetails = ({ plan }) => {
	return {
		plan_info: plan
	};
};
