import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import classNames from 'classnames';

import styles from './RemoveArea.pcss';

interface RemoveAreaProps {
	isShown: boolean;
}

const RemoveArea: React.FC<RemoveAreaProps> = ({ isShown }) => {
	const translator = useTranslator();

	return (
		<>
			<div
				className={classNames(styles.removeAreaInvisible, {
					[styles.isShown]: isShown,
				})}
				data-target-id="REMOVE-REPORT"
			/>
			<div
				className={classNames(styles.removeAreaVisible, {
					[styles.isShown]: isShown,
				})}
			>
				<div className={styles.removeAreaTextWrapper}>
					{translator.gettext('Remove from dashboard')}
				</div>
			</div>
		</>
	);
};

export default React.memo(RemoveArea);
