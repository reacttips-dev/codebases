import * as React from "react";
import LinkGroup from "./components/LinkGroup";
import * as styles from "./style.css";
export class PrimaryLinks extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isPrimaryLinkClicked: false };
    }
    render() {
        return (React.createElement("div", { className: styles.primaryLinksContainer, "data-automation": "primary-links" }, this.props.links &&
            this.props.links.map((linkGroup, index) => (React.createElement(LinkGroup, { key: "footer-link-group-" + index, contentParser: this.props.contentParser, client: this.props.client, linkGroup: linkGroup.items, onLinkClick: (itemName) => this.props.track(itemName, this.props.client), title: linkGroup.ctaText })))));
    }
}
export default PrimaryLinks;
//# sourceMappingURL=index.js.map