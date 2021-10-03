import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Button, Spinner } from "react-bootstrap";

class TldrPlanSwitchConfirmationModal extends Component {
  capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  currencyFormatter = (amount) => {
    const { newSubscription } = this.props;

    var formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: newSubscription ? newSubscription?.currency : "USD",
      maximumFractionDigits: 0,
    });
    return formatter.format(amount);
  };

  render() {
    const { show, onHide, onYes, loading, grade, newSubscription } = this.props;

    return (
      <Modal show={show} onHide={onHide} centered size="sm" backdrop="static">
        <Modal.Header>
          <Modal.Title>{this.capitalize(grade) + " subscription"}</Modal.Title>
        </Modal.Header>

        <hr className="modal-hr" />
        <Modal.Body>
          <div>
            {`You are about to subscribe to Simplified's ${
              newSubscription?.product?.name
            } plan for ${this.currencyFormatter(
              newSubscription?.unit_amount / 100
            )} per member per ${
              newSubscription?.recurring?.interval
            }. You will be charged a prorated amount, minus any account balance.`}
          </div>
        </Modal.Body>
        <hr className="modal-hr" />

        <Modal.Footer>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onHide();
            }}
            variant="outline-warning"
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onYes();
            }}
            variant="warning"
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span className="sr-only">{grade + "ing ..."}</span>
              </>
            ) : (
              this.capitalize(grade)
            )}
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
)(TldrPlanSwitchConfirmationModal);
