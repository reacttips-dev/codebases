import type { FromViewState } from 'owa-mail-compose-store';
import type Message from 'owa-service/lib/contract/Message';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import singleRecipientType from 'owa-service/lib/factory/singleRecipientType';
import extendedPropertyType from 'owa-service/lib/factory/extendedPropertyType';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';

const SHARING_INSTANCE_GUID_PRIOERTYID = 0x8a1c;

export default function setFromInfoToMessage(viewState: FromViewState, message: Message) {
    const from = viewState.from;
    if (from) {
        let isConnectedAccount = false;

        const connectAccountInfos = getUserConfiguration().SessionSettings.ConnectedAccountInfos;
        if (connectAccountInfos) {
            for (let i = 0; i < connectAccountInfos.length; i++) {
                const connectAccountInfo = connectAccountInfos[i];
                if (connectAccountInfo.EmailAddress == from.email.EmailAddress) {
                    isConnectedAccount = true;
                    const extendedProperty = extendedPropertyType({
                        Value: connectAccountInfo.SubscriptionGuid,
                        ExtendedFieldURI: extendedPropertyUri({
                            PropertyId: SHARING_INSTANCE_GUID_PRIOERTYID,
                            DistinguishedPropertySetId: 'Sharing',
                            PropertyType: 'CLSID',
                        }),
                    });

                    if (message.ExtendedProperty) {
                        message.ExtendedProperty.push(extendedProperty);
                    } else {
                        message.ExtendedProperty = [extendedProperty];
                    }

                    message.From = singleRecipientType({
                        Mailbox: {
                            MailboxType: from.email.MailboxType,
                            RoutingType: 'SMTP',
                            EmailAddress: from.email.EmailAddress,
                            Name: connectAccountInfo.DisplayName,
                        },
                    });

                    break;
                }
            }
        }

        if (!isConnectedAccount) {
            message.From = singleRecipientType({
                Mailbox: from.email,
            });
        }
    }
}
