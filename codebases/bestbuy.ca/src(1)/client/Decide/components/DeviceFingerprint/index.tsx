import * as React from "react";
import Helmet from "react-helmet";

const DeviceFingerprint = () => {

    if (typeof window !== "undefined") {
        return (
            <Helmet>
                <script type="text/javascript">
                    {`
                        window.IGLOO = window.IGLOO || {
                            "bbout_element_id": "ioBlackBox",    // Populate #ioBlackBox input with device fingerprint
                            "enable_rip": true,                 // Enable Real IP protection.
                            "enable_flash": false,              // Disable flash
                            "install_flash": false,             // Don't ask user to install flash
                            "loader": {
                                "version": "general5",            // Non-experimental 5.x updates
                                "fp_static": false,
                            },
                        }
                    `}
                </script>
                <script src="/client/iovation_loader_5x.js"></script>
            </Helmet>
        );
    } else {
       return  null;
    }

};

export default DeviceFingerprint;
