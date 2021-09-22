import { Label } from '@fluentui/react/lib/Label';
import { TextField } from '@fluentui/react/lib/TextField';
import * as React from 'react';

import styles from './AdvancedSearch.scss';

export interface FormTextFieldProps {
    label: string;
    value: string;
    onChange: (event: any, value: string) => void;
    useLeftLabel: boolean;
}

const FormTextField = (props: FormTextFieldProps) => {
    const { onChange, label, value, useLeftLabel } = props;

    const fieldContainerLabel = useLeftLabel
        ? styles.formFieldContainerLeftWithMargin
        : styles.formFieldContainerAboveWithMargin;

    const TEXTFIELD_ID = `${label}-ID`;

    return (
        <div className={fieldContainerLabel}>
            <Label styles={{ root: styles.formFieldLabel }} htmlFor={TEXTFIELD_ID} title={label}>
                {label}
            </Label>
            <TextField
                id={TEXTFIELD_ID}
                styles={{ root: styles.formTextFieldField }}
                onChange={onChange}
                underlined={true}
                value={value}
            />
        </div>
    );
};

export default FormTextField;
