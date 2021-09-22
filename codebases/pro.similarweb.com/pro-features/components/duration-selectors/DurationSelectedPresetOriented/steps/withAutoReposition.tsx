import { getDisplayName } from "helpers/react/getDisplayName";
import { ComponentType, FC, useEffect } from "react";
import omit from "lodash/omit";

interface PopupContentProps {
    reposition?: VoidFunction;
}

export const withAutoReposition = <T extends {}>(
    Component: ComponentType<T>,
): FC<T & PopupContentProps> => {
    const NewComponent: FC<T & PopupContentProps> = (props) => {
        useEffect(() => void props?.reposition(), []);

        return <Component {...omit(props, "reposition")} />;
    };
    NewComponent.displayName = `withAutoReposition(${getDisplayName(Component)})`;

    return NewComponent;
};
