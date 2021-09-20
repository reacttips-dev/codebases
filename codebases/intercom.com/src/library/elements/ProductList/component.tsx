import React from 'react'
import { IProps } from './index'
import { Text } from '../../elements/Text'
import { Tooltip } from '../Tooltip'

export class ProductList extends React.PureComponent<IProps> {
  render() {
    const { title, products } = this.props
    const nameElement = (name: string) => (
      <div>
        <span className="name-highlight">
          <Text size="body+">{name}</Text>
        </span>
        <style jsx>
          {`
            .name-highlight {
              border-bottom: 1px dotted black;
              padding-bottom: 1px;
            }
            .name-highlight:hover {
              text-decoration: underline;
              border-bottom: 1px solid black;
            }
          `}
        </style>
      </div>
    )

    return (
      <div>
        <div className="product-list-title">
          <Text size="body">{title}</Text>
        </div>
        <ul>
          {products.map((product, index) => {
            return (
              <li key={index}>
                <div className="product" data-testid="product">
                  <span className="product-image">
                    {product.image && <img src={product.image} width="32" alt="" />}
                  </span>
                  <span className="product-name">
                    {product.description ? (
                      <Tooltip text={product.description}>{nameElement(product.name)}</Tooltip>
                    ) : (
                      nameElement(product.name)
                    )}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
        <style jsx>
          {`
            .product-list-title {
              margin-bottom: 20px;
            }
            .product {
              display: grid;
              grid-template-columns: [left] 32px [right] auto;
              grid-gap: 10px;
            }
            .product span {
              margin-bottom: 10px;
              vertical-align: middle;
            }
            .product-name {
              grid-column: right;
            }
            .product-image {
              grid-column: left;
            }
          `}
        </style>
      </div>
    )
  }
}
