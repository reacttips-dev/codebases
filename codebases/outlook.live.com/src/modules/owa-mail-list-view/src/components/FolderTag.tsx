import folderStore, { getEffectiveFolderDisplayName } from 'owa-folders';
import { getStore as getMailSearchStore, setStaticSearchScope } from 'owa-mail-search';
import { lazyIsSearchBoxEmpty } from 'owa-search';
import { startSearch } from 'owa-search-actions';
import { SearchScenarioId } from 'owa-search-store';
import * as React from 'react';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getDensityModeString } from 'owa-fabric-theme';

import styles from './FolderTag.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface FolderTagProps {
    folderId: string; // The ID of the folder being represented
    isPreviewTextOn: boolean; // If preview text is displayed in the list view
    isSingleLine: boolean; // If tag is being displayed in SLV
}

export default function FolderTag(props: FolderTagProps) {
    const checkSearchBoxEmpty = (): boolean => {
        const isSearchBoxEmpty = lazyIsSearchBoxEmpty.tryImportForRender();
        return (
            // undefined means search is not initialized which means the search box is empty
            isSearchBoxEmpty === undefined || isSearchBoxEmpty?.(SearchScenarioId.Mail)
        );
    };
    const shouldFolderTagBeClickable_0 = (): boolean => {
        if (checkSearchBoxEmpty()) {
            return false;
        }
        let staticSearchScope;
        staticSearchScope = getMailSearchStore().staticSearchScope;
        return staticSearchScope && staticSearchScope.folderId !== props.folderId;
    };
    const onFolderTagClick = async (ev: React.MouseEvent<unknown>) => {
        // Stop click so it doesn't get acted on by MailListItem.
        ev.stopPropagation();
        /**
         * If user cleared search box between search and clicking folder
         * tag, it's a no-op.
         */
        if (!shouldFolderTagBeClickable_0()) {
            return;
        }
        const staticSearchScope = getMailSearchStore().staticSearchScope;
        // Create new search scope to match folder represented by folder tag.
        let searchScope = null;
        searchScope = {
            kind: staticSearchScope.kind,
            folderId: props.folderId,
        };
        setStaticSearchScope(searchScope);
        startSearch('FolderTag', SearchScenarioId.Mail, false /* explicitSearch */);
    };
    const { folderId, isPreviewTextOn, isSingleLine } = props;
    const folder = folderStore.folderTable.get(folderId);
    // We found out that search can sometimes return an item from a folder that does
    // not exist in the folder table. If that is the case we do not want to render
    // the folder tag.
    // VSO: 26898 - Search returns an item from a folder that does not exist in store
    if (!folder) {
        return null;
    }
    /**
     * Determine styles on the outer container based on if user is in SLV
     * or not.
     */
    const folderTagContainerStyle = styles.folderTagContainer;
    const folderTagContainerThreeColumnStyle = styles.folderTagContainerThreeColumn;
    const containerClassName = isSingleLine
        ? folderTagContainerStyle
        : folderTagContainerThreeColumnStyle;
    /**
     * Give container a right margin if the user is in 3 column view and has
     * preview text off. In this scenario, the folder tag will flow with
     * categories (if present) in a single line.
     */
    const rightMarginClassName =
        !isSingleLine && !isPreviewTextOn ? styles.folderTagContainerRightMargin : '';
    /**
     * Give container a left margin if the user is in 3 column view and has preview
     * text on or if user is in SLV.
     */
    const leftMarginClassName =
        (!isSingleLine && isPreviewTextOn) || isSingleLine
            ? styles.folderTagContainerLeftMargin
            : '';
    const shouldFolderTagBeClickable = shouldFolderTagBeClickable_0();
    const hasDensityNext = isFeatureEnabled('mon-densities');
    // Concatenate styles for container.
    const folderTagContainerClassNames = classNames([
        containerClassName,
        rightMarginClassName,
        leftMarginClassName,
        !shouldFolderTagBeClickable && styles.unclickableFolderTag,
        hasDensityNext && getDensityModeString(),
        hasDensityNext && styles.folderTagContainerNext,
    ]);
    const folderName = getEffectiveFolderDisplayName(folder);
    return (
        <button
            className={folderTagContainerClassNames}
            onClick={onFolderTagClick}
            disabled={!shouldFolderTagBeClickable}>
            <span className={styles.folderTagLabel} title={folderName}>
                {folderName}
            </span>
        </button>
    );
}
