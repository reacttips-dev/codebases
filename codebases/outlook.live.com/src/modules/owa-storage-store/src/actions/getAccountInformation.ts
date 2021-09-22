import { mutatorAction } from 'satcheljs';
import getStore from '../store/store';
import getAccountInformationService from '../services/getAccountInformationService';
import { getUserConfiguration } from 'owa-session-store';
import type MyAccountStatisticsData from 'owa-service/lib/contract/MyAccountStatisticsData';
import type UnlimitedUnsignedInteger from 'owa-service/lib/contract/UnlimitedUnsignedInteger';
import type GetAccountInformationResponse from 'owa-service/lib/contract/GetAccountInformationResponse';
import { logUsage, DatapointVariant } from 'owa-analytics';
/**
 * Gets account information and stores it in the mailbox quota store
 */
export default function getAccountInformation(): Promise<boolean> {
    return getAccountInformationService()
        .then(response => {
            if (response.WasSuccessful) {
                setAccountInformation(response);
                return true;
            } else {
                return false;
            }
        })
        .catch(error => {
            return false;
        });
}

const setAccountInformation = mutatorAction(
    'setAccountInformation',
    (response: GetAccountInformationResponse) => {
        // These values must exist to derive the required values in the store. If either aren't present, we can ignore the response.
        if (!response.AccountInfo.Statistics || !response.AccountInfo.Mailbox) {
            return;
        }
        const store = getStore();
        const userConfiguration = getUserConfiguration();
        const { SessionSettings = {} } = userConfiguration;
        const mailbox = response.AccountInfo.Mailbox;
        const statistics = response.AccountInfo.Statistics;
        const shouldUseDatabaseDefault =
            !SessionSettings.IsBposUser && mailbox.UseDatabaseQuotaDefaults;

        const sendQuota = shouldUseDatabaseDefault
            ? statistics.DatabaseProhibitSendQuota
            : mailbox.ProhibitSendReceiveQuota;

        // Exchange Admin Center(EAC),use ProhibitSendQuota (instead of ProhibitSendReceiveQuota)
        // but on client we use ProhibitSendReceiveQuota since it is closer to our adevertised value of storage
        const usagePercentage = calculateUsagePercentage(statistics, sendQuota);
        store.usagePercentage = usagePercentage;
        store.usageInBytes = statistics.TotalItemSize.Value;
        store.sendReceiveQuota = sendQuota;
        logUsage('MailboxCleanup_TotalUsage', [usagePercentage.toFixed(2)], {
            variant: DatapointVariant.WarmOnly,
        });
    }
);

function calculateUsagePercentage(
    statistics: MyAccountStatisticsData,
    quota: UnlimitedUnsignedInteger
): number {
    if (quota.IsUnlimited) {
        if (statistics.TotalItemSize.IsUnlimited) {
            // Return 100% if both the quota and the total size are unlimited
            // This is as per ECP code.
            return 100;
        }

        if (statistics.TotalItemSize.Value > 0) {
            // Return constant size of "3%" to depict unlimited usage;
            // This is as per ECP code.
            return 3;
        }

        return 0;
    }

    // Return actual usage: [TotalItemSize / ProhibitSendQuota]
    return (statistics.TotalItemSize.Value / quota.Value) * 100;
}
