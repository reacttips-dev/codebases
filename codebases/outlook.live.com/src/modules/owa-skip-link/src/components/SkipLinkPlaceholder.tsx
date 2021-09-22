import { observer } from 'mobx-react-lite';
import * as React from 'react';
import type { IButton } from '@fluentui/react/lib/Button';
import type { ISkipLinkControl } from '../types/ISkipLinkControl';
import { SkipLinkControl } from '../lazyFunctions';

import styles from './SkipLinkPlaceholder.scss';

/**
 * The state for the skip link control
 */
export interface SkipLinkPlaceholderState {
    visible: boolean;
}

export interface SkipLinkPlaceholderHandle {
    focus(): void;
}

/**
 * A control for parsing landmark regions on a page and creating skip links to make tabbable shortcut buttons to jump to those regions.
 */
export default observer(
    function SkipLinkPlaceholder(props: {}, ref: React.Ref<SkipLinkPlaceholderHandle>) {
        // This is of type IButton | LazyComponent, but Typescript doesn't recognize the skipLinkControl's ref return as a LazyComponent, so declaring explicitly as any
        const defaultButtonRef = React.useRef<IButton>();
        const skipLinkControlRef = React.useRef<React.RefObject<ISkipLinkControl>>(
            React.createRef()
        );
        const [visible, setVisible] = React.useState<boolean>(false);
        React.useImperativeHandle(
            ref,
            () => ({
                focus() {
                    if (skipLinkControlRef.current?.current?.focus) {
                        skipLinkControlRef.current.current.focus();
                    } else if (defaultButtonRef.current) {
                        defaultButtonRef.current.focus();
                    }
                },
            }),
            []
        );
        const defaultButtonComponentRefCallback = (component: any) => {
            defaultButtonRef.current = component;
        };
        const onFocus = () => {
            if (!visible) {
                setVisible(true);
            }
        };
        // put a fake element until other items can be registered on focus
        // this allows the browser to recognize this region as tabbable so the onFocus method can fire when tabbed into
        // bug 24555: Safari won't focus a button if there's no content inside of it so we'll drop some fake text inside (which is invisible)
        // until the user focuses for the first time
        if (visible) {
            return <SkipLinkControl ref={skipLinkControlRef.current} />;
        }
        return (
            <button
                key="default"
                onFocus={onFocus}
                className={styles.button}
                ref={defaultButtonComponentRefCallback}>
                placeholder text
            </button>
        );
    },
    { forwardRef: true }
);
