import {
  CheckItemResponse,
  ChecklistResponse,
} from 'app/gamma/src/types/responses';
import { ChecklistItemModel, ChecklistModel } from 'app/gamma/src/types/models';
import genericNormalizer from './generic';

// eslint-disable-next-line @trello/no-module-logic
export const normalizeChecklistItem = genericNormalizer<
  CheckItemResponse,
  ChecklistItemModel
>(({ from, has }) => ({
  checked: has('state', (state) => state === 'complete'),
  id: from('id'),
  name: from('name'),
  nameData: from('nameData'),
  pos: from('pos'),
}));

// eslint-disable-next-line @trello/no-module-logic
export const normalizeChecklist = genericNormalizer<
  ChecklistResponse,
  ChecklistModel
>(({ from, has }) => ({
  id: from('id'),
  idBoard: from('idBoard'),
  idCard: from('idCard'),
  checkItems: has('checkItems', (checkItems) =>
    // We always get back the full checkItem, so we don't need to merge it
    checkItems.map((checkItem) => normalizeChecklistItem(checkItem)),
  ),
  name: from('name'),
  pos: from('pos'),
}));
