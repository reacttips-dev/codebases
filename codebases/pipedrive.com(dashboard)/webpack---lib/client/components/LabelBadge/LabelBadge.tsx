import React from 'react';
import { mapLabelColor } from 'Utils/utils';
import { LabelColors } from 'Types/types';

import * as S from './LabelBadgeList.styles';

interface Props {
	readonly color: LabelColors;
}

export const LabelBadge: React.FC<Props> = ({ color, children }) => (
	<S.LabelBadge color={mapLabelColor(color)}>{children}</S.LabelBadge>
);
