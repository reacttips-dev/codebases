import AnchorAPIError from '../../AnchorAPIError';
import { CreatePodcastSubscriptionResponse } from './types';

type CreatePodcastSubscriptionParameters = {
  webStationId: string;
  email: string;
  name: string;
  countryCode: string;
  addressZip: string;
  webPriceId: string;
  stripePaymentToken: string;
  billingCountry?: string;
  billingProvince?: string;
};

const ERROR_MESSAGE_STRING = 'Could not create subscription.';

export async function createPodcastSubscription({
  webStationId,
  email,
  name,
  countryCode,
  stripePaymentToken,
  addressZip,
  billingCountry,
  billingProvince,
  webPriceId,
}: CreatePodcastSubscriptionParameters): Promise<CreatePodcastSubscriptionResponse> {
  const body = {
    email,
    name,
    token: {
      id: stripePaymentToken,
      card: {
        country: countryCode,
        address_zip: addressZip,
      },
    },
    billingCountry,
    billingProvince,
    webPriceId,
  };
  const response = await fetch(
    `/api/proxy/v3/podcastSubscriptions/webStationId:${webStationId}/subscribe`,
    {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(body),
    }
  );
  if (response.ok) {
    return response.json();
  }
  let json;
  try {
    json = await response.json();
  } catch (err) {
    // Could not parse the response as JSON, so throw a generic error
    throw new Error(ERROR_MESSAGE_STRING);
  }
  // A code from the backend signifying card error type, which we propagate to the form
  if (json && json.code) {
    throw new AnchorAPIError(json.code, ERROR_MESSAGE_STRING);
  } else {
    // Response was JSON, but did not contain a code, so throw a generic error
    throw new Error(ERROR_MESSAGE_STRING);
  }
}
