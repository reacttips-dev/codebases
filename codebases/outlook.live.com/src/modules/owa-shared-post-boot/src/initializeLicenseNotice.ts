import { getPackageBaseUrl } from 'owa-config';

export default async function initializeLicenseNotice() {
    const url = getPackageBaseUrl() + 'scripts/ThirdPartyNotices.txt';
    try {
        const response = await fetch(url, { credentials: 'same-origin' });
        const content = await response.text();

        // This notice does not need to be localized.
        const comment = document.createComment(
            // tslint:disable-next-line:no-multiline-string
            `
THIRD-PARTY SOFTWARE NOTICES
This file is based on or incorporates material from the projects listed below (Third Party Code). The original copyright notice and the license under which Microsoft received such Third Party Code, are set forth below. Such licenses and notices are provided for informational purposes only. Microsoft licenses the Third Party Code to you under the licensing terms for the Microsoft product. Microsoft reserves all other rights not expressly granted under this agreement, whether by implication, estoppel or otherwise.

You may find a copy of the Corresponding Source code, if and as required under the Third Party Code License, either bundled with the Microsoft product or at http://3rdpartysource.microsoft.com. If not bundled with the product, you may also obtain a copy of the source code for a period of one year after our last shipment of this product.

=============

` + content
        );
        document.head.appendChild(comment);
    } catch (e) {
        // ignored if license cannot be retrieved
    }
}
