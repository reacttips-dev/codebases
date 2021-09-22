import { ProjectModalPrefill } from '../components/Board/DealActions/MoveActionPopoverContent/ProjectOptions';
import { getComponentLoader } from '../shared/api/webapp';

export async function openAddDealModal({
	onsave = null,
	prefill = {},
	onMounted,
}: {
	onsave?: (model: Partial<Pipedrive.Deal>) => void;
	prefill?: any;
	onMounted?: () => void;
}) {
	const componentLoader = getComponentLoader();
	const modals = await componentLoader.load('froot:modals');

	modals.open('add-modals:froot', {
		type: 'deal',
		onsave,
		prefill,
		onMounted,
	});
}

interface TrackingAttributes {
	[key: string]: unknown;
}

export async function openAddProjectModal(
	prefill: ProjectModalPrefill,
	trackingAttributes: TrackingAttributes,
): Promise<void> {
	const componentLoader = getComponentLoader();
	const modals = await componentLoader.load('froot:modals');

	modals.open('add-modals:froot', {
		type: 'project',
		metricsData: {
			source: 'pipeline_view',
			...trackingAttributes,
		},
		prefill,
	});
}
