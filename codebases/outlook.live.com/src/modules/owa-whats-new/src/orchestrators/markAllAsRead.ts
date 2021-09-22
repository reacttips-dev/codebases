import { getStore } from '../store/store';
import { WhatsNewCardStatus } from '../store/schema/WhatsNewCardStatus';
import { putWhatsNew } from '../services/putWhatsNew';
import { markWhatsNewCardAsRead } from '../mutators/markWhatsNewCardAsRead';
import { toggleWhatsNewCardHoverStatus } from '../mutators/toggleWhatsNewCardHoverStatus';
import { WhatsNewCardIdentity } from '../store/schema/WhatsNewCardIdentity';
import { TaskQueue } from 'owa-task-queue';

interface MarkWhatsNewCardAsReadTaskProps {
    id: WhatsNewCardIdentity;
}

const markAllAsReadTaskQueue = new TaskQueue<MarkWhatsNewCardAsReadTaskProps>(
    1 /* max concurrent task */,
    markWhatsNewCardAsReadTask /* task callback */,
    150 /* task delay */
);

async function markWhatsNewCardAsReadTask(props: MarkWhatsNewCardAsReadTaskProps): Promise<void> {
    await putWhatsNew(props.id);
}

export function markAllAsRead() {
    let store = getStore();

    if (store.cards) {
        Object.keys(store.cards).forEach(key => {
            toggleWhatsNewCardHoverStatus(store.cards[key], false);

            if (store.cards[key].status == WhatsNewCardStatus.Unread) {
                markWhatsNewCardAsRead(store.cards[key]);
                markAllAsReadTaskQueue.add({ id: store.cards[key].identity });
            }
        });
    }
}
