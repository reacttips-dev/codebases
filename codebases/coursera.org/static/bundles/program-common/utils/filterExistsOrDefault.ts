function exists<TValue>(value: TValue | undefined | null): value is TValue {
  return value != null;
}

export default function filterExistsOrDefault<TElement>(
  array: (TElement | undefined | null)[] | undefined | null,
  defaultValue: TElement[] = []
): TElement[] {
  return array?.filter(exists) ?? defaultValue;
}
