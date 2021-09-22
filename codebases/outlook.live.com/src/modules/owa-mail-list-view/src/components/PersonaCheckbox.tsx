import { observer } from 'mobx-react-lite';
import { useComputed } from 'owa-react-hooks/lib/useComputed';
import type SingleRecipientType from 'owa-service/lib/contract/SingleRecipientType';
import * as React from 'react';
import { Check } from '@fluentui/react/lib/Check';
import { getPersonaSize } from '../utils/getPersonaSize';
import onMailListItemClickHandler from '../utils/onMailListItemClickHandler';
import listViewStore from 'owa-mail-list-store/lib/store/Store';
import isConversationView from 'owa-mail-list-store/lib/utils/isConversationView';
import MailListItemSelectionSource from 'owa-mail-store/lib/store/schema/MailListItemSelectionSource';
import PersonaControl from 'owa-persona/lib/components/PersonaControl';
import shouldTableShowCirclePersonas from '../utils/shouldTableShowCirclePersonas';
import getIsChecked from '../selectors/getIsChecked';
import { isSingleLineListView } from 'owa-mail-layout';
import { AriaProperties, AriaRoles, generateDomPropertiesForAria } from 'owa-accessibility';
import { touchHandler, ITouchHandlerParams } from 'owa-touch-handler';
import {
    personaCheckboxSelectMessageLabel,
    personaCheckboxSelectConversationLabel,
} from './PersonaCheckbox.locstring.json';
import loc from 'owa-localize';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getIsBitSet, ListViewBitFlagsMasks } from 'owa-bit-flags/lib/utils/listViewBitFlagsUtil';
import { hasSenderImageOffInFullView } from '../utils/hasSenderImageOffInFullView';
import { getDensityModeString } from 'owa-fabric-theme';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';

import styles from './MailListItem.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface PersonaCheckboxProps {
    tableViewId: string;
    isSelected: boolean;
    lastSender: SingleRecipientType;
    rowKey: string;
    lastDeliveryTimestamp: string;
    isUnauthenticatedSender: boolean;
    styleSelectorAsPerUserSettings: string;
    isCondensedView?: boolean;
}

export default observer(function PersonaCheckbox(props: PersonaCheckboxProps) {
    const {
        isSelected,
        lastSender,
        isUnauthenticatedSender,
        styleSelectorAsPerUserSettings,
        isCondensedView,
        tableViewId,
    } = props;
    const isChecked = useComputed((): boolean => {
        const tableView = listViewStore.tableViews.get(tableViewId);
        return getIsChecked(tableView, props.rowKey, props.lastDeliveryTimestamp);
    });
    const touchHandler_0 = {
        get() {
            const touchHandlerParams: ITouchHandlerParams = {
                onClick: onClick,
            };
            return touchHandler(touchHandlerParams);
        },
    };
    const onClick = evt => {
        evt.preventDefault();
        evt.stopPropagation();
        onMailListItemClickHandler(
            evt,
            MailListItemSelectionSource.MailListItemCheckbox,
            props.rowKey,
            tableViewId
        );
    };
    // There's a double click on the outer component so must prevent propagation here (this is a corner case but causes an id of null error)
    const onDoubleClick = evt => {
        evt.stopPropagation();
    };
    const isSingleLine = isSingleLineListView();
    const tableView = listViewStore.tableViews.get(tableViewId);
    const personaMarginThreeColStyle = shouldShowUnstackedReadingPane()
        ? 'monPersonaMarginThreeColumn'
        : 'personaMarginThreeColumn';
    const hasHighTwisty = isFeatureEnabled('mon-tri-mailItemTwisty') && !isSingleLine;
    const hasDensityNext = isFeatureEnabled('mon-densities');
    const isSenderImageOff = getIsBitSet(ListViewBitFlagsMasks.HideSenderImage);
    const showCheckboxWithHighTwisty =
        (isSenderImageOff || hasSenderImageOffInFullView(tableView)) && hasHighTwisty; // Scenarios where there is no persona image so we replace it with a checkbox.
    const densityModeString = getDensityModeString();
    const personaCheckboxContainerClasses = classNames(
        densityModeString,
        hasHighTwisty && styles.highTwisty,
        styleSelectorAsPerUserSettings,
        styles.personaCheckboxContainer,
        !isSingleLine &&
            (isCondensedView
                ? 'personaMarginThreeColumnCondensedView'
                : personaMarginThreeColStyle),
        (isSelected || tableView.isInCheckedMode || showCheckboxWithHighTwisty) &&
            styles.showCheckbox // Otherwise show persona
    );
    const checkboxClasses = classNames(
        styles.checkbox,
        isChecked.get() && styles.checkboxChecked,
        densityModeString,
        hasHighTwisty && !isCondensedView && styles.highCheckbox
    );
    const checkBoxAriaProps: AriaProperties = {
        role: AriaRoles.checkbox,
        checked: isChecked.get(),
        label: isConversationView(tableView)
            ? loc(personaCheckboxSelectConversationLabel)
            : loc(personaCheckboxSelectMessageLabel),
    };
    // lastSender is undefined in rowModified notification payload, if the message is directly POSTed
    const lastSenderMailbox = lastSender ? lastSender.Mailbox : null;
    const showCirclePersonas = shouldTableShowCirclePersonas(tableView.tableQuery);

    return (
        <div
            className={personaCheckboxContainerClasses}
            {...touchHandler_0.get()}
            onClick={onClick}
            tabIndex={-1}
            onDoubleClick={onDoubleClick}
            {...generateDomPropertiesForAria(checkBoxAriaProps)}>
            {showCirclePersonas && lastSenderMailbox !== null && (
                <PersonaControl
                    name={lastSenderMailbox.Name}
                    emailAddress={lastSenderMailbox.EmailAddress}
                    size={getPersonaSize(hasDensityNext, isSingleLine, densityModeString)}
                    showUnknownPersonaCoin={isUnauthenticatedSender}
                    className={styles.persona}
                    mailboxType={lastSenderMailbox.MailboxType}
                />
            )}
            <Check checked={isChecked.get()} className={checkboxClasses} />
        </div>
    );
});
