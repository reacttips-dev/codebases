import { find } from 'lodash';
import { getFromCache, CACHE_KEYS } from './cache';
import { isActive } from '../../../selectors/view';
import { EditPathStrings } from '../../../utils/constants';
import { store } from '../../../store';

let webappApi: Webapp.API;
const projectSuite = 'PROJECTS';

export function get(): Webapp.API {
	if (!webappApi) {
		throw new Error('webapp-api was required before it was initialized');
	}

	return webappApi;
}

export function set(api: Webapp.API) {
	webappApi = api;
}

export function isTeamExists(teamId: number): boolean {
	return !!find(get().teams.models, (team) => team.attributes.id === teamId);
}

export function isUserExists(userId: number): boolean {
	return !!find(get().companyUsers.models, (user) => user.attributes.id === userId);
}

export function getLostReasons(): Pipedrive.LostReason[] {
	return get().userSelf.fields.getByKey('deal', 'lost_reason').options || [];
}

export function isInsightsEnabled(): boolean {
	return get().userSelf.companyFeatures.get('insights');
}

export function isForecastEnabled(): boolean {
	return get().userSelf.companyFeatures.get('forecast');
}

export function isRequiredFieldsBlockingModalFeatureEnabled(): boolean {
	return get().userSelf.companyFeatures.get('required_fields');
}

export function isViewerServiceEnabled(): boolean {
	return get().userSelf.companyFeatures.get('viewer_suite') && get().userSelf.companyFeatures.get('identity_suites');
}

export function isProjectsAlphaEnabled(): boolean {
	const isProjectsAlphaFeatureEnabled = get().userSelf.companyFeatures.get('projects_alpha');
	const isIdentitySuitesFeatureEnabled = get().userSelf.companyFeatures.get('identity_suites');
	const hasProjectsSuite = get().userSelf.attributes.suites.includes(projectSuite);

	return (
		(isProjectsAlphaFeatureEnabled && !isIdentitySuitesFeatureEnabled) ||
		(isProjectsAlphaFeatureEnabled && isIdentitySuitesFeatureEnabled && hasProjectsSuite)
	);
}

export function isFreeFormLostReasonsEnabled(): boolean {
	return get().userSelf.companyFeatures.get('free_form_lost_reasons');
}

export function isDealRottingEnabled(): boolean {
	return get().userSelf.companyFeatures.get('deal_rotting');
}

export function isLeadBoosterEnabled(): boolean {
	return get().userSelf.companyFeatures.get('leadbooster_addon');
}

export function isOnboardingFlowEnabled(): boolean {
	return get().userSelf.companyFeatures.get('onboarding_flow');
}

export function getDealLabelOptions(): Pipedrive.DealLabels {
	return getFromCache(CACHE_KEYS.LABEL_OPTIONS_BY_ID, get()) as Pipedrive.DealLabels;
}

export function changeUrl(
	pipelineId: number,
	filterType?: string | undefined,
	filterValue?: string | number | undefined,
	editMode?: string | undefined,
): void {
	const state = store && store.getState();
	const router = get().router;

	if (state && !isActive(state)) {
		return;
	}

	const editModePath = editMode ? EditPathStrings[editMode] : '';

	if (editModePath) {
		router.navigateTo(`/pipeline/${pipelineId}/${editModePath}`);

		return;
	}

	if (!filterType || !filterValue) {
		router.navigateTo(`/pipeline/${pipelineId}/`);

		return;
	}

	router.navigateTo(`/pipeline/${pipelineId}/${filterType}/${filterValue}`);
}

function getTrackingUtilities() {
	const componentLoader = get().componentLoader;
	return componentLoader.load('webapp:tracking-utilities');
}

export async function trackStageChange(deal: Pipedrive.Deal, oldDeal: Pipedrive.Deal) {
	const webappTrackingUtilities = await getTrackingUtilities();

	if (webappTrackingUtilities && webappTrackingUtilities.trackStageChange) {
		webappTrackingUtilities.trackStageChange(deal, window.location.pathname, oldDeal);
	}
}

