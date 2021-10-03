import React from "react";
import TldrBase from "../../TldrLogin/TldrBase";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ROOT } from "../../_utils/routes";

const internalServer = (props) => {
  return (
    <TldrBase
      heading={"OMG 500"}
      subheading={
        "Oh no! We are sorry. Internal server error. Please contact the support."
      }
    >
      <div className="text-center mt-2 secondary-links">
        <Link to={ROOT}>
          <FontAwesomeIcon icon="arrow-left" className="mr-1" />
          Back to login
        </Link>
      </div>
    </TldrBase>
  );
};

export default internalServer;
