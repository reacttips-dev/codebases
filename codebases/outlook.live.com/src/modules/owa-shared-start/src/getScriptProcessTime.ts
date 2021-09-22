export function getScriptProcessTime() {
    const scriptProcessStart = window.scriptProcessStart;
    let scriptProcessTime: { [index: string]: number } = {};
    if (scriptProcessStart) {
        const keys = Object.keys(scriptProcessStart);
        for (let ii = 0; ii < keys.length; ii++) {
            let key = keys[ii];
            let startTime = scriptProcessStart[key];
            let endTime = window.scriptProcessEnd?.[key];
            if (endTime != undefined) {
                scriptProcessTime[key] = endTime - startTime;
            } else {
                scriptProcessTime[key] = -1;
            }
        }
    }

    return scriptProcessTime;
}
