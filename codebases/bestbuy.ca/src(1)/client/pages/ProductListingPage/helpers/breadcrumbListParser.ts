import {BreadcrumbListItem} from "models";
import {InjectedIntl} from "react-intl";
import {Key} from "@bbyca/apex-components";

const getBreadcrumbs = (data: unknown, intl: InjectedIntl, key: Key): BreadcrumbListItem[] | null => {
    if (!Array.isArray(data)) {
        return null;
    }
    const breadcrumbs = data.map((breadcrumb) => {
        return {
            ...breadcrumb,
            href: breadcrumb.path,
            linkType: key as Key,
        };
    });

    return breadcrumbs;
};

export default getBreadcrumbs;
