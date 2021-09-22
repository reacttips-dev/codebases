import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { TextField } from '@pipedrive/form-fields';

import { BulkEditFieldWrapper } from './BulkEditFieldWrapper';

type Props = {
	readonly onValueReset: () => void;
	readonly onValueChange: (newTitle: string | null) => void;
};

export const BulkEditTitle: React.FC<Props> = (props) => {
	const translator = useTranslator();

	return (
		<BulkEditFieldWrapper
			title={translator.gettext('Title')}
			isMandatory={true}
			onValueReset={props.onValueReset}
			onValueChange={props.onValueChange}
		>
			<TextField
				autofocus={true}
				portalTo={() => document.querySelector('.BulkEditPanelWrapperPortalTo')}
				onComponentChange={(newTitle: string) => {
					props.onValueChange(newTitle);
				}}
			/>
		</BulkEditFieldWrapper>
	);
};
