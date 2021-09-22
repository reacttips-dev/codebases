/**
 * Utility to evaluate and display warnings for deprecated props.
 */
export default function useDeprecatedProp<T>(
  prop: T,
  deprecatedProp: T,
  deprecationMessage: string
): T {
  if (deprecatedProp) {
    if (__DEV__) {
      console.error(`Coursera Design System: ${deprecationMessage}`);
    }
  }

  if (prop) {
    return prop;
  }

  return deprecatedProp;
}
