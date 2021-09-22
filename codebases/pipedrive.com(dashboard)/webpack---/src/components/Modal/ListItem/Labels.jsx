import React from 'react';

import { Pill } from '@pipedrive/convention-ui-react';
import { ITEM_TYPES, DEAL_STATUSES } from 'utils/constants';
import translator from 'utils/translator';
import searchItemPropType from 'utils/searchItemPropType';

import styles from './style.scss';

const { DEAL } = ITEM_TYPES;
const { WON, LOST } = DEAL_STATUSES;

function Labels({ item }) {
	if (item.type === DEAL) {
		if (item.status === WON) {
			return (
				<Pill className={styles.label} color="green">
					{translator.pgettext('Won (deal status)', 'Won')}
				</Pill>
			);
		}

		if (item.status === LOST) {
			return <Pill className={styles.label}>{translator.pgettext('Lost (deal status)', 'Lost')}</Pill>;
		}
	}

	return null;
}

Labels.propTypes = {
	item: searchItemPropType,
};

export default Labels;
