import * as React from "react";
export class ScrollStyle extends React.Component {
    constructor(props) {
        super(props);
        this.checkPos = () => {
            const yPos = this.refEl.getBoundingClientRect().top + window.pageYOffset;
            if (window && window.pageYOffset >= yPos && !this.state.active) {
                this.setState({
                    active: true,
                });
            }
            if (window && window.pageYOffset < yPos && this.state.active) {
                this.setState({
                    active: false,
                });
            }
        };
        this.state = {
            active: false,
        };
    }
    componentDidMount() {
        this.refEl = document.querySelectorAll(this.props.targetSelector)[0];
        if (window && this.refEl) {
            this.checkInterval = window.setInterval(this.checkPos, 50);
        }
    }
    componentWillUnmount() {
        if (this.checkInterval) {
            window.clearInterval(this.checkInterval);
        }
    }
    render() {
        return React.createElement("div", { className: this.state.active ? this.props.activeClassName : "" }, this.props.children);
    }
}
export default ScrollStyle;
//# sourceMappingURL=ScrollStyle.js.map