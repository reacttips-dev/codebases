import { Injector } from "common/ioc/Injector";
import PageTitle from "components/React/PageTitle/PageTitle";
import * as React from "react";
import { connect } from "react-redux";
import { SubNav } from "../../components/sub-navigation-bar/SubNav";
import SWReactRootComponent from "../../decorators/SWReactRootComponent";
import SegmentsResponsiveFilters from "./SegmentsResponsiveFilters";
import { SegmentsUtils } from "services/segments/SegmentsUtils";
import SegmentsQueryBar from "pages/segments/querybar/SegmentsQueryBar";

class SegmentsSubNav extends React.PureComponent<any, any> {
    private swNavigator: any;
    private isMidTierUser: boolean;
    public constructor(props) {
        super(props);
        this.swNavigator = Injector.get<any>("swNavigator");
        this.isMidTierUser = SegmentsUtils.isMidTierUser();
    }
    public render() {
        const LeftComponent = this.swNavigator.current().leftSubNav
            ? this.swNavigator.current().leftSubNav
            : PageTitle;
        return (
            <SubNav
                topLeftComponent={<SegmentsQueryBar isMidTierUser={this.isMidTierUser} />}
                bottomLeftComponent={<LeftComponent />}
                bottomRightComponent={<SegmentsResponsiveFilters />}
            />
        );
    }
}
function mapStateToProps(store) {
    const {
        routing: { params },
    } = store;
    return {
        params,
    };
}

export default SWReactRootComponent(
    connect(mapStateToProps, undefined)(SegmentsSubNav),
    "SegmentsSubNav",
);
