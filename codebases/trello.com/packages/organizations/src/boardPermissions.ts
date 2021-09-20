// eslint-disable-next-line no-restricted-imports
import {
  Board_Prefs_PermissionLevel,
  Organization_Prefs_BoardVisibilityRestrict,
  Organization_Prefs_RestrictionType,
} from '@trello/graphql/generated';
import { ProductFeatures } from '@trello/product-features';

interface CanSetVisibilityOnBoardArgs {
  org: {
    idEnterprise?: string | null;
    products?: number[];
    prefs?: {
      boardVisibilityRestrict?: Organization_Prefs_BoardVisibilityRestrict | null;
    } | null;
  };
  boardVisibility: Board_Prefs_PermissionLevel;
  isOrgAdmin: boolean;
}

export const canSetVisibilityOnBoard = ({
  org,
  boardVisibility,
  isOrgAdmin,
}: CanSetVisibilityOnBoardArgs) => {
  const products = org.products || [];

  // Cannot set Enterprise visibility for an org that does
  // not belong to a real enterprise
  if (
    boardVisibility === Board_Prefs_PermissionLevel.Enterprise &&
    (!org.idEnterprise || !ProductFeatures.isEnterpriseProduct(products?.[0]))
  ) {
    return false;
  }

  if (!ProductFeatures.isFeatureEnabled('restrictVis', products?.[0])) {
    return true;
  }

  // Get the restriction for the visibility attempting to be set
  const boardVisibilityRestrict =
    org.prefs &&
    org.prefs.boardVisibilityRestrict &&
    org.prefs.boardVisibilityRestrict[boardVisibility];

  // If there was no restriction for the visibility attempting to be set, allow it
  if (!boardVisibilityRestrict) {
    return true;
  }

  // If the restriction for the visibility attempting to be set was 'org', allow it
  if (boardVisibilityRestrict === Organization_Prefs_RestrictionType.Org) {
    return true;
  }

  // If the restriction is admin only, allow it if we are an admin
  if (
    boardVisibilityRestrict === Organization_Prefs_RestrictionType.Admin &&
    isOrgAdmin
  ) {
    return true;
  }

  // If we get through all the checks, and couldn't allow, return false to be safe
  return false;
};

interface CanAddBoardToOrganizationArgs {
  org: {
    idEnterprise?: string | null;
    products?: number[];
    prefs?: {
      boardVisibilityRestrict?: Organization_Prefs_BoardVisibilityRestrict | null;
    };
  };
  board: {
    prefs?: {
      permissionLevel?: Board_Prefs_PermissionLevel;
    } | null;
  };
  isOrgAdmin: boolean;
}

export const canAddBoardToOrganization = ({
  org,
  board,
  isOrgAdmin,
}: CanAddBoardToOrganizationArgs) => {
  // Unpack the board's permission level / visibility
  const boardVisibility = board.prefs && board.prefs.permissionLevel;
  if (!boardVisibility) {
    return false;
  }

  // Delegate to the visibility check for the board attempting to be added to the org
  return canSetVisibilityOnBoard({ org, boardVisibility, isOrgAdmin });
};
