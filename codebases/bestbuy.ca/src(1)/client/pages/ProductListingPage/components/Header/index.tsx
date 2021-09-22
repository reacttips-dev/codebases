import * as React from "react";
import TitleHeader from "components/TitleHeader";
import {BreadcrumbListItem} from "models";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {getBreadcrumbRoot} from "utils/builders";
import BreadcrumbList from "components/BreadcrumbList";
import * as styles from "./style.css";
import {classname} from "utils/classname";

export interface HeaderProps {
    title: string;
    breadcrumbList: BreadcrumbListItem[];
    desktopOnlyTitle?: boolean;
}

export const buildBreadcrumbList = (breadcrumbList: BreadcrumbListItem[], i18n: InjectedIntlProps) =>
    !!breadcrumbList ? [getBreadcrumbRoot(i18n), ...breadcrumbList] : [];

export const Header: React.FC<HeaderProps> = (props: any) => {
    const fullBreadcrumbList = buildBreadcrumbList(props.breadcrumbList, props.intl);
    const titleHeaderClassNames = classname([
        styles.titleHeader,
        fullBreadcrumbList.length === 0 ? styles.titleHeaderOnly : undefined, // remove this once breadcrumb and titleheader is normalized on all pages
    ]);
    const containerClassName = classname([
        !!props.desktopOnlyTitle ? styles.desktopOnly : undefined, // remove this once breadcrumb and titleheader is normalized on all pages
    ]);

    return (
        <div className={containerClassName}>
            <BreadcrumbList className={styles.breadcrumb} breadcrumbListItems={fullBreadcrumbList} />
            <TitleHeader className={titleHeaderClassNames} title={props.title} />
        </div>
    );
};

Header.displayName = "Header";

export default injectIntl(Header);
