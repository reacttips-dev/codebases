import { logUsage } from 'owa-analytics';

/**
 * Param newTabReason indicates the reason
 * why the click results in the link opening in a new tab
 * A null value means it is not opened in a new tab but in SxS
 */
export default function logSharePointLinkClick(
    newTabReason: string,
    isSafeLinkWrapped: boolean,
    isSafeLinkVerified: boolean,
    extraInfo?: null | 'redeem' | 'retryAfterCacheExpire',
    isOfficeSPLink?: boolean,
    isServiceGeneratedLink?: boolean,
    fileExtension?: string
) {
    logUsage(
        'SharePointLinkClick',
        {
            newTabReason,
            isSafeLinkWrapped,
            isSafeLinkVerified,
            extraInfo,
            isOfficeSPLink,
            isServiceGeneratedLink,
            fileExtension,
        },
        { isCore: true }
    );
}
