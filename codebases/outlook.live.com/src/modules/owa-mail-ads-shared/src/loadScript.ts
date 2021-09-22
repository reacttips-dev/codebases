let loadedScriptsCallbacks: { [id: string]: Promise<void> } = {};

let successfulLoadedScripts: string[];

export function loadScript(url: string, addCrossOriginAnonymous = true): Promise<void> {
    if (
        !loadedScriptsCallbacks[url] ||
        !successfulLoadedScripts ||
        successfulLoadedScripts.indexOf(url) == -1
    ) {
        loadedScriptsCallbacks[url] = new Promise((resolve, reject) => {
            var element = window.document.createElement('script');
            element.src = url;
            element.type = 'text/javascript';
            if (addCrossOriginAnonymous) {
                element.crossOrigin = 'anonymous';
            }
            element.onload = () => {
                successfulLoadedScripts
                    ? successfulLoadedScripts.push(url)
                    : (successfulLoadedScripts = [url]);
                resolve();
            };
            element.onerror = () => {
                reject('OnError ' + url);
            };
            window.document.head.appendChild(element);
        });
    }

    return loadedScriptsCallbacks[url];
}

export function test_clearScriptLoadTestHook() {
    loadedScriptsCallbacks = {};
    successfulLoadedScripts = undefined;
}
