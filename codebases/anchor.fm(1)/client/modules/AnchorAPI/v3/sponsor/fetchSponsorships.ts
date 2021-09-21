import { Audio } from '../episodes';

export type AdCampaign = {
  adAdvertiserId: number;
  adCampaignId: number;
  isHouseAd: boolean | null;
  isMidrollRequired: boolean | null;
  campaignStatus:
    | 'active'
    | 'paused'
    | 'awaitingRecording'
    | 'completed'
    | 'unknown';
  campaignName?: string;
  script?: string | null;
  details?: string;
  campaignUrl?: string | null;
  pricePerThousandInCents?: number;
  currentAmountEarnedInCents?: number;
  isNotInterested: boolean;
  audioId: number | null;
  exampleAudioId: number | null;
  isPaymentProcessorRequired: boolean;
  potentialEarningDetail: {
    earningsPerPlay: { playCount: number; totalEarningsInCents: number }[];
  };
};

export type ActivationLifeCycleState =
  | 'ineligibleForSponsorshipsFeature'
  | 'awaitingListenerThreshold'
  | 'eligibleToActivate'
  | 'activationPostponed'
  | 'activated'
  | 'rejected';

export type CampaignsObject = {
  adCampaigns: AdCampaign[];
  audios: Audio[];
};

export type FetchSponsorshipsResponse = {
  activationLifeCycleState: ActivationLifeCycleState;
  activationListenerThreshold: {
    requiredUniqueListeners: number;
    pastYearUniqueListeners: number;
  };
  campaigns: CampaignsObject | null;
};

export async function fetchSponsorships(
  webStationId: string
): Promise<FetchSponsorshipsResponse> {
  try {
    const response = await fetch(
      `/api/proxy/v3/sponsor/webStationId:${webStationId}`,
      {
        method: 'GET',
        credentials: 'same-origin',
      }
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error(`Unable to fetch sponsorships: ${webStationId}`);
  } catch (err) {
    throw new Error(err.message);
  }
}
