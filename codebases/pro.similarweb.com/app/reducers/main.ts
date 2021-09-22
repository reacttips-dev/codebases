import segmentsModule from "reducers/_reducers/segmentsModuleReducer";
import segmentsWizardModule from "reducers/_reducers/SegmentsWizardModuleReducer";
import { WebsiteAnalysisFilters } from "reducers/_reducers/WebsiteAnalysisFilterReducer";
import * as Redux from "redux";
import { helpWidget } from "../help-widget/store/reducers/main";
import { commonWorkspace } from "../pages/workspace/common/reducers/common_workspace_reducer";
import { legacySalesWorkspace } from "../pages/workspace/common/reducers/COPY_common_workspace_reducer";
import { cig } from "../services/CIGService";
import common from "./_reducers/commonReducer";
import { contactUsModal } from "./_reducers/contactUsModalReducer";
import conversionModule from "./_reducers/ConversionModuleReducer";
import { customDashboard } from "./_reducers/customDashboard";
import educationBar from "./_reducers/educationBarReducer";
import impersonation from "./_reducers/impersonateReducer";
import { keywordGeneratorToolReducer as keywordGeneratorTool } from "./_reducers/keywordGeneratorToolReducer";
import layout from "./_reducers/layoutReducer";
import leadGenerator from "./_reducers/leadGeneratorReducer";
import leadingFolderPage from "./_reducers/LeadingFolderReducer";
import marketingWorkspace from "./_reducers/marketingWorkspaceReducer";
import popularPages from "./_reducers/popularPagesReducer";
import routing from "./_reducers/routingReducer";
import { tableSelection } from "./_reducers/tableSelection.reducer";
import ui from "./_reducers/ui";
import universalSearch from "./_reducers/universalSearchReducer";
import { unlockModal } from "./_reducers/unlockModalReducer";
import userData from "./_reducers/userData/userDataReducer";
import secondaryBar from "./_reducers/SecondaryBarReducer";
import salesWorkspace from "pages/workspace/sales/store/reducer";
import primaryNavOverride from "./_reducers/primaryNavOverrideReducer";
import salesIntelligenceReducer from "../pages/sales-intelligence/store/reducer";

const { combineReducers } = Redux;
export const main = combineReducers({
    tableSelection,
    common,
    popularPages,
    customDashboard,
    educationBar,
    userData,
    routing,
    layout,
    ui,
    impersonation,
    leadingFolderPage,
    leadGenerator,
    universalSearch,
    marketingWorkspace,
    cig,
    unlockModal,
    keywordGeneratorTool,
    contactUsModal,
    commonWorkspace,
    // [InvestorsSeparation] Will be removed soon.
    legacySalesWorkspace,
    salesWorkspace,
    conversionModule,
    segmentsWizardModule,
    helpWidget,
    segmentsModule,
    WebsiteAnalysisFilters,
    secondaryBar,
    primaryNavOverride,
    salesIntelligence: salesIntelligenceReducer,
});
