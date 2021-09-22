import * as React from "react";
import { StatelessComponent } from "react";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";
import Bullet from "./Bullet";
import SWReactRootComponent from "decorators/SWReactRootComponent";

export interface IBuletContainerProps {
    numberOfItems: number;
    selectedItem: number;
    containerClassName: string;
    className: string;
    bulletClassName: string;
    activeClassName: string;
    callbackFunction(i: number): () => any;
}

const BulletsContainer: StatelessComponent<IBuletContainerProps> = ({
    numberOfItems,
    selectedItem,
    containerClassName,
    className,
    bulletClassName,
    activeClassName,
    callbackFunction,
}) => {
    let _bullets = [];
    for (let i = 0; i < numberOfItems; i++) {
        let _isSelected = i === selectedItem;
        _bullets.push(
            <Bullet
                key={i.toString()}
                onClick={() => callbackFunction(i)}
                className={classNames(bulletClassName, { [activeClassName]: _isSelected })}
            ></Bullet>,
        );
    }
    return <div className={containerClassName}>{_bullets}</div>;
};

BulletsContainer.propTypes = {
    numberOfItems: PropTypes.number,
    selectedItem: PropTypes.number,
    containerClassName: PropTypes.string,
    className: PropTypes.string,
    bulletClassName: PropTypes.string,
    activeClassName: PropTypes.string,
    callbackFunction: PropTypes.func,
};
SWReactRootComponent(BulletsContainer, "BulletsContainer");

export default BulletsContainer;
