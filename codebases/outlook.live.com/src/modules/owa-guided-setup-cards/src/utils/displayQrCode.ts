import { displayQRCodeForConsumer } from '../utils/getQRCodeForConsumer';
import { displayQRCodeForEnterprise } from '../utils/getQRCodeForEnterprise';
import isBusiness from 'owa-session-store/lib/utils/isBusiness';

export default function displayQrCode(onDismiss?: () => void) {
    if (isBusiness()) {
        displayQRCodeForEnterprise(onDismiss);
    } else {
        displayQRCodeForConsumer(onDismiss);
    }
}
