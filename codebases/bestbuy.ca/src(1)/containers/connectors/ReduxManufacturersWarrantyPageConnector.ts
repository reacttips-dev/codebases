import { connect } from "react-redux";
import { GetManufacturerWarrantyStatus } from "../../business-rules/entities";
import { getManufacturerWarranty, isGetManufacturerWarrantyStatus, retrieveManufacturerWarranty, } from "../../redux/manufacturerWarranty";
const mapStateToProps = (state) => ({
    hasFetchingManufacturerWarrantyFailed: isGetManufacturerWarrantyStatus(state.manufacturerWarranty, GetManufacturerWarrantyStatus.FAILURE),
    isFetchingManufacturerWarranty: isGetManufacturerWarrantyStatus(state.manufacturerWarranty, GetManufacturerWarrantyStatus.PROCESSING),
    manufacturerWarranty: getManufacturerWarranty(state.manufacturerWarranty),
});
const mapDispatchToProps = (dispatch, ownProps) => ({
    retrieveManufacturerWarranty: () => dispatch(retrieveManufacturerWarranty(ownProps.sku)),
});
export default connect(mapStateToProps, mapDispatchToProps);
//# sourceMappingURL=ReduxManufacturersWarrantyPageConnector.js.map