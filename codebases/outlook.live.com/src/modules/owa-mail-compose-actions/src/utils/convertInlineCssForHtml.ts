import type BodyType from 'owa-service/lib/contract/BodyType';
import { HtmlSanitizer } from 'roosterjs-editor-dom';

export default function convertInlineCssForHtml(source: string, bodyType: BodyType): string {
    return bodyType == 'HTML' && source && source.indexOf('<') >= 0
        ? HtmlSanitizer.convertInlineCss(source)
        : source;
}
