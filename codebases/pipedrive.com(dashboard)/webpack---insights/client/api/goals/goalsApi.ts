import { gql } from '@apollo/client';

export const GOAL_PROPS_FRAGMENT = gql`
	fragment GoalProps on Goal {
		id
		name
		owner_id
		type
		assignee
		duration
		is_active
		expected_outcome
		interval
		report_ids
	}
`;

export const GET_GOALS = gql`
	query Goals($path: String!) {
		goals @rest(type: "Goal", path: $path) {
			...GoalProps
		}
	}
	${GOAL_PROPS_FRAGMENT}
`;

export const ADD_GOAL = gql`
	mutation AddGoal($path: String!, $payload: GoalParamsInput!) {
		addGoal(payload: $payload)
			@rest(
				type: "Goal"
				path: $path
				method: "POST"
				bodyKey: "payload"
			) {
			...GoalProps
		}
	}
	${GOAL_PROPS_FRAGMENT}
`;

export const UPDATE_GOAL = gql`
	mutation UpdateGoal($path: String!, $payload: GoalParamsInput!) {
		updateGoal(payload: $payload)
			@rest(
				type: "Goal"
				path: $path
				method: "PUT"
				bodyKey: "payload"
			) {
			...GoalProps
		}
	}
	${GOAL_PROPS_FRAGMENT}
`;

export const DELETE_GOAL = gql`
	mutation DeleteGoal($path: String!) {
		deleteGoal @rest(type: "Goal", path: $path, method: "DELETE")
	}
`;
