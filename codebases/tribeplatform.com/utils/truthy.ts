export default function Truthy<T>(value: T | null | undefined): value is T {
  return Boolean(value)
}
