import { Icon } from '@pipedrive/convention-ui-react';
import React from 'react';
import { mapLabelColor } from 'Utils/utils';
import { LabelColors } from 'Types/types';

import * as S from './ColorPalette.styles';

interface ColorPointProps {
	color: LabelColors;
	isSelected: boolean;
	onClick: (color: LabelColors) => void;
}

export const ColorPoint: React.FC<ColorPointProps> = ({ color, isSelected, onClick }) => {
	const onPointClick = () => {
		onClick(color);
	};

	const getTickColor = (colorName: LabelColors) => {
		switch (colorName) {
			case LabelColors.Yellow:
			case LabelColors.Gray:
				return 'black';
			default:
				return 'white';
		}
	};

	return (
		<S.StyledPill key={color} color={mapLabelColor(color)} onClick={onPointClick} $isActive={isSelected}>
			<Icon icon="check" color={getTickColor(color)} size="s" />
		</S.StyledPill>
	);
};

interface Props {
	availableColors: LabelColors[];
	selectedColor: null | LabelColors;
	onChange: (color: LabelColors) => void;
}

export const ColorPalette: React.FC<Props> = ({ availableColors, selectedColor, onChange }) => (
	<S.ColorPalette>
		{Object.values(availableColors).map((color) => (
			<ColorPoint key={color} color={color} isSelected={selectedColor === color} onClick={onChange} />
		))}
	</S.ColorPalette>
);
