import { colors, fonts } from '@pipedrive/convention-ui-css/dist/js/variables';
import { Icon } from '@pipedrive/convention-ui-react';
import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';

import useToolsContext from '../../hooks/useToolsContext';
import { MenuLink, MenuItem } from './types';
import KeyboardShortcut from '../KeyboardShortcut';
import useMenuAction from '../../hooks/useMenuAction';

const StyledRoot = styled.a<{ hasKeyboardShortcut: boolean }>`
	text-decoration: none;
	display: flex;
	padding: 10px 24px;
	align-items: center;
	transition: background-color 0.1s;
	user-select: none;
	cursor: pointer;
	${(props) => props.hasKeyboardShortcut && 'padding-right: 16px;'}

	&.redirect {
		padding: 10px 12px 10px 24px;
	}

	&:not(.active) {
		&:hover {
			text-decoration: none;
			background-color: ${colors.black8};

			.cui4-icon {
				fill: ${colors.black88};
			}
		}
		&:active {
			background-color: ${colors.black16};
		}
		&.disabled {
			cursor: not-allowed;
		}
	}

	&.active {
		background-color: ${colors.blue16};
		position: relative;

		&:hover {
			text-decoration: none;
			background-color: ${colors.blue24};
		}

		&:active {
			background-color: ${colors.blue32};
		}
	}

	${KeyboardShortcut} {
		margin-left: 24px;
	}
`;

const SubMenuTitle = styled.div`
	flex: 1;
	padding-left: 14px;
	font: ${fonts.fontBody};
	color: ${colors.black};

	&:first-child {
		padding-left: 40px;
	}
	${StyledRoot}.active & {
		font: ${fonts.fontTitleM};
		color: ${colors.blue};
	}
`;

const HoverIcon = styled(Icon)`
	display: none;

	${StyledRoot}:hover & {
		margin-left: 16px;
		display: flex;
	}
`;

interface Props {
	item: MenuLink;
	isActive?: boolean;
	onClick?(item: MenuItem, ev: React.SyntheticEvent): void;
}

export function SubMenuItem({ item, onClick, isActive }: Props) {
	const { metrics } = useToolsContext();
	const handleItemAction = useMenuAction();
	const isExternalLink = item.target === '_blank';

	function handleClick(ev: React.SyntheticEvent) {
		if (item.action) {
			handleItemAction(item.action);
		}

		if (isExternalLink) {
			metrics?.trackUsage(null, 'navigation_discovery_link', 'clicked', { link: item.key });
		} else if (item?.parent?.key === 'more') {
			metrics?.trackUsage(null, 'navigation_more_menu_item', 'clicked', { link: item.key });
		} else if (item?.parent?.key === 'account') {
			metrics?.trackUsage(null, 'navigation_account_menu_item', 'clicked', {
				link: item.key,
			});
		}

		if (onClick) {
			onClick(item, ev);
		}
	}

	return (
		<StyledRoot
			href={item.path}
			target={item.target}
			onClick={handleClick}
			rel="noopener"
			className={classNames({
				disabled: item.disabled,
				redirect: isExternalLink,
				active: isActive,
			})}
			data-test={`submenu-item-${item.key}`}
			hasKeyboardShortcut={!!item.keyboardShortcut}
		>
			{item.icon && <Icon icon={item.icon} color={isActive ? 'blue' : 'black-64'} />}
			{item.customIcon}
			<SubMenuTitle>{item.title}</SubMenuTitle>
			{!!item.keyboardShortcut && <KeyboardShortcut>{item.keyboardShortcut}</KeyboardShortcut>}
			{isExternalLink && <HoverIcon icon="redirect" color="black-32" size="s" />}
		</StyledRoot>
	);
}
