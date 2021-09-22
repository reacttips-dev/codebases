import React from 'react';
import { Checkbox as CUICheckbox, Icon } from '@pipedrive/convention-ui-react';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { ReportsToDelete, SectionType } from './BulkDeleteModal';
import SectionHeader from './SectionHeader';
import { getUrl } from '../../utils/helpers';
import { MenuItem } from '../../pages/App/insightsWrapper/sideMenuUtils';
import { getReportIcon } from '../../utils/styleUtils';
import { getItemReportType } from '../../sidemenu/sidemenuCollapseContent/sidemenuListItems/sidemenuListItem/SidemenuListItemUtils';

import styles from './BulkDeleteModal.pcss';

interface SectionProps {
	sections: SectionType[];
	section: SectionType;
	manageHeaderChange: (id: string) => void;
	manageCheckedItems: (id: string, itemId: string) => void;
	reportsToDelete: ReportsToDelete;
}

const Section = ({
	sections,
	manageHeaderChange,
	manageCheckedItems,
	reportsToDelete,
	section,
}: SectionProps) => {
	const { name, items, id, disabled } = section;

	return (
		<>
			<SectionHeader
				title={name}
				disabled={disabled}
				sectionId={id}
				onChange={() => manageHeaderChange(id)}
				sections={sections}
				reportsToDelete={reportsToDelete}
			>
				<div className={styles.list}>
					{items.map((item: MenuItem, index: number) => {
						return (
							<div className={styles.listItem} key={index}>
								<CUICheckbox
									disabled={disabled}
									checked={
										!disabled &&
										reportsToDelete[id].includes(item.id)
									}
									onChange={() => {
										manageCheckedItems(id, item.id);
									}}
								>
									<span className={styles.name}>
										<Icon
											className={styles.listItemIcon}
											icon={getReportIcon({
												reportType: getItemReportType(
													item,
													false,
												) as insightsTypes.ReportType,
											})}
											size="s"
										/>
										<span>{item.name}</span>
									</span>
								</CUICheckbox>
								<a
									href={getUrl('reports', item.id)}
									rel="noopener noreferrer"
									target="_blank"
									data-test="widget-link"
								>
									<Icon
										className={styles.redirectIcon}
										color="white"
										icon="redirect"
									/>
								</a>
							</div>
						);
					})}
				</div>
			</SectionHeader>
		</>
	);
};

export default Section;
