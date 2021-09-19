export function extractCheckoutPixelServerData(state) {
  const {
    checkoutData: {
      purchase: {
        purchaseId,
        chargeSummary: { grandTotal }
      }
    }
  } = state;
  return {
    order: {
      id: purchaseId,
      grandTotal
    }
  };
}
