import type { MailboxInfo } from 'owa-client-ids';
import type { ConversationFork } from 'owa-graph-schema';
import { ClientItem, mailStore } from 'owa-mail-store';
import type Message from 'owa-service/lib/contract/Message';
import { mutatorAction } from 'satcheljs';
import type ItemId from 'owa-service/lib/contract/ItemId';
import type SingleRecipientType from 'owa-service/lib/contract/SingleRecipientType';
import type IconIndexType from 'owa-service/lib/contract/IconIndexType';
import type ImportanceType from 'owa-service/lib/contract/ImportanceType';
import type FlagType from 'owa-service/lib/contract/FlagType';
import type FolderId from 'owa-service/lib/contract/FolderId';

export const addForkItemToMailStore = mutatorAction(
    'addForkItemToMailStore',
    (fork: ConversationFork, mailboxInfo: MailboxInfo) => {
        const itemId = fork.id as string;
        if (!mailStore.items.has(itemId)) {
            const message: Partial<Message> = {
                ItemId: {
                    Id: itemId,
                },
                Categories: fork.Categories as string[],
                ConversationId: fork.ConversationId as ItemId,
                DateTimeReceived: fork.DateTimeReceived as string,
                DateTimeSent: fork.DateTimeSent as string,
                DisplayTo: fork.DisplayTo as string,
                Flag: fork.Flag as FlagType,
                From: fork.From as SingleRecipientType,
                HasAttachments: fork.HasAttachments as boolean,
                IconIndex: fork.IconIndex as IconIndexType,
                Importance: fork.Importance as ImportanceType,
                InstanceKey: fork.InstanceKey as string,
                IsDraft: fork.IsDraft as boolean,
                IsRead: fork.IsRead as boolean,
                IsExternalSender: fork.IsExternalSender as boolean,
                ItemClass: fork.ItemClass as string,
                MentionedMe: fork.MentionedMe as boolean,
                ParentFolderId: fork.ParentFolderId as FolderId,
                Preview: fork.Preview as string,
                ReceivedOrRenewTime: fork.ReceivedOrRenewTime as string,
                Size: fork.Size as number,
                Subject: fork.Subject as string,
            };

            const clientItem: ClientItem = {
                ...message,
                MailboxInfo: mailboxInfo,
            };

            mailStore.items.set(itemId, clientItem);
        }
    }
);
