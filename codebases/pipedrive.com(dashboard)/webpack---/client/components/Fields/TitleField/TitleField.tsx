import React from 'react';
import { FormFieldsOnChange, ItemType } from 'Types/types';

interface Props {
	fieldKey: string;
	onComponentChange: (params: FormFieldsOnChange, additionaParams?: { isManualChange?: boolean }) => void;
	Element: React.FunctionComponent<any>;
	value?: string | ItemType[] | number | null;
}

export const TitleField: React.FC<Props> = ({ onComponentChange, Element, value, ...elementProps }) => {
	const onChange = (changedValue: FormFieldsOnChange) => {
		onComponentChange(changedValue, { isManualChange: !!changedValue });
	};

	return <Element value={value} onComponentChange={onChange} {...elementProps} />;
};
