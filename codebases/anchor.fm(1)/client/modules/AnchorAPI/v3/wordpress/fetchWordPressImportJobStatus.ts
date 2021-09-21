import { ImportJob } from './types';

type FetchWordPressImportJobStatusParams = {
  jobId: number;
};

export type FetchWordPressImportJobStatusResponse = ImportJob;

export async function fetchWordPressImportJobStatus({
  jobId,
}: FetchWordPressImportJobStatusParams): Promise<
  FetchWordPressImportJobStatusResponse
> {
  try {
    const response = await fetch(
      `/api/proxy/v3/wordpress/import_job/${jobId}`,
      { method: 'GET', credentials: 'same-origin' }
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error('Unable to fetch WordPress import job status.');
  } catch (err) {
    throw new Error(err.message);
  }
}
