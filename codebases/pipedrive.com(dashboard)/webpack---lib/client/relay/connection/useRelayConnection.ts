import { useRelayEnvironment, commitLocalUpdate, RecordSourceProxy } from '@pipedrive/relay';
import { useMemo } from 'react';

import { LeadConnectionHandler, LeadStatus } from './LeadConnectionHandler';

type CommitUpdate = (store: RecordSourceProxy) => void;

type Handler = (nodeID: string, status: LeadStatus) => void;

export const useRelayConnection = () => {
	const environment = useRelayEnvironment();
	const connectionHandler = useMemo(
		() => new LeadConnectionHandler({ connectionKey: 'ListView_leadView', edgeType: 'LeadTableEdge' }),
		[],
	);

	const _commitUpdate = (cb: CommitUpdate) => commitLocalUpdate(environment, cb);

	const deleteNode: Handler = (nodeID, status) => {
		_commitUpdate((store) => connectionHandler.deleteNode({ store, nodeID, status }));
	};

	const deleteNodePermanently: Handler = (nodeID, status) => {
		_commitUpdate((store) => connectionHandler.deleteNodePermanently({ store, nodeID, status }));
	};

	const insertNode: Handler = (nodeID, status) => {
		_commitUpdate((store) => connectionHandler.insertNode({ store, nodeID, status }));
	};

	const moveNode: Handler = (nodeID, status) => {
		_commitUpdate((store) => connectionHandler.moveNode({ store, nodeID, status }));
	};

	return {
		insertNode,
		moveNode,
		deleteNode,
		deleteNodePermanently,
	};
};
