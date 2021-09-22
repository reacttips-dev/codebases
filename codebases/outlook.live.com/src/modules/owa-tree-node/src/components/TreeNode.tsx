import { IconButton } from '@fluentui/react/lib/Button';
import { Icon } from '@fluentui/react/lib/Icon';
import classnamesBind from 'classnames/bind';
import { observer } from 'mobx-react-lite';
import { AriaProperties, AriaRoles, generateDomPropertiesForAria } from 'owa-accessibility';
import { ControlIcons } from 'owa-control-icons';
import { getDensityModeString } from 'owa-fabric-theme';
import { isFeatureEnabled } from 'owa-feature-flags';
import FolderRegular from 'owa-fluent-icons-svg/lib/icons/FolderRegular';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { useKeydownHandler } from 'owa-hotkeys';
import { isLeftRailVisible } from 'owa-left-rail-utils/lib/isLeftRailVisible';
import loc, { isCurrentCultureRightToLeft } from 'owa-localize';
import { StarCharm } from 'owa-star-charm';
import { Module } from 'owa-workloads';
import * as React from 'react';
import { getTreeNodesFarPadding, getUITreeNodeDepth } from '../utils/treeNodeUIUtils';
import styles from './TreeNode.scss';
import { selectedFolderNodeScreenReaderOnlyText } from './TreeNode.locstring.json';

let classNames = classnamesBind.bind(styles);

export type ChevronProps = {
    isExpanded: boolean;
    onClick: (evt: React.MouseEvent<unknown> | KeyboardEvent) => void;
    iconButtonClassName?: string;
    iconClassName?: string;
};

export interface TreeNodeProps {
    displayName: string;
    isRootNode: boolean;

    // Optional parameters
    chevronProps?: ChevronProps; // Chevron related props, if not passed, we will not show chevron
    customIcon?: string; // Render an icon for special tree nodes
    customIconClassName?: string;
    onRenderCustomIcon?: (customIconClassName: string) => JSX.Element;
    depth?: number; // The indentation int the tree node structure, where 0 is the root
    isBeingDragged?: boolean;
    isCustomActionNode?: boolean; // A node that contains a custom action (e.g. "New folder" node that creates new folder)
    isDroppedOver?: boolean;
    isSelected?: boolean;
    isWithContextMenuOpen?: boolean;
    onClick?: React.MouseEventHandler<EventTarget>;
    onKeyDown?: React.KeyboardEventHandler<EventTarget>;
    onContextMenu?: React.MouseEventHandler<EventTarget>;
    onMouseEnter?: React.MouseEventHandler<EventTarget>;
    onTouchStart?: React.TouchEventHandler<EventTarget>;
    onTouchEnd?: React.TouchEventHandler<EventTarget>;
    renderCustomTreeNodeDisplay?: (textClassName: string) => JSX.Element; // Method to render the main content (if not specified the tree node will render the default UI)
    renderRightCharm?: () => JSX.Element; // Method to render the right charm (if any)
    renderRightCharmHover?: () => JSX.Element; // Method to render the right charm on hover state (if any)
    isFavorited?: boolean;
    toggleFavorite?: () => void;
    showAsHoverOnDroppedOver?: boolean; // True if we want to show the hover style css when the tree node is dropped over
    isCursorDisabled?: boolean;
    setSize?: number;
    positionInSet?: number;
    isinSharedFolderTree?: boolean;
    ariaLabel?: string;
}

