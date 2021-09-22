import { observer } from 'mobx-react-lite';
import { MailListFilterMenu } from 'owa-mail-list-filter-view';
import { listViewStore } from 'owa-mail-list-store';
import type { ActionSource } from 'owa-mail-store';
import * as React from 'react';
import { isFeatureEnabled } from 'owa-feature-flags';
import type ViewFilter from 'owa-service/lib/contract/ViewFilter';
import { isFocusedInboxEnabled } from 'owa-mail-triage-common';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { getDensityModeString } from 'owa-fabric-theme';
import { isSingleLineListView } from 'owa-mail-layout';
import SelectAllCheckbox from './SelectAllCheckbox';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';

import styles from './MailListHeader.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface MailListHeaderProps {
    filterMenuSource: ActionSource;
    shouldShowFilterMenu: boolean;
    shouldShowSecondRowLeftEntity: boolean;
    tableViewId: string;
    renderFirstRow: (mailListRowCss: string) => JSX.Element;
    renderSecondRowCustomContent: (customContainerCss: string) => JSX.Element;
    renderThirdRow: (mailListThirdRowCss: string) => JSX.Element;
    renderBulkActionProgressBar: () => JSX.Element;
    mailListHeaderStylesAsPerUserSettings: string;
}

//  Header Structure
// ---------------------------------------------------------------------------------------------------
// |  Mail List Header Container                                                                     |
// |  ---------------------------------------------------------------------------------------------  |
// |  | First Row (Custom - renders optionally)                                                   |  |
// |  |                                                                                           |  |
// |  ---------------------------------------------------------------------------------------------  |
// |  ---------------------------------------------------------------------------------------------  |
// |  | Second Row (Half Custom - renders always)                                                 |  |
// |  | ---------- -----------------------------                        --------------------------|  |
// |  | |  Check | |           Custom          |                        |     Filter Dropdown    ||  |
// |  | |   Box  | |           Content         |                        |    (based on scenario) ||  |
// |  | ---------- -----------------------------                        --------------------------|  |
// |  ---------------------------------------------------------------------------------------------  |
// |  ---------------------------------------------------------------------------------------------  |
// |  | Third Row (Custom - renders optionally)                                                   |  |
// |  |                                                                                           |  |
// |  ---------------------------------------------------------------------------------------------  |
// |  ---------------------------------------------------------------------------------------------  |
// |  | Bulk action progress bar (Custom - renders optionally)                                    |  |
// |  |                                                                                           |  |
// |  ---------------------------------------------------------------------------------------------  |
// ---------------------------------------------------------------------------------------------------

export default observer(function MailListHeader(props: MailListHeaderProps) {
    const tableView = listViewStore.tableViews.get(props.tableViewId);
    const isItemView = tableView?.tableQuery?.listViewType === ReactListViewType.Message;
    const hasDensityNext = isFeatureEnabled('mon-densities');
    const densityModeString = getDensityModeString();
    const renderSecondRowLeftEntity = (isInboxWithPivots: boolean) => {
        return (
            <SelectAllCheckbox
                tableViewId={props.tableViewId}
                isInboxWithPivots={isInboxWithPivots}
            />
        );
    };
    const renderMailListFilter = (isInboxWithPivots: boolean) => {
        const viewFilters: ViewFilter[] = ['All', 'Unread', 'ToOrCcMe', 'Flagged', 'Mentioned'];

        if (
            isFeatureEnabled('doc-linkDiscovery-useNewProperty') &&
            !isConsumer() &&
            !isHostAppFeatureEnabled('nativeResolvers') /*Not supported through Hx currently*/
        ) {
            viewFilters.push('HasFile');
        } else {
            viewFilters.push('HasAttachment');
        }

        return (
            <MailListFilterMenu
                supportedViewFilters={viewFilters}
                filterMenuSource={props.filterMenuSource}
                tableViewId={props.tableViewId}
                isInboxWithPivots={isInboxWithPivots}
            />
        );
    };
    const getMailListHeaderStyles = (isInboxWithPivots: boolean) => {
        const mailListHeaderContainerStyles = classNames(styles.mailListHeaderContainer);
        return classNames(
            props.mailListHeaderStylesAsPerUserSettings,
            mailListHeaderContainerStyles
        );
    };
    const isSingleLineView = isSingleLineListView();
    const mailListThirdRowCss = classNames(
        isSingleLineView ? styles.mailListThirdRowSingleLine : styles.mailListThirdRowThreeColumn,
        props.mailListHeaderStylesAsPerUserSettings
    );
    const folderId = tableView.tableQuery.folderId;
    const isInboxWithPivots = isFocusedInboxEnabled() && folderNameToId('inbox') === folderId;
    const mailListHeaderStyles = getMailListHeaderStyles(isInboxWithPivots);
    const isStickyNotesHeader =
        folderId == folderNameToId('notes') && isFeatureEnabled('notes-folder-view');
    if (!props.renderSecondRowCustomContent) {
        throw new Error('MailListHeader: renderSecondRowCustomContent should not be null');
    }
    const thirdRow = props.renderThirdRow?.(mailListThirdRowCss);
    const firstRow = props.renderFirstRow?.(styles.mailListFirstRow);
    return (
        <div className={mailListHeaderStyles}>
            {props.renderFirstRow?.(styles.mailListFirstRow)}
            <div
                className={classNames(
                    styles.mailListSecondRow,
                    styles.mailListRowLeftPadding,
                    props.mailListHeaderStylesAsPerUserSettings,
                    !isSingleLineView &&
                        isFeatureEnabled('mon-tri-mailItemTwisty') &&
                        styles.highTwisty,
                    hasDensityNext && styles.verticalMarginsNext,
                    hasDensityNext && densityModeString,
                    densityModeString === 'compact' && styles.compactHeader,
                    isInboxWithPivots && styles.pivotHeader,
                    thirdRow && styles.thirdrowPaddingBottom,
                    firstRow && styles.withFirstRow
                )}>
                <div
                    className={classNames(
                        styles.mailListSecondRowInnerContent,
                        hasDensityNext && styles.mailListSecondRowInnerContentNext,
                        hasDensityNext && densityModeString
                    )}>
                    {props.shouldShowSecondRowLeftEntity &&
                        renderSecondRowLeftEntity(isInboxWithPivots)}
                    {props.renderSecondRowCustomContent(
                        classNames(
                            isStickyNotesHeader
                                ? styles.notesHeaderSecondRow
                                : styles.mailListSecondRowCustomContainer,
                            props.mailListHeaderStylesAsPerUserSettings,
                            hasDensityNext && styles.secondRowCustomContainer
                        )
                    )}
                    {props.shouldShowFilterMenu && renderMailListFilter(isInboxWithPivots)}
                </div>
            </div>
            {thirdRow}
            <div
                className={classNames(
                    isSingleLineView && !isItemView && styles.singleLineItemPadding,
                    props.mailListHeaderStylesAsPerUserSettings,
                    styles.bulkActionBarPadding
                )}>
                {props.renderBulkActionProgressBar?.()}
            </div>
        </div>
    );
});
