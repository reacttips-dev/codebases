import React from 'react';
import { Pill } from '@pipedrive/convention-ui-react';

import { useUserCount } from '../../hooks/useUserCount';
import { MenuLinkPill } from '../menu';

interface Props {
	pill: MenuLinkPill;
	maxCount: number;
}

export function PillWithCount({ pill, maxCount }: Props) {
	const count = useUserCount(pill.countKey) || 0;

	if (!count) {
		return null;
	}

	return (
		<Pill color={pill.color} size={pill.size} outline={pill.outline}>
			{count > maxCount ? `${maxCount}+` : count}
		</Pill>
	);
}
