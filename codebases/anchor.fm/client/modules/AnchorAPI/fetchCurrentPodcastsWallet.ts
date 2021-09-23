import Bluebird from 'bluebird';
import moment from 'moment';
import { sortByDate } from '../Episode';
import { Wallet } from '../../types';
import AnchorAPIError from './AnchorAPIError';

const decodeResponseJsonIntoWallet = (json: any): Wallet => ({
  balance: {
    availableCents: json.currentWalletAmountInCents,
    pendingCents: json.pendingWalletAmountInCents,
  },
  allTimeEarningsInCents: json.allTimeWalletAmountInCents,
  areStripeRequirementsMet: json.areStripeRequirementsMet,
  normalPayoutProcessingFeeInCents: json.normalPayoutProcessingFeeInCents,
  allTimeEarningsBreakdown: json.allTimeWalletBreakdown
    ? {
        total: json.allTimeWalletBreakdown.amount,
        anchorFee: json.allTimeWalletBreakdown.amount,
        // paid: -27756
        payoutFee: json.allTimeWalletBreakdown.payoutFee,
        processorFee: json.allTimeWalletBreakdown.processorFee,
      }
    : undefined,
});
// TODO: This endpoint can only support fetching up to 1000 episodes.
//       We should migrate this fetch to hit our main api
const fetchCurrentPodcastsWallet = ({ shouldBustCache = false } = {}) =>
  new Promise<Wallet>((resolve, reject) => {
    const baseUrlPath = '/api/proxy/v3/wallet';
    const urlPath = shouldBustCache
      ? `${baseUrlPath}?${Date.now()}`
      : baseUrlPath;
    fetch(urlPath, {
      credentials: 'same-origin',
      method: 'GET',
    }).then((response: any): void => {
      if (response.ok) {
        response.json().then((responseJson: any) => {
          const wallet = decodeResponseJsonIntoWallet(responseJson);
          resolve(wallet);
        });
      } else {
        const error = new AnchorAPIError(response, 'Server error.');
        reject(error);
      }
    });
  });

export { fetchCurrentPodcastsWallet };
