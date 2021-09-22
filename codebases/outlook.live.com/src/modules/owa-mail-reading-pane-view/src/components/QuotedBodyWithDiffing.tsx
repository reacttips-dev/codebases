import {
    hideTrimmedQuotedText,
    showTrimmedQuotedText,
    showFullMessageText,
    hideFullMessageText,
} from '../strings.locstring.json';
import { observer } from 'mobx-react-lite';
import { IconButton } from '@fluentui/react/lib/Button';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { ControlIcons } from 'owa-control-icons';
import loc from 'owa-localize';
import expandCollapseQuotedBody from 'owa-mail-reading-pane-store/lib/actions/expandCollapseQuotedBody';
import type QuotedBodyViewState from 'owa-mail-reading-pane-store/lib/store/schema/QuotedBodyViewState';
import MailMessageBody from './MailMessageBody';
import type DiffingInformation from 'owa-service/lib/contract/DiffingInformation';
import { ReportBodyDiffing } from 'owa-mail-report-bodydiffing';
import type { ClientItem } from 'owa-mail-store';
import { isFeatureEnabled } from 'owa-feature-flags';
import * as React from 'react';

import styles from './FossilizedTextAndQuotedBody.scss';

export interface QuotedBodyWithDiffingProps {
    item: ClientItem;
    viewState: QuotedBodyViewState;
    isQuotedTextChanged: boolean;
    quotedTextState?: string;
    hasTrimmedQuotedText?: boolean;
    diffingInformation?: DiffingInformation;
    isExpandedCallback: (quotedBodyOffsetTop: number) => void;
    copyAllowed: boolean;
    printAllowed: boolean;
    undoDarkMode: boolean;
    isNative: boolean;
}

export default observer(function QuotedBodyWithDiffing(props: QuotedBodyWithDiffingProps) {
    const {
        item,
        viewState,
        isQuotedTextChanged,
        hasTrimmedQuotedText,
        isExpandedCallback,
        copyAllowed,
        printAllowed,
        undoDarkMode,
        isNative,
    } = props;

    const trimedQuotedTextContainer = React.useRef<HTMLDivElement>();
    React.useEffect(() => {
        if (viewState.isExpanded && trimedQuotedTextContainer.current && isExpandedCallback) {
            isExpandedCallback(trimedQuotedTextContainer.current.getBoundingClientRect().top);
        }
    }, [viewState.isExpanded]);

    const onToggleExpandCollapseQuotedBody = () => {
        expandCollapseQuotedBody(viewState, item.ItemId.Id, isQuotedTextChanged);
    };

    const uniqueTopFragmentContent = item.UniqueTopFragment?.Value;
    const uniqueBottomFragmentContent = item.UniqueBottomFragment?.Value;

    // We're reusing item.QuotedTextList[0] to carry the content for trimmedQuotedText
    // For details, please see loadQuotedBody
    const trimmedQuotedText =
        hasTrimmedQuotedText && item.QuotedTextList?.length > 0 ? item.QuotedTextList[0] : null;

    const hideText = isNative ? loc(hideFullMessageText) : loc(hideTrimmedQuotedText);
    const showText = isNative ? loc(showFullMessageText) : loc(showTrimmedQuotedText);

    const title = viewState.isExpanded ? hideText : showText;

    return (
        <>
            {uniqueTopFragmentContent && (
                <div className={styles.quotedBodies}>
                    <div className={styles.quotedItemPartHorizontalRule} />
                    <MailMessageBody
                        className={styles.uniqueFragment}
                        messageBody={uniqueTopFragmentContent}
                        item={item}
                        copyAllowed={copyAllowed}
                        printAllowed={printAllowed}
                        isLoading={false}
                        undoDarkMode={undoDarkMode}
                        actionableMessageCardInItemViewState={null}
                    />
                </div>
            )}
            {hasTrimmedQuotedText && (
                <IconButton
                    title={title}
                    ariaLabel={title}
                    checked={viewState.isExpanded}
                    onClick={onToggleExpandCollapseQuotedBody}
                    className={styles.quotedBodyButton}
                    iconProps={{
                        iconName: ControlIcons.More,
                        styles: {
                            root: styles.quotedBodyButtonIcon,
                        },
                    }}
                />
            )}
            {viewState.loadingState.isLoading && (
                <Spinner className={styles.quotedBodySpinner} size={SpinnerSize.xSmall} />
            )}
            {viewState.isExpanded && trimmedQuotedText && (
                <div ref={trimedQuotedTextContainer} className={styles.quotedBodies}>
                    <div className={styles.quotedItemPartHorizontalRule} />
                    <MailMessageBody
                        className={styles.quotedItemPartMessageBody}
                        messageBody={trimmedQuotedText}
                        copyAllowed={copyAllowed}
                        printAllowed={printAllowed}
                        isLoading={false}
                        undoDarkMode={undoDarkMode}
                        actionableMessageCardInItemViewState={null}
                        item={item}
                    />
                </div>
            )}
            {uniqueBottomFragmentContent && (
                <div className={styles.quotedBodies}>
                    <div className={styles.quotedItemPartHorizontalRule} />
                    <MailMessageBody
                        className={styles.uniqueFragment}
                        messageBody={uniqueBottomFragmentContent}
                        item={item}
                        copyAllowed={copyAllowed}
                        printAllowed={printAllowed}
                        isLoading={false}
                        undoDarkMode={undoDarkMode}
                        actionableMessageCardInItemViewState={null}
                    />
                </div>
            )}
            {(uniqueTopFragmentContent || uniqueBottomFragmentContent) &&
                isFeatureEnabled('rp-reportBodyDiffing') && (
                    <ReportBodyDiffing item={item} className={styles.quotedBodies} />
                )}
        </>
    );
});
