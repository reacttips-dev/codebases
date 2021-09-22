import type { RecordProxy, RecordSourceProxy, Variables } from '@pipedrive/relay';

import { PipedriveConnectionHandler } from './PipedriveConnectionHandler';

export type LeadStatus = 'ALL' | 'ARCHIVED';

type UpdateLeadsCount = {
	readonly store: RecordSourceProxy;
	readonly status: LeadStatus;
	readonly difference: number;
	readonly defaultMinimum?: number;
};

type Handler = {
	readonly store: RecordSourceProxy;
	readonly nodeID: string;
	readonly status: LeadStatus;
	readonly changedRecordsCount?: number;
};

type Config = {
	readonly connectionKey: string;
	readonly edgeType: string;
};

export class LeadConnectionHandler {
	constructor(private config: Config) {}

	/**
	 * Iterates all connections having some specified status
	 * (all the connections in Inbox or Archive).
	 */
	private iterateStatusConnections = (
		store: RecordSourceProxy,
		cb: (connection: RecordProxy) => void,
		status: LeadStatus,
	) => {
		const filter = function statusfilter({ status: connectionStatus }: Variables) {
			// We are taking only filter status into account. This technically means that we might
			// iterate over more leads than desirable (especially with other filters active).
			return status === connectionStatus;
		};

		const connections = PipedriveConnectionHandler.getConnections(
			store.getRoot(),
			this.config.connectionKey,
			filter,
		);

		connections.forEach((connection) => {
			if (connection != null) {
				return cb(connection);
			}
		});
	};

	/**
	 * Iterates every single virtual connection which is currently available.
	 */
	private iterateAllConnections = (store: RecordSourceProxy, cb: (connection: RecordProxy) => void) => {
		const allConnections = PipedriveConnectionHandler.getConnections(
			store.getRoot(),
			this.config.connectionKey,
			() => true, // no filter
		);

		allConnections.forEach((connection) => {
			if (connection != null) {
				return cb(connection);
			}
		});
	};

	/**
	 * This function updates the leads count in every unique connection. This is important because we
	 * store several virtual connections depending on filters, sorting, status and so on. For example:
	 *
	 * ```
	 * client:root:__ListView_leadView_connection(filter:{"labels":[],"owners":[],"sources":[]},"status":"ALL", …)
	 * client:root:__ListView_leadView_connection(filter:{"labels":[],"owners":[],"sources":[]},"status":"ARCHIVED", …)
	 * client:root:__ListView_leadView_connection(filter:{"labels":["ABC"],"owners":["XYZ"],"sources":[]},"status":"ALL", …)
	 * ```
	 *
	 * More info about connections and unique filters: https://relay.dev/docs/en/pagination-container.html#connection)
	 */

	private updateLeadsCount = ({ store, status, difference, defaultMinimum = 0 }: UpdateLeadsCount) => {
		if (difference === 0) {
			return;
		}

		const changeValue = (recordProxy: RecordProxy, fieldName: string, args?: Variables) => {
			const oldValue = recordProxy?.getValue(fieldName, args);
			if (oldValue == null || typeof oldValue !== 'number') {
				return;
			}
			const newValue = Math.max(defaultMinimum, oldValue + difference);
			recordProxy?.setValue(newValue, fieldName, args);
		};

		// change value for `LeadConnection.count` field
		this.iterateStatusConnections(store, (connection) => changeValue(connection, 'count'), status);

		// change value for `leadsCount` query
		const root = store.getRoot();
		const page = status === 'ALL' ? 'INBOX' : 'ARCHIVE';
		changeValue(root, 'leadsCount', { page });
	};

	/**
	 * Inserts node into all virtual connections based on the status.
	 */
	public insertNode = ({ store, nodeID, status, changedRecordsCount }: Handler) => {
		const node = store.get(nodeID);
		if (node == null) {
			return;
		}

		this.updateLeadsCount({ store, status, difference: changedRecordsCount ?? +1 });
		this.iterateStatusConnections(
			store,
			(connection) => {
				const newEdge = PipedriveConnectionHandler.createEdge(store, connection, node, this.config.edgeType);
				PipedriveConnectionHandler.insertEdgeBefore(connection, newEdge);
			},
			status,
		);
	};

	/**
	 * Deletes node from (all) our virtual connections. Please note: the record is actually not being
	 * deleted from the store but rather removed from the connection (so you can insert it somewhere
	 * else for example).
	 */
	public deleteNode = ({ store, nodeID, status, changedRecordsCount }: Handler) => {
		this.updateLeadsCount({ store, status, difference: changedRecordsCount ?? -1 });
		this.iterateAllConnections(store, (connection) => {
			PipedriveConnectionHandler.deleteNode(connection, nodeID);
		});
	};

	/**
	 * Deletes node from (all) our virtual connections as well as from the Relay store itself. This
	 * completely wipes it out of the existence and updates all the counters accordingly.
	 */
	public deleteNodePermanently = (props: Handler) => {
		this.deleteNode(props);
		props.store.delete(props.nodeID);
	};

	/**
	 * Moves node between our virtual connections (ALL ↔ ARCHIVED).
	 */
	public moveNode = ({ status: statusTo, ...props }: Handler) => {
		const statusFrom = statusTo === 'ALL' ? 'ARCHIVED' : 'ALL';
		// We should first delete the node and only after insert the new one. It's because otherwise
		// the newly inserted record would be immediately deleted (from all connections).
		this.deleteNode({ ...props, status: statusFrom });
		this.insertNode({ ...props, status: statusTo });
	};
}
