import React, { Component } from 'react';
import loadable from '@loadable/component';
import cn from 'classnames';

import { SimilarStyles } from 'types/product';
import { ProductStockData } from 'types/cloudCatalog';

import css from 'styles/components/productdetail/outOfStockPopoverWrapper.scss';
export const OutOfStockPopover = loadable(() => import('components/productdetail/OutOfStockPopover'));

interface Props {
  brandId: string;
  brandName: string;
  recos?: SimilarStyles;
  stock: ProductStockData | null;
  isSubmitted: boolean;
  onBrandNotifySubmit: any; // TODO type this when `Brand` types are finished
  onShow: () => void;
}

interface State {
  visible: null | boolean;
}

class OutOfStockPopoverWrapper extends Component<Props, State> {
  state = {
    visible: null
  };

  componentDidUpdate(prevProps: Props) {
    const { stock, onShow } = this.props;
    if (stock !== prevProps.stock) {
      this.setState({ visible: null });
    }
    if (!stock && prevProps.stock && this.state.visible === null) {
      onShow();
    }
  }

  onCloseClick = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible } = this.state;
    const { stock } = this.props;
    // Set initial visibility based on props (product is out of stock)
    // Subsequently, it should respect local state visibility when close button is clicked
    const isVisible = visible !== null ? visible : !stock;
    return (
      <div className={cn(css.oosPopoverWrapper, { [css.slideIn]: isVisible })}>
        {isVisible && <OutOfStockPopover {...this.props} onCloseClick={this.onCloseClick}/>}
      </div>
    );
  }
}

export default OutOfStockPopoverWrapper;
