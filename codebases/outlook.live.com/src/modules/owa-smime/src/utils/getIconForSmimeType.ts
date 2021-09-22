import { ControlIcons } from 'owa-control-icons';
import SmimeType from 'owa-smime-adapter/lib/store/schema/SmimeType';
import RibbonRegular from 'owa-fluent-icons-svg/lib/icons/RibbonRegular';
import LockClosedRegular from 'owa-fluent-icons-svg/lib/icons/LockClosedRegular';

const getIconForSmimeType = (
    smimeType: SmimeType,
    hasDensityNext: boolean
): ControlIcons | 'RibbonRegular' | 'LockClosedRegular' => {
    switch (smimeType) {
        case SmimeType.Unknown:
        case SmimeType.Encrypted:
        case SmimeType.SignedThenEncrypted:
        case SmimeType.EncryptedThenSigned:
        case SmimeType.TripleWrapped:
            return hasDensityNext ? LockClosedRegular : ControlIcons.Lock;
        case SmimeType.ClearSigned:
        case SmimeType.OpaqueSigned:
            return hasDensityNext ? RibbonRegular : ControlIcons.Ribbon;
        case SmimeType.None:
        default:
            return null;
    }
};

export default getIconForSmimeType;
