import PropTypes from 'prop-types';
import React from 'react';
import { getPriceForVC } from 'bundles/payments/promises/productPrices';
import ReactPriceDisplay from 'bundles/payments-common/components/ReactPriceDisplay';

class ClosedCoursePrice extends React.Component {
  static propTypes = {
    courseId: PropTypes.string.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      price: null,
    };
  }

  componentWillMount() {
    getPriceForVC({ courseId: this.props.courseId })
      .then((price) => this.setState({ price }))
      .done();
  }

  render() {
    const { price } = this.state;
    return price && <ReactPriceDisplay value={price.finalAmount} currency={price.currencyCode} />;
  }
}

export default ClosedCoursePrice;
