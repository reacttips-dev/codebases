import { ImportJob } from './types';

type CreateWordPressImportJobParams = {
  webStationId: string;
};

export type CreateWordPressImportJobResponse = ImportJob;

export async function createWordPressImportJob({
  webStationId,
}: CreateWordPressImportJobParams): Promise<CreateWordPressImportJobResponse> {
  try {
    const response = await fetch(`/api/proxy/v3/wordpress/import_job`, {
      method: 'POST',
      headers: new Headers({ 'Content-type': 'application/json' }),
      body: JSON.stringify({ stationId: webStationId }),
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('Unable to create WordPress import job');
  } catch (err) {
    throw new Error(err.message);
  }
}
