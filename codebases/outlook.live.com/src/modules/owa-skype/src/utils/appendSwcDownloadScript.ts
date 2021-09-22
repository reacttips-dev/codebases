export default function appendSwcDownloadScript(): void {
    let swcDownloadScript = document.createElement('script');
    swcDownloadScript.type = 'text/javascript';
    swcDownloadScript.setAttribute('data-style', 'outlook');
    swcDownloadScript.setAttribute('data-manual-boot', 'true');
    swcDownloadScript.crossOrigin = 'anonymous';

    let src = 'https://swc.cdn.skype.com/sdk/v1/sdk.min.js';

    swcDownloadScript.src = src;

    document.head.appendChild(swcDownloadScript);
}
