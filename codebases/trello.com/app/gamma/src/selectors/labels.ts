import { State } from 'app/gamma/src/modules/types';
import { LabelModel } from 'app/gamma/src/types/models';

export const getLabelById = (
  state: State,
  id: string,
): LabelModel | undefined => {
  return state.models.labels[id];
};

export const getLabelsByIds = (state: State, ids: string[]): LabelModel[] => {
  return ids.reduce((result, id) => {
    const label = getLabelById(state, id);
    if (label) {
      result.push(label);
    }

    return result;
  }, [] as LabelModel[]);
};