export default observer(function TreeNode(props: TreeNodeProps) {
    const divRef = React.useRef<HTMLDivElement>();
    const isLeftNavNext =
        isFeatureEnabled('nh-boot-acctmonaccounts') && isHostAppFeatureEnabled('acctmonaccounts');
    const showFavoriteStar = isFeatureEnabled('acct-favoritestar');
    const hasDensityNext = isFeatureEnabled('mon-densities');
    const hasIconsForAllFolders = isFeatureEnabled('mon-tri-leftNavFolderIcons') || hasDensityNext;
    const densityModeString = getDensityModeString();
    const isCloudCacheMultiAccountRail =
        isLeftRailVisible(Module.Mail) && !isFeatureEnabled('tri-officeRail');

    const renderCustomIcon = (customIconClassNames: string) => {
        return (
            <Icon
                className={classNames(
                    customIconClassNames,
                    hasDensityNext && densityModeString,
                    hasDensityNext && styles.iconsNext
                )}
                iconName={
                    props.customIcon || (hasDensityNext ? FolderRegular : ControlIcons.FabricFolder)
                }
            />
        );
    };
    const renderCustomIconFunction = props.onRenderCustomIcon || renderCustomIcon;
    useKeydownHandler(divRef, 'right', (evt: KeyboardEvent) => {
        let chevronProps = props.chevronProps;
        if (chevronProps?.onClick && !chevronProps.isExpanded) {
            chevronProps.onClick(evt);
        }
    });
    useKeydownHandler(divRef, 'left', (evt: KeyboardEvent) => {
        let chevronProps = props.chevronProps;
        if (chevronProps?.onClick && chevronProps.isExpanded) {
            chevronProps.onClick(evt);
        }
    });

    const renderIcon = (isInRootFolderView?: boolean) => {
        if (props.chevronProps && !isInRootFolderView) {
            return renderChevronIcon();
        }
        // If tree node has a chevron, always display it (even if there is also a custom icon).
        // Otherwise display a custom icon or nothing if no custom icon is passed in.
        const customIconClassNames = classNames(
            styles.icon,
            props.customIconClassName,
            !isCloudCacheMultiAccountRail && styles.leftNavIconExtraPadding,
            isInRootFolderView && styles.favoriteStar
        );
        if (props.onRenderCustomIcon || props.customIcon) {
            return renderCustomIconFunction(customIconClassNames);
        }

        return renderInvisibleIcon();
    };

    const renderFolderIcon = () => {
        const iconsToRender = [];
        if (props.chevronProps) {
            iconsToRender.push(renderChevronIcon());
        }

        const amountOfIcons = iconsToRender.length;

        const customIconClassNames = classNames(
            amountOfIcons > 0 && styles.folderWithChevron,
            styles.icon,
            densityModeString,
            !hasDensityNext && styles.customIcon,
            isCustomActionNode && 'visibilityHidden',
            props.customIconClassName,
            !isCloudCacheMultiAccountRail && styles.leftNavAllFoldersPadding,
            amountOfIcons == 0 && isLeftNavNext && styles.folderPadding // When there is no chevron we want to use different spacing
        );
        iconsToRender.push(renderCustomIconFunction(customIconClassNames));
        return <div className={styles.folderIcons}>{iconsToRender}</div>;
    };

    // creates an icon which is not visible to preserve the alignment and nested spacing of folders.
    const renderInvisibleIcon = () => {
        return (
            <Icon
                className={classNames(
                    styles.icon,
                    'visibilityHidden',
                    isLeftNavNext &&
                        hasIconsForAllFolders &&
                        isRootNode &&
                        styles.rootFolderAlignment,
                    !isCloudCacheMultiAccountRail && styles.leftNavIconExtraPadding
                )}
            />
        );
    };
    const renderChevronIcon = () => {
        let chevronIcon = props.chevronProps.isExpanded
            ? ControlIcons.ChevronDownMed
            : ControlIcons.ChevronRightMed;
        let chevronIconClassNames = classNames(
            styles.icon,
            // We want the font size for icon to be picked up from the global css,
            // since we are rolling this out as a flight, we are keeping the overriden
            // css value for the case the flight is not enabled.
            hasDensityNext && styles.chevronFontSize,
            hasIconsForAllFolders && styles.leftNavPadding,
            densityModeString,
            !props.isRootNode && styles.regularNodeChevronIcon,
            !isCloudCacheMultiAccountRail && styles.leftNavIconExtraPadding,
            props.chevronProps.iconClassName,
            'flipForRtl'
        );
        // Make this button hidden to narrator/jaws since all the aria
        // attributes are set on the main content. If we dont do this, narrator reads the content twice.
        // This button is hidden from aria/tabs but its action can be performed from the main content as well
        // We cant make this an icon since there are consumers
        // that uses the click handler from the button different from the chevron
        const ariaProps: AriaProperties = {
            role: 'button',
            hidden: true,
        };
        return (
            <IconButton
                data-is-focusable={false}
                tabIndex={-1}
                className={
                    !(isLeftNavNext && props.isRootNode) &&
                    classNames(
                        hasDensityNext && densityModeString,
                        hasIconsForAllFolders && styles.chevronWithFolderIcon,
                        hasIconsForAllFolders && isLeftNavNext && styles.chevronPadding,
                        styles.chevronIcon,
                        !isCloudCacheMultiAccountRail &&
                            !hasIconsForAllFolders &&
                            styles.leftNavChevronExtraPadding,
                        props.chevronProps.iconButtonClassName
                    )
                }
                iconProps={{
                    iconName: chevronIcon,
                    styles: {
                        root: chevronIconClassNames,
                    },
                }}
                onClick={
                    props.chevronProps.onClick
                        ? (evt: React.MouseEvent<unknown>) => props.chevronProps.onClick(evt)
                        : null
                }
                {...generateDomPropertiesForAria(ariaProps)}
            />
        );
    };
    const renderDefaultTreeNodeDisplay = (className: string): JSX.Element => {
        return (
            <>
                <span className={className}>{props.displayName}</span>
                {props.isSelected && (
                    <span className="screenReaderOnly">
                        {loc(selectedFolderNodeScreenReaderOnlyText)}
                    </span>
                )}
            </>
        );
    };

    const {
        isCustomActionNode,
        isDroppedOver,
        isSelected,
        showAsHoverOnDroppedOver,
        isBeingDragged,
        isWithContextMenuOpen,
        isCursorDisabled,
        isRootNode,
        chevronProps,
        depth,
        onClick,
        onKeyDown,
        onContextMenu,
        onMouseEnter,
        onTouchStart,
        onTouchEnd,
        displayName,
        renderCustomTreeNodeDisplay,
        renderRightCharm,
        renderRightCharmHover,
        isinSharedFolderTree,
    } = props;
    const treeNodeClasses = classNames(
        isRootNode ? styles.rootNode : styles.regularNode,
        densityModeString,
        hasDensityNext && styles.densityNodeHeights,
        {
            showAsHoverOnDroppedOver: isDroppedOver && showAsHoverOnDroppedOver,
            showBorderOnDroppedOver: isDroppedOver && !showAsHoverOnDroppedOver,
            isBeingDragged: isBeingDragged,
            customActionNode: styles.overridenFont && isCustomActionNode,
            selected: isSelected,
            withContextMenuOpen: isWithContextMenuOpen,
            disabledCursor: isCursorDisabled,
        }
    );
    const textClassNames = classNames(
        styles.displayName,
        hasDensityNext && styles.densityFontSizes,
        densityModeString,
        {
            selected: isSelected,
        },
        !isCloudCacheMultiAccountRail &&
            !hasIconsForAllFolders &&
            styles.leftNavDisplayNameExtraPadding,
        hasIconsForAllFolders && isRootNode && styles.allFolderIconsRootText
    );
    const ariaProps: AriaProperties = {
        role: AriaRoles.treeitem,
        expanded: chevronProps ? chevronProps.isExpanded : undefined,
        selected: !isRootNode ? isSelected : undefined,
        // temporary fix for OW:15414 because it is currently possible for depth to be null causing aria-level to be NaN
        // aria-level is an integer equal to or greater than 1 where 1 is the root
        level: depth == null ? (isRootNode ? 1 : 2) : depth + 1,
        setSize: props.setSize,
        positionInSet: props.positionInSet,
        label: props.ariaLabel,
    };
    // The first level of tree nodes must be inline with root in the UI
    const uiTreeNodeDepth = depth ? getUITreeNodeDepth(depth, hasIconsForAllFolders) : 0;
    const treePadding = !isCloudCacheMultiAccountRail
        ? uiTreeNodeDepth + 'px'
        : uiTreeNodeDepth + 6 + 'px'; // We add 6px in depth so the folders don't feel as tight (per redlines)
    const farPadding = getTreeNodesFarPadding();
    const containerStyles = isCurrentCultureRightToLeft()
        ? {
              paddingRight:
                  isLeftNavNext && hasIconsForAllFolders && isRootNode ? '10px' : treePadding,
              paddingLeft: isLeftNavNext && isRootNode ? '20px' : farPadding,
          }
        : {
              paddingLeft:
                  isLeftNavNext && hasIconsForAllFolders && isRootNode ? '10px' : treePadding,
              paddingRight: isLeftNavNext && isRootNode ? '20px' : farPadding,
          };
    const hasCountBadge = isFeatureEnabled('mon-tri-unreadCountBadgeWithBackground');
    /**
     * Hover treatment is optional and hence the CSS classes to hide the rest treatment with onHover treatment
     * should only be applied if hover treatment is specified.
     */
    const rightCharmClassName = classNames(
        hasCountBadge && hasIconsForAllFolders && styles.alternativeBadgeHeight,
        styles.rightCharm,
        isLeftNavNext && !isinSharedFolderTree && styles.hoverTreatmentPresent,
        isLeftNavNext && styles.hoverPadding,
        renderRightCharmHover && !hasCountBadge && styles.hoverTreatmentPresent
    );

    // decides which icon to render on the left of the display name
    const getIconLeftOfFolderName = () => {
        // We want to give all folders a folder Icon, except the root folders.
        if (!isRootNode && hasIconsForAllFolders) {
            return renderFolderIcon();
        }
        // We want to render special icons to the left or have no icon to the left for root folders in monarch.
        else if (isRootNode && isLeftNavNext) {
            return renderIcon(true);
        }
        return renderIcon();
    };

    return (
        <div
            ref={divRef}
            style={containerStyles}
            onClick={onClick}
            onKeyDown={onKeyDown}
            onContextMenu={onContextMenu}
            onMouseEnter={onMouseEnter}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className={treeNodeClasses}
            data-is-focusable={true}
            title={displayName}
            {...generateDomPropertiesForAria(ariaProps)}>
            {getIconLeftOfFolderName()}
            {renderCustomTreeNodeDisplay
                ? renderCustomTreeNodeDisplay(textClassNames)
                : renderDefaultTreeNodeDisplay(textClassNames)}
            {isLeftNavNext && isRootNode && renderIcon()}
            {renderRightCharm && <span className={rightCharmClassName}>{renderRightCharm()}</span>}
            {showFavoriteStar
                ? props.toggleFavorite &&
                  !isinSharedFolderTree && ( // Favoriting shared folders are not supported
                      <StarCharm
                          isStarred={props.isFavorited}
                          onClick={props.toggleFavorite}
                          tooltipStyles={styles.rightCharmHover}
                          buttonStyles={styles.starCharm}
                          iconStyles={styles.starCharm}
                          isInFolderPane={true}
                      />
                  )
                : !hasCountBadge &&
                  renderRightCharmHover && (
                      <span className={styles.rightCharmHover}>{renderRightCharmHover()}</span>
                  )}
        </div>
    );
});
