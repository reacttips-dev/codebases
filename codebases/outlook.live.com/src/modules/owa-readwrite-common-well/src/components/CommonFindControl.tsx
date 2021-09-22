import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    IPeopleFloatingPickerProps,
    FloatingPeoplePicker,
} from '@fluentui/react/lib/FloatingPicker';
import { observer } from 'mobx-react';
import { Autofill } from '@fluentui/react/lib';
import { isBrowserIE } from 'owa-user-agent';
import type { ITheme } from '@fluentui/style-utilities';

import styles from './CommonFindControl.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface CommonPickerProps {
    onItemSelected: (item: any) => void;
    focusAutomatically: boolean;

    /** if true the picker will open automatially when rendered.
     * it will call onOpenPickerAutomatically if provided or showPicker if no handler is provided */
    openPickerAutomatically: boolean;

    getPickerProps: () => IPeopleFloatingPickerProps;
    className?: string;
    inputClassName?: string;
    inputAriaLabel?: string;
    placeholder?: string;
    defaultVisibleQueryString: string;
    suggestionItems?: any[];
    onInputChanged?: (value: string) => void;
    onPaste?: (value: string) => void;
    onInputFocus?: () => void;
    onBlur?: () => void;
    onInputKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;

    /** the optional hander to execute if the picker is in openPickerAutomatically mode. the default behavior is to show the picker */
    onOpenPickerAutomatically?: () => void;

    theme?: ITheme;
}

/**
 * This is the find location control that includes the input control and the locations picker based on the fabric people picker
 */
@observer
export default class CommonFindControl extends React.Component<CommonPickerProps, {}> {
    private picker: FloatingPeoplePicker;
    private input: Autofill;
    private inputElement: HTMLElement;

    public focus = () => {
        this.input.focus();
    };

    public clearInput = () => {
        this.input.clear();
    };

    public showPicker = () => {
        if (this.picker) {
            this.picker.showPicker(true /*updateValue*/);
        }
    };

    public hidePicker = () => {
        if (this.picker) {
            this.picker.hidePicker();
        }
    };

    private onQueryStringChanged = (value: string) => {
        if (this.picker) {
            this.picker.onQueryStringChanged(value);
        }
    };

    public getFloatingPicker = () => {
        return this.picker;
    };

    public getInput = () => {
        return this.input;
    };

    render() {
        let props = this.props.getPickerProps();
        const activeDescendant =
            this.picker && this.picker.currentSelectedSuggestionIndex !== -1
                ? 'sug-' + this.picker.currentSelectedSuggestionIndex
                : undefined;
        const isExpanded = this.picker ? this.picker.isSuggestionsShown : false;
        return (
            <div className={this.props.className}>
                <Autofill
                    className={classNames(
                        'ms-BasePicker-input',
                        styles.input,
                        this.props.inputClassName
                    )}
                    aria-label={this.props.inputAriaLabel}
                    aria-activedescendant={activeDescendant}
                    aria-owns={isExpanded ? 'suggestion-list' : undefined}
                    ref={this.getInputRef}
                    onClick={this.onClick}
                    onInputValueChange={this.onInputChanged}
                    onFocus={this.props.onInputFocus}
                    onPaste={this.onPaste}
                    onBlur={this.onBlurIfPossible()}
                    defaultVisibleValue={this.props.defaultVisibleQueryString}
                    onKeyDown={this.onInputKeyDown}
                    placeholder={this.props.placeholder}
                />
                <FloatingPeoplePicker
                    {...props}
                    componentRef={this.getPickerRef}
                    inputElement={this.input ? this.input.inputElement : null}
                    onChange={this.onItemSelected}
                    suggestionItems={this.props.suggestionItems}
                />
            </div>
        );
    }

    private onItemSelected = (item: any) => {
        this.props.onItemSelected(item); // handle the item selected
        this.input.clear();
        this.hidePicker();
    };

    private onInputChanged = (value: string) => {
        if (this.props.onInputChanged) {
            this.props.onInputChanged(value);
        }

        this.onQueryStringChanged(this.input.value);
    };

    private onPaste = (ev: React.ClipboardEvent<Autofill | HTMLInputElement>) => {
        if (this.props.onPaste) {
            const inputText = ev.clipboardData.getData('Text');
            ev.preventDefault();
            this.props.onPaste(inputText);
        }
    };

