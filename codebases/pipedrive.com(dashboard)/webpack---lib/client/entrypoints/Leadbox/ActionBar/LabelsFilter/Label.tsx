import React from 'react';
import { createFragmentContainer, graphql } from '@pipedrive/relay';
import { LabelColors } from 'Types/types';
import { LabelBadge } from 'Components/LabelBadge/LabelBadge';

import { Label_label } from './__generated__/Label_label.graphql';

interface Props {
	readonly label: Label_label | null;
}

const LabelWithoutData: React.FC<Props> = ({ label }) => {
	if (label === null) {
		return null;
	}
	const color = label.colorName?.toLowerCase() as LabelColors;

	return <LabelBadge color={color}>{label.name}</LabelBadge>;
};

export const Label = createFragmentContainer(LabelWithoutData, {
	label: graphql`
		fragment Label_label on Label {
			colorName
			name
		}
	`,
});
