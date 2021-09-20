import { State } from 'app/gamma/src/modules/types';
import { ActionModel } from 'app/gamma/src/types/models';

export const getActionById = (
  state: State,
  idAction: string,
): ActionModel | undefined =>
  state.models.actions.find((action: ActionModel) => action.id === idAction);
