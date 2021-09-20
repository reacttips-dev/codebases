import React from 'react';
import { useDebounce } from 'use-debounce';
import { Spinner } from '@trello/nachos/spinner';
import { forTemplate } from '@trello/i18n';
import { getNetworkError } from '@trello/graphql-error-handling';

import { useAddMembersPriceQuotesQuery } from './AddMembersPriceQuotesQuery.generated';
import { BillingAddMembersPriceQuotes } from './BillingAddMembersPriceQuotes';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';

const format = forTemplate('billing');

interface BillingAddMembersSummaryProps {
  accountId: string;
  members: string[];
  addMembers: () => void;
}

export const BillingAddMembersSummary: React.FC<BillingAddMembersSummaryProps> = ({
  accountId,
  members,
  addMembers,
}) => {
  const [debouncedMembers] = useDebounce(members, 750);

  const { loading, data, error } = useAddMembersPriceQuotesQuery({
    variables: {
      accountId,
      members: debouncedMembers,
    },
  });

  // Price quote query is still running
  if (loading) {
    return <Spinner centered />;
  }

  // An error occurred calculating the price quote
  if (error) {
    const networkError = getNetworkError(error);
    switch (networkError?.code) {
      case 'BILLING_INVALID_MEMBERS':
        return <p>{format('add-members-invalid-members-error')}</p>;
      default:
        return <p>{format('add-members-price-quote-error')}</p>;
    }
  }

  // render the price quote summary
  const priceQuotes = data!.addMembersPriceQuotes;
  return (
    <BillingAddMembersPriceQuotes
      {...{ priceQuotes, memberCount: debouncedMembers.length, addMembers }}
    />
  );
};

export const BillingAddMembersSummaryWrapped: React.FC<BillingAddMembersSummaryProps> = ({
  accountId,
  members,
  addMembers,
}) => {
  return (
    <ComponentWrapper>
      <BillingAddMembersSummary {...{ accountId, members, addMembers }} />
    </ComponentWrapper>
  );
};
