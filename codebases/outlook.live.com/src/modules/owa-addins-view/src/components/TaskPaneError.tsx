import { observer } from 'mobx-react-lite';
import {
    taskPaneErrorMultipleItemsSelected,
    taskPaneErrorMultipleItemsSelectedDescription,
} from '../strings.locstring.json';
import {
    taskPaneErrorNoItemSelected,
    taskPaneErrorNoItemSelectedDescription,
    taskPaneErrorAddinsNotSupported,
    taskPaneErrorAddinsNotSupportedDescription,
    taskPaneErrorAddinsNotSupportedOnSharedItemsDescription,
} from './TaskPaneError.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import classNames from 'classnames';

import { AddinIcons } from 'owa-addins-icons';
import { Icon } from '@fluentui/react/lib/Icon';
import { TaskPaneErrorType } from 'owa-addins-store';

import styles from './TaskPaneError.scss';

interface TaskPaneErrorText {
    title: string;
    description: string;
}

export interface TaskPaneErrorProps {
    errorType: TaskPaneErrorType;
}

export default observer(function TaskPaneError(props: TaskPaneErrorProps) {
    const errorText: TaskPaneErrorText = getErrorText(props.errorType);
    return (
        <div className={styles.errorContainer}>
            <div className={styles.errorContent}>
                <Icon className={styles.errorIcon} iconName={AddinIcons.OfficeAddinsLogo} />
                <span className={classNames([styles.errorTextCommon, styles.errorTextTitle])}>
                    {errorText.title}
                </span>
                <span className={classNames([styles.errorTextCommon, styles.errorTextDescription])}>
                    {errorText.description}
                </span>
            </div>
        </div>
    );
});

function getErrorText(errorType: TaskPaneErrorType): TaskPaneErrorText {
    switch (errorType) {
        case TaskPaneErrorType.Empty:
            return {
                title: loc(taskPaneErrorNoItemSelected),
                description: loc(taskPaneErrorNoItemSelectedDescription),
            };
        case TaskPaneErrorType.Multi:
            return {
                title: loc(taskPaneErrorMultipleItemsSelected),
                description: loc(taskPaneErrorMultipleItemsSelectedDescription),
            };
        case TaskPaneErrorType.NotSupported:
            return {
                title: loc(taskPaneErrorAddinsNotSupported),
                description: loc(taskPaneErrorAddinsNotSupportedDescription),
            };
        case TaskPaneErrorType.SharedItemsNotSupported:
            return {
                title: loc(taskPaneErrorAddinsNotSupported),
                description: loc(taskPaneErrorAddinsNotSupportedOnSharedItemsDescription),
            };
        default:
            return {
                title: null,
                description: null,
            };
    }
}
