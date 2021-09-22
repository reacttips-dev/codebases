import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import getMailTipsOperation from 'owa-service/lib/operation/getMailTipsOperation';
import getMailTipsRequest from 'owa-service/lib/factory/getMailTipsRequest';
import type GetMailTipsResponseMessage from 'owa-service/lib/contract/GetMailTipsResponseMessage';
import { getMailboxRequestOptions } from 'owa-request-options-types';
import { getUserMailboxInfo } from 'owa-client-ids';

/**
 * Makes the getMailTipsService call to the server to get mailtips response array for a sender and array of recipients
 * @param {string} sendingAs sender email address for getting mailtips
 * @param {string[]} recipients array of recipient email addresses for getting mailtips
 * @returns promise with MailTipsInformation array containing mailtips of the array of recipients
 */
export default function getMailTipsService(
    sendingAs: string,
    recipients: string[]
): Promise<GetMailTipsResponseMessage> {
    const requestOptions = getMailboxRequestOptions(getUserMailboxInfo(sendingAs));
    return getMailTipsOperation(
        {
            Header: getJsonRequestHeader(),
            Body: getMailTipsRequest({
                MailTipsRequested: 1,
                SendingAs: {
                    EmailAddress: sendingAs,
                },
                Recipients: recipients.map(emailAddress => {
                    return {
                        EmailAddress: emailAddress,
                    };
                }),
            }),
        },
        requestOptions
    )
        .then(response => {
            if (response?.Body && response.Body.ResponseClass == 'Success') {
                return response.Body;
            } else {
                return null;
            }
        })
        .catch(error => {
            return Promise.resolve(null);
        });
}
