import * as React from "react";
import routeManager from "../routeManager";
import {convertLocaleToLang} from "../../models";
import {LocationDescriptorObject} from "../../../../node_modules/@types/history";
import {Props as LinkProps} from "../../components/Link";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {buildQueryString} from "utils/queryString";
import {bindActionCreators} from "redux";
import {connect, Dispatch} from "react-redux";
import {routingActionCreators, AppActions, RoutingActionCreators} from "actions";

interface AnyObject {
    [key: string]: any;
}

interface RoutePath {
    pathname?: string;
    query?: {[key: string]: string};
    hash?: string;
}

export interface DispatchProps {
    routingActions: RoutingActionCreators;
}

// TODO: to be refactored on CMS update.
export const filterHash = (query: AnyObject) => {
    const queryArr = Object.keys(query)
        .filter((key: string) => key !== "#")
        .reduce((obj: AnyObject, key: string) => {
            obj[key] = query[key];
            return obj;
        }, {});
    return {...queryArr};
};

export const getPath = (props: LinkProps, locale: Locale): LocationDescriptorObject | undefined => {
    const {to, params}: any = props;
    let {query}: any = props;

    const hash = !!query && !!query["#"] ? `#${query["#"]}` : "";
    query = (!!query && filterHash(query)) || undefined;
    const pathname = to && routeManager.getPathByKey(convertLocaleToLang(locale), to, ...(params || []));

    return pathname
        ? {
              pathname,
              query,
              hash,
          }
        : undefined;
};

const handleRouterClick = (
    routingActions: RoutingActionCreators,
    routerPath?: LocationDescriptorObject | string,
    onClick?: (e: React.MouseEvent) => void,
) => (e: React.MouseEvent) => {
    if (routerPath) {
        e.preventDefault();
        routingActions.push(routerPath);
    }

    if (onClick) {
        onClick(e);
    }
};

export const buildHref = (routerPath?: RoutePath): string | undefined => {
    if (routerPath && routerPath.pathname) {
        const queryParams = (routerPath.query && buildQueryString(routerPath.query)) || "";
        const hash = routerPath.hash || "";
        return routerPath.pathname + queryParams + hash;
    }
};

export const withRouterLink = <T extends LinkProps>(Component: React.ComponentType<T>): React.ComponentType<T> => {
    const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
        routingActions: bindActionCreators(routingActionCreators, dispatch),
    });

    const ComponentWithIntl = injectIntl((props: T & InjectedIntlProps & DispatchProps) => {
        const {external, disableClientRender, intl, internalUrl} = props;
        const isExternal = !!(disableClientRender || external);
        const routerPath = getPath(props, intl.locale as Locale);
        const linkHref = !!(external || internalUrl) && props.href ? props.href : buildHref(routerPath);
        const routeTo = !!internalUrl ? props.href : routerPath;

        return (
            <Component
                {...props}
                href={linkHref || "javascript: void(0);"}
                onClick={handleRouterClick(props.routingActions, !isExternal ? routeTo : undefined, props.onClick)}
            />
        );
    });
    const ConnectedComponent = connect<DispatchProps>(null, mapDispatchToProps)(ComponentWithIntl);
    return (props) => <ConnectedComponent {...props} />;
};

export default withRouterLink;
