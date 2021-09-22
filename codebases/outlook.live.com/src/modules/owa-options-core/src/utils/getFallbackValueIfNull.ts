export default function getFallbackValueIfNull<T>(value: T | null, fallback: T) {
    return value === null ? fallback : value;
}
