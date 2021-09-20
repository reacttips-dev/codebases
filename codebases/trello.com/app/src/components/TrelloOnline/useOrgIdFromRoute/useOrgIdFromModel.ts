import { useModelTypeQuery } from './ModelTypeQuery.generated';

export const useOrgIdFromModel = (
  name: string,
  path: string,
  routeId: string = '',
): string => {
  const { data } = useModelTypeQuery({
    variables: { name },
    skip: !name,
  });

  return data?.modelType?.type === 'organization' ? data.modelType.id : '';
};
