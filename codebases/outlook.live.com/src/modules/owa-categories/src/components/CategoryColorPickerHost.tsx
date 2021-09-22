import { observer } from 'mobx-react-lite';
import {
    categoryMenuColorPickerAriaText,
    categoryMenuColorPickerTooltip,
} from './CategoryColorPickerHost.locstring.json';
import loc from 'owa-localize';
import setColorPickerTarget from '../actions/colorPicker/setColorPickerTarget';
import setShouldShowColorPicker from '../actions/colorPicker/setShouldShowColorPicker';
import categoryStore from '../store/store';
import { KeyCodes } from '@fluentui/react/lib/Utilities';
import CategoryColorPicker from './CategoryColorPicker';
import CategoryIcon from './CategoryIcon';

import * as React from 'react';
import type CategoryType from 'owa-service/lib/contract/CategoryType';

import styles from './CategoryColorPickerHost.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface CategoryColorPickerHostProps {
    categoryColorId: string;
    onNewCategoryColorSelected: (colorId: string) => void;
    categoryList: CategoryType[];
    colorPickerIconContainerClass?: string;
    onBlur?: () => void;
    categoryColorPickerSource?: string;
}

export default observer(function CategoryColorPickerHost(props: CategoryColorPickerHostProps) {
    const colorPickerDiv = React.useRef<HTMLElement>();
    const onBlur = (evt: React.FocusEvent<EventTarget>) => {
        if (props.onBlur && !categoryStore.categoryColorPickerViewState.shouldShowColorPicker) {
            props.onBlur();
        }
    };
    /**
     * Renders the ColorPicker context menu at the given target element
     */
    const renderColorPicker = (
        selectedColorId: string,
        colorPickerTarget: HTMLElement
    ): JSX.Element => {
        return (
            <CategoryColorPicker
                onColorSelected={onNewCategoryColorSelected}
                onDismissColorPicker={dismissColorPicker}
                selectedColorId={selectedColorId}
                targetElement={colorPickerTarget}
            />
        );
    };
    /**
     * Called when user clicks on a color in the color picker
     */
    const onNewCategoryColorSelected = (id: string) => {
        hideColorPicker();
        if (props.onNewCategoryColorSelected) {
            props.onNewCategoryColorSelected(id);
        }
    };
    const dismissColorPicker = () => {
        hideColorPicker();
        if (props.onBlur) {
            props.onBlur();
        }
    };
    /**
     * Hide color picker and set the color picker target to null
     */
    const hideColorPicker = () => {
        setColorPickerTarget(null);
        setShouldShowColorPicker(false);
    };
    /**
     * Called when user presses key on the category color picker div to open a picker
     */
    const onKeyDownOnColorPickerIcon = (evt: React.KeyboardEvent<unknown>) => {
        switch (evt.which) {
            case KeyCodes.enter:
            case KeyCodes.space:
                evt.stopPropagation();
                setTargetAndShowColorPicker();
                break;
        }
    };
    /**
     * Called when user clicks on the category color picker div to open a picker
     */
    const onColorPickerIconClicked = (evt: React.MouseEvent<unknown>) => {
        evt.stopPropagation();
        setTargetAndShowColorPicker();
    };
    /**
     * Set the color picker target and show the color picker
     */
    const setTargetAndShowColorPicker = () => {
        setColorPickerTarget(colorPickerDiv.current);
        setShouldShowColorPicker(true);
    };
    const { shouldShowColorPicker, colorPickerTarget } = categoryStore.categoryColorPickerViewState;
    const { colorPickerIconContainerClass, categoryColorId, categoryColorPickerSource } = props;
    const shouldShowPicker = shouldShowColorPicker && colorPickerDiv.current == colorPickerTarget;
    const tagIconClass = classNames(
        { colorPickerShown: shouldShowPicker },
        styles.colorPickerTagIcon
    );
    return (
        <div
            ref={ref => (colorPickerDiv.current = ref)}
            role={'button'}
            aria-label={loc(categoryMenuColorPickerAriaText)}
            aria-haspopup={true}
            onBlur={onBlur}
            onKeyDown={onKeyDownOnColorPickerIcon}
            onClick={onColorPickerIconClicked}
            data-click-source={categoryColorPickerSource}
            className={classNames(colorPickerIconContainerClass, styles.colorPickerIconContainer)}
            tabIndex={0}
            title={loc(categoryMenuColorPickerTooltip)}>
            <CategoryIcon
                categoryColorId={categoryColorId}
                iconClassName={tagIconClass}
                categoryList={props.categoryList}
            />
            {shouldShowPicker && renderColorPicker(categoryColorId, colorPickerTarget)}
        </div>
    );
});
