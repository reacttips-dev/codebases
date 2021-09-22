import {
	getCurrentUserId,
	getTeams,
	getUsers,
	isAdmin,
} from '../../api/webapp';
import { AssigneeType, Goal } from '../../types/goals';

const useGoalPermissions = () => {
	const isAdminUser = isAdmin();
	const teams = getTeams();
	const users = getUsers();
	const currentUserId = getCurrentUserId();

	const teamsWhereCurrentUserIsManager = teams.filter(
		(team: Pipedrive.Team) =>
			!!team.active_flag && team.manager_id === currentUserId,
	);

	const canOnlyViewTeamGoal = (teamGoal: Goal): boolean => {
		const teamId = teamGoal?.assignee.id;
		const currentUserIsTeamManager = teamsWhereCurrentUserIsManager.some(
			(team: Pipedrive.Team) => team.id === teamId,
		);

		return !(isAdminUser || currentUserIsTeamManager);
	};

	const canOnlyViewUserGoal = (userGoal: Goal): boolean => {
		const userId = userGoal?.assignee.id;
		const ownerId = userGoal?.owner_id;
		const currentUserIsGoalCreator = currentUserId === ownerId;
		const assignedUserIsCurrentUser = userId === currentUserId;
		const userBelongsToCurrentUserManagedTeam =
			teamsWhereCurrentUserIsManager.some((team: Pipedrive.Team) =>
				team.users?.includes(userId),
			);

		if (isAdminUser) {
			return false;
		}

		if (userBelongsToCurrentUserManagedTeam) {
			return false;
		}

		return !(currentUserIsGoalCreator && assignedUserIsCurrentUser);
	};

	const hasViewOnlyPermission = (goal: Goal): boolean => {
		const assigneeType = goal?.assignee.type;

		if (assigneeType === AssigneeType.COMPANY) {
			return !isAdminUser;
		}

		if (assigneeType === AssigneeType.TEAM) {
			return canOnlyViewTeamGoal(goal);
		}

		if (assigneeType === AssigneeType.PERSON) {
			return canOnlyViewUserGoal(goal);
		}

		return true;
	};

	const canAddTeamGoal =
		isAdminUser || !!teamsWhereCurrentUserIsManager.length;

	const canAddCompanyGoal = isAdminUser;

	const getAvailableTeamsForAddingGoal = () =>
		isAdminUser ? teams : teamsWhereCurrentUserIsManager;

	const getAvailableUsersForAddingGoal = () => {
		const getAvailableUsersForRegularUser = () => {
			const availableUsers = [currentUserId];
			const userIdsWhoCurrentUserManages: Set<number> = new Set(
				availableUsers.concat(
					...teamsWhereCurrentUserIsManager.map(
						(team: Pipedrive.Team) => team.users,
					),
				),
			);

			return users.filter((user: Pipedrive.User) =>
				userIdsWhoCurrentUserManages.has(user.id),
			);
		};

		return isAdminUser ? users : getAvailableUsersForRegularUser();
	};

	return {
		canAddTeamGoal,
		canAddCompanyGoal,
		getAvailableTeamsForAddingGoal,
		getAvailableUsersForAddingGoal,
		hasViewOnlyPermission,
	};
};

export default useGoalPermissions;
