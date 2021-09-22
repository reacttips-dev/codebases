import { observer } from 'mobx-react-lite';
import { taskPaneUnpinButtonLabel, taskPanePinButtonLabel } from '../strings.locstring.json';
import loc, { format } from 'owa-localize';
import * as React from 'react';

import { AddinIcons, ControlIcons } from 'owa-addins-icons';

import { IconButton } from '@fluentui/react/lib/Button';

import styles from './TaskPaneHeader.scss';

export interface PersistButtonProps {
    displayName: string;
    isPersisted: boolean;
    isDarkTheme: boolean;
    togglePersist: () => void;
}

export default observer(function PersistButton(props: PersistButtonProps) {
    const getPersistButtonText = (): string => {
        const text = props.isPersisted
            ? loc(taskPaneUnpinButtonLabel)
            : loc(taskPanePinButtonLabel);
        return format(text, props.displayName);
    };
    const getPersistButtonIcon = (): string => {
        return props.isPersisted ? ControlIcons.Pinned : AddinIcons.Pin;
    };
    const icon = getPersistButtonIcon();
    const buttonText = getPersistButtonText();
    const persistIconClassName = props.isDarkTheme ? styles.persistIconDark : styles.persistIcon;
    return (
        <IconButton
            className={persistIconClassName}
            onClick={props.togglePersist}
            title={buttonText}
            ariaLabel={buttonText}
            iconProps={{ iconName: icon }}
        />
    );
});
