import PropTypes from "prop-types";
import React from "react";

export class TrackProviderLegacy extends React.Component<any, any> {
    public static childContextTypes = {
        track: PropTypes.func,
        trackWithGuid: PropTypes.func.isRequired,
    };
    public static propTypes = {
        track: PropTypes.func.isRequired,
        trackWithGuid: PropTypes.func.isRequired,
    };

    public getChildContext() {
        return {
            track: this.props.track,
            trackWithGuid: this.props.trackWithGuid,
        };
    }
    public render() {
        return this.props.children;
    }
}
