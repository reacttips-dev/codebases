import classNames from 'classnames';
import debounce from 'lodash/debounce';
import React, { useState } from 'react';

import config from '../../../config/styles';
import { MenuLink } from '../types';
import { ConditionalTooltip } from './ConditionalTooltip';
import { StyledBadge, StyledIcon, StyledLabel, StyledLink } from './styled';
import { useWindowResize } from './useWindowResize';

interface ToolsMenuItemProps {
	children?: React.ReactNode;
	item?: MenuLink;
	isActive?: boolean;
	onClick?: (item: MenuLink, ev: React.SyntheticEvent<HTMLAnchorElement>) => void;
}

export function ToolsMenuItem({ item, isActive, onClick }: ToolsMenuItemProps) {
	const { badge, icon, customIcon, path, title } = item;

	const [showTooltip, setShowTooltip] = useState(false);

	useWindowResize(
		debounce(() => {
			setShowTooltip(window.innerWidth < config.breakpoints.m);
		}),
	);

	function handleClick(ev: React.SyntheticEvent<HTMLAnchorElement>) {
		onClick?.(item, ev);
	}

	return (
		<ConditionalTooltip show={showTooltip} content={<span>{title}</span>}>
			<StyledLink href={path} onClick={handleClick} className={classNames({ active: isActive })}>
				{icon && <StyledIcon icon={icon} />}
				{customIcon}
				<StyledLabel>
					{title}
					{badge && <StyledBadge color="blue">{badge}</StyledBadge>}
				</StyledLabel>
			</StyledLink>
		</ConditionalTooltip>
	);
}
