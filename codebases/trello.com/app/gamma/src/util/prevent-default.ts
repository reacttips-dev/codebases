/* eslint-disable import/no-default-export, @trello/disallow-filenames */
export interface FormValues {
  [name: string]: string | number;
}

export interface Callback {
  (arg: React.FormEvent<Element> | FormValues): void;
}

export default (fn: Callback, getFormValues = false) => (
  e: React.FormEvent<Element>,
) => {
  e.preventDefault();

  if (!getFormValues) {
    return fn(e);
  }

  fn(
    Array.from(e.currentTarget as HTMLFormElement).reduce(
      (formValues: FormValues, el: HTMLInputElement) => {
        if (el.name) {
          formValues[el.name] = el.value;
        }

        return formValues;
      },
      {},
    ),
  );
};
