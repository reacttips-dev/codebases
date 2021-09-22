import * as React from "react";
import * as styles from "./styles.css";
var TransitionState;
(function (TransitionState) {
    TransitionState[TransitionState["INITIAL"] = 0] = "INITIAL";
    TransitionState[TransitionState["INPROGRESS"] = 1] = "INPROGRESS";
    TransitionState[TransitionState["COMPLETED"] = 2] = "COMPLETED";
})(TransitionState || (TransitionState = {}));
const TRANSITION_TIME = 200;
const TRANSITION_SETTLED_TIME = 500;
export default class Loader extends React.Component {
    constructor(props) {
        super(props);
        this.transition = () => {
            window.clearTimeout(this.transitionTimeout);
            const height = this.containerRef
                ? this.containerRef.offsetHeight + "px"
                : "auto";
            this.setState({
                loaderHeight: height,
                transitionState: TransitionState.INPROGRESS,
                mountContent: true,
                transitionClass: this.props.loading ? styles.loading : "",
            });
            this.transitionTimeout = window.setTimeout(() => {
                const loadedHeight = this.props.loading && this.props.resizeWhenLoading
                    ? this.getLoaderHeight()
                    : this.getContentHeight();
                this.setState({
                    loaderHeight: loadedHeight !== null ? Number(loadedHeight) + "px" : "auto",
                    transitionState: TransitionState.COMPLETED,
                });
                if (!this.props.loading) {
                    this.transitionTimeout = window.setTimeout(() => {
                        this.setState({
                            loaderHeight: "auto",
                            mountLoading: false,
                            transitionClass: "",
                        });
                    }, TRANSITION_SETTLED_TIME);
                }
                else if (this.props.loading) {
                    this.transitionTimeout = window.setTimeout(() => {
                        this.setState({
                            mountContent: false,
                            transitionClass: styles.loading,
                        });
                    }, TRANSITION_SETTLED_TIME);
                }
            }, TRANSITION_TIME);
        };
        this.getLoaderHeight = () => { var _a; return ((_a = this.loadingScreenRef) === null || _a === void 0 ? void 0 : _a.offsetHeight) || null; };
        this.getContentHeight = () => { var _a; return ((_a = this.contentScreenRef) === null || _a === void 0 ? void 0 : _a.offsetHeight) || null; };
        this.LoadingScreen = (props) => (React.createElement("div", { className: styles.loadingScreen, ref: (ref) => (this.loadingScreenRef = ref) }, props.children));
        this.LoadedContent = (props) => (React.createElement("div", { className: styles.loadedContent, ref: (ref) => (this.contentScreenRef = ref) }, props.children));
        this.state = {
            loaderHeight: "auto",
            transitionState: TransitionState.INITIAL,
            mountContent: false,
            mountLoading: props.loading,
            transitionClass: props.loading ? styles.loading : "",
        };
    }
    componentDidUpdate(prevProps, prevState) {
        if (!this.props.loading && !this.state.mountContent) {
            this.setState({ mountContent: true });
        }
        else if (!this.props.loading &&
            this.state.mountContent &&
            !prevState.mountContent) {
            this.transition();
        }
        else if (this.props.loading && !this.state.mountLoading) {
            this.setState({ mountLoading: true });
        }
        else if (this.props.loading &&
            this.state.mountLoading &&
            !prevState.mountLoading) {
            this.transition();
        }
    }
    componentDidMount() {
        this.setState({
            loaderHeight: this.props.loading
                ? Number(this.getLoaderHeight()) + "px"
                : "auto",
        });
    }
    render() {
        const minHeightStyle = {
            height: this.state.loaderHeight,
        };
        return (React.createElement("div", { ref: (ref) => (this.containerRef = ref), style: minHeightStyle, className: `${styles.loader} ${this.state.transitionClass}` },
            this.state.mountLoading && (React.createElement(this.LoadingScreen, null, this.props.loadingDisplay)),
            this.state.mountContent && (React.createElement(this.LoadedContent, null, this.props.children))));
    }
}
//# sourceMappingURL=Loader.js.map