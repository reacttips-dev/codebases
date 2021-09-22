const errorMessages = {
  EXCEEDS_MAX_LENGTH: 'Darn it. Space names must be under 100 characters, please select a different name.',
  STARTS_WITH_ILLEGAL_CHAR: 'Darn it. Space cannot start or end with periods or spaces in order to support desktop syncing. Please select a different name.',
  ENDS_WITH_ILLEGAL_CHAR: 'Darn it. Space cannot start or end with periods or spaces in order to support desktop syncing. Please select a different name.',
  CONTAINS_ILLEGAL_CHAR: 'Darn it. Space names cannot include / \\ : * ? " < > | in order to support desktop syncing. Please select a different name.',
  TITLE_NOT_UNIQUE: 'Try again. Looks like you already have a space with that name.'
}

export default errorMessages
