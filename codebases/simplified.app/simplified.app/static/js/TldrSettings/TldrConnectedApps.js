import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { v4 } from "uuid";
import { StyledSettingsBaseDiv } from "../_components/styled/settings/stylesSettings";
import {
  StyledPartnerCard,
  StyledModal,
  StyledModalBody,
  StyledModalTitle,
  StyledModalHeader,
  StyledModalFooter,
} from "../_components/styled/partners/stylesPartners";
import {
  StyledButton,
  StyledListGroupItem,
  StyledListGroup,
  StyledLoginFormField,
} from "../_components/styled/styles";
import TldrSettingsBase from "./TldrSettingsBase";
import TldrCollpasibleSectionSettings from "../_components/settings/TldrCollpasibleSectionSettings";
import { ErrorMessage, Form, Formik } from "formik";
import { Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { CONNECTED_APPS, SHOPIFY_AUTH_URL } from "../_actions/endpoints";
import Format from "string-format";
import Axios from "axios";
import { TldrBasicConfirmationModal } from "../_components/common/statelessView";
import GoogleSheetsConnectApp from "./TldrConnectedApps/GoogleSheetsConnectApp";
import GoogleDriveConnectApp from "./TldrConnectedApps/GoogleDriveConnectApp";
import { showToast } from "../_actions/toastActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShopify } from "@fortawesome/free-brands-svg-icons";
import { analyticsTrackEvent } from "../_utils/common";

const ShopifyModalDialog = ({ parentProps, handleClose, signal }) => (
  <Formik
    initialValues={{ name: "" }}
    validate={(values) => {
      const errors = {};
      if (!values.name) {
        errors.name = "Please enter valid name.";
      }
      return errors;
    }}
    onSubmit={(values, { setSubmitting, setErrors }) => {
      const nonce = v4();
      localStorage.setItem("nonce", nonce);
      let url = Format(SHOPIFY_AUTH_URL, values["name"], nonce);
      window.open(url, "_self");
      analyticsTrackEvent("connected", {
        app: "Shopify",
      });
    }}
  >
    {({ isSubmitting }) => (
      <Form>
        <StyledModalHeader>
          <StyledModalTitle>
            {isSubmitting
              ? "Connecting it to your store."
              : "Connect to Shopify Store"}
          </StyledModalTitle>
        </StyledModalHeader>
        <hr className="modal-hr" />
        <StyledModalBody>
          <div>
            {isSubmitting
              ? "Hang in tight, connecting to your store."
              : "Enter your store username to connect."}
          </div>

          <div className="input-group mt-2">
            <StyledLoginFormField
              className="input-group"
              type="text"
              name="name"
              placeholder="Hint: Enter just Shopify username."
            />
          </div>
          <ErrorMessage name="name" component="div" className="error" />
        </StyledModalBody>
        <hr className="modal-hr" />

        <StyledModalFooter>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            variant="outline-warning"
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="btn btn-warning tldr-login-btn"
            disabled={isSubmitting}
          >
            {!isSubmitting ? (
              "Save now"
            ) : (
              <>
                <Spinner
                  variant="dark"
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              </>
            )}
          </Button>
        </StyledModalFooter>
      </Form>
    )}
  </Formik>
);

function TldrConnectedApps(props) {
  let signal = axios.CancelToken.source();
  const [shopifyModal, showShoifyModal] = useState(false);
  const [partnersLoading, setpartnersLoading] = useState(false);
  const [partners, setPartners] = useState([]);
  const [warning, showWarning] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [deleteConfirmPartner, setdeleteConfirmPartner] = useState();
  // TODO: Make this more moduler rather then having if else ladder
  let shopifyConnected = partners.find(
    (account) => account.app_id === "shopify_app"
  );
  let googleSheetsConnected = partners.find(
    (account) => account.app_id === "google_sheets"
  );
  let googleDriveConnected = partners.find(
    (account) => account.app_id === "google_drive"
  );
  const handleClose = () => showShoifyModal(false);
  const handleShow = () => {
    showShoifyModal(true);
  };
  const handleDisconnect = (data) => {
    showWarning(true);
    setdeleteConfirmPartner(data);
  };
  const hideWarningDialog = () => showWarning(false);

  function getPartners() {
    setpartnersLoading(true);
    axios
      .get(CONNECTED_APPS)
      .then((response) => {
        setpartnersLoading(false);
        setPartners(response.data);
      })
      .catch((err) => {
        setpartnersLoading(false);
      });
  }

  useEffect(() => {
    getPartners();
    return () => {};
  }, []);

  function disconnectPartner() {
    Axios.delete(
      Format("{0}/{1}", CONNECTED_APPS, deleteConfirmPartner.id)
    ).then(
      (response) => {
        setInProgress(false);
        setdeleteConfirmPartner(null);
        hideWarningDialog();
        getPartners();
        props.showToast({
          message: "App disconnected successfully",
          type: "danger",
          header: "Disconnected",
        });
      },
      (error) => {
        setInProgress(false);
      }
    );
  }

  return (
    <>
      <StyledSettingsBaseDiv>
        {!partnersLoading ? (
          <TldrSettingsBase>
            <TldrCollpasibleSectionSettings
              title="Connected Apps"
              collapse={false}
            >
              <StyledListGroup className="mt-2">
                <StyledListGroupItem>
                  <StyledPartnerCard>
                    <FontAwesomeIcon
                      className="partner-logo"
                      icon={faShopify}
                    ></FontAwesomeIcon>
                    <div className="partner">
                      <div className="title">Shopify</div>
                      <div className="desc">
                        Import product to build marketing assets
                      </div>
                    </div>
                  </StyledPartnerCard>
                  <StyledButton
                    className="mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (shopifyConnected) {
                        handleDisconnect(shopifyConnected);
                      } else {
                        handleShow();
                      }
                    }}
                  >
                    {shopifyConnected ? "Disconnect" : "Connect to Shopify"}
                  </StyledButton>
                </StyledListGroupItem>

                <GoogleSheetsConnectApp
                  getPartners={getPartners}
                  isGoogleConnected={!!googleSheetsConnected}
                  connectedPartnerData={googleSheetsConnected}
                  handleDisconnect={handleDisconnect}
                ></GoogleSheetsConnectApp>
                <GoogleDriveConnectApp
                  getPartners={getPartners}
                  isGoogleConnected={!!googleDriveConnected}
                  connectedPartnerData={googleDriveConnected}
                  handleDisconnect={handleDisconnect}
                ></GoogleDriveConnectApp>
              </StyledListGroup>
            </TldrCollpasibleSectionSettings>
          </TldrSettingsBase>
        ) : (
          <></>
        )}
      </StyledSettingsBaseDiv>
      <StyledModal
        show={shopifyModal}
        backdrop="static"
        size="sm"
        onHide={handleClose}
        centered
      >
        <ShopifyModalDialog
          parentProps={props}
          handleClose={handleClose}
          signal={signal}
        ></ShopifyModalDialog>
      </StyledModal>

      <TldrBasicConfirmationModal
        show={warning}
        title={"Disconnect"}
        inprogress={inProgress}
        message={"Are you sure you want to disconnect?"}
        onHide={hideWarningDialog}
        onYes={() => {
          setInProgress(true);
          disconnectPartner(deleteConfirmPartner);
        }}
      ></TldrBasicConfirmationModal>
    </>
  );
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {
  showToast,
};

export default connect(mapStateToProps, mapDispatchToProps)(TldrConnectedApps);
