import { isFeatureEnabled } from 'owa-feature-flags';
import { lazyGetAttachmentPreviews } from 'owa-mail-attachment-previews';
import { lazyFetchCouponData } from 'owa-mail-coupon-peek';
import type { TableView } from 'owa-mail-list-store';
import getSelectedTableViewId from 'owa-mail-list-store/lib/utils/getSelectedTableViewId';
import { getMailboxInfo } from 'owa-mail-mailboxinfo';
import { lazyTryPrefetchMeetingMessage } from 'owa-listview-rsvp';
import { lazyTryGetTxpAdditionalData } from 'owa-listview-txp';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { lazyGovern } from 'owa-tti';

/**
 * Fetch RichContentForRows on the tableview
 * @param tableView to perform the operation on
 */
export default function fetchRichContentForRows(tableView: TableView) {
    const listViewType = tableView.tableQuery.listViewType;
    const mailboxInfo = getMailboxInfo(tableView);

    if (getUserConfiguration().UserOptions.ShowInlinePreviews) {
        // Get the attachment previews
        lazyGetAttachmentPreviews.importAndExecute(mailboxInfo, listViewType);
    }

    if (isFeatureEnabled('tri-coupon-peek')) {
        lazyFetchCouponData.import().then(fetchCouponData => {
            fetchCouponData(mailboxInfo.mailboxSmtpAddress, listViewType);
        });
    }

    const shouldDelayPrefetch = tableView.id !== getSelectedTableViewId();

    lazyGovern.importAndExecute(
        {
            task: () =>
                lazyTryPrefetchMeetingMessage.importAndExecute(
                    mailboxInfo,
                    listViewType,
                    shouldDelayPrefetch
                ),
        },
        {
            task: () =>
                lazyTryGetTxpAdditionalData.importAndExecute(
                    mailboxInfo,
                    listViewType,
                    shouldDelayPrefetch
                ),
            condition: isFeatureEnabled('tri-txpButtonInLV'),
        }
    );
}
