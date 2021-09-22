import {
    CommandBarButton,
    IButtonStyles,
    IButtonProps,
    getSplitButtonClassNames,
} from '@fluentui/react/lib/Button';
import React from 'react';
import type { IIconStyles } from '@fluentui/react/lib/Icon';
import isFeatureEnabled from 'owa-feature-flags/lib/utils/isFeatureEnabled';

import * as styles from './FluentCommandBarHeroButton.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

const fluentStylesWithMenu: Partial<IButtonProps> = {
    split: true,
    styles: {
        label: styles.label,
        root: styles.mainButton,
    },
    getSplitButtonClassNames: (disabled, expanded, checked, allowDisabledFocus) =>
        getSplitButtonClassNames(
            {
                splitButtonMenuButton: styles.splitButtonMenuButton,
                splitButtonMenuButtonExpanded: styles.expanded,
                splitButtonContainer: classNames(
                    styles.splitButtonContainer,
                    isFeatureEnabled('mon-tri-collapsibleFolderPane') && styles.collapsiblePane
                ), // add extra margins with collapsible pane
                splitButtonMenuIcon: styles.splitButtonMenuIcon,
                splitButtonDivider: styles.splitButtonDivider,
            },
            disabled,
            expanded,
            checked,
            false /*primary disabled */
        ),
};

const menuItemIconStyles: IIconStyles = {
    root: styles.menuItemIcon,
};

const FluentCommandBarHeroButton = (props?: IButtonProps) => {
    const fluentStyles: IButtonStyles = {
        label: styles.label,
        root: classNames(
            styles.splitButtonContainer,
            props?.data != 'newmessagebutton' && styles.splitButtonMargins,
            styles.mainButton
        ),
    };

    const fullProps = {
        ...props,
        styles: {
            ...fluentStyles,
            ...props?.styles,
        },
        ...(props.menuProps && fluentStylesWithMenu),
    };

    if (props.menuProps) {
        props.menuProps.items.forEach(item => {
            if (item.iconProps && !item.iconProps.styles) {
                item.iconProps.styles = menuItemIconStyles;
            }
        });
    }

    return <CommandBarButton {...fullProps} />;
};

export default FluentCommandBarHeroButton;