    private onBlurIfPossible = () => {
        if (isBrowserIE()) {
            // If the browser is IE, then onBlur does not work correctly, so don't attach the handler for onBlur
            return null;
        }

        return (ev: React.FocusEvent<Autofill | HTMLInputElement>) => {
            if (!isBrowserIE()) {
                this.onBlur(ev.relatedTarget, false /*isIE*/);
            }
        };
    };

    /**
     * focusOut handler that is attached in case we are using IE since onBlur does not return relatedTarget for IE
     */
    private focusOut = (ev: FocusEvent) => {
        this.onBlur(ev.relatedTarget as HTMLElement, true /*isIE*/);
    };

    /**
     * onBlur handler
     */
    private onBlur = (target: EventTarget, isIE: boolean) => {
        const relatedTarget = target as HTMLElement;
        // If an onBlur handler is given
        // And the relatedTarget is null OR the target is not a suggestion item
        // Call the onBlur handler
        const headers = document.getElementById('suggestionHeader-list');
        const footers = document.getElementById('suggestionFooter-list');
        // the suggestion item to be removed
        const dismissButton =
            document.getElementsByClassName('ms-Suggestions-closeButton') &&
            document.getElementsByClassName('ms-Suggestions-closeButton')[0];

        // If the browser is IE or tab index of header/footer is 0, the target is the child component actually being clicked (say the footer span),
        // while in other scenarios the target is the callout of the picker
        if (
            this.props.onBlur &&
            (!relatedTarget ||
                (relatedTarget.className.indexOf('ms-Suggestions-itemButton') === -1 &&
                    relatedTarget.className.indexOf('ms-Suggestions-sectionButton') === -1 &&
                    (!dismissButton ||
                        relatedTarget.className.indexOf(dismissButton.className) === -1) &&
                    (!footers ||
                        (isIE || relatedTarget.tabIndex == 0
                            ? !footers.contains(relatedTarget)
                            : !relatedTarget.contains(footers))) &&
                    (!headers ||
                        (isIE || relatedTarget.tabIndex == 0
                            ? !headers.contains(relatedTarget)
                            : !relatedTarget.contains(headers))) &&
                    (!dismissButton ||
                        (isIE || relatedTarget.tabIndex == 0
                            ? !dismissButton.contains(relatedTarget)
                            : !relatedTarget.contains(dismissButton)))))
        ) {
            this.props.onBlur();
        }
    };

    private onClick = (ev: React.MouseEvent<Autofill | HTMLInputElement>) => {
        ev.preventDefault();
        ev.stopPropagation();
        this.showPicker();
    };

    private onInputKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (this.props.onInputKeyDown) {
            this.props.onInputKeyDown(ev);
        }
    };

    private getInputRef = (ref: any) => {
        if (!this.input) {
            // Need to rerender for the floating picker to pick up the input element ref
            this.input = ref;
            this.input.inputElement.value = this.props.defaultVisibleQueryString;
            this.forceUpdate(() => {
                if (this.props.openPickerAutomatically) {
                    if (this.props.onOpenPickerAutomatically) {
                        this.props.onOpenPickerAutomatically();
                    } else {
                        this.showPicker();
                    }
                }

                if (this.props.focusAutomatically) {
                    this.input.focus();
                }
            });
        }

        if (isBrowserIE()) {
            // If browser is IE, then attach the focusout event handler instead of onBlur
            // Currently, React doesn't support focusin/focusout events, so attaching/detaching the listeners manually
            if (this.inputElement) {
                this.inputElement.removeEventListener('focusout', this.focusOut);
            }

            //tslint:disable-next-line:react-strict-mode  Tracked by WI 78454
            this.inputElement = ReactDOM.findDOMNode(ref) as HTMLElement;

            if (this.inputElement) {
                this.inputElement.addEventListener('focusout', this.focusOut);
            }
        }
    };

    private getPickerRef = (ref: any) => {
        // people's getPickerProps need a ref to the floating picker, so we need to rerender for it to pick it up
        if (!this.picker) {
            this.picker = ref;
            this.forceUpdate();
        }
    };
}
