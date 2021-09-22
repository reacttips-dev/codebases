import { connect } from "react-redux";
import * as FromServicePlanBenefits from "../../redux/servicePlanBenefits";
const mapStateToProps = (state) => ({
    benefits: FromServicePlanBenefits.getBenefits(state.servicePlanBenefits),
    isLoadingBenefits: FromServicePlanBenefits.isFetchingBenefits(state.servicePlanBenefits),
    servicePlanType: FromServicePlanBenefits.getServicePlanType(state.servicePlanBenefits),
});
const mapDispatchToProps = (dispatch, ownProps) => ({
    retrieveBenefits: () => dispatch(FromServicePlanBenefits.retrieveBenefits(ownProps.sku)),
});
export default connect(mapStateToProps, mapDispatchToProps);
//# sourceMappingURL=ReduxBenefitPageConnector.js.map