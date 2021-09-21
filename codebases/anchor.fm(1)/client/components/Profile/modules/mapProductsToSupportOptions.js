export default function mapProductsToSupportOptions(
  products = [],
  chosenProductId
) {
  return products
    .sort((a, b) => a.price - b.price)
    .map((product, idx) => ({
      id: product.productId,
      amount: product.price,
      name: product.name,
      isChosen: chosenProductId === product.productId,
    }));
}
