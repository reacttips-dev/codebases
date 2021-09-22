/**
 * Constants representing the different save states for the quiz.
 */

export type AuthoringState = {
  id: number;
  message: string | JSX.Element;
  continueEdit?: boolean | undefined;
  isTransient?: boolean;
};

export const Loading: AuthoringState = {
  id: 0,
  message: '',
};

export const Idle: AuthoringState = {
  id: 1,
  message: '',
};

export const InProgress: AuthoringState = {
  id: 2,
  message: 'Saving...',
};

export const Success: AuthoringState = {
  id: 3,
  message: 'Changes are saved as a draft but not published.',
};

export const Error: AuthoringState = {
  id: 4,
  message: 'Error occurred while saving your changes.',
};

export const Conflict: AuthoringState = {
  id: 5,
  message: '',
};

export const PublishInProgress: AuthoringState = {
  id: 6,
  message: '',
};

export const Published: AuthoringState = {
  id: 7,
  message: 'Changes are published.',
};

export const NoChanges: AuthoringState = {
  id: 8,
  message: '',
};

export const RevertInProgress: AuthoringState = {
  id: 9,
  message: 'Reverting changes to draft...',
};

export const Reverted: AuthoringState = {
  id: 10,
  message: 'Successfully reverted to last published version.',
};

export const PublishError: AuthoringState = {
  id: 11,
  message: 'Error occurred while publishing your changes.',
};

export const PublishSlugError: AuthoringState = {
  id: 12,
  message: 'Error occurred while publishing your changes. The title must include at least one alphanumeric character',
};

export const RevertError: AuthoringState = {
  id: 13,
  message: 'Error occurred while reverting your changes.',
};

export const LoadError: AuthoringState = {
  id: 14,
  message: 'Error occurred while loading your draft.',
};

/**
 * this state is used for unversioned changes to assignments
 * unversioned changes are changes that get published right away when you save
 * for example, feedback type and default grade visibility
 */
export const SaveSuccess: AuthoringState = {
  id: 14,
  message: 'Changes are saved.',
};

export const PublishInvalid: AuthoringState = {
  id: 16,
  message: 'Please fix authoring errors before publishing.',
  isTransient: true,
};

export default {
  Loading,
  Idle,
  InProgress,
  Success,
  Error,
  Conflict,
  PublishInProgress,
  Published,
  NoChanges,
  RevertInProgress,
  Reverted,
  PublishError,
  PublishSlugError,
  RevertError,
  LoadError,
  SaveSuccess,
  PublishInvalid,
};
