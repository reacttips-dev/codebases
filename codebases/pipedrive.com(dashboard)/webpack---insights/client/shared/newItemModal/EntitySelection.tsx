import React from 'react';
import classNames from 'classnames';
import { Option, Icon, Spacing } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import {
	Entity,
	ModalGoalEntitiesType,
	ModalReportEntitiesType,
} from '../../types/modal';

import styles from './EntitySelection.pcss';

interface EntityItemProps {
	selectedEntityType: Entity;
	entities: ModalReportEntitiesType | ModalGoalEntitiesType;
	onClick: (entityType: Entity) => void;
}

interface EntityProps {
	entityType: Entity;
	icon: 'string';
	title: 'string';
}

const EntitySelection: React.FC<EntityItemProps> = ({
	selectedEntityType,
	entities,
	onClick,
}) => {
	const translator = useTranslator();

	return (
		<Spacing all="m" top="s" className={styles.list}>
			<div className={styles.listTitle}>
				{translator.gettext('Choose entity')}
			</div>
			<ul>
				{Object.values(entities).map((entity: EntityProps) => {
					const isActive = entity.entityType === selectedEntityType;

					return (
						<li key={entity.entityType}>
							<Option
								manualHighlight
								className={classNames(styles.link, {
									[styles.linkActive]: isActive,
								})}
								onClick={() => onClick(entity.entityType)}
								data-test={`${entity.entityType}-entity-selection-button`}
							>
								<span className={styles.linkText}>
									<Icon
										icon={entity.icon}
										className={styles.linkIcon}
									/>
									<div className={styles.linkTitle}>
										{entity.title}
									</div>
									{isActive && (
										<Icon
											icon="arrow-right"
											color="blue"
											className={styles.arrowIcon}
										/>
									)}
								</span>
							</Option>
						</li>
					);
				})}
			</ul>
		</Spacing>
	);
};

export default EntitySelection;