export async function trackDealClosed(updatedDeal: Pipedrive.Deal, status: 'won' | 'lost') {
	const webappTrackingUtilities = await getTrackingUtilities();

	if (webappTrackingUtilities && webappTrackingUtilities.trackDealClosed) {
		webappTrackingUtilities.trackDealClosed(updatedDeal, window.location.pathname, status);
	}
}

export async function trackActivityMarkedAsDone(data: Record<string, unknown>) {
	const webappTrackingUtilities = await getTrackingUtilities();

	if (webappTrackingUtilities && webappTrackingUtilities.trackActivityMarkedAsDone) {
		webappTrackingUtilities.trackActivityMarkedAsDone(data);
	}
}

export async function trackPipelineChange(newPipelineId: number, oldPipelineId: number) {
	const webappTrackingUtilities = await getTrackingUtilities();

	if (webappTrackingUtilities && webappTrackingUtilities.trackPipelineChange) {
		webappTrackingUtilities.trackPipelineChange(newPipelineId, oldPipelineId);
	}
}

export function getCurrentUserId(): number {
	return get().userSelf.get('id');
}

export function getTeams(): typeof webappApi.teams {
	return get().teams;
}

export function getCurrentCompanyId(): number {
	return get().userSelf.attributes.company_id;
}

export function getDefaultCurrency(userSelf?: Webapp.UserSelf): string {
	const user = userSelf || get().userSelf;
	return user.attributes.default_currency;
}

export function isAdmin(): boolean {
	return get().userSelf.attributes.is_admin;
}

export function getUserSetting<T = boolean>(key: string): T {
	return get().userSelf.settings.get(key);
}

export function getUserSettings(): typeof webappApi.userSelf.settings {
	return get().userSelf.settings;
}

export function getComponentLoader(): Webapp.ComponentLoader {
	return get().componentLoader;
}

export function getStages(pipelineId: number): Pipedrive.Stage[] {
	return get()
		.userSelf.get('stages')
		.filter((stage: Pipedrive.Stage) => stage.pipeline_id === pipelineId && stage.active_flag);
}

export function getPdMetrics() {
	return get().pdMetrics;
}

export function getLogger() {
	return get().logger('pipeline-view');
}

export function openModal({ modal, params = {} }: { modal: string; params: Record<string, unknown> }) {
	return get().frootModals.open('webapp:modal', {
		modal,
		params,
	});
}

export function createEmptyFiltersCollection(): any {
	return get().modelCollectionFactory.getCollection('filter');
}

export function createFilterModel(filterId: number): any {
	return get().modelCollectionFactory.getModel('filter', {
		id: filterId,
	});
}

export function getActivityIconKey(key: string) {
	const activityType = find(get().userSelf.attributes.activity_types, (type) => type.key_string === key);

	return activityType && activityType.icon_key;
}

export function canDeleteDeals(): typeof webappApi.userSelf.settings {
	return get().userSelf.settings.get('can_delete_deals');
}

export function canConvertDealsToLeads(): typeof webappApi.userSelf.settings {
	return get().userSelf.settings.get('can_convert_deals_to_leads');
}

export function getUserLanguage() {
	return get().userSelf.getLanguage();
}

export function getUsers() {
	return getFromCache(CACHE_KEYS.USERS, get());
}

export function getCompanyTier() {
	return get().userSelf.get('current_company_plan').tier_code;
}

export function getDealDateFields(): Pipedrive.Field[] {
	return get()
		.userSelf.fields.get('deal')
		.filter((field: Pipedrive.Field) => field.field_type === 'date');
}

export function isRevenueForecastEnabled(): boolean {
	return get().userSelf.companyFeatures.get('revenue_forecast_feature');
}

export function getRouter(): any {
	return get().router;
}
