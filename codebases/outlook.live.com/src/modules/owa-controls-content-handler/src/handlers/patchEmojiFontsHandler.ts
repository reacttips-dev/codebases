import type { ContentHandler } from 'owa-controls-content-handler-base';

export const PATCH_EMOJI_FONTS_HANDLER_NAME = 'patchEmojiFontsHandler';
const POSSIBLE_TAG_WITH_FONT_STYLE_SELECTOR = 'div,span,font';
const FONT_TAG_NAME = 'font';
const FACE_ATTRIBUTE_NAME = 'face';
const FONT_FAMILY_ATTRIBUTE_NAME = 'font-family';
const SERIF_FONT_NAME = 'serif';
const INTERNAL_EMOJI_FONT_NAME = 'EmojiFont';
const EMOJI_REGEXP: RegExp = /[\u0023-\u0039][\u20e3]|[\ud800-\udbff][\udc00-\udfff]|[\u00a9-\u00ae]|[\u2122-\u3299]/;

function patchEmojiFonts(element: HTMLElement) {
    let existingFontFamilyStyle = element.style.fontFamily;
    if (!existingFontFamilyStyle) {
        // If there is no font family style, ignore patching on this element
        return;
    }

    if (existingFontFamilyStyle.indexOf(INTERNAL_EMOJI_FONT_NAME) == -1) {
        let newFontFamilyStyle = `${existingFontFamilyStyle}, ${SERIF_FONT_NAME}, ${INTERNAL_EMOJI_FONT_NAME}`;
        if (element.tagName.toLowerCase() == FONT_TAG_NAME) {
            element[FACE_ATTRIBUTE_NAME] = newFontFamilyStyle;
        } else {
            element.style[FONT_FAMILY_ATTRIBUTE_NAME] = newFontFamilyStyle;
        }
    }
}

export function shouldPatchEmojiFonts(messageBody: string): boolean {
    return EMOJI_REGEXP.test(messageBody);
}

let patchEmojiFontsHandler: ContentHandler = {
    cssSelector: POSSIBLE_TAG_WITH_FONT_STYLE_SELECTOR,
    keywords: null,
    handler: patchEmojiFonts,
};

export default patchEmojiFontsHandler;
