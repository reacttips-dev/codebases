/**
 * Created by Sahar.Rehani on 7/29/2016.
 */

import { SWReactIcons } from "@similarweb/icons";
import * as React from "react";
import * as PropTypes from "prop-types";
import { ConfirmationTooltip } from "../../Tooltip/ConfirmationTooltip/ConfirmationTooltip";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { SharingService } from "sharing/SharingService";

export const CategoryCustomItem: React.FC<any> = (props) => {
    const shareIconsClasses = `dropdownPopup-popup-item-action CategoryCustomItem-icon-action CategoryCustomItem-icon-users-action ${
        props.item.shared ? "CategoryCustomItem-icon-users-action-shared" : ""
    }`;
    let shareIcon = null;
    if (props.item.shared) {
        const tooltipText = SharingService.getShareTooltip({
            users: props.users,
            sharedWithUsers: props.item.sharedWithUsers,
            sharedWithAccounts: props.item.sharedWithAccounts,
        });
        if (tooltipText) {
            shareIcon = (
                <PlainTooltip placement="top" tooltipContent={tooltipText}>
                    <div
                        className={shareIconsClasses}
                        onClick={(event) => props.onShare(props.item, event)}
                    >
                        <SWReactIcons
                            iconName="users"
                            type="flat"
                            size={"xs"}
                            className="icon-users"
                        />
                    </div>
                </PlainTooltip>
            );
        } else {
            shareIcon = (
                <div
                    className={shareIconsClasses}
                    onClick={(event) => props.onShare(props.item, event)}
                >
                    <SWReactIcons iconName="users" type="flat" size={"xs"} className="icon-users" />
                </div>
            );
        }
    } else if (props.item.shareable) {
        shareIcon = (
            <div
                className={shareIconsClasses}
                onClick={(event) => props.onShare(props.item, event)}
            >
                <SWReactIcons iconName="users" type="flat" size={"xs"} className="icon-users" />
            </div>
        );
    }
    return (
        <li>
            <a
                className={
                    props.getClass(props.item, false, false) + " dropdownPopup-popup-custom-item"
                }
                onClick={(event: any) => {
                    const classname = event.target?.className;
                    if (!classname.indexOf) {
                        return;
                    }
                    if (
                        classname.indexOf("item-group-name") > -1 ||
                        classname.indexOf("dropdown-item-icon") > -1
                    ) {
                        props.onSelect(props.item, event);
                    }
                }}
            >
                <i className={"CategoryCustomItem-icon dropdown-item-icon " + props.item.icon} />
                <span className="item-group-name">
                    {props.item.text} ({props.item.domains.length})
                </span>
                {props.item.deletable && (
                    <ConfirmationTooltip
                        cssClass="js-dropdownPopup-popup-ignore-click"
                        removeItemTooltip={props.removeItemTooltip}
                        onOpen={() => props.onShowDeleteConfirmation(props.item)}
                        onCancel={() => props.onCancel(props.item)}
                        onDelete={() => props.onDelete(props.item)}
                    >
                        <i
                            className={
                                "sw-icon-close CategoryCustomItem-icon-action js-dropdownPopup-popup-ignore-click dropdownPopup-popup-item-action"
                            }
                        />
                    </ConfirmationTooltip>
                )}
                {props.item.editable && (
                    <i
                        className="sw-icon-edit CategoryCustomItem-icon-action dropdownPopup-popup-item-action js-dropdownPopup-popup-ignore-click"
                        onClick={(event) => props.onEdit(props.item, event)}
                    ></i>
                )}
                {shareIcon}
            </a>
        </li>
    );
};

CategoryCustomItem.propTypes = {
    item: PropTypes.object.isRequired,
    itemToDelete: PropTypes.object,
    isChild: PropTypes.bool,
    isDisabled: PropTypes.bool,
    onSelect: PropTypes.func.isRequired,
    getClass: PropTypes.func.isRequired,
    onShowDeleteConfirmation: PropTypes.func,
    onEdit: PropTypes.func.isRequired,
    onShare: PropTypes.func,
    onDelete: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    tooltipStyle: PropTypes.object,
};

CategoryCustomItem.defaultProps = {
    itemToDelete: null,
    isChild: false,
    isDisabled: false,
    tooltipStyle: {},
};
