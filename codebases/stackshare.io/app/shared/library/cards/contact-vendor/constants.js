import {
  SET_FIRST_NAME,
  SET_EMAIL,
  SET_LAST_NAME,
  SET_PHONE,
  SET_COMPANY,
  SET_ROLE,
  SET_MESSAGE
} from './state/actions';

export const STEP_DIRECT_LINK = 'direct_link';
export const STEP_OPTIONS_MODAL = 'options_modal';
export const STEP_CONTACT_FORM = 'contact_form';
export const MODAL_STEPS = [STEP_OPTIONS_MODAL, STEP_CONTACT_FORM];

import TextInput from '../../inputs/text';
import TextAreaInput from '../../inputs/text-area';

import {Field, WideField} from './shared';

const FIRST_NAME = 'firstName';
const EMAIL = 'email';
const LAST_NAME = 'lastName';
const PHONE = 'phone';
const COMPANY = 'company';
const ROLE = 'role';
const MESSAGE = 'message';

export const FIELDS = {
  [FIRST_NAME]: {
    label: 'First Name',
    placeholder: 'First Name',
    action: SET_FIRST_NAME,
    required: true,
    WrapperComponent: Field,
    InputComponent: TextInput
  },
  [LAST_NAME]: {
    label: 'Last Name',
    placeholder: 'Last Name',
    action: SET_LAST_NAME,
    required: true,
    WrapperComponent: Field,
    InputComponent: TextInput
  },
  [EMAIL]: {
    label: 'Email',
    placeholder: 'Email',
    action: SET_EMAIL,
    required: true,
    WrapperComponent: Field,
    InputComponent: TextInput
  },
  [PHONE]: {
    label: 'Phone',
    placeholder: 'Phone',
    action: SET_PHONE,
    required: false,
    WrapperComponent: Field,
    InputComponent: TextInput
  },
  [COMPANY]: {
    label: 'Company',
    placeholder: 'Company',
    action: SET_COMPANY,
    required: false,
    WrapperComponent: Field,
    InputComponent: TextInput
  },
  [ROLE]: {
    label: 'Role',
    placeholder: 'Role',
    action: SET_ROLE,
    required: false,
    WrapperComponent: Field,
    InputComponent: TextInput
  },
  [MESSAGE]: {
    label: 'Message',
    placeholder: 'Message',
    action: SET_MESSAGE,
    required: false,
    WrapperComponent: WideField,
    InputComponent: TextAreaInput
  }
};
