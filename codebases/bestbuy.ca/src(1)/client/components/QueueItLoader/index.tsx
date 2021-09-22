import * as React from "react";
import Helmet from "react-helmet";

const QueueItLoader = () => {
    return (
        <Helmet>
            <script type="text/javascript" src="//static.queue-it.net/script/queueclient.min.js"></script>
            <script
                data-queueit-c="bestbuycanada"
                type="text/javascript"
                src="//static.queue-it.net/script/queueconfigloader.min.js">
            </script>
        </Helmet>
    );
};

export default QueueItLoader;
