/**
 * Created by liorb on 5/18/17.
 */
import components from "../components/React/sw-react/SwComponents";
import { ReactHighcharts, ReactHighmaps } from "libraries/reactHighcharts";

import swLog from "@similarweb/sw-log";

function SWReactRootComponent(component, rootStatelessName?: string) {
    let displayName = rootStatelessName || component.toString().match(/^function\s*([^\s(]+)/)[1];
    if (!displayName) {
        swLog.warn("You must supply a class or function with displayName property");
    } else {
        components[displayName] = component;
    }
}

components["ReactHighcharts"] = ReactHighcharts;
components["ReactHighmaps"] = ReactHighmaps;

export default SWReactRootComponent;
