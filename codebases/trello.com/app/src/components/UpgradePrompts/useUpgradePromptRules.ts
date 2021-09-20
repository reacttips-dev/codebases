import { useState, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  OverlayType,
  setOverlay,
} from 'app/gamma/src/modules/state/ui/overlay';
import { useUpgradePromptRulesQuery } from './UpgradePromptRulesQuery.generated';
import { useUpgradePromptDismissMessageMutation } from './UpgradePromptDismissMessageMutation.generated';
import { dontUpsell } from '@trello/browser';
import { ProductFeatures } from '@trello/product-features';
import { useSocketSubscription } from 'app/scripts/init/useSocketSubscription';

interface UseUpgradePromptOpt {
  allowUpsell?: boolean;
  skip?: boolean;
}

export enum Product {
  Enterprise = 'enterprise',
  BusinessClass = 'businessClass',
  Standard = 'standard',
  Free = 'free',
}

const productOrderMapping: Record<Product, number> = {
  [Product.Enterprise]: 3,
  [Product.BusinessClass]: 2,
  [Product.Standard]: 1,
  [Product.Free]: 0,
};

interface UpgradePath {
  from?: Product;
  to?: Product;
}

const isValidUpgradePath = (
  currentTeamProduct: Product,
  from: UpgradePath['from'],
  to: UpgradePath['to'],
) => {
  if (!from && !to) {
    return currentTeamProduct === Product.Free;
  } else if (from && to) {
    return (
      currentTeamProduct === from &&
      productOrderMapping[from] < productOrderMapping[to]
    );
  } else if (to) {
    return productOrderMapping[currentTeamProduct] < productOrderMapping[to];
  } else {
    return currentTeamProduct === from;
  }
};

export const useUpgradePromptRules = (
  orgId?: string,
  messageId?: string,
  options?: UseUpgradePromptOpt,
  upgradePath?: UpgradePath,
) => {
  const dispatch = useDispatch();

  useSocketSubscription('Organization', orgId, Boolean(!orgId));

  const { data, loading } = useUpgradePromptRulesQuery(
    orgId && !options?.skip
      ? {
          variables: {
            memberId: 'me',
            orgId: orgId || '',
          },
        }
      : { skip: true },
  );

  const [
    addOneTimeMessagesDismissed,
  ] = useUpgradePromptDismissMessageMutation();

  const member = data?.member;
  const organization = data?.organization;
  const memberId = member?.id || '';
  const currentTeamProduct = useMemo(() => {
    if (
      organization?.products?.some((product) =>
        ProductFeatures.isEnterpriseProduct(product),
      )
    )
      return Product.Enterprise;
    if (
      organization?.products?.some((product) =>
        ProductFeatures.isBusinessClassProduct(product),
      )
    )
      return Product.BusinessClass;
    if (
      organization?.products?.some((product) =>
        ProductFeatures.isStandardProduct(product),
      )
    )
      return Product.Standard;
    return Product.Free;
  }, [organization?.products]);

  const isTeamMember = Boolean(
    organization?.memberships?.find((member) => member.idMember === memberId),
  );
  const isEnterprise = !!member?.enterprises?.find(
    (ent) => ent.id === member?.idEnterprise,
  )?.isRealEnterprise;
  const isMessageDismissed = Boolean(
    member?.oneTimeMessagesDismissed?.find((msgId) => msgId === messageId),
  );
  const isMemberConfirmed = member?.confirmed;

  const boardLimit = data?.organization?.limits?.orgs?.freeBoardsPerOrg?.count;

  // Manual override to speed up hiding the prompt
  const [shouldHidePrompt, togglePrompt] = useState(false);

  const shouldDisplayUpgradePrompt = Boolean(
    (!dontUpsell() || options?.allowUpsell) &&
      !shouldHidePrompt &&
      isValidUpgradePath(
        currentTeamProduct,
        upgradePath?.from,
        upgradePath?.to,
      ) &&
      !isMessageDismissed &&
      !isEnterprise &&
      isTeamMember &&
      isMemberConfirmed,
  );
  const dismissMessage = useCallback(() => {
    togglePrompt(true);
    addOneTimeMessagesDismissed({
      variables: {
        memberId: 'me',
        messageId: messageId || '',
      },
    });
  }, [addOneTimeMessagesDismissed, messageId]);

  const openPlanSelection = useCallback(() => {
    if (!orgId) {
      return;
    }
    dispatch(
      setOverlay({
        overlayType: OverlayType.PlanSelection,
        context: {
          orgId,
        },
      }),
    );
  }, [dispatch, orgId]);

  return {
    boardLimit,
    org: data?.organization,
    openPlanSelection,
    dismissMessage,
    shouldDisplayUpgradePrompt,
    loading,
  };
};
