import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import { StyledPaymentStatusModalBody } from "../../../_components/styled/home/stylesHome";
import { withRouter } from "react-router-dom";
import { BILLING_AND_PAYMENT } from "../../../_utils/routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class TldrPaymentStatusModal extends Component {
  render() {
    const { show, onHide, title, status } = this.props;

    return (
      <Modal show={show} onHide={onHide} centered size="sm" backdrop="static">
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <hr className="modal-hr" />
        <StyledPaymentStatusModalBody status={status}>
          {status === "success" ? (
            <FontAwesomeIcon icon="check-circle" className="icon" />
          ) : status === "error" ? (
            <FontAwesomeIcon icon="times-circle" className="icon" />
          ) : null}

          {status === "success" ? (
            <p className="title">Subscription Activated</p>
          ) : status === "error" ? (
            <p className="title">Transaction Failed!</p>
          ) : null}

          <p className="body-text">
            {status === "success"
              ? "Your subscription has been switched successfully."
              : status === "error"
              ? "Your transaction has been failed due to some technical error."
              : null}
          </p>
        </StyledPaymentStatusModalBody>
        <hr className="modal-hr" />

        <Modal.Footer>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              this.props.history.replace(BILLING_AND_PAYMENT);
            }}
            variant="outline-warning"
          >
            {status === "success"
              ? "Check payment history"
              : status === "error"
              ? "Try again later"
              : null}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TldrPaymentStatusModal));
