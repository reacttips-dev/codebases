import React from 'react';
import {
  FieldError as HookFieldError,
  Controller,
  RegisterOptions,
  FieldValues,
  DeepMap,
  Control,
} from 'react-hook-form';

export type HookFormProps = {
  rules?: RegisterOptions;
  name: string;
  control: Control;
  defaultValue?: string | string[] | number;
  error?: Record<string, any>;
};

export type FieldError = DeepMap<FieldValues, HookFieldError>;

export type FieldControllerProps<T> = {
  as: React.ComponentType<T>;
} & HookFormProps &
  T;

type ComponentProps<U> = {
  onChange?: (e: React.ChangeEvent<U>) => void;
  onBlur?: (e: React.FocusEvent<U>) => void;
  value?: any;
  name?: string;
  ref?: any;
  error?: Record<string, any>;
};

// T is the props for Component - it should extend HTMLElement
export const FieldController = <T extends ComponentProps<U>, U>({
  name,
  rules,
  as: Component,
  onChange,
  onBlur,
  control,
  defaultValue,
  ...rest
}: FieldControllerProps<T>) => (
  <Controller
    name={name}
    control={control}
    defaultValue={defaultValue}
    rules={rules}
    render={({ field, formState }) => (
      <Component
        {...field}
        error={resolve(name, formState.errors)}
        {...(rest as T)}
        name={name}
        onChange={(e: React.ChangeEvent<U>) => {
          field.onChange(e);
          if (onChange) {
            onChange(e);
          }
        }}
        onBlur={(e: React.FocusEvent<U>) => {
          field.onBlur();
          if (onBlur) {
            onBlur(e);
          }
        }}
      />
    )}
  />
);

/**
 * Gets nested values (errors) by string path (fieldName)
 * @param {string | string[]} path a nested field name ("options.0.description")
 * @param {FieldErrors<Record<string, any>>} errors via react-hook-form formState
 * @param {string} separator delimiter for splitting path segments
 * @returns {any}
 */
export function resolve(
  path: string | string[],
  errors: FieldError = {},
  separator = '.'
) {
  const properties = Array.isArray(path) ? path : path.split(separator);
  return properties.reduce((prev, curr) => prev && prev[curr], errors);
}
