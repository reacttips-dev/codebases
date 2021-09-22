import type {
    CommonFloatingPickerItemStyleProps,
    CommonFloatingPickerItemStyles,
} from './CommonFloatingPickerItem.types';

export const getStyles = (
    props: CommonFloatingPickerItemStyleProps
): CommonFloatingPickerItemStyles => {
    return {
        container: [
            {
                height: '48px',
                maxWidth: '100%',
                overflow: 'hidden',
                position: 'relative',
            },
        ],
        personaContainer: [
            {
                marginLeft: '12px',
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                tableLayout: 'fixed',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            },
        ],
        personaImage: [
            {
                position: 'relative',
                display: 'inline-block',
                verticalAlign: 'middle',
                width: '32px',
                // Required for IE11 flex
                flexShrink: 0,
            },
        ],
        personaText: [
            {
                paddingLeft: '12px',
                display: 'inline-block',
                verticalAlign: 'middle',
                // Forces the item to be shrinkable beneath its intrinsic width
                // (e.g. the width of the text when there is a long name)
                flexShrink: 1,
                minWidth: 0,
                // Required for IE11 text-overflow: ellipses in
                // descendent text components
                // (all elements between the flex context and the
                // ellipses element must be overflow: hidden for IE11)
                overflow: 'hidden',
            },
        ],
    };
};
