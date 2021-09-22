import { IStyle, DefaultPalette } from '@fluentui/style-utilities';

export interface DraggableItemStyle {
    draggableContainer: IStyle;
}

export interface DraggableItemStyleProps {
    isItemDraggedOver: boolean;
    didDragStart: boolean;
}

export const getStyles = (props: DraggableItemStyleProps): DraggableItemStyle => {
    const { isItemDraggedOver, didDragStart } = props;
    return {
        draggableContainer: [
            {
                display: 'inline-block',
                position: 'relative',
            },
            [
                didDragStart && {
                    selectors: {
                        ':not(.draggedItem) *': {
                            pointerEvents: 'none',
                        },
                    },
                },
                isItemDraggedOver && {
                    selectors: {
                        ':not(.draggedItem)': {
                            borderLeftWidth: '1px',
                            borderLeftStyle: 'solid',
                            borderLeftColor: DefaultPalette.neutralTertiary,
                        },
                    },
                },
            ],
        ],
    };
};
