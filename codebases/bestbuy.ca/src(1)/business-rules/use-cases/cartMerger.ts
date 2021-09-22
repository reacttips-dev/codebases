import * as _ from "lodash";
export const mergePrevShipment = (newShipments, oldShipments) => {
    if (!newShipments || !newShipments.length) {
        return oldShipments;
    }
    let returnShipments = [...newShipments];
    oldShipments.forEach((oldShipment, shipmentIndex) => {
        oldShipment.lineItems.forEach((lineItem, lineItemIndex) => {
            if (lineItem.removed) {
                const matchingShipmentIndex = _.findIndex(returnShipments, { seller: { id: oldShipment.seller.id } });
                if (matchingShipmentIndex > -1) {
                    returnShipments = insertLineItemIntoShipment({
                        lineItem,
                        lineItemIndex,
                        matchingShipmentIndex,
                        returnShipments,
                    });
                }
                else {
                    returnShipments = insertLineItemAndShipment({
                        lineItem,
                        oldShipments,
                        returnShipments,
                        shipmentIndex,
                    });
                }
            }
        });
    });
    return returnShipments;
};
const insertLineItemIntoShipment = ({ lineItem, lineItemIndex, matchingShipmentIndex, returnShipments, }) => [
    ...returnShipments.slice(0, matchingShipmentIndex),
    ...[Object.assign(Object.assign({}, returnShipments[matchingShipmentIndex]), { lineItems: [
                ...returnShipments[matchingShipmentIndex].lineItems.slice(0, lineItemIndex),
                Object.assign({}, lineItem),
                ...returnShipments[matchingShipmentIndex].lineItems.slice(lineItemIndex),
            ] })],
    ...returnShipments.slice(matchingShipmentIndex + 1),
];
const insertLineItemAndShipment = ({ lineItem, oldShipments, returnShipments, shipmentIndex, }) => [
    ...returnShipments.slice(0, shipmentIndex),
    ...[Object.assign(Object.assign({}, oldShipments[shipmentIndex]), { lineItems: [
                Object.assign({}, lineItem),
            ] })],
    ...returnShipments.slice(shipmentIndex),
];
//# sourceMappingURL=cartMerger.js.map