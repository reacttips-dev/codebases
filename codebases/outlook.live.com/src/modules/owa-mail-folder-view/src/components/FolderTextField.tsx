import { LazyFolderTextField } from 'owa-folders-common';
import { getDensityModeString } from 'owa-fabric-theme';
import * as React from 'react';
import { lazyDismissMailFolderTextField } from 'owa-mail-folder-store';
import { observer } from 'mobx-react-lite';

import styles from 'owa-tree-node/lib/components/NodeHeight.scss';
import classnamesBind from 'classnames/bind';
let classNames = classnamesBind.bind(styles);

interface FolderTextFieldProps {
    nestDepth: number;
    onEntry: (value: string, folderId: string) => void;
    folderId?: string;
    defaultValue?: string;
}

export default observer(function FolderTextField(props: FolderTextFieldProps) {
    return (
        <LazyFolderTextField
            className={classNames(getDensityModeString(), styles.nodeHeight)}
            depth={props.nestDepth}
            defaultValue={props.defaultValue}
            key="folderTextField"
            onEntry={props.onEntry}
            onDismiss={onDismissFolderTextFieldEntry}
            folderId={props.folderId}
        />
    );
});

function onDismissFolderTextFieldEntry() {
    lazyDismissMailFolderTextField.importAndExecute();
}
