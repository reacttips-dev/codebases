export function getChangedValues<T extends Record<string, any>>(
  initialValues: T,
  submittedValues: Partial<T>
): Partial<T> {
  return Object.keys(submittedValues).reduce((updates, el) => {
    if (submittedValues[el] !== initialValues[el]) {
      return {
        ...updates,
        [el]: submittedValues[el],
      };
    }
    return updates;
  }, {});
}
