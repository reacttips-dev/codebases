export type ProductForListenerSupport = {
  name: string;
  productId: string;
  price: number;
};

type FetchProductForListenerSupportResponse = {
  products: ProductForListenerSupport[];
};

export async function fetchProductsForListenerSupport(): Promise<FetchProductForListenerSupportResponse> {
  try {
    const response = await fetch('/api/products/supporters', {
      credentials: 'same-origin',
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('Unable to fetch products for listener support');
  } catch (err) {
    throw new Error(err.message);
  }
}
