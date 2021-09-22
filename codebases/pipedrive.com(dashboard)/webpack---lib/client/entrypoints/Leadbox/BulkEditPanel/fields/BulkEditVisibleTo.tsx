import React, { useContext } from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { VisibilitySwitch } from '@pipedrive/form-fields';
import { WebappApiContext } from 'Components/WebappApiContext';
import { VisibilityValue, VisibilityRoleId, roles } from 'Utils/getVisibility';

import { BulkEditFieldWrapper } from './BulkEditFieldWrapper';

type Props = {
	readonly onValueReset: () => void;
	readonly onValueChange: (visibleTo: VisibilityValue | null) => void;
};

export const BulkEditVisibleTo: React.FC<Props> = ({ onValueReset, onValueChange }) => {
	const translator = useTranslator();
	const { advancedPermissions, leadDefaultVisibility, canChangeVisibility } = useContext(WebappApiContext);

	const handleEditMode = () => {
		onValueChange(roles[leadDefaultVisibility]);
	};

	const handleValueChange = (visibleTo: number) => {
		onValueChange(roles[visibleTo]);
	};

	return (
		<BulkEditFieldWrapper
			title={translator.gettext('Visible to')}
			disabled={!canChangeVisibility}
			isMandatory
			onValueReset={onValueReset}
			onValueChange={onValueChange}
			onEditMode={handleEditMode}
		>
			<VisibilitySwitch
				value={leadDefaultVisibility as VisibilityRoleId}
				advancedPermissions={advancedPermissions}
				portalTo={null}
				placement="bottom-end"
				onComponentChange={handleValueChange}
			/>
		</BulkEditFieldWrapper>
	);
};
