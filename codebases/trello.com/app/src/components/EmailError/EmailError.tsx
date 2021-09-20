import { forNamespace } from '@trello/i18n';
import React from 'react';

const formatError = forNamespace(['email error']);

export enum EmailErrors {
  None = 'none',
  TheEmailAddressIsAlreadyInUse = 'address in use',
  ThisEmailIsAlreadyOnThisAccount = 'on account',
  InvalidEmailAddress = 'invalid email address',
  TheEmailAddressIsFromAForbiddenDomain = 'email domain forbidden',
  EmailAddressIsNotOnAnApprovedDomain = 'email not on approved domain',
  RouteNotFound = 'not found',
  Unknown = 'unknown',
}

export const emailErrorMapping = (message: string) => {
  const mapping: { [key: string]: EmailErrors } = {
    'the email address is already in use':
      EmailErrors.TheEmailAddressIsAlreadyInUse,
    'this email is already on this account':
      EmailErrors.ThisEmailIsAlreadyOnThisAccount,
    'invalid email address': EmailErrors.InvalidEmailAddress,
    'the email address is from a forbidden domain':
      EmailErrors.TheEmailAddressIsFromAForbiddenDomain,
    'email address is not on an approved domain':
      EmailErrors.EmailAddressIsNotOnAnApprovedDomain,
    'not found': EmailErrors.RouteNotFound,
  };

  message = message.trim().toLowerCase();

  return mapping[message];
};

interface EmailErrorProps {
  error: EmailErrors;
  email: string;
  children: (errorMessage: string) => React.ReactElement | null;
}

export const EmailError: React.FC<EmailErrorProps> = ({
  error,
  email,
  children,
}) => {
  let options;

  if (error === EmailErrors.TheEmailAddressIsFromAForbiddenDomain) {
    options = { domain: email.split('@')[1] };
  }

  return error && error !== EmailErrors.None
    ? children(formatError(error, options))
    : null;
};
