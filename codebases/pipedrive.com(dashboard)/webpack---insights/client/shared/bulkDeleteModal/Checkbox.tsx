import React from 'react';
import { Checkbox as CUICheckbox } from '@pipedrive/convention-ui-react';

import styles from './BulkDeleteModal.pcss';

const Checkbox = ({
	isChecked,
	isDisabled,
	onChange,
	title,
	isIndeterminate = false,
}: {
	isChecked: boolean;
	isDisabled: boolean;
	onChange: () => void;
	title?: string;
	isIndeterminate?: boolean;
}) => {
	return (
		<div className={styles.listHeader}>
			<CUICheckbox
				indeterminate={isIndeterminate}
				checked={isChecked}
				disabled={isDisabled}
				onChange={() => onChange()}
			>
				{title}
			</CUICheckbox>
		</div>
	);
};

export default Checkbox;
