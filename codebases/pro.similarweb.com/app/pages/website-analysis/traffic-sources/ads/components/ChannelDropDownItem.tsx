import React from "react";
import classNames from "classnames";
import { SWReactIcons } from "@similarweb/icons";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip.tsx";
import { element } from "prop-types";

export default ({
    icon,
    id,
    locked,
    onClick,
    text,
    selected,
    active,
    onMouseHover,
    "data-automation": dataAutomation,
}) => (
    <div
        className={classNames("DropdownItem u-flex-row u-flex-center", {
            "DropdownItem--active": active,
        })}
        onClick={onClick}
        title={text}
        onMouseEnter={onMouseHover}
        data-automation={dataAutomation}
    >
        <span style={{ display: "inline-block", minWidth: "86px" }}>{text}</span>
        <span
            style={{ display: "inline-block", width: "16px", height: "16px", lineHeight: "16px" }}
        >
            {icon == "mobile-web" ? (
                <SWReactIcons iconName={icon} />
            ) : (
                <SWReactIcons iconName={icon} />
            )}
        </span>
        {!locked && (
            <span
                style={{
                    display: "inline-block",
                    position: "static",
                    marginLeft: "8px",
                    paddingRight: "8px",
                    visibility: selected ? "visible" : "hidden",
                }}
                className="icon icon-checked DropdownItem--selected-check"
            />
        )}
        {locked && (
            <PlainTooltip
                placement="top"
                cssClass={"PlainTooltip-element"}
                text={"display.ads.creatives.mobile.web.dropdown.tooltip"}
            >
                <span
                    style={{
                        display: "inline-block",
                        width: "16px",
                        height: "16px",
                        marginLeft: "8px",
                        lineHeight: "16px",
                    }}
                >
                    <SWReactIcons iconName={"locked"} />
                </span>
            </PlainTooltip>
        )}
    </div>
);
