import * as React from 'react';
import { IconButton } from '@fluentui/react/lib/Button';
import { lazyToggleFolderPaneExpansion, shouldShowFolderPane } from 'owa-mail-layout';
import { default as PaneOpen } from 'owa-fluent-icons-svg/lib/icons/PaneOpenRegular';
import { default as PaneClose } from 'owa-fluent-icons-svg/lib/icons/PaneCloseRegular';

import styles from './FolderPane.scss';

export default function FolderPaneToggleButton(): JSX.Element {
    return (
        <IconButton
            className={styles.folderPaneToggleButton}
            iconProps={{
                iconName: shouldShowFolderPane() ? PaneOpen : PaneClose,
                styles: {
                    root: styles.folderPaneToggleIcon,
                },
            }}
            onClick={lazyToggleFolderPaneExpansion.importAndExecute}
        />
    );
}
