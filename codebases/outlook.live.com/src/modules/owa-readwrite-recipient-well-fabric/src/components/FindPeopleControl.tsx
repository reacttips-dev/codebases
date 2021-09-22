import { observer } from 'mobx-react-lite';
import * as React from 'react';
import type FindControlViewState from 'owa-recipient-types/lib/types/FindControlViewState';
import getFloatingPickerProps from '../utils/getFloatingPickerProps';
import tryForceResolve from '../utils/tryForceResolve';
import updateQueryString from '../actions/updateQueryString';
import type {
    IPeopleFloatingPickerProps,
    FloatingPeoplePicker,
} from '@fluentui/react/lib/FloatingPicker';
import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';
import type { ITheme } from '@fluentui/style-utilities';
import CommonFindControl from 'owa-readwrite-common-well/lib/components/CommonFindControl';

export interface FindPeopleControlProps {
    viewState: FindControlViewState;
    onItemSelected: (item: FindRecipientPersonaType) => void;
    focusAutomatically: boolean;
    openPickerAutomatically: boolean;
    className?: string;
    inputAriaLabel?: string;
    onInputChanged?: (value: string) => void;
    onPaste?: (value: string) => void;
    onBlur?: () => void;
    onInputKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    theme?: ITheme;
    onPickerHidden?: () => void;
    editingRecipientInputClassName?: string;
    placeholder?: string;
    scenario?: string;
}

export interface FindPeopleControlHandle {
    focus(): void;
    clearInput(): void;
    showPicker(): void;
    hidePicker(): void;
    getFloatingPicker(): FloatingPeoplePicker;
}

export default observer(
    function FindPeopleControl(
        props: FindPeopleControlProps,
        ref: React.Ref<FindPeopleControlHandle>
    ) {
        const findControl = React.useRef<CommonFindControl>(null);
        const focus = () => {
            findControl.current.focus();
        };
        const clearInput = () => {
            findControl.current.clearInput();
        };
        const showPicker = () => {
            if (findControl.current) {
                findControl.current.showPicker();
            }
        };
        const hidePicker = () => {
            if (findControl.current) {
                findControl.current.hidePicker();
            }
        };
        const getFloatingPicker = () => {
            if (findControl.current) {
                return findControl.current.getFloatingPicker();
            }
            return null;
        };

        React.useImperativeHandle(
            ref,
            () => ({
                focus,
                clearInput,
                showPicker,
                hidePicker,
                getFloatingPicker,
            }),
            []
        );

        const getPickerProps = (): IPeopleFloatingPickerProps => {
            return getFloatingPickerProps(
                getViewState,
                getFloatingPicker,
                true /*controlledComponent*/,
                props.theme,
                props.onPickerHidden,
                props.scenario
            );
        };
        const onOpenPickerAutomatically = () => {
            if (props.viewState.inForceResolve) {
                tryForceResolve(getViewState, findControl.current.getFloatingPicker());
            } else {
                showPicker();
            }
        };
        const getViewState = (): FindControlViewState => {
            return props.viewState;
        };
        const onInputChanged = (value: string) => {
            updateQueryString(props.viewState, value);
            if (props.onInputChanged) {
                props.onInputChanged(value);
            }
        };
        return (
            <CommonFindControl
                ref={findControl}
                className={props.className}
                inputAriaLabel={props.inputAriaLabel}
                inputClassName={props.editingRecipientInputClassName}
                onBlur={props.onBlur}
                onPaste={props.onPaste}
                defaultVisibleQueryString={getViewState().queryString}
                onInputKeyDown={props.onInputKeyDown}
                getPickerProps={getPickerProps}
                onInputChanged={onInputChanged}
                suggestionItems={props.viewState.findResultSet.slice()}
                onItemSelected={props.onItemSelected}
                theme={props.theme}
                onOpenPickerAutomatically={onOpenPickerAutomatically}
                focusAutomatically={props.focusAutomatically}
                openPickerAutomatically={props.openPickerAutomatically}
                placeholder={props.placeholder}
            />
        );
    },
    { forwardRef: true }
);
