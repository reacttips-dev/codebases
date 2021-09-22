import { observer } from 'mobx-react-lite';

import { ContextualMenu, IContextualMenuStyles } from '@fluentui/react/lib/ContextualMenu';
import * as React from 'react';
import { SwatchColorPicker, ISwatchColorPickerStyles } from '@fluentui/react/lib/SwatchColorPicker';
import { getColorCellMenuItems, getColorGridCellStyles } from '../utils/getColorPickerProps';

export interface CategoryColorPickerProps {
    onColorSelected: (id: string) => void;
    onDismissColorPicker: () => void;
    selectedColorId: string;
    targetElement: HTMLElement;
}

export default observer(function CategoryColorPicker(props: CategoryColorPickerProps) {
    const getContextMenuStyles = (): Partial<IContextualMenuStyles> => {
        return {
            root: {
                minWidth: '0px',
                paddingLeft: '8px',
                paddingRight: '8px',
            },
        };
    };
    const getSwatchColorPickerStyles = (): Partial<ISwatchColorPickerStyles> => {
        return {
            focusedContainer: {
                minWidth: '0px',
            },
        };
    };
    return (
        <ContextualMenu
            styles={getContextMenuStyles}
            items={[
                {
                    key: 'category_color_picker',
                    onRender: () => (
                        <SwatchColorPicker
                            key={'category_color_picker'}
                            cellShape={'circle'}
                            colorCells={getColorCellMenuItems()}
                            columnCount={5}
                            getColorGridCellStyles={getColorGridCellStyles}
                            onColorChanged={props.onColorSelected}
                            selectedId={props.selectedColorId}
                            shouldFocusCircularNavigate={true}
                            styles={getSwatchColorPickerStyles}
                        />
                    ),
                },
            ]}
            calloutProps={{
                styles: props => ({
                    root: {
                        animation: 'none',
                        animationDuration: '0s',
                    },
                }),
            }}
            onDismiss={props.onDismissColorPicker}
            shouldFocusOnMount={true}
            target={props.targetElement}
        />
    );
});
