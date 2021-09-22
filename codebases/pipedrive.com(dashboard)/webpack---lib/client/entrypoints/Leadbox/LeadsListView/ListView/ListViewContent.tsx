import React, { useContext, useMemo, useRef, useState, Ref, forwardRef, useCallback, useEffect } from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { createRefetchContainer, graphql, RelayPaginationProp, RelayRefetchProp } from '@pipedrive/relay';
import { List, ListProps, RowSelectionStatus, useListViewContext } from '@pipedrive/list-view';
import { WebappApiContext } from 'Components/WebappApiContext';
import { useSetLeadDetailUrl } from 'Hooks/useSetLeadDetailUrl';
import { LIST_PAGE_SIZE } from 'Relay/constants';
import { useUnselectLead } from 'Hooks/useUnselectLead';
import { FieldComponent } from 'Leadbox/LeadsListView/fields/FieldComponent';
import { ListViewRef } from 'Types/types';
import { ConfirmDialog } from 'Components/ConfirmDialog/ConfirmDialog';
import { getLeadsListLimitWarningConfig } from 'Leadbox/LeadsListView/getLeadsListLimitWarningConfig';
import { Icon } from '@pipedrive/convention-ui-react';
import { closeLeadsExportCoachmark } from 'Leadbox/ActionBar/MoreActions/LeadsExportCoachmarkWrapper';
import { useListContext } from 'Leadbox/LeadsListView/context/ListProvider';
import { SortedColumn } from 'Leadbox/LeadsListView/context/useSortColumns';
import { LEADS_BULK_MAX_LIMIT } from 'Leadbox/LeadsListView/context/useSelectedRows';
import { useLeadFilterStatus } from 'Hooks/useLeadFilterStatus';

import type { ListViewContent_rows } from './__generated__/ListViewContent_rows.graphql';
import { LeadCustomViewModal, LeadCustomViewModalPortal } from './LeadCustomViewModal';
import type { ListViewContent_customView } from './__generated__/ListViewContent_customView.graphql';
import { closeCustomColumnsCoachmark, CustomColumnsCoachmark } from './CustomColumnsCoachmark';
import { useRowActions } from './useRowActions';
import * as S from './ListViewContent.styles';

type Props = {
	paginationHandler: RelayPaginationProp;
	customView?: ListViewContent_customView | null;
	rows: ListViewContent_rows;
	relay: RelayRefetchProp;
};

