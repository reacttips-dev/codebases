import {ChevronDown, ChevronRight, ChevronUp, Link as BBYLink} from "@bbyca/bbyca-components";
import * as React from "react";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {Link as ReactLink} from "react-router";
import {convertLocaleToLang} from "../../models";
import {Key} from "@bbyca/apex-components";
import routeManager from "../../utils/routeManager";
import * as styles from "./styles.css";
import {buildHref, filterHash} from "../../utils/withRouterLink";
import {Locale} from "@bbyca/apex-components/dist/models";
import {classname} from "utils/classname";

export interface Props {
    disabled?: boolean;
    className?: string;
    chevronType?: "up" | "down" | "right";
    onClick?: (e: React.MouseEvent<any>) => void;
    params?: Array<string | undefined>;
    itemProp?: string;
    to?: Key;
    ariaLabel?: string;
    query?: object;
    external?: boolean;
    internalUrl?: boolean;
    href?: string;
    typeof?: string;
    property?: string;
    disableClientRender?: boolean; // cases where we want to use "to" prop but, not the react link
    targetSelf?: boolean;
    extraAttrs?: {[key: string]: string};
    rel?: string;
    disableSeoAttributes?: boolean;
}

const disabledOnClickHandler = (evt: React.MouseEvent): void => evt.preventDefault();

class Link extends React.Component<Props & InjectedIntlProps> {
    public render() {
        const {
            chevronType,
            className,
            disabled,
            onClick,
            itemProp,
            targetSelf,
            children,
            property,
            ariaLabel,
            rel,
            extraAttrs,
            external,
            disableClientRender,
            disableSeoAttributes,
            href,
        } = this.props;

        const disabledStyle = disabled ? styles.disabled : "";
        const onClickHandler = disabled ? disabledOnClickHandler : onClick;

        let reactLinkItemProps = {};
        if (!disableSeoAttributes && itemProp) {
            reactLinkItemProps = {itemProp};
        }

        return external || disableClientRender ? (
            <BBYLink
                className={classname([className, disabledStyle])}
                chevronType={chevronType}
                href={this.getHref() || "javascript: void(0);"}
                onClick={onClickHandler}
                targetSelf={!external || targetSelf}
                rel={rel || (external ? "external" : "")}>
                {children}
            </BBYLink>
        ) : (
            <ReactLink
                {...reactLinkItemProps}
                typeof={this.props.typeof}
                property={property}
                to={href || this.getPath() || "javascript: void(0);"}
                onClick={onClickHandler}
                aria-label={ariaLabel}
                className={classname([
                    {
                        [styles.link]: true,
                        [styles.withChevron]: chevronType,
                    },
                    className,
                    disabledStyle,
                ])}
                rel={rel}
                {...extraAttrs}>
                {children}
                <this.Chevron type={chevronType} />
            </ReactLink>
        );
    }

    private Chevron = (props: {type: Props["chevronType"]}) => {
        const chevronProps = {
            className: styles.chevron,
            viewBox: "-6 -2 32 32",
        };
        switch (props.type) {
            case "up":
                return <ChevronUp {...chevronProps} />;
            case "down":
                return <ChevronDown {...chevronProps} />;
            case "right":
                return <ChevronRight {...chevronProps} />;
            default:
                return null;
        }
    };

    private getHref(): string | undefined {
        const {href, external, disabled} = this.props;

        if (disabled) {
            return;
        }

        const linkHref = external && href ? href : buildHref(this.getPath());
        return linkHref || "javascript: void(0);";
    }

    // Todo: figure out a way to use withRouterLink.getPath without jest complaining
    private getPath() {
        const {to, params, intl, disabled}: any = this.props;

        if (disabled) {
            return;
        }

        let {query}: any = this.props;

        const hash = !!query && !!query["#"] ? `#${query["#"]}` : "";
        query = (!!query && filterHash(query)) || undefined;

        const pathname =
            to && routeManager.getPathByKey(convertLocaleToLang(intl.locale as Locale), to as Key, ...(params || []));
        return pathname
            ? {
                  pathname,
                  query,
                  hash,
              }
            : undefined;
    }
}

export default injectIntl<Props>(Link);
