import React from 'react';
import { FormLabel } from '../FormLabel';
import { Input } from '../Input';
import { Textarea } from '../Textarea';
import { FormControl, FormErrorMessage, FormHelperText } from './formControl';
export const TextInput = React.forwardRef(({ name, label, error, helperText, isDisabled, ...rest }, ref) => (React.createElement(FormControl, { id: name, isInvalid: !!error, isDisabled: isDisabled },
    label && React.createElement(FormLabel, { htmlFor: name }, label),
    React.createElement(Input, Object.assign({}, rest, { name: name, ref: ref })),
    helperText && React.createElement(FormHelperText, null, helperText),
    React.createElement(FormErrorMessage, null, error))));
export const TextareaInput = React.forwardRef(({ name, label, error, helperText, ...rest }, ref) => (React.createElement(FormControl, { id: name, isInvalid: !!error },
    label && React.createElement(FormLabel, { htmlFor: name }, label),
    React.createElement(Textarea, Object.assign({}, rest, { name: name, ref: ref })),
    helperText && React.createElement(FormHelperText, null, helperText),
    React.createElement(FormErrorMessage, null, error))));
//# sourceMappingURL=input.js.map