/**
 * Created by liorb on 5/11/17.
 */
import * as React from "react";
import { StatelessComponent } from "react";
import { i18nFilter } from "filters/ngFilters";
import * as classNames from "classnames";
import SWReactRootComponent from "decorators/SWReactRootComponent";

export interface PillProps {
    text: string;
    backgroundColor?: string;
    className?: string;
}

const Pill: StatelessComponent<PillProps> = ({ text, backgroundColor, className }) => (
    <span className={classNames("pill", className)}>{i18nFilter()(text)}</span>
);
SWReactRootComponent(Pill, "Pill");
export default Pill;
