import type { ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import type { IIconProps } from '@fluentui/react/lib/Icon';
import type { IRenderFunction } from '@fluentui/utilities';
import type { ShouldShowBehavior } from './ShouldShowBehavior';
import type {
    IContextualMenuItem,
    IContextualMenuProps,
    IContextualMenuItemProps,
    IContextualMenuRenderItem,
} from '@fluentui/react/lib/ContextualMenu';
import { IButtonStyles } from '@fluentui/react/lib/Button';

import type { ReadActionKey } from 'owa-outlook-service-options';
import type * as React from 'react';

export const enum DisplayOption {
    Left,
    Right,
    Overflow,
}

/**
 * During minification, object property names don't get minified at all. So we
 * have this enum to stand in for property names so the minification works (enums are just numbers)
 */
export const enum FilterableMenuItemArgs {
    name,
    icon,
    onClick,
    shouldShow,
    displayOption,
    disabled,
    menuContent,
    id,
    key,
    onRender,
    checked,
    ariaLabel,
    title,
    className,
    canCheck,
    iconOnly,
    onRenderIcon,
    href,
    cacheKey,
    split,
    subMenuProps,
    componentRef,
    buttonStyles,
}

export interface FilterableCommandBarItem extends ICommandBarItemProps {
    shouldShow?: (displayOption?: DisplayOption) => boolean;
}

export interface FilterableMenuItemParameter {
    [FilterableMenuItemArgs.name]?: string;
    [FilterableMenuItemArgs.icon]?: string;
    [FilterableMenuItemArgs.onClick]?: (ev?: any, item?: IContextualMenuItem) => void;
    [FilterableMenuItemArgs.shouldShow]?: ShouldShowBehavior;
    [FilterableMenuItemArgs.displayOption]?: DisplayOption;
    [FilterableMenuItemArgs.disabled]?: boolean;
    [FilterableMenuItemArgs.menuContent]?: IContextualMenuItem[] | IContextualMenuProps;
    [FilterableMenuItemArgs.id]?: string;
    [FilterableMenuItemArgs.key]?: string;
    [FilterableMenuItemArgs.onRender]?: (
        item: any,
        dismissMenu: (ev?: any, dismissAll?: boolean) => void
    ) => React.ReactNode;
    [FilterableMenuItemArgs.checked]?: boolean;
    [FilterableMenuItemArgs.ariaLabel]?: string;
    [FilterableMenuItemArgs.title]?: string;
    [FilterableMenuItemArgs.className]?: string;
    [FilterableMenuItemArgs.canCheck]?: boolean;
    [FilterableMenuItemArgs.iconOnly]?: boolean;
    [FilterableMenuItemArgs.onRenderIcon]?: IRenderFunction<IContextualMenuItemProps>;
    [FilterableMenuItemArgs.href]?: string;
    [FilterableMenuItemArgs.cacheKey]?: string;
    [FilterableMenuItemArgs.split]?: boolean;
    [FilterableMenuItemArgs.subMenuProps]?: IContextualMenuProps;
    [FilterableMenuItemArgs.componentRef]?: React.RefObject<IContextualMenuRenderItem>;
    [FilterableMenuItemArgs.buttonStyles]?: IButtonStyles;
}

export default class FilterableMenuItem implements FilterableCommandBarItem {
    public className?: string;
    public disabled?: boolean;
    public iconProps: IIconProps | undefined;
    public subMenuProps?: IContextualMenuProps;
    public id: string | undefined;
    public key: string;
    public name: string | undefined;
    public cacheKey: string | undefined;
    public onClick: ((ev?: any, item?: IContextualMenuItem) => void) | undefined;
    public onRender?: (
        item: any,
        dismissMenu: (ev?: any, dismissAll?: boolean) => void
    ) => React.ReactNode;
    public checked?: boolean; // Note: canCheck must be true for this to take effect.
    public ariaLabel?: string;
    public title?: string;
    public canCheck?: boolean;
    public iconOnly?: boolean;
    public onRenderIcon?: IRenderFunction<IContextualMenuItemProps>;
    public href?: string;
    public target?: string;
    public split?: boolean;
    public subMenuKeys?: ReadActionKey[];
    public componentRef?: React.RefObject<IContextualMenuRenderItem>;
    public buttonStyles?: IButtonStyles;

    private displayOption: DisplayOption;
    private shouldShowBehavior: ShouldShowBehavior;

    constructor(props: FilterableMenuItemParameter) {
        const {
            [FilterableMenuItemArgs.name]: name,
            [FilterableMenuItemArgs.icon]: icon,
            [FilterableMenuItemArgs.onClick]: onClick,
            [FilterableMenuItemArgs.shouldShow]: shouldShow,
            [FilterableMenuItemArgs.displayOption]: displayOption,
            [FilterableMenuItemArgs.disabled]: disabled,
            [FilterableMenuItemArgs.menuContent]: menuContent,
            [FilterableMenuItemArgs.id]: id,
            [FilterableMenuItemArgs.key]: key,
            [FilterableMenuItemArgs.onRender]: onRender,
            [FilterableMenuItemArgs.checked]: checked,
            [FilterableMenuItemArgs.ariaLabel]: ariaLabel,
            [FilterableMenuItemArgs.title]: title,
            [FilterableMenuItemArgs.className]: className,
            [FilterableMenuItemArgs.canCheck]: canCheck,
            [FilterableMenuItemArgs.iconOnly]: iconOnly,
            [FilterableMenuItemArgs.onRenderIcon]: onRenderIcon,
            [FilterableMenuItemArgs.href]: href,
            [FilterableMenuItemArgs.cacheKey]: cacheKey,
            [FilterableMenuItemArgs.split]: split,
            [FilterableMenuItemArgs.subMenuProps]: subMenuProps,
            [FilterableMenuItemArgs.componentRef]: componentRef,
            [FilterableMenuItemArgs.buttonStyles]: buttonStyles,
        } = props;
        this.iconProps = icon ? { iconName: icon } : undefined;
        this.disabled = disabled;
        this.id = id;
        this.key = key || (name || '') + (icon || '');
        this.name = name;
        this.onClick = onClick;
        this.shouldShowBehavior = shouldShow || this.alwaysShow;
        this.displayOption = displayOption || DisplayOption.Left;
        this.onRender = onRender;
        this.checked = checked;
        this.ariaLabel = ariaLabel;
        this.title = title;
        this.className = className;
        this.canCheck = canCheck;
        this.iconOnly = iconOnly;
        this.onRenderIcon = onRenderIcon;
        this.href = href;
        this.split = split;
        this.subMenuProps = subMenuProps;
        this.componentRef = componentRef;
        this.cacheKey = cacheKey || undefined;
        this.buttonStyles = buttonStyles;

        if (this.href) {
            this.target = '_blank';
        }

        // In the event that respective information for the ariaLabel & title are not passed, the value of 'this.name' shall be used
        if (!this.ariaLabel) {
            this.ariaLabel = this.name;
        }

        /* if subMenuProps are not given, add the menuContent as a list of items or as context menu props
         * if subMenuProps are given, menuContent isn't used or needed since we will use items prop from subMenuProps inset value
         */
        if (menuContent && subMenuProps == undefined) {
            if (Array.isArray(menuContent)) {
                this.subMenuProps = { items: menuContent, gapSpace: 0 };
            } else {
                this.subMenuProps = menuContent;
            }
        }
    }

    public shouldShow(displayOption?: DisplayOption): boolean {
        if (displayOption != undefined) {
            // Command bar menu items require the specified display option
            return this.displayOption == displayOption && this.shouldShowBehavior();
        } else {
            // Otherwise show the menu item based on the specified show behavior
            return this.shouldShowBehavior();
        }
    }

    private alwaysShow(): boolean {
        return true;
    }
}
