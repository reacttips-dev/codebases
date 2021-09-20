import { AppCreatorModel } from 'app/gamma/src/types/models';
import { AppCreatorResponse } from 'app/gamma/src/types/responses';
import genericNormalizer from './generic';
import { getAppCreatorModelForApplication } from 'app/common/lib/util/app-creator';

// eslint-disable-next-line @trello/no-module-logic
export const normalizeAppCreator = genericNormalizer<
  AppCreatorResponse,
  AppCreatorModel
>(({ from, has }) => ({
  name: from('name'),
  id: from('id'),
  idPlugin: has('id', (id) => getAppCreatorModelForApplication(id)?.idPlugin),
  iconClass: has('id', (id) => getAppCreatorModelForApplication(id)?.iconClass),
  urlSuffix: has('id', (id) => getAppCreatorModelForApplication(id)?.urlSuffix),
}));
