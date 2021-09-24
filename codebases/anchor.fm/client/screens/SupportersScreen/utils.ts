import { Audio } from 'client/modules/AnchorAPI/v3/episodes';
import {
  AdCampaign,
  CampaignsObject,
} from '../../modules/AnchorAPI/v3/sponsor/fetchSponsorships';

export type CampaignItem = AdCampaign & {
  audio?: Audio;
  exampleAudio?: Audio;
};

export function getCampaignsArray(campaigns: CampaignsObject): CampaignItem[] {
  const { adCampaigns, audios } = campaigns;
  const campaignsArray = adCampaigns.map(adCampaign => {
    const {
      audioId: campaignAudioId,
      exampleAudioId: campaignExampleAudioId,
    } = adCampaign;
    return {
      ...adCampaign,
      audio: audios.find(audioJSON => {
        const { audioId } = audioJSON;
        return audioId === campaignAudioId;
      }),
      exampleAudio: audios.find(audioJSON => {
        const { audioId } = audioJSON;
        return audioId === campaignExampleAudioId;
      }),
    };
  });
  return campaignsArray;
}
