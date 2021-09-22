import { gql } from '@apollo/client';

// eslint-disable-next-line import/prefer-default-export
export const GET_REPORT_SELECT_OPTIONS = gql`
	{
		dealsGroupBy: __type(name: "GroupBy") {
			fields {
				name
			}
		}
		activitiesGroupBy: __type(name: "ActivitiesGroupByFields") {
			enumValues {
				name
			}
		}
		mailsGroupBy: __type(name: "MailMessagesGroupByFields") {
			enumValues {
				name
			}
		}
		dealsMeasureBy: __type(name: "Measure") {
			enumValues {
				name
			}
		}
		activitiesMeasureBy: __type(name: "ActivitiesMeasureByFields") {
			enumValues {
				name
			}
		}
		dealsFilters: __type(name: "Filter") {
			fields {
				name
				description
				args {
					name
					type {
						name
						inputFields {
							name
							defaultValue
							type {
								inputFields {
									name
									defaultValue
								}
							}
						}
					}
				}
			}
		}
		activitiesFilters: __type(name: "ActivitiesFilterInput") {
			inputFields {
				name
				type {
					name
					inputFields {
						name
					}
				}
			}
		}
		mailsFilters: __type(name: "MailsFilterInput") {
			inputFields {
				name
				type {
					name
					inputFields {
						name
					}
				}
			}
		}
		dealsFields: deals {
			fields {
				dbName
				uiName
				fieldType
				isCustomField
				isNestedObjectField
				originalName
				filterType
				isMeasurable
				groupByType
			}
		}
		activitiesFields: __type(name: "Activity") {
			fields {
				name
			}
		}
		mailsFields: __type(name: "MailMessage") {
			fields {
				name
			}
		}
	}
`;
