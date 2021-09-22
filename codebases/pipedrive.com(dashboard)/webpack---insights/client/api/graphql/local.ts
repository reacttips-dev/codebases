import { gql } from '@apollo/client';

export const GET_CACHED_REPORT_IS_EDITING = gql`
	query GetUnsavedReport($id: ID!) {
		cachedReports(id: $id) @client {
			unsavedReport {
				is_editing
			}
		}
	}
`;

export const GET_CACHED_SOURCE_DATA_TABLE_BY_ID = gql`
	query SourceTableDataById($id: ID!) {
		sourceTableData(id: $id) @client {
			id
			columns
			data
			__typename
		}
	}
`;
