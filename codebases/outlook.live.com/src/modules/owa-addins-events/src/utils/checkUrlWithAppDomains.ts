// This file exists solely so that we can mock the osfruntime dependency Microsoft.Office.Common.XdmCommunicationManager.checkUrlWithAppDomains - we are currently
// unable to determine how to do so in Jasmine. If we figure out how to, this can be moved back to the DisplayDialog event where it originally belonged.

export default function checkUrlWithAppDomains(appdomains: string[], origin: string): boolean {
    return Microsoft.Office.Common.XdmCommunicationManager.checkUrlWithAppDomains(
        appdomains,
        origin
    );
}
