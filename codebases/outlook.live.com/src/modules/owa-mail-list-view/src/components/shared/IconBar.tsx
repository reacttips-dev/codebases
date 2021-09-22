import { IconButton } from '@fluentui/react/lib/Button';
import type { IContextualMenuProps } from '@fluentui/react/lib/ContextualMenu';
import { Icon } from '@fluentui/react/lib/Icon';
import * as React from 'react';
import { touchHandler } from 'owa-touch-handler';

export interface IconBarProps {
    hoverActionIcons: HoverActionIconProps[];
    propertyIcons: PropertyIconProps[];
    iconClass: string;
    propertyIconClass: string;
    hoverIconClass: string;
}

export interface HoverActionIconProps extends PropertyIconProps {
    title: string; // Title of icon when hovered over
    iconName: string;
    iconClassName?: string;
    menuProps?: IContextualMenuProps;
    onClickCommand?: () => void;
    onContextMenu?: (evt: React.MouseEvent<unknown>) => void;
}

export interface PropertyIconProps {
    iconClasses?: string;
    iconName: string;
    key: string;
    id?: string;
}

export const PropertyIcon = React.memo(function PropertyIcon({
    iconClasses,
    iconName,
    id,
}: PropertyIconProps) {
    return <Icon id={id} className={iconClasses} iconName={iconName} />;
});

export const HoverIcon = React.memo(function HoverIcon(props: HoverActionIconProps) {
    const longPress = props.onContextMenu
        ? touchHandler({
              onLongPress: props.onContextMenu,
          })
        : null;
    const onContextMenuHandler = React.useCallback(
        evt => {
            if (props.onContextMenu) {
                props.onContextMenu(evt);
            }
        },
        [props]
    );
    const onClickHandler = (evt: React.MouseEvent<unknown>) => {
        evt.stopPropagation();
        props.onClickCommand();
    };
    const onDoubleClickHandler = (evt: React.MouseEvent<unknown>) => {
        evt.stopPropagation();
    };
    const onRenderMenuIconHandler = () => null;
    return (
        <IconButton
            iconProps={{ iconName: props.iconName, className: props.iconClassName }}
            onClick={onClickHandler}
            onDoubleClick={onDoubleClickHandler}
            onRenderMenuIcon={onRenderMenuIconHandler}
            styles={{ root: props.iconClasses }}
            title={props.title}
            ariaLabel={props.title}
            menuProps={props.menuProps}
            onContextMenu={onContextMenuHandler}
            {...longPress}
        />
    );
});
