import type BodyType from 'owa-service/lib/contract/BodyType';
import getDefaultComposeContentBlock from './getDefaultComposeContentBlock';
import createAppendOnSendBlock from './createAppendOnSendBlock';
import convertInlineCssForHtml from './convertInlineCssForHtml';

export default function buildReplyForwardMessageBody(body: string, bodyType: BodyType) {
    let newBody = bodyType == 'HTML' ? getDefaultComposeContentBlock() : '\n';
    if (body) {
        body = convertInlineCssForHtml(body, bodyType);
        newBody = newBody + createAppendOnSendBlock(bodyType) + body;
    }

    return newBody;
}
