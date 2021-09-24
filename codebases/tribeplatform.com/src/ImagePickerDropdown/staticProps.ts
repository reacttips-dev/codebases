export const TABS_MOBILE_HEIGHT = 'calc(100vh - 80px)';
// Screen height minus mobile popover header and empty space
const EMOJI_PICKER_MOBILE_HEIGHT = 'calc(100vh - 31px - 49px - 80px)';
const staticProps = {
    buttonProps: {
        buttonType: 'primary',
        variant: 'solid',
        size: 'md',
        w: 'full',
    },
    emojiPickerTab: {
        sx: {
            '.emoji-mart-bar': {
                display: 'none',
            },
            '.emoji-mart-scroll': {
                height: {
                    base: EMOJI_PICKER_MOBILE_HEIGHT,
                    sm: '272px',
                },
                overflow: 'hidden',
                padding: '0',
            },
            '.emoji-mart-scroll > div': {
                height: {
                    base: `${EMOJI_PICKER_MOBILE_HEIGHT} !important`,
                    sm: '272px !important',
                },
                overflowX: 'hidden !important',
                width: '100% !important',
            },
            '.emoji-mart-scroll li': {
                listStyleType: 'none',
            },
            '.emoji-mart-scroll button.emoji-mart-emoji': {
                display: 'block',
                height: '100% !important',
                lineHeight: '36px',
                overflow: 'hidden',
                padding: '0',
                textAlign: 'center',
                width: '100% !important',
            },
            '.emoji-mart-scroll button.emoji-mart-emoji > span': {
                display: 'block',
                fontSize: '22px !important',
                height: '100% !important',
                lineHeight: '36px !important',
                width: '100% !important',
            },
            '.emoji-mart-scroll .emoji-mart-category-label': {
                alignItems: 'center',
                display: 'flex',
            },
        },
    },
    picker: {
        display: 'block',
        border: 'none',
        width: '100%',
    },
};
export default staticProps;
//# sourceMappingURL=staticProps.js.map