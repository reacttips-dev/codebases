import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import {
	Icon,
	Dropmenu,
	Button,
	Spacing,
	Separator,
	Checkbox,
	Spinner,
} from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import {
	getGroupedColumns,
	GroupedColumns,
	SourceTableCheckbox,
} from './sourceTableUtils';
import Search from '../../shared/search';
import { sortArrayByProperty } from '../../utils/helpers';
import { TranslatedField } from '../../types/report-options';

import styles from './SourceTableSettings.pcss';

interface SourceTableSettingsProps {
	fields: TranslatedField[];
	columns: string[];
	isUpdatingColumns?: boolean;
	updateColumns: (columns: string[]) => Promise<void>;
}

const SourceTableSettings: React.FC<SourceTableSettingsProps> = ({
	fields,
	columns,
	isUpdatingColumns = false,
	updateColumns,
}) => {
	const translator = useTranslator();
	const groupedColumns = useMemo(
		() => getGroupedColumns(fields, columns),
		[columns.length],
	);
	const [searchableObject, setSearchableObject] = useState(groupedColumns);
	const [searchInProgress, setSearchInProgress] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [isLastItem, setIsLastItem] = useState(false);

	const combinedColumns = [
		...searchableObject.selected,
		...searchableObject.unselected,
	].sort(sortArrayByProperty('label'));

	useEffect(() => {
		setIsLastItem(groupedColumns.selected.length === 1);
	}, [groupedColumns.selected.length]);

	const onCheckboxChange = (
		isChecked: boolean,
		field: SourceTableCheckbox,
	) => {
		return isChecked
			? updateColumns(columns.filter((column) => column !== field.value))
			: updateColumns([...columns, field.value]);
	};

	const renderListItem = (field: SourceTableCheckbox) => {
		const isChecked = columns.some((column) => field.value === column);
		const isDisabled = (isLastItem && isChecked) || isUpdatingColumns;

		return (
			<li
				key={field.value}
				className={classNames(styles.selectOption, {
					[styles.selectOptionDisabled]: isDisabled,
				})}
			>
				<Checkbox
					checked={isChecked}
					onChange={() => onCheckboxChange(isChecked, field)}
					disabled={isDisabled}
					data-test={`${field.label}-column-checkbox${
						isChecked ? '-checked' : ''
					}`}
				>
					{field.label}
				</Checkbox>
			</li>
		);
	};

	const renderSearchResults = () => {
		if (!combinedColumns.length) {
			return (
				<Spacing all="m">
					{translator.gettext('No match found')}
				</Spacing>
			);
		}

		return <ul>{combinedColumns.map(renderListItem)}</ul>;
	};

	const sortedColumns = (objects: GroupedColumns) => {
		return (Object as any).fromEntries(Object.entries(objects).sort());
	};

	return (
		<Dropmenu
			className={styles.dropMenu}
			popoverProps={{
				className: styles.dropMenuPopover,
				visible: isVisible,
				portalTo: document.body,
				popperProps: {
					modifiers: {
						preventOverflow: {
							boundariesElement: 'viewport',
							padding: 48,
						},
					},
				},
				placement: 'left-start',
				onPopupVisibleChange: (visible) => {
					if (!visible) {
						setSearchInProgress(false);
					}

					setIsVisible(visible);
				},
			}}
			header={() => (
				<Spacing all="m">
					<div className={styles.settingsHeader}>
						<h5>{translator.gettext('Choose columns')}</h5>
						{isUpdatingColumns && <Spinner size="s" />}
					</div>
					<Search
						objects={sortedColumns(groupedColumns)}
						setSearchableObject={setSearchableObject}
						placeholder={translator.gettext('Search')}
						setInProgress={setSearchInProgress}
						shouldAutoFocus
					/>
				</Spacing>
			)}
			content={() => (
				<div className={styles.scrollableContent}>
					{searchInProgress ? (
						renderSearchResults()
					) : (
						<>
							<div>
								<Separator type="block" sticky>
									{translator.gettext('Visible')}
								</Separator>
								<ul>
									{groupedColumns.selected.map(
										renderListItem,
									)}
								</ul>
							</div>
							{groupedColumns.unselected.length > 0 && (
								<div>
									<Separator type="block" sticky>
										{translator.gettext('Not visible')}
									</Separator>
									<ul>
										{groupedColumns.unselected.map(
											renderListItem,
										)}
									</ul>
								</div>
							)}
						</>
					)}
				</div>
			)}
		>
			<Button
				size="s"
				className={styles.tableSettingsButton}
				data-test="source-table-settings-button"
			>
				<Icon icon="cogs" size="s" />
			</Button>
		</Dropmenu>
	);
};

export default SourceTableSettings;
