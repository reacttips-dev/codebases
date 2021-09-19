import React, { Component } from 'react';
import loadable from '@loadable/component';
import { connect, ConnectedProps } from 'react-redux';

import { toggleOosButton } from 'actions/productDetail';
import ProductUtils from 'helpers/ProductUtils';
import { FormattedProductBundle, FormattedProductSizing } from 'reducers/detail/productDetail';
import { ProductStyle } from 'types/cloudCatalog';
import { SelectedSizing } from 'types/product';
import { AppState } from 'types/app';
export const OutOfStockModal = loadable(() => import('components/productdetail/OutOfStockModal'));

interface OwnProps {
  detail: FormattedProductBundle;
  isProductNotifyOpen: boolean;
  onCloseProductNotifyMe: () => void;
  onOpenProductNotifyMe: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onStyleChange: (event: React.MouseEvent) => void;
  productId: string;
  productStyles: Record<string, ProductStyle>;
  selectedSizing: SelectedSizing;
  sizing: FormattedProductSizing;
  style: ProductStyle;
}

interface State {
  visible: null | boolean;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

/**
 * Lazy loading wrapper around zappos OOS Modal
 */
export class OutOfStockModalWrapper extends Component<Props, State> {
  state: State = {
    visible: null
  };

  componentDidUpdate(prevProps: Props) {
    const { selectedSizing: prevSelectedSizing, style: prevStyle } = prevProps;
    const { selectedSizing, style } = this.props;
    const isSizeChanged = prevSelectedSizing !== selectedSizing;
    const isStyleChanged = prevStyle.styleId !== style.styleId;
    if (isSizeChanged || isStyleChanged) {
      this.setState({ visible: null });
    }
  }

  closeModal = () => {
    this.setState({ visible: false });
    const { toggleOosButton } = this.props;
    toggleOosButton(false);
  };

  makeSelectedSizing = (sizeId?: string) => {
    const { selectedSizing, sizing: { dimensions } } = this.props;
    const sizingMap: SelectedSizing = {};

    dimensions.forEach(({ id, rank }) => {
      const dimId = `d${id}`;

      if (rank === '1') {
        sizingMap[dimId] = sizeId;
      } else {
        sizingMap[dimId] = selectedSizing[dimId];
      }
    });

    return sizingMap;
  };

  hasAlts = () => {
    const { selectedSizing, productStyles, sizing } = this.props;
    const { dimensions } = sizing;
    if (!dimensions.length) {
      return null;
    }
    const { id, rank } = dimensions[0];
    const dimId = `d${id}`;
    let currentSizedId;

    if (rank === '1') {
      currentSizedId = selectedSizing[dimId];
    }
    const { stockData } = sizing;
    const newSelectedSizing = this.makeSelectedSizing(currentSizedId);
    const colorsBySize = ProductUtils.getColorsBySize(stockData, newSelectedSizing);
    // Render sizing values only if there are available colors in stock
    if (colorsBySize.length) {

      // Find styleIds that have a color match with colorsBySize
      const matches = Object.keys(productStyles).filter(styleId => {
        const style = productStyles[styleId];// gets whole obj
        return (colorsBySize.find(obj => obj.color === style.colorId && obj.onHand !== '0'));
      });
      return matches.length;
    }
    return false;
  };

  render() {
    const { visible } = this.state;
    const { selectedSizing, sizing, style: { colorId }, isProductNotifyOpen, oosButtonClicked } = this.props;
    const { dimensions } = sizing;
    const allDimensionsSelected = dimensions.every(dim => selectedSizing[`d${dim.id}`]);
    if (!allDimensionsSelected) {
      return null;
    }

    const hasAlts = this.hasAlts();
    const stock = ProductUtils.getStockBySize(sizing.stockData, colorId, selectedSizing);

    let isVisible;
    if (oosButtonClicked) {
      isVisible = oosButtonClicked;
    } else if (visible !== null) {
      isVisible = visible && !isProductNotifyOpen;
    } else if (hasAlts && !stock || !isProductNotifyOpen && !hasAlts) {
      isVisible = !stock;
    } else {
      return null;
    }

    return isVisible && <OutOfStockModal {...this.props} makeSelectedSizing={this.makeSelectedSizing} hasAlts={hasAlts} onClose={this.closeModal}/>;
  }
}

export const mapDispatchToProps = {
  toggleOosButton
};
export const mapStateToProps = (state: AppState) => ({
  oosButtonClicked: state.product.oosButtonClicked
});
const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(OutOfStockModalWrapper);
