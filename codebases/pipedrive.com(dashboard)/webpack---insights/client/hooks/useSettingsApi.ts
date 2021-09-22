import update from 'immutability-helper';
import { useApolloClient } from '@apollo/client';
import { omit, cloneDeep } from 'lodash';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { getWidgetPositionOnDashboard } from '../utils/styleUtils';
import {
	isReportAlreadyInDashboard,
	getReportById,
	getDashboardById,
	filterReportsOutOfDashboard,
} from '../utils/helpers';
import { removeTypenames } from '../utils/responseUtils';
import {
	trackReportEdited,
	trackReportAddedToDashboard,
	trackMenuItemsReordered,
} from '../utils/metrics/report-analytics';
import { LOGGER_FACILITY } from '../utils/constants';
import {
	UPDATE_DASHBOARD_REPORTS,
	BULK_UPDATE_DASHBOARDS,
	BULK_UPDATE_REPORTS,
	GET_USER_SETTINGS,
	DELETE_REPORT,
	DELETE_REPORTS,
	CREATE_REPORT,
	UPDATE_REPORT,
	GET_SIDEBAR_SETTINGS,
	CREATE_PUBLIC_LINK,
	DELETE_PUBLIC_LINK,
	UPDATE_PUBLIC_LINK,
	GET_PUBLIC_LINKS,
	UPDATE_REPORT_COLUMNS,
} from '../api/graphql';
import useRouter from './useRouter';
import localState from '../utils/localState';
import {
	Dashboard,
	DashboardReport,
	RelatedObject,
	RelatedObjects,
	Report,
	SidemenuDashboard,
	SidemenuReport,
	SidemenuSettings,
} from '../types/apollo-query-types';
import { SidemenuGoal } from '../types/goals';
import { SharedLinkItem } from '../atoms/ShareLinkModal/SharedLink/SharedLink';
import { getGoalByReportId } from './goals/goalUtils';
import { getInheritedSharingOptions, getOwnItems } from '../utils/sharingUtils';
import { MenuItem } from '../pages/App/insightsWrapper/sideMenuUtils';
import { selectedItemVar, snackbarMessageVar } from '../api/vars/settingsApi';
import { getCachedReportById } from '../utils/localState/insightsApiState';
import { getCurrentUserId, getLogger } from '../api/webapp';
import {
	mergeReportWithUnsavedReport,
	prepareReportObject,
} from '../utils/reportObjectHelpers';

