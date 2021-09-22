// EWS item items will be longer given their longer byte size
export function isImmutableId(id: string) {
    if (!id) {
        return false;
    }
    return id.length < 90;
}
