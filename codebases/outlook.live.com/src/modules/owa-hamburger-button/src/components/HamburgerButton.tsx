import { toggleLeftPaneAriaLabel } from './HamburgerButton.locstring.json';
import { observer } from 'mobx-react-lite';
import { IButton, IconButton } from '@fluentui/react/lib/Button';
import { ControlIcons } from 'owa-control-icons';
import loc from 'owa-localize';
import * as React from 'react';
import type { LightningId } from 'owa-lightning-core-v2/lib/LightningId';
import { shouldShowLightningItem } from 'owa-lightning-v2/lib/utils/shouldShowLightningItem';
import { Overlay } from '@fluentui/react/lib/Overlay';
import { isFeatureEnabled } from 'owa-feature-flags';

import styles from './HamburgerButton.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface HamburgerButtonProps extends React.HTMLAttributes<HTMLDivElement> {
    isPaneExpanded: boolean;
    toggleHamburgerButton: () => void;
    onFreDismiss?: () => void;
    freButtonCustomClass?: string;
    lid?: LightningId;
}

export interface HamburgerHandle {
    focus(): void;
    openMenu(): void;
    dismissMenu(): void;
    getRef(): HTMLDivElement;
}

export const HamburgerButton = observer(
    function HamburgerButton(props: HamburgerButtonProps, ref: React.Ref<HamburgerHandle>) {
        // Button ref is being forwarded as a workaround for an A11Y issue in Calendar module
        // The correct fix (which will allow the ref forwarded to be removed) is being tracked on VSO #51744
        const buttonRef = React.useRef<IButton>(null);
        const divRef = React.useRef<HTMLDivElement>();

        // FRE experience is the lightning info callout that appears when the folder pane is automatically collapsed for the first time
        const showFREExperience = shouldShowLightningItem(props.lid);
        React.useImperativeHandle(ref, () => ({
            focus: () => {
                buttonRef.current.focus();
            },
            openMenu: () => {
                buttonRef.current.openMenu();
            },
            dismissMenu: () => {
                buttonRef.current.dismissMenu();
            },
            getRef: () => {
                return divRef.current;
            },
        }));

        const onOverlayClick = () => {
            if (props.onFreDismiss) {
                props.onFreDismiss();
            }
        };

        return (
            <div
                ref={divRef}
                className={classNames(
                    styles.hamburgerButtonWrapper,
                    isFeatureEnabled('mon-densities') && styles.hamburgerButtonWrapperNext
                )}>
                {showFREExperience && (
                    <Overlay
                        key={'overlay'}
                        className={styles.freOverlay}
                        isDarkThemed={true}
                        onClick={onOverlayClick}>
                        {renderIconButton(props, showFREExperience, buttonRef)}
                    </Overlay>
                )}
                {!showFREExperience && renderIconButton(props, showFREExperience, buttonRef)}
            </div>
        );
    },
    { forwardRef: true }
);

function renderIconButton(
    props: HamburgerButtonProps,
    showFREExperience: boolean,
    buttonRef: React.Ref<IButton>
) {
    const { isPaneExpanded, toggleHamburgerButton, freButtonCustomClass } = props;
    const fontSize = isFeatureEnabled('mon-densities') ? '14px' : 'auto';
    return (
        <IconButton
            key={'button'}
            checked={isPaneExpanded}
            className={classNames(
                styles.hamburgerButton,
                showFREExperience && freButtonCustomClass
            )}
            iconProps={{
                iconName: ControlIcons.GlobalNavButton,
                styles: { root: { fontSize: fontSize } },
            }}
            onClick={toggleHamburgerButton}
            title={loc(toggleLeftPaneAriaLabel)}
            ariaLabel={loc(toggleLeftPaneAriaLabel)}
            aria-expanded={isPaneExpanded}
            componentRef={buttonRef}
        />
    );
}
