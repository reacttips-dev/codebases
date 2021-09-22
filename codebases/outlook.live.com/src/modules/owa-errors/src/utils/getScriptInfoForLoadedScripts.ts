// debug info for a script that is loaded in the page
export interface ScriptInfo {
    src: string;
    cors: string | null;
    parentNode: string;
    baseUri: string;
    attributes: string;
}

export default function getScriptInfoForLoadedScripts() {
    const scriptInfos: ScriptInfo[] = [];

    const allScripts = document.getElementsByTagName('script');
    for (let i = 0; i < allScripts.length; i++) {
        const script = allScripts[i];

        const parentNode = script.parentNode?.nodeName
            ? script.parentNode.nodeName
            : '[unknown parent node]';
        const attributes: string[] = [];

        for (let j = 0; j < script.attributes.length; j++) {
            const attr = script.attributes[j];
            attributes.push(attr.name + ':' + attr.value);
        }

        scriptInfos.push({
            src: script.src || 'INLINE',
            cors: script.crossOrigin,
            parentNode: parentNode,
            baseUri: script.baseURI,
            attributes: attributes.join(','),
        });
    }

    return scriptInfos;
}
