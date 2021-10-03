import React, { Component } from "react";
import { BrandTextLogo } from "../_components/common/statelessView";
import { Link } from "react-router-dom";
import { LOGIN } from "../_utils/routes";
import { IntercomCustomIcon } from "../_components/styled/home/statelessView";
export default class TldrBase extends Component {
  render() {
    const { showBackgroundImage, heading, subheading, wrapperClassName } =
      this.props;

    return (
      <div className={`${wrapperClassName} wrapper`}>
        {showBackgroundImage && <div className="tldr-dark-overlay" />}
        <div className="login-box">
          <div className="card login-card-body">
            <div className="card-body">
              <div className="login-logo">
                <Link to={LOGIN}>
                  <BrandTextLogo height={60} width={160} />
                </Link>
              </div>
              <div className="text-center heading">{heading}</div>
              <div className="text-center">{subheading}</div>

              {this.props.children}
            </div>
          </div>
          <div className="input-group mt-3 copyright">
            <div>Copyright © 2021 TLDR, Technologies</div>
          </div>
        </div>
        <IntercomCustomIcon />
      </div>
    );
  }
}
