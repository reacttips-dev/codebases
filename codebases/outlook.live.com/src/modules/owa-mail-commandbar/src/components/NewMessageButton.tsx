import { newMailAction, newNoteAction } from '../strings.locstring.json';
import { newPostAction } from './NewMessageButton.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';

import { isLeftRailVisible } from 'owa-left-rail-utils/lib/isLeftRailVisible';
import { getMailMenuItemShouldDisable, MenuItemType } from 'owa-mail-filterable-menu-behavior';
import type { IButtonProps } from '@fluentui/react/lib/Button';
import isFeatureEnabled from 'owa-feature-flags/lib/utils/isFeatureEnabled';
import { ControlIcons } from 'owa-control-icons';
import type { IContextualMenuItem, IContextualMenuProps } from '@fluentui/react/lib/ContextualMenu';
import FluentCommandBarHeroButton from 'owa-fluent-commandbar/lib/FluentCommandBarHeroButton';
import { observer } from 'mobx-react-lite';
import { getDensityModeString } from 'owa-fabric-theme';
import { Module } from 'owa-workloads';
import { PartialTheme, ThemeProvider } from '@fluentui/react';
import { getNewMessageButtonTheme } from 'owa-mail-densities/lib/utils/getCommandBarTheme';
import { getYammerPublisherItemMenuOption } from '../utils/getYammerPublisherItemMenuOption';
import { default as Compose } from 'owa-fluent-icons-svg/lib/icons/ComposeRegular';

import styles from './NewMessageButton.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

type newMessageButtonProps = IButtonProps & {
    scenario: 'publicFolder' | 'notes' | 'default';
    elementRef?: (node: HTMLDivElement) => void;
    onClick?: () => void;
    onMouseOver?: () => void;
};

const NewMessageSplitButtonId = 'NewMessageSplitButtonId';

function getMenuProps(props?: newMessageButtonProps) {
    const fluentMenuProps: IContextualMenuProps = { items: [] };

    // New message menu item
    const newMessageMenuItem: IContextualMenuItem = {
        key: 'newMessage',
        text: getMenuText(props),
        iconProps: { iconName: ControlIcons.Edit },
        disabled: getMailMenuItemShouldDisable(MenuItemType.NewMessage),
        onClick: () => props?.onClick?.(),
        onMouseOver: () => props?.onMouseOver?.(),
    };

    fluentMenuProps.items.push(newMessageMenuItem);

    // Yammer menu item
    const yammerMenuItem: IContextualMenuItem | null = getYammerPublisherItemMenuOption(
        NewMessageSplitButtonId
    );
    if (yammerMenuItem) {
        fluentMenuProps.items.push(yammerMenuItem);
    }

    return fluentMenuProps;
}

function getMenuText(props?: newMessageButtonProps) {
    return props?.scenario == 'publicFolder'
        ? loc(newPostAction)
        : props?.scenario == 'notes'
        ? loc(newNoteAction)
        : loc(newMailAction);
}

export default observer(function NewMessageButton(props?: newMessageButtonProps) {
    const hasButtonWithIcon = isFeatureEnabled('mon-tri-commandbarStyling');
    const hasDensityNext = isFeatureEnabled('mon-densities');
    const dropDownMenuProps = getMenuProps(props);
    const hasDropDownMenu = dropDownMenuProps.items.length > 1;
    const densityModeString = getDensityModeString();
    const newMessageButtonProps: IButtonProps = {
        text: getMenuText(props),
        disabled: getMailMenuItemShouldDisable(MenuItemType.NewMessage),
        splitButtonMenuProps: hasDropDownMenu ? { id: NewMessageSplitButtonId } : undefined,
        iconProps: hasButtonWithIcon
            ? {
                  iconName: Compose,
                  styles: {
                      root: styles.newMessageButtonIcon,
                  },
              }
            : undefined,
    };

    let newMessageButtonTheme: PartialTheme | {} = {};
    if (hasDensityNext) {
        newMessageButtonTheme = getNewMessageButtonTheme(densityModeString, hasDropDownMenu);
    }
    return (
        <div
            ref={props?.elementRef}
            className={classNames(hasDropDownMenu && styles.newMessageButtonWithDropDown)}>
            <ThemeProvider applyTo="none" theme={newMessageButtonTheme}>
                <FluentCommandBarHeroButton
                    className={classNames(
                        isLeftRailVisible(Module.Mail) && styles.newMessageButtonPadding,
                        hasButtonWithIcon && styles.newMessageButtonWithIcon,
                        isFeatureEnabled('mon-tri-collapsibleFolderPane') &&
                            !hasDropDownMenu && // Dropdown menu styles apply differently due to fluent command bar hero button
                            styles.newMessageButtonMargins
                    )}
                    menuProps={hasDropDownMenu ? dropDownMenuProps : undefined}
                    {...newMessageButtonProps}
                    {...props}
                    data={hasDensityNext && 'newmessagebutton'}
                />
            </ThemeProvider>
        </div>
    );
});
