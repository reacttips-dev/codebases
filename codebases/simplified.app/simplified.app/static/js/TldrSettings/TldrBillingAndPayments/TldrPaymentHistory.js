import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import { StyledCurrentPlanContainer } from "../../_components/styled/settings/stylesSettings";
import moment from "moment";
import { BILLING_AND_PRICING_DATE_FORMAT } from "../../_components/details/constants";
import { connect } from "react-redux";

class TldrPaymentHistory extends Component {
  downloadInvoice = (invoice) => {
    const win = window.open(invoice.invoice_pdf, "_blank");
    win.focus();
  };

  currencyFormatter = (amount) => {
    const { subscription } = this.props;

    var formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: subscription?.subscribedPlan?.plan
        ? subscription?.subscribedPlan?.plan?.currency
        : "USD",
      maximumFractionDigits: 0,
    });
    return formatter.format(amount);
  };

  render() {
    const { data } = this.props;

    const paymentHistoryView = data.map((payment, index) => {
      const { amount, created, invoice, payment_method_details } = payment;
      const transactionDate = moment(created).format(
        BILLING_AND_PRICING_DATE_FORMAT
      );

      return (
        <React.Fragment key={index}>
          <Col md={3} className="payment-history-info">
            {transactionDate}
          </Col>
          {/* <Col md={3} className="payment-history-info">
            {invoice?.invoceitems[0]?.price?.product?.name}
          </Col> */}
          <Col md={3} className="payment-history-info">
            •••• •••• •••• {payment_method_details?.card?.last4}
          </Col>
          <Col md={3} className="payment-history-info">
            {this.currencyFormatter(amount)}
          </Col>
          <Col
            md={3}
            className="payment-history-info invoice-download-button"
            onClick={() => this.downloadInvoice(invoice)}
          >
            Download
          </Col>
        </React.Fragment>
      );
    });

    return (
      <StyledCurrentPlanContainer>
        <Row className="current-plan-headings">
          <Col md={3}>Date</Col>
          {/* <Col md={3}>Description</Col> */}
          <Col md={3}>Payment Method</Col>
          <Col md={3}>Amount</Col>
          <Col md={3}>Invoice</Col>
        </Row>
        <Row className="current-plan-headings mt-2">{paymentHistoryView}</Row>
      </StyledCurrentPlanContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  subscription: state.subscription,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TldrPaymentHistory);
