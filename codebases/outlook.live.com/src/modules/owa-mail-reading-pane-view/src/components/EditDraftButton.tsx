import {
    draftContinueEditingText,
    draftDiscardText,
    cancelDeferredSendText,
} from './EditDraftButton.locstring.json';
import { observer } from 'mobx-react-lite';
import { ActionButton, IconButton } from '@fluentui/react/lib/Button';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';
import { ControlIcons } from 'owa-control-icons';
import loc from 'owa-localize';
import { lazyOnEditDraftButtonClicked } from 'owa-mail-compose-actions';
import getDefaultDisposalType from 'owa-mail-reading-pane-store/lib/utils/getDefaultDisposalType';
import { cancelDeferredSendService } from 'owa-mail-scheduled-send';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import { lazyDeleteItems } from 'owa-mail-triage-action';
import type ItemId from 'owa-service/lib/contract/ItemId';
import * as React from 'react';
import { getActiveSxSId } from 'owa-sxs-store';

import styles from './ConversationReadingPane.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface EditDraftButtonProps {
    itemId: ItemId;
    instrumentationContext: InstrumentationContext;
    className?: string;
    isDeferredSend?: boolean;
    targetWindow?: Window;
}

export default observer(function EditDraftButton(props: EditDraftButtonProps) {
    const onEditDraft = (event: React.MouseEvent<unknown>) => {
        event.stopPropagation();
        const sxsId = getActiveSxSId(props.targetWindow);
        if (props.isDeferredSend) {
            cancelDeferredSendService(props.itemId).then(result => {
                if (result) {
                    lazyOnEditDraftButtonClicked.importAndExecute(props.itemId.Id, sxsId);
                }
            });
        } else {
            lazyOnEditDraftButtonClicked.importAndExecute(props.itemId.Id, sxsId);
        }
    };
    const onDelete = (event: React.MouseEvent<unknown>) => {
        event.stopPropagation();
        lazyDeleteItems.importAndExecute(
            [props.itemId.Id],
            getDefaultDisposalType(props.itemId.Id),
            [props.instrumentationContext],
            'ReadingPane'
        );
    };
    const editButtonClassNames = classNames(styles.iconButton, styles.editDraftButton);
    return (
        <div
            className={classNames(props.className, {
                draftButtonContainerWidthFix: props.isDeferredSend,
            })}>
            {props.isDeferredSend ? (
                <>
                    <TooltipHost content={loc(cancelDeferredSendText)}>
                        <ActionButton
                            ariaLabel={loc(cancelDeferredSendText)}
                            onClick={onEditDraft}
                            iconProps={{ iconName: ControlIcons.Edit }}
                            className={styles.deferredSendButton}
                            styles={{ icon: styles.enabledIconButton }}
                            text={loc(cancelDeferredSendText)}
                        />
                    </TooltipHost>
                </>
            ) : (
                <>
                    <TooltipHost content={loc(draftContinueEditingText)}>
                        <IconButton
                            ariaLabel={loc(draftContinueEditingText)}
                            onClick={onEditDraft}
                            iconProps={{ iconName: ControlIcons.Edit }}
                            className={editButtonClassNames}
                            styles={{ icon: styles.enabledIconButton }}
                        />
                    </TooltipHost>
                    <TooltipHost content={loc(draftDiscardText)}>
                        <IconButton
                            ariaLabel={loc(draftDiscardText)}
                            onClick={onDelete}
                            iconProps={{ iconName: ControlIcons.Delete }}
                            className={styles.iconButton}
                            styles={{ icon: styles.enabledIconButton }}
                        />
                    </TooltipHost>
                </>
            )}
        </div>
    );
});
