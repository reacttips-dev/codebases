import React, { useState } from "react";
import PropTypes from "prop-types";

import { StyledPartnerCard } from "../../_components/styled/partners/stylesPartners";
import {
  StyledListGroupItem,
  StyledButton,
} from "../../_components/styled/styles";
import {
  GOOGLE_CLIENT_ID,
  GENERIC_APP_CONNECT,
  DOMAIN_NAME,
  GOOGLE_AUTH_URL,
} from "../../_actions/endpoints";
import Axios from "axios";
import { connect } from "react-redux";
import { showToast } from "../../_actions/toastActions";
import { Spinner } from "react-bootstrap";
import { ReactComponent as GoogleSheetsIcon } from "../../assets/icons/google-sheets.svg";
import { useOauth2Login } from "../../_utils/hooks";
import { analyticsTrackEvent } from "../../_utils/common";

const APP_ID = "google_sheets";

function GoogleConnectApp(props) {
  const [connectLoading, setConnectLoading] = useState(false);

  const {
    isGoogleConnected,
    handleDisconnect,
    connectedPartnerData: { extra_data = {} } = {},
    connectedPartnerData,
  } = props;

  const SCOPES = [
    "profile",
    "email",
    "https://www.googleapis.com/auth/drive.metadata.readonly",
    "https://www.googleapis.com/auth/spreadsheets",
  ];

  const onSuccessConnect = (authRes) => {
    let errorInScopes = false;
    const permittedScopes = authRes.scope ? authRes.scope.split(" ") : [];
    SCOPES.forEach((scope) => {
      if (!permittedScopes.includes(scope)) {
        errorInScopes = true;
      }
    });
    if (errorInScopes) {
      props.showToast({
        heading: "Google connect",
        message:
          "Insufficient Permissions,Please allow us to read speardsheet data and drive data.",
        type: "error",
      });
    } else if (authRes) {
      setConnectLoading(true);
      Axios.post(GENERIC_APP_CONNECT, {
        code: authRes.code,
        app_id: APP_ID,
        callback_url: DOMAIN_NAME,
        client_type: "oauth2",
      }).then((res) => {
        setConnectLoading(false);
        props.showToast({
          heading: "Google connect",
          message: "Google drive connected successfully",
          type: "success",
        });
        props.getPartners();

        analyticsTrackEvent("connected", {
          app: "google",
        });
      });
    }
  };

  const { requestSignIn, loading } = useOauth2Login({
    id: "google-sheets-app",
    authorizationUrl: GOOGLE_AUTH_URL,
    clientId: GOOGLE_CLIENT_ID,
    redirectUri: DOMAIN_NAME,
    responseType: "code",
    onSuccess: onSuccessConnect,
    onFailure: (res) => {},
    scope: SCOPES.join(" "),
    extraQueryParams: {
      include_granted_scopes: false,
      access_type: "offline",
      prompt: "consent select_account",
    },
  });

  return (
    <StyledListGroupItem>
      <StyledPartnerCard>
        <GoogleSheetsIcon className="partner-logo"></GoogleSheetsIcon>
        <div className="partner">
          <div className="title">Google Sheets Connector</div>
          <div className="desc">
            Connect sheets to manage the projects.
            {isGoogleConnected && extra_data && (
              <p>
                Connected Account: <strong>{extra_data.email}</strong>
              </p>
            )}
          </div>
        </div>
      </StyledPartnerCard>
      <StyledButton
        className="mt-2"
        onClick={(e) => {
          e.stopPropagation();
          if (isGoogleConnected) {
            handleDisconnect(connectedPartnerData);
          } else {
            requestSignIn();
          }
        }}
        disabled={connectLoading || loading}
      >
        {connectLoading || loading ? (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        ) : isGoogleConnected ? (
          "Disconnect"
        ) : (
          "Connect to Google"
        )}
      </StyledButton>
    </StyledListGroupItem>
  );
}

GoogleConnectApp.propTypes = {
  isGoogleConnected: PropTypes.bool,
  connectedPartnerData: PropTypes.object,
  handleDisconnect: PropTypes.func.isRequired,
  getPartners: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
});

export default connect(mapStateToProps, { showToast })(GoogleConnectApp);
