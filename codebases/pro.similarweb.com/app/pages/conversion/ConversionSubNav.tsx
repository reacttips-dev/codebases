import * as React from "react";
import { connect } from "react-redux";
import { Injector } from "../../../scripts/common/ioc/Injector";
import { SubNav } from "../../components/sub-navigation-bar/SubNav";
import SWReactRootComponent from "../../decorators/SWReactRootComponent";
import ConversionApiService from "../../services/conversion/conversionApiService";
import { ISegmentsData } from "../../services/conversion/ConversionSegmentsService";
import { ConversionResponsiveFilters } from "./ConversionResponsiveFilters";

export interface IConversionSubNavProps {
    routing: any;
    segments: ISegmentsData;
}

class ConversionSubNav extends React.PureComponent<IConversionSubNavProps, any> {
    private conversionApiService: ConversionApiService;
    private websitesMeta = {};
    private swNavigator;
    public constructor(props) {
        super(props);
        this.conversionApiService = new ConversionApiService();
        this.swNavigator = Injector.get<any>("swNavigator");
        this.state = {
            loadingMeta: true,
        };
    }

    public async componentDidMount() {
        this.websitesMeta = await this.conversionApiService.getWebConversionMeta();
        this.setState({
            loadingMeta: false,
        });
    }

    public render() {
        if (!this.isCorrectState(this.swNavigator.getState(this.props.routing.currentPage))) {
            return null;
        }
        const LeftComponent = this.swNavigator.current().leftSubNav;

        if (!this.props.segments) {
            return null;
        }

        return (
            <SubNav
                bottomLeftComponent={<LeftComponent />}
                bottomRightComponent={
                    <ConversionResponsiveFilters
                        currentPage={this.props.routing.currentPage}
                        params={this.props.routing.params}
                        segmentsData={this.props.segments}
                    />
                }
            />
        );
    }
    private isCorrectState(toState) {
        return this.swNavigator.isIndustryConversion(toState);
    }
}

function mapStateToProps({ routing, conversionModule: { segments } }) {
    return {
        routing,
        segments,
    };
}
export default SWReactRootComponent(
    connect(mapStateToProps, null)(ConversionSubNav),
    "ConversionSubNav",
);
