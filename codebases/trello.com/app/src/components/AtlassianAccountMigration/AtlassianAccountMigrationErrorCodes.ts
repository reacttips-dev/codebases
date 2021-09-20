// eslint-disable-next-line @trello/export-matches-filename
export enum AtlassianAccountMigrationErrorCodes {
  EMAIL_MISMATCH = 'EMAIL_MISMATCH',
}

export function getErrorCode(val: string) {
  switch (val) {
    case 'emailMismatchError':
      return AtlassianAccountMigrationErrorCodes.EMAIL_MISMATCH;
    default:
      return null;
  }
}
