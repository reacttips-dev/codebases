import * as React from "react";
import {DynamicContentModel, Dispatch, Seo} from "models";
import {injectIntl, InjectedIntlProps, InjectedIntl} from "react-intl";
import {connect} from "react-redux";
import State from "store";
import ProductListingPage from "../";
import {WithRouterProps, InjectedRouter} from "react-router";
import {bindActionCreators} from "redux";
import {BrandActionCreators, brandActionCreators} from "actions/brandActions";
import {RoutingState} from "reducers";
import parseBrandData from "../helpers/parseBrandData";

export interface BrandProps {
    dynamicContent?: DynamicContentModel;
    language: Language;
    routing: RoutingState;
    loading: boolean;
}

export interface BuildProps {
    intl: InjectedIntl;
    language: Language;
    location: string;
    router: InjectedRouter;
}

interface DispatchProps {
    brandActions: BrandActionCreators;
}

export const BrandL2Container: React.FC<BrandProps & InjectedIntlProps & WithRouterProps & DispatchProps> = (props) => {
    React.useEffect(() => {
        props.brandActions.syncBrandStateWithLocation(props.routing.locationBeforeTransitions);
    }, [props.routing.locationBeforeTransitions]);

    return (
        <ProductListingPage
            isLoading={props?.loading}
            {...parseBrandData(props?.dynamicContent, {
                intl: props.intl,
                language: props.language,
                location: props.location.pathname,
                router: props.router,
            })}
        />
    );
};

const mapStateToProps = (state: State): BrandProps => {
    return {
        loading: state.brand.loading,
        dynamicContent: state.brand.dynamicContent,
        language: state.intl.language,
        routing: state.routing,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        brandActions: bindActionCreators(brandActionCreators, dispatch),
    };
};

export default connect<BrandProps, {}, {}, State>(mapStateToProps, mapDispatchToProps)(injectIntl(BrandL2Container));
