import { VisibilitySwitch } from '@pipedrive/form-fields';
import { ModalContext } from 'components/AddModal/AddModal.context';
import formFieldStyles from 'components/Fields/FormField/FormField.pcss';
import React, { useContext } from 'react';
import { OnUpdateState, VisibilitySettingsKeys } from 'Types/types';

interface Props {
	initialValue: VisibilitySettingsKeys;
	disabled?: boolean;
	onUpdateState: OnUpdateState;
}

export const VisibilityField: React.FC<Props> = ({ initialValue, disabled, onUpdateState }) => {
	const { translator, features } = useContext(ModalContext);
	const { settings } = useContext(ModalContext);

	const onComponentChange = (value: number) => {
		onUpdateState({
			key: 'visible_to',
			value,
			type: 'visible_to',
		});
	};

	return (
		<div className={formFieldStyles.formField} data-test="add-modals-visibility-field">
			<div className={formFieldStyles.text}>{translator.gettext('Visible to')}</div>

			<VisibilitySwitch
				advancedPermissions={features.advancedPermissions}
				value={initialValue}
				onComponentChange={onComponentChange}
				disabled={disabled || !settings.canChangeVisibility}
				portalTo={false}
			/>
		</div>
	);
};
