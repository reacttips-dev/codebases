import React, { useEffect, useState, useRef } from 'react';
import { Icon, PopoverPlacement } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import useToolsContext from '../../hooks/useToolsContext';
import useUserDataContext from '../../hooks/useUserDataContext';
import { initGettingStarted, initIamSidebar, initProactive, showGSCoachmark, toggleSupport } from './helpers';
import Breadcrumbs from './Breadcrumbs';
import GlobalSearch from '../GlobalSearch';
import AccountMenu from './Account';
import QuickAdd from './QuickAdd';
import { useRootSelector } from '../../store';
import { HeaderWrapper, HeaderLeft, HeaderCenter, HeaderRight, HeaderIcon, RaisedTooltip } from './styled';
import { HeaderTeamsInviteButton } from '../TeamsInvite';
import { isNewUser } from '../../utils/isNewUser';

interface TooltipProps {
	children: React.ReactNode;
	content: string | React.ReactNode;
	placement?: PopoverPlacement;
	visible?: boolean;
}

const trackGettingStartedDisplayed = (metrics) => {
	metrics?.trackUsage(null, 'getting_started', 'displayed', {
		gs_version: 'v3',
		gs_name: 'hvcdataimport',
	});
};

export function HeaderTooltip({ content, children, placement = 'bottom', ...rest }: TooltipProps) {
	return (
		<RaisedTooltip innerRefProp="ref" placement={placement} content={content} portalTo={document.body} {...rest}>
			{children}
		</RaisedTooltip>
	);
}

const showSidebar = (sidebarObj, metrics) => {
	const timer = setTimeout(
		() => {
			sidebarObj.show();
			trackGettingStartedDisplayed(metrics);
		},
		process.env.NODE_ENV === 'production' ? 1000 * 60 * 60 : 1000 * 60,
	);

	return () => {
		clearTimeout(timer);
	};
};

const calcShowSidebar = (sidebarObj, metrics) => {
	const timeNow = new Date();
	const closedDate = new Date(parseInt(window.localStorage.getItem('iam-client-sidebar.closed-time'), 10));
	const diff = timeNow.getTime() - closedDate.getTime();
	const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
	if (hours >= 24) {
		setTimeout(() => {
			sidebarObj.show();
			trackGettingStartedDisplayed(metrics);
		}, 5000);
	}
};

export default function Header({ sidebarRef }: { sidebarRef: React.ReactNode }) {
	const translator = useTranslator();
	const { hasRegisteredAllExternals, blacklistedUI } = useRootSelector((s) => s.navigation);
	const proactiveRef = useRef(null);
	const [supportVisible, setSupportVisible] = useState(false);
	const { user, users, signupData } = useUserDataContext();
	const { componentLoader, iamClient, metrics } = useToolsContext();
	const buttonRef = useRef(null);

	const onClick = () => toggleSupport();

	const toggleSidebarAndCoachmark = (sidebar) => {
		if (!window.localStorage.getItem('iam-client-sidebar.closed') && isNewUser(user)) {
			showSidebar(sidebar, metrics);
		}

		window.app.global.bind('ui.event.globalmessages.render', () => {
			if (Number(window.localStorage.getItem('iam-client-sidebar.closed')) >= 3) {
				showGSCoachmark(
					buttonRef,
					iamClient,
					translator.gettext('You can always find the getting started guide by opening Quick Help.'),
				);
			} else {
				calcShowSidebar(sidebar, metrics);
			}
		});
	};

	const SupportCenter = () => {
		return (
			<div ref={buttonRef}>
				<HeaderTooltip content={translator.gettext('Quick help')}>
					<HeaderIcon
						lastItem={false}
						yellow={false}
						active={supportVisible}
						onClick={onClick}
						aria-label={translator.gettext('Quick help')}
						data-test="support-center"
						tabIndex={0}
					>
						<Icon icon="help" color="black-64" />
					</HeaderIcon>
				</HeaderTooltip>
			</div>
		);
	};

	useEffect(() => {
		if (hasRegisteredAllExternals && user?.companyFeatures.get('proactive_feed')) {
			initProactive(componentLoader, proactiveRef.current);
		}
	}, [hasRegisteredAllExternals, user]);

	useEffect(() => {
		if (hasRegisteredAllExternals && iamClient) {
			// hvtAbTestVersion will be renamed on SUS level to isHVC
			// however old clients won't have the new value so we keep the old value check
			// hvtAbTestVersion/isHVC are only recorded for the clients who went through any of HVC sign ups
			const isHVC = signupData?.data?.hvtAbTestVersion || signupData?.data?.isHVC;
			const sidebar = initIamSidebar(iamClient, users?.size, signupData, sidebarRef, isHVC);

			if (isHVC) {
				toggleSidebarAndCoachmark(sidebar);
			} else {
				if (user?.companyFeatures.get('getting_started')) {
					initGettingStarted(iamClient, users?.size, signupData, sidebarRef);
				}
			}
		}
	}, [hasRegisteredAllExternals, iamClient]);

	useEffect(() => {
		if (window.app.global) {
			const changeSupportVisibility = (visibility) => {
				setSupportVisible(visibility);
			};

			window.app.global.bind('ui.event.sidebar.toggle', changeSupportVisibility);

			return () => {
				window.app.global.unbind('ui.event.sidebar.toggle', changeSupportVisibility);
			};
		}
	}, [window.app.global]);

	return (
		<HeaderWrapper id="froot-header" data-test="header">
			<HeaderLeft>
				<Breadcrumbs />
			</HeaderLeft>

			<HeaderCenter>
				{!blacklistedUI.globalSearch && (
					<>
						<GlobalSearch />
						<QuickAdd />
					</>
				)}
			</HeaderCenter>

			<HeaderRight>
				<HeaderTeamsInviteButton />
				{!blacklistedUI.topRightNonEssential && <div ref={proactiveRef} />}

				<div ref={buttonRef}>
					<SupportCenter />
				</div>

				<AccountMenu />
			</HeaderRight>
		</HeaderWrapper>
	);
}
