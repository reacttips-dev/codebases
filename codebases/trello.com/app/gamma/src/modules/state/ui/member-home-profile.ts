import { Action, actionCreator } from '@trello/redux';
import { MemberResponse } from 'app/gamma/src/types/responses';
import { EmailErrors } from 'app/src/components/EmailError';

export interface MemberProfileParams {
  fullName?: string;
  initials?: string;
  username?: string;
  bio?: string;
}

export enum SaveMessages {
  SAVE = 'save',
  SAVING = 'saving',
  SAVED = 'saved',
}
export const ADD_NEW_EMAIL_REQUEST = Symbol('models/ADD_NEW_EMAIL_REQUEST');
export const ADD_NEW_EMAIL_SUCCESS = Symbol('models/ADD_NEW_EMAIL_SUCCESS');
export const ADD_NEW_EMAIL_ERROR = Symbol('models/ADD_NEW_EMAIL_ERROR');

export const UPDATE_MEMBER_PREFS = Symbol('models/UPDATE_MEMBER_PREFS');
export type UpdateMemberPrefsAction = Action<
  typeof UPDATE_MEMBER_PREFS,
  MemberResponse
>;

export const SAVE_PROFILE_START = Symbol('ui/SAVE_PROFILE_START');
export const SAVE_PROFILE_COMPLETE = Symbol('ui/SAVE_PROFILE_COMPLETE');
export const SAVE_PROFILE_RESET = Symbol('ui/SAVE_PROFILE_RESET');
export const SAVE_PROFILE_ERROR = Symbol('ui/SAVE_PROFILE_ERROR');

export const RESET_ADD_EMAIL_UI = Symbol('ui/RESET_ADD_EMAIL_UI');
type ResetAddEmailUiAction = Action<typeof RESET_ADD_EMAIL_UI, null>;
export const resetAddEmailUi = actionCreator<ResetAddEmailUiAction>(
  RESET_ADD_EMAIL_UI,
);

export enum SaveProfileErrors {
  None,
  BioTooLong,
  FullNameTooLong,
  FullNameTooShort,
  FullNameHasUrl,
  InitialsWrongLength,
  UsernameInvalid,
  UsernameTaken,
  UsernameTooLong,
  UsernameTooShort,
  Unknown,
}

export const saveProfileErrorMapping: { [key: string]: SaveProfileErrors } = {
  'username is taken': SaveProfileErrors.UsernameTaken,
  'username must be at least 3 characters': SaveProfileErrors.UsernameTooShort,
  'username must be at most 100 characters': SaveProfileErrors.UsernameTooLong,
  'username is invalid: only lowercase letters, underscores, and numbers are allowed':
    SaveProfileErrors.UsernameInvalid,
  'full name must be at least 1 character': SaveProfileErrors.FullNameTooShort,
  'full name must be at most 100 characters': SaveProfileErrors.FullNameTooLong,
  'full name must not contain a url': SaveProfileErrors.FullNameHasUrl,
  'initials must contain 1-4 characters': SaveProfileErrors.InitialsWrongLength,
  'invalid value for bio': SaveProfileErrors.BioTooLong,
};

export interface MemberHomeProfileSavingState {
  saveMessage: SaveMessages;
  saveErrors?: SaveProfileErrors[];
}

export const initialSavingState: MemberHomeProfileSavingState = {
  saveMessage: SaveMessages.SAVE,
};

interface MemberHomeAddEmailState {
  addingEmailRequestActive: boolean;
  addingEmailSuccess: boolean;
  addingEmailError: EmailErrors;
}

const initialAddEmailState: MemberHomeAddEmailState = {
  addingEmailRequestActive: false,
  addingEmailSuccess: false,
  addingEmailError: EmailErrors.None,
};

export interface MemberHomeProfileState
  extends MemberHomeProfileSavingState,
    MemberHomeAddEmailState {}

export const initialMemberHomeProfileState: MemberHomeProfileState = {
  ...initialSavingState,
  ...initialAddEmailState,
};
