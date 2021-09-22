import * as React from 'react';
import KeyboardCharCodes from 'owa-hotkeys/lib/utils/keyboardCharCodes';
import { isCurrentCultureRightToLeft } from 'owa-localize';
import { IconButton } from '@fluentui/react/lib/Button';
import { ControlIcons } from 'owa-control-icons';
import setCommonWellItemSelectedState from '../actions/setCommonWellItemSelectedState';
import setShouldBlockSelection from '../actions/setShouldBlockSelection';
import setContextMenuVisibility from '../actions/setContextMenuVisibility';
import type ReadWriteCommonWellItemViewState from '../store/schema/ReadWriteCommonWellItemViewState';
import type {
    ReadWriteCommonWellItemProps,
    ReadWriteCommonWellItemStyles,
} from './ReadWriteCommonWellItem.types';
import { isBrowserChrome, isMac } from 'owa-user-agent/lib/userAgent';

import classNames from 'classnames';
const RIGHT_CLICK_BUTTONCODE = 2;

export default abstract class ReadWriteCommonWellItem<
    TState extends ReadWriteCommonWellItemViewState,
    TProps extends ReadWriteCommonWellItemProps<TState>
> extends React.Component<TProps, TState> {
    protected personaSpan: React.RefObject<HTMLSpanElement> = React.createRef();
    protected focusWrapper: HTMLElement;
    protected classNames: { [key in keyof ReadWriteCommonWellItemStyles]: string };
    protected wellItemBox: HTMLElement;

    //Context menu events
    protected onContextMenu = (ev: React.MouseEvent<HTMLSpanElement>) => {
        if (this.props.useContextMenu) {
            // Stop propagation to ensure we dont trigger unwanted behavior
            ev.stopPropagation();
            ev.preventDefault();

            setContextMenuVisibility(this.props.viewState, true);
            setShouldBlockSelection(this.props.viewState, false);
        }
    };

    protected onDismissContextMenu = (ev: React.MouseEvent<HTMLSpanElement>) => {
        ev.stopPropagation();
        setContextMenuVisibility(this.props.viewState, false);
    };

    protected removeItem = (ev: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
        // Stop propagation to ensure we dont trigger unwanted behavior
        ev.stopPropagation();
        ev.preventDefault();

        setCommonWellItemSelectedState(this.props.viewState, false /* isSelected */);
        this.props.removeOperation(this.props.viewState);
    };

    //Render section functions
    protected abstract getPersonaControl: () => JSX.Element;

    // Disable TSLint rule to work around https://github.com/microsoft/TypeScript/issues/33855
    // tslint:disable-next-line:use-arrow-functions-for-react-bound-methods
    protected getLeadingElement = (): JSX.Element => {
        return null;
    };

    // Disable TSLint rule to work around https://github.com/microsoft/TypeScript/issues/33855
    // tslint:disable-next-line:use-arrow-functions-for-react-bound-methods
    protected getContextMenu = (): JSX.Element => {
        return null;
    };

    /**
     * Gets the display text from the item
     */
    // Disable TSLint rule to work around https://github.com/microsoft/TypeScript/issues/33855
    // tslint:disable-next-line:use-arrow-functions-for-react-bound-methods
    protected getDisplayTextFromItem = (item: TState): string => {
        return null;
    };

    protected abstract getCustomizedClassName: () => {
        [key in keyof ReadWriteCommonWellItemStyles]: string;
    };

    // Disable TSLint rule to work around https://github.com/microsoft/TypeScript/issues/33855
    // tslint:disable-next-line:use-arrow-functions-for-react-bound-methods
    protected copyItemContent = () => {
        return null;
    };

    protected getWellItemContent = () => {
        return (
            <div
                className={this.classNames.wellItemBox}
                ref={ref => (this.wellItemBox = ref)}
                onFocusCapture={this.onFocusCapture}
                onBlur={this.onFocusOut}
                onMouseOut={this.onFocusOut}>
                {this.getLeadingElement()}
                <span
                    className={classNames(this.classNames.wellItem)}
                    ref={this.personaSpan}
                    tabIndex={-1} // We want it programatically focusable but not a tab stop.
                    onMouseDown={this.onMouseDown}
                    onBlur={this.onBlur}
                    onFocus={this.onFocus}
                    onContextMenu={this.onContextMenu}
                    role="button"
                    aria-haspopup="true">
                    {this.getPersonaControl()}
                    {!this.props.viewState.blockWellItemRemoval && (
                        <IconButton
                            data-is-focusable={false}
                            onClick={this.removeItem}
                            iconProps={{
                                iconName: ControlIcons.Cancel,
                            }}
                            styles={{
                                root: this.classNames.removeWellItemButton,
                                rootHovered: this.classNames.actionButtonHovered,
                                rootPressed: this.classNames.actionButtonPressed,
                                icon: this.classNames.actionButtonIcon,
                            }}
                            title={this.getStringForRemoveButton()}
                            aria-label={this.getStringForRemoveButton()}
                        />
                    )}
                    {this.getContextMenu()}
                </span>
            </div>
        );
    };

    //This function is a wrapper for customized render function.
    protected getRenderResult = () => {
        return this.getWellItemContent();
    };

    //Component life cycle event
    componentDidMount() {
        this.setFocusIfSelected();
    }

    componentDidUpdate() {
        this.setFocusIfSelected();
    }

    //Key & mouse action events
    private onFocus = (ev: React.FocusEvent<HTMLSpanElement>) => {
        if (!this.props.viewState.shouldBlockSelection) {
            setCommonWellItemSelectedState(this.props.viewState, true);
        }
    };

    // these two methods handles the situation when focus is actually inside the item but not on the item
    // so that it can still has the same styling/behavior as the focus/active is on the item
    // Disable TSLint rule to work around https://github.com/microsoft/TypeScript/issues/33855
    // tslint:disable-next-line:use-arrow-functions-for-react-bound-methods
    protected onFocusCapture = () => {};

    // Disable TSLint rule to work around https://github.com/microsoft/TypeScript/issues/33855
    // tslint:disable-next-line:use-arrow-functions-for-react-bound-methods
    protected onFocusOut = () => {};

    /**
     * Gets whether the item can be dragged
     */
    // Disable TSLint rule to work around https://github.com/microsoft/TypeScript/issues/33855
    // tslint:disable-next-line:use-arrow-functions-for-react-bound-methods
    protected getCanDragItem = (item: TState): boolean => {
        return false;
    };

    private onBlur = (ev: React.FocusEvent<HTMLSpanElement>) => {
        setCommonWellItemSelectedState(this.props.viewState, false);
    };

    private setFocusIfSelected() {
        if (this.props.viewState.isSelected) {
            if (this.personaSpan.current) {
                this.personaSpan.current.focus();
            } else {
                setTimeout(() => {
                    throw new Error(
                        'Persona span not bound in readWriteCommonWellItem on setFocusIfSelected'
                    );
                }, 0);
            }
        }
    }

    protected onKeyDown = (ev: React.KeyboardEvent<HTMLSpanElement>) => {
        switch (ev.keyCode) {
            case KeyboardCharCodes.Backspace:
                ev.stopPropagation();
                if (!this.props.viewState.blockWellItemRemoval) {
                    this.props.removeOperation(this.props.viewState);
                }
                return;
            case KeyboardCharCodes.Delete:
                ev.stopPropagation();
                if (!this.props.viewState.blockWellItemRemoval) {
                    this.props.removeOperation(this.props.viewState, true /* selectToRight */);
                }
                return;
            case KeyboardCharCodes.Left_arrow:
                if (this.props.focusNextOperation) {
                    ev.stopPropagation();
                    this.props.focusNextOperation(
                        this.props.viewState,
                        isCurrentCultureRightToLeft() ? 1 : -1
                    );
                }
                return;
            case KeyboardCharCodes.Right_arrow:
                if (this.props.focusNextOperation) {
                    ev.stopPropagation();
                    this.props.focusNextOperation(
                        this.props.viewState,
                        isCurrentCultureRightToLeft() ? -1 : 1
                    );
                }
                return;
            case KeyboardCharCodes.C:
                // chrome has an error with when the selection element and focus element are not the
                // same element onCopy won't fire on the selection element. This is a work arround
                // for the issue
                if (isBrowserChrome()) {
                    if ((isMac() && ev.metaKey) || ev.ctrlKey) {
                        this.copyItemContent();
                    }
                }
                return;
            case KeyboardCharCodes.Tab:
                if (!ev.shiftKey && this.props.focusNextOperation) {
                    ev.preventDefault();
                    this.props.focusNextOperation(
                        this.props.viewState,
                        isCurrentCultureRightToLeft() ? -1 : 1
                    );
                }
                return;
        }
    };

    private onMouseDown = (ev: React.MouseEvent<HTMLSpanElement>) => {
        if (this.props.useContextMenu) {
            ev.stopPropagation();
            if (
                ev.button == RIGHT_CLICK_BUTTONCODE &&
                this.props.viewState.isContextMenuOpen == false
            ) {
                setShouldBlockSelection(this.props.viewState, true);
            }
        }
    };

    protected abstract renderWellItem: () => any;

    // String used for the title and aria-label of the Remove button
    // on the rendered pill
    protected abstract getStringForRemoveButton: () => any;

    render() {
        this.classNames = this.getCustomizedClassName();
        return this.renderWellItem();
    }
}
