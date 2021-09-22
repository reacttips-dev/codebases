import { observer as observerLite } from 'mobx-react-lite';
import * as React from 'react';
import { CommandBar, ICommandBarProps } from '@fluentui/react/lib/CommandBar';
import { CommandBarButton, IButtonProps, IButtonStyles } from '@fluentui/react/lib/Button';
import { computed } from 'mobx';
import { DisplayOption, FilterableCommandBarItem } from './FilterableMenuItem';
import { observer } from 'mobx-react';
import { getPalette } from 'owa-theme';
import * as styles from './FilterableCommandBar.scss';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getIsDarkTheme } from 'owa-fabric-theme';
import { IContextualMenuProps } from '@fluentui/react/lib/ContextualMenu';

import classNames from 'classnames';

export interface FilterableCommandBarProps extends Partial<ICommandBarProps> {
    className?: string;
    elipisisAriaLabel?: string; // Users of FilterableCommandBar should expect an overflow ellipsis and should define a proper AriaLabel for it
    customMenuIconColor?: string;
    filterableItems: FilterableCommandBarItem[];
    style?: React.CSSProperties;
    onOverflowMenuVisibilityChanged?: (isOpen: boolean) => void; // Only pass in this function if you want the overflow perf optimization, must also pass isOverflowMenuOpen prop as well
    isOverflowMenuOpen?: boolean;
    isMailModule?: boolean;
    overflowMenuProps?: Partial<IContextualMenuProps>;
}

function getFilterableCommandBarButtonDefaultStyles(isMailModule?: boolean) {
    const hasNeutralText = isFeatureEnabled('mon-tri-commandbarStyling');
    const FilterableCommandBarButtonDefaultStyles: IButtonStyles = {
        root: classNames(
            styles.commandBarButton,
            hasNeutralText && styles.neutralTextColor,
            !(isFeatureEnabled('mon-densities') && isMailModule) && styles.commandBarButtonShape
        ),
        rootDisabled: getIsDarkTheme() ? styles.disabledInDarkMode : styles.disabled,
        rootExpanded: styles.expanded,
        icon: styles.icon,
        iconDisabled: getIsDarkTheme() ? styles.disabledInDarkMode : styles.disabled,
        iconExpanded: styles.expanded,
        menuIconDisabled: styles.disabled,
        menuIconExpanded: styles.expanded,
        menuIcon: hasNeutralText ? styles.menuIcon : null,
    };
    return FilterableCommandBarButtonDefaultStyles;
}

@observer
export default class FilterableCommandBar extends React.Component<FilterableCommandBarProps, {}> {
    private onMenuOpened = () => {
        this.props.onOverflowMenuVisibilityChanged!(true);
    };

    private onMenuDismissed = () => {
        this.props.onOverflowMenuVisibilityChanged!(false);
    };

    @computed.struct
    private get validLeftItems(): FilterableCommandBarItem[] {
        return this.props.filterableItems
            ? this.props.filterableItems.filter(
                  item => !item.shouldShow || item.shouldShow(DisplayOption.Left)
              )
            : [];
    }

    @computed.struct
    private get validRightItems(): FilterableCommandBarItem[] {
        return this.props.filterableItems
            ? this.props.filterableItems.filter(item => item.shouldShow?.(DisplayOption.Right))
            : [];
    }

    // Get overflow menu items. We are doing a perf optimization here so the command bar does not
    // rerender if an overflow item changes (that user does not see). To do this, we keep a dummy item
    // in the overflow that doesn't change and only add the real items when needed (when menu is opened).
    @computed.struct
    private get validOverflowItems(): FilterableCommandBarItem[] | undefined {
        const { isOverflowMenuOpen, filterableItems } = this.props;
        if (filterableItems) {
            const overflowItems = filterableItems.filter(item =>
                item.shouldShow?.(DisplayOption.Overflow)
            );
            // Only return overflow items if there are items in the overflow
            if (overflowItems.length > 0) {
                // If caller does not want the perf optimization always return overflow items
                // If caller wants the perf optimization and overflow is open, return overflow items
                if (isOverflowMenuOpen == null || isOverflowMenuOpen) {
                    return overflowItems;
                }

                // If caller wants the perf optimization and overflow is closed, return a dummy item
                // so that the overflow button is shown
                return [{ key: 'dummyItem', text: '' }];
            }
        }

        // Return undefined when there are no items to show in the overflow
        return undefined;
    }

    private FilterableCommandBarButton = observerLite((props: IButtonProps) => {
        const overflowRef = React.createRef<any>();
        const onAfterMenuDismiss = () => {
            overflowRef?.current?.focus();
        };
        return (
            <CommandBarButton
                {...props}
                styles={{
                    ...props.styles,
                    menuIcon: styles.menuIcon,
                    ...getFilterableCommandBarButtonDefaultStyles(this.props.isMailModule),
                }}
                componentRef={overflowRef}
                onAfterMenuDismiss={onAfterMenuDismiss}
            />
        );
    });

    private CustomFilterableCommandBarButton = observerLite((props: IButtonProps) => {
        const overflowRef = React.createRef<any>();
        const onAfterMenuDismiss = () => {
            overflowRef?.current?.focus();
        };
        const customStyles = getFilterableCommandBarButtonDefaultStyles(this.props.isMailModule);
        return (
            <CommandBarButton
                {...props}
                styles={{
                    ...props.styles,
                    ...customStyles,
                }}
                componentRef={overflowRef}
                onAfterMenuDismiss={onAfterMenuDismiss}
            />
        );
    });

    render() {
        const {
            elipisisAriaLabel,
            customMenuIconColor,
            overflowButtonProps,
            styles: stylesFromProps,
            overflowMenuProps,
            ...otherProps
        } = this.props;
        const menuIconButtonProps = {
            ariaLabel: elipisisAriaLabel,
            className: styles.overflowButton,
            styles: customMenuIconColor
                ? {
                      menuIcon: { color: customMenuIconColor + '!important' },
                  }
                : undefined,
            menuProps: this.props.onOverflowMenuVisibilityChanged
                ? {
                      onMenuOpened: this.onMenuOpened,
                      onMenuDismissed: this.onMenuDismissed,
                      items: [],
                      ...overflowMenuProps,
                  }
                : overflowMenuProps
                ? {
                      items: [],
                      ...overflowMenuProps,
                  }
                : undefined,
            ...overflowButtonProps,
        };
        const menuIconButton = customMenuIconColor
            ? this.CustomFilterableCommandBarButton
            : this.FilterableCommandBarButton;

        return (
            <CommandBar
                items={this.validLeftItems}
                farItems={this.validRightItems}
                overflowItems={this.validOverflowItems}
                overflowButtonProps={menuIconButtonProps}
                buttonAs={this.FilterableCommandBarButton}
                overflowButtonAs={menuIconButton}
                styles={{
                    root: {
                        paddingLeft: '0',
                        background: getPalette().neutralLighter,
                    },
                    primarySet: {
                        'align-items': 'center',
                    },
                    ...stylesFromProps,
                }}
                {...otherProps}
            />
        );
    }
}
