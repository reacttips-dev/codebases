import { IOnOffSwitchProps, OnOffSwitch } from "@similarweb/ui-components/dist/on-off-switch";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import * as classnames from "classnames";
import * as _ from "lodash";
import * as React from "react";
import { StatelessComponent } from "react";

import "./SubDomainsFilter.scss";

export interface ISubDomainsFilter extends IOnOffSwitchProps {
    label: string;
    isDisabled?: boolean;
    disabledTooltip?: string;
    dropdownPopupPlacement?: string;
}

export const SubDomainsFilter: StatelessComponent<ISubDomainsFilter> = (props) => {
    const classNames = classnames(
        "SubDomainsFilter",
        props.isDisabled ? "SubDomainsFilter--disabled" : null,
    );
    const content = (
        <div className={classNames} onClick={props.isDisabled ? _.noop : props.onClick}>
            {props.label}
            <OnOffSwitch
                className={props.className}
                onClick={_.noop}
                isSelected={props.isSelected}
                isDisabled={props.isDisabled}
            />
        </div>
    );

    if (props.disabledTooltip) {
        return (
            <PlainTooltip tooltipContent={props.disabledTooltip}>
                <div style={{ width: "100%" }}>{content}</div>
            </PlainTooltip>
        );
    } else {
        return content;
    }
};

export default SubDomainsFilter;
