import { parseNetworkError } from '@trello/graphql-error-handling';
import {
  QueryAddMembersPriceQuotesArgs,
  QueryCertCaptureTokenArgs,
  QueryNewSubscriptionListPriceQuotesArgs,
  QueryNewSubscriptionPriceQuotesArgs,
  QueryRenewalPriceQuotesArgs,
  QueryStatementsArgs,
  MutationCreateGoldPaidAccountArgs,
  MutationCreateWorkspacePaidAccountArgs,
  MutationActivateGoldCreditArgs,
  MutationUpdateBusinessClassCreditCardArgs,
  MutationUpdateGoldCreditCardArgs,
  MutationUpdateBusinessClassPaidProductArgs,
  MutationUpdateGoldPaidProductArgs,
  MutationUpdateBusinessClassBillingContactDetailsArgs,
  MutationUpdateGoldBillingContactDetailsArgs,
  MutationUpdateBusinessClassBillingInvoiceDetailsArgs,
  MutationUpdateGoldBillingInvoiceDetailsArgs,
  MutationReactivateWorkspacePaidAccountArgs,
  MutationReactivateGoldPaidAccountArgs,
  MutationCancelWorkspacePaidAccountArgs,
  MutationCancelGoldPaidAccountArgs,
  PaidAccountType,
  Credit,
} from '../generated';
import {
  prepareDataForApolloCache,
  QueryInfo,
} from '../prepareDataForApolloCache';
import { JSONObject, ResolverContext } from '../types';
import { isActive } from '@trello/paid-account';
import { token } from '@trello/session-cookie';
import { trelloFetch, fetch } from '@trello/fetch';
import { getNetworkClient } from '../getNetworkClient';
import { Analytics } from '@trello/atlassian-analytics';

export const newSubscriptionListPriceQuotesResolver = async (
  obj: object,
  args: QueryNewSubscriptionListPriceQuotesArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const queryParams = new URLSearchParams();
  queryParams.set('product', String(args.product));
  if (args.includeUnconfirmed) {
    queryParams.set('includeUnconfirmed', 'true');
  }

  const networkClient = getNetworkClient();

  const response = await trelloFetch(
    networkClient.getUrl(
      `/1/${args.accountType}/${
        args.accountId
      }/paidAccount/newSubscriptionListPriceQuotesV2?${queryParams.toString()}`,
    ),
    undefined,
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'NewSubscriptionListPriceQuotes',
        operationName: context.operationName,
      },
    },
  );

  if (!response.ok) {
    throw await parseNetworkError(response);
  }

  const quotes = await response.json();
  return prepareDataForApolloCache(quotes, info);
};

export const statementsResolver = async (
  obj: object,
  args: QueryStatementsArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await trelloFetch(
    networkClient.getUrl(
      `/1/${args.accountType}/${args.accountId}/paidAccount/transactions`,
    ),
    undefined,
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Statements',
        operationName: context.operationName,
      },
    },
  );

  // Intentionally swallowing errors and returning an empty array.
  // Running this query on a free account will result in a 404
  return prepareDataForApolloCache(
    response.ok ? await response.json() : [],
    info,
  );
};

export const newSubscriptionPriceQuotesResolver = async (
  obj: object,
  args: QueryNewSubscriptionPriceQuotesArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const queryParams = new URLSearchParams();
  (['product', 'country', 'postalCode', 'taxId', 'promoCode'] as const).forEach(
    (param) => {
      if (args[param]) {
        queryParams.set(param, String(args[param]));
      }
    },
  );
  if (args.includeUnconfirmed) {
    queryParams.set('includeUnconfirmed', 'true');
  }

  const networkClient = getNetworkClient();
  const response = await trelloFetch(
    networkClient.getUrl(
      `/1/${args.accountType}/${
        args.accountId
      }/paidAccount/newSubscriptionPriceQuotes?${queryParams.toString()}`,
    ),
    undefined,
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'NewSubscriptionPriceQuotes',
        operationName: context.operationName,
      },
    },
  );

  if (!response.ok) {
    throw await parseNetworkError(response);
  }

  const quotes = await response.json();
  return prepareDataForApolloCache(quotes, info);
};

