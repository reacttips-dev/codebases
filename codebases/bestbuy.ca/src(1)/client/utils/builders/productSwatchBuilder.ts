export const buildProductSwatchUrl = (sku: string, baseUrl: string): string => {
    const lowerCaseSku = sku.toLowerCase();
    return `${baseUrl}/multimedia/products/swatches/${lowerCaseSku.slice(0, 3)}/${lowerCaseSku.slice(0, 5)}/${lowerCaseSku}.gif`;
};
