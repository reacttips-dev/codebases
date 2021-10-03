import React, { useEffect, useState } from "react";
import TldrSettingsSecondaryNavbar from "./TldrSettingsSecondaryNavbar";
import TldrMyAccount from "./TldrMyAccount";
import TldrConnectedApps from "./TldrConnectedApps";
import TldrMyWorkspace from "./TldrMyWorkspace";
import TldrBrandKit from "./TldrBrandKits/TldrBrandKit";
import { useHistory } from "react-router-dom";
import {
  MY_ACCOUNT,
  MY_WORKSPACE,
  MY_APPS,
  BRANDKIT,
  BILLING_AND_PAYMENT,
  BILLING_PLANS,
} from "../_utils/routes";
import TldrHomeBase from "../TldrApp/TldrHomeBase";
import TldrBillingAndPayment from "./TldrBillingAndPayments/TldrBillingAndPayment";
import TldrAllPlans from "./TldrBillingAndPayments/TldrAllPlans";

function Settings(props) {
  let history = useHistory();
  const [selectedTab, setSelectedTab] = useState(props.location.pathname);
  function onTabChanged(selectedTab) {
    setSelectedTab(selectedTab);
    switch (selectedTab) {
      case MY_ACCOUNT:
        history.push(MY_ACCOUNT);
        break;
      case MY_WORKSPACE:
        history.push(MY_WORKSPACE);
        break;
      case BILLING_AND_PAYMENT:
        history.push(BILLING_AND_PAYMENT);
        break;
      case BILLING_PLANS:
        history.push(BILLING_PLANS);
        break;
      case MY_APPS:
        history.push(MY_APPS);
        break;
      case BRANDKIT:
        history.push(BRANDKIT);
        break;
      default:
        history.push(MY_ACCOUNT);
        break;
    }
  }

  useEffect(() => {
    setSelectedTab(props.location.pathname);
    return () => {};
  }, [props]);

  const tabs = [
    {
      title: "My account",
      key: MY_ACCOUNT,
    },
    {
      title: "My workspace",
      key: MY_WORKSPACE,
    },
    {
      title: "Billing",
      key: BILLING_AND_PAYMENT,
    },
    {
      title: "My Connected Apps",
      key: MY_APPS,
    },
    {
      title: "Brandkit",
      key: BRANDKIT,
    },
  ];

  let selectedView;
  switch (selectedTab) {
    case MY_ACCOUNT:
      selectedView = <TldrMyAccount></TldrMyAccount>;
      break;
    case MY_WORKSPACE:
      selectedView = <TldrMyWorkspace></TldrMyWorkspace>;
      break;
    case BILLING_AND_PAYMENT:
      selectedView = <TldrBillingAndPayment></TldrBillingAndPayment>;
      break;
    case BILLING_PLANS:
      selectedView = <TldrAllPlans></TldrAllPlans>;
      break;
    case MY_APPS:
      selectedView = <TldrConnectedApps></TldrConnectedApps>;
      break;
    case BRANDKIT:
      selectedView = <TldrBrandKit></TldrBrandKit>;
      break;
    default:
      selectedView = <TldrMyAccount></TldrMyAccount>;
      break;
  }

  return (
    <TldrHomeBase>
      <TldrSettingsSecondaryNavbar
        navs={tabs}
        selectedTab={selectedTab}
        onTabChanged={onTabChanged}
        zeroTopMargin
      />

      {selectedView}
    </TldrHomeBase>
  );
}

Settings.propTypes = {};

export default Settings;
