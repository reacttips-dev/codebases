import {
    publicFolderPickerHeaderText,
    publicFolderPickerSubHeaderText,
} from './PublicFolderPickerHeader.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import { observer } from 'mobx-react-lite';

import publicFolderPickerHeaderStore from '../store/publicFolderPickerHeaderStore';
import styles from './styles/PublicFolderPicker.scss';

export const PublicFolderPickerHeader = observer(() => {
    return (
        <>
            <p
                className={
                    publicFolderPickerHeaderStore.isResponseError
                        ? styles.errorText
                        : styles.headerText
                }>
                {publicFolderPickerHeaderStore.responseMessage}
            </p>
            <div className={styles.headerTitle}>{loc(publicFolderPickerHeaderText)}</div>
            <p className={styles.headerText}>{loc(publicFolderPickerSubHeaderText)}</p>
        </>
    );
});
