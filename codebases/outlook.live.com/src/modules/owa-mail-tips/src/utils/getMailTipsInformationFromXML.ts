import type MailTipsInformation from '../store/schema/MailTipsInformation';
import MailTipsXMLElements from '../store/schema/MailTipsXMLElements';
import { GuestMailTipStatus } from '../store/schema/GuestMailTipStatus';

const COMMENT_TAG_REGEX = /<!--((.|\n)*?)-->/gi;
const OOF_MESSAGE_BODY: string = 'ReplyBody';

const getNodesArray = (nodes: NodeListOf<Node & ChildNode>): (Node & ChildNode)[] => {
    const nodesArray = [];
    for (let i = 0; i < nodes.length; i++) {
        nodesArray.push(nodes[i]);
    }
    return nodesArray;
};

/**
 * Parse XML response from GetMailTips service call into MailTipsInformation using DOMParser API.
 * @param {string} inputXML XML string containing mailtip information for a single recipient.
 * @returns MailTipsInformation populated in JSON response.
 */
export default function getMailTipsInformationFromXML(inputXML: string): MailTipsInformation {
    if (!inputXML) {
        return null;
    }
    const GET_MAILTIPS_MIME_TYPE = 'text/xml';
    const parser = new DOMParser();
    // Create DOM from XML
    const doc = parser.parseFromString(inputXML, GET_MAILTIPS_MIME_TYPE);

    const nodes = doc.firstChild.childNodes;
    return getNodesArray(nodes).reduce(
        (
            mailTipsInformation: MailTipsInformation,
            node: Node & ChildNode & { localName: string }
        ) => {
            switch (node.localName) {
                case MailTipsXMLElements.RecipientAddress:
                    if (node.childNodes.length > 1) {
                        mailTipsInformation.RecipientAddress = node.childNodes[1].textContent;
                    }
                    break;
                case MailTipsXMLElements.MailboxFull:
                    mailTipsInformation.MailboxFull = node.textContent === 'true';
                    break;
                case MailTipsXMLElements.IsModerated:
                    mailTipsInformation.IsModerated = node.textContent === 'true';
                    break;
                case MailTipsXMLElements.TotalMemberCount:
                    mailTipsInformation.TotalMemberCount = parseInt(node.textContent) || 0;
                    break;
                case MailTipsXMLElements.ExternalMemberCount:
                    mailTipsInformation.ExternalMemberCount = parseInt(node.textContent) || 0;
                    break;
                case MailTipsXMLElements.MaxMessageSize:
                    mailTipsInformation.MaxMessageSize = parseInt(node.textContent) || 0;
                    break;
                case MailTipsXMLElements.DeliveryRestricted:
                    mailTipsInformation.DeliveryRestricted = node.textContent === 'true';
                    break;
                case MailTipsXMLElements.PreferAccessibleContent:
                    mailTipsInformation.PreferAccessibleContent = node.textContent === 'true';
                    break;
                case MailTipsXMLElements.OutOfOffice:
                    mailTipsInformation.OutOfOffice = getOutOfOfficeMailBody(node);
                    break;
                case MailTipsXMLElements.CustomMailTip:
                    mailTipsInformation.CustomMailTip = getTextContent(node);
                    break;
                case MailTipsXMLElements.GuestMailTipStatus:
                    mailTipsInformation.GuestStatus = getGuestStatus(node.textContent);
                    break;
                default:
                    break;
            }
            return mailTipsInformation;
        },
        {}
    );
}

/**
 * returns text content from OOF message reply body
 */
export const getOutOfOfficeMailBody = (node: Node): string => {
    if (node.childNodes) {
        const oofMessageBody = getNodesArray(node.childNodes).filter(
            (childNode: Node & ChildNode & { localName: string }) =>
                childNode.localName === OOF_MESSAGE_BODY
        )[0];
        // Add space between different anchor tags so that consecutive email addresses don't get combined.
        return getTextContent(oofMessageBody);
    }
    return '';
};

/**
 * Removes comment element from HTML string
 */
export const removeCommentsTag = (html: string) => html.replace(COMMENT_TAG_REGEX, '');

/**
 * Gets GuestMailTipStatus from XML string
 */
const getGuestStatus = (guestStatus: string): GuestMailTipStatus => {
    const guestMailTips = guestStatus.split(' ');
    let guestMailTipStatus = GuestMailTipStatus.None;
    guestMailTips.map(status => {
        guestMailTipStatus |= GuestMailTipStatus[status];
    });
    return guestMailTipStatus;
};

/**
 * Removes all HTML content and returns the text from the node
 */
export function getTextContent(node: Node & ChildNode) {
    if (node) {
        const encodedHtml = removeCommentsTag(node.textContent).replace(/<\/a>/gi, '</a> ');
        const htmlParser = new DOMParser();
        const html = htmlParser.parseFromString(encodedHtml, 'text/html');
        if (html?.childNodes?.length && html.childNodes[0].textContent) {
            return html.childNodes[0].textContent.replace(/\s\s+/g, ' ').trim();
        }
    }
    return '';
}
