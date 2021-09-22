import * as React from "react";
import { convertLocaleToLang } from "../../../models";
import routeManager from "../../../utils/routeManager";
export class Link extends React.Component {
    constructor() {
        super(...arguments);
        this.handleOnClick = (e, internalLinkHandler) => {
            if (this.props.onClick) {
                this.props.onClick(e);
            }
            if (!e.defaultPrevented && !this.props.external && !this.props.disableClientRender && internalLinkHandler) {
                e.preventDefault();
                internalLinkHandler(this.getHref(), this.props.to);
            }
        };
    }
    render() {
        return (React.createElement("a", Object.assign({ className: this.props.className, onClick: (e) => this.handleOnClick(e, this.props.internalLinkHandler), "aria-label": this.props.ariaLabel, href: this.getHref(), target: (!this.props.external || this.props.targetSelf) ? "_self" : "_blank", rel: this.props.rel || (this.props.external ? "external" : "") }, this.props.extraAttributes), this.props.children));
    }
    getHref() {
        if (this.props.href) {
            return this.props.href;
        }
        return this.getPath().pathname;
    }
    getPath() {
        const pathname = routeManager.getPathByKey(convertLocaleToLang(this.props.locale), this.props.to, ...(this.props.params || []));
        return {
            pathname,
            query: this.props.query,
        };
    }
}
export const LinkContext = React.createContext({ locale: "en-CA" });
export default (props) => React.createElement(LinkContext.Consumer, null, (value) => (React.createElement(Link, Object.assign({ internalLinkHandler: value.internalLinkHandler, locale: value.locale }, props))));
//# sourceMappingURL=index.js.map