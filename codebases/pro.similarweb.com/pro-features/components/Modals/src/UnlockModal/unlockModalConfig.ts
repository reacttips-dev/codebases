import { i18nFilter } from "filters/ngFilters";
import { AssetsService } from "services/AssetsService";
import {
    AppAnalysisUnlockModalConfig,
    IAppAnalysisUnlockModalConfigTypes,
} from "./configs/appAnalysisUnlockModalConfig";
import {
    AppCategoryAnalysisUnlockModalConfig,
    IACAUnlockModalTypes,
} from "./configs/appCategoryAnalysisUnlockModalConfig";
import {
    AppKeywordsAnalysisUnlockModalConfig,
    IAKAUnlockModalTypes,
} from "./configs/appKeywordsAnalysisUnlockModalConfig";
import {
    CommonModalConfig,
    ICommonUnlockModalConfigTypes,
} from "./configs/commonUnlockModalConfig";
import {
    ConversionUnlockModalConfig,
    IConversionUnlockModalTypes,
} from "./configs/conversionUnlockModalConfig";
import {
    ILeadGeneratorUnlockModalTypes,
    LeadGeneratorUnlockModalConfig,
} from "./configs/leadGeneratorUnlockModalConfig";
import { IToolsModalConfigTypes, ToolsUnlockModalConfig } from "./configs/toolsUnlockModalConfig";
import { ITrackModalConfigTypes, TrackUnlockModalConfig } from "./configs/trackUnlockModalConfig";
import {
    IWCAUnlockModalTypes,
    WebCategoryAnalysisUnlockModalConfig,
} from "./configs/webCategoryAnalysisUnlockModalConfig";
import {
    IWKAUnlockModalTypes,
    WebKeywordsAnalysisUnlockModalConfig,
} from "./configs/webKeywordsAnalysisUnlockModalConfig";
import {
    IWebAnalysisUnlockModalTypes,
    WebsiteAnalysisUnlockModalConfig,
} from "./configs/websiteAnalysisUnlockModalConfig";
import {
    IWorkspaceModalTypes,
    WorkspaceUnlockModalConfig,
} from "./configs/workspaceUnlockModalConfig";

import {
    CustomSegmentsUnlockModalConfig,
    ICustomSegmentsUnlockModalTypes,
} from "components/Modals/src/UnlockModal/configs/customSegmentsUnlockModalConfig";
import { UnlockModalSlides } from "./UnlockModal";
import {
    createSalesUnlockModalConfig,
    SalesUnlockModalConfigType,
} from "components/Modals/src/UnlockModal/configs/salesUnlockModalConfig";

export interface IModalConfig<T extends keyof IUnlockModalConfigTypes> {
    slides: UnlockModalSlides<IUnlockModalConfigTypes[T]>;
    ctaText: string;
    label: string;
}

export type IUnlockModalConfigTypes = ICommonUnlockModalConfigTypes &
    IWCAUnlockModalTypes &
    IWebAnalysisUnlockModalTypes &
    IWKAUnlockModalTypes &
    IAppAnalysisUnlockModalConfigTypes &
    IACAUnlockModalTypes &
    IAKAUnlockModalTypes &
    ILeadGeneratorUnlockModalTypes &
    ITrackModalConfigTypes &
    IToolsModalConfigTypes &
    IConversionUnlockModalTypes &
    ICustomSegmentsUnlockModalTypes &
    IWorkspaceModalTypes &
    SalesUnlockModalConfigType;

export type IUnlockConfig = {
    [D in keyof IUnlockModalConfigTypes]: IModalConfig<D>;
};

export type UnlockModalConfigType = keyof IUnlockConfig;

const UnlockModalConfig = (): IUnlockConfig => ({
    ...CommonModalConfig(),
    ...WebsiteAnalysisUnlockModalConfig(),
    ...WebCategoryAnalysisUnlockModalConfig(),
    ...WebKeywordsAnalysisUnlockModalConfig(),
    ...AppAnalysisUnlockModalConfig(),
    ...AppCategoryAnalysisUnlockModalConfig(),
    ...AppKeywordsAnalysisUnlockModalConfig(),
    ...LeadGeneratorUnlockModalConfig(),
    ...TrackUnlockModalConfig(),
    ...ToolsUnlockModalConfig(),
    ...ConversionUnlockModalConfig(),
    ...WorkspaceUnlockModalConfig(),
    ...CustomSegmentsUnlockModalConfig(),
    ...createSalesUnlockModalConfig(i18nFilter(), AssetsService),
});
export default UnlockModalConfig;
