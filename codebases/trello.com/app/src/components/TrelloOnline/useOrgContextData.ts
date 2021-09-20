import { useOrganizationContextDataQuery } from './OrganizationContextDataQuery.generated';
import { sendErrorEvent } from '@trello/error-reporting';

export const useOrgContextData = (orgId: string) => {
  const { data, error } = useOrganizationContextDataQuery({
    variables: { orgId },
    skip: !orgId,
  });

  if (error)
    sendErrorEvent(error, {
      tags: { ownershipArea: 'trello-nusku' },
    });

  return data;
};
