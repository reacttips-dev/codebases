import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { User } from '@pipedrive/form-fields';
import { PipedriveUser } from '@pipedrive/types';

import { BulkEditFieldWrapper } from './BulkEditFieldWrapper';

type Props = {
	readonly onValueReset: () => void;
	readonly onValueChange: (newOwner: PipedriveUser | null) => void;
};

export const BulkEditOwner: React.FC<Props> = (props) => {
	const translator = useTranslator();

	return (
		<BulkEditFieldWrapper
			title={translator.gettext('Owner')}
			isMandatory={true}
			onValueReset={props.onValueReset}
			onValueChange={props.onValueChange}
		>
			<User
				portalTo={() => document.querySelector('.BulkEditPanelWrapperPortalTo')}
				onComponentChange={(newOwner: PipedriveUser) => {
					props.onValueChange(newOwner);
				}}
			/>
		</BulkEditFieldWrapper>
	);
};
