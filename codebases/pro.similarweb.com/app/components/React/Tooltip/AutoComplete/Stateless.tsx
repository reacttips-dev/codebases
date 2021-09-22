import * as React from "react";
/**
 * a simple item component
 * @returns {any}
 * @constructor
 * @param value
 * @param query
 * @param children the parsed content
 */
import { IAutoCompleteItemComponentProps } from "./AutoComplete";
export const SimpleItem: React.StatelessComponent<IAutoCompleteItemComponentProps> = function SimpleItem({
    value,
    query,
    children,
}) {
    return <a style={{ color: "#2B3D52", padding: "5px 20px" }}>{children}</a>;
};
export const KeywordItem: React.StatelessComponent<IAutoCompleteItemComponentProps> = function SimpleItem({
    value,
    query,
    children,
}) {
    return (
        <a style={{ color: "#2B3D52", padding: "5px 20px" }}>
            <i className="sw-icon-keywords-list" style={{ fontSize: 12, marginRight: 10 }} />
            {children}
        </a>
    );
};
/**
 * Default Emphasis Component
 * @param value
 * @returns {any}
 * @constructor
 */
export const StrongEmphasisComponent: React.StatelessComponent<IAutoCompleteItemComponentProps> = function StrongEmphasisComponent({
    value,
    query,
    children,
}) {
    return <strong>{children}</strong>;
};
