import React from 'react';
import { Spinner } from '@pipedrive/convention-ui-react';

import styles from './FullscreenSpinner.pcss';

const FullscreenSpinner = () => {
	return (
		<div className={styles.spinner}>
			<Spinner size="xl" />
		</div>
	);
};

export default FullscreenSpinner;
