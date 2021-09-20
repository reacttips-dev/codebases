import { LabelModel } from 'app/gamma/src/types/models';
import { LabelResponse } from 'app/gamma/src/types/responses';
import genericNormalizer from './generic';

// eslint-disable-next-line @trello/no-module-logic
export const normalizeLabel = genericNormalizer<LabelResponse, LabelModel>(
  ({ from }) => ({
    color: from('color'),
    id: from('id'),
    idBoard: from('idBoard'),
    name: from('name'),
  }),
);
