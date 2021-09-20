/* eslint-disable import/no-default-export, @trello/disallow-filenames */
import { DeletedModel, isDeletedModel } from 'app/gamma/src/modules/sockets';

type ApplyUpdate<T, U> = (update: U, existing?: T) => T;

function updateModelListSingle<
  T extends { id: string },
  U extends { id: string }
>(list: T[], update: U | DeletedModel, applyUpdate: ApplyUpdate<T, U>): T[] {
  if (isDeletedModel(update)) {
    return list.filter((entry) => entry.id !== update.id);
  } else if (list.some((entry) => entry.id === update.id)) {
    return list.map((entry) =>
      entry.id === update.id ? applyUpdate(update, entry) : entry,
    );
  } else {
    return [...list, applyUpdate(update)];
  }
}

function updateModelListMany<
  T extends { id: string },
  U extends { id: string }
>(list: T[], updates: U[], applyUpdate: ApplyUpdate<T, U>): T[] {
  if (updates.length === 0) {
    return list;
  }

  const updatesById: Map<string, U[]> = new Map();

  updates.forEach((update) => {
    const existingUpdates = updatesById.get(update.id);
    if (existingUpdates) {
      existingUpdates.push(update);
    } else {
      updatesById.set(update.id, [update]);
    }
  });

  const existingIds = new Set(list.map((entry) => entry.id));

  return [
    // Update existing items
    ...list.map((entry) => {
      const updatesForEntry = updatesById.get(entry.id);

      if (updatesForEntry) {
        return updatesForEntry.reduce(
          (previousEntry, updateForEntry) =>
            applyUpdate(updateForEntry, previousEntry),
          entry,
        );
      } else {
        return entry;
      }
    }),
    // New items from updates
    ...updates
      .filter((update) => !existingIds.has(update.id))
      .map((update) => applyUpdate(update)),
  ];
}

export default function updateModelList<
  T extends { id: string },
  U extends { id: string }
>(
  list: T[],
  updateOrUpdates: U | DeletedModel | U[],
  applyUpdate: ApplyUpdate<T, U>,
): T[] {
  return Array.isArray(updateOrUpdates)
    ? updateModelListMany(list, updateOrUpdates, applyUpdate)
    : updateModelListSingle(list, updateOrUpdates, applyUpdate);
}
