export enum OrganizationErrorExtensions {
  ORG_NAME_TAKEN = 'ORG_NAME_TAKEN',
  ORG_NAME_SHORT = 'ORG_NAME_SHORT',
  ORG_NAME_INVALID = 'ORG_NAME_INVALID',
  ORG_DISPLAY_NAME_SHORT = 'ORG_DISPLAY_NAME_SHORT',
  ORG_DISPLAY_NAME_LONG = 'ORG_DISPLAY_NAME_LONG',
  ORG_INVALID_TEAM_TYPE = 'ORG_INVALID_TEAM_TYPE',
  GM_ERROR = 'GM_ERROR',
}

export const OrganizationErrors: Record<string, OrganizationErrorExtensions> = {
  'Organization short name must be at least 3 characters':
    OrganizationErrorExtensions.ORG_NAME_SHORT,
  'Organization short name is taken':
    OrganizationErrorExtensions.ORG_NAME_TAKEN,
  'Organization name is invalid': OrganizationErrorExtensions.ORG_NAME_INVALID,
  'Display Name cannot begin or end with a space':
    OrganizationErrorExtensions.ORG_NAME_INVALID,
  'invalid value for teamType':
    OrganizationErrorExtensions.ORG_INVALID_TEAM_TYPE,
  'Display Name must be at least 3 characters':
    OrganizationErrorExtensions.ORG_DISPLAY_NAME_SHORT,
  'Display Name must be at most 100 characters':
    OrganizationErrorExtensions.ORG_DISPLAY_NAME_LONG,
  'Could not process image': OrganizationErrorExtensions.GM_ERROR,
  'Not a valid image format': OrganizationErrorExtensions.GM_ERROR,
};
