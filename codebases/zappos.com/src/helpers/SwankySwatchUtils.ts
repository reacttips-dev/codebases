import { ProductDetailState } from 'reducers/detail/productDetail';
import { ProductStockData, ProductStyle } from 'types/cloudCatalog';
import { SelectedSizing } from 'types/product';

export function showSwankySwatches(styleList: ProductStyle[] = [], hydraBuyBoxTest: boolean = false) {
  return hydraBuyBoxTest && styleList?.length <= 16;
}

function stockMatchesFieldInGivenSizing(key: string, stock: ProductStockData, givenSizing: SelectedSizing) {
  if (!givenSizing[key]) {
    return true;
  }
  return stock[key] === givenSizing[key];
}

function stockMatchesColorAndGivenSizing(
  stock: ProductStockData,
  colorId: string,
  givenSizing: SelectedSizing
) {
  return (
    stock.color === colorId &&
      stockMatchesFieldInGivenSizing('d3', stock, givenSizing) &&
      stockMatchesFieldInGivenSizing('d4', stock, givenSizing)
  );
}

export function isColorOosForGivenSizing(colorId: string, givenSizing: SelectedSizing, stockData: ProductStockData[] = []) {
  const matchingStock = stockData.find(stock => stockMatchesColorAndGivenSizing(stock, colorId, givenSizing));
  if (!matchingStock) {
    return true;
  }
  return matchingStock.onHand === '0';
}

export function isColorOosForSelectedSizing(colorId: string, productState: ProductDetailState) {
  return isColorOosForGivenSizing(colorId, productState.selectedSizing, productState.detail?.sizing.stockData);
}
