import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Spacing } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import {
	SidemenuSettings,
	SelectedItem,
	SidemenuReport,
} from '../types/apollo-query-types';
import Search from '../shared/search';
import SidemenuCollapse from './SidemenuCollapse';
import SidemenuHeader from './SidemenuHeader';
import { getCompanyFeatures } from '../api/webapp';

import styles from './Sidemenu.pcss';
import { showCappingFeatures } from '../shared/featureCapping/cappingUtils';

interface SidemenuProps {
	sidebarSettings: SidemenuSettings;
	selectedItem: SelectedItem;
}

const Sidemenu: React.FC<SidemenuProps> = ({
	sidebarSettings,
	selectedItem,
}) => {
	const translator = useTranslator();
	const { reports } = sidebarSettings;
	const isNew = !!reports.filter((report: SidemenuReport) => report.is_new)
		.length;
	const [searchableObject, setSearchableObject] = useState(sidebarSettings);
	const [searchText, setSearchText] = useState('');
	const isCappingFeature = showCappingFeatures(false);

	useEffect(() => {
		setSearchableObject(sidebarSettings);
	}, [sidebarSettings]);

	return (
		<aside className={styles.sidemenu}>
			<Spacing
				bottom="l"
				className={classNames({
					[styles.searchWrapper]: !isCappingFeature,
					[styles.searchAndAddNewWrapper]: isCappingFeature,
				})}
			>
				<Search
					objects={sidebarSettings}
					setSearchableObject={setSearchableObject}
					placeholder={translator.gettext('Search from Insights')}
					setSearchText={setSearchText}
				/>
				{isCappingFeature && (
					<SidemenuHeader
						itemId={selectedItem.id}
						itemType={selectedItem.type}
						isNewReport={isNew}
					></SidemenuHeader>
				)}
			</Spacing>

			{(Object.keys(searchableObject) as (keyof SidemenuSettings)[]).map(
				(item) => {
					return (
						<SidemenuCollapse
							key={item}
							itemId={selectedItem.id}
							itemType={selectedItem.type}
							type={item}
							isNew={isNew}
							items={searchableObject[item]}
							searchText={searchText}
						/>
					);
				},
			)}
		</aside>
	);
};

export default Sidemenu;
