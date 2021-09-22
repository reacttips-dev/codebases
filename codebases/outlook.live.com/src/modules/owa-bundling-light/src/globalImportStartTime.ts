let globalImportStartTime: number | null;
export function getGlobalImportStartTime() {
    const timeTemp = globalImportStartTime;
    globalImportStartTime = null;
    return timeTemp;
}

export function setGlobalImportStartTime(time: number | null) {
    globalImportStartTime = time;
}
