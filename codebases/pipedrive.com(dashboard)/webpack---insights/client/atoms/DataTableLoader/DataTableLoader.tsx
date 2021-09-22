import React from 'react';
import { Spinner } from '@pipedrive/convention-ui-react';
import { Waypoint } from 'react-waypoint';

import styles from './DataTableLoader.pcss';
import tableStyles from '../Table/Table.pcss';

interface DataTableLoaderProps {
	fetchMore: () => Promise<any[]>;
}

const DataTableLoader: React.FC<DataTableLoaderProps> = ({ fetchMore }) => {
	const onPositionChange: Waypoint.WaypointProps['onPositionChange'] =
		async ({ currentPosition }) => {
			if (currentPosition === Waypoint.inside) {
				await fetchMore();

				const tables = document.querySelectorAll(
					`.${tableStyles.tableWrapper}`,
				);
				const rows = document.querySelectorAll(
					`.${tableStyles.tableWrapper} .${tableStyles.tr}`,
				);

				/**
				 * Scroll to the last table row to prevent the loader
				 * from being visible and triggering another request.
				 */
				if (rows.length && tables.length) {
					const lastTable = tables[tables.length - 1];
					const lastRow = rows[rows.length - 1];

					if (lastRow && lastRow instanceof HTMLElement) {
						lastTable.scrollTop =
							lastRow.offsetTop - lastTable.clientHeight;
					}
				}
			}
		};

	return (
		<div className={styles.dataTableLoaderContainer}>
			<Waypoint onPositionChange={onPositionChange} />
			<div className={styles.dataTableLoader}>
				<Spinner />
			</div>
		</div>
	);
};

export default DataTableLoader;
