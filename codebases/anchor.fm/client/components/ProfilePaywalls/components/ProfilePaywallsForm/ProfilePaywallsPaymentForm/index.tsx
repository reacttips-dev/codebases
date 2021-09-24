import styled from '@emotion/styled';
import { css } from 'emotion';
import React from 'react';
import { Elements } from 'react-stripe-elements';
import PaymentForm from '../../../../PaymentForm';

export const SUBMIT_BUTTON_LABEL = 'Pay & subscribe';

const nativePayButtonClassName = css`
  margin-top: 24px;
`;

const creditCardLinkStyles = css`
  font-size: 1.6rem;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #5000b9;
  margin-top: 16px;
  cursor: pointer;

  &:hover {
    color: #6732b9;
  }
`;

export const ProfilePaywallsPaymentForm = ({
  podcastName,
  unitAmount,
  onSubmitPaymentForm,
  isNativePaymentDisabled,
  showUserSelectedBillingCountry,
}: {
  podcastName: string;
  unitAmount: number;
  onSubmitPaymentForm: (data: any) => void;
  isNativePaymentDisabled: boolean;
  showUserSelectedBillingCountry?: boolean;
}) => {
  return (
    <ProfilePaywallsPaymentFormContainer>
      <Elements>
        <PaymentForm
          // @ts-ignore This form is JS code wrapped in Stripe's TS and has no underlying prop defs
          selectedProduct={{
            amount: unitAmount,
          }}
          itemLabel={`Subscribe to ${podcastName}`}
          totalLabel={podcastName}
          onSubmitPaymentForm={onSubmitPaymentForm}
          submitButtonLabel={SUBMIT_BUTTON_LABEL}
          isNativePaymentDisabled={isNativePaymentDisabled}
          nativePayButtonClassName={nativePayButtonClassName}
          creditCardLinkClassName={creditCardLinkStyles}
          showUserSelectedBillingCountry={showUserSelectedBillingCountry}
        />
      </Elements>
    </ProfilePaywallsPaymentFormContainer>
  );
};

// Styling predominantly for the loading indicator
const ProfilePaywallsPaymentFormContainer = styled.div`
  min-height: 64px;
  position: relative;
`;