export const renewalPriceQuotesResolver = async (
  obj: object,
  args: QueryRenewalPriceQuotesArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await trelloFetch(
    networkClient.getUrl(
      `/1/${args.accountType}/${args.accountId}/paidAccount/renewalPriceQuotes`,
    ),
    undefined,
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'RenewalPriceQuotes',
        operationName: context.operationName,
      },
    },
  );

  if (!response.ok) {
    throw await parseNetworkError(response);
  }

  const quotes = await response.json();
  return prepareDataForApolloCache(quotes, info);
};

export const addMembersPriceQuotesResolver = async (
  obj: object,
  args: QueryAddMembersPriceQuotesArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(
      `/1/organization/${args.accountId}/paidAccount/addMembersPriceQuotes`,
    ),
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        members: args.members,
        token: context.token || token,
      }),
    },
  );

  if (!response.ok) {
    throw await parseNetworkError(response);
  }

  const quote = await response.json();
  return prepareDataForApolloCache(quote, info);
};

export const upgradePriceQuotesResolver = async (
  obj: object,
  args: QueryNewSubscriptionPriceQuotesArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const queryParams = new URLSearchParams();

  if (args['product']) {
    queryParams.set('product', String(args['product']));
  }

  const networkClient = getNetworkClient();
  const response = await trelloFetch(
    networkClient.getUrl(
      `/1/${args.accountType}/${
        args.accountId
      }/paidAccount/upgradePriceQuotes?${queryParams.toString()}`,
    ),
    undefined,
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'UpgradePriceQuotes',
        operationType: 'mutation',
        operationName: context.operationName,
      },
    },
  );

  if (!response.ok) {
    throw await parseNetworkError(response);
  }

  const quotes = await response.json();
  return prepareDataForApolloCache(quotes, info);
};

/**
 * Poll the entity endpoint requesting the paidAccount information until
 * the products you requested have been added to the `paidAccount.products`
 * property and the `paidAccount.standing` is among the expected account
 * states to confirm that the purchase has been completed.
 *
 * NOTE: Does not necessarily mean the purchase was successful. In certain
 * cases, it is possible to have a rejected payment, and still get a paid
 * account that is immediately marked as overdue -- but it does mean that
 * the purchase process is done
 */
export const confirmPaidAccount = (
  pollUrl: string,
  confirm: {
    products: number[];
    freeTrial?: boolean;
  },
  context: ResolverContext,
  traceId?: string,
): Promise<JSONObject> =>
  new Promise((resolve, reject) => {
    const checkPaidAccountStatus = async () => {
      const response = await trelloFetch(
        pollUrl,
        {
          headers: traceId
            ? {
                'X-Trello-TraceId': traceId,
              }
            : {},
        },
        {
          clientVersion: context.clientAwareness.version,
          networkRequestEventAttributes: {
            source: 'graphql',
            resolver: 'ConfirmPaidAccount',
            operationType: 'mutation',
            operationName: context.operationName,
          },
        },
      );

      const trelloServerVersion = response.headers.get('X-Trello-Version');
      Analytics.setTrelloServerVersion(traceId, trelloServerVersion);

      if (response.ok) {
        const model = await response.json();

        let freeTrialConfirmed = true;
        if (confirm.freeTrial) {
          freeTrialConfirmed = model.credits.find(
            (credit: Credit) => credit.type === 'freeTrial',
          );
        }

        let productsConfirmed = true;
        if (confirm.products) {
          productsConfirmed =
            Array.isArray(model.paidAccount?.products) &&
            confirm.products.every((product) =>
              model.paidAccount.products.includes(product),
            );
        }

        if (
          freeTrialConfirmed &&
          productsConfirmed &&
          isActive(model.paidAccount)
        ) {
          return resolve(model);
        }
      }
      setTimeout(checkPaidAccountStatus, 2000);
    };

    checkPaidAccountStatus();
  });

interface CreatePaidAccountArgs {
  postUrl: string;
  pollUrl: string;
  traceId: string;
  products: number[];
  nonce: string;
  country: string;
  zipCode?: string;
  taxId?: string;
  discountCode?: string;
  freeTrial?: boolean;
  acceptTOS: boolean;
  billingContactFullName: string;
  billingContactEmail: string;
  billingContactLocale: string;
  context: ResolverContext;
}

/**
 * To create a paid account, you must first POST all the payment
 * details to the paidAccount endpoint under /organizations or /members.
 * This expects you to have already tokenized the credit card via
 * Stripe (you just pass in the nonce).
 *
 * The endpoint will validate all the details, but the mutation will
 * not immediately take effect. Once the POST succeeds, we then poll
 * the /organization or /member until the paidAccount object is updated.
 */
