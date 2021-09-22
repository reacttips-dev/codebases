import { getWhatsNewCardProperty } from '../utils/getWhatsNewCardProperty';
import type { WhatsNewCardIdentity } from '../store/schema/WhatsNewCardIdentity';

export async function isWhatsNewCardEnabled(identity: WhatsNewCardIdentity): Promise<boolean> {
    const clientOptions = getWhatsNewCardProperty(identity);

    if (clientOptions) {
        let isHidden = clientOptions.isHidden;

        if (isHidden) {
            let hidden = await isHidden();
            return !hidden;
        }

        return true;
    }

    return false;
}
