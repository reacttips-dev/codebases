import React from 'react';
import { Icon, Option } from '@pipedrive/convention-ui-react';
import { createFragmentContainer, graphql } from '@pipedrive/relay';
import { LabelBadge } from 'Components/LabelBadge/LabelBadge';
import { LabelColorEnum } from 'Utils/graphql/LabelColorEnum';
import styled from 'styled-components';

import { LabelsSelectOption_label } from './__generated__/LabelsSelectOption_label.graphql';

interface OptionProps {
	readonly label: LabelsSelectOption_label;
	readonly selected: boolean;
	readonly highlighted: boolean;
	readonly onClick: (labelID: string) => void;
	readonly onEditClick: (labelID: string) => void;
}

export const StyledOption = styled(Option)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 32px;

	.cui4-badge {
		max-width: ${(props) => (props.selected ? 'calc(100% - 43px)' : 'calc(100% - 67px)')};
	}

	&:hover {
		.cui4-button {
			display: inherit;
		}
	}
`;

export const OptionEditButton = styled.button`
	position: absolute;
	right: 45px;
	top: 7px;
	background: none;
	border: none;
	cursor: pointer;
`;

const LabelsSelectOptionWithoutData: React.FC<OptionProps> = ({
	label,
	selected,
	onClick,
	onEditClick,
	highlighted,
}) => {
	const onOptionClick = () => {
		onClick(label.id);
	};

	const onEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation();
		onEditClick(label.id);
	};

	return (
		<StyledOption
			selected={selected}
			onClick={onOptionClick}
			manualHighlight={highlighted}
			highlighted={highlighted}
			data-testid="LabelsSelectOptionLabelBadge"
		>
			<LabelBadge color={LabelColorEnum.fromEnumToJS(label.colorName)}>{label.name}</LabelBadge>
			<OptionEditButton data-testid="OptionEditButton" onClick={onEdit}>
				<Icon icon="pencil" size="s" color="white" />
			</OptionEditButton>
		</StyledOption>
	);
};

export const LabelsSelectOption = createFragmentContainer(LabelsSelectOptionWithoutData, {
	label: graphql`
		fragment LabelsSelectOption_label on Label {
			id
			name
			colorName
		}
	`,
});
