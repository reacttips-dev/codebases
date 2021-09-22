import * as React from "react";
import * as classNames from "classnames";
import { StatelessComponent } from "react";
const ComponentHeader: StatelessComponent<any> = ({ children, className, ...restOfProps }) => (
    <div className={classNames("component-header", className)} {...restOfProps}>
        {children.map((component, key) => {
            return React.cloneElement(component, {
                key,
                className: classNames("component-header-item", component.props.className),
            });
        })}
    </div>
);
export default ComponentHeader;
