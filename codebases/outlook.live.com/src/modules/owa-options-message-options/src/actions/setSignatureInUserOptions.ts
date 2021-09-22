import processSignatureHtmlForInlineImages from '../utils/processSignatureHtmlForInlineImages';
import { updateUserConfiguration } from 'owa-session-store';

export default function setSignatureInUserOptions(
    signatureHtml: string,
    signatureText: string
): void {
    updateUserConfiguration(userConfig => {
        const userOptions = userConfig.UserOptions;
        userOptions.SignatureHtml = processSignatureHtmlForInlineImages(signatureHtml);
        userOptions.SignatureText = signatureText;
    });
}
