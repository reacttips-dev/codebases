import React from 'react';
import classNames from 'classnames';
import update from 'immutability-helper';
import { useTranslator } from '@pipedrive/react-utils';

import {
	SidemenuReport,
	SidemenuDashboard,
	SelectedItemType,
	SidemenuSettings,
} from '../../types/apollo-query-types';
import { SidemenuGoal } from '../../types/goals';
import useSettingsApi from '../../hooks/useSettingsApi';
import SidemenuListItems from './sidemenuListItems/SidemenuListItems';
import {
	doesItemHaveAnotherOwner,
	getOwnItems,
	hasPeerItems,
} from '../../utils/sharingUtils';
import { getCurrentUserId } from '../../api/webapp';
import SidemenuItemGroup from './sidemenuItemGroup/SidemenuItemGroup';
import { MenuItem } from '../../pages/App/insightsWrapper/sideMenuUtils';

import styles from './SidemenuCollapseContent.pcss';

interface SidemenuCollapseContentProps {
	itemId: string;
	collapsed: boolean;
	type: keyof SidemenuSettings;
	items: MenuItem[];
	searchText: string;
	isNavigationDisabled: boolean;
	canHaveMultipleDashboards: boolean;
}

const SidemenuCollapseContent: React.FC<SidemenuCollapseContentProps> = ({
	itemId,
	collapsed,
	type,
	items,
	searchText,
	isNavigationDisabled,
	canHaveMultipleDashboards,
}) => {
	const translator = useTranslator();
	const currentUserId = getCurrentUserId();
	const { changeOrderWithinList } = useSettingsApi();
	const hasSubsections =
		type === SelectedItemType.GOALS || hasPeerItems(items, currentUserId);

	const saveNewOrder = (
		items: MenuItem[],
		additionalItems = [] as MenuItem[],
	) => {
		const itemsInNewOrder = update(items, {
			$push: additionalItems,
		});

		changeOrderWithinList(type, itemsInNewOrder);
	};

	const sidemenuListItemsDefaultProps = {
		type,
		itemId,
		searchText,
		isNavigationDisabled,
		canHaveMultipleDashboards,
	};

	const getContentWithSubsections = () => {
		if (type === SelectedItemType.GOALS) {
			const ongoingGoals = (items as SidemenuGoal[]).filter(
				(goalMenuItem) => !goalMenuItem.is_past,
			);
			const pastGoals = (items as SidemenuGoal[]).filter(
				(goalMenuItem) => goalMenuItem.is_past,
			);

			return (
				<>
					<SidemenuItemGroup
						key="active"
						heading={translator.gettext('Active')}
						noItemsMessage={translator.gettext('No goals')}
					>
						<SidemenuListItems
							{...{
								...sidemenuListItemsDefaultProps,
								items: ongoingGoals,
								saveItemOrder: (
									reorderedOngoingGoals: SidemenuGoal[],
								) =>
									saveNewOrder(
										reorderedOngoingGoals,
										pastGoals,
									),
							}}
						/>
					</SidemenuItemGroup>

					<SidemenuItemGroup
						key="past"
						heading={translator.gettext('Past')}
						noItemsMessage={translator.gettext('No goals')}
						isCollapsedDefault={true}
					>
						<SidemenuListItems
							{...{
								...sidemenuListItemsDefaultProps,
								items: pastGoals,
								saveItemOrder: (
									reorderedPastGoals: SidemenuGoal[],
								) =>
									saveNewOrder(
										ongoingGoals,
										reorderedPastGoals,
									),
							}}
						/>
					</SidemenuItemGroup>
				</>
			);
		}

		const isReportsSection = type === SelectedItemType.REPORTS;
		const peerItems = (
			items as (SidemenuReport | SidemenuDashboard)[]
		).filter((menuItem) =>
			doesItemHaveAnotherOwner(menuItem, currentUserId),
		);
		const ownItems = getOwnItems(items, currentUserId);
		const isPeerSubsectionActive = () =>
			peerItems.some((item) => itemId === item.id);

		return (
			<>
				<SidemenuItemGroup
					key="peer"
					heading={translator.gettext('Shared with me')}
					isCollapsedDefault={
						isReportsSection && !isPeerSubsectionActive()
					}
				>
					<SidemenuListItems
						{...{
							...sidemenuListItemsDefaultProps,
							items: peerItems,
							saveItemOrder: (
								reorderedPeerItems: SidemenuReport[],
							) => saveNewOrder(reorderedPeerItems, ownItems),
						}}
					/>
				</SidemenuItemGroup>

				<SidemenuItemGroup
					key="own"
					heading={
						isReportsSection
							? translator.gettext('My reports')
							: translator.gettext('My dashboards')
					}
				>
					<SidemenuListItems
						{...{
							...sidemenuListItemsDefaultProps,
							items: ownItems,
							saveItemOrder: (
								reorderedOwnItems: SidemenuReport[],
							) => saveNewOrder(peerItems, reorderedOwnItems),
						}}
					/>
				</SidemenuItemGroup>
			</>
		);
	};

	return (
		<>
			<ul
				className={classNames(styles.content, {
					[styles.collapsed]: collapsed,
					[styles.noMargin]: hasSubsections,
				})}
			>
				{hasSubsections ? (
					getContentWithSubsections()
				) : (
					<SidemenuListItems
						{...{
							...sidemenuListItemsDefaultProps,
							items,
							saveItemOrder: (
								reorderedItems: (
									| SidemenuReport
									| SidemenuDashboard
								)[],
							) => saveNewOrder(reorderedItems),
						}}
					/>
				)}
			</ul>
		</>
	);
};

export default SidemenuCollapseContent;
