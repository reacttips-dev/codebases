import {
	ConnectionHandler,
	RecordProxy,
	Variables,
	getRelayHandleKey,
	HandleFieldPayload,
	ReadOnlyRecordProxy,
	RecordSourceProxy,
	getStableStorageKey,
} from '@pipedrive/relay';

const CONNECTION_HANDLE_KEYS = '__connectionHandleKeys';

function update(store: RecordSourceProxy, payload: HandleFieldPayload): void {
	ConnectionHandler.update(store, payload);

	// Hackishly get the handle key minus the args.
	const [handleName] = payload.handleKey.split('(');

	const record = store.get(payload.dataID);

	const prevHandleKeys = record?.getValue(CONNECTION_HANDLE_KEYS, {
		handleName,
	});

	if (typeof prevHandleKeys !== 'object' && prevHandleKeys != null) {
		return;
	}
	const nextHandleKeys = {
		...prevHandleKeys,
		[payload.handleKey]: payload.args,
	};

	// The RecordProxy API doesn't let us set objects as values. We bypass this validation by reaching into internals.
	// We should consider sending PR to Relay to enable our complex use-case.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const mutator: any = (record as any)._mutator;

	// It's slightly janky to store this as a value rather than as linked
	//  records, but this will prevent the value from getting GCed so long as the
	//  parent record stays live, which is what we want. These data are light
	//  enough that this shouldn't take too much memory.
	mutator.setValue(record?.getDataID(), getStableStorageKey(CONNECTION_HANDLE_KEYS, { handleName }), nextHandleKeys);
}

function connectionExists(connection: Maybe<RecordProxy>): connection is RecordProxy {
	return connection != null;
}

function getConnections(
	record: ReadOnlyRecordProxy,
	key: string,
	filter?: (variables: Variables) => boolean,
): ReadonlyArray<RecordProxy> {
	const handleName = getRelayHandleKey('connection', key, null);

	const handleKeys = record.getValue(CONNECTION_HANDLE_KEYS, { handleName });
	if (typeof handleKeys !== 'object' || handleKeys == null) {
		return [];
	}

	return Object.entries(handleKeys)
		.filter(([_handleKey, args]) => !filter || filter(args))
		.map(([handleKey]) =>
			// This takes advantage of how a full storageKey with args can be used in place of name and args separately.
			record.getLinkedRecord(handleKey),
		)
		.filter(connectionExists);
}

export const PipedriveConnectionHandler = {
	...ConnectionHandler,
	update,
	getConnections,
};
