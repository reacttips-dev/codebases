import "./exports";

// legacy imports
import "./Shared/config";
import "./Shared/utils";
import "./Shared/main";
import "./Shared/modules";

import "./Shared/Controllers";
import "./Shared/Directives";
import "./Shared/Services";
import "./Vendor";
import "./apps";
import "./Category";
import "./common";
import "./layout";
import "./TopApps";
import "./TopSites";
import "./WebsiteAnalysis";

// Angular Templates
if (process.env.NODE_ENV === "production") require("../partials/$templateCache");
