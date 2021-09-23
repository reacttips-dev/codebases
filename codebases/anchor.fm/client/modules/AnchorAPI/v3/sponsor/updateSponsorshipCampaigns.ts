type CampaignIdArray = number[];

export type UpdateSponsorshipCampaignsParams = {
  webStationId: string;
  userId: number;
  interestedAdCampaignIds?: CampaignIdArray;
  notInterestedAdCampaignIds?: CampaignIdArray;
};

export async function updateSponsorshipCampaigns({
  webStationId,
  userId,
  interestedAdCampaignIds,
  notInterestedAdCampaignIds,
}: UpdateSponsorshipCampaignsParams): Promise<Response> {
  try {
    const response = await fetch(`/api/proxy/v3/sponsor/interested`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        webStationId,
        userId,
        interestedAdCampaignIds: interestedAdCampaignIds || [],
        notInterestedAdCampaignIds: notInterestedAdCampaignIds || [],
      }),
    });
    if (response.ok) {
      return response;
    }
    throw new Error(`Unable to update sponsorship campaigns`);
  } catch (err) {
    throw new Error(err.message);
  }
}
