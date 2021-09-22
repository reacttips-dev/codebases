import React from 'react';
import { createFragmentContainer, graphql } from '@pipedrive/relay';
import { Select, Badge, BadgeColor } from '@pipedrive/convention-ui-react';
import { LabelColorEnum } from 'Utils/graphql/LabelColorEnum';
import { useTranslator } from '@pipedrive/react-utils';

import { BulkEditFieldWrapper } from './BulkEditFieldWrapper';
import type { BulkEditLabels_data } from './__generated__/BulkEditLabels_data.graphql';

type Props = {
	readonly data: BulkEditLabels_data;
	readonly onValueReset: () => void;
	readonly onValueChange: (labelIDs: Array<string> | null) => void;
};

function BulkEditLabelsWithoutData(props: Props) {
	const translator = useTranslator();

	return (
		<BulkEditFieldWrapper
			title={translator.gettext('Labels')}
			isMandatory={false}
			onValueReset={props.onValueReset}
			onValueChange={props.onValueChange}
		>
			<Select<string>
				style={{ width: 300 }}
				allowClear={true}
				placeholder={`(${translator.gettext('none')})`}
				multiple={true}
				onChange={(labelIDs: Array<string>) => {
					props.onValueChange(labelIDs);
				}}
			>
				{props.data.labels?.map((label) => (
					<Select.Option key={label?.id} value={label?.id}>
						<Badge color={LabelColorEnum.fromEnumToJS(label?.colorName) as BadgeColor}>{label?.name}</Badge>
					</Select.Option>
				))}
			</Select>
		</BulkEditFieldWrapper>
	);
}

export const BulkEditLabels = createFragmentContainer(BulkEditLabelsWithoutData, {
	data: graphql`
		fragment BulkEditLabels_data on RootQuery {
			labels {
				id
				colorName
				name
			}
		}
	`,
});
