import { editPersonsAdvancedSearch } from '../../actions/internalActions';
import { Label } from '@fluentui/react/lib/Label';
import { DraggableItemTypes } from 'owa-dnd';
import { RecipientWell } from 'owa-readwrite-recipient-well-fabric';
import { RecipientType } from 'owa-recipient-types/lib/types/RecipientType';
import type { ReadWriteRecipientViewState } from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import * as React from 'react';

import styles from './AdvancedSearch.scss';

interface PeoplePickerProps {
    onItemsAdded: (persons: ReadWriteRecipientViewState[]) => void;
    onItemsRemoved: (person: ReadWriteRecipientViewState[]) => void;
    label: string;
    selectedItems: ReadWriteRecipientViewState[];
    useLeftLabel: boolean;
}

const PeoplePicker = (props: PeoplePickerProps) => {
    const { onItemsAdded, onItemsRemoved, label, selectedItems, useLeftLabel } = props;

    const fieldContainerLabel = useLeftLabel
        ? styles.peoplePickerContainerLeft
        : styles.peoplePickerContainerAbove;

    const PEOPLEPICKER_ID = `${label}-PICKER-ID`;

    return (
        <div className={fieldContainerLabel}>
            <Label
                styles={{ root: styles.peoplePickerLabel }}
                htmlFor={PEOPLEPICKER_ID}
                title={label}>
                {label}
            </Label>
            <RecipientWell
                convertInitialItemsToWellItems={convertInitialItemsToWellItems}
                defaultSelectedItems={selectedItems}
                draggableItemType={DraggableItemTypes.ReadWriteRecipient}
                editingRecipientInputClassName={styles.editingRecipientInputClassName}
                enableSingleSelection={false}
                peoplePickerClassName={styles.recipientPicker}
                recipientType={RecipientType.To}
                selectedItems={selectedItems}
                wellClassName={styles.recipientPickerWell}
                onItemsAdded={onItemsAdded}
                onItemsRemoved={onItemsRemoved}
                onItemEdited={onItemEdited}
                containerClassName={styles.peoplePickerContainer}
                inputProps={{ id: PEOPLEPICKER_ID }}
                scenario="AdvancedSearch"
            />
        </div>
    );
};

const convertInitialItemsToWellItems = (
    items: ReadWriteRecipientViewState[]
): ReadWriteRecipientViewState[] => {
    return items;
};

const onItemEdited = (
    oldPerson: ReadWriteRecipientViewState,
    newPerson: ReadWriteRecipientViewState
) => {
    editPersonsAdvancedSearch(oldPerson, newPerson);
};

export default PeoplePicker;
