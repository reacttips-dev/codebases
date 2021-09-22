import * as S from 'Components/LabelBadge/LabelBadgeList.styles';
import { LabelBadge } from 'Components/LabelBadge/LabelBadge';
import { LabelColorEnum } from 'Utils/graphql/LabelColorEnum';
import React from 'react';
import { LabelColor } from 'Components/LabelBadge/__generated__/LabelBadgeList_lead.graphql';

type Label = {
	readonly id: string;
	readonly name: string;
	readonly colorName: LabelColor | null;
};

type Props = {
	labels: ReadonlyArray<Label | null> | null;
	limit?: number;
	shouldWrap?: boolean;
};

export const LabelsList = (props: Props) => {
	const labels = props.labels ?? [];
	const limit = props.limit ?? 0;

	const totalActiveLabels = labels.length;
	const totalLabelsOverLimit = totalActiveLabels - limit;
	const shouldDisplayOverLimit = Boolean(limit && totalLabelsOverLimit > 0);

	return (
		<S.LabelsList shouldWrap={props.shouldWrap}>
			{labels?.map((label, index) => {
				const isOverLimit = limit && index + 1 > limit;
				if (label == null || isOverLimit === true) {
					return null;
				}

				return (
					<LabelBadge key={label.id} color={LabelColorEnum.fromEnumToJS(label.colorName)}>
						{label.name}
					</LabelBadge>
				);
			})}
			{shouldDisplayOverLimit && (
				<S.OverLimitBadge data-testid="LabelBadgeOverLimit">{`+${totalLabelsOverLimit}`}</S.OverLimitBadge>
			)}
		</S.LabelsList>
	);
};
