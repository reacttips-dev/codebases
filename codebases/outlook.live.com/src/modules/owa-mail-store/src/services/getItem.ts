import type ExchangeVersionType from 'owa-service/lib/contract/ExchangeVersionType';
import type ItemResponseShape from 'owa-service/lib/contract/ItemResponseShape';
import type Message from 'owa-service/lib/contract/Message';
import type Item from 'owa-service/lib/contract/Item';
import type RequestOptions from 'owa-service/lib/RequestOptions';
import getItemFromOWSDirectly from 'owa-mail-get-item-service/lib/getItemService';
import { isFeatureEnabled } from 'owa-feature-flags';
import { LazyModule } from 'owa-bundling-light';
import type { MailboxInfo } from 'owa-client-ids';

/**
 * Query documents get pretty large
 */
const lazyGetItemViaGraphQL = new LazyModule(
    () => import(/* webpackChunkName: "getItemViaGraphQL" */ './getItemViaGraphQL')
);

export default function getItem(
    id: string,
    itemShape: ItemResponseShape,
    shapeName?: string,
    requestServerVersion?: ExchangeVersionType,
    mailboxInfo?: MailboxInfo,
    options?: RequestOptions,
    isDiscovery?: boolean
): Promise<Item | Message | Error | null>;

export default function getItem(
    id: string[],
    itemShape: ItemResponseShape,
    shapeName?: string,
    requestServerVersion?: ExchangeVersionType,
    mailboxInfo?: MailboxInfo,
    options?: RequestOptions,
    isDiscovery?: boolean
): Promise<(Item | Message)[] | Error | null>;

export default function getItem(
    id: null,
    itemShape: ItemResponseShape,
    shapeName: string | undefined,
    requestServerVersion: ExchangeVersionType | undefined,
    mailboxInfo: undefined | null,
    options: undefined | null,
    isDiscovery: undefined | null,
    internetMessageId: string
): Promise<(Item | Message)[] | Error | null>;

export default function getItem(
    id: string | null,
    itemShape: ItemResponseShape,
    shapeName?: string,
    requestServerVersion?: ExchangeVersionType,
    mailboxInfo?: MailboxInfo,
    options?: RequestOptions,
    isDiscovery?: boolean,
    internetMessageId?: string,
    scenarioName?: string,
    isPrefetch?: boolean
): Promise<(Item | Message)[] | Item | Message | Error | null>;

export default function getItem(
    id: string[] | null,
    itemShape: ItemResponseShape,
    shapeName?: string,
    requestServerVersion?: ExchangeVersionType,
    mailboxInfo?: MailboxInfo,
    options?: RequestOptions,
    isDiscovery?: boolean,
    internetMessageId?: string,
    scenarioName?: string,
    isPrefetch?: boolean
): Promise<(Item | Message)[] | Error | null>;

/**
 * Common entrypoint used to branch between getting items from GraphQL
 * resolvers, or from OWS directly
 *
 * Until GraphQL getItem is implemented, this is a simple re-export of getItemService.
 */
export default function getItem(
    id: string | string[] | null,
    itemShape: ItemResponseShape,
    shapeName?: string,
    requestServerVersion?: ExchangeVersionType,
    mailboxInfo?: MailboxInfo,
    options?: RequestOptions,
    isDiscovery?: boolean,
    internetMessageId?: string,
    scenarioName?: string,
    isPrefetch?: boolean
): Promise<(Item | Message)[] | Item | Message | Error | null> {
    if (isFeatureEnabled('mon-rp-loadItemViaGql')) {
        return lazyGetItemViaGraphQL.import().then(m =>
            m.getItemViaGraphQL(
                // Need to cast here because of argument overloading in the callee.
                id as any,
                itemShape,
                shapeName,
                requestServerVersion,
                mailboxInfo,
                options,
                isDiscovery,
                internetMessageId,
                scenarioName,
                isPrefetch
            )
        );
    } else {
        return getItemFromOWSDirectly(
            // Need to cast here because of argument overloading in the callee.
            id as any,
            itemShape,
            shapeName,
            requestServerVersion,
            options,
            isDiscovery,
            internetMessageId
        );
    }
}
