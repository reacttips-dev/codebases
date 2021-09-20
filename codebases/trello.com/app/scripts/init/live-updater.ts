import {
  rpc,
  RpcUpdatePayloadResponses,
  RpcModelType,
} from 'app/scripts/network/rpc';

export interface Deleted {
  id: string;
  deleted: true;
}

export type LiveUpdate = {
  [typeName in RpcModelType]: {
    typeName: typeName;
    delta: RpcUpdatePayloadResponses[typeName] | Deleted;
  };
}[RpcModelType];

export type Callback = (update: LiveUpdate) => void;
export type Publish = (update: LiveUpdate) => void;
export type Subscribe = (callback: Callback) => Publish;

const listeners: Callback[] = [];

export function subscribe(callback: Callback): Publish {
  listeners.push(callback);

  return (update: LiveUpdate) => {
    listeners.forEach((fx) => {
      if (fx !== callback) {
        fx(update);
      }
    });
  };
}

function sendUpdates(updates: LiveUpdate[]): void {
  listeners.forEach((fx) => {
    updates.forEach(fx);
  });
}

// eslint-disable-next-line @trello/no-module-logic
rpc.on('updateModels', ({ typeName, deltas }): void => {
  sendUpdates(
    deltas.map(
      (delta) =>
        ({
          typeName,
          delta,
        } as LiveUpdate),
    ),
  );
});

// eslint-disable-next-line @trello/no-module-logic
rpc.on('deleteModels', ({ typeName, deltas }): void => {
  sendUpdates(
    deltas.map(
      ({ id }) =>
        ({
          typeName,
          delta: {
            id,
            deleted: true,
          },
        } as LiveUpdate),
    ),
  );
});

// eslint-disable-next-line @trello/no-module-logic
rpc.on('invalidModel', (typeName: RpcModelType, id: string) => {
  // We want to treat invalid (unable to subscribe) Boards/Organizations as
  // deletes
  //
  // Right now we don't want to try to handle invalid members as deletes, because
  // destroying a member record will trigger delete API calls from any memberLists
  if (typeName === 'Board' || typeName === 'Organization') {
    const update: LiveUpdate = {
      typeName,
      delta: { id, deleted: true },
    } as LiveUpdate;

    sendUpdates([update]);
  }
});
