import type RibbonFormatState from '../store/schema/RibbonFormatState';

export default function createFormatState(): RibbonFormatState {
    return {
        fontName: '',
        fontSize: '',
        isBold: false,
        isItalic: false,
        isUnderline: false,
        backgroundColor: '',
        textColor: '',
        isBullet: false,
        isNumbering: false,
        isStrikeThrough: false,
        isSubscript: false,
        isSuperscript: false,
        isBlockQuote: false,
        canUnlink: false,
        canAddImageAltText: false,
        canUndo: false,
        canRedo: false,
        formatPainterFormat: null,
        hasReadonlyContent: false,
        lastTextColors: {
            darkModeColor: '#df504d',
            lightModeColor: '#ed5c57',
        },
        lastBackColors: {
            darkModeColor: '#383e00',
            lightModeColor: '#ffff00',
        },
        announcedComponentMessage: '',
    };
}
