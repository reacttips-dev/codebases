import React from 'react';
import { graphql, QueryRenderer } from '@pipedrive/relay';
import { VisibilityValue } from 'Utils/getVisibility';

import { BulkEditTitle } from './fields/BulkEditTitle';
import { BulkEditLabels } from './fields/BulkEditLabels';
import { BulkEditValue } from './fields/BulkEditValue';
import { BulkEditOwner } from './fields/BulkEditOwner';
import { BulkEditVisibleTo } from './fields/BulkEditVisibleTo';
import type { BulkEditFieldsListQuery } from './__generated__/BulkEditFieldsListQuery.graphql';

type BulkUpdateData = {
	labels?: Array<string> | null;
	ownerLegacyId?: number | null;
	visibleTo?: VisibilityValue | null;
	title?: string | null;
	value?: {
		amount: string;
		currency: string;
	} | null;
};

type Props = {
	readonly onValueReset: (componentKey: keyof BulkUpdateData) => void;
	readonly onValueChange: (value: BulkUpdateData) => void;
};

export const BulkEditFieldsList: React.FC<Props> = (props) => {
	return (
		<QueryRenderer<BulkEditFieldsListQuery>
			query={graphql`
				query BulkEditFieldsListQuery {
					...BulkEditLabels_data
				}
			`}
			render={(relayProps) => (
				<>
					<BulkEditTitle
						onValueReset={() => props.onValueReset('title')}
						onValueChange={(newTitle) => props.onValueChange({ title: newTitle })}
					/>

					<BulkEditLabels
						data={relayProps}
						onValueReset={() => props.onValueReset('labels')}
						onValueChange={(labelIDs) => props.onValueChange({ labels: labelIDs })}
					/>

					<BulkEditValue
						onValueReset={() => props.onValueReset('value')}
						onValueChange={(newValue) => {
							if (newValue === null) {
								props.onValueChange({ value: null });
							} else {
								props.onValueChange({
									value: {
										amount: newValue.value,
										currency: newValue.label,
									},
								});
							}
						}}
					/>

					<BulkEditOwner
						onValueReset={() => props.onValueReset('ownerLegacyId')}
						onValueChange={(newOwner) => {
							props.onValueChange({ ownerLegacyId: newOwner?.id });
						}}
					/>
					<BulkEditVisibleTo
						onValueReset={() => props.onValueReset('visibleTo')}
						onValueChange={(visibleTo) => {
							props.onValueChange({ visibleTo });
						}}
					/>
				</>
			)}
		/>
	);
};
