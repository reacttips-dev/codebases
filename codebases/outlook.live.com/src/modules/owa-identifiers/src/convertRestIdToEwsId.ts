export default function convertRestIdToEwsId(restId: string | null): string | null {
    if (!restId) {
        return restId;
    }

    // Replace all _ with +
    // Replace all - with /
    let retId = restId.replace(/_/g, '+');
    retId = retId.replace(/-/g, '/');
    return retId;
}