export const createPaidAccount = async (
  args: CreatePaidAccountArgs,
): Promise<JSONObject> => {
  const { postUrl, pollUrl, traceId, context, ...body } = args;
  const postResponse = await fetch(postUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      'X-Trello-TraceId': traceId,
    },
    body: JSON.stringify({
      ...body,
      // Server seems to error & get into an invalid state if
      // the products are sent in as numbers :noidea:
      // Classic implementation converts these to a string before
      // posting them, so we will too
      products: body.products.map((n) => n.toString()),
      token: context.token || token,
    }),
  });

  const trelloServerVersion = postResponse.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(traceId, trelloServerVersion);

  if (!postResponse.ok) {
    throw await parseNetworkError(postResponse);
  }

  return confirmPaidAccount(
    pollUrl,
    { products: body.products },
    context,
    traceId,
  );
};

export const createWorkspacePaidAccount = async (
  obj: object,
  args: MutationCreateWorkspacePaidAccountArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const businessClassTeam = await createPaidAccount({
    postUrl: networkClient.getUrl(
      `/1/organizations/${args.idOrganization}/paidAccount`,
    ),
    pollUrl: networkClient.getUrl(
      `/1/organizations/${args.idOrganization}?paidAccount=true&paidAccount_fields=all`,
    ),
    traceId: args.traceId,
    products: args.products,
    nonce: args.nonce,
    country: args.country,
    zipCode: args.zipCode ?? '',
    taxId: args.taxId ?? '',
    freeTrial: args.freeTrial ?? false,
    discountCode: args.discountCode ?? undefined,
    acceptTOS: args.acceptTOS,
    billingContactFullName: args.name,
    billingContactEmail: args.email,
    billingContactLocale: args.locale,
    context,
  });

  return prepareDataForApolloCache(businessClassTeam, info);
};

export const createGoldPaidAccount = async (
  obj: object,
  args: MutationCreateGoldPaidAccountArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const goldMember = await createPaidAccount({
    postUrl: networkClient.getUrl(`/1/members/${args.idMember}/paidAccount`),
    pollUrl: networkClient.getUrl(
      `/1/members/${args.idMember}?paidAccount=true&paidAccount_fields=all`,
    ),
    products: args.products,
    nonce: args.nonce,
    country: args.country,
    zipCode: args.zipCode ?? '',
    taxId: args.taxId ?? '',
    acceptTOS: args.acceptTOS,
    billingContactFullName: args.name,
    billingContactEmail: args.email,
    billingContactLocale: args.locale,
    traceId: args.traceId,
    context,
  });

  return prepareDataForApolloCache(goldMember, info);
};

export const activateGoldCredit = async (
  obj: object,
  args: MutationActivateGoldCreditArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const postResponse = await fetch(
    networkClient.getUrl(`/1/members/${args.idMember}/unpaidAccount`),
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        // Server seems to error & get into an invalid state if
        // the products are sent in as numbers :noidea:
        // Classic implementation converts these to a string before
        // posting them, so we will too
        products: args.products.map((n) => n.toString()),
        token: context.token || token,
      }),
    },
  );

  if (!postResponse.ok) {
    throw await parseNetworkError(postResponse);
  }

  const goldMember = await confirmPaidAccount(
    networkClient.getUrl(
      `/1/members/${args.idMember}?paidAccount=true&paidAccount_fields=all`,
    ),
    { products: args.products },
    context,
  );

  return prepareDataForApolloCache(goldMember, info);
};

