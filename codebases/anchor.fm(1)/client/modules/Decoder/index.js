const getStatusFromCampaign = ({ campaignStatus, isNotInterested } = {}) => {
  if (isNotInterested) {
    return 'ignored';
  }
  switch (campaignStatus) {
    case 'awaitingRecording':
      return 'waitingToRecord';
    default:
      return campaignStatus;
  }
};

const decodeAdCampaignJSONIntoCampaign = (campaignResponseJSON, audiosJSON) => {
  const {
    audioId: campaignAudioId,
    exampleAudioId: campaignExampleAudioId,
  } = campaignResponseJSON;
  const campaign = {
    ...campaignResponseJSON,
    audio: audiosJSON.find(audioJSON => {
      const { audioId } = audioJSON;
      return audioId === campaignAudioId;
    }),
    exampleAudio: audiosJSON.find(audioJSON => {
      const { audioId } = audioJSON;
      return audioId === campaignExampleAudioId;
    }),
  };
  return campaign;
};

const decodeCampaignIntoAdRecordingModalCampaign = (
  campaign,
  isAnchorPaymentsActivated
) => ({
  // Decode campaign from the server into the datastructure the recording modal expects
  id: campaign.adCampaignId,
  // TODO: Need a better way to get url from an audio object
  audioUrl:
    campaign.audio &&
    campaign.audio.urls &&
    campaign.audio.urls[campaign.audio.urls.length - 1] &&
    campaign.audio.urls[campaign.audio.urls.length - 1].url,
  sponsorName: campaign.campaignName,
  cpmInCents: campaign.pricePerThousandInCents || 0,
  status: getStatusFromCampaign(campaign),
  script: campaign.script,
  details: campaign.details,
  // TODO: Need a better way to get url from an audio object
  exampleAudioUrl:
    campaign.exampleAudio &&
    campaign.exampleAudio.urls &&
    campaign.exampleAudio.urls[campaign.exampleAudio.urls.length - 1] &&
    campaign.exampleAudio.urls[campaign.exampleAudio.urls.length - 1].url,
  companyUrl: campaign.campaignUrl,
  isHouseAd: campaign.isHouseAd,
  isMidrollRequired: campaign.isMidrollRequired,
  isAnchorPaymentsActivated,
  totalAmountEarnedInCents: campaign.currentAmountEarnedInCents,
});

const Decoder = {
  SponsorshipsDecoder: {
    decodeAdCampaignJSONIntoCampaign,
    decodeCampaignIntoAdRecordingModalCampaign,
  },
};

export default Decoder;
