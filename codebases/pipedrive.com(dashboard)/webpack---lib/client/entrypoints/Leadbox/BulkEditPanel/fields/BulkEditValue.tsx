import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { Monetary } from '@pipedrive/form-fields';

import { BulkEditFieldWrapper } from './BulkEditFieldWrapper';

type Props = {
	readonly onValueReset: () => void;
	readonly onValueChange: (
		newValue: {
			readonly label: string;
			readonly value: string;
		} | null,
	) => void;
};

export const BulkEditValue: React.FC<Props> = (props) => {
	const translator = useTranslator();

	return (
		<BulkEditFieldWrapper
			title={translator.gettext('Value')}
			isMandatory={false}
			onValueReset={props.onValueReset}
			onValueChange={props.onValueChange}
		>
			<Monetary
				portalTo={() => document.querySelector('.BulkEditPanelWrapperPortalTo')}
				onComponentChange={(newValue: { readonly label: string; value: string }) => {
					props.onValueChange(newValue);
				}}
			/>
		</BulkEditFieldWrapper>
	);
};
