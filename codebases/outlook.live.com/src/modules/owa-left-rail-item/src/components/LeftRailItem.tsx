import * as React from 'react';
import { Icon, IIconProps } from '@fluentui/react/lib/Icon';
import isOfficeRailEnabled from 'owa-left-rail-utils/lib/isOfficeRailEnabled';
import { OfficeApp, lazyGetLeftRailItemContextualMenuItems } from 'owa-left-rail-utils';
import { observer } from 'mobx-react-lite';
import { Module } from 'owa-workloads';
import { ContextualMenu } from '@fluentui/react/lib/ContextualMenu';

import styles from './LeftRailItem.scss';
import classnamesBind from 'classnames/bind';
let classNames = classnamesBind.bind(styles);

export interface LeftRailItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
    iconProps: IIconProps;
    item: OfficeApp | Module;
    isSelected: boolean;
    text: string;
    isHorizontal: boolean;
    url: string;
    onClick: () => void;
    selectedModule: Module;
    renderAsButton: boolean;
    openInNewTab?: boolean;
}

export default observer(function LeftRailItem(props: LeftRailItemProps) {
    const {
        iconProps,
        item,
        text,
        isSelected,
        isHorizontal,
        url,
        onClick,
        openInNewTab,
        selectedModule,
        renderAsButton,
    } = props;

    const renderAsAnchor = !isSelected && !renderAsButton;
    const itemRef = React.useRef<HTMLDivElement>(null);
    const [isContextMenuVisible, setIsContextMenuVisible] = React.useState<boolean>(false);
    const contextMenuItems = lazyGetLeftRailItemContextualMenuItems.tryImportForRender()?.(
        item,
        url
    );

    const keyDownHandler = (e: React.KeyboardEvent<HTMLElement>): void => {
        if (e.key == 'Spacebar' || e.key == ' ') {
            e.stopPropagation();
            e.preventDefault();
            if (renderAsAnchor) {
                if (openInNewTab) {
                    window.open(url, '_blank');
                } else {
                    window.location.href = url;
                }
            }
            onClick();
        }
    };

    const onButtonClickHandler = (evt: React.MouseEvent<HTMLElement>): void => {
        if (evt.shiftKey || evt.ctrlKey || evt.metaKey) {
            window.open(url, '_blank');
        } else {
            onClick();
        }
    };

    const onMouseDown = (evt): void => {
        if (evt.button === 1) {
            evt.stopPropagation();
            evt.preventDefault();
            window.open(url, '_blank');
        }
    };

    const LeftRailIcon = (
        <Icon
            className={classNames(isSelected ? styles.selectedIcon : styles.leftRailIcon)}
            imageProps={iconProps.imageProps}
            styles={iconProps.styles}
            iconName={iconProps.iconName}
        />
    );

    const onContextMenu = evt => {
        if (contextMenuItems) {
            evt.preventDefault();
            setIsContextMenuVisible(true);
        }
    };

    const onContextMenuDismiss = () => {
        setIsContextMenuVisible(false);
    };

    const itemStyles = classNames(
        isHorizontal ? styles.root : styles.verRoot,
        isOfficeRailEnabled(selectedModule) && styles.officeRailHoverBg,
        isSelected && isOfficeRailEnabled(selectedModule) && styles.selectedFlexContainer
    );

    const buttonToRender = renderAsAnchor ? (
        <a
            key={item}
            className={itemStyles}
            data-is-focusable={true}
            data-workload={item}
            onClick={onClick}
            title={text}
            href={url}
            target={openInNewTab ? '_blank' : null}>
            {LeftRailIcon}
        </a>
    ) : (
        <button
            key={item}
            className={itemStyles}
            data-is-focusable={true}
            data-workload={item}
            onClick={onButtonClickHandler}
            onMouseDown={onMouseDown}
            title={text}>
            {LeftRailIcon}
        </button>
    );

    return (
        <div
            ref={itemRef}
            onContextMenu={onContextMenu}
            onKeyDown={keyDownHandler}
            className={styles.itemContainer}>
            {buttonToRender}
            {isContextMenuVisible && contextMenuItems && (
                <ContextualMenu
                    items={contextMenuItems}
                    target={itemRef.current}
                    onDismiss={onContextMenuDismiss}
                />
            )}
        </div>
    );
});
