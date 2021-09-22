import { observer } from 'mobx-react-lite';
import { format } from 'owa-localize';
import { Icon } from '@fluentui/react/lib/Icon';
import { AriaProperties, AriaRoles, generateDomPropertiesForAria } from 'owa-accessibility';
import type { ControlIcons } from 'owa-control-icons';
import { deactivateCharm, getActiveCharm, HeaderCharmType, toggleCharm } from 'owa-header-store';
import type { HeaderPaneProps } from 'owa-bootstrap';

import * as React from 'react';

import classNames from 'classnames';
import styles from 'owa-header-common/lib/Header.scss';

export interface HeaderCharmProperties {
    ariaLabel: string;
    title?: string;
    className?: string;
    activeClassName?: string; // when the context menu is open
    icons: HeaderCharmIconProperties | HeaderCharmCustomContentProperties;
    behavior?: HeaderCharmFlexPaneBehavior | HeaderCharmControlledBehavior;
    getBadgeCount?: () => number;
    ariaLabelWithBadgeCount?: string;
}

export interface HeaderCharmIconProperties {
    iconName: ControlIcons;
    hoverIconName?: ControlIcons;
}

export interface HeaderCharmCustomContentProperties {
    charmContent: string | JSX.Element;
}

export interface HeaderCharmFlexPaneBehavior {
    charm: HeaderCharmType;
    paneComponent: React.ComponentType<HeaderPaneProps>;
}

export interface HeaderCharmControlledBehavior {
    onClick: () => void;
    isActive: boolean;
    content?: JSX.Element;
}

export default observer(
    function HeaderCharm(props: HeaderCharmProperties, ref: React.Ref<HTMLButtonElement>) {
        const CharmBehavior = {
            get() {
                const { behavior } = props;
                if (!behavior) {
                    return {
                        isActive: false,
                        charmOnClick: null,
                        hostedContent: null,
                    };
                }
                const controlledBehavior = behavior as HeaderCharmControlledBehavior;
                const flexPaneBehavior = behavior as HeaderCharmFlexPaneBehavior;
                const isActive =
                    controlledBehavior.isActive !== undefined
                        ? controlledBehavior.isActive
                        : flexPaneBehavior.charm === getActiveCharm();
                return {
                    isActive: isActive,
                    charmOnClick: controlledBehavior.onClick || onCharmClicked,
                    hostedContent:
                        controlledBehavior.content ||
                        (isActive && flexPaneBehavior.paneComponent && (
                            <flexPaneBehavior.paneComponent onDismiss={onDismiss} />
                        )),
                };
            },
        };
        const onCharmClicked = (evt: React.MouseEvent<unknown>) => {
            toggleCharm((props.behavior as HeaderCharmFlexPaneBehavior).charm);
        };
        const onDismiss = () => {
            deactivateCharm((props.behavior as HeaderCharmFlexPaneBehavior).charm);
        };
        const renderGlyph = (): JSX.Element | JSX.Element[] | string => {
            const iconProps = props.icons as HeaderCharmIconProperties;
            if (iconProps.iconName) {
                return [
                    <Icon
                        className={styles.suiteCharmIcon}
                        iconName={iconProps.iconName}
                        key="base"
                    />,
                    <Icon
                        className={styles.suiteHoverCharmIcon}
                        iconName={iconProps.hoverIconName || iconProps.iconName}
                        key="hover"
                    />,
                ];
            } else {
                const { charmContent } = props.icons as HeaderCharmCustomContentProperties;
                return charmContent;
            }
        };
        const behavior = CharmBehavior.get();
        const {
            getBadgeCount,
            className,
            title,
            ariaLabel,
            activeClassName,
            ariaLabelWithBadgeCount,
        } = props;
        const badgeCount = !!getBadgeCount ? getBadgeCount() : 0;
        const charmStyles = classNames(
            className,
            styles.charm,
            behavior.isActive && activeClassName,
            behavior.isActive && styles.charmActive
        );
        const ariaProps: AriaProperties = {
            role: AriaRoles.button,
            expanded: behavior.isActive,
            hasPopup: true,
            label:
                badgeCount > 0 && ariaLabelWithBadgeCount
                    ? format(ariaLabelWithBadgeCount, badgeCount)
                    : ariaLabel,
        };
        return (
            <button
                className={charmStyles}
                onClick={behavior.charmOnClick}
                title={title}
                data-is-focusable="true"
                ref={ref}
                {...generateDomPropertiesForAria(ariaProps)}>
                {renderGlyph()}
                {behavior.hostedContent}
                {badgeCount > 0 && <div className={styles.badgeCounter}>{badgeCount}</div>}
            </button>
        );
    },
    { forwardRef: true }
);
