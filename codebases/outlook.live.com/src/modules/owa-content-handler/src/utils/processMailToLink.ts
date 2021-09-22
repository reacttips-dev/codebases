import { replaceLineBreaksWithBrTags } from './contentConversion';
import encode from 'owa-encoding-utils/lib/utils/html/encode';
import { ComposeOperation, ComposeViewStateInitProps } from 'owa-mail-compose-store';
import getDefaultBodyType from 'owa-mail-compose-actions/lib/utils/getDefaultBodyType';
import type BodyType from 'owa-service/lib/contract/BodyType';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import { parse } from 'querystring';
import processRecipientsFromUrlParameter from 'owa-recipient-email-address/lib/utils/processRecipientsFromUrlParameter';

const MAIL_TO_URI_PROTOCOL = 'mailto:';
const MAIL_TO_FIRST_PARAM_SEPARATOR = '?';
const EMPTY_STRING = '';

const TO_PARAM_NAME = 'to';
const CC_PARAM_NAME = 'cc';
const BCC_PARAM_NAME = 'bcc';
const SUBJECT_PARAM_NAME = 'subject';
const BODY_PARAM_NAME = 'body';
const REPORTABUSE_PARAM_NAME = 'ra';
const ADDMEMBERS_PARAM_NAME = 'am';
const CREATEGROUP_PARAM_NAME = 'cg';
const SOURCE_PARAM_NAME = 'source';

export function processSubject(subject: string): string {
    if (!subject) {
        subject = EMPTY_STRING;
    }
    return subject;
}

export function processBody(body: string, bodyType: BodyType): string {
    if (body) {
        // For any HTML in the body, replace lineBreaks with <br> tags
        if (bodyType == 'HTML') {
            body = encode(body);
            body = replaceLineBreaksWithBrTags(body);
        }
    } else {
        body = EMPTY_STRING;
    }
    return body;
}

export default function processMailToLink(
    mailTo: string
): {
    composeInitProps: ComposeViewStateInitProps;
    additionalMailToLinkParams: any;
    isValid: boolean;
    errorMessage: string;
} {
    const toRecipients: EmailAddressWrapper[] = [];
    const ccRecipients: EmailAddressWrapper[] = [];
    const bccRecipients: EmailAddressWrapper[] = [];
    let subject: string;
    let body: string;
    let errorMessage: string;
    let isReportAbuseMailToLink: boolean;
    let isAddMembersMailToLink: boolean;
    let isCreateGroupMailToLink: boolean;
    let mailToLinkSource: string;

    // We know the link starts with 'mailto:' because of the selector, but if it contains nothing more than that, do nothing.
    if (mailTo.length > MAIL_TO_URI_PROTOCOL.length) {
        // Remove the 'mailto:' prefix, and split based on the first separator.
        mailTo = mailTo.substr(MAIL_TO_URI_PROTOCOL.length);
        const parts: string[] = mailTo.split(MAIL_TO_FIRST_PARAM_SEPARATOR);
        // If the link contains more than one '?', it is invalid.
        if (parts.length <= 2) {
            // decodeURIComponent and parse (which uses decodeURIComponent) can choke on malformed URIs.
            // Catch these errors to "fail gracefully".
            try {
                // First part is the addresses, but we need to decode and process them
                processRecipientsFromUrlParameter(decodeURIComponent(parts[0]), toRecipients);
                // Second part is the parameters, parse the URL and collect the values.
                if (parts[1]) {
                    const parsedMailTo = parse(parts[1]);
                    Object.keys(parsedMailTo).forEach(parameterName => {
                        // parse will return an array of values if there are multiple instances of the same parameter.
                        // This behavior is marked as "SHOULD NOT" in the MailTo schema, as clients handle it as they choose.
                        // If this is the case, just take the first one.
                        let paramValue = parsedMailTo[parameterName];
                        if (Array.isArray(paramValue)) {
                            paramValue = paramValue[0];
                        }
                        switch (parameterName.toLowerCase()) {
                            case TO_PARAM_NAME:
                                processRecipientsFromUrlParameter(paramValue, toRecipients);
                                break;
                            case CC_PARAM_NAME:
                                processRecipientsFromUrlParameter(paramValue, ccRecipients);
                                break;
                            case BCC_PARAM_NAME:
                                processRecipientsFromUrlParameter(paramValue, bccRecipients);
                                break;
                            case SUBJECT_PARAM_NAME:
                                // Only take the subject if we don't already have one. Honoring the first param.
                                if (!subject) {
                                    subject = paramValue;
                                }
                                break;
                            case BODY_PARAM_NAME:
                                // Only take the body if we don't already have one. Honoring the first param.
                                if (!body) {
                                    body = paramValue;
                                }
                                break;
                            case REPORTABUSE_PARAM_NAME:
                                isReportAbuseMailToLink = true;
                                break;
                            case ADDMEMBERS_PARAM_NAME:
                                isAddMembersMailToLink = true;
                                break;
                            case CREATEGROUP_PARAM_NAME:
                                isCreateGroupMailToLink = true;
                                break;
                            case SOURCE_PARAM_NAME:
                                mailToLinkSource = paramValue;
                                break;
                        }
                    });
                }
            } catch (error) {
                // If we hit an exception, save the message to log in the datapoint. No further logic is required here.
                // If we managed to get enough information for isValid to be true, we can start compose with a subset of the intended params.
                errorMessage = error.message;
            }
        }
    }

    const isValid =
        toRecipients.length > 0 ||
        ccRecipients.length > 0 ||
        bccRecipients.length > 0 ||
        !!body ||
        !!subject;

    const bodyType = getDefaultBodyType();
    const processedBody = processBody(body, bodyType);
    const processedSubject = processSubject(subject);
    return {
        composeInitProps: {
            operation: ComposeOperation.New,
            bodyType: bodyType,
            itemId: null,
            subject: processedSubject,
            newContent: processedBody,
            to: toRecipients,
            cc: ccRecipients,
            bcc: bccRecipients,
            referenceItemId: null,
            preferAsyncSend: true,
        },
        additionalMailToLinkParams: {
            isReportAbuseMailToLink: isReportAbuseMailToLink,
            isAddMembersMailToLink: isAddMembersMailToLink,
            isCreateGroupMailToLink: isCreateGroupMailToLink,
            mailToLinkSource: mailToLinkSource,
        },
        isValid: isValid,
        errorMessage: errorMessage,
    };
}
