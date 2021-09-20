import { Standing } from './types';

/**
 * Mirror of SubscriberStanding enum in Aardvark. Many of these standings
 * are deprecated or were never used by Trello in the first place. Shop
 * preceded Trello, and was used for selling all FogBugz software, and some
 * of the standings in there were only used for other software. As of 2020,
 * Trello only uses standings 3, 4, 5, and 6. It used to use 2, but that one
 * was deprecated around 2015. 0 is the default standing when an account
 * is created, but it is very quickly overwritten with 3 when the payment
 * is processed, so it's very unlikely to surface to the user.
 *
 * @see https://bitbucket.org/trello/aardvark/src/bdc5778877d87909e72c3c691a9c33018497ab48/Aardvark/CSubscriber.cs#lines-15
 * @see https://bitbucket.org/trello/server/src/5e5554fc7e34c3de9f50fa275f238ef84b25be63/app/data/accountStandings.js#lines-3
 */
const Standings: { [key: string]: Standing } = {
  None: -1, // @deprecated
  New: 0, // @deprecated
  Denied: 2, // @deprecated
  Good: 3,
  Overdue: 4,
  Disabled: 5,
  Cancelled: 6,
};

/**
 * Super-defensive standing conversion to number to protect against coffee-script
 */
const _normalizeStanding = (standing?: number | string | null): Standing =>
  standing === null || standing === undefined
    ? -1
    : (Number(standing) as Standing);

const _isActiveStanding = (standing: Standing) =>
  [Standings.Good, Standings.Overdue].includes(standing);

/**
 * Checks if a standing is set to determine if the entity currently has
 * a paid account or has had one in the past.
 */
export const hasAccount = (standing?: number | null) =>
  [3, 4, 5, 6].includes(_normalizeStanding(standing));

/**
 * Checks if a paid account is in active standing. This is determined
 * by having a good or overdue standing and by having a product
 * in the products array. While a payment is processing, the standing
 * will be set to 3, but the products array will be empty.
 */
export const isActive = (paidAccount?: {
  standing: number;
  products: number[];
}) =>
  !!(
    paidAccount &&
    _isActiveStanding(_normalizeStanding(paidAccount.standing)) &&
    (paidAccount?.products ?? []).length > 0
  );

/**
 * Problem account is true if payments are overdue
 */
export const isProblem = (standing?: number) =>
  _normalizeStanding(standing) === Standings.Overdue;

/**
 * Accounts are cancelled after a user has cancelled the subscription
 * and their subscription period has expired OR after their free promo
 * credits expire (which leaves them in a state where the standing is
 * 3 but they have no products)
 */
export const isCancelled = (
  paidAccount: {
    standing: number;
    products: number[];
    dateFirstSubscription: string | null;
  },
  isWorkspaceAccount: boolean,
) => {
  const standing = _normalizeStanding(paidAccount?.standing);
  const products = paidAccount?.products ?? [];
  const explicitlyCancelled =
    hasAccount(standing) &&
    _normalizeStanding(standing) === Standings.Cancelled;
  const implicitlyCancelled =
    _isActiveStanding(standing) &&
    products.length === 0 &&
    // dateFirstSubscription is only trustworthy for workspace accounts
    (!isWorkspaceAccount || paidAccount?.dateFirstSubscription);
  return explicitlyCancelled || implicitlyCancelled;
};

/**
 * Needs CreditCard is applicable if the account has been disabled
 * due to failed charges over a long period of time. The card is
 * removed, and the user will have to add a new one to re-establish
 * an active subscription
 */
export const needsCC = (standing?: number) =>
  _normalizeStanding(standing) === Standings.Disabled;

/**
 * Returns lowercase key of standings object above for the
 * provided standing value. Is used to match against locale
 * string keys.
 */
export const standingName = (standing?: number) => {
  if (!hasAccount(standing)) {
    return null;
  }
  const key = Object.keys(Standings).find(
    (k) => Standings[k] === _normalizeStanding(standing),
  );
  return key
    ? (key.toLowerCase() as 'good' | 'overdue' | 'disabled' | 'cancelled')
    : null;
};
