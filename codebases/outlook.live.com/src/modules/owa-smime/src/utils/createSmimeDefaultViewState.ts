import type SmimeViewState from 'owa-smime-types/lib/schema/SmimeViewState';
import SmimeType from 'owa-smime-adapter/lib/store/schema/SmimeType';
import SmimeErrorStateEnum from 'owa-smime-adapter/lib/store/schema/SmimeErrorStateEnum';
import SmimeContext from 'owa-smime-types/lib/schema/SmimeContext';
import SmimeBccForkingMode from 'owa-smime-types/lib/schema/SmimeBccForkingMode';

export const generateSmimeViewState = (
    shouldEncryptMessageAsSmime = false,
    shouldSignMessageAsSmime = false,
    errorCode = SmimeErrorStateEnum.NoError
): SmimeViewState => {
    return {
        shouldEncryptMessageAsSmime,
        shouldSignMessageAsSmime,
        signingCertRawData: null,
        errorCode,
        errorContext: SmimeContext.Unspecified,
        smimeBccForkingMode: SmimeBccForkingMode.None,
        currentBccRecipientIndex: -1,
    };
};

export default function createSmimeDefaultViewState(smimeType?: SmimeType): SmimeViewState {
    switch (smimeType) {
        case SmimeType.Encrypted:
            return generateSmimeViewState(
                true /* shouldEncryptMessageAsSmime */,
                false /* shouldSignMessageAsSmime */
            );
        case SmimeType.OpaqueSigned:
        case SmimeType.ClearSigned:
            return generateSmimeViewState(
                false /* shouldEncryptMessageAsSmime */,
                true /* shouldSignMessageAsSmime */
            );
        case SmimeType.SignedThenEncrypted:
        case SmimeType.EncryptedThenSigned:
        case SmimeType.TripleWrapped:
            return generateSmimeViewState(
                true /* shouldEncryptMessageAsSmime */,
                true /* shouldSignMessageAsSmime */
            );
        case SmimeType.Unknown:
        case SmimeType.None:
        default:
            return generateSmimeViewState();
    }
}
