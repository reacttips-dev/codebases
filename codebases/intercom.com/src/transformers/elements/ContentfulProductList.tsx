import React from 'react'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import {
  ProductList,
  IProps as ProductListProps,
  IProductProps as ProductListItem,
} from 'marketing-site/src/library/elements/ProductList'
import {
  IProductList as IContentfulProductList,
  IProductWithDescription as IContentfulProductListItem,
} from 'marketing-site/@types/generated/contentful'

export function transformProductListItem({ fields }: IContentfulProductListItem): ProductListItem {
  return {
    ...fields,
    image: fields.image.fields.file.url,
  }
}

export const ContentfulProductList = (data: IContentfulProductList) => (
  <EntryMarker entry={data}>{() => <ProductList {...transformProductList(data)} />}</EntryMarker>
)

export function transformProductList({ fields }: IContentfulProductList): ProductListProps {
  return {
    ...fields,
    products: fields.products.map((data) => transformProductListItem(data)),
  }
}
