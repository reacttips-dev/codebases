import * as React from "react";
import {connect} from "react-redux";
import {compose} from "redux";
import State from "store";
import {FEATURE_TOGGLES} from "config/featureToggles";
import {FeatureToggles} from "config";

interface StateProps {
    features?: FeatureToggles;
}

export const DefaultComponent: React.FC = () => <></>;

const FeatureToggleHOC = (
    WrappedComponent: React.ComponentType<any | string>,
    flag: FEATURE_TOGGLES,
    defaultComponent: React.ComponentType<any | string> = DefaultComponent,
) => {
    return ({features, ...props}: {features?: FeatureToggles}) => {
        const isEnabled = features ? features[flag] : false;
        const Component = isEnabled ? WrappedComponent : defaultComponent;
        return <Component {...props} />;
    };
};

const mapStateToProps = (state: State): StateProps => ({
    features: state && state.config && state.config.features,
});

export default compose(connect<StateProps, {}, {}, State>(mapStateToProps), FeatureToggleHOC);
