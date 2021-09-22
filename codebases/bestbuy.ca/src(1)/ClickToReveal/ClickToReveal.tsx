import * as React from "react";
import { Button } from "../button";
export class ClickToReveal extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = (e) => {
            if (this.state.revealed) {
                if (this.props.clickOnRevealedText) {
                    this.props.clickOnRevealedText(e);
                }
            }
            else {
                // prevent default here so click on the button for the first time will only show reveal text
                e.preventDefault();
                this.setState({
                    revealed: true,
                    text: this.props.revealText,
                });
            }
        };
        this.state = { text: this.props.initialText, revealed: false };
    }
    render() {
        const appearance = this.props.appearance ? this.props.appearance : "tertiary";
        return (React.createElement(Button, { appearance: appearance, href: this.props.href, className: this.props.className, onClick: this.handleClick, "data-automation": "clickToReveal-btn" }, this.state.text));
    }
}
export default ClickToReveal;
//# sourceMappingURL=ClickToReveal.js.map