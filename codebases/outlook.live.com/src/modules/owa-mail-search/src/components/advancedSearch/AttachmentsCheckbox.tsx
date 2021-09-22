import { attachmentsLabel } from 'owa-locstrings/lib/strings/attachmentslabel.locstring.json';
import loc from 'owa-localize';
import { Checkbox } from '@fluentui/react/lib/Checkbox';
import { Label } from '@fluentui/react/lib/Label';

import * as React from 'react';

import styles from './AdvancedSearch.scss';

interface AttachmentsCheckboxProps {
    onChange: (event: any, value: boolean) => void;
    useLeftLabel: boolean;
    value: boolean;
}

const AttachmentsCheckbox = (props: AttachmentsCheckboxProps) => {
    const { onChange, useLeftLabel, value } = props;
    const LABEL_ID = 'attachmentsCheckboxLabel';

    return (
        <div
            className={
                useLeftLabel
                    ? styles.hasAttachmentsCheckboxLeft
                    : styles.hasAttachmentsCheckboxAbove
            }>
            <Label
                id={LABEL_ID}
                styles={{ root: styles.formFieldLabel }}
                title={loc(attachmentsLabel)}>
                {loc(attachmentsLabel)}
            </Label>
            <Checkbox
                ariaLabelledBy={LABEL_ID}
                checked={value}
                onChange={onChange}
                boxSide="end"
                styles={{ root: { width: 'auto' }, checkbox: { marginLeft: '0px' } }}
            />
        </div>
    );
};

export default AttachmentsCheckbox;
