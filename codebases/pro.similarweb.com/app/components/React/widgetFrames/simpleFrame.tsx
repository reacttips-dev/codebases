import * as React from "react";
import * as PropTypes from "prop-types";
import { StatelessComponent } from "react";
import * as classNames from "classnames";
import frameStates from "./frameStates";
import { CircularLoader } from "../CircularLoader/CircularLoader";
import I18n from "../Filters/I18n";

export const DefaultFrameLoader = (props) => {
    const { style = {}, ...other } = props;
    return (
        <div
            style={{ display: "flex", alignItems: "center", justifyContent: "center", ...style }}
            {...other}
        >
            <CircularLoader
                options={{
                    svg: {
                        stroke: "#dedede",
                        strokeWidth: "4",
                        r: 21,
                        cx: "50%",
                        cy: "50%",
                    },
                    style: {
                        width: 46,
                        height: 46,
                    },
                }}
            />
        </div>
    );
};

export const DefaultFrameError = ({ errorMessageTop, errorMessageBottom, ...props }) => (
    <div className="u-flex-row u-justifyCenter u-flex-center" {...props}>
        <div className="noData-content">
            <div className="noData-icon">
                <i className="sw-icon-no-data" />
            </div>
            {errorMessageTop && (
                <div className="u-uppercase">
                    <I18n>{errorMessageTop}</I18n>
                </div>
            )}
            {errorMessageBottom && (
                <div className="u-uppercase">
                    <I18n>{errorMessageBottom}</I18n>
                </div>
            )}
        </div>
    </div>
);

const renderContent = (content, context) => {
    if (React.isValidElement(content)) {
        // content is React element - just render it
        return content;
    } else {
        switch (typeof content) {
            case "boolean":
                const DefaultStateComponent = defaultProps[`on${context}`];
                return content && <DefaultStateComponent />; // the guard is to make sure we dont render anything
            // is case 'false' is passed
            case "function":
                const ContentComponent = content; // React component is passed in,
                return <ContentComponent />;

            default:
                return null; // unrecognized content type - dont render
        }
    }
};

const SimpleFrame: StatelessComponent<any> = ({
    state,
    header = null,
    onLoading,
    onLoaded,
    onError,
    onNoData,
    errorMessageTop,
    errorMessageBottom,
    ...otherProps
}) => {
    const { className, ...outsideProps } = otherProps;
    let content;
    switch (frameStates[frameStates[state]]) {
        case frameStates.Loading:
            content = onLoading;
            break;
        case frameStates.Loaded:
            content = onLoaded;
            break;
        case frameStates.Error:
            content = onError;
            break;
        case frameStates.NoData:
            content = onNoData;
            break;
    }
    return (
        <div
            data-frame-state={[frameStates[state]]}
            className={classNames("react-widget-frame", className)}
            {...outsideProps}
        >
            {header}
            {renderContent(content, frameStates[state])}
        </div>
    );
};

const defaultErrorMessageTop = "global.nodata.notavilable",
    defaultErrorMessageBottom = ""; // no bottom message by default

export const defaultProps = {
    onLoading: null,
    errorMessageTop: defaultErrorMessageTop,
    errorMessageBottom: defaultErrorMessageBottom,
    onError: (props) => (
        <DefaultFrameError
            errorMessageTop={defaultErrorMessageTop}
            errorMessageBottom={defaultErrorMessageBottom}
            {...props}
        />
    ),
    onNoData: (props) => (
        <DefaultFrameError
            errorMessageTop={defaultErrorMessageTop}
            errorMessageBottom={defaultErrorMessageBottom}
            {...props}
        />
    ),
};

SimpleFrame.propTypes = {
    state: PropTypes.number.isRequired,
    onLoaded: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
    header: PropTypes.element,
    onLoading: PropTypes.oneOfType([PropTypes.element, PropTypes.bool, PropTypes.func]),
    onNoData: PropTypes.oneOfType([PropTypes.element, PropTypes.bool, PropTypes.func]),
    onError: PropTypes.oneOfType([PropTypes.element, PropTypes.bool, PropTypes.func]),
    errorMessageTop: PropTypes.string, // if you want to use the defaultErrorComponent and just change the text
    errorMessageBottom: PropTypes.string, // if you want to use the defaultErrorComponent and just change the text
};

SimpleFrame.defaultProps = defaultProps;

export default SimpleFrame;