export const reactivateGoldPaidAccount = async (
  obj: object,
  args: MutationReactivateGoldPaidAccountArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    `/1/members/${args.idMember}/paidAccount/reactivate`,
  );
  const response = await fetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      'X-Trello-TraceId': args.traceId,
    },
    body: JSON.stringify({
      products: [args.product.toString()],
      token: context.token || token,
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(args.traceId, trelloServerVersion);

  if (!response.ok) {
    throw await parseNetworkError(response);
  }

  const model = await response.json();
  return prepareDataForApolloCache(model, info);
};

export const reactivateWorkspacePaidAccount = async (
  obj: object,
  args: MutationReactivateWorkspacePaidAccountArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    `/1/organizations/${args.idOrganization}/paidAccount/reactivate`,
  );
  const response = await fetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      'X-Trello-TraceId': args.traceId,
    },
    body: JSON.stringify({
      products: args.products.map((p) => p.toString()),
      nonce: args.nonce,
      country: args.country,
      zipCode: args.zipCode ?? '',
      taxId: args.taxId ?? '',
      discountCode: args.discountCode ?? undefined,
      acceptTOS: args.acceptTOS,
      billingContactFullName: args.name,
      billingContactEmail: args.email,
      billingContactLocale: args.locale,
      token: context.token || token,
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(args.traceId, trelloServerVersion);

  if (!response.ok) {
    throw await parseNetworkError(response);
  }

  const model = await response.json();
  return prepareDataForApolloCache(model, info);
};

/**
 * Update the Credit Card on file for a paid account
 */
export const updateCreditCardFactory = (type: PaidAccountType) => async (
  obj: object,
  args:
    | MutationUpdateBusinessClassCreditCardArgs
    | MutationUpdateGoldCreditCardArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    `/1/${type}/${args.accountId}/paidAccount/creditCard`,
  );
  const response = await fetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      nonce: args.nonce,
      country: args.country,
      zipCode: args.zipCode,
      taxId: args.taxId,
      token: context.token || token,
    }),
  });

  if (!response.ok) {
    throw await parseNetworkError(response);
  }

  const model = await response.json();
  return prepareDataForApolloCache(model, info);
};

/**
 * Update / change product associated with paid account.
 * This mutation can be used to switch a monthly account to an annual
 * account, or to renew a cancelled subscription before it expires.
 */
export const updatePaidProductFactory = (type: PaidAccountType) => async (
  obj: object,
  args:
    | MutationUpdateBusinessClassPaidProductArgs
    | MutationUpdateGoldPaidProductArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    `/1/${type}/${args.accountId}/paidAccount/products`,
  );
  const response = await fetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      products: args.products.toString(),
      token: context.token || token,
    }),
  });

  if (!response.ok) {
    throw await parseNetworkError(response);
  }

  const model = await response.json();
  return prepareDataForApolloCache(model, info);
};

export const updateBillingContactDetailsFactory = (
  type: PaidAccountType,
) => async (
  obj: object,
  args:
    | MutationUpdateBusinessClassBillingContactDetailsArgs
    | MutationUpdateGoldBillingContactDetailsArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    `/1/${type}/${args.accountId}/paidAccount/billingContact`,
  );
  const response = await fetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      billingContactFullName: args.contactName,
      billingContactEmail: args.contactEmail,
      billingContactLocale: args.contactLocale,
      token: context.token || token,
    }),
  });

  if (!response.ok) {
    throw await parseNetworkError(response);
  }

  const model = await response.json();
  return prepareDataForApolloCache(model, info);
};

export const updateInvoiceDetailsFactory = (type: PaidAccountType) => async (
  obj: object,
  args:
    | MutationUpdateBusinessClassBillingInvoiceDetailsArgs
    | MutationUpdateGoldBillingInvoiceDetailsArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    `/1/${type}/${args.accountId}/paidAccount/invoice`,
  );
  const response = await fetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      invoiceDetails: args.invoiceDetails,
      token: context.token || token,
    }),
  });

  if (!response.ok) {
    throw await parseNetworkError(response);
  }

  const model = await response.json();
  return prepareDataForApolloCache(model, info);
};

export const certCaptureTokenResolver = async (
  obj: object,
  args: QueryCertCaptureTokenArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await trelloFetch(
    networkClient.getUrl(
      `/1/${args.accountType}/${args.accountId}/paidAccount/certCapture/token`,
    ),
    undefined,
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'CertCaptureToken',
        operationType: 'mutation',
        operationName: context.operationName,
      },
    },
  );

  const model = await response.json();
  return prepareDataForApolloCache(model, info);
};

export const cancelPaidAccountFactory = (type: PaidAccountType) => async (
  obj: object,
  args:
    | MutationCancelWorkspacePaidAccountArgs
    | MutationCancelGoldPaidAccountArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    `/1/${type}/${args.accountId}/paidAccount/cancel`,
  );
  const response = await fetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      token: context.token || token,
    }),
  });

  if (!response.ok) {
    throw await parseNetworkError(response);
  }

  const model = await response.json();
  return prepareDataForApolloCache(model, info);
};
