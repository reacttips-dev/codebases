import { colors, fonts } from '@pipedrive/convention-ui-css/dist/js/variables';
import { Icon, Pill } from '@pipedrive/convention-ui-react';
import classNames from 'classnames';
import React from 'react';
import styled from 'styled-components';

import { MenuLink } from './types';
import { PillWithCount } from '../navigation/PillWithCount';
import { WarningIcon } from '../navigation/WarningIcon';

const NavMenuTitle = styled.div`
	padding-left: 12px;
	padding-right: 12px;
	font: ${fonts.fontBody};
	color: ${colors.black};
	transition: color 0.1s;
	flex: 1;

	.active & {
		font: ${fonts.fontTitleM};
		color: ${colors.blue};
	}

	&:last-child {
		padding-right: 16px;
	}
`;

const StyledLink = styled.a`
	text-decoration: none;
	display: flex;
	align-items: center;
	padding: 8px 0 8px 12px;
	margin: 0 8px;
	min-width: 224px;
	border-radius: 4px;
	transition: background-color 0.1s;
	user-select: none;
	box-sizing: border-box;
	word-break: break-word;
	position: relative;

	&:not(:last-child) {
		margin-bottom: 2px;
	}

	.cui4-icon {
		transition: fill 0.1s;
	}

	.cui4-pill {
		cursor: inherit;
	}

	${NavMenuTitle} + .cui4-pill, ${NavMenuTitle} + .cui4-icon {
		margin-right: 12px;
	}

	&:hover {
		text-decoration: none;
	}

	&:not(.active) {
		&:hover {
			background-color: ${colors.black8};

			.cui4-icon:first-child {
				fill: ${colors.black88};
			}
		}

		&:active {
			background-color: ${colors.black16};
		}
	}

	&.active {
		background-color: ${colors.blue16};

		&:hover {
			background-color: ${colors.blue24};
		}

		&:active {
			background-color: ${colors.blue32};
		}
	}
`;

interface Props {
	item: MenuLink;
	isActive: boolean;
	onClick(item: MenuLink, ev: React.SyntheticEvent): void;
}

function getIconOrPill(item: MenuLink) {
	if (item.warning) {
		return <WarningIcon />;
	}

	if (item.pill) {
		const pill = item.pill;

		if (pill.countKey) {
			return <PillWithCount pill={pill} maxCount={9999} />;
		} else {
			return (
				<Pill color={pill.color} size={pill.size} outline={pill.outline}>
					{pill.value}
				</Pill>
			);
		}
	}

	if (item.badge) {
		return (
			<Pill color="blue" size="s">
				{item.badge}
			</Pill>
		);
	}
}

export function NavMenuLink({ item, isActive, onClick }: Props) {
	function handleClick(ev: React.SyntheticEvent) {
		if (onClick) {
			onClick(item, ev);
		}
	}

	return (
		<StyledLink
			className={classNames({ active: isActive })}
			href={item.path}
			onClick={handleClick}
			rel="noopener"
			data-test={`navmenu-item-${item.key}`}
			aria-label={item.title}
		>
			{item.icon && <Icon icon={item.icon} color={isActive ? 'blue' : 'black-64'} />}
			<NavMenuTitle>{item.title}</NavMenuTitle>
			{getIconOrPill(item)}
		</StyledLink>
	);
}
