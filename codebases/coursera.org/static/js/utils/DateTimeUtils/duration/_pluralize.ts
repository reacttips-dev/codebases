export function _pluralize<S, P>(value: number, single: S, plural: P): S | P {
  return value === 1 ? single : plural;
}
