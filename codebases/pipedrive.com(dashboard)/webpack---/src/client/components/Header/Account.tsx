import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Popover } from '@pipedrive/convention-ui-react';
import { AccountMenuButton, MenuLink, SubMenu } from '../menu';
import { MenuItemList } from '../navigation/MenuItemList';
import { AnySubMenuItem } from '../navigation/AnySubMenuItem';
import useToolsContext from '../../hooks/useToolsContext';
import useUserDataContext from '../../hooks/useUserDataContext';
import useMenuAction from '../../hooks/useMenuAction';
import { useRootSelector } from '../../store';
import { toggleAccount } from '../../store/navigation/actions';
import { hideSupport } from './helpers';
import { TeamsInvite } from '../TeamsInvite';

export default function Account() {
	const { user, menuWaitressUser } = useUserDataContext();
	const { iamClient, metrics } = useToolsContext();
	const dispatch = useDispatch();
	const accountMenuRef = useRef(null);
	const accountButtonRef = useRef(null);
	const [optOutCoachmark, setOptOutCoachmark] = useState(null);
	const handleItemAction = useMenuAction();
	const { signupData } = useUserDataContext();

	const {
		items: { secondary },
		accountVisible,
	} = useRootSelector((s) => s.navigation);

	const accountItem = secondary.find((item) => item.key === 'account') as MenuLink;
	const [fallbackUserName, fallbackCompanyName] = accountItem?.title.split('\n');

	if (signupData?.data?.hvtAbTestVersion === TeamsInvite.Header) {
		accountItem.submenu = accountItem.submenu.filter((s) => !(s.key === 'dropmenu_users'));
	}

	function handleAccountClose() {
		dispatch(toggleAccount(false));
	}

	function handleAccountToggle() {
		!accountVisible && metrics?.trackUsage(null, 'navigation_account_menu', 'opened');
		hideSupport();
		dispatch(toggleAccount());
	}

	function onPopupVisibleChange() {
		if (accountVisible) {
			dispatch(toggleAccount(false));
		}
	}

	function onItemClick(item: MenuLink) {
		handleAccountClose();

		if (item.action) {
			handleItemAction(item.action);
		}
	}

	function getAccountMenuPopoverContent() {
		return (
			<SubMenu ref={accountMenuRef}>
				<MenuItemList items={accountItem.submenu} ItemComponent={AnySubMenuItem} onItemClick={onItemClick} />
			</SubMenu>
		);
	}

	function getProfileIcon() {
		const profilePicture = user?.get('icon_url') || menuWaitressUser.pic_url;
		const isDefaultProfilePicture =
			`${window.app.config.static}/images/icons/profile_120x120.svg` === profilePicture;

		return isDefaultProfilePicture ? '' : profilePicture;
	}

	useEffect(() => {
		if (optOutCoachmark && accountVisible && iamClient) {
			optOutCoachmark.close();
			setOptOutCoachmark(null);
		}
	}, [optOutCoachmark, accountVisible]);

	return (
		<div ref={accountButtonRef}>
			<Popover
				placement="bottom-end"
				spacing="none"
				visible={accountVisible}
				onPopupVisibleChange={onPopupVisibleChange}
				portalTo={document.body}
				content={getAccountMenuPopoverContent}
				data-test="account-menu-content"
			>
				<div>
					<AccountMenuButton
						item={accountItem}
						name={user?.get('name') || menuWaitressUser.name || fallbackUserName}
						company={user?.get('company_name') || fallbackCompanyName}
						icon={getProfileIcon()}
						onClick={handleAccountToggle}
						isActive={accountVisible}
					/>
				</div>
			</Popover>
		</div>
	);
}
