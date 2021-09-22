import * as React from "react";
import { StatelessComponent } from "react";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";
import * as _ from "lodash";

export interface IGAVerifiedIcon {
    isActive: boolean;
    size: string;
}

const GAVerifiedIcon: StatelessComponent<IGAVerifiedIcon> = ({ isActive, size }) => {
    return (
        <div
            className={classNames(
                "GAVerified-icon-container",
                `GAVerified-icon--${size}`,
                { ["GAVerified-icon--active"]: isActive },
                { ["GAVerified-icon--inactive"]: !isActive },
            )}
        ></div>
    );
};

GAVerifiedIcon.propTypes = {
    isActive: PropTypes.bool.isRequired,
    size: PropTypes.string.isRequired,
};

export default GAVerifiedIcon;
