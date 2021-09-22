import { postToLabel } from './PostedToLine.locstring.json';
import publicFolderFavoriteStore from '../store/publicFolderFavoriteStore';
import { observer } from 'mobx-react-lite';
import type { MailFolder } from 'owa-graph-schema';
import loc from 'owa-localize';
import * as React from 'react';

import styles from './PostedToLine.scss';

export interface PostedToLineProps {
    folderId: string;
}

const PostedToLine = observer(function PostedToLine(props: PostedToLineProps) {
    const postedTo = publicFolderIdToName(props.folderId);
    return (
        <>
            <label className={styles.postedToLabel}>{loc(postToLabel)}</label>
            <label className={styles.folderLabel}>{postedTo}</label>
        </>
    );
});

function publicFolderIdToName(folderId: string): string {
    const folder: MailFolder = publicFolderFavoriteStore.folderTable.get(folderId);
    return folder.DisplayName;
}

export default PostedToLine;
