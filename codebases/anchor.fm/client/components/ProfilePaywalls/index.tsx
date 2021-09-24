import styled from '@emotion/styled';
import React, { createContext, useEffect, useState } from 'react';
import AnchorAPI from 'modules/AnchorAPI';
import { Metadata } from 'types/Metadata';
import { CreatePodcastSubscriptionResponse } from 'modules/AnchorAPI/v3/podcastSubscriptions/types';
import { useListenerCountryCode } from 'hooks/useListenerCountryCode';
import { useLocalPaywallPrices } from 'hooks/useLocalPaywallPrices';
import { useOptimizelyFeature } from 'hooks/useOptimizelyFeature';
import { MOBILE_BREAKPOINT } from '../PaywallsShared/constants';
import { ProfilePaywallsConfirmation } from './components/ProfilePaywallsConfirmation';
import { ProfilePaywallsEmailConsent } from './components/ProfilePaywallsEmailConsent';
import { ProfilePaywallsError } from './components/ProfilePaywallsError';
import { ProfilePaywallsForm } from './components/ProfilePaywallsForm';
import { ProfilePaywallsPodcastInfo } from './components/ProfilePaywallsPodcastInfo';
import { ProfilePaywallsFormData, ProfilePaywallsCurrentScreen } from './types';
import { events } from './events';
import { UnableToLoadError } from '../UnableToLoadError';

const ProfilePaywallsContainer = styled.main`
  display: grid;
  grid-auto-flow: row;
  grid-gap: 16px;
`;

const PageTitle = styled.div`
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.2;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    font-size: 2.4rem;
  }
`;

export const TITLES = {
  [ProfilePaywallsCurrentScreen.PAYMENT_FORM]: 'Become a subscriber',
  [ProfilePaywallsCurrentScreen.EMAIL_CONSENT]: 'Opt in to receive emails?',
  [ProfilePaywallsCurrentScreen.CONFIRMATION_PAGE]: 'You’re subscribed!',
  [ProfilePaywallsCurrentScreen.COUNTRY_ERROR]:
    'We’re unable to complete your transaction',
  [ProfilePaywallsCurrentScreen.EMAIL_ZIPCODE_ERROR]:
    'We’re unable to complete your transaction',
};

const ZIP_CODE_COUNTRIES = ['US'];

const DEFAULT_COUNTRY = 'US';

export const UNABLE_TO_LOAD_ERROR =
  'Unable to load, please refresh the page and try again';

export const INTERNATIONAL_EXPANSION_COUNTRIES = [
  'AU',
  'BE',
  'BG',
  'CH',
  'CY',
  'CZ',
  'DK',
  'EE',
  'ES',
  'FI',
  'GB',
  'GR',
  'HK',
  'IE',
  'IT',
  'LT',
  'LU',
  'LV',
  'MT',
  'NL',
  'NO',
  'NZ',
  'PL',
  'PT',
  'RO',
  'SE',
  'SG',
  'SI',
  'SK',
];

// Stripe country codes (unfortunately there is no enum for this)
export const SUPPORTED_CREDIT_CARD_COUNTRIES = ['US'];

type PriceTierContextProps = {
  refetchPriceTier: (selectedCountry: string) => void;
};

export const PriceTierContext = createContext<PriceTierContextProps>({
  refetchPriceTier: () => {},
});

// Variable to check if the province/territory needs to exist
export const REQUIRED_PROVINCE_TERRITORY_COUNTRIES = ['CA'];

export interface ProfilePaywallsProps {
  webStationId: string;
  podcastMetadata: Metadata;
  onChangeCurrentScreen?: (currentScreen: ProfilePaywallsCurrentScreen) => void;
}

