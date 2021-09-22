import getDefaultComposeFormat from 'owa-editor/lib/utils/getDefaultComposeFormat';

export function createDefaultComposeFormatWrapper(): HTMLElement {
    const emptyDiv = document.createElement('div');
    const elementStyle: CSSStyleDeclaration = emptyDiv.style;
    const defaultFormat = getDefaultComposeFormat();

    if (defaultFormat.fontFamily) {
        elementStyle.fontFamily = defaultFormat.fontFamily;
    }
    if (defaultFormat.fontSize) {
        elementStyle.fontSize = defaultFormat.fontSize;
    }
    if (defaultFormat.textColor) {
        elementStyle.color = defaultFormat.textColor;
    }
    if (defaultFormat.bold) {
        elementStyle.fontWeight = 'bold';
    }
    if (defaultFormat.italic) {
        elementStyle.fontStyle = 'italic';
    }
    if (defaultFormat.underline) {
        elementStyle.textDecoration = 'underline';
    }

    return emptyDiv;
}

function createInitialComposeContentBlock(): string {
    const initialDiv = createDefaultComposeFormatWrapper();
    initialDiv.appendChild(document.createElement('br'));
    return initialDiv.outerHTML;
}

const getDefaultComposeContentBlock = () => createInitialComposeContentBlock();
export default getDefaultComposeContentBlock;
