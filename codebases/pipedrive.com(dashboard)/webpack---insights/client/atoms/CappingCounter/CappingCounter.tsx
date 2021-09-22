import React from 'react';

import { getCompanyTierCode } from '../../api/webapp';
import { Tiers } from '../../types/feature-capping';

import styles from './CappingCounter.pcss';

const CappingCounter = ({
	usage,
	cappingLimit,
}: {
	usage: number;
	cappingLimit: number;
}) => {
	if (getCompanyTierCode() === Tiers.DIAMOND) {
		return null;
	}

	return (
		<div className={styles.counter}>
			<div className={styles.countText} data-test="capping-counter-text">
				{`${usage}/${cappingLimit}`}
			</div>
		</div>
	);
};

export default CappingCounter;
