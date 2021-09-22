/*
 * Constants definining list of variables that can be defined to get substituted
 * when converting CML to HTML
 * e.g. `Hello %NAME%` in CML got rendered as `Hello John Doe` given 'John Doe' is the logged in user
 */

const exported = {
  NAME: 'NAME',
  USER_ID: 'USER_ID',
  HASHED_USER_ID: 'HASHED_USER_ID',
} as const;

export default exported;

export const { NAME, USER_ID, HASHED_USER_ID } = exported;
