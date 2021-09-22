import { Button } from "@similarweb/ui-components/dist/button";
import * as React from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { StatelessComponent } from "react";
import { i18nFilter } from "../../../filters/ngFilters";

export const ReactButton: StatelessComponent<any> = (props) => {
    const label = i18nFilter()(props.text);
    return <Button {...props}>{label}</Button>;
};
export default SWReactRootComponent(ReactButton, "ReactButton");
