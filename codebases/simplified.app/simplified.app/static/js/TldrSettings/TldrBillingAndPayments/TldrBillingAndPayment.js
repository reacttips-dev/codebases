import React, { Component } from "react";
import { StyledSettingsBaseDiv } from "../../_components/styled/settings/stylesSettings";
import TldrSettingsBase from "../TldrSettingsBase";
import TldrCurrentPlan from "./TldrCurrentPlan";
import TldrPaymentHistory from "./TldrPaymentHistory";
import { ShowCenterSpinner } from "../../_components/common/statelessView";
import { connect } from "react-redux";
import {
  fetchPaymentHistory,
  getSubscription,
} from "../../_actions/subscriptionActions";
import { syncWorkSpaces } from "../../_actions/authActions";

class TldrBillingAndPayment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paymentHistoryPayload: [],
      loaded: false,
    };
  }

  componentDidMount() {
    this.getSubscription();
    this.fetchPaymentHistory();
    this.syncWorkspaces();
  }

  getSubscription = () => {
    this.props.getSubscription();
  };

  fetchPaymentHistory = () => {
    this.props
      .fetchPaymentHistory()
      .then((res) => {
        this.setState({
          ...this.state,
          paymentHistoryPayload: res.data.results,
          loaded: true,
        });
      })
      .catch((error) => {
        this.setState({
          ...this.state,
          loaded: true,
        });
      });
  };

  syncWorkspaces = () => {
    this.props.syncWorkSpaces(() => {});
  };

  render() {
    const { loaded, paymentHistoryPayload } = this.state;

    return (
      <StyledSettingsBaseDiv>
        {loaded ? (
          <>
            <TldrSettingsBase
              boxClassName="tldr-current-plan-box"
              cardClassName="tldr-current-plan-base"
            >
              <TldrCurrentPlan />
            </TldrSettingsBase>

            <TldrSettingsBase
              boxClassName="tldr-current-plan-box"
              cardClassName="payment-history-base"
            >
              {paymentHistoryPayload.length > 0 && (
                <>
                  <p className="mb-4">Payment History</p>
                  <TldrPaymentHistory data={paymentHistoryPayload} />
                </>
              )}
            </TldrSettingsBase>
          </>
        ) : (
          <ShowCenterSpinner loaded={loaded} />
        )}
      </StyledSettingsBaseDiv>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  getSubscription: () => dispatch(getSubscription()),
  fetchPaymentHistory: () => dispatch(fetchPaymentHistory()),
  syncWorkSpaces: (callback) => dispatch(syncWorkSpaces(callback)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TldrBillingAndPayment);