const ListViewContentWithoutData = ({ rows, paginationHandler, customView, relay }: Props, ref: Ref<ListViewRef>) => {
	const { actions } = useListViewContext();
	const [showCustomView, setShowCustomView] = useState(false);
	const { relayList, selectedRows } = useListContext();
	const leadCustomViewRef = useRef<HTMLDivElement>(null);
	const { router, trackUsage } = useContext(WebappApiContext);
	const translator = useTranslator();
	const setLeadDetailUrl = useSetLeadDetailUrl(router);
	const unselectLead = useUnselectLead();
	const leadFilterStatus = useLeadFilterStatus();

	const { getRowActions, isConfirmVisible, closeConfirmDialog, onDeleteConfirm } = useRowActions({
		rows,
		customViewId: customView?.id,
	});
	const onRowClick = useCallback(
		(payload) => {
			const uuid = rows[payload.index].lead?.uuid;
			uuid && setLeadDetailUrl(uuid);
		},
		[rows, setLeadDetailUrl],
	);

	const options = useMemo<ListProps['options']>(
		() => ({
			fullWidth: true,
			tableType: 'LEADS' as const,
			infiniteScroll: {
				threshold: 165, // 5 rows-ish
			},
			customViewId: customView?.internalID ? parseInt(customView?.internalID, 10) : undefined,
			rowSelection: {
				limit: LEADS_BULK_MAX_LIMIT,
			},
		}),
		[customView?.internalID],
	);
	const infiniteScrollHandlers = useMemo(
		() => ({
			loadMore: () => {
				return new Promise<void>((resolve) => {
					paginationHandler.loadMore(LIST_PAGE_SIZE, () => resolve());
				});
			},
			hasMore: paginationHandler.hasMore,
		}),
		[paginationHandler],
	);

	const toggleCustomViewModal = (status?: boolean) => setShowCustomView((prevState) => status ?? !prevState);

	const columns = useMemo(() => {
		const headers = customView?.fields ?? [];

		return headers.map((header) => {
			const entityType = header.fieldDefinition?.entityType;
			const defaultWidth = entityType === 'lead' && header.fieldDefinition?.key === 'title' ? 200 : 160;

			return {
				accessor: header.id,
				customViewField: {
					entity: entityType ?? '',
					key: header.fieldDefinition?.key ?? '',
				},
				style: {
					minWidth: '70px',
					width: `${header?.width ?? defaultWidth}px`,
				},
				Header: (
					<S.ListHeaderWrapper>
						{entityType && entityType !== 'lead' ? (
							<S.IconWrapper>
								<Icon icon={entityType} size="s" />
							</S.IconWrapper>
						) : null}
						<S.ListHeader>{header.fieldDefinition?.name || ''}</S.ListHeader>
					</S.ListHeaderWrapper>
				),
			};
		});
	}, [customView?.fields]);

	const tableRows = useMemo(() => {
		return (
			rows.flatMap((row) => {
				const cells = row.cells;

				if (!cells) {
					return [];
				}

				const rowCells = cells?.reduce<Record<string, React.ReactNode>>((data, cell, index) => {
					if (cell && cell.field && cell.customViewField?.id) {
						const headerId = cell.customViewField.id;

						data[headerId] = <FieldComponent field={cell.field} lead={row.lead} /> || '';
					}

					return data;
				}, {});

				// use lead id for compatibility with bulk actions panel
				return [{ data: rowCells, id: row?.lead?.id ?? '' }];
			}) ?? []
		);
	}, [rows]);

	useEffect(() => {
		const unseenRows = rows.filter((row) => !row.lead?.wasSeen).map((row) => row.lead?.id as string);

		actions?.replaceUnseenRows(unseenRows);
	}, [actions, rows]);

	const subpage = leadFilterStatus === 'ALL' ? 'inbox' : 'archived';

	return (
		<>
			<LeadCustomViewModalPortal ref={leadCustomViewRef} />
			<CustomColumnsCoachmark />
			<List
				ref={ref as any /* eslint-disable-line @typescript-eslint/no-explicit-any */}
				rows={tableRows}
				columns={columns}
				options={options}
				components={{
					HeadCorner() {
						return showCustomView ? (
							<LeadCustomViewModal
								customView={customView}
								portalTo={leadCustomViewRef}
								toggleModal={toggleCustomViewModal}
							/>
						) : null;
					},
				}}
				state={{
					headMessages: selectedRows.isAboveTheLimit ? [getLeadsListLimitWarningConfig(translator)] : [],
				}}
				tracking={{
					trackUsage,
					view: 'leads_inbox',
					listViewType: 'lead',
					subpage,
				}}
				handlers={{
					onRowClick,
					onCustomViewUpdate: () => {
						relay.refetch({ id: customView?.id });
					},
					onHeadCornerClick: ({ event }) => {
						event.stopPropagation();
						closeCustomColumnsCoachmark();
						toggleCustomViewModal();
					},
					onColumnSort: async (payload) => {
						const sort = Object.entries(payload).reduce((acc, [key, sorting]) => {
							const getDirection = () => {
								if (sorting === 'asc') {
									return 'ASC' as const;
								}
								if (sorting === 'desc') {
									return 'DESC' as const;
								}
							};

							const direction = getDirection();

							if (!direction) {
								return acc;
							}

							const obj = { id: key, direction };

							return [...acc, obj];
						}, [] as SortedColumn[]);

						await relay.refetch({ id: customView?.id });
						await relayList?.refetch({ sort });
					},
					onRowSelection: (rowSelection) => {
						closeCustomColumnsCoachmark();
						closeLeadsExportCoachmark();
						unselectLead();
						switch (rowSelection.status) {
							case RowSelectionStatus.NONE:
								selectedRows.setMode('NONE');
								break;
							case RowSelectionStatus.ALL:
								selectedRows.setMode('ALL');
								break;
							case RowSelectionStatus.PARTIAL_EXCLUDING:
								selectedRows.setMode('PARTIAL_EXCLUDING', rowSelection.ids.excluded);
								break;
							case RowSelectionStatus.PARTIAL_INCLUDING:
								selectedRows.setMode('PARTIAL_INCLUDING', rowSelection.ids.included);
								break;
							default:
								break;
						}
					},
					getRowActions,
					infiniteScroll: infiniteScrollHandlers,
				}}
			/>
			<ConfirmDialog
				text={translator.gettext('Are you sure you want to delete this lead?')}
				visible={isConfirmVisible}
				onClose={closeConfirmDialog}
				onConfirm={onDeleteConfirm}
				color="red"
				confirmButtonText={translator.gettext('Delete')}
			/>
		</>
	);
};

export const ListViewContent = createRefetchContainer(
	forwardRef(ListViewContentWithoutData),
	{
		customView: graphql`
			fragment ListViewContent_customView on CustomView {
				id
				internalID: id(opaque: false)
				fields {
					id
					width
					fieldDefinition {
						name
						entityType
						key
					}
				}
				...LeadCustomViewModal_customView
			}
		`,
		rows: graphql`
			fragment ListViewContent_rows on LeadTableRow @relay(plural: true) {
				uuid: id(opaque: false)
				lead {
					id
					wasSeen
					uuid: id(opaque: false)
					# isArchived is necessary as useRowActions reuse this fragment data
					# eslint-disable-next-line relay/unused-fields
					isArchived
					...FieldComponent_lead
				}
				cells {
					customViewField {
						id
					}
					field {
						...FieldComponent_field
					}
				}
			}
		`,
	},
	graphql`
		query ListViewContentCustomViewRefetchQuery($id: ID!) {
			node(id: $id) {
				## In order to keep the custom view data in sync between list-view and leadbox
				## the app queries the custom-view whenever the list-view callback is fired
				... on CustomView {
					id
					fields {
						__typename
					}
					...ListViewContent_customView
				}
			}
		}
	`,
);
