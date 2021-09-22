import React from 'react';
import classNames from 'classnames';
import { useTranslator } from '@pipedrive/react-utils';
import { Option, Badge, Spacing } from '@pipedrive/convention-ui-react';

import DisabledHint from '../../atoms/ReportTypesList/DisabledHint';
import { GoalDataType } from '../../types/goals';
import {
	ReportActivitySubTypes,
	GoalActivitySubTypes,
	GoalDealSubTypes,
	ReportDealSubTypes,
	ReportRevenueSubTypes,
	SubEntity,
	GoalRevenueSubTypes,
} from '../../types/modal';

import styles from './TypeSelection.pcss';

interface TypeItemProps {
	selectedEntitySubType: SubEntity;
	onClick: ({
		subType,
		dataType,
	}: {
		subType: SubEntity;
		dataType: GoalDataType;
	}) => void;
	types:
		| ReportActivitySubTypes
		| ReportDealSubTypes
		| ReportRevenueSubTypes
		| GoalActivitySubTypes
		| GoalRevenueSubTypes
		| GoalDealSubTypes;
	columnTitle: string;
}

const TypeItem: React.FC<TypeItemProps> = ({
	selectedEntitySubType,
	onClick,
	types,
	columnTitle,
}) => {
	const translator = useTranslator();

	const listElement = (
		subEntity: [
			SubEntity,
			{
				isAvailable?: boolean;
				plan?: string;
				title: string;
				subtitle: string;
				dataType?: GoalDataType;
			},
		],
	) => {
		const subEntityType = subEntity[0];
		const subEntityData = subEntity[1];
		const isCurrentType = subEntityType === selectedEntitySubType;

		const getPlanBadge = () => {
			if (
				!subEntityData.isAvailable &&
				subEntityData.plan === 'advanced'
			) {
				return (
					<Badge color="tier-gold" className={styles.planBadge}>
						{translator.gettext('Advanced')}
					</Badge>
				);
			}

			if (
				!subEntityData.isAvailable &&
				subEntityData.plan === 'professional'
			) {
				return (
					<Badge color="tier-platinum" className={styles.planBadge}>
						{translator.gettext('Professional')}
					</Badge>
				);
			}

			return null;
		};

		const listItem = (
			<li key={subEntityType}>
				<Option
					className={classNames(styles.link, {
						[styles.linkActive]: isCurrentType,
						[styles.linkDisabled]: !subEntityData.isAvailable,
					})}
					onClick={() =>
						onClick({
							subType: subEntityType,
							dataType: subEntityData.dataType,
						})
					}
					disabled={!subEntityData.isAvailable}
					selected={isCurrentType}
					manualHighlight
					data-test={`new-${subEntityType}-report-button`}
				>
					<div className={styles.linkText}>
						<div className={styles.linkTitle}>
							{subEntityData.title}
						</div>
						<div className={styles.linkSubtitle}>
							{subEntityData.subtitle}
						</div>
					</div>
					{getPlanBadge()}
				</Option>
			</li>
		);

		if (!subEntityData.isAvailable) {
			return (
				<DisabledHint
					// @ts-ignore
					reportParentType={subEntityType}
					dataType={subEntityData.dataType}
				>
					{listItem}
				</DisabledHint>
			);
		}

		return listItem;
	};

	return (
		<Spacing all="m" top="s" className={styles.list}>
			<div className={styles.listTitle}>{columnTitle}</div>
			<ul>{Object.entries(types).map(listElement)}</ul>
		</Spacing>
	);
};

export default TypeItem;
