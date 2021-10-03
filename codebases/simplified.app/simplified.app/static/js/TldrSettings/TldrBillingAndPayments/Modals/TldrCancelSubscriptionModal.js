import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Button, Spinner } from "react-bootstrap";

class TldrCancelSubscriptionModal extends Component {
  render() {
    const { show, onHide, onYes, loading } = this.props;

    return (
      <Modal show={show} onHide={onHide} centered size="md" backdrop="static">
        <Modal.Header>
          <Modal.Title>Cancel Subscription</Modal.Title>
        </Modal.Header>

        <hr className="modal-hr" />
        <Modal.Body>
          <p>
            We'd like to know how to improve Simplified -what's your reasonto
            cancel subscription
          </p>
          <div className="subscription-cancel-reasons">
            <div className="subscription-cancel-reason-radio">
              <input
                type="radio"
                id="0"
                name="cancellation-reason"
                value="HTML"
              ></input>
              <label for="html">Don't want to answer</label>
            </div>
            <div className="subscription-cancel-reason-radio">
              <input
                type="radio"
                id="1"
                name="cancellation-reason"
                value="HTML"
              ></input>
              <label for="html">Cost is too high for me</label>
            </div>
            <div className="subscription-cancel-reason-radio">
              <input
                type="radio"
                id="2"
                name="cancellation-reason"
                value="HTML"
              ></input>
              <label for="html">Free plan is enough for me</label>
            </div>
            <div className="subscription-cancel-reason-radio">
              <input
                type="radio"
                id="3"
                name="cancellation-reason"
                value="HTML"
              ></input>
              <label for="html">I'll work in other app</label>
            </div>
            <div className="subscription-cancel-reason-radio">
              <input
                type="radio"
                id="4"
                name="cancellation-reason"
                value="HTML"
              ></input>
              <label for="html">Other</label>
            </div>
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
            Stay
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
                <span className="sr-only">Cancelling...</span>
              </>
            ) : (
              "Cancel Subscription"
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
)(TldrCancelSubscriptionModal);
