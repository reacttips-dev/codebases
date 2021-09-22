import { isStringNullOrWhiteSpace } from 'owa-localize';
import FindPeopleControl from './FindPeopleControl';
import updateQueryString from '../actions/updateQueryString';
import populateFindControlInitialState, { FindControlStore } from '../store/store';
import { getReadWriteRecipientViewStateFromFindRecipientPersonaType } from 'owa-recipient-create-viewstate/lib/util/getReadWriteRecipientViewStateFromFindRecipientPersonaType';
import { observer } from 'mobx-react';
import setForceResolveState from 'owa-readwrite-recipient-well/lib/actions/setForceResolveState';
import updateIsEditing from 'owa-readwrite-recipient-well/lib/actions/updateIsEditing';
import type FindControlViewState from 'owa-recipient-types/lib/types/FindControlViewState';
import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';
import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import type CommonFindControl from 'owa-readwrite-common-well/lib/components/CommonFindControl';

import * as React from 'react';

import styles from './EditingReadWriteRecipient.scss';
export interface ReadWriteRecipientProps {
    recipient: ReadWriteRecipientViewState;
    onEditingFinished: (
        editedItem: ReadWriteRecipientViewState,
        newItem: ReadWriteRecipientViewState
    ) => void;
    removeOperation: (recipientToRemove: ReadWriteRecipientViewState) => void;
    inForceResolve: boolean;
    editingRecipientInputClassName?: string;
}
export interface ReadWriteRecipientState {
    findControlViewState: FindControlViewState;
}
@observer
export default class EditingReadWriteRecipient extends React.Component<
    ReadWriteRecipientProps,
    ReadWriteRecipientState
> {
    private findControl: CommonFindControl;
    private store: FindControlStore;

    constructor(props: ReadWriteRecipientProps) {
        super(props);
        this.store = populateFindControlInitialState();
        updateQueryString(this.store.viewState, props.recipient.displayText);
        setForceResolveState(this.store.viewState, props.inForceResolve);
    }

    render() {
        return (
            <FindPeopleControl
                ref={(ref: CommonFindControl) => (this.findControl = ref)}
                viewState={this.store.viewState}
                onItemSelected={this.onItemSelected}
                focusAutomatically={true}
                openPickerAutomatically={true}
                onBlur={this.onBlur}
                onInputChanged={this.onInputChanged}
                className={styles.findPeopleControl}
                editingRecipientInputClassName={this.props.editingRecipientInputClassName}
            />
        );
    }
    private onItemSelected = (item: FindRecipientPersonaType) => {
        if (item) {
            let newRecipient: ReadWriteRecipientViewState = getReadWriteRecipientViewStateFromFindRecipientPersonaType(
                item
            );

            this.props.onEditingFinished(this.props.recipient, newRecipient);
        }
    };

    private onInputChanged = (inputValue: string) => {
        if (isStringNullOrWhiteSpace(inputValue)) {
            this.props.removeOperation(this.props.recipient);
        }
    };
    private onBlur = () => {
        if (
            !isStringNullOrWhiteSpace(this.store.viewState.queryString) &&
            this.props.recipient.displayText !== this.store.viewState.queryString
        ) {
            this.findControl.getFloatingPicker().forceResolveSuggestion();
        } else {
            updateIsEditing(this.props.recipient, false /*isEditing*/);
        }
    };
}
