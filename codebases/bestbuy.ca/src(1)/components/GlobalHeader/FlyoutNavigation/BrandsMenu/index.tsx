import { ChevronRight } from "@bbyca/bbyca-components";
import * as React from "react";
import { HeaderContext } from "../..";
import BrandGroup from "./BrandGroup";
import * as styles from "./style.css";
export class BrandsMenu extends React.Component {
    constructor(props) {
        super(props);
        this.mouseEnter = (e, selectedBrandGroupIndex) => {
            clearTimeout(this.timerInt);
            this.timerInt = setTimeout(() => this.setState({ selectedBrandGroupIndex }), 100);
        };
        this.mouseLeave = (e) => {
            clearTimeout(this.timerInt);
        };
        this.onBrandClick = (brand, groupTitle) => {
            this.props.resetFlyout();
            this.props.trackMenu([brand.ctaText.toLowerCase()]);
        };
        this.state = {
            selectedBrandGroupIndex: 0,
        };
    }
    render() {
        const { brandsMenuContent } = this.props;
        if (!brandsMenuContent ||
            !brandsMenuContent.brandMenu ||
            brandsMenuContent.brandMenu.length === 0) {
            return null;
        }
        const { selectedBrandGroupIndex } = this.state;
        const { brandMenu } = brandsMenuContent;
        return (React.createElement("div", { className: styles.brandsContainer },
            React.createElement("ul", { className: styles.brandGroupList, "data-automation": "brandGroup-list" }, brandMenu.map((brandNavigationGroup, index) => {
                return (React.createElement("li", { className: selectedBrandGroupIndex === index
                        ? styles.selected
                        : "", onMouseEnter: (e) => this.mouseEnter(e, index), onMouseLeave: this.mouseLeave, key: index },
                    React.createElement("span", { className: styles.brandGroupListItemText }, brandNavigationGroup.groupTitle),
                    React.createElement(ChevronRight, { color: "white", className: styles.arrowRight, viewBox: "0 0 24 24" })));
            })),
            brandMenu.map((brandNavigationGroup, index) => {
                const brands = [];
                brandNavigationGroup.groupedElements.forEach((elements) => elements.brands.forEach((brand) => {
                    brands.push(brand);
                }));
                const classNames = [
                    styles.brandGroup,
                    this.state.selectedBrandGroupIndex === index &&
                        styles.visible,
                ]
                    .filter((style) => !!style)
                    .join(" ");
                return (React.createElement(BrandGroup, { key: index, className: classNames, handleBrandClick: this.onBrandClick, client: this.props.client, groupTitle: brandNavigationGroup.groupTitle, brands: brands }));
            })));
    }
    componentDidMount() {
        if (!this.props.brandsMenuContent) {
            this.props.retrieveBrandsMenuContent(this.props.locale);
        }
    }
}
export default (props) => (React.createElement(HeaderContext.Consumer, null, (value) => (React.createElement(BrandsMenu, Object.assign({ locale: value.locale, client: value.client }, props)))));
//# sourceMappingURL=index.js.map