import * as React from "react";
import Truncate from "react-truncate";

export interface TruncateTextProps {
    maxLines?: number;
    trimWhitespace?: boolean;
}

export default class TruncateText extends React.Component<TruncateTextProps> {
    private truncate: Truncate | null;

    public render() {
        return (
            <Truncate
                lines={this.props.maxLines}
                ref={(ref) => (this.truncate = ref)}
                trimWhitespace={this.props.trimWhitespace}>
                {this.props.children}
            </Truncate>
        );
    }

    public componentDidMount() {
        window.addEventListener("resize", this.handleResize);
        // Time out is needed so truncate can recheck itself after the app has figured out screensize
        setTimeout(() => this.handleResize(), 0);
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    private handleResize = () => {
        if (this.truncate) {
            this.truncate.onResize();
        }
    };
}

TruncateText.defaultProps = {
    maxLines: 4,
};
