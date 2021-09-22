import type BodyType from 'owa-service/lib/contract/BodyType';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

// Body type strings got from message body
const HTML_BODY_TYPE: BodyType = 'HTML';
const TEXT_BODY_TYPE: BodyType = 'Text';

// Markup type string got from user options
const HTML_MARKUP_TYPE: string = 'Html';

export default function getDefaultBodyType(): BodyType {
    const composeMarkup = getUserConfiguration().UserOptions.ComposeMarkup;
    const bodyType: BodyType = composeMarkup == HTML_MARKUP_TYPE ? 'HTML' : 'Text';
    return bodyType;
}

export { HTML_BODY_TYPE, TEXT_BODY_TYPE };
