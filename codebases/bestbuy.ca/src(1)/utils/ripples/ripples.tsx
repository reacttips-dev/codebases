import * as React from "react";
import * as styles from "./style.css";
/* istanbul ignore next */
// Tests not needed as this is purely a visual effect
export default class Ripples extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            effectIndex: -1,
            fillItems: [],
        };
    }
    render() {
        return (React.createElement("div", { className: styles.ripples, ref: (containerRef) => {
                this.containerRef = containerRef;
            }, onMouseDown: this.addRipple.bind(this), onMouseUp: this.setInactive.bind(this) }, this.Ripples(this.state.fillItems)));
    }
    Ripples(fillItems) {
        return fillItems.map((item) => {
            if (item) {
                return (React.createElement("span", { key: item.index, style: {
                        left: item.x + "px",
                        top: item.y + "px",
                    }, className: "fillEffect" + " " + (item.active ? "active" : "") }));
            }
        });
    }
    addRipple(e) {
        this.clearRipple(this.state.effectIndex);
        const pos = this.containerRef.getBoundingClientRect();
        const x = e.pageX - window.pageXOffset - pos.left;
        const y = e.pageY - window.pageYOffset - pos.top;
        const newFillItem = { index: this.state.effectIndex, x, y, active: true };
        this.setState((prevState) => ({ fillItems: [...prevState.fillItems, newFillItem] }));
    }
    clearRipple(i) {
        this.setState((prevState) => ({
            fillItems: prevState.fillItems.filter((item) => item.index !== i),
        }));
    }
    setInactive() {
        this.setState((prevState) => {
            return {
                effectIndex: ((i) => (i %= 5))(prevState.effectIndex + 1),
                fillItems: prevState.fillItems.map((item) => (Object.assign(Object.assign({}, item), { active: false }))),
            };
        });
    }
}
//# sourceMappingURL=ripples.js.map