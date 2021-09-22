import { Button } from "@similarweb/ui-components/dist/button";
import * as classNames from "classnames";
import * as _ from "lodash";
import * as PropTypes from "prop-types";
import * as React from "react";
import { StatelessComponent } from "react";
import { ListRow } from "../../list-row";
import "../styles/WebsiteListItem.scss";

const icons = {
    check: require("../icons/check.svg") as string,
};

interface IWebsiteListItemProps {
    id?: string | number;
    icon?: string;
    text: string;
    isSelected?: boolean;
    isSuggested?: boolean;
    onClick?: () => void;
}

export const WebsiteListItem: StatelessComponent<IWebsiteListItemProps> = ({
    id,
    icon,
    text,
    isSelected,
    onClick,
    isSuggested,
}) => {
    const classes = classNames(
        "WebsiteListItem",
        "u-flex-row",
        "u-flex-center",
        "u-flex-space-between",
    );
    return (
        <div className={classes} onClick={onClick}>
            <ListRow
                id={id}
                icon={icon}
                text={text}
                isSelected={isSelected}
                isSuggested={isSuggested}
            />
            {isSelected ? addedIcon() : addButton()}
        </div>
    );
};

const noop = () => null;

const addButton = () => {
    return (
        <Button onClick={noop} type="flat">
            ADD
        </Button>
    );
};

const addedIcon = () => {
    return (
        <div className={classNames("WebsiteListItem-added")}>
            <img width="12px" src={icons.check} />
        </div>
    );
};

WebsiteListItem.defaultProps = {
    text: "",
    onClick: _.noop,
    isSelected: false,
    isSuggested: false,
};

WebsiteListItem.propTypes = {
    text: PropTypes.string.isRequired,
    id: PropTypes.string,
    onClick: PropTypes.func,
    isSelected: PropTypes.bool,
    icon: PropTypes.string,
    isSuggested: PropTypes.bool,
};

WebsiteListItem.displayName = "WebsiteListItem";
