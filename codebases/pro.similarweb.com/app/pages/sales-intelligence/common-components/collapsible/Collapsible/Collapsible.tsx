import React from "react";
import classNames from "classnames";
import { ICollapsibleProps } from "@similarweb/ui-components/dist/collapsible/src/CollapsibleTypes";
import { StyledCollapsible } from "./styles";

const Collapsible = (props: ICollapsibleProps) => {
    const [isExpandFinished, setIsExpandFinished] = React.useState(false);

    const handleTransitionEnd = () => {
        if (props.isActive) {
            setIsExpandFinished(true);
        }
    };

    React.useEffect(() => {
        if (!props.isActive) {
            setIsExpandFinished(false);
        }
    }, [props.isActive]);

    return (
        <StyledCollapsible
            {...props}
            onTransitionEnd={handleTransitionEnd}
            className={classNames(props.className, { expanded: isExpandFinished })}
        />
    );
};

export default Collapsible;
