import { ButlerRuleDataModel } from 'app/gamma/src/types/models';
import { ButlerRuleDataResponse } from 'app/gamma/src/types/responses';
import genericNormalizer from './generic';

// eslint-disable-next-line @trello/no-module-logic
export const normalizeButlerRule = genericNormalizer<
  ButlerRuleDataResponse,
  ButlerRuleDataModel
>(({ from }) => ({
  url: from('url'),
  text: from('text'),
  id: from('id'),
}));
