import { useOrganizationContextDataQuery } from 'app/src/components/TrelloOnline/OrganizationContextDataQuery.generated';
import { sendErrorEvent } from '@trello/error-reporting';
import { ProductFeatures } from '@trello/product-features';

/*
 * Finds product information based on orgId
 */
export const useProductData = (
  orgId: string,
  options: { skip: boolean } = { skip: false },
) => {
  const { data, error, loading } = useOrganizationContextDataQuery({
    variables: { orgId },
    skip: !orgId || options.skip,
  });
  const productCode = data?.organization?.products?.[0];
  const productFeatures = data?.organization?.premiumFeatures;
  const productName = ProductFeatures.getProductName(productCode);
  const productInterval = ProductFeatures.getInterval(productCode);

  const isStandard = ProductFeatures.isStandardProduct(productCode);
  const isPremium = ProductFeatures.isBusinessClassProduct(productCode);
  const isGold = ProductFeatures.isGoldProduct(productCode);
  const isEnterprise = ProductFeatures.isEnterpriseProduct(productCode);
  const isFree = !isStandard && !isPremium && !isGold && !isEnterprise;

  if (error)
    sendErrorEvent(error, {
      tags: { ownershipArea: 'trello-nusku' },
    });

  return {
    productCode,
    productName,
    productInterval,
    productFeatures,
    isFree,
    isStandard,
    isPremium,
    isGold,
    isEnterprise,
    loading,
  };
};
