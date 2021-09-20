import { CampaignModel } from 'app/gamma/src/types/models';
import { CampaignResponse } from 'app/gamma/src/types/responses';
import genericNormalizer, { normalizeDate } from './generic';

// eslint-disable-next-line @trello/no-module-logic
export const normalizeCampaign = genericNormalizer<
  CampaignResponse,
  CampaignModel
>(({ from, has }) => ({
  id: from('id'),
  name: from('name'),
  currentStep: from('currentStep'),
  dateDismissed: has('dateDismissed', normalizeDate),
}));
