import type { FromViewState } from 'owa-mail-compose-store';
import type PostItem from 'owa-service/lib/contract/PostItem';
import singleRecipientType from 'owa-service/lib/factory/singleRecipientType';

export default function setFromInfoToMessage(viewState: FromViewState, post: PostItem) {
    const from = viewState.from;
    post.From = singleRecipientType({
        Mailbox: from.email,
    });
}
