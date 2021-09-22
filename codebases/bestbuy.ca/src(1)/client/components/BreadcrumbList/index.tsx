import {ChevronRight} from "@bbyca/bbyca-components";
import {BreadcrumbListItem} from "models/Breadcrumb";
import {Key} from "@bbyca/apex-components";
import * as React from "react";
import Link from "../Link";
import * as styles from "./style.css";
import {replaceAllSpacesBy} from "utils/stringUtils";
import {classname} from "utils/classname";

export interface BreadcrumbProps {
    breadcrumbListItems: BreadcrumbListItem[];
    className?: string;
    disableSeoAttributes?: boolean;
}

export const createCrumb = (breadcrumbItem: BreadcrumbListItem, isLastCrumb, disableSeoAttributes: boolean) => {
    const dataAutomation = `breadcrumb-${replaceAllSpacesBy(breadcrumbItem.label, "-").toLowerCase()}`;
    const breadCrumbStyling = `${styles.breadcrumbLink} ${isLastCrumb ? styles.lastCrumb : ""}`;
    const props = disableSeoAttributes ? {} : {property: "item", typeof: "WebPage"};

    if (!!breadcrumbItem.linkType) {
        return (
            <Link
                to={breadcrumbItem.linkType as Key}
                params={breadcrumbItem.linkParams || [breadcrumbItem.seoText, breadcrumbItem.linkTypeId]}
                onClick={breadcrumbItem.onClick && !isLastCrumb ? (e) => breadcrumbItem.onClick(e) : undefined}
                ariaLabel={`${breadcrumbItem.label} ${isLastCrumb ? "current page" : ""}`}
                className={breadCrumbStyling}
                extraAttrs={{"data-automation": dataAutomation}}
                href={breadcrumbItem.href}
                {...props}>
                <span className="x-crumb" property="name">
                    {breadcrumbItem.label}
                </span>
            </Link>
        );
    } else {
        // we handle a "search" crumb differently that it would need to be a span tag. no impact on seo since we don't account for search.
        return (
            <span
                role="button"
                className={breadCrumbStyling}
                {...props}
                onClick={isLastCrumb ? undefined : (e) => breadcrumbItem.onClick(e)}>
                <span className="x-crumb" data-automation={dataAutomation} property="name">
                    {breadcrumbItem.label}
                </span>
            </span>
        );
    }
};

export const BreadcrumbList = (props: BreadcrumbProps) => {
    const breadcrumbClassNames = classname([
        props.breadcrumbListItems.length === 0 ? styles.hide : undefined,
        props.className,
        styles.breadcrumbList,
        "x-breadcrumbs",
    ]);
    const olProps = props.disableSeoAttributes ? {} : {typeof: "BreadcrumbList", vocab: "http://schema.org/"};
    const liProps = props.disableSeoAttributes ? {} : {property: "itemListElement", typeof: "ListItem"};

    return (
        <ol className={breadcrumbClassNames} {...olProps} data-automation="breadcrumb-container">
            {props.breadcrumbListItems.map((item, index, breadCrumbArr) => {
                const isLastItem = index === breadCrumbArr.length - 1;
                return (
                    <li key={index} {...liProps}>
                        {createCrumb(item, isLastItem, props.disableSeoAttributes)}
                        {!isLastItem && <ChevronRight className={styles.icon} />}
                        {!props.disableSeoAttributes && <meta property="position" content={(index + 1).toString()} />}
                    </li>
                );
            })}
        </ol>
    );
};

export default BreadcrumbList;
