import { CommandBarButton } from '@fluentui/react/lib/Button';
import type { IOverflowSetItemProps } from '@fluentui/react/lib/OverflowSet';
import loc from 'owa-localize';
import * as React from 'react';
import { ControlIcons } from 'owa-control-icons';
import { getPaletteAsRawColors } from 'owa-theme';
import { observer } from 'mobx-react-lite';
import { overflowButtonTitle } from 'owa-locstrings/lib/strings/overflowButtonTitle.locstring.json';

import styles from 'owa-left-rail-item/lib/components/LeftRailItem.scss';

export interface OverflowButtonProps {
    overflowItems: IOverflowSetItemProps[];
}

export default observer(function OverflowButton(props: OverflowButtonProps) {
    const palette = getPaletteAsRawColors();

    return (
        <CommandBarButton
            key={'overflow'}
            styles={{
                root: styles.root,
                icon: {
                    color: palette.themePrimary,
                },
                iconHovered: {
                    color: palette.neutralSecondary,
                },
                iconPressed: {
                    color: palette.neutralSecondary,
                },
            }}
            menuIconProps={{ iconName: ControlIcons.More }}
            menuProps={{ items: props.overflowItems }}
            title={loc(overflowButtonTitle)}
        />
    );
});
