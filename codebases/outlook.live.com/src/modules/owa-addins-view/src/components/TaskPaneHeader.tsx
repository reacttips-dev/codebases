import { observer } from 'mobx-react-lite';
import { taskPaneCloseButtonAriaLabel } from './TaskPaneHeader.locstring.json';
import loc from 'owa-localize';
/* tslint:disable:jsx-no-lambda */
import * as React from 'react';
import classNames from 'classnames';
import ImageWithFallback from './ImageWithFallback';
import PersistButton from './PersistButton';

import { ControlIcons } from 'owa-addins-icons';
import { IButton, IconButton } from '@fluentui/react/lib/Button';
import { isPersistentTaskpaneEnabled } from 'owa-addins-feature-flags';
import { getIsDarkTheme } from 'owa-fabric-theme';

import styles from './TaskPaneHeader.scss';

export interface TaskPaneHeaderProps {
    displayName: string;
    iconUrl: string;
    closeOnClick: () => void;
    isCalendar: boolean;
    isPersistable: boolean;
    isPersisted: boolean;
    togglePersist: () => void;
}

export interface TaskPaneHeaderHandle {
    focusCloseButton(): void;
}

export default observer(
    function TaskPaneHeader(props: TaskPaneHeaderProps, ref: React.Ref<TaskPaneHeaderHandle>) {
        const closeButton = React.useRef<IButton>();

        React.useImperativeHandle(
            ref,
            () => ({
                focusCloseButton() {
                    if (closeButton.current) {
                        closeButton.current.focus();
                    }
                },
            }),
            []
        );

        const { isCalendar } = props;
        const isDarkTheme = getIsDarkTheme();

        const headerClassName = isDarkTheme
            ? classNames(
                  styles.addinPaneHeaderDark,
                  isCalendar && styles.addinPaneHeaderCalendarDark
              )
            : classNames(styles.addinPaneHeader, isCalendar && styles.addinPaneHeaderCalendar);

        const addinLabelClassName = classNames([
            isDarkTheme ? styles.addinPaneLabelTextDark : styles.addinPaneLabelText,
            styles.ellipsis,
        ]);

        const closeClassName = isDarkTheme ? styles.closeButtonDark : styles.closeButton;

        return (
            <div className={headerClassName}>
                <ImageWithFallback
                    src={props.iconUrl}
                    width={32}
                    height={32}
                    className={styles.addinPaneIcon}
                />
                <div className={addinLabelClassName}>{props.displayName}</div>
                <div className={styles.rightButtons}>
                    {isPersistentTaskpaneEnabled() && props.isPersistable && !isCalendar && (
                        <PersistButton
                            displayName={props.displayName}
                            isPersisted={props.isPersisted}
                            isDarkTheme={isDarkTheme}
                            togglePersist={props.togglePersist}
                        />
                    )}
                    <IconButton
                        componentRef={ref => (closeButton.current = ref)}
                        className={closeClassName}
                        onClick={props.closeOnClick}
                        ariaLabel={loc(taskPaneCloseButtonAriaLabel)}
                        iconProps={{ iconName: ControlIcons.Cancel }}
                    />
                </div>
            </div>
        );
    },
    { forwardRef: true }
);
