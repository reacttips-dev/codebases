import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Metadata, PaywallPrice } from '../../../../types/Metadata';
import { ProfilePaywallsPaymentForm } from './ProfilePaywallsPaymentForm';
import { ProfilePaywallsPrice } from './ProfilePaywallsPrice';
import { ProfilePaywallsFormData } from '../../types';
import { ProfilePaywallsTerms } from './ProfilePaywallsTerms';
import { UnableToLoadError } from '../../../UnableToLoadError';
import { AnchorAPIError } from '../../../../modules/AnchorAPI';

const UNABLE_TO_LOAD_ERROR =
  'Unable to load podcast details, please refresh the page and try again';

export const ProfilePaywallsForm = ({
  price,
  podcastMetadata,
  onSubmitPaymentForm,
  isNativePaymentDisabled,
  showUserSelectedBillingCountry,
}: {
  price: PaywallPrice;
  podcastMetadata: Metadata;
  onSubmitPaymentForm: (data: ProfilePaywallsFormData) => void;
  isNativePaymentDisabled: boolean;
  showUserSelectedBillingCountry?: boolean;
}) => {
  const { podcastName } = podcastMetadata;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Rare and will in practice be caught by the parent view, but since these are
  // nullables values in the type, we account for them here as well.
  if (!podcastName || !price) {
    return <UnableToLoadError label={UNABLE_TO_LOAD_ERROR} />;
  }

  return (
    <>
      <ProfilePaywallsPrice price={price.name} />
      <ProfilePaywallsPaymentForm
        podcastName={podcastName}
        unitAmount={price.unitAmount}
        isNativePaymentDisabled={isNativePaymentDisabled}
        onSubmitPaymentForm={async (data: ProfilePaywallsFormData) => {
          try {
            await onSubmitPaymentForm(data);
          } catch (err) {
            /**
             * A card error, so bubble this up to the form.
             */
            if (err instanceof AnchorAPIError) {
              throw err;
            }
          }
        }}
        showUserSelectedBillingCountry={showUserSelectedBillingCountry}
      />
      <ProfilePaywallsTerms />
    </>
  );
};