export const ProfilePaywalls = ({
  podcastMetadata,
  webStationId,
  onChangeCurrentScreen,
}: ProfilePaywallsProps) => {
  const [
    subscriptionInfo,
    setSubscriptionInfo,
  ] = useState<null | CreatePodcastSubscriptionResponse>(null);
  const [
    currentScreen,
    setCurrentScreen,
  ] = useState<ProfilePaywallsCurrentScreen>(
    ProfilePaywallsCurrentScreen.PAYMENT_FORM
  );
  const [stripeInfo, setStripeInfo] = useState<ProfilePaywallsFormData | null>(
    null
  );

  useEffect(() => {
    if (onChangeCurrentScreen) {
      onChangeCurrentScreen(currentScreen);
    }
    events.screenView(currentScreen);
  }, [currentScreen, onChangeCurrentScreen]);

  const currentTitle = TITLES[currentScreen];
  const isWalletDebugEnabled = false; // This can eventually check against an array of station IDs
  const isNativePaymentDisabled = false;
  const [enableInternationalCheckoutExperience] = useOptimizelyFeature(
    'enable_international_checkout'
  ); // This can be turn on in Optimizely to enable entire international checkout experience

  if (enableInternationalCheckoutExperience) {
    SUPPORTED_CREDIT_CARD_COUNTRIES.push(...INTERNATIONAL_EXPANSION_COUNTRIES);
  }

  const { data: countryCodeData } = useListenerCountryCode();
  const [userSelectedCountry, setUserSelectedCountry] = useState(false);
  const [listenerCountryCode, setListenerCountryCode] = useState(
    DEFAULT_COUNTRY
  );

  if (
    !userSelectedCountry &&
    countryCodeData &&
    listenerCountryCode !== countryCodeData.countryCode
  ) {
    setListenerCountryCode(countryCodeData.countryCode);
  }

  const tier = podcastMetadata.stationPaywall?.price.webPriceTierId;
  const { prices } = useLocalPaywallPrices(listenerCountryCode, tier);

  /**
   * The data here comes from the Profile page / Redux, so this error state is
   * rare, but we still do a sanity check for various fields required by the
   * payment form. In the future, if this happens frequently, we can consider
   * passing in the vanity URL and hooking a Retry button up to the /subscribe
   * permalink.
   */
  if (
    !webStationId ||
    !podcastMetadata ||
    !podcastMetadata.podcastName ||
    !podcastMetadata.stationPaywall ||
    !podcastMetadata.stationPaywall.isSubscriptionEnabled ||
    !podcastMetadata.stationPaywall.price
  ) {
    return <UnableToLoadError label={UNABLE_TO_LOAD_ERROR} />;
  }

  let { price } = podcastMetadata.stationPaywall;
  if (enableInternationalCheckoutExperience && prices) {
    [price] = prices;
  }

  const { webPriceId } = price;

  return (
    <PriceTierContext.Provider
      value={{
        refetchPriceTier: selectedCountry => {
          setUserSelectedCountry(true);
          setListenerCountryCode(selectedCountry);
        },
      }}
    >
      <ProfilePaywallsContainer>
        {currentTitle && <PageTitle>{currentTitle}</PageTitle>}

        <ProfilePaywallsPodcastInfo
          podcastMetadata={podcastMetadata}
          isCompact={
            currentScreen !== ProfilePaywallsCurrentScreen.PAYMENT_FORM
          }
        />

        {currentScreen === ProfilePaywallsCurrentScreen.PAYMENT_FORM && (
          <ProfilePaywallsForm
            price={price}
            isNativePaymentDisabled={isNativePaymentDisabled}
            onSubmitPaymentForm={async (data: ProfilePaywallsFormData) => {
              const {
                name,
                email,
                token: {
                  id: stripePaymentToken,
                  card: { country: countryCode, address_zip: addressZip },
                },
                country: billingCountry = DEFAULT_COUNTRY,
                province: billingProvince = '',
              } = data;

              if (
                !email ||
                (ZIP_CODE_COUNTRIES.includes(countryCode) && !addressZip) ||
                (enableInternationalCheckoutExperience && !billingCountry) ||
                (REQUIRED_PROVINCE_TERRITORY_COUNTRIES.includes(
                  billingCountry
                ) &&
                  !billingProvince)
              ) {
                setCurrentScreen(
                  ProfilePaywallsCurrentScreen.EMAIL_ZIPCODE_ERROR
                );
                return;
              }

              if (SUPPORTED_CREDIT_CARD_COUNTRIES.indexOf(countryCode) === -1) {
                setCurrentScreen(ProfilePaywallsCurrentScreen.COUNTRY_ERROR);
                return;
              }

              events.submit();
              const podcastSubscriptionInfo = await AnchorAPI.createPodcastSubscription(
                {
                  email,
                  name,
                  webPriceId,
                  countryCode,
                  webStationId,
                  stripePaymentToken,
                  addressZip,
                  billingCountry,
                  billingProvince,
                }
              );
              setSubscriptionInfo(podcastSubscriptionInfo);
              setCurrentScreen(ProfilePaywallsCurrentScreen.EMAIL_CONSENT);
              setStripeInfo(data);
            }}
            podcastMetadata={podcastMetadata}
            showUserSelectedBillingCountry={
              enableInternationalCheckoutExperience
            }
          />
        )}

        {currentScreen === ProfilePaywallsCurrentScreen.EMAIL_CONSENT &&
          subscriptionInfo && (
            <ProfilePaywallsEmailConsent
              webStationId={webStationId}
              subscriptionInfo={subscriptionInfo}
              onOptInClick={() => events.emailOptIn()}
              onOptOutClick={() => events.emailOptOut()}
              onComplete={() =>
                setCurrentScreen(ProfilePaywallsCurrentScreen.CONFIRMATION_PAGE)
              }
            />
          )}

        {currentScreen === ProfilePaywallsCurrentScreen.CONFIRMATION_PAGE &&
          subscriptionInfo && (
            <ProfilePaywallsConfirmation
              webStationId={webStationId}
              subscriptionInfo={subscriptionInfo}
              onCopyRSSClick={() => events.copyRSS()}
              onSpotifyClick={() => events.listenOnSpotify()}
            />
          )}

        {currentScreen === ProfilePaywallsCurrentScreen.COUNTRY_ERROR && (
          <ProfilePaywallsError
            showTermsLink
            text="Your location doesn’t match your payment details, so we couldn’t complete your transaction."
          />
        )}

        {currentScreen === ProfilePaywallsCurrentScreen.EMAIL_ZIPCODE_ERROR && (
          <ProfilePaywallsError
            text={`We couldn't verify your details. Please make sure you've added an email address${
              enableInternationalCheckoutExperience
                ? ', zip code, and billing country'
                : ' and zip code'
            } in your account billing information and try again.`}
          />
        )}

        {isWalletDebugEnabled && stripeInfo && (
          <pre>{JSON.stringify(stripeInfo, null, 2)}</pre>
        )}
      </ProfilePaywallsContainer>
    </PriceTierContext.Provider>
  );
};
