import getItem from 'owa-mail-store/lib/services/getItem';
import {
    INLINEIMAGE_CUSTOM_DATA_TEMPLATE,
    INLINEIMAGE_URL_TEMPLATE,
} from 'owa-inline-image-consts';
import type ItemResponseShape from 'owa-service/lib/contract/ItemResponseShape';
import itemResponseShape from 'owa-service/lib/factory/itemResponseShape';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import type RequestOptions from 'owa-service/lib/RequestOptions';
import { isFeatureEnabled } from 'owa-feature-flags';
import type { MailboxInfo } from 'owa-client-ids';

function getItemQuotedBodyResponseShape(): ItemResponseShape {
    // when rp-bodyDiffing is ON, quoted body is from TrimmedQuotedText
    const quotedBodyProp = isFeatureEnabled('rp-bodyDiffing')
        ? 'TrimmedQuotedText'
        : 'QuotedTextList';
    return itemResponseShape({
        BaseShape: 'IdOnly',
        AdditionalProperties: [propertyUri({ FieldURI: quotedBodyProp })],
        InlineImageCustomDataTemplate: INLINEIMAGE_CUSTOM_DATA_TEMPLATE,
        InlineImageUrlOnLoadTemplate: '',
        InlineImageUrlTemplate: INLINEIMAGE_URL_TEMPLATE,
        ImageProxyCapability: 'OwaConnectorsProxyAndCompose',
        AddBlankTargetToLinks: true,
        FilterHtmlContent: true,
    });
}

export function loadQuotedBody(
    itemId: string,
    mailboxInfo: MailboxInfo,
    options?: RequestOptions
): Promise<string[]> {
    return getItem(
        itemId,
        getItemQuotedBodyResponseShape(),
        'ItemQuotedBody',
        'V2016_06_24',
        mailboxInfo,
        options
    ).then(responseMessage => {
        if (responseMessage && !(responseMessage instanceof Error)) {
            // When rp-bodyDiffing is ON, quoted body is in TrimmedQuotedText
            // TrimmedQuotedText is a string while this function expects a string array
            // so wrap TrimmedQuotedText in array on returning
            return isFeatureEnabled('rp-bodyDiffing')
                ? [responseMessage.TrimmedQuotedText ?? '']
                : responseMessage.QuotedTextList;
        }
        return [];
    });
}