const useSettingsApi = () => {
	const translator = useTranslator();
	const currentUserId = getCurrentUserId();
	const client = useApolloClient();
	const [goTo] = useRouter();
	const { setCachedReport, getCurrentUserSettings } = localState();

	const getItemsWithUpdatedSidemenuPosition = (
		items: (SidemenuReport | SidemenuDashboard)[],
	) => {
		return items.map((item, index) => {
			return { ...item, sidemenu_position: index };
		});
	};

	const bulkUpdateSidemenuItems = async ({
		itemType,
		updatedItems,
		allItems,
	}: {
		itemType: 'reports' | 'dashboards';
		updatedItems: (SidemenuReport | SidemenuDashboard)[];
		allItems: (SidemenuReport | SidemenuDashboard)[];
	}) => {
		const mutation =
			itemType === 'reports'
				? BULK_UPDATE_REPORTS
				: BULK_UPDATE_DASHBOARDS;

		await client.mutate({
			mutation,
			variables: {
				[itemType]: getOwnItems(
					removeTypenames(updatedItems),
					currentUserId,
				),
			},
			update: (cache) => {
				const { sidebarSettings } = cache.readQuery({
					query: GET_SIDEBAR_SETTINGS,
				});

				cache.writeQuery({
					query: GET_SIDEBAR_SETTINGS,
					data: {
						sidebarSettings: update(sidebarSettings, {
							[itemType]: {
								$set: allItems,
							},
						}),
					},
				});
			},
		});
	};

	const bulkUpdateDashboardsSidemenuPosition = async (
		dashboardsInNewOrder: SidemenuDashboard[],
	) => {
		const updatedDashboards =
			getItemsWithUpdatedSidemenuPosition(dashboardsInNewOrder);

		await bulkUpdateSidemenuItems({
			itemType: 'dashboards',
			updatedItems: updatedDashboards,
			allItems: updatedDashboards,
		});

		trackMenuItemsReordered('dashboards', updatedDashboards.length);
	};

	const bulkUpdateGoalReportsSidemenuPosition = async (
		goalReportsInNewOrder: SidemenuReport[],
	) => {
		const {
			sidebarSettings: { reports },
		} = client.readQuery({
			query: GET_SIDEBAR_SETTINGS,
		});
		const nonGoalReports = reports.filter(
			(report: SidemenuReport) => !report.is_goals_report,
		);
		const updatedGoalReports = getItemsWithUpdatedSidemenuPosition(
			goalReportsInNewOrder,
		);

		await bulkUpdateSidemenuItems({
			itemType: 'reports',
			updatedItems: updatedGoalReports,
			allItems: [...nonGoalReports, ...updatedGoalReports],
		});

		trackMenuItemsReordered('goals', updatedGoalReports.length);
	};

	const bulkUpdateNonGoalReportsSidemenuPosition = async (
		nonGoalReportsInNewOrder: SidemenuReport[],
	) => {
		const {
			sidebarSettings: { reports },
		} = client.readQuery({
			query: GET_SIDEBAR_SETTINGS,
		});
		const updatedNonGoalReports = getItemsWithUpdatedSidemenuPosition(
			nonGoalReportsInNewOrder,
		);
		const goalReports = reports.filter(
			(report: SidemenuReport) => report.is_goals_report,
		);

		await bulkUpdateSidemenuItems({
			itemType: 'reports',
			updatedItems: updatedNonGoalReports,
			allItems: [...updatedNonGoalReports, ...goalReports],
		});

		trackMenuItemsReordered('reports', updatedNonGoalReports.length);
	};

	return {
		addReportToDashboard: async (
			dashboardId: string,
			reportId: string,
			source: string = null,
		) => {
			const { dashboards, reports } = getCurrentUserSettings();
			const currentDashboard = getDashboardById(dashboardId, dashboards);

			// If report is already within dashboard, do not add second time
			if (!isReportAlreadyInDashboard(currentDashboard, reportId)) {
				const report = getReportById(reportId, reports);
				const newReport = {
					id: reportId,
					position: getWidgetPositionOnDashboard(report.chart_type),
				};

				await client.mutate({
					mutation: UPDATE_DASHBOARD_REPORTS,
					variables: {
						id: dashboardId,
						reports: update(currentDashboard.reports, {
							$apply: (reportsArray: DashboardReport[]) => {
								const oldReports = reportsArray.map(
									(reportItem) =>
										omit(reportItem, ['__typename']),
								);

								return [newReport].concat(oldReports);
							},
						}),
					},
					update: (cache) => {
						const { currentUserSettings, commonSettings } =
							cache.readQuery({
								query: GET_USER_SETTINGS,
							});

						cache.writeQuery({
							query: GET_USER_SETTINGS,
							data: {
								currentUserSettings: update(
									currentUserSettings,
									{
										reports: {
											$apply: (reports: Report[]) => {
												return reports.map((report) => {
													if (
														report.id === reportId
													) {
														return {
															...report,
															shared_with:
																getInheritedSharingOptions(
																	report,
																	currentUserSettings.dashboards,
																),
														};
													}

													return report;
												});
											},
										},
									},
								),
								commonSettings,
							},
						});
					},
				});

				const addToDashboardMessage = report.is_goals_report
					? translator.pgettext(
							'[Goal name] goal added to dashboard.',
							'%s goal added to dashboard.',
							getGoalByReportId(reportId).name,
					  )
					: translator.pgettext(
							'[Report name] report added to dashboard.',
							'%s report added to dashboard.',
							report.name,
					  );

				snackbarMessageVar(addToDashboardMessage);

				if (source) {
					trackReportAddedToDashboard({
						reportId,
						dashboard: currentDashboard,
						source,
						dashboards,
					});
				}
			}
		},
		changeOrderWithinList: async (
			sidemenuSectionType: keyof SidemenuSettings,
			menuItems: MenuItem[],
		) => {
			if (sidemenuSectionType === 'goals') {
				const goalReports = (menuItems as SidemenuGoal[]).map(
					(item) => item.report,
				);

				bulkUpdateGoalReportsSidemenuPosition(goalReports);
			}

			if (sidemenuSectionType === 'reports') {
				bulkUpdateNonGoalReportsSidemenuPosition(
					menuItems as SidemenuReport[],
				);
			}

			if (sidemenuSectionType === 'dashboards') {
				bulkUpdateDashboardsSidemenuPosition(
					menuItems as SidemenuDashboard[],
				);
			}
		},
		deleteReports: async (
			reportIds: string[],
			dashboardsList: Dashboard[],
		) => {
			const filteredDashboards = update(dashboardsList, {
				$apply: (dashboards: Dashboard[]) => {
					return dashboards.map((dashboard) => {
						const { id, reports } = dashboard;
						const filteredReports = reports.filter(
							(dashboardreport) => {
								return !reportIds.includes(dashboardreport.id);
							},
						);

						return {
							id,
							reports: removeTypenames(filteredReports),
						};
					});
				},
			});

			await client.mutate({
				mutation: BULK_UPDATE_DASHBOARDS,
				variables: {
					dashboards: filteredDashboards,
				},
				update: (cache) => {
					const { currentUserSettings, commonSettings } =
						cache.readQuery({
							query: GET_USER_SETTINGS,
						});
					cache.writeQuery({
						query: GET_USER_SETTINGS,
						data: {
							currentUserSettings: update(currentUserSettings, {
								dashboards: {
									$apply: (dashboards: Dashboard[]) => {
										return filterReportsOutOfDashboard(
											dashboards,
											reportIds,
										);
									},
								},
							}),
							commonSettings,
						},
					});
				},
			});

			await client.mutate({
				mutation: DELETE_REPORTS,
				variables: {
					ids: reportIds,
				},
				update: (cache) => {
					const { currentUserSettings, commonSettings } =
						cache.readQuery({
							query: GET_USER_SETTINGS,
						});

					cache.writeQuery({
						query: GET_USER_SETTINGS,
						data: {
							currentUserSettings: update(currentUserSettings, {
								reports: {
									$apply: (reports: Report[]) => {
										return reports.filter(
											(report) =>
												!reportIds.includes(report.id),
										);
									},
								},
							}),
							commonSettings,
						},
					});
				},
			});
		},
		deleteReport: async (reportId: string, dashboardsList: Dashboard[]) => {
			const filteredDashboards = update(dashboardsList, {
				$apply: (dashboards: Dashboard[]) => {
					return dashboards.map((dashboard) => {
						const { id, reports } = dashboard;
						const filteredReports = reports.filter(
							(dashboardreport) => {
								return dashboardreport.id !== reportId;
							},
						);

						return {
							id,
							reports: removeTypenames(filteredReports),
						};
					});
				},
			});

			await client.mutate({
				mutation: BULK_UPDATE_DASHBOARDS,
				variables: {
					dashboards: filteredDashboards,
				},
				update: (cache) => {
					const { currentUserSettings, commonSettings } =
						cache.readQuery({
							query: GET_USER_SETTINGS,
						});
					cache.writeQuery({
						query: GET_USER_SETTINGS,
						data: {
							currentUserSettings: update(currentUserSettings, {
								dashboards: {
									$apply: (dashboards: Dashboard[]) => {
										return dashboards.filter((dashboard) =>
											update(dashboard, {
												reports: {
													$apply: (
														reports: DashboardReport[],
													) => {
														return reports.filter(
															(
																dashboardReport,
															) => {
																return (
																	dashboardReport.id !==
																	reportId
																);
															},
														);
													},
												},
											}),
										);
									},
								},
							}),
							commonSettings,
						},
					});
				},
			});
			await client.mutate({
				mutation: DELETE_REPORT,
				variables: {
					id: reportId,
				},
				update: (cache) => {
					const { currentUserSettings, commonSettings } =
						cache.readQuery({
							query: GET_USER_SETTINGS,
						});

					cache.writeQuery({
						query: GET_USER_SETTINGS,
						data: {
							currentUserSettings: update(currentUserSettings, {
								reports: {
									$apply: (reports: Report[]) => {
										return reports.filter(
											(i) => i.id !== reportId,
										);
									},
								},
							}),
							commonSettings,
						},
					});
				},
			});
		},
		updateReport: async (
			reportId: string,
			updatedReportProperties: Partial<Report>,
		) => {
			const { unsavedReport } = getCachedReportById(reportId);
			const { data } = await client.mutate({
				mutation: UPDATE_REPORT,
				variables: {
					id: reportId,
					report: {
						...updatedReportProperties,
					},
				},
			});

			if (!data || !data.updateReport) {
				getLogger()?.remote(
					'error',
					'UpdateReport mutation returned nothing',
					{
						data: {
							reportId,
							...updatedReportProperties,
							unsavedReportData: unsavedReport.data,
						},
					},
					LOGGER_FACILITY,
				);
			}

			setCachedReport(reportId, {
				...updatedReportProperties,
				data: unsavedReport.data,
			});
		},
		createReport: async ({
			name,
			dataType = insightsTypes.DataType.DEALS,
			reportType = insightsTypes.ReportType.DEALS_STATS,
			data = {},
			navigate = true,
		}: {
			name: string;
			dataType?: insightsTypes.DataType;
			reportType?: insightsTypes.ReportType;
			data?: Partial<Report>;
			navigate?: boolean;
		}) => {
			const newReport = omit(data, ['id', 'name', 'shared_with']);

			return client.mutate({
				mutation: CREATE_REPORT,
				variables: {
					report: {
						is_new: true,
						data_type: dataType,
						report_type: reportType,
						...newReport,
						user_id: currentUserId,
						name,
					},
				},
				update: (cache, { data: { createReport } }) => {
					const { currentUserSettings, commonSettings } =
						cache.readQuery({
							query: GET_USER_SETTINGS,
						});

					cache.writeQuery({
						query: GET_USER_SETTINGS,
						data: {
							currentUserSettings: update(currentUserSettings, {
								reports: {
									$apply: (reports: Report[]) => {
										const availableReports = reports.filter(
											(report) => !report.is_new,
										);

										return [createReport].concat(
											availableReports,
										);
									},
								},
							}),
							commonSettings,
						},
					});

					if (navigate) {
						goTo({
							id: createReport.id,
							type: 'reports',
						});
					}
				},
			});
		},
		saveUnsavedReport: async (reportId: string) => {
			const cachedReport = getCachedReportById(reportId);
			const reportObject = mergeReportWithUnsavedReport(cachedReport);
			const reportForSaving = prepareReportObject(
				cloneDeep(reportObject),
			);

			await client.mutate({
				mutation: UPDATE_REPORT,
				variables: {
					id: reportId,
					report: {
						...reportForSaving,
					},
				},
			});

			setCachedReport(reportId, {
				...reportForSaving,
				data: cachedReport.unsavedReport.data,
				is_new: false,
				unsavedReport: {
					is_editing: false,
				},
			});

			trackReportEdited(reportId);
		},
		createPublicLink: async () => {
			const selectedItem = selectedItemVar();

			const result = await client.mutate({
				mutation: CREATE_PUBLIC_LINK,
				variables: { dashboardId: selectedItem.id },
				update: (cache, { data: { createPublicLink } }) => {
					const { publicLinks } = cache.readQuery({
						query: GET_PUBLIC_LINKS,
						variables: { dashboardId: selectedItem.id },
					});

					cache.writeQuery({
						query: GET_PUBLIC_LINKS,
						data: {
							publicLinks: {
								data: [
									...publicLinks.data,
									{
										...createPublicLink,
									},
								],
								__typename: 'PublicLinks',
							},
						},
						variables: { dashboardId: selectedItem.id },
					});
				},
			});

			return result.data.createPublicLink;
		},
		deletePublicLink: async (hash: string) => {
			const selectedItem = selectedItemVar();

			await client.mutate({
				mutation: DELETE_PUBLIC_LINK,
				variables: {
					id: hash,
				},
				update: (cache) => {
					const { publicLinks } = cache.readQuery({
						query: GET_PUBLIC_LINKS,
						variables: { dashboardId: selectedItem.id },
					});

					cache.writeQuery({
						query: GET_PUBLIC_LINKS,
						data: {
							publicLinks: {
								data: publicLinks.data.filter(
									(link: SharedLinkItem) => link.id !== hash,
								),
								__typename: publicLinks.__typename,
							},
						},
						variables: { dashboardId: selectedItem.id },
					});
				},
			});
		},
		updatePublicLink: async (
			id: string,
			publicLink: Partial<SharedLinkItem>,
		) => {
			return client.mutate({
				mutation: UPDATE_PUBLIC_LINK,
				variables: {
					id,
					publicLink,
				},
			});
		},
		updateReportColumns: async (reportId: string, columns: string[]) => {
			await client.mutate({
				mutation: UPDATE_REPORT_COLUMNS,
				variables: {
					id: reportId,
					columns: [...columns],
				},
			});
		},
		addNewRelatedObjects: (
			relatedObjectType: keyof RelatedObjects,
			newObjects: RelatedObject[],
		) => {
			const { currentUserSettings, commonSettings } = client.readQuery({
				query: GET_USER_SETTINGS,
			});

			let currentRelatedObjects =
				currentUserSettings?.relatedObjects ?? {};

			if (Object.keys(currentRelatedObjects).length < 4) {
				const relatedObjectsBase: RelatedObjects = {
					organizations: [],
					persons: [],
					deals: [],
					products: [],
				};

				currentRelatedObjects = {
					...relatedObjectsBase,
					...currentRelatedObjects,
				};
			}

			const objectsOfType = currentRelatedObjects[relatedObjectType];
			const newRelatedObjects = {
				...currentRelatedObjects,
				[relatedObjectType]: objectsOfType.concat(newObjects),
			};

			client.writeQuery({
				query: GET_USER_SETTINGS,
				data: {
					currentUserSettings: {
						...currentUserSettings,
						relatedObjects: newRelatedObjects,
					},
					commonSettings,
				},
			});
		},
	};
};

export default useSettingsApi;
