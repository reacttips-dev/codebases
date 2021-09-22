export default function convertEwsIdToRestId(ewsId: string | null): string | null {
    if (!ewsId) {
        return ewsId;
    }

    // Replace all + with _
    // Replace all / with -
    let retId = ewsId.replace(/\+/g, '_');
    retId = retId.replace(/\//g, '-');
    return retId;
}
