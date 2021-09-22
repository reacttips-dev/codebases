import * as React from 'react';
import EditingReadWriteRecipient from './EditingReadWriteRecipient';
import ReadWriteRecipient from 'owa-readwrite-recipient-well/lib/components/ReadWriteRecipient';
import type { ReadWriteRecipientProps } from 'owa-readwrite-recipient-well/lib/components/ReadWriteRecipient.types';
import { observer } from 'mobx-react-lite';

const EditableReadWriteRecipient = observer(function EditableReadWriteRecipient(
    props: ReadWriteRecipientProps
) {
    const {
        viewState,
        inForceResolve,
        removeOperation,
        onEditingFinished,
        index,
        editingRecipientInputClassName,
    } = props;
    return viewState.isEditing ? (
        <EditingReadWriteRecipient
            recipient={viewState}
            onEditingFinished={onEditingFinished}
            removeOperation={removeOperation}
            inForceResolve={inForceResolve}
            editingRecipientInputClassName={editingRecipientInputClassName}
        />
    ) : (
        <ReadWriteRecipient
            key={`${viewState.persona.EmailAddress.EmailAddress}_${index}`}
            canEdit={true}
            showPresence={true}
            {...props}
        />
    );
});
export default EditableReadWriteRecipient;
