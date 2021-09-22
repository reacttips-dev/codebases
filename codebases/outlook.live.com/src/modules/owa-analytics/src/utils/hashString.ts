import sha256 from 'hash.js/lib/hash/sha/256';

export function hashString(value: string): string | undefined {
    return value ? sha256().update(value.toLowerCase()).digest('hex') : '';
}
