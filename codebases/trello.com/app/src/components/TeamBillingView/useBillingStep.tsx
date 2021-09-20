import { useSharedState, SharedState } from '@trello/shared-state';

export interface BillingSteps {
  step?: 'details' | 'billing';
}

const billingStepState = new SharedState<BillingSteps>({
  step: 'details',
});

/**
 * Sets step for between plan comparison view and billing summary view on the billing tab
 * Uses Shared State for "end of free trial" banner to access specific view from the Board View
 * Because Board View and Billing View are on different React trees, a persistent state is needed
 */
export const useBillingStep = () => {
  const [{ step: billingStep }, setStep] = useSharedState(billingStepState);
  const resetBillingStep = () => setStep({ step: 'details' });

  return { billingStep, setStep, resetBillingStep };
};
