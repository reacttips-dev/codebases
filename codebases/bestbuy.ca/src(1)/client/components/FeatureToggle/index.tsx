import * as React from "react";
import {connect} from "react-redux";
import State from "store";
import {FEATURE_TOGGLES} from "config/featureToggles";
import {getFeatureToggle} from "store/selectors/configSelectors";

export {default as withFeatureToggle, DefaultComponent} from "./FeatureToggleHOC";

interface FeatureMappingType {
    [key: string]: {
        active: boolean;
        component: JSX.Element;
    };
}

interface FeatureToggleProps {
    flag?: FEATURE_TOGGLES;
    children?: React.ReactNode;
    isFeatureActive?: boolean;
    defaultComponent?: React.ReactNode;
    featureComponent?: React.ReactNode;
    featureMapping?: FeatureMappingType;
}

interface StateProps {
    isFeatureActive: boolean;
}

interface OwnProps {
    flag: string;
}

interface FeatureMappingProps {
    defaultComponent: React.ReactNode;
    featureMapping: FeatureMappingType;
}

export const FeatureMapping: React.FC<FeatureMappingProps> = ({
    defaultComponent,
    featureMapping,
}: FeatureMappingProps) => {
    const activeFeature = Object.keys(featureMapping).filter(
        (featureName: string) => featureMapping[featureName].active,
    );
    if (activeFeature.length !== 1) {
        return React.isValidElement(defaultComponent) ? defaultComponent : null;
    }
    return featureMapping[activeFeature[0]].component;
};

FeatureMapping.displayName = "FeatureMapping";

/**
 * @example:
 *      connected to the redux state:
 *          <FeatureToggle>
 *              flag={FEATURE_TOGGLES.someFeature}
 *              defaultComponent={<Default />}
 *              featureComponent={<Feature />}
 *          </FeatureToggle>
 *
 *
 *      with isActiveFeature props:
 *
 *          <FeatureToggle>
 *              isFeatureActive={isActive}
 *              defaultComponent={<Default />}
 *              featureComponent={<Feature />}
 *          </FeatureToggle>
 *
 *
 *      with featureMapping props:
 *
 *          <FeatureToggle>
 *              defaultComponent={<Default />}
 *              featureMapping={{
 *                  featureA: { active: true, component: <FeatureA /> },
 *                  featureB: { active: false, component: <FeatureB /> },
 *                  featureC: { active: false, component: <FeatureC /> },
 *              }}
 *          </FeatureToggle>
 *
 */
export const FeatureToggle: React.FC<FeatureToggleProps> = ({
    children,
    isFeatureActive,
    defaultComponent,
    featureComponent,
    featureMapping,
}: FeatureToggleProps) => {
    if (featureMapping && Object.keys(featureMapping).length >= 1) {
        return <FeatureMapping featureMapping={featureMapping} defaultComponent={defaultComponent} />;
    }

    if (isFeatureActive) {
        if (featureComponent && React.isValidElement(featureComponent)) {
            return <>{featureComponent}</>;
        }
        if (children && React.Children.count(children) !== 0) {
            return React.Children.only(children);
        }
    }

    return React.isValidElement(defaultComponent) ? defaultComponent : null;
};

FeatureToggle.displayName = "FeatureToggle";

const mapStateToProps = (state: State, {flag}: OwnProps): StateProps => ({
    isFeatureActive: getFeatureToggle(flag)(state),
});

export default connect<StateProps, {}, OwnProps & FeatureToggleProps, State>(mapStateToProps)(FeatureToggle);
