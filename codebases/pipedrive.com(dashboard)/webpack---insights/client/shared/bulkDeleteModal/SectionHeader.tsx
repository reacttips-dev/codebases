import React from 'react';

import { SectionType, ReportsToDelete } from './BulkDeleteModal';
import Checkbox from './Checkbox';

import styles from './BulkDeleteModal.pcss';

const SectionHeader = ({
	title,
	disabled,
	sectionId,
	children,
	onChange,
	sections,
	reportsToDelete,
}: {
	title: string;
	disabled: boolean;
	sectionId: string;
	sections: SectionType[];
	children: React.ReactNode;
	onChange: () => void;
	reportsToDelete: ReportsToDelete;
}) => {
	/**
	 * ✔️ === everything
	 * ➖ === only something (not everything but not nothing)
	 * ☐ === nothing
	 */
	const checkedItemsLength = reportsToDelete[sectionId].length;
	const sectionItemsLength = sections.find(
		(section: SectionType) => section.id === sectionId,
	)?.items?.length;
	const isChecked = !disabled && checkedItemsLength === sectionItemsLength;
	const isIndeterminate = !disabled && checkedItemsLength > 0 && !isChecked;

	if (!sectionItemsLength) {
		return null;
	}

	return (
		<div className={styles.sectionContainer}>
			<Checkbox
				isIndeterminate={isIndeterminate}
				isChecked={isChecked}
				isDisabled={disabled}
				title={title}
				onChange={onChange}
			/>
			{children}
		</div>
	);
};

export default SectionHeader;
