import { observer } from 'mobx-react-lite';
import { selectAllMessagesCommand } from 'owa-locstrings/lib/strings/selectallmessagescommand.locstring.json';
import loc from 'owa-localize';
import { Check } from '@fluentui/react/lib/Check';
import { toggleSelectAllRows } from 'owa-mail-actions/lib/mailListSelectionActions';
import { lazyResetFocus } from 'owa-mail-focus-manager';
import { getIsEverythingSelectedInTable, listViewStore } from 'owa-mail-list-store';
import * as React from 'react';
import { getIsBitSet, ListViewBitFlagsMasks } from 'owa-bit-flags/lib/utils/listViewBitFlagsUtil';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { isSingleLineListView } from 'owa-mail-layout';
import { useComputedValue } from 'owa-react-hooks/lib/useComputed';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getDensityModeString } from 'owa-fabric-theme';

import styles from './MailListHeader.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

interface SelectAllCheckboxProps {
    tableViewId: string;
    isInboxWithPivots: boolean;
}

export default observer(function SelectAllCheckbox(props: SelectAllCheckboxProps): JSX.Element {
    const tableView = listViewStore.tableViews.get(props.tableViewId);
    const isEverythingSelectedComputed = useComputedValue((): boolean => {
        return getIsEverythingSelectedInTable(tableView);
    }, [props.tableViewId]);

    const toggleSelectAll = React.useCallback(() => {
        // If listview is empty, just return
        if (tableView.rowKeys.length === 0) {
            return;
        }
        toggleSelectAllRows(tableView);
        // Must reset focus so that focus goes back to list view so user can perform keyboard triage actions as expected
        lazyResetFocus.importAndExecute();
    }, [props.tableViewId]);

    const onCheckKeyDown = React.useCallback(
        (evt: React.KeyboardEvent<HTMLDivElement>) => {
            if (evt.key === ' ' || evt.key === 'Enter') {
                toggleSelectAll();
                evt.preventDefault();
            }
        },
        [props.tableViewId]
    );

    const isListViewEmpty = tableView.rowKeys.length == 0;
    const isInCheckedMode = tableView.isInCheckedMode;
    const isEverythingSelected = isEverythingSelectedComputed;
    const isSingleLineView = isSingleLineListView();
    const isItemView = tableView.tableQuery.listViewType === ReactListViewType.Message;
    const isSenderImageOff = getIsBitSet(ListViewBitFlagsMasks.HideSenderImage);
    const leftEntityClassNames = classNames(
        isSingleLineView && isSenderImageOff
            ? styles.mailListSecondRowLeftEntityNoSenderImage
            : styles.mailListSecondRowLeftEntity,
        isInCheckedMode && styles.showCheckbox,
        !isListViewEmpty && styles.listViewHasItems,
        // Function to check if the user is in SLV and item view, reduce the left margin by 10px, part of density controls work
        !isSingleLineView
            ? styles.leftEntityThreeColumn
            : isItemView
            ? styles.leftEntitySingleLineSLVandItemView
            : styles.leftEntitySingleLine,
        props.isInboxWithPivots && styles.pivotOffset,
        isFeatureEnabled('mon-densities') && getDensityModeString()
    );
    const checkBoxClassNames = classNames(
        styles.checkBox,
        isSingleLineView ? styles.checkBoxSingleLine : styles.checkBoxThreeColumn
    );
    const checkBoxStyles = () => ({
        check: styles.checkStyles,
    });
    const checkBoxLabel = loc(selectAllMessagesCommand);
    return (
        <div
            tabIndex={0}
            role="checkbox"
            title={checkBoxLabel}
            aria-label={checkBoxLabel}
            aria-checked={isEverythingSelected}
            data-selection-toggle={true}
            data-is-focusable={true}
            onKeyDown={onCheckKeyDown}
            className={leftEntityClassNames}
            onClick={toggleSelectAll}>
            {
                <Check
                    className={checkBoxClassNames}
                    checked={isEverythingSelected}
                    styles={checkBoxStyles}
                />
            }
        </div>
    );
});
