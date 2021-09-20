import React from 'react';
import moment from 'moment';
import {
  asMoney,
  asPercentage,
  forTemplate,
  localizeCount,
} from '@trello/i18n';
import styles from './BillingAddMembersPriceQuotes.less';
import { AddMembersPriceQuotesQuery } from './AddMembersPriceQuotesQuery.generated';
import { Button } from '@trello/nachos/button';

interface AddMembersPriceQuotes {
  renewal: AddMembersPriceQuotesQuery['addMembersPriceQuotes']['renewal'];
  prorated: AddMembersPriceQuotesQuery['addMembersPriceQuotes']['renewal'];
}

const format = forTemplate('billing');

interface BillingAddMembersPriceQuotesProps {
  priceQuotes: AddMembersPriceQuotes;
  memberCount: number;
  addMembers: () => void;
}

export const BillingAddMembersPriceQuotes: React.FC<BillingAddMembersPriceQuotesProps> = ({
  priceQuotes,
  memberCount,
  addMembers,
}) => {
  return (
    <div>
      <div className={styles.priceQuoteSection}>
        <div className={styles.priceQuoteHeadline}>
          <span>
            {localizeCount(
              'new member license count',
              priceQuotes.renewal.cTeamMembers,
            )}
          </span>
        </div>
        {typeof priceQuotes.prorated.nTotal === 'number' &&
          priceQuotes.prorated.nTotal > 0 && (
            <div className={styles.priceQuoteTotal}>
              <span>${asMoney(priceQuotes.prorated.nTotal)}</span>
            </div>
          )}
        {typeof priceQuotes.prorated.nTotal !== 'number' &&
          priceQuotes.prorated.nSubtotal > 0 && (
            <div className={styles.priceQuoteTotal}>
              <span>${asMoney(priceQuotes.prorated.nSubtotal)}</span>
            </div>
          )}
        <div>
          <ul className={styles.priceQuoteList}>
            {typeof priceQuotes.prorated.nTotal === 'number' &&
              priceQuotes.prorated.nTotal > 0 && (
                <li>
                  {format('add-members-immediate-charge', {
                    immediateCharge: asMoney(priceQuotes.prorated.nTotal),
                  })}
                </li>
              )}
            {typeof priceQuotes.prorated.nTotal !== 'number' &&
              priceQuotes.prorated.nSubtotal > 0 && (
                <li>
                  {format(
                    'add-members-immediate-charge-plus-tax-if-applicable',
                    {
                      immediateCharge: asMoney(priceQuotes.prorated.nSubtotal),
                    },
                  )}
                </li>
              )}
            {typeof priceQuotes.renewal.nTotal === 'number' &&
              priceQuotes.renewal.nTotal > 0 && (
                <li>
                  {format(
                    priceQuotes.renewal.nSubscriptionPeriodMonths === 12
                      ? 'add-members-renewal-charge-annual'
                      : 'add-members-renewal-charge-monthly',
                    {
                      renewalIncrease: asMoney(priceQuotes.renewal.nTotal),
                      renewalDate: moment(priceQuotes.renewal.dtBilling).format(
                        'LL',
                      ),
                    },
                  )}
                </li>
              )}
            {typeof priceQuotes.renewal.nTotal !== 'number' &&
              priceQuotes.renewal.nSubtotal > 0 && (
                <li>
                  {format(
                    priceQuotes.renewal.nSubscriptionPeriodMonths === 12
                      ? 'add-members-renewal-charge-annual-plus-tax-if-applicable'
                      : 'add-members-renewal-charge-monthly-plus-tax-if-applicable',
                    {
                      renewalIncrease: asMoney(priceQuotes.renewal.nSubtotal),
                      renewalDate: moment(priceQuotes.renewal.dtBilling).format(
                        'LL',
                      ),
                    },
                  )}
                </li>
              )}
            {priceQuotes.prorated.cBillableCollaboratorConversions > 0 && (
              <li>
                {localizeCount(
                  'multi-board guests converted count',
                  priceQuotes.prorated.cBillableCollaboratorConversions,
                )}
              </li>
            )}
            {((priceQuotes.prorated.cTeamMembers > 0 &&
              priceQuotes.prorated.nPricingAdjustment < 1.0) ||
              (priceQuotes.renewal.cTeamMembers > 0 &&
                priceQuotes.renewal.nPricingAdjustment < 1.0)) && (
              <li>
                {format('add-members-discount-percentage', {
                  discountPercentage: asPercentage(
                    1.0 -
                      (priceQuotes.prorated.cTeamMembers > 0 &&
                      priceQuotes.prorated.nPricingAdjustment < 1.0
                        ? priceQuotes.prorated.nPricingAdjustment
                        : priceQuotes.renewal.nPricingAdjustment),
                  ),
                })}
              </li>
            )}
          </ul>
        </div>
      </div>
      <Button
        appearance="primary"
        shouldFitContainer
        isDisabled={memberCount < 1}
        onClick={addMembers}
      >
        <span>{format('add-to-team')}</span>
      </Button>
    </div>
  );
};
