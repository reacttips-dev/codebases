import { State } from 'app/gamma/src/modules/types';
import { ListModel } from 'app/gamma/src/types/models';

export const getListById = (
  state: State,
  idList: string,
): ListModel | undefined =>
  state.models.lists.find((list: ListModel) => list.id === idList);
