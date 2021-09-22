import { wrapWithTryCatch } from './helpers';

const trackReportDataDownloaded = wrapWithTryCatch(
	async (params: { file_format: string; report_type: string }) => {
		(window as any).analytics &&
			(window as any).analytics.track('report_data.downloaded', {
				...params,
			});
	},
);

export default trackReportDataDownloaded;
