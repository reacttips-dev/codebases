export default function createProps(props, className) {
    const newProps = {};
    Object.keys(props)
        .filter((key) => (key === "children"))
        .forEach((key) => (newProps[key] = props[key]));
    return Object.assign(Object.assign({}, newProps), { className });
}
//# sourceMappingURL=create-props.js.map