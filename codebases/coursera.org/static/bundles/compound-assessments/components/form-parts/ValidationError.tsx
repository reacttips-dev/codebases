import React from 'react';

import _t from 'i18n!nls/compound-assessments';

import initBem from 'js/lib/bem';

import { P } from '@coursera/coursera-ui';

import 'css!./__styles__/ValidationError';

const bem = initBem('ValidationErrorCA');

type Props = {
  id?: string;
  message?: React.ReactNode;
  className?: string;
};

const ValidationError: React.FC<Props> = ({ message, className, id }: Props) => (
  <P rootClassName={bem(undefined, undefined, className)} id={id ? `validation-error-${id}` : undefined}>
    {message || _t("Warning: You haven't provided an answer for this question")}
  </P>
);

export default ValidationError;
