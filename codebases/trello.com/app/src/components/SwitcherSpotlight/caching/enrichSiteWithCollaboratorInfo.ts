import {
  JoinableSiteUser,
  JoinableSiteProduct,
} from 'app/src/components/SwitcherSpotlight/types';

export const enrichSiteWithCollaboratorInfo = (
  resolvedCollaborators: JoinableSiteUser[],
) => ({ products, ...otherSiteDetails }: JoinableSiteProduct) => {
  const [[productKey, product]] = Object.entries(products);

  return {
    ...otherSiteDetails,
    products: {
      [productKey]: {
        ...product,
        collaborators: resolvedCollaborators.filter((m) =>
          product.collaborators.find(
            ({ accountId }) => m.accountId === accountId,
          ),
        ),
      },
    },
  };
};
