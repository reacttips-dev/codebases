import { Component } from 'react';
import { connect } from 'react-redux';

import ProductDetail from 'containers/ProductDetail';
import { PageLoader } from 'components/Loader';
import { loadProductDetailPage } from 'actions/productDetail';

function isProductDataLoaded(product, params) {
  return (params.asin && product.requestedAsin === params.asin) || (params.stockId && product.requestedStockId === params.stockId);
}

export class AsinStockIdProductDetail extends Component {
  static fetchDataOnServer(store, location, params) {
    return store.dispatch(loadProductDetailPage(params, { firePixel: true, errorOnOos: true }));
  }
  componentDidMount() {
    const { loadProductDetailPage, product, params } = this.props;
    if (!isProductDataLoaded(product, params)) {
      loadProductDetailPage (params, { firePixel: true });
    }
  }

  render() {
    const { product, params } = this.props;
    if (isProductDataLoaded(product, params)) {
      const { colorId, detail: { productId } } = product;
      const pdpParams = { productId, colorId };
      const location = { pathname: `/product/${productId}/color/${colorId}`, search: '' };
      return <ProductDetail params={pdpParams} location={location} />;
    } else {
      return <PageLoader />;
    }

  }
}

const mapStateToProps = state => ({
  product: state.product
});

export default connect(mapStateToProps, { loadProductDetailPage })(AsinStockIdProductDetail);
