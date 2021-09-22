import React, { useState } from 'react';
import classNames from 'classnames';
import { Icon, Spinner, Option } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { getReportIcon } from '../../utils/styleUtils';
import { ReportSettingsType } from '../../types/apollo-query-types';
import {
	getReportParentTypeLabels,
	isTheSameParentType,
} from '../../utils/reportTypeUtils';
import DisabledHint from './DisabledHint';
import { ReportParentType } from '../../utils/constants';
import { getErrorMessage } from '../../utils/messagesUtils';

import styles from './ReportTypesList.pcss';

interface ReportTypesListProps {
	reportTypes: ReportSettingsType[];
	currentReportType?: insightsTypes.ReportType;
	onChange: any;
	afterChange?: any;
	setError?: any;
}

const ReportTypesList: React.FC<ReportTypesListProps> = ({
	reportTypes,
	currentReportType,
	onChange,
	setError,
	afterChange,
}) => {
	const translator = useTranslator();
	const [loading, setLoading] = useState<ReportParentType | any>({});

	const handleClick =
		(
			dataType: insightsTypes.DataType,
			defaultType: insightsTypes.ReportType,
			type: ReportParentType,
		) =>
		async () => {
			try {
				setLoading({ ...loading, [type]: true });

				await onChange({ dataType, defaultType });

				setLoading({ ...loading, [type]: false });

				if (afterChange) {
					afterChange();
				}
			} catch (err) {
				if (setError) {
					const errorMessage = getErrorMessage(translator);

					setError(errorMessage);
				}

				setLoading({ ...loading, [type]: false });
			}
		};

	const renderButton = ({
		type,
		dataType,
		defaultType,
		isAvailable,
	}: ReportSettingsType) => {
		const { title, subtitle } = getReportParentTypeLabels(type, translator);
		const isCurrentType = isTheSameParentType(
			defaultType,
			currentReportType,
		);
		const isDisabled = loading[type] || !isAvailable;

		return (
			<Option
				className={classNames(styles.link, {
					[styles.linkActive]: isCurrentType,
					[styles.linkDisabled]: isDisabled,
				})}
				onClick={handleClick(dataType, defaultType, type)}
				disabled={isDisabled}
				selected={!loading[type] && isCurrentType}
				manualHighlight
				data-test={`new-${type}-report-button`}
			>
				<span className={styles.linkText}>
					<Icon
						icon={getReportIcon({ reportType: currentReportType })}
						className={styles.linkIcon}
					/>
					<span>
						<span className={styles.linkTitle}>{title}</span>
						<span className={styles.linkSubtitle}>{subtitle}</span>
					</span>
				</span>
				{loading[type] && (
					<span className={styles.addOn}>
						{loading[type] && <Spinner size="s" light />}
					</span>
				)}
			</Option>
		);
	};

	const ListItem = ({
		type,
		dataType,
		defaultType,
		isAvailable,
	}: ReportSettingsType) => {
		const button = renderButton({
			type,
			dataType,
			defaultType,
			isAvailable,
		});

		if (isAvailable) {
			return <li>{button}</li>;
		}

		return (
			<DisabledHint reportParentType={type} dataType={dataType}>
				<div className={styles.fullWidth}>{button}</div>
			</DisabledHint>
		);
	};

	return (
		<ul className={styles.list}>
			{reportTypes.map((type: ReportSettingsType) => (
				<ListItem {...type} key={type.type} />
			))}
		</ul>
	);
};

export default ReportTypesList;
