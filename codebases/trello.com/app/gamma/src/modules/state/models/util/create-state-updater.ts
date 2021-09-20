/* eslint-disable @trello/disallow-filenames */
import { DeletedModel, isDeletedModel } from 'app/gamma/src/modules/sockets';

interface HasId {
  id: string;
}

type ModelUpdates<U> =
  | U
  | DeletedModel
  | (U | DeletedModel)[]
  | null
  | undefined;

interface ById<T extends HasId> {
  [id: string]: T;
}
type ModelsState<T extends HasId> = T[] | ById<T>;
type ApplyUpdate<T, U> = (update: U, existing?: T) => T;

function updateModelList<T extends HasId, U extends HasId>(
  list: T[],
  newModels: T[],
  deleted: Set<string>,
  updatedById: Map<string, U>,
  applyUpdate: ApplyUpdate<T, U>,
): T[] {
  return [
    ...list.map((entry) => {
      const update = updatedById.get(entry.id);
      if (update) {
        return applyUpdate(update, entry);
      } else {
        return entry;
      }
    }),
    ...newModels,
  ].filter((entry) => !deleted.has(entry.id));
}

function updateModelsById<T extends HasId, U extends HasId>(
  map: ById<T>,
  newModels: T[],
  deleted: Set<string>,
  updatedById: Map<string, U>,
  applyUpdate: ApplyUpdate<T, U>,
): ById<T> {
  const newState: ById<T> = {};

  Object.keys(map).forEach((id) => {
    if (!deleted.has(id)) {
      const update = updatedById.get(id);
      if (update) {
        newState[id] = applyUpdate(update, map[id]);
      } else {
        newState[id] = map[id];
      }
    }
  });

  newModels.forEach((model) => {
    newState[model.id] = model;
  });

  return newState;
}

export function createStateUpdater<T extends HasId, U extends HasId>(
  applyUpdate: ApplyUpdate<T, U>,
) {
  function updater(state: T[], updates: ModelUpdates<U>): T[];
  function updater(state: ById<T>, updates: ModelUpdates<U>): ById<T>;
  function updater(
    state: ModelsState<T>,
    updates: ModelUpdates<U>,
  ): ModelsState<T> {
    if (!updates) {
      return state;
    }

    const deleted: Set<string> = new Set();
    const updatedById: Map<string, U> = new Map();
    const exists: Set<string> = new Set();

    if (Array.isArray(state)) {
      state.forEach((entry) => {
        exists.add(entry.id);
      });
    } else {
      Object.keys(state).forEach((id) => {
        exists.add(id);
      });
    }

    const newModels: T[] = [];

    function processUpdate(update: U | DeletedModel) {
      if (isDeletedModel(update)) {
        deleted.add(update.id);
      } else if (exists.has(update.id)) {
        updatedById.set(update.id, update);
      } else {
        newModels.push(applyUpdate(update));
      }
    }

    if (Array.isArray(updates)) {
      updates.forEach(processUpdate);
    } else {
      processUpdate(updates);
    }

    if (Array.isArray(state)) {
      return updateModelList<T, U>(
        state,
        newModels,
        deleted,
        updatedById,
        applyUpdate,
      );
    } else {
      return updateModelsById<T, U>(
        state,
        newModels,
        deleted,
        updatedById,
        applyUpdate,
      );
    }
  }

  return updater;
}
