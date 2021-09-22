import * as React from "react";
import * as styles from "./styles.css";
const randomWidth = (w) => Math.floor(Math.random() * (w - w / 2) + w / 2);
const Skeleton = (props) => {
    const width = props.maxWidth ? randomWidth(props.maxWidth) + "px" : props.width + "px" || "auto";
    const customClassName = props.className || "";
    return React.createElement("div", { style: { width }, className: `${styles.skeleton} ${styles[props.type]} ${customClassName}` });
};
export const Button = (props) => React.createElement(Skeleton, Object.assign({}, props, { type: "button" }));
export const Title = (props) => React.createElement(Skeleton, Object.assign({}, props, { type: "title" }));
export const Line = (props) => React.createElement(Skeleton, Object.assign({}, props, { type: "line" }));
export const Price = (props) => React.createElement(Skeleton, Object.assign({}, props, { type: "price" }));
export const Hr = (props) => React.createElement(Skeleton, Object.assign({}, props, { type: "hr" }));
export const Thumb = (props) => React.createElement(Skeleton, Object.assign({}, props, { type: "thumb" }));
export const ProductTile = (props) => (React.createElement("div", { className: styles.productTile },
    React.createElement(Skeleton, { type: "thumb" }),
    React.createElement(Skeleton, Object.assign({}, props, { maxWidth: 150, type: "line" })),
    React.createElement(Skeleton, Object.assign({}, props, { maxWidth: 150, type: "line" }))));
export const SideNavigation = (props) => (React.createElement("div", { className: styles.sideNavigation },
    React.createElement(Skeleton, Object.assign({}, props, { type: "title", className: styles.sideNavTitle })),
    React.createElement(Skeleton, Object.assign({}, props, { type: "line" })),
    React.createElement(Skeleton, Object.assign({}, props, { type: "line" })),
    React.createElement(Skeleton, Object.assign({}, props, { type: "line" })),
    React.createElement(Skeleton, Object.assign({}, props, { type: "line" })),
    React.createElement(Skeleton, Object.assign({}, props, { type: "line" })),
    React.createElement(Skeleton, Object.assign({}, props, { type: "line" }))));
export const Banner = (props) => React.createElement(Skeleton, Object.assign({}, props, { type: "banner" }));
//# sourceMappingURL=LoadingSkeleton.js.map