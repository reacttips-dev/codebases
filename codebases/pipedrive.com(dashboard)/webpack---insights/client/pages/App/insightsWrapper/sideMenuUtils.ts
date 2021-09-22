import {
	SidemenuDashboard,
	SidemenuReport,
} from '../../../types/apollo-query-types';
import { SidemenuGoal } from '../../../types/goals';
import { isPastDate } from '../../../utils/helpers';
import { getGoalByReportId } from '../../../hooks/goals/goalUtils';

export type MenuItem = SidemenuReport | SidemenuDashboard | SidemenuGoal;

export const getGoalsSidemenuItems = (
	reports: SidemenuReport[],
): SidemenuGoal[] => {
	return reports
		.filter((report) => report.is_goals_report)
		.map((report) => {
			return {
				...getGoalByReportId(report.id),
				report,
			};
		})
		.filter((item) => item.id)
		.map((item) => {
			return { ...item, is_past: isPastDate(item.duration?.end) };
		});
};
