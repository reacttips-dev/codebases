import React, { PureComponent } from "react";
import Toast from "react-bootstrap/Toast";
import { connect } from "react-redux";
import { closeToast } from "../../_actions/toastActions";
import alertIcon from "../../assets/icons/ic_alert.svg";
import errorIcon from "../../assets/icons/ic_error.svg";
import successIcon from "../../assets/icons/ic_success.svg";
import infoIcon from "../../assets/icons/ic_info.svg";
import { TldrAction } from "./statelessView";

class TldrToastNotification extends PureComponent {
  // valid toast types: alert, error, success, info
  VALID_TYPES = ["alert", "error", "success", "info"];
  ICON_MAPPING = {
    alert: alertIcon,
    error: errorIcon,
    success: successIcon,
    info: infoIcon,
  };

  onToastCloseHandler = (toast) => {
    this.props.closeToast(toast.key);
  };

  render() {
    let toasts = this.props.toastList.map((toast) => {
      return (
        <Toast
          key={toast.key}
          onClose={() => this.onToastCloseHandler(toast)}
          show={true}
          delay={5000}
          autohide={toast.autohide === false ? false : true}
        >
          <Toast.Header closeButton={false}>
            <img
              src={this.ICON_MAPPING[toast.toastType]}
              alt="Icon"
              className="rounded mr-2"
              width="16"
              height="16"
            />
            <strong className="mr-auto">{toast.toastHeading}</strong>
            <TldrAction
              action="close"
              icon="times"
              title="Close"
              callback={() => this.onToastCloseHandler(toast)}
              className="close-btn"
            />
          </Toast.Header>
          <Toast.Body>{toast.toastMessage}</Toast.Body>
        </Toast>
      );
    });
    return <div className="tldr-toast-container">{toasts}</div>;
  }
}

const mapStateToProps = (state) => ({
  toastList: state.websockets?.toasts || [],
});

const mapDispatchToProps = (dispatch) => ({
  closeToast: (toastKey) => dispatch(closeToast(toastKey)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TldrToastNotification);
